<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { actual_grid, update_virtual_grid } from '$lib/utils/stateGraph.svelte';
	import { subscribeToAllEventsStream, subscribeToChannelEvents } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { eventColors, eventNames, currentIdFilter, matchesIdFilter } from '$lib/utils/event.svelte';
	import type { MessageChannelEventObject } from '$lib/sds/stream';

	let { channelId = null }: { channelId: string | null } = $props();
	let unsubscribe: (() => void) | null = $state(null);

	function eventStreamCallback(event: MessageChannelEventObject) {
		if (event.type === MessageChannelEvent.MissedMessages) {
			return;
		}
		if (event.type === MessageChannelEvent.SyncSent || event.type === MessageChannelEvent.SyncReceived) {
			event
			return;
		}
		console.log('updating virtual grid', event);
		update_virtual_grid(event);
	}

	onMount(async () => {
		unsubscribe = channelId
			? subscribeToChannelEvents(channelId, eventStreamCallback)
			: subscribeToAllEventsStream(eventStreamCallback);
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="summary-grid">
	{#each actual_grid as row}
		{@const length = row.columns.filter((c) => c !== null).length}
		{@const empty = 4 - length}
		<div class="column mw-200 mr-2 mb-4 rounded-lg bg-none p-5 pt-0 sm:shadow-md">
			<div class="flex flex-row items-center justify-between">
				<p>{row.lamportTimestamp}</p>
				<!-- <div class="flex items-center">
					<div class="checkmark-large mr-1">✓</div>
					<div class="checkmark-small">✓</div>
				</div> -->
			</div>
			{#each row.columns as cell}
				{@const filtered = currentIdFilter.id && cell && matchesIdFilter(cell)}
				{#if cell?.type}
					<div
						class={`cell ${currentIdFilter.id ? (filtered ? 'filtered' : 'filtered-out') : ''}`}
						style="background-color: {eventColors[cell.type]};"
					>
						<p class="cell-text">{eventNames[cell.type]}</p>
					</div>
				{/if}
			{/each}
			{#if empty > 0}
				{#each Array(empty) as _}
					<div class="cell empty-cell"></div>
				{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	.summary-grid {
		display: inline-flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
	.cell {
		min-width: 100px;
		min-height: 50px;
		border: 1px solid black;
		margin: 1px;
		align-content: center;
	}

	.filtered {
	}

	.filtered-out {
		opacity: 0.3;
	}

	.empty-cell {
		/* border: 1px solid black; */
		/* border: none !important; */
	}

	.column {
		border: 1px solid black;
		max-height: 400px;
		max-width: 280px;
		min-height: 200px;
		min-width: 200px;
	}
	.cell-text {
		font-size: 12px;
		text-align: center;
		vertical-align: middle;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: white;
	}

	.checkmark-large {
		font-size: 24px;
		color: transparent;
		-webkit-text-stroke: 1px black;
	}

	.checkmark-small {
		font-size: 18px;
		color: transparent;
		-webkit-text-stroke: 1px black;
	}
</style>
