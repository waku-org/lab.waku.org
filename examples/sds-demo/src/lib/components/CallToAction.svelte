<script lang="ts">
  export let message: string;
  export let linkText: string = "";
  export let linkHref: string = "";
  export let marginTop: string = "mt-6";
  export let messageMarginBottom: string = "mb-2";
  export let useSlot: boolean = false;
</script>

<div class="{marginTop} pt-6 border-t border-gray-200 text-center w-full">
  <p class="text-gray-600 {messageMarginBottom}">{message}</p>
  {#if useSlot}
    <slot />
  {:else}
    <a href={linkHref} class="text-blue-600 hover:text-blue-800 font-medium"
      >{linkText} →</a
    >
  {/if}
</div> 