import { getChannel } from './channel.svelte';
import { toEventStream, filterByEventType } from './stream';
import { Effect, Stream, pipe } from 'effect';
import type { MessageChannelEventObject } from './stream';
import { MessageChannelEvent } from '@waku/sds';

const eventStream = $state(toEventStream(getChannel()));

const missingMessageEventStream = $derived(
  pipe(
    eventStream,
    filterByEventType(MessageChannelEvent.MissedMessages)
  )
);

export function subscribeToMissingMessageStream(onEvent: (event: Extract<MessageChannelEventObject, { type: MessageChannelEvent.MissedMessages }>) => void): () => void {
  return subscribeToEventStream(missingMessageEventStream, onEvent);
}

export function subscribeToAllEventsStream(onEvent: (event: MessageChannelEventObject) => void): () => void {
  return subscribeToEventStream(eventStream, onEvent);
}


function subscribeToEventStream<A extends MessageChannelEventObject>(stream: Stream.Stream<A>, onEvent: (event: A) => void): () => void {
  const fiber = Effect.runFork(
    pipe(
      stream,
      Stream.tap((event) => 
        Effect.sync(() => {
          onEvent(event);
        })
      ),
      Stream.runDrain
    )
  );
  return () => {
    Effect.runFork(
      Effect.sync(() => {
        (fiber as unknown as { interrupt: () => void }).interrupt();
      })
    );
  };
}
