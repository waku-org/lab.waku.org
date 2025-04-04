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
		</select>
	</div>

	{#if currentIdFilter.id	}
		<div class="id-filter-badge">
			<span class="id-label">ID: {currentIdFilter.id}</span>
			<button class="clear-filter-btn" onclick={clearIdFilter}>×</button>
		</div>
	{/if}

	{#each filteredHistory as event, index}
		<HistoryItem
			{event}
			identicon={identicons[index]}
			currentIdFilter={currentIdFilter.id}
			onEventClick={handleEventClick}
			onDependencyClick={handleDependencyClick}
		/>
	{/each}

	<LegendModal bind:isOpen={showLegend} />
</div>

<style>
	.history-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		min-width: 400px;
		scrollbar-width: none;
		background-color: #f8f3ff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		position: relative;
		border-left: 4px solid #9966CC;
		border-right: 4px solid #9966CC;
		padding: 12px;
	}
	
	.history-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(to right, #9966CC, #F59E0B, #9966CC);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}
	
	.history-container::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(to right, #9966CC, #F59E0B, #9966CC);
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;
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
		border-bottom: 1px solid rgba(107, 79, 138, 0.2);
		margin-bottom: 8px;
		position: relative;
	}
	
	.header::after {
		content: '';
		position: absolute;
		left: 10%;
		right: 10%;
		bottom: -2px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #F59E0B, transparent);
	}

	.help-button {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #F59E0B;
		border: 2px solid #FFC107;
		color: white;
		font-weight: bold;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-right: 12px;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.help-button:hover {
		background-color: #DB8500;
		transform: scale(1.05);
	}

	.item-filter {
		flex: 1;
		padding: 10px 12px;
		border-radius: 8px;
		border: 2px solid #E0D0FF;
		background-color: white;
		font-size: 14px;
		color: #6B4F8A;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B4F8A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 12px center;
		background-size: 16px;
		transition: all 0.2s;
	}
	
	.item-filter:hover, .item-filter:focus {
		border-color: #9966CC;
		outline: none;
	}

	.id-filter-badge {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #F59E0B 0%, #F59E0B 100%);
		border-radius: 20px;
		padding: 6px 14px;
		margin: 12px 8px;
		max-width: fit-content;
		font-size: 12px;
		color: white;
		box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
	}

	.id-label {
		font-family: monospace;
		margin-right: 8px;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	}

	.clear-filter-btn {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
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
		background: rgba(255, 255, 255, 0.4);
		transform: scale(1.1);
	}
</style>
