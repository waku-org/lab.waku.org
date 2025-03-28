<script lang="ts">
	import { subscribeToAllEventsStream } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { getMessageId } from '$lib/sds/message';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import HistoryItem from './HistoryItem.svelte';
	import LegendModal from './LegendModal.svelte';

	// Map event types to colors using index signature
	const eventColors: { [key in string]: string } = {
		[MessageChannelEvent.MessageSent]: '#3B82F6', // blue
		[MessageChannelEvent.MessageDelivered]: '#10B981', // green
		[MessageChannelEvent.MessageReceived]: '#8B5CF6', // purple
		[MessageChannelEvent.MessageAcknowledged]: '#059669', // dark green
		[MessageChannelEvent.PartialAcknowledgement]: '#6D28D9', // dark purple
		[MessageChannelEvent.MissedMessages]: '#EF4444' // red
	};

	// Event type to display name using index signature
	const eventNames: { [key in string]: string } = {
		[MessageChannelEvent.MessageSent]: 'Sent',
		[MessageChannelEvent.MessageDelivered]: 'Delivered',
		[MessageChannelEvent.MessageReceived]: 'Received',
		[MessageChannelEvent.MessageAcknowledged]: 'Acknowledged',
		[MessageChannelEvent.PartialAcknowledgement]: 'Partially Acknowledged',
		[MessageChannelEvent.MissedMessages]: 'Missed'
	};

	// Store for history items
	let history: Array<MessageChannelEventObject> = $state([]);
	let identicon: any = $state(null);
	let currentFilter: string = $state('all');
	let currentIdFilter: string | null = $state(null);
	let showLegend: boolean = $state(false);

	// Map of filter values to event types
	const filterMap: { [key: string]: string | null } = {
		all: null,
		sent: MessageChannelEvent.MessageSent,
		received: MessageChannelEvent.MessageReceived,
		delivered: MessageChannelEvent.MessageDelivered,
		acknowledged: MessageChannelEvent.MessageAcknowledged
	};

	// Calculate counts of each event type
	let eventCounts = $derived({
		all: history.length,
		sent: history.filter((event) => event.type === MessageChannelEvent.MessageSent).length,
		received: history.filter((event) => event.type === MessageChannelEvent.MessageReceived).length,
		delivered: history.filter((event) => event.type === MessageChannelEvent.MessageDelivered)
			.length,
		acknowledged: history.filter((event) => event.type === MessageChannelEvent.MessageAcknowledged)
			.length
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
			if (currentIdFilter) {
				result = result.filter((event) => {
					const id = getMessageId(event);

					// Check direct ID match
					if (id === currentIdFilter) {
						return true;
					}

					// Check causal history for ID match
					if (
						(event.type === MessageChannelEvent.MessageSent ||
							event.type === MessageChannelEvent.MessageReceived) &&
						event.payload.causalHistory
					) {
						return event.payload.causalHistory.some(
							(dependency) => dependency.messageId === currentIdFilter
						);
					}

					return false;
				});
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
			currentIdFilter = id;
		}
	}

	// Handle dependency click to filter by dependency messageId
	function handleDependencyClick(messageId: string, event: Event) {
		// Stop event propagation so it doesn't trigger parent click handler
		event.stopPropagation();
		currentIdFilter = messageId;
	}

	// Clear ID filter
	function clearIdFilter() {
		currentIdFilter = null;
	}

	// Toggle legend display
	function toggleLegend() {
		showLegend = !showLegend;
	}

	onMount(async () => {
		identicon = await getIdenticon();
		// Subscribe to the event stream and collect events
		unsubscribe = subscribeToAllEventsStream((event) => {
			// Add event to history with newest at the top
			if (event.type === MessageChannelEvent.MissedMessages) {
				return;
			}
			history = [event, ...history];
		});
		(window as any).saveHistory = saveHistory;
	});

	onDestroy(() => {
		// Clean up the subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}
	});

	const saveHistory = () => {
		const sampleHistory = history.map((event) => {
			if((event.payload as any).bloomFilter) {
				(event.payload as any).bloomFilter = new Uint8Array([0, 0, 0, 0]);
			}
			return {
				type: event.type,
				payload: event.payload
			};
		});
		localStorage.setItem('history', JSON.stringify(sampleHistory));
	};
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

	{#if currentIdFilter}
		<div class="id-filter-badge">
			<span class="id-label">ID: {currentIdFilter}</span>
			<button class="clear-filter-btn" onclick={clearIdFilter}>×</button>
		</div>
	{/if}

	{#each filteredHistory as event, index}
		<HistoryItem 
			{event}
			identicon={identicons[index]}
			currentIdFilter={currentIdFilter}
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
		overflow: hidden;
	}

	.virtualizer-container {
		flex: 1;
		overflow: auto;
		padding: 10px;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 8px;
	}

	.help-button {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background-color: #f3f4f6;
		border: 1px solid #d1d5db;
		color: #4b5563;
		font-weight: bold;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		margin-right: 8px;
		transition: all 0.2s;
	}

	.help-button:hover {
		background-color: #e5e7eb;
		color: #1f2937;
	}

	.item-filter {
		flex: 1;
		padding: 8px;
		border-radius: 4px;
		border: 1px solid #ddd;
	}

	.id-filter-badge {
		display: flex;
		align-items: center;
		background-color: #f3f4f6;
		border-radius: 16px;
		padding: 4px 12px;
		margin: 8px;
		max-width: fit-content;
		font-size: 12px;
	}

	.id-label {
		font-family: monospace;
		margin-right: 8px;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.clear-filter-btn {
		background: none;
		border: none;
		color: #6b7280;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		padding: 0 4px;
	}

	.clear-filter-btn:hover {
		color: #1f2937;
	}
</style>
