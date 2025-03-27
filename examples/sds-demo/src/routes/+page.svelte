<script lang="ts">
	import ConnectionButton from "$lib/components/ConnectionButton.svelte";
	import { connectionState } from "$lib/waku/waku.svelte";
	import PageLayout from "$lib/components/PageLayout.svelte";
	import CallToAction from "$lib/components/CallToAction.svelte";
	import { goto } from "$app/navigation";
	// Redirect to history page when connected
	$effect(() => {
	  if ($connectionState.status === "connected") {
		goto('/history');
	  }
	});
  </script>
  
  <PageLayout title="Scalable Data Sync" maxWidth="md">
	<div class="flex justify-center">
	  <div class="w-64 h-64 overflow-hidden flex items-center justify-center perspective-500">
		<img 
		  src="/waku-mark-primary-black.svg" 
		  alt="Waku Logo" 
		  class="w-full h-full transform scale-125 {$connectionState.status === 'connecting' || $connectionState.status === 'waiting_for_peers' || $connectionState.status === 'setting_up_subscriptions' || $connectionState.status === 'connected' ? 'animate-spin-y' : ''}" 
		/>
	  </div>
	</div>
	
	<CallToAction 
	  message="Connect to the Waku network to get started"
	  useSlot={true}
	  marginTop="sm:mt-0 mt-10"
	  messageMarginBottom="mb-4"
	>
	  <div class="w-full flex justify-center">
		<ConnectionButton size="large" />
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
  