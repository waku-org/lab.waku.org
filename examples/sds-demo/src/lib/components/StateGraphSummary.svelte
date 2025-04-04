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
		{@const isEmptyColumn = length === 0}
		<div class="column mr-2 mb-4 rounded-lg p-4 pt-2 state-column {isEmptyColumn ? 'empty-column' : ''}">
			<div class="lamport-timestamp">
				<span>{row.lamportTimestamp}</span>
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
		gap: 16px;
	}
	
	.lamport-timestamp {
		text-align: center;
		margin-bottom: 8px;
		font-weight: bold;
		font-size: 14px;
		color: #6B4F8A;
		position: relative;
	}
	
	.lamport-timestamp::before,
	.lamport-timestamp::after {
		content: '';
		position: absolute;
		height: 2px;
		width: 30%;
		background: linear-gradient(90deg, transparent, #F59E0B, transparent);
		top: 50%;
	}
	
	.lamport-timestamp::before {
		left: 5%;
	}
	
	.lamport-timestamp::after {
		right: 5%;
	}
	
	.lamport-timestamp span {
		background-color: #f8f3ff;
		padding: 0 8px;
		border-radius: 10px;
		position: relative;
		z-index: 1;
	}
	
	.cell {
		min-width: 100px;
		min-height: 50px;
		border: none;
		margin: 4px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}
	
	.cell::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
		z-index: 1;
	}

	.filtered {
		box-shadow: 0 0 0 3px #FFC107;
		animation: pulse 1.5s infinite;
	}

	.filtered-out {
		opacity: 0.4;
	}

	.empty-cell {
		border: 1px dashed rgba(107, 79, 138, 0.2);
		background-color: rgba(248, 243, 255, 0.5);
		box-shadow: none;
	}

	.column {
		border: none;
		max-height: 400px;
		min-height: 200px;
		min-width: 200px;
		max-width: 280px;
		background-color: #f8f3ff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		border-radius: 12px;
		position: relative;
		overflow: hidden;
	}
	
	.state-column {
		border-left: 4px solid #F59E0B;
		border-right: 4px solid #F59E0B;
		border-radius: 12px;
		transition: transform 0.2s;
		background-color: #f8f3ff;
	}
	
	.state-column:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
	}
	
	.cell-text {
		font-size: 12px;
		text-align: center;
		vertical-align: middle;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: white;
		font-weight: bold;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 2;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(255, 193, 7, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
		}
	}

	.empty-column {
		background-color: rgba(107, 79, 138, 0.1);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		opacity: 0.8;
	}
	
	.empty-column .lamport-timestamp {
		color: rgba(107, 79, 138, 0.6);
	}
	
	.empty-column .empty-cell {
		border: 1px dashed rgba(107, 79, 138, 0.15);
		background-color: rgba(248, 243, 255, 0.3);
	}
</style>
