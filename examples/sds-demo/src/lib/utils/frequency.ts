import { Schedule } from "effect";

import { Ref } from "effect";

import { Effect } from "effect";


export function frequency() {
    return Effect.runPromise(
        Effect.gen(function* () {
            const listenCondition = yield* Ref.make(false);
            // const queue = yield* initializeQueue;
            yield* Effect.all(
            [
                // setup filter
                // subscribe(listenCondition),
                // // send messages
                Effect.repeat(Effect.sync(() => {}), Schedule.spaced('2000 millis')),
                // // Effect.repeat(takeAndSend, Schedule.spaced('2000 millis')),
                // // periodic sync
                // Effect.repeat(sendSync, Schedule.spaced('10000 millis')),
                // // periodically process queue
                // Effect.repeat(processQueue, Schedule.spaced('200 millis')),
                // // periodically sweep buffers
                // Effect.repeat(sweep, Schedule.spaced('2000 millis')),
                // // periodically switch off filter to miss messages
                Effect.repeat(
                    Ref.update(listenCondition, (listening) => !listening),
                    Schedule.spaced('2000 millis')
                )
            ],
            {
                concurrency: 'unbounded'
            }
        );
		})
	);
}
