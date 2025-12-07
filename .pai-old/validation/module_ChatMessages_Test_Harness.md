# Module: ChatMessages Test Harness

## Type: creation

## Files:
[packages/shared/chat/tests/harness/ChatMessagesHarness.svelte]

## File Changes:
- packages/shared/chat/tests/harness/ChatMessagesHarness.svelte: BEFORE: DOES NOT EXIST | AFTER: <<<
<script lang="ts">
  import Container from '../../src/ChatContainer.svelte';
  import Messages from '../../src/ChatMessages.svelte';
  import type { ChatMessage } from '../../src/types.js';
  import type { ChatHandlers } from '../../src/context.svelte.js';
  import type { Snippet } from 'svelte';

  interface Props {
    messages?: ChatMessage[];
    handlers?: ChatHandlers;
    loading?: boolean;
    streaming?: boolean;
    welcomeTitle?: string;
    welcomeMessage?: string;
    suggestions?: string[];
    onSuggestionClick?: (suggestion: string) => void;
    showAvatars?: boolean;
    assistantAvatar?: string;
    userAvatar?: string;
    scrollThreshold?: number;
    class?: string;
    emptyState?: Snippet;
  }

  let {
    messages = [],
    handlers = {},
    loading = false,
    streaming = false,
    welcomeTitle = 'Welcome!',
    welcomeMessage = 'How can I help you today?',
    suggestions = [],
    onSuggestionClick,
    showAvatars = true,
    assistantAvatar,
    userAvatar,
    scrollThreshold = 100,
    class: className = '',
    emptyState,
  }: Props = $props();
</script>

<Container {handlers} {messages} {streaming}>
  <Messages
    class={className}
    {welcomeTitle}
    {welcomeMessage}
    {suggestions}
    {onSuggestionClick}
    {showAvatars}
    {assistantAvatar}
    {userAvatar}
    {scrollThreshold}
    {emptyState}
  />
</Container>
>>> | TYPE: content creation | DESC: Creates test harness for ChatMessages component
