import { decoder, encoder, wakuNode } from '$lib/waku/waku.svelte';
import { type Message, encodeMessage, decodeMessage } from '@waku/sds';
import type { MatchParams } from './waku.svelte';
import { getOrCreateChannel } from '$lib/sds/channel.svelte';
import { Effect, Schedule, Stream, Option, Queue, Chunk, Ref } from 'effect';
import type { SubscribeResult } from '@waku/sdk';
import { messageHash } from '@waku/message-hash';
import { hash } from '$lib/utils/hash';
import { encodeBase64 } from 'effect/Encoding';
import type { MessageChannel } from '@waku/sds';
import { sweepIn, sweepOut } from '$lib/sds.svelte';

export function send(channel: MessageChannel, payload: Uint8Array) {
	return channel.sendMessage(payload, async (message: Message) => {
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
		console.log('sent message over waku', message);
		return {
			success: true,
			retrievalHint: hash
		};
	});
}

export function start(params: MatchParams) {
	console.log('starting pingpong', params);
	const { matchId } = params;
	const first = params.myPeerId.localeCompare(params.otherPeerId) < 0 ? true : false;

	let lastMessage = new Date();
	const sinkTimeout = 10_000;
	const channel = getOrCreateChannel(matchId);

	// Create a stream of the messages scheduled based on the strategy
	// we can predetermine the list of messages we expect to send
	const payloadsStream = Stream.make(
		...Array.from({ length: params.messages }, (_, i) => {
			return new TextEncoder().encode(hash(matchId + params.myPeerId + i));
		})
	);
	const skips = Array.from({ length: params.messages * 2 }, (_, i) =>
		i % 2 === 0 ? first : !first
	);
	const skipsStream = Stream.fromIterable(skips);

	const payloadsWithSkips = Effect.gen(function* () {
		const skips = yield* Stream.runCollect(skipsStream);
		let payloads = yield* Stream.runCollect(payloadsStream);
		return Chunk.map(skips, (skip): Option.Option<Uint8Array> => {
			if (skip) {
				return Option.none();
			}
			const head = Chunk.takeRight(1)(payloads);
			const result = Chunk.get(head, 0);
			return Option.match(result, {
				onNone: () => Option.none(),
				onSome: (value) => {
					payloads = Chunk.dropRight(1)(payloads);
					return Option.some(value);
				}
			});
		});
	});
	const sendEffect = (payload: Option.Option<Uint8Array>) =>
		Effect.async<void, Error>((resume) => {
			if (Option.isNone(payload)) {
				return resume(Effect.succeed(undefined));
			}
			send(channel, Option.getOrThrow(payload))
				.then((result) => resume(Effect.succeed(result)))
				.catch((error) => resume(Effect.fail(new Error(error as string))));
		});

	// Creating a bounded queue with a capacity of 100

	// Initialize the queue with the payloads based on strategy
	const initializeQueue = Effect.gen(function* () {
		const sendQueue = Queue.bounded<Option.Option<Uint8Array>>(100);
		console.log('initializing queue');
		const q = yield* sendQueue;
		const result = yield* q.offerAll(yield* payloadsWithSkips);
		console.log('queue initialized', result);
		return q;
	});

	const takeAndSend = (sendQueue: Queue.Queue<Option.Option<Uint8Array>>) =>
		Effect.gen(function* () {
			console.log('taking and sending');
			const result = yield* sendQueue.take;
			console.log('result', result);
			return yield* sendEffect(result);
		});

	const validateMessage = (message: Message) => {
		console.log('validating message', message);
		if (message.channelId !== channel.channelId) {
			console.error('Message is not for this match');
			return false;
		}
		return true;
	};

	const subscribe = (listenCondition: Ref.Ref<boolean>) =>
		Effect.async<SubscribeResult, Error>((resume) => {
			try {
				console.log('subscribing to filter');
				wakuNode.node?.filter
					.subscribe([decoder], async (message) => {
						const listening = await Effect.runPromise(listenCondition.get);
						console.log('listening', listening);
						if (!listening) {
							return;
						}
						console.log('received filter message', message);
						const hash = encodeBase64(messageHash(encoder.pubsubTopic, message));
						const sdsMessage = decodeMessage(message.payload) as unknown as Message;
						if (validateMessage(sdsMessage) && !sent.has(hash)) {
							channel.receiveMessage(sdsMessage);
							lastMessage = new Date();
						}
					})
					.then((result) => {
						Effect.runPromise(Ref.set(listenCondition, true));
						resume(Effect.succeed(result));
					});
			} catch (error) {
				resume(Effect.fail(new Error(error as string)));
			}
		});

	const sent = new Map<string, boolean>();

	const sendSync = Effect.async<boolean, Error>((resume) => {
		console.log('sending sync', new Date().getTime() - lastMessage.getTime());
		if (new Date().getTime() - lastMessage.getTime() < sinkTimeout + Math.random() * 2000) {
			console.log('sink timeout', new Date().getTime() - lastMessage.getTime());
			return resume(Effect.succeed(false));
		} else {
			channel
				.sendSyncMessage(async (message: Message) => {
					const encodedMessage = encodeMessage(message);
					const timestamp = new Date();
					const protoMessage = await encoder.toProtoObj({
						payload: encodedMessage,
						timestamp,
					});
					const hash = encodeBase64(messageHash(encoder.pubsubTopic, protoMessage));
					sent.set(hash, true);
					const result = await wakuNode.sendWithLightPush(encodedMessage, timestamp);
					if (result.failures.length > 0) {
						console.error('error sending message', result.failures);
					}
					console.log('sent message over waku', message);
					lastMessage = new Date();
					return true;
				})
				.then((result) => resume(Effect.succeed(result)))
				.catch((error) => resume(Effect.fail(new Error(error as string))));
		}
	});

	const processQueue = Effect.sync(async () => {
		await channel.processTasks();
	});

	const sweep = Effect.sync(async () => {
		await sweepIn(channel);
		const result = sweepOut();
		console.log('unacknowledged ', result.unacknowledged.length);
	});

	return Effect.runPromise(
		Effect.gen(function* () {
			const listenCondition = yield* Ref.make(false);
			const queue = yield* initializeQueue;
			yield* Effect.all(
				[
					// setup filter
					subscribe(listenCondition),
					// send messages
					Effect.repeat(takeAndSend(queue), Schedule.spaced('2000 millis')),
					// Effect.repeat(takeAndSend, Schedule.spaced('2000 millis')),
					// periodic sync
					Effect.repeat(sendSync, Schedule.spaced('10000 millis')),
					// periodically process queue
					Effect.repeat(processQueue, Schedule.spaced('200 millis')),
					// periodically sweep buffers
					Effect.repeat(sweep, Schedule.spaced('500 millis')),
					// periodically switch off filter to miss messages
					Effect.repeat(
						Ref.update(listenCondition, (listening) => !listening),
						Schedule.spaced(first ? '5000 millis' : `${5000 * 2} millis`)
					)
				],
				{
					concurrency: 'unbounded'
				}
			);
		})
	);
}
