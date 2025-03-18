import { Stream, pipe } from 'effect';
import { MessageChannel, MessageChannelEvent, type MessageChannelEvents } from '@waku/sds';

/**
 * Extract payload types from MessageChannelEvents
 */
type EventPayloadMap = {
	[K in keyof MessageChannelEvents]: MessageChannelEvents[K] extends CustomEvent<infer T>
		? T
		: never;
};

/**
 * Union type for all possible event objects
 */
export type MessageChannelEventObject = {
	[E in MessageChannelEvent]: { type: E; payload: EventPayloadMap[E] };
}[MessageChannelEvent];

/**
 * Helper function to create a stream for a specific event type
 */
const fromMessageChannelEvent = <E extends MessageChannelEvent>(
	channel: MessageChannel,
	eventType: E
): Stream.Stream<MessageChannelEventObject> => {
	return Stream.map(
		Stream.fromEventListener(channel, eventType, { passive: true }),
		(event: Event) => {
			const customEvent = event as CustomEvent<EventPayloadMap[E]>;
			return {
				type: eventType,
				payload: customEvent.detail
			} as MessageChannelEventObject;
		}
	);
};

/**
 * Creates an Effect Stream from a MessageChannel's events
 */
export const toEventStream = (
	channel: MessageChannel
): Stream.Stream<MessageChannelEventObject> => {
	return Stream.mergeAll(
		Object.values(MessageChannelEvent).map((eventType) =>
			fromMessageChannelEvent(channel, eventType as MessageChannelEvent)
		),
		{ concurrency: 'unbounded' }
	);
};

// Add some convenience filtering methods
export const filterByEventType =
	<E extends MessageChannelEvent>(eventType: E) =>
	<R, E2>(
		stream: Stream.Stream<MessageChannelEventObject, E2, R>
	): Stream.Stream<Extract<MessageChannelEventObject, { type: E }>, E2, R> =>
		pipe(
			stream,
			Stream.filter(
				(event): event is Extract<MessageChannelEventObject, { type: E }> =>
					event.type === eventType
			)
		);
