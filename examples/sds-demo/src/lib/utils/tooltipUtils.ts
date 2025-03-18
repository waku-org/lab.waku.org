import { mount, unmount } from 'svelte';
import Tooltip from '$lib/components/Tooltip.svelte';

interface TooltipOptions {
    position?: 'left' | 'right';
    content: string;
    offset?: number;
    verticalOffset?: number;
    width?: number;
    showOnHover?: boolean;
    visible?: boolean;
    highlightTarget?: boolean;
    highlightClass?: string;
}

/**
 * Creates a tooltip positioned relative to a target element
 * @param targetElement - The element to attach the tooltip to
 * @param options - Configuration options for the tooltip
 * @returns An object with methods to control the tooltip
 */
export function createTooltip(targetElement: HTMLElement, options: TooltipOptions) {
    const {
        position = 'right',
        content,
        offset = 20,
        width = 200,
        showOnHover = true,
        visible = false,
        highlightTarget = false,
        highlightClass = 'tooltip-target-highlight',
        verticalOffset = 0
    } = options;

    // Store current visibility state
    let isVisible = visible;
    
    // Create a container for the tooltip
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Initialize the tooltip component using Svelte's mount API
    const tooltipInstance = mount(Tooltip, {
        target: container,
        props: {
            targetElement,
            position,
            content,
            offset,
            width,
            verticalOffset,
            showOnHover,
            visible: isVisible,
            highlightTarget,
            highlightClass
        }
    });

    // Return methods to control the tooltip
    return {
        destroy: () => {
            // In Svelte 5, we use the unmount function instead of $destroy
            unmount(tooltipInstance);
            container.remove();
        },
        updatePosition: () => {
            tooltipInstance.$set({ targetElement });
        },
        updateContent: (newContent: string) => {
            tooltipInstance.$set({ content: newContent });
        },
        show: () => {
            isVisible = true;
            tooltipInstance.$set({ visible: true });
        },
        hide: () => {
            isVisible = false;
            tooltipInstance.$set({ visible: false });
        },
        toggle: () => {
            isVisible = !isVisible;
            tooltipInstance.$set({ visible: isVisible });
        },
        updateOptions: (newOptions: Partial<TooltipOptions>) => {
            if (newOptions.visible !== undefined) {
                isVisible = newOptions.visible;
            }
            tooltipInstance.$set(newOptions);
        }
    };
} 