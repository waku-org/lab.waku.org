<script lang="ts">
	import { subscribeToAllEventsStream } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { getMessageId } from '$lib/sds/message';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import { grid, recordMessage } from '$lib/utils/stateGraph.svelte';
	import { eventColors, eventNames } from '$lib/utils/event';
	import HistoryItem from './HistoryItem.svelte';
	// Store for history items
	let history: Array<MessageChannelEventObject> = $state([]);
	let identicons: {[messageId: string]: string} = $state({});
	let identicon: any = $state(null);

	const minHeight = 32;
	const aspectRatio = 5.74;
	let containerWidth: number;
	let containerHeight: number;

	const historyMutex = $state(false);

	$effect(() => {
		// Update container dimensions when grid changes
		if (grid) {
			containerWidth = grid[0]?.length || 0;
			containerHeight = grid.length || 0;
		}
	});

	// Unsubscribe function
	let unsubscribe: (() => void) | null = $state(null);

	// let identicons = $derived(
	// 	identicon &&
	// 		history.map((event: MessageChannelEventObject) => {
	// 			const id = getMessageId(event);
	// 			return new identicon(id || '', { size: 40, format: 'svg' }).toString();
	// 		})
	// );

	onMount(async () => {
		identicon = await getIdenticon();
		// Subscribe to the event stream and collect events
		unsubscribe = subscribeToAllEventsStream((event) => {
			if (event.type === MessageChannelEvent.MissedMessages) {
				return;
			}
			history = [event, ...history];
			recordMessage(event);
			const id = getMessageId(event);
			if (!id) {
				return;
			}
			if(identicons[id] === undefined) {
				identicons[id] = new identicon(id, { size: 40, format: 'svg' }).toString();
			}
		});	
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="state-graph-container">
	{#if grid}
		<div class="grid-wrapper">
			<div
				class="grid"
				style="--cell-height: {minHeight}px; --cell-width: {minHeight *
					aspectRatio}px; --cols: {containerWidth}; --rows: {containerHeight}"
			>
				{#each grid as row}
					<div class="row">
						{#each row as cell}
							<!-- {#if cell}
								<div class="cell" style="background-color: {eventColors[cell.type]};">
									<div class="cell-content" color={eventColors[cell.type]}>
										{eventNames[cell.type]}
									</div>
								</div>
							{/if} -->
							{#if cell}
								{@const id = getMessageId(cell)}
								{#if id && identicons[id]}
									<HistoryItem overflow={false} height={minHeight} width={minHeight * aspectRatio} identicon={identicons[id]} event={cell} />
								{/if}
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.state-graph-container {
		display: flex;
		height: 100%;
		width: 100%;
		overflow: auto;
		justify-content: center;
	}

	.grid-wrapper {
		max-width: 100%;
		max-height: 100%;
	}

	.grid {
		display: flex;
		grid-template-columns: repeat(var(--cols), var(--cell-width));
		width: fit-content;
		margin: auto;
	}

	.cell {
		/* height: var(--cell-height);
		width: var(--cell-width); */
		max-width: var(--cell-width);
		max-height: var(--cell-height);
		border: 1px solid black;
		background-color: rgba(170, 165, 209, 0.79);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.cell-content {
		font-size: 0.8rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 0 4px;
	}

	/* Remove unused styles */
</style>
