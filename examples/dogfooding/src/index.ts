import {
  createLightNode,
  DecodedMessage,
  LightNode,
} from "@waku/sdk";
import { generateKeyPairFromSeed } from "@libp2p/crypto/keys";
import { fromString } from "uint8arrays";

import { Type, Field } from "protobufjs";
import {
  generateRandomNumber,
  sha256,
} from "./util";

const DEFAULT_CONTENT_TOPIC = "/js-waku-examples/1/message-ratio/utf8";

const ProtoSequencedMessage = new Type("SequencedMessage")
  .add(new Field("hash", 1, "string"))
  .add(new Field("total", 2, "uint64"))
  .add(new Field("index", 3, "uint64"))
  .add(new Field("sender", 4, "string"));

const sequenceCompletedEvent = new CustomEvent("sequenceCompleted");
const messageReceivedEvent = new CustomEvent("messageReceived");

async function wakuNode(): Promise<LightNode> {
  let seed = localStorage.getItem("seed");

  if (!seed) {
    seed = (await sha256(generateRandomNumber())).slice(0, 32);
    localStorage.setItem("seed", seed);
  }

  const privateKey = await generateKeyPairFromSeed("Ed25519", fromString(seed));

  const node = await createLightNode({
    defaultBootstrap: false,
    numPeersToUse: 2,
    networkConfig: {
      clusterId: 42,
      shards: [0]
    },
    libp2p: {
      privateKey,
    },
  });

  (window as any).waku = node;

  await node.dial("/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ");
  await node.dial("/dns4/vps-aaa00d52.vps.ovh.ca/tcp/8000/wss/p2p/16Uiu2HAm9PftGgHZwWE3wzdMde4m3kT2eYJFXLZfGoSED3gysofk");
  await node.dial("/dns4/waku.fryorcraken.xyz/tcp/8000/wss/p2p/16Uiu2HAmMRvhDHrtiHft1FTUYnn6cVA8AWVrTyLUayJJ3MWpUZDB");

  return node;
}

export async function app() {
  const node = await wakuNode();

  console.log("DEBUG: your peer ID is:", node.libp2p.peerId.toString());

  await node.start();
  await node.waitForPeers();

  const peerId = node.libp2p.peerId.toString();
  const encoder = node.createEncoder({
    contentTopic: DEFAULT_CONTENT_TOPIC
  });

  const startLightPushSequence = async (
    numMessages: number,
    period: number = 3000
  ) => {
    const sequenceHash = await sha256(generateRandomNumber());
    const sequenceTotal = numMessages;
    let sequenceIndex = 0;

    const sendMessage = async () => {
      try {
        const messageHash = await sha256(
          `${sequenceHash}-${sequenceIndex}-${sequenceTotal}`
        );

        const timestamp = Math.floor(new Date().getTime() / 1000);
        const message = ProtoSequencedMessage.create({
          hash: messageHash,
          total: sequenceTotal,
          index: sequenceIndex,
          sender: peerId,
        });
        const payload = ProtoSequencedMessage.encode(message).finish();

        const result = await node.lightPush.send(
          encoder,
          {
            payload,
            timestamp: new Date(),
          },
          { autoRetry: true }
        );

        console.log("DEBUG: light push successes: ", result.successes.length);
        console.log(
          "DEBUG: light push failures: ",
          result.failures.length
        );

        // Increment sequence
        sequenceIndex++;

        if (sequenceIndex < sequenceTotal) {
          setTimeout(sendMessage, period); // Schedule the next send
        } else {
          document.dispatchEvent(sequenceCompletedEvent);
        }
      } catch (error) {
        console.error("DEBUG: Error sending message", error);
      }
    };

    sendMessage(); // Start the recursive sending
  };

  const startFilterSubscription = async () => {
    const decoder = node.createDecoder({ contentTopic: DEFAULT_CONTENT_TOPIC });

    const subscriptionCallback = async (message: DecodedMessage) => {
      const decodedMessage: any = ProtoSequencedMessage.decode(
        message.payload
      );

      if (decodedMessage.sender === peerId) {
        return;
      }

      const messageElement = document.createElement("div");
      messageElement.textContent = `Message: ${decodedMessage.hash}`;
      document.dispatchEvent(messageReceivedEvent);
    };

    await node.filter.subscribe(decoder, subscriptionCallback);
  };

  return {
    node,
    startLightPushSequence,
    startFilterSubscription,
  };
}

(async () => {
  const { startLightPushSequence, startFilterSubscription } = await app();

  startFilterSubscription();

  document.addEventListener(sequenceCompletedEvent.type, () =>
    startLightPushSequence(10, 3000)
  );

  startLightPushSequence(10, 3000);
})();