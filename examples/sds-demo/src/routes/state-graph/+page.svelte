<script lang="ts">
	import History from '$lib/components/History.svelte';
	import StateGraphSummary from '$lib/components/StateGraphSummary.svelte';

	import { getMatch } from '$lib/utils/match.svelte';
	import { goto } from '$app/navigation';
	import type { MatchParams } from '$lib/waku/waku.svelte';
	import { onMount } from 'svelte';
	import { start } from '$lib/waku/pingpong.svelte';
	let match = $state<MatchParams | undefined>(undefined);
	onMount(() => {
		match = getMatch();
		if (!match) {
			goto('/lobby');
		} else {
			start(match);
		}
	});
</script>

{#if match}
	<div class="main-container">
		<!-- History Sidebar -->
		<div class="history-panel">
			<History channelId={match?.matchId ?? null} />
		</div>

		<div class="state-container">
			<!-- Summary State Graph -->
			<div class="state-graph-panel">
				<div class="panel-header">
					<h2>State Synchronization Visualization</h2>
				</div>
				<StateGraphSummary channelId={match?.matchId ?? null} />
			</div>
		</div>
	</div>
{/if}

<style>
	.main-container {
		display: flex;
		flex-direction: row;
		height: 100%;
		padding: 16px;
		gap: 20px;
		overflow: hidden;
		background-color: #f5f2e8; /* Light beige background similar to example */
	}

	.history-panel {
		flex: 0 0 400px;
		display: flex;
	}

	.state-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		scrollbar-width: none;
	}

	.state-graph-panel {
		height: 100%;
		background-color: #ffffff;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 24px;
		overflow: auto;
		position: relative;
		border: 1px solid #e0ddd4;
	}

	.panel-header {
		margin-bottom: 24px;
		text-align: center;
		position: relative;
	}
	
	.panel-header h2 {
		font-size: 20px;
		color: #333333;
		font-weight: 600;
		margin: 0;
		padding: 0 0 10px 0;
		position: relative;
		display: inline-block;
	}
	
	.panel-header h2::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #e0ddd4;
	}

	@media (max-width: 1200px) {
		.main-container {
			flex-direction: column;
		}
		
		.history-panel {
			flex: 0 0 300px;
		}
		
		.state-container {
			flex: 1;
		}
	}
</style>
