<script lang="ts">
    import { historyJson } from "$lib/data/history_sample";
    import type { MessageChannelEventObject } from "$lib/sds/stream";
    import { MessageChannelEvent } from "@waku/sds";
    import HistoryItem from "$lib/components/HistoryItem.svelte";
    import { onMount, onDestroy } from 'svelte';
    import { createTooltip } from '$lib/utils/tooltipUtils';
    
    // Parse history data
    const history: MessageChannelEventObject[] = JSON.parse(historyJson);
    
    // Create sample identicons (using a placeholder)
    const placeholderIdenticon = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNkZGQiLz48L3N2Zz4=";
    
    // Sample handler functions - they don't need to do anything in the legend
    function handleItemClick(id: string | null) {
        // No action needed for the legend
    }
    
    function handleDependencyClick(messageId: string, event: Event) {
        // Prevent event bubbling
        event.stopPropagation();
        // No action needed for the legend
    }
    
    // Get one sample of each event type for the legend
    const eventTypes = [
        MessageChannelEvent.MessageSent,
        MessageChannelEvent.MessageDelivered,
        MessageChannelEvent.MessageReceived,
        MessageChannelEvent.MessageAcknowledged,
        MessageChannelEvent.PartialAcknowledgement,
        MessageChannelEvent.MissedMessages
    ];
    
    // Find one event of each type to display in the legend
    let legendItems = history.slice(2, 6);
    
    // Simple tooltip text
    const leftTooltipText = "Messages are sent between peers in the network. Each message has a unique ID and can depend on other messages. Events like Sent, Received, Delivered and Acknowledged show the status of messages.";
    
    const rightTooltipText = "Dependencies represent messages that a current message depends on. They appear as smaller boxes below the main message.";
    
    const lamportTooltipText = "<b>Lamport timestamps</b> provide a way to order events in a distributed system. They increment with each message, ensuring a consistent ordering across all peers in the network, even without synchronized clocks.";
    
    const eventIdTooltipText = "Unique <b>Message ID</b> assigned to each message.";
    
    const dependencyContainerTooltipText = "Each message comes with <b>causal history</b> attached, containing the last two message IDs from the local history of the sender.";
    
    // Custom highlight classes
    const tooltipHighlightClass = "tooltip-highlight";
        
    console.log(legendItems);
    
    // Make isOpen bindable so parent can track when modal is closed
    export let isOpen = false;

    // Reference elements for tooltips
    let modalElement: HTMLElement;
    let leftAnchorElement: HTMLElement;
    let rightAnchorElement: HTMLElement;
    let lamportTimestampElement: HTMLElement | null = null;
    let eventIdElement: HTMLElement | null = null;
    let dependencyContainerElement: HTMLElement | null = null;
    // let leftTooltipRef: ReturnType<typeof createTooltip>;
    // let rightTooltipRef: ReturnType<typeof createTooltip>;
    let lamportTooltipRef: ReturnType<typeof createTooltip>;
    let eventIdTooltipRef: ReturnType<typeof createTooltip>;
    let dependencyContainerTooltipRef: ReturnType<typeof createTooltip>;

    // Handles closing the modal and updates the parent via bindable prop
    function closeModal() {
        isOpen = false;
    }

    // Cleanup tooltips when component is destroyed
    function cleanupTooltips() {
        // leftTooltipRef?.destroy();
        // rightTooltipRef?.destroy();
        lamportTooltipRef?.destroy();
        eventIdTooltipRef?.destroy();
        dependencyContainerTooltipRef?.destroy();
    }

    // Create tooltips once elements are mounted and modal is open
    function setupTooltips() {
        // Clean up any existing tooltips first
        cleanupTooltips();

        if (!isOpen || !leftAnchorElement || !rightAnchorElement) return;

        // Create left tooltip
        // leftTooltipRef = createTooltip(leftAnchorElement, {
        //     position: 'left',
        //     content: leftTooltipText,
        //     width: 200,
        //     showOnHover: false,
        //     visible: true,
        //     offset: 20
        // });

        // Create right tooltip
        // rightTooltipRef = createTooltip(rightAnchorElement, {
        //     position: 'right',
        //     content: rightTooltipText,
        //     width: 200,
        //     showOnHover: false,
        //     visible: true,
        //     offset: 20
        // });
        
        // Wait a moment to find and add tooltip to the specific elements
        setTimeout(() => {
            // Find the first lamport timestamp element
            lamportTimestampElement = document.querySelector('.legend-content .lamport-timestamp');
            
            if (lamportTimestampElement) {
                // Create lamport timestamp tooltip
                lamportTooltipRef = createTooltip(lamportTimestampElement, {
                    position: 'right',
                    content: lamportTooltipText,
                    width: 220,
                    showOnHover: false,
                    visible: true,
                    offset: 10,
                    verticalOffset: -100,
                    highlightTarget: true,
                    highlightClass: tooltipHighlightClass
                });
            }
            
            // Find the first event-id element
            eventIdElement = document.querySelector('.legend-content .event-id');
            
            if (eventIdElement) {
                // Create event-id tooltip
                eventIdTooltipRef = createTooltip(eventIdElement, {
                    position: 'left',
                    content: eventIdTooltipText,
                    width: 180,
                    showOnHover: false,
                    visible: true,
                    offset: 10,
                    highlightTarget: true,
                    highlightClass: tooltipHighlightClass
                });
            }
            
            // Find the first dependency-container element
            dependencyContainerElement = document.querySelector('.legend-content .dependency-box');
            
            if (dependencyContainerElement) {
                // Create dependency-container tooltip
                dependencyContainerTooltipRef = createTooltip(dependencyContainerElement, {
                    position: 'left',
                    content: dependencyContainerTooltipText,
                    width: 250,
                    showOnHover: false,
                    visible: true,
                    offset: 20,
                    verticalOffset: 40,
                    highlightTarget: true,
                    highlightClass: tooltipHighlightClass
                });
            }
        }, 100);
    }

    onMount(() => {
        if (isOpen) {
            // Need to wait for the DOM to update
            setTimeout(setupTooltips, 0);
        }
    });

    onDestroy(() => {
        cleanupTooltips();
    });

    // Watch for changes to isOpen state
    $: if (isOpen) {
        // Need to wait for the DOM to update
        setTimeout(setupTooltips, 0);
    } else {
        cleanupTooltips();
    }
</script>

{#if isOpen}
<div class="legend-modal-backdrop" on:click={closeModal}>
    <div class="legend-container">
        <!-- Main Modal (Center) -->
        <div class="legend-modal" bind:this={modalElement} on:click|stopPropagation>
            <!-- Tooltip anchor elements -->
            <div class="tooltip-anchor left-anchor" bind:this={leftAnchorElement}></div>
            <div class="tooltip-anchor right-anchor" bind:this={rightAnchorElement}></div>
            
            <div class="legend-header">
                <h2>Legend</h2>
                <button class="close-button" on:click={closeModal}>×</button>
            </div>
            <div class="legend-content">
                {#each legendItems as event}
                    <div class="legend-item">
                        <HistoryItem 
                            {event} 
                            identicon={placeholderIdenticon}
                            onEventClick={handleItemClick}
                            onDependencyClick={handleDependencyClick}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .legend-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .legend-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    
    .legend-modal {
        position: relative;
        background-color: white;
        border-radius: 8px;
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }
    
    .tooltip-anchor {
        position: absolute;
        width: 1px;
        height: 40%;
        top: 30%;
    }
    
    .left-anchor {
        left: 0;
    }
    
    .right-anchor {
        right: 0;
    }
    
    .legend-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #eee;
    }
    
    .legend-header h2 {
        margin: 0;
        font-size: 18px;
    }
    
    .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .close-button:hover {
        color: #333;
    }
    
    .legend-content {
        padding: 16px;
    }
    
    .legend-item {
        margin-bottom: 12px;
    }
    
    /* Custom highlight for lamport timestamp */
    :global(.tooltip-highlight) {
        background-color: rgba(253, 230, 138, 0.9) !important;
        border-radius: 4px !important;
        box-shadow: 0 0 0 2px #f59e0b !important;
        color: #000 !important;
        font-weight: bold !important;
        animation: pulse 1.5s infinite !important;
        max-width: none !important;
    }
    
    /* Custom highlight for event ID */
    :global(.event-id-highlight) {
        background-color: rgba(191, 219, 254, 0.9) !important;
        border-radius: 4px !important;
        box-shadow: 0 0 0 2px #3b82f6 !important;
        color: #000 !important;
        font-weight: bold !important;
        animation: pulseCyan 1.5s infinite !important;
    }
    
    /* Custom highlight for dependency container */
    :global(.dependency-container-highlight) {
        background-color: rgba(220, 252, 231, 0.7) !important;
        border-radius: 4px !important;
        box-shadow: 0 0 0 2px #10b981 !important;
        padding: 4px !important;
        animation: pulseGreen 1.5s infinite !important;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
        }
        70% {
            box-shadow: 0 0 0 6px rgba(245, 158, 11, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
        }
    }
    
    @keyframes pulseCyan {
        0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        }
        70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
    }
    
    @keyframes pulseGreen {
        0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .tooltip-anchor {
            display: none;
        }
    }
</style>