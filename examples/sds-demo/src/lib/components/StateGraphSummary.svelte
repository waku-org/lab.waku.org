<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		actual_grid,
		update_virtual_grid,
		shift_actual_grid
	} from '$lib/utils/stateGraph.svelte';
	import { subscribeToAllEventsStream } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { eventColors, eventNames } from '$lib/utils/event';
	onMount(() => {
		console.log('StateGraphSummary mounted');
	});

	let unsubscribe: (() => void) | null = $state(null);

	onMount(async () => {
		unsubscribe = subscribeToAllEventsStream((event) => {
			if (event.type === MessageChannelEvent.MissedMessages) {
				return;
			}
			update_virtual_grid(event);
			// shift_actual_grid();
		});
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="summary-grid">
	{#each actual_grid as row}
		<div class="column mw-200 mr-2 rounded-lg bg-none p-5 sm:shadow-md">
			<p>{row.lamportTimestamp}</p>
			{#each row.columns as cell}
				{#if cell?.type}
					<div class="cell" style="background-color: {eventColors[cell.type]};">
						<p class="cell-text">{eventNames[cell.type]}</p>
					</div>
				{/if}
			{/each}
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

	.empty-cell {
		/* border: 1px solid black; */
		border: none !important;
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
</style>
