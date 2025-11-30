<script lang="ts">
  import Message from '../../src/ChatMessage.svelte';
  import type { MessageRole } from '../../src/types.js';

  interface Props {
    role: MessageRole;
    content: string;
    timestamp?: Date;
    avatar?: string;
    streaming?: boolean;
    class?: string;
  }

  let {
    role,
    content,
    timestamp,
    avatar,
    streaming = false,
    class: className = '',
  }: Props = $props();
</script>

<Message
  {role}
  {content}
  {timestamp}
  {avatar}
  {streaming}
  class={className}
/>