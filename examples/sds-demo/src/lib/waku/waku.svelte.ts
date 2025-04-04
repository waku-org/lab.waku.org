import {
	createLightNode,
	DecodedMessage,
	type LightNode,
	Protocols,
	HealthStatus,
	HealthStatusChangeEvents,
	type ISubscription,
	type SDKProtocolResult,
	createDecoder,
	createEncoder,
	type SubscribeResult
} from '@waku/sdk';
import { Effect, Schedule, Fiber } from 'effect';
import { writable } from 'svelte/store';
import { PeerState, stateTransitionStream, subscribeToStateTransitionStream } from './lobby.svelte';
import type { LobbyMessage, StateTransitionDetail } from './lobby.svelte';
import { LobbyMessageType, processUpdates } from './lobby.svelte';
import { hash } from '../utils/hash';
import type { RuntimeFiber } from 'effect/Fiber';
const contentTopic = '/sds-demo/1/messages/proto';
const lobbyContentTopic = '/sds-demo/1/lobby/proto';

export const encoder = createEncoder({
	contentTopic,
	pubsubTopicShardInfo: { clusterId: 42, shard: 0 }
});

export const decoder = createDecoder(contentTopic, { clusterId: 42, shard: 0 });

export const lobbyEncoder = createEncoder({
	contentTopic: lobbyContentTopic,
	pubsubTopicShardInfo: { clusterId: 42, shard: 0 }
});

export const lobbyDecoder = createDecoder(lobbyContentTopic, { clusterId: 42, shard: 0 });
export class WakuNode {
	public node = $state<LightNode | undefined>(undefined);

	async setNode(node: LightNode) {
		this.node = node;
	}

	public subscription: ISubscription | undefined;

	public async subscribeToFilter(callback: (message: DecodedMessage) => void) {
		if (!node) {
			throw new Error('Waku node not started');
		}

		const result = await node.filter.subscribe([decoder], (message) => {
			callback(message);
		});

		if (result.error) {
			console.error('Error subscribing to filter:', result.error);
			throw new Error('Failed to subscribe to filter');
		}

		// At this point TypeScript knows we have a SubscriptionSuccess
		this.subscription = result.subscription;

		if (result.results.failures.length > 0 || result.results.successes.length === 0) {
			throw new Error('Failed to subscribe to filter: No successful peer connections');
		}
	}

	public async unsubscribe() {
		if (!node) {
			throw new Error('Waku node not started');
		}
		await this.subscription?.unsubscribe([decoder.contentTopic]);
	}

	public async sendWithLightPush(payload: Uint8Array, timestamp: Date): Promise<SDKProtocolResult> {
		if (!node) {
			throw new Error('Waku node not started');
		}
		return await node.lightPush.send(encoder, {
			payload: payload,
			timestamp: timestamp,
		});
	}

	public queryStore(messageHashes: Uint8Array[]) {
		return node?.store.queryGenerator([decoder], {
			includeData: true,
			messageHashes
		});
	}
}

let node = $state<LightNode | undefined>(undefined);
export const connectionState = writable({
	status: 'disconnected' as
		| 'error'
		| 'disconnected'
		| 'connecting'
		| 'waiting_for_peers'
		| 'setting_up_subscriptions'
		| 'connected',
	error: null as string | null
});

export const wakuNode = new WakuNode();

export async function startWaku(): Promise<void> {
	connectionState.update((state) => ({
		...state,
		status: 'connecting',
		error: null
	}));

	try {
		node = await createLightNode({
			defaultBootstrap: false,
			networkConfig: {
				clusterId: 42,
				shards: [0]
			},
			libp2p: {
				connectionGater: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					denyDialMultiaddr: async (_) => {
						return false;
					}
				},
				filterMultiaddrs: false
			}
		});

		await node.start();
		await wakuNode.setNode(node);

		// Connect to peers
		await node.dial(
			// '/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ'
			'/ip4/127.0.0.1/tcp/8000/ws/p2p/16Uiu2HAm3TLea2NVs4dAqYM2gAgoV9CMKGeD1BkP3RAvmk7HBAbU'
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).waku = node;
		connectionState.update((state) => ({
			...state,
			status: 'waiting_for_peers'
		}));

		// Wait for peer connections
		try {
			await node.waitForPeers([Protocols.LightPush, Protocols.Filter, Protocols.Store]);
			connectionState.update((state) => ({
				...state,
				status: 'setting_up_subscriptions'
			}));
		} catch (error) {
			console.error('Error waiting for peers:', error);
		}

		connectionState.update((state) => ({
			...state,
			status: 'connected'
		}));
	} catch (error) {
		console.error('Error starting Waku node:', error);
		connectionState.update((state) => ({
			...state,
			status: 'error',
			error: error instanceof Error ? error.message : String(error)
		}));
		throw error;
	}
}

export function health(callback: (health: HealthStatus) => void): void {
	if (!node) {
		return;
	}
	node.health.addEventListener(
		HealthStatusChangeEvents.StatusChange,
		(health: CustomEvent<HealthStatus>) => {
			callback(health.detail);
		}
	);
}

export function unregisterHealthListener(callback: (health: HealthStatus) => void): void {
	if (!node) {
		return;
	}
	node.health.removeEventListener(
		HealthStatusChangeEvents.StatusChange,
		(health: CustomEvent<HealthStatus>) => {
			callback(health.detail);
		}
	);
}

export enum Strategy {
	PingPong = 'ping-pong',
	Linear = 'linear'
}

export type MatchParams = {
	matchId: string;
	myPeerId: string;
	otherPeerId: string;
	startTime: Date;
	messages: number;
	strategy: Strategy;
};

export async function joinLobby(): Promise<MatchParams> {
	if (!node) {
		throw new Error('Waku node not started');
	}
	// Setup id and peer state
	const id = node?.libp2p.peerId.toString();
	if (!id) {
		throw new Error('Peer ID not found');
	}

	let lastMessage: number = 0;
	const subscribeToLobby = Effect.async<SubscribeResult, Error>((resume) => {
		try {
			node?.filter
				.subscribe([lobbyDecoder], (message) => {
					const messageData: LobbyMessage = JSON.parse(new TextDecoder().decode(message.payload));
					if (messageData.from === id) {
						return;
					}
					if (messageData.messageType === LobbyMessageType.Ping || messageData.to === id) {
						processUpdates([{ peerId: messageData.from, message: messageData, sent: false }]);
					}
					console.log('Received lobby message:', messageData);
					lastMessage = Date.now();
				})
				.then((result) => resume(Effect.succeed(result)));
		} catch (error) {
			resume(Effect.fail(new Error(error as string)));
		}
	});

	const sendMessage = (message: LobbyMessage) =>
		Effect.async<SDKProtocolResult, Error>((resume) => {
			node?.lightPush
				.send(lobbyEncoder, {
					payload: new TextEncoder().encode(JSON.stringify(message)),
					timestamp: new Date()
				})
				.then((result) => resume(Effect.succeed(result)))
				.catch((error) => resume(Effect.fail(new Error(error as string))));
		});

	const policy = Schedule.spaced('1000 millis');

	const repeated = Effect.retry(subscribeToLobby, policy);

	let subscription: ISubscription;
	Effect.runPromise(repeated).then((sub) => {
		if (sub.subscription) {
			subscription = sub.subscription;
		}
	});

	const getMatchParams = Effect.async<MatchParams, Error>((resume) => {
		let fiber: () => void = () => {};
		let pingFiber: RuntimeFiber<number, Error> | null = null;
		const pingSchedule = Schedule.spaced('1000 millis');
		const ping = Effect.async<number, Error>((resume) => {
			if (lastMessage + 2000 < Date.now()) {
				Effect.runFork(
					sendMessage({
						messageType: LobbyMessageType.Ping,
						from: id,
						timestamp: new Date()
					})
				);
			}
			resume(Effect.succeed(0));
		});

		const handleStateTransition = async (event: StateTransitionDetail) => {
			if (event.newState === PeerState.Found) {
				// Found a peer, send a request to match
				// or ignore
				console.log(`Found peer ${event.peerId}`);
				const message = {
					messageType: LobbyMessageType.Request,
					from: id,
					to: event.peerId,
					timestamp: new Date()
				};
				console.log('Sending request to match:', message);
				await processUpdates([{ peerId: event.peerId, message, sent: true }]);
				await Effect.runPromise(sendMessage(message));
			} else if (event.newState === PeerState.RequestFrom) {
				// Received a request to match, send an accept
				// or ignore
				const message = {
					messageType: LobbyMessageType.Accept,
					from: id,
					to: event.peerId,
					timestamp: new Date()
				};
				console.log('Sending accept to match:', message);
				await Effect.runPromise(sendMessage(message));
				await processUpdates([{ peerId: event.peerId, message, sent: true }]);
			} else if (event.newState === PeerState.AcceptFrom) {
				console.log(`Accepted match from ${event.peerId}`);
				// We received an accept to match, start match
				// or ignore
				const message = {
					messageType: LobbyMessageType.Match,
					from: id,
					to: event.peerId,
					timestamp: new Date()
				};
				console.log('Sending match:', message);
				await Effect.runPromise(sendMessage(message));
				await processUpdates([{ peerId: event.peerId, message, sent: true }]);
			} else if (event.newState === PeerState.Success) {
				console.log(`Match started with ${event.peerId}`);
				const matchId = hash(
					id.localeCompare(event.peerId) < 0 ? `${id}-${event.peerId}` : `${event.peerId}-${id}`
				);
				console.log(event.message);
				console.log(event.message.timestamp);
				const params: MatchParams = {
					matchId,
					myPeerId: id,
					otherPeerId: event.peerId,
					startTime: new Date(new Date(event.message.timestamp).getTime() + 10_000),
					messages: 20,
					strategy: Strategy.PingPong
				};
				// if we sent a match, then start the simulation
				// stop responding to lobby messages, as we should now be in a match
				if (fiber) {
					fiber();
				}
				if (pingFiber) {
					Effect.runFork(Fiber.interrupt(pingFiber));
				}
				if (subscription) {
					subscription.unsubscribe([lobbyDecoder.contentTopic]);
				}
				resume(Effect.succeed(params));
			}
		};

		fiber = subscribeToStateTransitionStream(stateTransitionStream, handleStateTransition);
		setTimeout(() => {
			pingFiber = Effect.runFork(Effect.repeat(ping, pingSchedule));
		}, 2000);
	});

	return Effect.runPromise(getMatchParams);
}
