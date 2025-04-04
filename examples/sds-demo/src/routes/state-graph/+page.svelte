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
		gap: 16px;
		overflow: hidden;
		background: linear-gradient(135deg, #f0e6ff 0%, #f8f3ff 100%);
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
		background-color: #f8f3ff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		padding: 20px;
		overflow: auto;
		position: relative;
		border-left: 4px solid #F59E0B;
		border-right: 4px solid #F59E0B;
	}

	.state-graph-panel::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(to right, #F59E0B, #9966CC, #F59E0B);
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
	}

	.state-graph-panel::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(to right, #F59E0B, #9966CC, #F59E0B);
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;
	}
	
	.panel-header {
		margin-bottom: 20px;
		text-align: center;
		position: relative;
	}
	
	.panel-header h2 {
		font-size: 20px;
		color: #6B4F8A;
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
		left: 10%;
		right: 10%;
		height: 2px;
		background: linear-gradient(90deg, transparent, #F59E0B, transparent);
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
