<!--
  ChatHeader - Chat Interface Header Component
  
  Provides the top bar for the chat interface with title, connection status,
  and action buttons (clear, settings).
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Header 
      title="AI Assistant" 
      subtitle="Powered by GPT-4"
      connectionStatus="connected"
      showClearButton={true}
      onClear={() => clearConversation()}
    />
    <Chat.Messages />
    <Chat.Input />
  </Chat.Container>
  ```
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button, Tooltip } from '@equaltoai/greater-components-primitives';
  import { Trash2Icon, SettingsIcon } from '@equaltoai/greater-components-icons';

  /**
   * Connection status type for the header indicator
   */
  type HeaderConnectionStatus = 'connected' | 'connecting' | 'disconnected';

  /**
   * Get status text for connection status
   * @param status - Connection status
   * @returns Human-readable status text
   */
  function getStatusText(status: HeaderConnectionStatus): string {
    switch (status) {
      case 'disconnected':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      default:
        return 'Unknown';
    }
  }

  /**
   * ChatHeader component props
   */
  interface Props {
    /**
     * Title text displayed in the header
     * @default "Chat"
     */
    title?: string;

    /**
     * Subtitle text displayed below the title in muted color
     */
    subtitle?: string;

    /**
     * Connection status indicator
     * - `connected`: Green dot
     * - `connecting`: Yellow/amber dot with pulse animation
     * - `disconnected`: Red dot
     */
    connectionStatus?: HeaderConnectionStatus;

    /**
     * Whether to show the clear conversation button
     * @default true
     */
    showClearButton?: boolean;

    /**
     * Whether to show the settings button
     * @default false
     */
    showSettingsButton?: boolean;

    /**
     * Called when clear button is clicked
     */
    onClear?: () => void;

    /**
     * Called when settings button is clicked
     */
    onSettings?: () => void;

    /**
     * Custom actions slot for additional buttons
     */
    actions?: Snippet;

    /**
     * Custom CSS class
     */
    class?: string;
  }

  let {
    title = 'Chat',
    subtitle,
    connectionStatus,
    showClearButton = true,
    showSettingsButton = false,
    onClear,
    onSettings,
    actions,
    class: className = '',
  }: Props = $props();

  /**
   * Handle clear button click
   */
  function handleClear() {
    onClear?.();
  }

  /**
   * Handle settings button click
   */
  function handleSettings() {
    onSettings?.();
  }

  // Compute header classes
  const headerClass = $derived.by(() => {
    const classes = [
      'chat-header',
      connectionStatus && `chat-header--${connectionStatus}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return classes;
  });

  // Get connection status text for tooltip
  const statusText = $derived(
    connectionStatus ? getStatusText(connectionStatus) : ''
  );
</script>

<header class={headerClass} role="banner">
  <div class="chat-header__left">
    <div class="chat-header__title-group">
      <h1 class="chat-header__title">{title}</h1>
      {#if subtitle}
        <p class="chat-header__subtitle">{subtitle}</p>
      {/if}
    </div>
    
    {#if connectionStatus}
      <Tooltip content={statusText} placement="bottom">
        <div 
          class="chat-header__status"
          class:chat-header__status--connected={connectionStatus === 'connected'}
          class:chat-header__status--connecting={connectionStatus === 'connecting'}
          class:chat-header__status--disconnected={connectionStatus === 'disconnected'}
          role="status"
          aria-label={statusText}
        >
          <span class="chat-header__status-dot" aria-hidden="true"></span>
        </div>
      </Tooltip>
    {/if}
  </div>

  <div class="chat-header__right">
    {#if actions}
      {@render actions()}
    {/if}

    {#if showClearButton}
      <Tooltip content="Clear conversation" placement="bottom">
        <Button
          variant="ghost"
          size="sm"
          onclick={handleClear}
          aria-label="Clear conversation"
        >
          {#snippet prefix()}
            <Trash2Icon size={18} />
          {/snippet}
        </Button>
      </Tooltip>
    {/if}

    {#if showSettingsButton}
      <Tooltip content="Settings" placement="bottom">
        <Button
          variant="ghost"
          size="sm"
          onclick={handleSettings}
          aria-label="Open settings"
        >
          {#snippet prefix()}
            <SettingsIcon size={18} />
          {/snippet}
        </Button>
      </Tooltip>
    {/if}
  </div>
</header>

<style>
  /* Base header styles */
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--gr-spacing-scale-3, 0.75rem) var(--gr-spacing-scale-4, 1rem);
    background-color: var(--gr-semantic-background-primary, #ffffff);
    border-bottom: 1px solid var(--gr-semantic-border-primary, #e5e7eb);
    position: sticky;
    top: 0;
    z-index: 10;
    flex-shrink: 0;
  }

  /* Left section with title and status */
  .chat-header__left {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-3, 0.75rem);
    min-width: 0;
    flex: 1;
  }

  /* Title group */
  .chat-header__title-group {
    display: flex;
    flex-direction: column;
    gap: var(--gr-spacing-scale-1, 0.25rem);
    min-width: 0;
  }

  .chat-header__title {
    margin: 0;
    font-family: var(--gr-typography-fontFamily-sans, system-ui, sans-serif);
    font-size: var(--gr-typography-fontSize-lg, 1.125rem);
    font-weight: var(--gr-typography-fontWeight-semibold, 600);
    line-height: 1.25;
    color: var(--gr-semantic-foreground-primary, #111827);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-header__subtitle {
    margin: 0;
    font-family: var(--gr-typography-fontFamily-sans, system-ui, sans-serif);
    font-size: var(--gr-typography-fontSize-sm, 0.875rem);
    line-height: 1.25;
    color: var(--gr-semantic-foreground-secondary, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Connection status indicator */
  .chat-header__status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gr-spacing-scale-1, 0.25rem);
    cursor: help;
  }

  .chat-header__status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--gr-radii-full, 9999px);
    transition: background-color 0.2s ease-in-out;
  }

  /* Connected state - green */
  .chat-header__status--connected .chat-header__status-dot {
    background-color: var(--gr-color-success-500, #22c55e);
  }

  /* Connecting state - yellow/amber with pulse */
  .chat-header__status--connecting .chat-header__status-dot {
    background-color: var(--gr-color-warning-500, #f59e0b);
    animation: status-pulse 1.5s ease-in-out infinite;
  }

  /* Disconnected state - red */
  .chat-header__status--disconnected .chat-header__status-dot {
    background-color: var(--gr-color-error-500, #ef4444);
  }

  /* Right section with action buttons */
  .chat-header__right {
    display: flex;
    align-items: center;
    gap: var(--gr-spacing-scale-1, 0.25rem);
    flex-shrink: 0;
  }

  /* Pulse animation for connecting state */
  @keyframes status-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.9);
    }
  }

  /* Dark mode */
  :global([data-theme='dark']) .chat-header {
    background-color: var(--gr-semantic-background-primary, #1f2937);
    border-bottom-color: var(--gr-semantic-border-primary, #374151);
  }

  :global([data-theme='dark']) .chat-header__title {
    color: var(--gr-semantic-foreground-primary, #f9fafb);
  }

  :global([data-theme='dark']) .chat-header__subtitle {
    color: var(--gr-semantic-foreground-secondary, #9ca3af);
  }

  /* Mobile responsive */
  @media (max-width: 640px) {
    .chat-header {
      padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
    }

    .chat-header__title {
      font-size: var(--gr-typography-fontSize-base, 1rem);
    }

    .chat-header__subtitle {
      font-size: var(--gr-typography-fontSize-xs, 0.75rem);
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .chat-header__status--connecting .chat-header__status-dot {
      animation: none;
    }
  }
</style>