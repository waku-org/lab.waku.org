import { decoder, encoder, lobbyEncoder, wakuNode } from '$lib/waku/waku.svelte';
import { type Message, encodeMessage, decodeMessage } from '@waku/sds';
import type { MatchParams } from './waku.svelte';
import { getOrCreateChannel } from '$lib/sds/channel.svelte';
import { Effect, Schedule, Stream, Option, Queue, Chunk, Ref } from 'effect';
import type { SDKProtocolResult, SubscribeResult } from '@waku/sdk';
import { messageHash } from '@waku/message-hash';
import { hash } from '$lib/utils/hash';
import { encodeBase64 } from 'effect/Encoding';
import type { MessageChannel } from '@waku/sds';
import { sweepIn, sweepOut } from '$lib/sds.svelte';
import { LobbyMessageType, type LobbyMessage } from './lobby.svelte';

export const listening = $state({ listening: false });

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
		return {
			success: true,
			retrievalHint: hash
		};
	});
}

const broadcastMatchToLobby = (params: MatchParams) =>
	Effect.async<SDKProtocolResult, Error>((resume) => {
		const m: LobbyMessage = {
			messageType: LobbyMessageType.Ongoing,
			timestamp: new Date(),
			from: params.myPeerId,
			to: params.otherPeerId,
			match: params
		};
		wakuNode.node?.lightPush
			.send(lobbyEncoder, {
				payload: new TextEncoder().encode(JSON.stringify(m)),
				timestamp: new Date()
			})
			.then((result) => resume(Effect.succeed(result)))
			.catch((error) => resume(Effect.fail(new Error(error as string))));
	});

export function start(params: MatchParams, joined: boolean = false) {
	const { matchId } = params;
	const first =
		params.myPeerId.localeCompare(params.otherPeerId + (joined ? Math.random() : '')) < 0
			? true
			: false;

	let lastMessage = new Date();
	const sinkTimeout = 10_000;
	const channel = getOrCreateChannel(matchId);

	// Create a stream of the messages scheduled based on the strategy
	// we can predetermine the list of messages we expect to send
	const payloadsStream = Stream.make(
		...Array.from({ length: params.messages }, (_, i) => {
			return new TextEncoder().encode(
				hash(matchId + (joined ? Math.random() : params.myPeerId) + i)
			);
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
		const q = yield* sendQueue;
		const result = yield* q.offerAll(yield* payloadsWithSkips);
		console.log('queue initialized', result);
		return q;
	});

	const takeAndSend = (sendQueue: Queue.Queue<Option.Option<Uint8Array>>) =>
		Effect.gen(function* () {
			const result = yield* sendQueue.take;
			return yield* sendEffect(result);
		});

	const validateMessage = (message: Message) => {
		if (message.channelId !== channel.channelId) {
			console.error('Message is not for this match');
			return false;
		}
		return true;
	};

	const subscribe = (listenCondition: Ref.Ref<boolean>) =>
		Effect.async<SubscribeResult, Error>((resume) => {
			try {
				wakuNode.node?.filter
					.subscribe([decoder], async (message) => {
						const listening = await Effect.runPromise(listenCondition.get);
						if (!listening) {
							return;
						}
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
		if (new Date().getTime() - lastMessage.getTime() < sinkTimeout + Math.random() * 2000) {
			return resume(Effect.succeed(false));
		} else {
			channel
				.sendSyncMessage(async (message: Message) => {
					const encodedMessage = encodeMessage(message);
					const timestamp = new Date();
					const protoMessage = await encoder.toProtoObj({
						payload: encodedMessage,
						timestamp
					});
					const hash = encodeBase64(messageHash(encoder.pubsubTopic, protoMessage));
					sent.set(hash, true);
					const result = await wakuNode.sendWithLightPush(encodedMessage, timestamp);
					if (result.failures.length > 0) {
						console.error('error sending message', result.failures);
					}
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
					Effect.repeat(sweep, Schedule.spaced('2000 millis')),
					// periodically switch off filter to miss messages
					Effect.repeat(
						Ref.update(listenCondition, (_listening) => {
							listening.listening = !_listening;
							return !_listening;
						}),
						Schedule.spaced(first ? '4500 millis' : `8000 millis`)
					),
					Effect.repeat(
						broadcastMatchToLobby(params),
						Schedule.spaced('2000 millis')
					)
				],
				{
					concurrency: 'unbounded'
				}
			);
		})
	);
}
