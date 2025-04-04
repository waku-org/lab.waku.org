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
	$: color = event ? eventColors[event.type] || '#888' : '#f0f0f0';
	$: name = event ? eventNames[event.type] || event.type : '';
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

<div
	class="history-item {!event ? 'empty' : ''}"
	style="width: 100%;"
	on:click={event ? handleEventClick : undefined}
>
	{#if event}
		<div class="item-container">
			<div class="event-box {matchesFilter ? 'highlight' : ''}" style="background-color: {color};">
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
				{#if event.type === MessageChannelEvent.MessageSent || event.type === MessageChannelEvent.MessageReceived || event.type === MessageChannelEvent.SyncSent || event.type === MessageChannelEvent.SyncReceived}
					<div class="lamport-timestamp">
						{event.payload.lamportTimestamp}
					</div>
				{/if}
			</div>
			{#if event.type === MessageChannelEvent.MessageSent || event.type === MessageChannelEvent.MessageReceived || event.type === MessageChannelEvent.SyncSent || event.type === MessageChannelEvent.SyncReceived}
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
