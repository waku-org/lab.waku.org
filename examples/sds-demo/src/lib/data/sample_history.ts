import { MessageChannelEvent } from '@waku/sds';

// Sample history with different event types for the legend
export const historyJson = JSON.stringify([
	{
		type: MessageChannelEvent.MessageSent,
		payload: {
			messageId: "db7ce7bff8734cc868da5bd8d880b58765ed9e0481f0c2f6b0ec86258322a3fa",
			channelId: "channel-id",
			lamportTimestamp: 6,
			causalHistory: [],
			bloomFilter: { 0: 0, 1: 0, 2: 0, 3: 0 },
			content: { 0: 131, 1: 244 }
		}
	},
	{
		type: MessageChannelEvent.MessageDelivered,
		payload: {
			messageId: "bc8701dd8eacca44f01a177a2d7e2ac879dd189b1f8ea2b57b10bbdb82042bc0",
			sentOrReceived: "received"
		}
	},
	{
		type: MessageChannelEvent.MessageReceived,
		payload: {
			messageId: "bc8701dd8eacca44f01a177a2d7e2ac879dd189b1f8ea2b57b10bbdb82042bc0",
			channelId: "channel-id",
			causalHistory: [],
			lamportTimestamp: 4,
			bloomFilter: { 0: 0, 1: 0, 2: 0, 3: 0 },
			content: { 0: 226, 1: 83 }
		}
	},
	{
		type: MessageChannelEvent.MessageAcknowledged,
		payload: "217e647921f9a6fc8ecfc480e207db828e18c5868d229cf5c5bf59be89dc70ff"
	},
	{
		type: MessageChannelEvent.PartialAcknowledgement,
		payload: {
			messageId: "d81b2617e63162843413eea8c62dada058ac7e6c8f8463fd5ef1171939cd9415",
			acknowledgementBitmask: new Uint8Array([1, 0, 1])
		}
	},
	{
		type: MessageChannelEvent.MissedMessages,
		payload: {
			messageIds: ["58cf44867e529152f4095aa6a951500a6a45571a062dc0bddb06aef48c97f85b"]
		}
	}
]);
