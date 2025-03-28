<script lang="ts">
    import { onMount } from 'svelte';

    export let targetElement: HTMLElement | null = null;
    export let position: 'left' | 'right' = 'right';
    export let content: string = '';
    export let offset: number = 20;
    export let verticalOffset: number = 0;
    export let width: number = 200;
    export let showOnHover: boolean = true;
    export let visible: boolean = false;
    export let highlightTarget: boolean = false;
    export let highlightClass: string = 'tooltip-target-highlight';

    let tooltipElement: HTMLElement;
    let originalTargetClasses: string = '';

    // Position the tooltip relative to the target element
    function positionTooltip() {
        if (!targetElement || !tooltipElement) return;
        
        const targetRect = targetElement.getBoundingClientRect();
        
        // Calculate vertical center alignment with optional vertical offset
        const top = targetRect.top + (targetRect.height / 2) + verticalOffset;
        
        // Position horizontally based on the selected position
        if (position === 'left') {
            tooltipElement.style.right = `${window.innerWidth - targetRect.left + offset}px`;
        } else {
            tooltipElement.style.left = `${targetRect.right + offset}px`;
        }
        
        tooltipElement.style.top = `${top}px`;
        tooltipElement.style.transform = 'translateY(-50%)';
    }

    // Reposition on window resize
    function handleResize() {
        if (visible) {
            positionTooltip();
        }
    }

    function showTooltip() {
        visible = true;
        // Position after becoming visible
        setTimeout(positionTooltip, 0);
    }

    function hideTooltip() {
        visible = false;
    }

    function applyHighlight() {
        if (targetElement && highlightTarget) {
            // Store original classes before adding highlight
            originalTargetClasses = targetElement.className;
            targetElement.classList.add(highlightClass);
        }
    }

    function removeHighlight() {
        if (targetElement && highlightTarget) {
            // If we stored original classes, restore them
            if (originalTargetClasses) {
                // Remove highlight class
                targetElement.classList.remove(highlightClass);
            }
        }
    }

    onMount(() => {
        applyHighlight();
        
        if (visible) {
            positionTooltip();
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            // Ensure we remove highlight when component is destroyed
            removeHighlight();
        };
    });
</script>

{#if visible}
<div 
    class="tooltip {position}-tooltip"
    bind:this={tooltipElement}
    style="width: {width}px;"
>
    {@html content}
</div>
{/if}

<style>
    .tooltip {
        position: fixed;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 16px;
        font-size: 14px;
        line-height: 1.5;
        color: #4b5563;
        z-index: 1000;
        max-width: 300px;
        opacity: 0;
        animation: fadeIn 0.2s forwards;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    :global(.tooltip-target-highlight) {
        outline: 2px solid rgba(252, 211, 77, 0.8) !important;
        outline-offset: 2px !important;
        transition: outline-color 0.2s ease !important;
        z-index: 2 !important;
        position: relative !important;
    }
</style> 