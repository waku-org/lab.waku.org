<script lang="ts">
	import { subscribeToAllEventsStream } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { getMessageId } from '$lib/sds/message';
	import type { MessageChannelEventObject } from '$lib/sds/stream';

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
	});

	onDestroy(() => {
		// Clean up the subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="history-container">
	<select class="item-filter" onchange={handleFilterChange} value={currentFilter}>
		<option value="all">All ({eventCounts.all})</option>
		<option value="sent">Sent ({eventCounts.sent})</option>
		<option value="received">Received ({eventCounts.received})</option>
		<option value="delivered">Delivered ({eventCounts.delivered})</option>
		<option value="acknowledged">Acknowledged ({eventCounts.acknowledged})</option>
	</select>

	{#if currentIdFilter}
		<div class="id-filter-badge">
			<span class="id-label">ID: {currentIdFilter}</span>
			<button class="clear-filter-btn" onclick={clearIdFilter}>×</button>
		</div>
	{/if}

	{#each filteredHistory as event, index}
		{@const color = eventColors[event.type] || '#888'}
		{@const name = eventNames[event.type] || event.type}
		{@const id = getMessageId(event)}
		{@const matchesFilter = currentIdFilter && id === currentIdFilter}
		<div class="history-item" onclick={() => handleEventClick(id)}>
			<div class="item-container">
				<div
					class="event-box {matchesFilter ? 'highlight' : ''}"
					style="background-color: {color};"
				>
					<div class="identicon">
						<img src="data:image/svg+xml;base64,{identicons[index]}" alt="Identicon" />
					</div>
					<div class="event-info">
						<div class="event-type">
							{name}
						</div>
						<div class="event-id">
							{id}
						</div>
					</div>
					{#if event.type === MessageChannelEvent.MessageDelivered}
						<div class="lamport-timestamp">
							{event.payload.sentOrReceived}
						</div>
					{/if}
					{#if event.type === MessageChannelEvent.MessageSent || event.type === MessageChannelEvent.MessageReceived}
						<div class="lamport-timestamp">
							{event.payload.lamportTimestamp}
						</div>
					{/if}
				</div>
				{#if event.type === MessageChannelEvent.MessageSent || event.type === MessageChannelEvent.MessageReceived}
					{#each event.payload.causalHistory as dependency}
						{@const dependencyMatchesFilter =
							currentIdFilter && dependency.messageId === currentIdFilter}
						<div
							class="dependency-box {dependencyMatchesFilter ? 'highlight' : ''}"
							style="background-color: {color};"
							onclick={(event) => handleDependencyClick(dependency.messageId, event)}
						>
							{dependency.messageId}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/each}
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

	.history-item {
		padding: 8px;
		width: 100%;
		cursor: pointer;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
		width: 100%;
	}

	.event-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-radius: 8px;
		width: 100%;
		min-height: 70px;
		color: white;
		padding: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: box-shadow 0.3s ease;
	}

	.dependency-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		width: auto;
		max-width: 80%;
		min-height: 40px;
		font-size: 11px;
		font-family: monospace;
		opacity: 0.85;
		padding: 6px 12px;
		border-radius: 8px;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
	}

	.highlight {
		border-left: 4px solid white;
		border-right: 4px solid white;
		position: relative;
		background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
	}

	.highlight .event-type {
		font-size: 16px;
		color: white;
		font-weight: bold;
		font-style: italic;
		letter-spacing: 0.5px;
	}

	.highlight .event-id,
	.dependency-box.highlight {
		/* color: white; */
		font-weight: bold;
		font-style: italic;
		letter-spacing: 0.5px;
	}

	.dependency-box.highlight {
		font-size: 12px;
		/* background-color: rgba(255, 255, 255, 0.2) !important; */
	}

	.identicon {
		width: 40px;
		height: 40px;
		border-radius: 4px;
		overflow: hidden;
		margin-right: 12px;
	}

	.identicon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.identicon-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.2);
		margin-right: 12px;
	}

	.event-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.event-type {
		font-size: 14px;
		font-weight: bold;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.event-id {
		font-family: monospace;
		font-size: 10px;
		color: rgba(255, 255, 255, 0.7);
		max-width: 220px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lamport-timestamp {
		position: absolute;
		top: 8px;
		right: 12px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}

	.id-filter-badge {
		display: flex;
		align-items: center;
		background-color: #f3f4f6;
		border-radius: 16px;
		padding: 4px 12px;
		margin: 8px 0;
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
