<script lang="ts">
  import ActionButtons from './ActionButtons.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { processQueue } from '$lib/sds.svelte';
  import { connectionState } from '../waku/waku.svelte';

  let isComponentMounted = false;

  async function runProcessQueue() {
    if (!isComponentMounted) return;
    
    await processQueue();
    
    // Schedule the next run if component is still mounted
    if (isComponentMounted) {
      setTimeout(runProcessQueue, 1000);
    }
  }

  onMount(() => {
    isComponentMounted = true;
    runProcessQueue();
  });

  onDestroy(() => {
    isComponentMounted = false;
  });
</script>

{#if $connectionState.status === "connected"}
  <div class="compact-action-module">
    <ActionButtons />
  </div>
{/if}

<style>
  .compact-action-module {
    display: flex;
    margin-right: 1rem;
  }
</style> 