<script lang="ts">
  import { startWaku, connectionState } from "../waku/waku.svelte";

  export let size = "normal"; // can be "normal" or "large"

  async function handleConnect() {
    try {
      await startWaku();
    } catch (error) {
      // Error is already handled in startWaku function
      console.error("Connection error in component:", error);
    }
  }
</script>

<div class="connection-ui {size}">
  {#if $connectionState.status === "disconnected"}
    <button
      on:click={handleConnect}
      class="text-blue-600 hover:text-blue-800 font-medium">Connect →</button
    >
  {:else if $connectionState.status === "connecting"}
    <span class="status animated-dots">Starting node . . .</span>
  {:else if $connectionState.status === "waiting_for_peers"}
    <span class="status animated-dots">Waiting for peers . . .</span>
  {:else if $connectionState.status === "setting_up_subscriptions"}
    <span class="status animated-dots">Setting up subscriptions . . .</span>
  {:else if $connectionState.status === "connected"}
    <span class="status connected">Connected</span>
  {:else if $connectionState.status === "error"}
    <div class="error-container">
      <span class="error">Error: {$connectionState.error}</span>
      <button on:click={handleConnect} class="text-blue-600 hover:text-blue-800 font-medium">Retry</button>
    </div>
  {/if}
</div>

<style>
  .connection-ui {
    display: flex;
    align-items: center;
  }

  .connection-ui.large button {
    font-size: 1.1rem;
  }

  .connection-ui.large .status {
    font-size: 1.1rem;
    padding: 0.75rem 1.5rem;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .connection-ui.normal .error-container {
    align-items: flex-end;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    font-weight: 500;
    padding: 0;
  }

  .status {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: #e5e7eb;
    color: #374151;
  }

  .status.connected {
    background-color: #d1fae5;
    color: #065f46;
  }

  .error {
    color: #b91c1c;
    background-color: #fee2e2;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }

  .connection-ui.large .error {
    font-size: 1rem;
    max-width: 600px;
  }

  .animated-dots {
    animation: dotAnimation 1.5s infinite;
  }
  
  @keyframes dotAnimation {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
</style>
