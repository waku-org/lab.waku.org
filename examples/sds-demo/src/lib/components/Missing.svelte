<script lang="ts">
	import { subscribeToMissingMessageStream } from '$lib/sds/stream.svelte';
	import { MessageChannelEvent, type HistoryEntry } from '@waku/sds';
	import { onMount, onDestroy } from 'svelte';
	import { getIdenticon } from '$lib/identicon.svelte';
	import { bytesToHex } from '@waku/utils/bytes';
	// Map event types to colors using index signature
	const eventColors: { [key in string]: string } = {
		[MessageChannelEvent.MessageSent]: '#3B82F6', // blue
		[MessageChannelEvent.MessageDelivered]: '#10B981', // green
		[MessageChannelEvent.MessageReceived]: '#8B5CF6', // purple
		[MessageChannelEvent.MessageAcknowledged]: '#059669', // dark green
		[MessageChannelEvent.PartialAcknowledgement]: '#6D28D9', // dark purple
		[MessageChannelEvent.MissedMessages]: '#EF4444' // red
	};

	// Store for history items
	let missedMessages: HistoryEntry[] = $state([]);
	let identicon: any = $state(null);

	let identicons = $derived(
		identicon &&
			missedMessages.map((entry) => {
				const id = entry.messageId;
				return new identicon(id, { size: 40, format: 'svg' }).toString();
			})
	);

	// Unsubscribe function
	let unsubscribe: (() => void) | null = $state(null);

	onMount(async () => {
		identicon = await getIdenticon();
		// Subscribe to the event stream and collect events
		if (unsubscribe) {
			unsubscribe();
		}
		unsubscribe = subscribeToMissingMessageStream((event) => {
			missedMessages = event.payload;
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
	{#each missedMessages as entry, index}
		{@const color = eventColors[MessageChannelEvent.MissedMessages]}
		<div class="history-item">
			<div class="item-container">
				<div class="event-box" style="background-color: {color};">
					<div class="identicon">
						<img src="data:image/svg+xml;base64,{identicons[index]}" alt="Identicon" />
					</div>
					<div class="event-info">
						<div class="event-id">
							{entry.messageId}
						</div>
						{#if entry.retrievalHint}
							<div class="event-id">
								{bytesToHex(entry.retrievalHint)}
							</div>
						{/if}
					</div>
				</div>
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
	}

	.event-box.dependency {
		margin-left: 0;
		margin-right: 0;
		margin-left: auto;
		width: auto;
		max-width: 80%;
		min-height: 40px;
		font-size: 11px;
		font-family: monospace;
		opacity: 0.85;
		padding: 6px 12px;
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
</style>
