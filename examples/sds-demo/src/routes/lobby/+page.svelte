<script lang="ts">
	import ConnectionButton from '$lib/components/ConnectionButton.svelte';
	import { connectionState, joinLobby } from '$lib/waku/waku.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import CallToAction from '$lib/components/CallToAction.svelte';
	import { goto } from '$app/navigation';
	import { setMatch } from '$lib/utils/match.svelte';
	import { getOrCreateChannel } from '$lib/sds/channel.svelte';
	// Redirect to history page when connected
	let matchFound = $state(false);
	$effect(() => {
		if ($connectionState.status === 'connected' && matchFound) {
			goto('/state-graph');
		}
	});

	const afterConnect = (status: (state: string) => void) => {
		status('Finding match...');
		joinLobby()
			.then((params) => {
				getOrCreateChannel(params.matchId);
				setMatch(params);
				matchFound = true;
				status('Match found!');
			})
			.catch((error) => {
				status('Error finding match ' + error);
			});
	};
</script>

<PageLayout title="Scalable Data Sync" maxWidth="md">
	<div class="flex justify-center">
		<div class="perspective-500 flex h-64 w-64 items-center justify-center overflow-hidden">
			<img
				src="/waku-mark-primary-black.svg"
				alt="Waku Logo"
				class="h-full w-full scale-125 transform {$connectionState.status === 'connecting' ||
				$connectionState.status === 'waiting_for_peers' ||
				$connectionState.status === 'setting_up_subscriptions' ||
				$connectionState.status === 'connected'
					? 'animate-spin-y'
					: ''}"
			/>
		</div>
	</div>

	<CallToAction
		message="Connect to the Waku network to get started"
		useSlot={true}
		marginTop="sm:mt-0 mt-10"
		messageMarginBottom="mb-4"
	>
		<div class="flex w-full justify-center">
			<ConnectionButton size="large" afterConnect={afterConnect} />
		</div>
	</CallToAction>
</PageLayout>

<style>
	.perspective-500 {
		perspective: 500px;
	}

	@keyframes spin-y {
		0% {
			transform: scale(1.25) rotateY(0deg);
		}
		50% {
			transform: scale(1.25) rotateY(180deg);
		}
		100% {
			transform: scale(1.25) rotateY(360deg);
		}
	}

	.animate-spin-y {
		animation: spin-y 10s infinite linear;
		transform-style: preserve-3d;
	}
</style>
