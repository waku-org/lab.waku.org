<script lang="ts">
    import { connectionState } from "$lib/waku/waku.svelte";
    import History from "$lib/components/History.svelte";
    import Missing from "$lib/components/Missing.svelte";
    import PageLayout from "$lib/components/PageLayout.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    // Redirect to home page if not connected
    onMount(() => {
      if ($connectionState.status !== "connected") {
        goto('/');
      }
    });
  
    // Also watch for disconnection
    $effect(() => {
      if ($connectionState.status !== "connected") {
        goto('/');
      }
    });
  </script>
  
<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4">
  <div class="flex-1 w-full">
    <PageLayout title="History" maxWidth="2xl" padding="sm:p-6 px-4" margin="sm:my-6 my-4">
      <History />
    </PageLayout>
  </div>
  
  <div class="flex-1 w-full">
    <PageLayout title="Missing" maxWidth="2xl" padding="sm:p-6 px-4" margin="sm:my-6 my-4">
      <Missing />
    </PageLayout>
  </div>
</div>
  