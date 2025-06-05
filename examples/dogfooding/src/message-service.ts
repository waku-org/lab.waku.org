import { Type, Field } from "protobufjs";
import { getPeerId } from "./waku-service";

// New message structure with a unique ID and content for searchability
export const ProtoChatMessage = new Type("ChatMessage")
    .add(new Field("id", 1, "string")) // Unique message ID (e.g., UUID or timestamp-based)
    .add(new Field("timestamp", 2, "uint64"))
    .add(new Field("senderPeerId", 3, "string"))
    .add(new Field("content", 4, "string")); // Actual message content

export interface ChatMessage {
    id: string;
    timestamp: number;
    senderPeerId: string;
    content: string;
    failureInfo?: {
        error: string;
        peer?: string;
    };
}

export function encodeMessage(content: string): Uint8Array {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const message = ProtoChatMessage.create({
        id,
        timestamp: Date.now(),
        senderPeerId: getPeerId() || "unknown",
        content,
    });
    return ProtoChatMessage.encode(message).finish();
}

export function decodeMessage(payload: Uint8Array): ChatMessage | null {
    try {
        const decoded = ProtoChatMessage.decode(payload) as any;
        return {
            id: decoded.id,
            timestamp: Number(decoded.timestamp),
            senderPeerId: decoded.senderPeerId,
            content: decoded.content,
        };
    } catch (error) {
        console.error("Failed to decode message:", error);
        return null;
    }
}
