import { encoder, wakuNode } from '$lib/waku/waku.svelte';
import { type Message, MessageChannelEvent, encodeMessage, decodeMessage } from '@waku/sds';
import { getChannel } from '$lib/sds/channel.svelte';
import { messageHash } from '@waku/message-hash';

const channel = getChannel();

export function subscribe() {
	wakuNode.subscribeToFilter((message) => {
		const sdsMessage = decodeMessage(message.payload) as unknown as Message;
		channel.receiveMessage(sdsMessage);
	});
}

export async function processQueue() {
	await channel.processTasks();
}

export function startSending() {
	const randomHash = new Uint8Array(32);
	crypto.getRandomValues(randomHash);
	send(randomHash);
}

export function sweepOut() {
	channel.sweepOutgoingBuffer();
}

export async function sweepIn() {
	const missedMessages = channel.sweepIncomingBuffer();
	console.log('missedMessages', missedMessages);
	const messageHashes = missedMessages
		.filter((message) => message.retrievalHint !== undefined)
		.map((message) => message.retrievalHint!);
	console.log('messageHashes', messageHashes);
	if (messageHashes.length === 0) {
		return;
	}
	const query = wakuNode.queryStore(messageHashes);
	if (!query) {
		console.error('no query');
		return;
	}
	console.log('query', query);
	
	// Process all batches of promises from the AsyncGenerator
	for await (const promises of query) {
		// Resolve all promises in the batch
		const messages = await Promise.all(promises);
		console.log('messages', messages);
		
		// Process each message
		for (const msg of messages) {
			if (msg?.payload) {
				const sdsMessage = decodeMessage(msg.payload) as unknown as Message;
				channel.receiveMessage(sdsMessage);
			}
		}
	}
}

async function send(payload: Uint8Array): Promise<void> {
	await channel.sendMessage(payload, async (message: Message) => {
		const encodedMessage = encodeMessage(message);
		const timestamp = new Date();
		const protoMessage = await encoder.toProtoObj({
			payload: encodedMessage,
			timestamp
		});
		const hash = messageHash(encoder.pubsubTopic, protoMessage);
		const result = await wakuNode.sendWithLightPush(encodedMessage, timestamp);
		if (result.failures.length > 0) {
			console.error('error sending message', result.failures);
		}
		return {
			success: result.successes.length > 0,
			retrievalHint: hash
		};
	});
}

export const history: {
	messageId: string;
	lamportTimestamp?: number;
	event: MessageChannelEvent;
}[] = $state([]);
