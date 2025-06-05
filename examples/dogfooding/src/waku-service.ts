import { LightNode, createLightNode, createEncoder, createDecoder } from "@waku/sdk";
import { generateKeyPairFromSeed } from "@libp2p/crypto/keys";
import { fromString } from "uint8arrays";
import { sha256, generateRandomNumber } from "./utils";

export const DEFAULT_CONTENT_TOPIC = "/js-waku-examples/1/message-ratio/utf8";

let wakuNodeInstance: LightNode | null = null;

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
        defaultBootstrap: false,
        networkConfig: {
            clusterId: 42,
            shards: [0]
        },
        discovery: {
            dns: false,
            peerExchange: true,
            localPeerCache: false,
        },
        numPeersToUse: 2,
        libp2p: {
            privateKey,
        },
    });

    await Promise.allSettled([
        node.dial("/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ"),
        node.dial("/dns4/vps-aaa00d52.vps.ovh.ca/tcp/8000/wss/p2p/16Uiu2HAm9PftGgHZwWE3wzdMde4m3kT2eYJFXLZfGoSED3gysofk")
    ]);

    await node.start();
    await node.waitForPeers();

    wakuNodeInstance = node;
    (window as any).waku = node;
    return node;
}

export function getPeerId(): string | undefined {
    return wakuNodeInstance?.libp2p.peerId.toString();
}

export function createWakuEncoder() {
    return createEncoder({
        contentTopic: DEFAULT_CONTENT_TOPIC,
        pubsubTopicShardInfo: {
            clusterId: 42,
            shard: 0,
        }
    });
}

export function createWakuDecoder() {
    return createDecoder(DEFAULT_CONTENT_TOPIC, { clusterId: 42, shard: 0 });
}
