<script lang="ts">
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import { grid } from '$lib/utils/stateGraph.svelte';
	import HistoryItem from './HistoryItem.svelte';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	// Props
	export let identicons: Array<string> = [];
	export let currentIdFilter: string | null = null;
	export let onEventClick: (id: string | null) => void;
	export let onDependencyClick: (messageId: string, event: Event) => void;
	export let columns: number = 10; // Default number of columns
	export let rows: number = 10; // Default number of rows
	
	// Create 2D grid of items initialized with null (empty items)
	
	onMount(() => {
		// Initialize the state graph stream
	});
	
	onDestroy(() => {
		// Clean up if needed
	});
</script>

<div class="state-graph" style="--columns: {columns};">
	{#each grid as row, y}
		{#each row as item, x}
			<div class="grid-item {item !== null ? 'filled' : ''}">
				{#if item !== null && y * columns + x < identicons.length}
					<HistoryItem 
						event={item}
						identicon={identicons[y * columns + x]}
						{currentIdFilter}
						{onEventClick}
						{onDependencyClick}
					/>
				{:else}
					<HistoryItem />
				{/if}
			</div>
		{/each}
	{/each}
</div>

<style>
	.state-graph {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: 10px;
		width: 100%;
		padding: 10px;
	}

	.grid-item {
		width: 340px;
		height: 178px;
		justify-self: center;
	}

	.filled {
		animation: fadeIn 0.5s ease-in-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@media (max-width: 1200px) {
		.state-graph {
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		}
	}
</style>
