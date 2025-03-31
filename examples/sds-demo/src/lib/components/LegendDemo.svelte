<script lang="ts">
    import LegendModal from './LegendModal.svelte';
    
    let showLegend = $state(false);
    
    function toggleLegend() {
        showLegend = !showLegend;
    }
</script>

<div class="legend-demo">
    <h2>Message Events Visualization</h2>
    
    <div class="actions">
        <button class="info-button" on:click={toggleLegend}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Show Event Types Legend
        </button>
    </div>
    
    <LegendModal bind:isOpen={showLegend} />
</div>

<style>
    .legend-demo {
        padding: 20px;
    }
    
    h2 {
        margin-bottom: 20px;
    }
    
    .actions {
        margin-bottom: 20px;
    }
    
    .info-button {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        color: #374151;
        transition: all 0.2s;
    }
    
    .info-button:hover {
        background-color: #f3f4f6;
        border-color: #d1d5db;
    }
    
    .info-button svg {
        width: 16px;
        height: 16px;
    }
</style> 