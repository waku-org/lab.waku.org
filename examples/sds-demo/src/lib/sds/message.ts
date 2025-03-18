import { MessageChannelEvent } from "@waku/sds";
import type { MessageChannelEventObject } from "./stream";

export function getMessageId(event: MessageChannelEventObject) {
    if(event.type === MessageChannelEvent.MessageSent) {
        return event.payload.messageId;
    } else if(event.type === MessageChannelEvent.MessageDelivered) {
        return event.payload.messageId;
    } else if(event.type === MessageChannelEvent.MessageReceived) {
        return event.payload.messageId;
    } else if(event.type === MessageChannelEvent.MessageAcknowledged) {
        return event.payload;
    } else if(event.type === MessageChannelEvent.PartialAcknowledgement) {
        return event.payload.messageId;
    } else if(event.type === MessageChannelEvent.MissedMessages) {
        return event.payload[0].messageId;
    }
    return null;
}
