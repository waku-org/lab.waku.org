<script lang="ts">
  import { fade } from "svelte/transition";
  
  type MaxWidthOption = "sm" | "md" | "lg" | "xl" | "2xl";
  
  export let maxWidth: MaxWidthOption = "md";
  export let padding = "p-8";
  export let margin = "sm:my-12 my-4";
  export let title = "";
  
  const maxWidthClasses: Record<MaxWidthOption, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
</script>

<div class="relative min-h-screen">
  <div 
    class="{maxWidthClasses[maxWidth]} mx-auto {padding} bg-white rounded-lg sm:shadow-md absolute top-0 left-0 right-0 {margin}" 
    in:fade={{ duration: 300 }}
    out:fade={{ duration: 300 }}
  >
    {#if title}
      <h1 class="text-2xl font-bold text-gray-800 mb-6 tracking-tight text-center">
        {title}
      </h1>
    {/if}
    
    <slot />
  </div>
</div> 