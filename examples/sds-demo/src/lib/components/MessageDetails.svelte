<script lang="ts">
    import type { Message } from "@waku/sds";

    const { message }: { message: Message } = $props();
</script>

<div class="message-details">
    <h1>{message.messageId}</h1>
</div>