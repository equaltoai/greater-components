<!--
  ChatMessage - Individual Chat Message Display Component
  
  Displays chat messages with role-based styling, markdown rendering,
  streaming support, and interactive features.
  
  @component
  @example
  ```svelte
  <ChatMessage 
    role="assistant" 
    content="Hello! How can I help you today?"
    streaming={false}
  />
  ```
-->
<script lang="ts">
  import { Avatar, CopyButton } from '@equaltoai/greater-components-primitives';
  import { MarkdownRenderer } from '@equaltoai/greater-components-content';
  import { formatMessageTime } from './context.svelte.js';
  import type { MessageRole } from './types.js';

  /**
   * ChatMessage component props
   */
  interface Props {
    /**
     * Role of the message sender
     */
    role: MessageRole;

    /**
     * Message content (may be partial during streaming)
     */
    content: string;

    /**
     * Timestamp when the message was created
     */
    timestamp?: Date;

    /**
     * Avatar URL for the message sender
     */
    avatar?: string;

    /**
     * Whether the message is currently streaming
     * @default false
     */
    streaming?: boolean;

    /**
     * Custom CSS class
     */
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

  // Track hover state for copy button visibility
  let isHovered = $state(false);

  // Compute message classes
  const messageClass = $derived.by(() => {
    const classes = [
      'chat-message',
      `chat-message--${role}`,
      streaming && 'chat-message--streaming',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return classes;
  });

  // Avatar name for accessibility and initials generation
  const avatarName = $derived.by(() => {
    switch (role) {
      case 'user':
        return 'User';
      case 'assistant':
        return 'AI Assistant';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  });
</script>

<div 
  class={messageClass}
  role="article"
  aria-label={`${avatarName} message`}
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
>
  {#if role !== 'system'}
    <div class="chat-message__avatar">
      <Avatar 
        src={avatar} 
        name={avatarName} 
        size="sm"
        shape="circle"
      />
    </div>
  {/if}

  <div class="chat-message__content-wrapper">
    <div class="chat-message__bubble">
      {#if role === 'assistant'}
        <!-- Assistant messages use MarkdownRenderer -->
        <div class="chat-message__content">
          <MarkdownRenderer 
            content={content} 
            sanitize={true}
            enableLinks={true}
            openLinksInNewTab={true}
          />
          {#if streaming}
            <span class="chat-message__cursor" aria-hidden="true"></span>
          {/if}
        </div>
        
        <!-- Copy button for assistant messages (visible on hover) -->
        {#if isHovered && !streaming && content}
          <div class="chat-message__actions">
            <CopyButton 
              text={content}
              variant="icon"
              buttonVariant="ghost"
              size="sm"
            />
          </div>
        {/if}
      {:else if role === 'user'}
        <!-- User messages display plain text -->
        <div class="chat-message__content">
          {content}
        </div>
      {:else}
        <!-- System messages -->
        <div class="chat-message__content">
          {content}
        </div>
      {/if}
    </div>

    {#if timestamp}
      <time class="chat-message__timestamp" datetime={timestamp.toISOString()}>
        {formatMessageTime(timestamp)}
      </time>
    {/if}
  </div>
</div>

<style>
  /* Base message styles */
  .chat-message {
    display: flex;
    gap: var(--gr-spacing-scale-3, 0.75rem);
    padding: var(--gr-spacing-scale-3, 0.75rem) var(--gr-spacing-scale-4, 1rem);
    animation: message-enter 0.3s ease-out;
  }

  @keyframes message-enter {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-message__avatar {
    flex-shrink: 0;
  }

  .chat-message__content-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-1, 0.25rem);
    min-width: 0;
    max-width: 80%;
  }

  .chat-message__bubble {
    position: relative;
    padding: var(--gr-spacing-scale-3, 0.75rem) var(--gr-spacing-scale-4, 1rem);
    border-radius: var(--gr-radii-lg, 0.5rem);
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .chat-message__content {
    line-height: 1.5;
  }

  .chat-message__timestamp {
    font-size: var(--gr-typography-fontSize-xs, 0.75rem);
    color: var(--gr-color-gray-500, #6b7280);
    padding-left: var(--gr-spacing-scale-1, 0.25rem);
  }

  .chat-message__actions {
    position: absolute;
    top: var(--gr-spacing-scale-2, 0.5rem);
    right: var(--gr-spacing-scale-2, 0.5rem);
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }

  .chat-message:hover .chat-message__actions {
    opacity: 1;
  }

  /* User message styles - Right aligned, primary background */
  .chat-message--user {
    flex-direction: row-reverse;
  }

  .chat-message--user .chat-message__content-wrapper {
    align-items: flex-end;
  }

  .chat-message--user .chat-message__bubble {
    background-color: var(--gr-color-primary-600, #2563eb);
    color: var(--gr-color-base-white, #ffffff);
    border-bottom-right-radius: var(--gr-radii-sm, 0.125rem);
  }

  .chat-message--user .chat-message__timestamp {
    text-align: right;
    padding-right: var(--gr-spacing-scale-1, 0.25rem);
    padding-left: 0;
  }

  /* Assistant message styles - Left aligned, outlined card */
  .chat-message--assistant {
    flex-direction: row;
  }

  .chat-message--assistant .chat-message__content-wrapper {
    align-items: flex-start;
  }

  .chat-message--assistant .chat-message__bubble {
    background-color: var(--gr-semantic-background-primary, #ffffff);
    border: 1px solid var(--gr-color-gray-200, #e5e7eb);
    color: var(--gr-semantic-foreground-primary, #111827);
    border-bottom-left-radius: var(--gr-radii-sm, 0.125rem);
    box-shadow: var(--gr-shadows-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
  }

  /* System message styles - Centered, muted background */
  .chat-message--system {
    justify-content: center;
    padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-4, 1rem);
  }

  .chat-message--system .chat-message__content-wrapper {
    align-items: center;
    max-width: 100%;
  }

  .chat-message--system .chat-message__bubble {
    background-color: var(--gr-color-gray-100, #f3f4f6);
    color: var(--gr-color-gray-600, #4b5563);
    font-size: var(--gr-typography-fontSize-sm, 0.875rem);
    text-align: center;
    border-radius: var(--gr-radii-full, 9999px);
    padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-4, 1rem);
  }

  /* Streaming cursor animation */
  .chat-message__cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: cursor-blink 0.5s step-end infinite;
  }

  @keyframes cursor-blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  /* Streaming state */
  .chat-message--streaming .chat-message__bubble {
    /* Subtle visual indicator for streaming */
  }

  /* Dark mode styles */
  :global([data-theme='dark']) .chat-message--user .chat-message__bubble {
    background-color: var(--gr-color-primary-500, #3b82f6);
  }

  :global([data-theme='dark']) .chat-message--assistant .chat-message__bubble {
    background-color: var(--gr-semantic-background-secondary, #374151);
    border-color: var(--gr-color-gray-700, #374151);
    color: var(--gr-semantic-foreground-primary, #f9fafb);
  }

  :global([data-theme='dark']) .chat-message--system .chat-message__bubble {
    background-color: var(--gr-color-gray-800, #1f2937);
    color: var(--gr-color-gray-400, #9ca3af);
  }

  :global([data-theme='dark']) .chat-message__timestamp {
    color: var(--gr-color-gray-400, #9ca3af);
  }

  /* Responsive styles */
  @media (max-width: 640px) {
    .chat-message {
      padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
      gap: var(--gr-spacing-scale-2, 0.5rem);
    }

    .chat-message__content-wrapper {
      max-width: 85%;
    }

    .chat-message__bubble {
      padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
    }
  }

  /* Markdown content styling within assistant messages */
  .chat-message--assistant :global(.gr-markdown) {
    font-size: inherit;
    line-height: inherit;
  }

  .chat-message--assistant :global(.gr-markdown p) {
    margin: 0 0 var(--gr-spacing-scale-2, 0.5rem) 0;
  }

  .chat-message--assistant :global(.gr-markdown p:last-child) {
    margin-bottom: 0;
  }

  .chat-message--assistant :global(.gr-markdown code) {
    background-color: var(--gr-color-gray-100, #f3f4f6);
    padding: 0.125rem 0.25rem;
    border-radius: var(--gr-radii-sm, 0.125rem);
    font-size: 0.875em;
  }

  .chat-message--assistant :global(.gr-markdown pre) {
    background-color: var(--gr-color-gray-900, #111827);
    color: var(--gr-color-gray-100, #f3f4f6);
    padding: var(--gr-spacing-scale-3, 0.75rem);
    border-radius: var(--gr-radii-md, 0.375rem);
    overflow-x: auto;
    margin: var(--gr-spacing-scale-2, 0.5rem) 0;
  }

  .chat-message--assistant :global(.gr-markdown pre code) {
    background-color: transparent;
    padding: 0;
  }

  :global([data-theme='dark']) .chat-message--assistant :global(.gr-markdown code) {
    background-color: var(--gr-color-gray-700, #374151);
  }

  :global([data-theme='dark']) .chat-message--assistant :global(.gr-markdown pre) {
    background-color: var(--gr-color-gray-950, #030712);
  }
</style>