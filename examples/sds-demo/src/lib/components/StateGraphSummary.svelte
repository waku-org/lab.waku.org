<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { actual_grid, update_virtual_grid } from '$lib/utils/stateGraph.svelte';
	import { subscribeToAllEventsStream, subscribeToChannelEvents } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { eventColors, eventNames, currentIdFilter, matchesIdFilter } from '$lib/utils/event.svelte';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import { hash } from '$lib/utils/hash';

	let { channelId = null }: { channelId: string | null } = $props();
	let unsubscribe: (() => void) | null = $state(null);

	function eventStreamCallback(event: MessageChannelEventObject) {
		if (event.type === MessageChannelEvent.MissedMessages) {
			return;
		}
		if (event.type === MessageChannelEvent.SyncSent || event.type === MessageChannelEvent.SyncReceived) {
			event.payload.messageId = hash(event.payload.messageId + event.payload.causalHistory[0].messageId)
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
		{@const isEmptyColumn = length === 0}
		<div class="column mr-2 mb-4 p-4 state-column {isEmptyColumn ? 'empty-column' : ''}">
			<div class="lamport-timestamp">
				<span>{row.lamportTimestamp}</span>
			</div>
			<div class="queue-container">
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
		</div>
	{/each}
</div>

<style>
	.summary-grid {
		display: inline-flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 16px;
	}
	
	.lamport-timestamp {
		text-align: center;
		margin-bottom: 12px;
		font-weight: bold;
		font-size: 14px;
		color: #333333;
	}
	
	.queue-container {
		background-color: #f5f5f5;
		border-radius: 4px;
		padding: 8px;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
	}
	
	.cell {
		min-width: 100px;
		min-height: 40px;
		border: none;
		margin: 2px 0;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.filtered {
		box-shadow: 0 0 0 2px #DB8D43;
	}

	.filtered-out {
		opacity: 0.35;
	}

	.empty-cell {
		border: 1px dashed rgba(0, 0, 0, 0.1);
		background-color: rgba(240, 240, 240, 0.5);
		box-shadow: none;
	}

	.column {
		max-width: 280px;
		min-width: 200px;
		background-color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		position: relative;
		border: 1px solid #e0ddd4;
	}
	
	.state-column {
		transition: transform 0.2s;
	}
	
	.state-column:hover {
		transform: translateY(-2px);
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
	}
	
	.cell-text {
		font-size: 12px;
		text-align: center;
		vertical-align: middle;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: white;
		font-weight: bold;
	}

	.empty-column {
		background-color: rgba(0, 0, 0, 0.02);
		opacity: 0.7;
	}
	
	.empty-column .lamport-timestamp {
		color: rgba(0, 0, 0, 0.4);
	}
	
	.empty-column .empty-cell {
		border: 1px dashed rgba(0, 0, 0, 0.05);
		background-color: rgba(240, 240, 240, 0.3);
	}
</style>
