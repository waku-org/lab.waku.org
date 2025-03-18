<script lang="ts">
  import { wakuConnection } from "../connectionUtils";
  
  export let onClick: () => void;
  export let label: string = "Action";
  export let extraCondition: boolean = true;
  export let className: string = "";
  export let requireConnection: boolean = true;

  // Whether to check connection status for this button
  $: buttonProps = requireConnection 
    ? $wakuConnection.getButtonProps(extraCondition)
    : { 
        disabled: !extraCondition, 
        'aria-disabled': !extraCondition,
        title: !extraCondition ? 'This action requires additional conditions to be met' : '',
        class: !extraCondition ? 'opacity-50 cursor-not-allowed' : ''
      };

  function handleClick() {
    if (!buttonProps.disabled) {
      onClick();
    }
  }
</script>

<button
  class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 {buttonProps.class} {className}"
  on:click={handleClick}
  disabled={buttonProps.disabled}
  aria-disabled={buttonProps.disabled}
  title={buttonProps.title}
>
  <slot>{label}</slot>
</button> 