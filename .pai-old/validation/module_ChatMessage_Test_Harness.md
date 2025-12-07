# Module: ChatMessage Test Harness

## Type: creation

## Files:
[packages/shared/chat/tests/harness/ChatMessageHarness.svelte]

## File Changes:
- packages/shared/chat/tests/harness/ChatMessageHarness.svelte: BEFORE: DOES NOT EXIST | AFTER: <<<
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
>>> | TYPE: content creation | DESC: Creates test harness for ChatMessage component
