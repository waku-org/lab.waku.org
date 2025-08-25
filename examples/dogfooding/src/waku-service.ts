import { LightNode, createLightNode } from "@waku/sdk";
import { generateKeyPairFromSeed } from "@libp2p/crypto/keys";
import { fromString } from "uint8arrays";
import { sha256, generateRandomNumber } from "./utils";

export const DEFAULT_CONTENT_TOPIC = "/js-waku-examples/1/message-ratio/utf8";

let wakuNodeInstance: LightNode | null = null;
let nodeCreationTime = Date.now();

export type DiscoveryType = "bootstrap" | "peer-exchange" | "peer-cache";

export interface DiscoveryEvent {
    time: number;
    type: DiscoveryType;
    total: number;
}

export interface ConnectionEvent {
    time: number;
    total: number;
}

const discoveryCounts: Record<DiscoveryType, number> = {
    "bootstrap": 0,
    "peer-exchange": 0,
    "peer-cache": 0,
};

const discoveredAt = new Map<string, number>();
const countedByType: Record<DiscoveryType, Set<string>> = {
    "bootstrap": new Set<string>(),
    "peer-exchange": new Set<string>(),
    "peer-cache": new Set<string>(),
};
const connectionTimeline: ConnectionEvent[] = [];
const discoveryTimeline: DiscoveryEvent[] = [];

export async function getWakuNode(): Promise<LightNode> {
    if (wakuNodeInstance) {
        return wakuNodeInstance;
    }

    let seed = localStorage.getItem("seed");
    if (!seed) {
        seed = (await sha256(generateRandomNumber())).slice(0, 32);
        localStorage.setItem("seed", seed);
    }

    const privateKey = await generateKeyPairFromSeed("Ed25519", fromString(seed));

    const node = await createLightNode({
        defaultBootstrap: true,
        discovery: {
            dns: true,
            peerExchange: true,
            peerCache: true,
        },
        numPeersToUse: 2,
        libp2p: {
            privateKey,
        },
    });

    (window as any).waku = node;

    await node.start();
    await node.waitForPeers();

    nodeCreationTime = Date.now();

    node.libp2p.addEventListener("peer:discovery", (evt: any) => {
        try {
            const info = evt.detail; // PeerInfo
            const peerId = info?.id?.toString?.() || info?.id || "";
            if (!peerId) return;
            if (!discoveredAt.has(peerId)) {
                discoveredAt.set(peerId, Date.now());
            }
        } catch (_) {}
    });

    node.libp2p.addEventListener("peer:update", (evt: any) => {
        try {
            const update = evt.detail; // PeerUpdate
            const peer = update?.peer;
            const peerId = peer?.id?.toString?.() || peer?.id || "";
            if (!peerId) return;
            const peerTags = peer?.tags ?? {};
            let hasBootstrap = false;
            let hasPeerExchange = false;
            let hasPeerCache = false;
            if (peerTags instanceof Map) {
                hasBootstrap = peerTags.has("bootstrap");
                hasPeerExchange = peerTags.has("peer-exchange");
                hasPeerCache = peerTags.has("peer-cache");
            } else {
                hasBootstrap = Object.prototype.hasOwnProperty.call(peerTags, "bootstrap");
                hasPeerExchange = Object.prototype.hasOwnProperty.call(peerTags, "peer-exchange");
                hasPeerCache = Object.prototype.hasOwnProperty.call(peerTags, "peer-cache");
            }

            const time = discoveredAt.get(peerId) ?? Date.now();

            if (hasBootstrap && !countedByType["bootstrap"].has(peerId)) {
                countedByType["bootstrap"].add(peerId);
                discoveryCounts["bootstrap"]++;
                discoveryTimeline.push({ time, type: "bootstrap", total: discoveryCounts["bootstrap"] });
            }
            if (hasPeerExchange && !countedByType["peer-exchange"].has(peerId)) {
                countedByType["peer-exchange"].add(peerId);
                discoveryCounts["peer-exchange"]++;
                discoveryTimeline.push({ time, type: "peer-exchange", total: discoveryCounts["peer-exchange"] });
            }
            if (hasPeerCache && !countedByType["peer-cache"].has(peerId)) {
                countedByType["peer-cache"].add(peerId);
                discoveryCounts["peer-cache"]++;
                discoveryTimeline.push({ time, type: "peer-cache", total: discoveryCounts["peer-cache"] });
            }

            (window as any).onDiscoveryUpdate?.([...discoveryTimeline]);
        } catch (_) {}
    });

    node.libp2p.addEventListener("peer:connect", () => {
        const now = Date.now();
        const total = node.libp2p.getConnections().length;
        connectionTimeline.push({ time: now, total });
        (window as any).onConnectionsUpdate?.([...connectionTimeline]);
    });

    wakuNodeInstance = node;
    return node;
}

export function getPeerId(): string | undefined {
    return wakuNodeInstance?.libp2p.peerId.toString();
}

export function createWakuEncoder() {
    return wakuNodeInstance!.createEncoder({
        contentTopic: DEFAULT_CONTENT_TOPIC,
    });
}

export function createWakuDecoder() {
    return wakuNodeInstance!.createDecoder({
        contentTopic: DEFAULT_CONTENT_TOPIC,
    });
}

export function getDiscoveryTimeline() {
    return discoveryTimeline;
}

export function getConnectionTimeline() {
    return connectionTimeline;
}

export function getNodeCreationTime() {
    return nodeCreationTime;
}
