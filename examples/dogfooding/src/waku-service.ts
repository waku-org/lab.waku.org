import { LightNode, createLightNode } from "@waku/sdk";
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
