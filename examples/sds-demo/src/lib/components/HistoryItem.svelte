<script lang="ts">
	import { MessageChannelEvent } from '@waku/sds';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import { getMessageId } from '$lib/sds/message';

	export let event: MessageChannelEventObject | undefined = undefined;
	export let identicon: string = '';
	export let currentIdFilter: string | null = null;
	export let onEventClick: (id: string | null) => void = () => {};
	export let onDependencyClick: (messageId: string, event: Event) => void = () => {};
	export let width: number = 340;
	export let height: number = 178;

	export let overflow: boolean = true;

	// Map event types to colors using index signature
	const eventColors: { [key in string]: string } = {
		[MessageChannelEvent.MessageSent]: '#3B82F6', // blue
		[MessageChannelEvent.MessageDelivered]: '#10B981', // green
		[MessageChannelEvent.MessageReceived]: '#8B5CF6', // purple
		[MessageChannelEvent.MessageAcknowledged]: '#059669', // dark green
		[MessageChannelEvent.PartialAcknowledgement]: '#6D28D9', // dark purple
		[MessageChannelEvent.MissedMessages]: '#EF4444', // red
		[MessageChannelEvent.SyncSent]: '#F59E0B', // orange
		[MessageChannelEvent.SyncReceived]: '#F59E0B' // dark orange
	};

	// Event type to display name using index signature
	const eventNames: { [key in string]: string } = {
		[MessageChannelEvent.MessageSent]: 'Sent',
		[MessageChannelEvent.MessageDelivered]: 'Delivered',
		[MessageChannelEvent.MessageReceived]: 'Received',
		[MessageChannelEvent.MessageAcknowledged]: 'Acknowledged',
		[MessageChannelEvent.PartialAcknowledgement]: 'Partially Acknowledged',
		[MessageChannelEvent.MissedMessages]: 'Missed',
		[MessageChannelEvent.SyncSent]: 'Sync Sent',
		[MessageChannelEvent.SyncReceived]: 'Sync Received'
	};

	$: id = event ? getMessageId(event) : null;
	$: color = event ? (eventColors[event.type] || '#888') : '#f0f0f0';
	$: name = event ? (eventNames[event.type] || event.type) : '';
	$: matchesFilter = currentIdFilter && id === currentIdFilter;

	function handleEventClick() {
		if (event && id) {
			onEventClick(id);
		}
	}

	function handleDependencyClick(messageId: string, e: Event) {
		onDependencyClick(messageId, e);
	}
</script>

<div class="history-item {!event ? 'empty' : ''}" style="width: 100%; height: {height}px;" on:click={event ? handleEventClick : undefined}>
	{#if event}
		<div class="item-container">
			<div
				class="event-box {matchesFilter ? 'highlight' : ''}"
				style="background-color: {color};"
			>
				<div class="identicon">
					<img src="data:image/svg+xml;base64,{identicon}" alt="Identicon" />
				</div>
				<div class="event-info" style="overflow: {overflow ? 'visible' : 'hidden'};">
					<div class="event-type">
						{name}
					</div>
					<div class="event-id">
						{id}
					</div>
				</div>
				{#if event.type === MessageChannelEvent.MessageDelivered}
					<div class="sent-or-received">
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
						on:click={(e) => handleDependencyClick(dependency.messageId, e)}
					>
						{dependency.messageId}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.history-item {
		padding: 8px;
		box-sizing: border-box;
	}

	.history-item:not(.empty) {
		cursor: pointer;
	}

	.empty {
		border: 1px dashed #ccc;
		border-radius: 8px;
		background-color: #f9f9f9;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
		width: 100%;
		height: 100%;
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
		overflow: hidden;
		text-overflow: ellipsis;
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
		font-weight: bold;
		font-style: italic;
		letter-spacing: 0.5px;
	}

	.dependency-box.highlight {
		font-size: 12px;
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
		/* overflow: hidden; */
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

	.sent-or-received {
		position: absolute;
		top: 8px;
		right: 12px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}
</style> 