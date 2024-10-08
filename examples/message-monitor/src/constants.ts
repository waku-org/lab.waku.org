import { utils } from "@waku/sdk";

export const DEFAULT_CONTENT_TOPIC = "/js-waku-examples/1/message-ratio/utf8";
export const DEFAULT_PUBSUB_TOPIC = utils.contentTopicToPubsubTopic(DEFAULT_CONTENT_TOPIC);
export const TELEMETRY_URL = process.env.REACT_APP_TELEMETRY_URL || "http://localhost:8080/waku-metrics";

export const nodes = [
  "/dns4/node-01.do-ams3.waku.test.status.im/tcp/8000/wss",
  "/dns4/node-01.ac-cn-hongkong-c.waku.test.status.im/tcp/8000/wss",
  "/dns4/node-01.gc-us-central1-a.waku.test.status.im/tcp/8000/wss",
];