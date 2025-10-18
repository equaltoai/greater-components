<script lang="ts">
  import { formatDateTime } from '@greater/utils';
  import ContentRenderer from './ContentRenderer.svelte';
  import ActionBar from './ActionBar.svelte';
  import type { Status } from '../types';
  import type { Snippet } from 'svelte';

  interface ActionHandlers {
    onReply?: (status: Status) => Promise<void> | void;
    onBoost?: (status: Status) => Promise<void> | void;
    onFavorite?: (status: Status) => Promise<void> | void;
    onShare?: (status: Status) => Promise<void> | void;
    onQuote?: (status: Status) => Promise<void> | void;
  }

  interface Props {
    /**
     * Status data to display
     */
    status: Status;
    /**
     * Display density variant
     */
    density?: 'compact' | 'comfortable';
    /**
     * Whether to show the action bar
     */
    showActions?: boolean;
    /**
     * Action handlers for the action bar
     */
    actionHandlers?: ActionHandlers;
    /**
     * CSS class for the card
     */
    class?: string;
    /**
     * Custom header content
     */
    header?: Snippet;
    /**
     * Custom footer content  
     */
    footer?: Snippet;
    /**
     * Click handler for the card
     */
    onclick?: (status: Status) => void;
  }

  let {
    status,
    density = 'comfortable',
    showActions = true,
    actionHandlers,
    class: className = '',
    header,
    footer,
    onclick
  }: Props = $props();

  const account = $derived(status.reblog?.account || status.account);
  const actualStatus = $derived(status.reblog || status);
  const dateTime = $derived(formatDateTime(actualStatus.createdAt));

  function handleCardClick(event: MouseEvent) {
    // Don't trigger if clicking on links or buttons
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
      return;
    }
    onclick?.(status);
  }

  // Action handler wrappers that pass the status to the handlers
  const wrappedActionHandlers = $derived({
    onReply: actionHandlers?.onReply ? () => actionHandlers.onReply!(status) : undefined,
    onBoost: actionHandlers?.onBoost ? () => actionHandlers.onBoost!(status) : undefined,
    onFavorite: actionHandlers?.onFavorite ? () => actionHandlers.onFavorite!(status) : undefined,
    onShare: actionHandlers?.onShare ? () => actionHandlers.onShare!(status) : undefined,
    onQuote: actionHandlers?.onQuote ? () => actionHandlers.onQuote!(status) : undefined,
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article 
  class={`status-card ${density} ${className}`}
  class:clickable={onclick}
  role={onclick ? 'button' : undefined}
  tabindex={onclick ? 0 : undefined}
  onclick={onclick ? handleCardClick : undefined}
  onkeypress={onclick ? (e) => e.key === 'Enter' && handleCardClick(e) : undefined}
  aria-label={`Status by ${account.displayName || account.username}`}
>
  {#if status.reblog}
    <div class="reblog-indicator">
      <svg class="reblog-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M23.77 15.67a.749.749 0 0 0-1.06 0l-2.22 2.22V7.65a3.755 3.755 0 0 0-3.75-3.75h-5.85a.75.75 0 0 0 0 1.5h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22a.749.749 0 1 0-1.06 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5a.747.747 0 0 0 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22a.752.752 0 0 0 1.062 0 .749.749 0 0 0 0-1.06l-3.5-3.5a.747.747 0 0 0-1.06 0l-3.5 3.5a.749.749 0 1 0 1.06 1.06l2.22-2.22V16.7a3.755 3.755 0 0 0 3.75 3.75h5.85a.75.75 0 0 0 0-1.5z"/>
      </svg>
      <span>{status.account.displayName || status.account.username} boosted</span>
    </div>
  {/if}

  {#if header}
    <div class="custom-header">
      {@render header()}
    </div>
  {/if}

  <div class="status-header">
    <a href={account.url} class="avatar-link" aria-label={`View ${account.displayName || account.username}'s profile`}>
      <img 
        src={account.avatar} 
        alt=""
        class="avatar"
        loading="lazy"
        width="48"
        height="48"
      />
    </a>
    
    <div class="account-info">
      <a href={account.url} class="display-name">
        {account.displayName || account.username}
        {#if account.bot}
          <span class="bot-badge" aria-label="Bot account">BOT</span>
        {/if}
      </a>
      <div class="account-handle">@{account.acct}</div>
    </div>
    
    <time 
      class="timestamp" 
      datetime={dateTime.iso}
      title={dateTime.absolute}
    >
      {dateTime.relative}
    </time>
  </div>

  <div class="status-content">
    <ContentRenderer 
      content={actualStatus.content}
      spoilerText={actualStatus.spoilerText}
      mentions={actualStatus.mentions}
      tags={actualStatus.tags}
    />
  </div>

  {#if actualStatus.mediaAttachments && actualStatus.mediaAttachments.length > 0}
    <div class="media-attachments" class:single={actualStatus.mediaAttachments.length === 1}>
      {#each actualStatus.mediaAttachments as media (media.id)}
        <div class="media-item">
          {#if media.type === 'image'}
            <img 
              src={media.previewUrl || media.url}
              alt={media.description || ''}
              loading="lazy"
              class="media-image"
            />
          {:else if media.type === 'video' || media.type === 'gifv'}
            <video 
              src={media.url}
              poster={media.previewUrl}
              controls={media.type === 'video'}
              autoplay={media.type === 'gifv'}
              loop={media.type === 'gifv'}
              muted={media.type === 'gifv'}
              class="media-video"
              aria-label={media.description || 'Video'}
            ></video>
          {:else if media.type === 'audio'}
            <audio 
              src={media.url}
              controls
              class="media-audio"
              aria-label={media.description || 'Audio'}
            ></audio>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if showActions}
    <ActionBar
      counts={{
        replies: actualStatus.repliesCount,
        boosts: actualStatus.reblogsCount,
        favorites: actualStatus.favouritesCount,
        quotes: actualStatus.quoteCount
      }}
      states={{
        boosted: actualStatus.reblogged,
        favorited: actualStatus.favourited,
        bookmarked: actualStatus.bookmarked
      }}
      handlers={wrappedActionHandlers}
      readonly={!actionHandlers}
      size={density === 'compact' ? 'sm' : 'sm'}
      idPrefix={`status-${actualStatus.id}`}
    />
  {/if}

  {#if footer}
    <div class="custom-footer">
      {@render footer()}
    </div>
  {/if}
</article>

<style>
  .status-card {
    padding: var(--spacing-md, 1rem);
    border-bottom: 1px solid var(--color-border, #e1e8ed);
    background: var(--color-bg, white);
    transition: background-color 0.2s;
  }

  .status-card.clickable {
    cursor: pointer;
  }

  .status-card.clickable:hover {
    background: var(--color-bg-hover, #f7f9fa);
  }

  .status-card.compact {
    padding: var(--spacing-sm, 0.5rem);
  }

  .reblog-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.25rem);
    margin-bottom: var(--spacing-xs, 0.25rem);
    margin-left: calc(48px + var(--spacing-sm, 0.5rem));
    color: var(--color-text-secondary, #536471);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .reblog-icon {
    width: 16px;
    height: 16px;
  }

  .status-header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm, 0.5rem);
    margin-bottom: var(--spacing-sm, 0.5rem);
  }

  .avatar-link {
    flex-shrink: 0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .compact .avatar {
    width: 40px;
    height: 40px;
  }

  .account-info {
    flex: 1;
    min-width: 0;
  }

  .display-name {
    font-weight: 600;
    color: var(--color-text, #0f1419);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.25rem);
  }

  .display-name:hover {
    text-decoration: underline;
  }

  .bot-badge {
    padding: 2px 4px;
    background: var(--color-bg-secondary, #f7f9fa);
    border: 1px solid var(--color-border, #e1e8ed);
    border-radius: var(--radius-xs, 2px);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: normal;
  }

  .account-handle {
    color: var(--color-text-secondary, #536471);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .timestamp {
    color: var(--color-text-secondary, #536471);
    font-size: var(--font-size-sm, 0.875rem);
    text-decoration: none;
    white-space: nowrap;
  }

  .timestamp:hover {
    text-decoration: underline;
  }

  .status-content {
    margin-bottom: var(--spacing-sm, 0.5rem);
  }

  .media-attachments {
    display: grid;
    gap: var(--spacing-xs, 0.25rem);
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: var(--spacing-sm, 0.5rem);
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
  }

  .media-attachments.single {
    grid-template-columns: 1fr;
  }

  .media-item {
    position: relative;
    background: var(--color-bg-secondary, #f7f9fa);
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .media-image,
  .media-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-audio {
    width: 100%;
    margin-top: 50%;
    transform: translateY(-50%);
  }

  /* Action bar styling is now handled by the ActionBar component */

  .custom-header,
  .custom-footer {
    margin: var(--spacing-sm, 0.5rem) 0;
  }
</style>
