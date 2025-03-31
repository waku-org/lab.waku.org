<script lang="ts">
    // import "../tailwind.css";
    import "../app.css";
    import Header from "$lib/components/Header.svelte";
    import ConnectionIndicator from "$lib/components/ConnectionIndicator.svelte";
    import ActionModule from "$lib/components/ActionModule.svelte";
    import { Toaster } from 'svelte-sonner';
    import { onMount } from 'svelte';
    import { loadIdenticon } from '$lib/identicon.svelte';
  
    onMount(async () => {
      await loadIdenticon();
    });
  </script>
  
  <div id="layout-container" class="fixed inset-0 overflow-hidden flex flex-col">
    <Header>
      <ActionModule />
      <ConnectionIndicator />
    </Header>
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
  
  <Toaster />
  