<script lang="ts">
	import {
		subscribeToAllEventsStream,
		subscribeToChannelEvents,
		subscribeToMissingMessageStream
	} from '$lib/sds/stream.svelte';
	import { MessageChannelEvent, type HistoryEntry } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { getMessageId } from '$lib/sds/message';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import HistoryItem from './HistoryItem.svelte';
	import LegendModal from './LegendModal.svelte';
	import { currentIdFilter, eventColors } from '$lib/utils/event.svelte';
	import { hash } from '$lib/utils/hash';
	import { encodeBase64 } from 'effect/Encoding';

	// Store for history items
	let history: HistoryEntry[] = $state([]);
	let identicon: any = $state(null);
	let currentFilter: string = $state('all');
	let showLegend: boolean = $state(false);

	let { channelId = null }: { channelId: string | null } = $props();

	// Filtered history based on selected filter and ID filter
	let filteredHistory = $derived(
		(() => {
			// Then filter by ID if present
			if (currentIdFilter.id) {
				return history.filter((event) => event.messageId === currentIdFilter.id);
			}

			return history;
		})()
	);

	let identicons = $derived(
		identicon &&
			filteredHistory.map((event: HistoryEntry) => {
				const id = event.messageId;
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

	const active: { [messageId: string]: boolean } = $state({});
	const log: Set<string> = $state(new Set());

	function eventStreamCallback(event: MessageChannelEventObject) {
		if (event.type !== MessageChannelEvent.MissedMessages) {
			return;
		}
		console.log('missed messages', event);
		event.payload.forEach((message) => {
			if (!log.has(message.messageId)) {
				history.push(message);
				log.add(message.messageId);
			}
		});
		// history = event.payload;
	}

	onMount(async () => {
		identicon = await getIdenticon();
		// Subscribe to the event stream and collect events
		unsubscribe = channelId
			? subscribeToChannelEvents(channelId, eventStreamCallback)
			: subscribeToMissingMessageStream(eventStreamCallback);
	});

	onDestroy(() => {
		// Clean up the subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}
	});

	const color = eventColors[MessageChannelEvent.MissedMessages];
</script>

<div class="history-container">

	{#if currentIdFilter.id}
		<div class="id-filter-badge">
			<span class="id-label">ID: {currentIdFilter.id}</span>
			<button class="clear-filter-btn" onclick={clearIdFilter}>×</button>
		</div>
	{/if}

	<div class="history-items-container">
		{#each filteredHistory as event, index}
			<div class="history-item {!event ? 'empty' : ''}" style="width: 100%; height: 100px;">
				{#if event}
					<div class="item-container">
						<div class="event-box" style="background-color: {color};">
							<div class="identicon">
								<img src="data:image/svg+xml;base64,{identicons[index]}" alt="Identicon" />
							</div>
							<div class="event-info">
								<div class="event-type"></div>
								<div class="event-id">
									{event.messageId}
								</div>
							</div>
						</div>
						<!-- {#if event.retrievalHint}
							<div class="dependency-box" style="background-color: {color};">
								{encodeBase64(event.retrievalHint)}
							</div>
						{/if} -->
					</div>
				{/if}
			</div>
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

	.item-filter:hover,
	.item-filter:focus {
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
	.id-filter-badge,
	.header,
	.item-filter {
		max-width: 100%;
		box-sizing: border-box;
	}

	.history-item {
		padding: 8px;
		box-sizing: border-box;
		transition: transform 0.2s ease;
		width: 100%;
		max-width: 100%;
	}

	.history-item:not(.empty):hover {
		transform: translateX(2px);
	}

	.history-item:not(.empty) {
		cursor: pointer;
	}

	.empty {
		border: 1px dashed rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		background-color: #ffffff;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.event-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-radius: 4px;
		width: 100%;
		min-height: 60px;
		color: white;
		padding: 12px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
		transition: all 0.2s ease;
		border: none;
		box-sizing: border-box;
		overflow: hidden;
	}

	.dependency-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
		width: auto;
		max-width: 80%;
		min-height: 30px;
		font-size: 11px;
		font-family: monospace;
		opacity: 0.9;
		padding: 6px 10px;
		border-radius: 4px;
		color: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}

	.highlight {
		border-left: 2px solid #db8d43;
		border-right: 2px solid #db8d43;
	}

	.highlight .event-type {
		font-size: 15px;
		color: white;
		font-weight: bold;
	}

	.highlight .event-id,
	.dependency-box.highlight {
		font-weight: bold;
	}

	.dependency-box.highlight {
		font-size: 12px;
	}

	.identicon {
		width: 36px;
		height: 36px;
		border-radius: 4px;
		overflow: hidden;
		margin-right: 12px;
		position: relative;
	}

	.identicon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
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
		font-size: 11px;
		color: rgba(255, 255, 255, 0.8);
		max-width: 220px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.lamport-timestamp {
		position: absolute;
		top: 12px;
		right: 14px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		background-color: rgba(0, 0, 0, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
	}

	.sent-or-received {
		position: absolute;
		top: 12px;
		right: 14px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		background-color: rgba(0, 0, 0, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
	}
</style>
