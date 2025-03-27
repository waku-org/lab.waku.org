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
	createEncoder
} from '@waku/sdk';
import { writable } from 'svelte/store';

const contentTopic = '/sds-demo/1/messages/proto';

export const encoder = createEncoder({
	contentTopic,
	pubsubTopicShardInfo: { clusterId: 42, shard: 0 }
});

export const decoder = createDecoder(contentTopic, { clusterId: 42, shard: 0 });

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

	public async sendWithLightPush(payload: Uint8Array): Promise<SDKProtocolResult> {
		if (!node) {
			throw new Error('Waku node not started');
		}
		return await node.lightPush.send(encoder, {
			payload: payload,
			timestamp: new Date()
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
			// "/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8095/wss/p2p/16Uiu2HAmNaeL4p3WEYzC9mgXBmBWSgWjPHRvatZTXnp8Jgv3iKsb"
			'/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ'
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).waku = node;
		connectionState.update((state) => ({
			...state,
			status: 'waiting_for_peers'
		}));

		// Wait for peer connections
		try {
			await node.waitForPeers([Protocols.LightPush, Protocols.Filter]);
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
