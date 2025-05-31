<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		startSending as startSendingHistory,
		subscribe,
		sweepIn,
		sweepOut
	} from '$lib/sds.svelte';
	import { wakuNode } from '$lib/waku/waku.svelte';
	import { getOrCreateChannel } from '$lib/sds/channel.svelte';
	import { send } from '$lib/waku/pingpong.svelte';
	import { randomBytes } from '@noble/hashes/utils';
	import { getMatch } from '$lib/utils/match.svelte';
	import type { MatchParams } from '$lib/waku/waku.svelte';
	import { page } from '$app/state';

	let match = $state<MatchParams | undefined>(undefined);
	let sendingInterval: NodeJS.Timeout | null = null;
	let isSending = false;
	let isListening = false;
	let messageOption = '1'; // Options: '1', '5', '10', 'continuous'
	let showDropdown = false;
	let sweepInterval: NodeJS.Timeout | null = null;

	function startSending() {
		match = getMatch();
		if (!match) {
			startSendingHistory();
		} else {
			const channel = getOrCreateChannel(match.matchId);
			send(channel, randomBytes(32));
		}
	}

	function sweep() {
		sweepIn();
		sweepOut();
	}

	// Set up periodic sweep on component mount
	onMount(() => {
    page
		match = getMatch();
		sweepInterval = setInterval(sweep, 5000); // Call sweep every 5 seconds
		return () => {
			if (sweepInterval) clearInterval(sweepInterval);
		};
	});

	function toggleSending() {
		if (isSending) {
			// Stop sending
			if (sendingInterval) {
				clearInterval(sendingInterval);
				sendingInterval = null;
			}
			isSending = false;
		} else {
			// Handle different message count options
			if (messageOption === 'continuous') {
				// Start sending periodically (every 2 seconds)
				startSending(); // Send immediately once
				sendingInterval = setInterval(() => {
					startSending();
				}, 2000);
				isSending = true;
			} else {
				// Send a specific number of messages
				const count = parseInt(messageOption);
				let sent = 0;

				const sendBatch = () => {
					startSending();
					sent++;

					if (sent >= count) {
						clearInterval(sendingInterval!);
						sendingInterval = null;
						isSending = false;
					}
				};

				sendBatch(); // Send first message immediately
				if (count > 1) {
					sendingInterval = setInterval(sendBatch, 2000);
					isSending = true;
				}
			}
		}
	}

	function selectOption(option: string) {
		messageOption = option;
		showDropdown = false;
	}

	function toggleListening() {
		match = getMatch();
		if (match) {
			if (listening.listening) {
				listening.listening = false;
			}
			return;
		} else {
			if (!isListening) {
				subscribe();
				isListening = true;
			} else {
				wakuNode.unsubscribe();
				isListening = false;
			}
		}
	}

	onDestroy(() => {
		// Clean up interval when component is destroyed
		if (sendingInterval) {
			clearInterval(sendingInterval);
		}
		// Clean up sweep interval
		if (sweepInterval) {
			clearInterval(sweepInterval);
		}
		// Ensure we unsubscribe when component is destroyed
		if (isListening) {
			wakuNode.unsubscribe();
		}
	});
</script>

<div class="action-buttons">
	{#if !match}
	<button class="listen-button" on:click={toggleListening}>
		{isListening ? 'Stop Listening' : 'Listen'}
	</button>
  {/if}

	<div class="send-dropdown-container">
		<button class="send-button" on:click={toggleSending}>
			{isSending ? 'Stop Sending' : 'Send'}
		</button>

		<button class="dropdown-toggle" on:click={() => (showDropdown = !showDropdown)}>
			{messageOption === 'continuous' ? '∞' : messageOption}
			<span class="arrow">▼</span>
		</button>

		{#if showDropdown}
			<div class="dropdown-menu">
				<div class="dropdown-item" on:click={() => selectOption('1')}>1</div>
				<div class="dropdown-item" on:click={() => selectOption('5')}>5</div>
				<div class="dropdown-item" on:click={() => selectOption('10')}>10</div>
				<div class="dropdown-item" on:click={() => selectOption('continuous')}>∞</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.action-buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	button {
		padding: 0.4rem 1rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		min-width: 80px;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.listen-button {
		background-color: #10b981;
		color: white;
	}

	.listen-button:hover:not(:disabled) {
		background-color: #059669;
	}

	.send-button {
		background-color: #3b82f6;
		color: white;
	}

	.send-button:hover {
		background-color: #2563eb;
	}

	.send-dropdown-container {
		position: relative;
		display: flex;
	}

	.dropdown-toggle {
		background-color: #2563eb;
		color: white;
		border-radius: 0 4px 4px 0;
		border-left: 1px solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		padding: 0.4rem 0.6rem;
		min-width: auto;
	}

	.dropdown-toggle .arrow {
		font-size: 0.7rem;
		margin-left: 4px;
	}

	.send-button {
		border-radius: 4px 0 0 4px;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: white;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 10;
		min-width: 120px;
		margin-top: 4px;
	}

	.dropdown-item {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.dropdown-item:hover {
		background-color: #f0f9ff;
	}
</style>
