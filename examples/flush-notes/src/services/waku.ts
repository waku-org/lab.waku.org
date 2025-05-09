"use client";

import { WakuStatus } from "@/const";
import {
  IDecoder,
  IEncoder,
  IMessage,
  LightNode,
  createLightNode,
  waitForRemotePeer,
  IDecodedMessage,
  Protocols,
} from "@waku/sdk";
import { CONTENT_TOPIC } from "@/const";
import {
  contentTopicToPubsubTopic,
} from "@waku/utils";

type EventListener = (event: CustomEvent) => void;

export enum WakuEvents {
  Status = "status",
}

export class Waku {
  private node: undefined | LightNode;
  private emitter = new EventTarget();
  private initialized = false;
  private initializing = false;
  public pubsubTopic?: string;

  public async init(): Promise<void> {
    if (this.initialized || this.initializing) {
      return;
    }

    this.initializing = true;
    try {
      this.emitStatusEvent(WakuStatus.Initializing);
      this.pubsubTopic = contentTopicToPubsubTopic(CONTENT_TOPIC);
      const node = await createLightNode({
        defaultBootstrap: true,
        contentTopics: [CONTENT_TOPIC],
      });
      await node.start();
      this.emitStatusEvent(WakuStatus.WaitingForPeers);
      await waitForRemotePeer(node, [
        Protocols.Filter,
        Protocols.LightPush,
        Protocols.Store,
      ]);
      this.node = node;
      this.initialized = true;
      this.emitStatusEvent(WakuStatus.Connected);
    } catch (error) {
      console.error("Failed to initialize Waku node:", error);
      this.emitStatusEvent(WakuStatus.Failed);
    }
    this.initializing = false;
  }

  public addEventListener(event: WakuEvents, fn: EventListener) {
    return this.emitter.addEventListener(event, fn as any);
  }

  public removeEventListener(event: WakuEvents, fn: EventListener) {
    return this.emitter.removeEventListener(event, fn as any);
  }

  public send(encoder: IEncoder, message: IMessage) {
    this.ensureWakuInitialized();
    return this.node?.lightPush.send(encoder, message);
  }

  public async getHistory(
    decoder: IDecoder<IDecodedMessage>
  ): Promise<IDecodedMessage[]> {
    this.ensureWakuInitialized();

    let messages: IDecodedMessage[] = [];
    for await (const promises of this.node!.store.queryGenerator([decoder])) {
      const messagesRaw = await Promise.all(promises);
      const filteredMessages = messagesRaw.filter(
        (v): v is IDecodedMessage => !!v
      );

      messages = [...messages, ...filteredMessages];
    }

    return messages;
  }

  public async subscribe(
    decoder: IDecoder<IDecodedMessage>,
    fn: (m: IDecodedMessage) => void
  ) {
    this.ensureWakuInitialized();
    return this.node!.filter.subscribe(decoder, fn);
  }

  private emitStatusEvent(payload: string) {
    this.emitter.dispatchEvent(
      new CustomEvent(WakuEvents.Status, { detail: payload })
    );
  }

  private ensureWakuInitialized() {
    if (!this.initialized) {
      const message = "Waku is not initialized.";
      console.log(message);
      throw Error(message);
    }
  }
}

export const waku = new Waku();
