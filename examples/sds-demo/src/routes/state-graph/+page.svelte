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
	<div class="mx-1 flex h-full flex-row" style="overflow: hidden;">
		<!-- History Sidebar -->
		<div
			class="top-0 right-0 left-0 mr-1 rounded-lg bg-white sm:shadow-md"
			style="
    background-color: rgb(201 201 201);
    display: flex;
"
		>
			<History channelId={match?.matchId ?? null} />
		</div>

		<div class="flex w-full flex-col overflow-hidden">
			<!-- Summary State Graph -->
			<div
				class="top-0 right-0 left-0 mb-1 h-full w-full flex-5 basis-3/4 rounded-lg bg-white p-8 sm:shadow-md"
				style="
    background-color: rgb(182 195 206);
        align-content: center;
		overflow: auto;
"
			>
				<StateGraphSummary channelId={match?.matchId ?? null} />
			</div>
		</div>
	</div>
{/if}
