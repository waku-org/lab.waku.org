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

export function sweepIn() {
	channel.sweepIncomingBuffer();
}

async function send(payload: Uint8Array): Promise<void> {
	await channel.sendMessage(payload, async (message: Message) => {
		const encodedMessage = encodeMessage(message);
		const protoMessage = await encoder.toProtoObj({
			payload: encodedMessage,
			timestamp: new Date()
		});
		const hash = messageHash(encoder.pubsubTopic, protoMessage);
		const result = await wakuNode.sendWithLightPush(encodedMessage);
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
