import { derived } from 'svelte/store';
import { connectionState } from './waku/waku.svelte';

// A derived store that provides both connection state and utility functions
export const wakuConnection = derived(
  connectionState,
  ($connectionState) => {
    const isConnected = $connectionState.status === 'connected';
    const isConnecting = $connectionState.status === 'connecting' || $connectionState.status === 'waiting_for_peers' || $connectionState.status === 'setting_up_subscriptions';
    const hasError = $connectionState.status === 'error';
    // const errorMessage = $connectionState.error;

    return {
      // Current connection state
      status: $connectionState.status,
      error: $connectionState.error,
      
      // Utility getters
      isConnected,
      isConnecting,
      hasError,
      
      // Utility functions
      disableIfNotConnected: (extraCondition = true) => {
        return !isConnected || !extraCondition;
      },
      
      // Function to get button attributes based on connection state
      getButtonProps: (extraDisableCondition = true) => {
        const disabled = !isConnected || !extraDisableCondition;
        
        return {
          disabled,
          title: disabled && !extraDisableCondition 
            ? 'This action requires additional conditions to be met'
            : disabled 
              ? 'This action requires a connected Waku node' 
              : '',
          'aria-disabled': disabled,
          class: disabled ? 'opacity-50 cursor-not-allowed' : ''
        };
      }
    };
  }
); 