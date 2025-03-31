<script lang="ts">
  // Simple header component that accepts a slot
</script>

<div class="header">
  <slot />
</div>

<style>
  .header {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
