<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { connectionState, startWaku } from "../waku/waku.svelte";
  import { HealthStatus } from "@waku/sdk";
  import { health, unregisterHealthListener } from "../waku/waku.svelte";
  import { page } from '$app/state';

  let healthStatus = $state(HealthStatus.Unhealthy);
  let isHomePage = $state(false);
  let shouldShowConnectButton = $state(false);

  function startHealthCheck() {
     health((health: HealthStatus) => {
      healthStatus = health;
    });
  }

  function stopHealthCheck() {
    unregisterHealthListener((health: HealthStatus) => {
      healthStatus = health;
    });
  }

  $effect(() => {
    if ($connectionState.status === "connected") {
      startHealthCheck();
    } else {
      stopHealthCheck();
    }
  });

  onMount(() => {
    if ($connectionState.status === "connected") {
      startHealthCheck();
    }
  });

  onDestroy(() => {
    stopHealthCheck();
  });

  function getHealthColor(status: HealthStatus) {
    if ($connectionState.status !== "connected") {
      return "gray";
    }
    switch (status) {
      case HealthStatus.SufficientlyHealthy:
        return "green";
      case HealthStatus.MinimallyHealthy:
        return "goldenrod";
      case HealthStatus.Unhealthy:
      default:
        return "red";
    }
  }

  function getHealthText(status: HealthStatus) {
    if ($connectionState.status !== "connected") {
      return "Node is not connected";
    }
    switch (status) {
      case HealthStatus.SufficientlyHealthy:
        return "Node is healthy";
      case HealthStatus.MinimallyHealthy:
        return "Node is minimally healthy";
      case HealthStatus.Unhealthy:
      default:
        return "Node is unhealthy";
    }
  }

  async function handleConnect() {
    try {
      await startWaku();
    } catch (error) {
      console.error("Connection error in header:", error);
    }
  }

  // Check if current route is not the home page
  $effect(() => {
    isHomePage = page.url.pathname ? page.url.pathname === "/" : true;
    updateButtonVisibility();
  });
  
  $effect(() => {
    updateButtonVisibility();
  });
  
  function updateButtonVisibility() {
    shouldShowConnectButton = !isHomePage && $connectionState.status !== "connected";
  }
</script>

<div class="connection-status">
  {#if shouldShowConnectButton}
    <div class="header-connection-ui">
      {#if $connectionState.status === "disconnected"}
        <button
          on:click={handleConnect}
          class="connect-button px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors duration-200 mr-2"
        >
          Connect
        </button>
      {:else if $connectionState.status === "connecting"}
        <span class="status animated-dots">Starting node</span>
      {:else if $connectionState.status === "waiting_for_peers"}
        <span class="status animated-dots">Waiting for peers</span>
      {:else if $connectionState.status === "setting_up_subscriptions"}
        <span class="status animated-dots">Setting up subscriptions</span>
      {:else if $connectionState.status === "error"}
        <div class="error-container">
          <button 
            on:click={handleConnect}
            class="connect-button px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors duration-200 mr-2"
          >
            Retry
          </button>
        </div>
      {/if}
    </div>
  {/if}
  <div class="status-wrapper">
    <div
      class="health-indicator"
      style="background-color: {getHealthColor(healthStatus)}"
    >
      <span class="tooltip">{getHealthText(healthStatus)}</span>
    </div>
  </div>
</div>

<style>
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .status-wrapper {
    position: relative;
    margin-right: 1rem;
  }

  .health-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    cursor: help;
    position: relative;
  }

  .tooltip {
    visibility: hidden;
    position: absolute;
    background-color: #333;
    color: white;
    text-align: center;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    
    /* Position the tooltip below */
    top: 100%;
    right: 0;  /* Align to the right instead of center since we're near screen edge */
    transform: translateX(0);  /* Remove horizontal centering */
    margin-top: 8px;
    
    /* Ensure tooltip stays in viewport */
    max-width: calc(100vw - 2rem);  /* Leave 1rem padding on each side */
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Add a small triangle pointer */
    &::before {
      content: "";
      position: absolute;
      bottom: 100%;
      right: 2px;  /* Align arrow with the indicator */
      transform: translateX(0);
      border-width: 4px;
      border-style: solid;
      border-color: transparent transparent #333 transparent;
    }
  }

  /* Add animation for smooth appearance */
  .health-indicator:hover .tooltip {
    visibility: visible;
    animation: fadeIn 0.2s ease-in-out;
  }

  .header-connection-ui {
    display: flex;
    align-items: center;
  }

  .connect-button {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
  }

  .status {
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
    border-radius: 4px;
    background-color: #e5e7eb;
    color: #374151;
    white-space: nowrap;
    margin-right: 0.5rem;
  }

  .error-container {
    display: flex;
    align-items: center;
  }

  .animated-dots {
    animation: dotAnimation 1.5s infinite;
  }
  
  @keyframes dotAnimation {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
