<script lang="ts">
	import { MessageChannelEvent } from '@waku/sds';
	import type { MessageChannelEventObject } from '$lib/sds/stream';
	import { getMessageId } from '$lib/sds/message';
	import { eventColors, eventNames } from '$lib/utils/event.svelte';

	export let event: MessageChannelEventObject | undefined = undefined;
	export let identicon: string = '';
	export let currentIdFilter: string | null = null;
	export let onEventClick: (id: string | null) => void = () => {};
	export let onDependencyClick: (messageId: string, event: Event) => void = () => {};
	export let width: number = 340;
	export let height: number = 178;

	export let overflow: boolean = true;

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
		transition: transform 0.2s ease;
	}

	.history-item:not(.empty):hover {
		transform: translateX(2px);
	}

	.history-item:not(.empty) {
		cursor: pointer;
	}

	.empty {
		border: 1px dashed rgba(107, 79, 138, 0.2);
		border-radius: 12px;
		background-color: #f8f3ff;
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
		border-radius: 12px;
		width: 100%;
		min-height: 70px;
		color: white;
		padding: 12px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
		position: relative;
		transition: all 0.3s ease;
		border: none;
		overflow: hidden;
	}
	
	.event-box::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
		z-index: 1;
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
		opacity: 0.9;
		padding: 8px 14px;
		border-radius: 10px;
		color: white;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
	}
	
	.dependency-box::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
		z-index: 1;
	}

	.highlight {
		border-left: 4px solid #FFC107;
		border-right: 4px solid #FFC107;
		position: relative;
		background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
		animation: pulse 1.5s infinite;
	}

	.highlight .event-type {
		font-size: 16px;
		color: white;
		font-weight: bold;
		letter-spacing: 0.5px;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	}

	.highlight .event-id,
	.dependency-box.highlight {
		font-weight: bold;
		letter-spacing: 0.5px;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	}

	.dependency-box.highlight {
		font-size: 12px;
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

	.identicon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		overflow: hidden;
		margin-right: 14px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 2;
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
		position: relative;
		z-index: 2;
	}

	.event-type {
		font-size: 14px;
		font-weight: bold;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		letter-spacing: 0.05em;
	}

	.event-id {
		font-family: monospace;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.8);
		max-width: 220px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lamport-timestamp {
		position: absolute;
		top: 12px;
		right: 14px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		background-color: rgba(0, 0, 0, 0.15);
		padding: 3px 8px;
		border-radius: 10px;
		z-index: 2;
	}

	.sent-or-received {
		position: absolute;
		top: 12px;
		right: 14px;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
		background-color: rgba(0, 0, 0, 0.15);
		padding: 3px 8px;
		border-radius: 10px;
		z-index: 2;
	}
</style> 