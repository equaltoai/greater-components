# Module: ChatContainer Test Harness

## Type: creation

## Files:
[packages/shared/chat/tests/harness/ChatContainerHarness.svelte]

## File Changes:
- packages/shared/chat/tests/harness/ChatContainerHarness.svelte: BEFORE: DOES NOT EXIST | AFTER: <<<
<script lang="ts">
  import Container from '../../src/ChatContainer.svelte';
  import type { ChatHandlers, ConnectionStatus } from '../../src/context.svelte.js';
  import type { ChatMessage, ChatSettingsState } from '../../src/types.js';
  import type { Snippet } from 'svelte';

  interface Props {
    handlers?: ChatHandlers;
    messages?: ChatMessage[];
    streaming?: boolean;
    streamContent?: string;
    connectionStatus?: ConnectionStatus;
    initialSettings?: ChatSettingsState;
    autoScroll?: boolean;
    enableKeyboardShortcuts?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    handlers = {},
    messages = [],
    streaming = false,
    streamContent = '',
    connectionStatus = 'disconnected',
    initialSettings = {},
    autoScroll = true,
    enableKeyboardShortcuts = true,
    class: className = '',
    children,
  }: Props = $props();
</script>

<Container
  {handlers}
  {messages}
  {streaming}
  {streamContent}
  {connectionStatus}
  {initialSettings}
  {autoScroll}
  {enableKeyboardShortcuts}
  class={className}
>
  {#if children}
    {@render children()}
  {:else}
    <div data-testid="container-content">Test content</div>
  {/if}
</Container>
>>> | TYPE: content creation | DESC: Creates test harness for ChatContainer component
