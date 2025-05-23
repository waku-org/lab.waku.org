<script lang="ts">
	import { subscribeToAllEventsStream, subscribeToChannelEvents } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { getMessageId } from '$lib/sds/message';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import HistoryItem from './HistoryItem.svelte';
	import LegendModal from './LegendModal.svelte';
	import { matchesIdFilter, currentIdFilter } from '$lib/utils/event.svelte';
	import { hash } from '$lib/utils/hash';

	// Store for history items
	let history: Array<MessageChannelEventObject> = $state([]);
	let identicon: any = $state(null);
	let currentFilter: string = $state('all');
	let showLegend: boolean = $state(false);

	let { channelId = null }: { channelId: string | null } = $props();

	// Map of filter values to event types
	const filterMap: { [key: string]: string | null } = {
		all: null,
		sent: MessageChannelEvent.MessageSent,
		received: MessageChannelEvent.MessageReceived,
		delivered: MessageChannelEvent.MessageDelivered,
		acknowledged: MessageChannelEvent.MessageAcknowledged,
		syncSent: MessageChannelEvent.SyncSent,
		syncReceived: MessageChannelEvent.SyncReceived
	};

	// Calculate counts of each event type
	let eventCounts = $derived({
		all: history.length,
		sent: history.filter((event) => event.type === MessageChannelEvent.MessageSent).length,
		received: history.filter((event) => event.type === MessageChannelEvent.MessageReceived).length,
		delivered: history.filter((event) => event.type === MessageChannelEvent.MessageDelivered)
			.length,
		acknowledged: history.filter((event) => event.type === MessageChannelEvent.MessageAcknowledged)
			.length,
		syncSent: history.filter((event) => event.type === MessageChannelEvent.SyncSent).length,
		syncReceived: history.filter((event) => event.type === MessageChannelEvent.SyncReceived).length
	});

	// Filtered history based on selected filter and ID filter
	let filteredHistory = $derived(
		(() => {
			// First filter by type
			let result =
				currentFilter === 'all'
					? [...history]
					: history.filter((event) => event.type === filterMap[currentFilter]);

			// Then filter by ID if present
			if (currentIdFilter.id) {
				result = result.filter(matchesIdFilter);
			}

			return result;
		})()
	);

	let identicons = $derived(
		identicon &&
			filteredHistory.map((event: MessageChannelEventObject) => {
				const id = getMessageId(event);
				// Handle the case where id could be null
				return new identicon(id || '', { size: 40, format: 'svg' }).toString();
			})
	);

	// Unsubscribe function
	let unsubscribe: (() => void) | null = $state(null);

	// Handle filter change
	function handleFilterChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		currentFilter = select.value;
	}

	// Handle event item click to filter by ID
	function handleEventClick(id: string | null) {
		if (id !== null) {
			currentIdFilter.id = id;
		}
	}

	// Handle dependency click to filter by dependency messageId
	function handleDependencyClick(messageId: string, event: Event) {
		// Stop event propagation so it doesn't trigger parent click handler
		event.stopPropagation();
		currentIdFilter.id = messageId;
	}

	// Clear ID filter
	function clearIdFilter() {
		currentIdFilter.id = null;
	}

	// Toggle legend display
	function toggleLegend() {
		showLegend = !showLegend;
	}

	function eventStreamCallback(event: MessageChannelEventObject) {
		// Add event to history with newest at the top
		if (event.type === MessageChannelEvent.MissedMessages) {
			return;
		}
		if (event.type === MessageChannelEvent.SyncSent || event.type === MessageChannelEvent.SyncReceived) {
			event.payload.messageId = hash(event.payload.messageId + event.payload.causalHistory[0].messageId)
		}
		history = [event, ...history];
	}

	onMount(async () => {
		identicon = await getIdenticon();
		// Subscribe to the event stream and collect events
		unsubscribe = channelId
			? subscribeToChannelEvents(channelId, eventStreamCallback)
			: subscribeToAllEventsStream(eventStreamCallback);
	});

	onDestroy(() => {
		// Clean up the subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="history-container">
	<div class="header">
		<button class="help-button" onclick={toggleLegend}>?</button>
		<select class="item-filter" onchange={handleFilterChange} value={currentFilter}>
			<option value="all">All ({eventCounts.all})</option>
			<option value="sent">Sent ({eventCounts.sent})</option>
			<option value="received">Received ({eventCounts.received})</option>
			<option value="delivered">Delivered ({eventCounts.delivered})</option>
			<option value="acknowledged">Acknowledged ({eventCounts.acknowledged})</option>
			<option value="syncSent">Sync Sent ({eventCounts.syncSent})</option>
			<option value="syncReceived">Sync Received ({eventCounts.syncReceived})</option>
		</select>
	</div>

	{#if currentIdFilter.id	}
		<div class="id-filter-badge">
			<span class="id-label">ID: {currentIdFilter.id}</span>
			<button class="clear-filter-btn" onclick={clearIdFilter}>×</button>
		</div>
	{/if}

	<div class="history-items-container">
		{#each filteredHistory as event, index}
			<HistoryItem
				{event}
				identicon={identicons[index]}
				currentIdFilter={currentIdFilter.id}
				onEventClick={handleEventClick}
				onDependencyClick={handleDependencyClick}
			/>
		{/each}
	</div>
	<div class="bottom-fade"></div>

	<LegendModal bind:isOpen={showLegend} />
</div>

<style>
	.history-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		min-width: 400px;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE and Edge */
		background-color: #ffffff;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		position: relative;
		border: 1px solid #e0ddd4;
		padding: 12px;
	}
	
	/* Hide scrollbar for Chrome, Safari and Opera */
	.history-container::-webkit-scrollbar {
		display: none;
	}
	
	.history-items-container {
		flex: 1;
		position: relative;
		padding-bottom: 30px; /* Add space for the fade effect */
		width: 100%;
		overflow-x: hidden;
	}
	
	.bottom-fade {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
		pointer-events: none; /* Allows interaction with elements underneath */
		z-index: 1;
	}

	.virtualizer-container {
		flex: 1;
		overflow: auto;
		padding: 10px;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 8px 8px 16px 8px;
		border-bottom: 1px solid #e0ddd4;
		margin-bottom: 12px;
		position: relative;
	}

	.help-button {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background-color: #f5f2e8;
		border: 1px solid #e0ddd4;
		color: #333333;
		font-weight: bold;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-right: 12px;
		transition: all 0.2s;
	}

	.help-button:hover {
		background-color: #e8e5db;
	}

	.item-filter {
		flex: 1;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #e0ddd4;
		background-color: white;
		font-size: 14px;
		color: #333333;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 12px center;
		background-size: 16px;
		transition: all 0.2s;
	}
	
	.item-filter:hover, .item-filter:focus {
		border-color: #ccc9c2;
		outline: none;
	}

	.id-filter-badge {
		display: flex;
		align-items: center;
		background-color: #f5f2e8;
		border-radius: 4px;
		padding: 6px 12px;
		margin: 0 8px 12px 8px;
		max-width: fit-content;
		font-size: 12px;
		color: #333333;
		border: 1px solid #e0ddd4;
	}

	.id-label {
		font-family: monospace;
		margin-right: 8px;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}

	.clear-filter-btn {
		background: rgba(0, 0, 0, 0.1);
		border: none;
		color: #333333;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		padding: 0 6px;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.clear-filter-btn:hover {
		background: rgba(0, 0, 0, 0.2);
	}

	/* Ensure all child elements don't cause horizontal overflow */
	.id-filter-badge, .header, .item-filter {
		max-width: 100%;
		box-sizing: border-box;
	}
</style>
