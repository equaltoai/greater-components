<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import StatusCard from './StatusCard.svelte';
  import type { Status } from '../types';
  import type { StatusActionHandlers } from './Status/context.js';
  import type { Snippet } from 'svelte';
  import type { TimelineIntegrationConfig } from '../lib/integration';
  import { createTimelineIntegration } from '../lib/integration';

  interface Props {
    /**
     * Array of status items to display (optional when using store integration)
     */
    items?: Status[];
    /**
     * Store integration configuration (enables real-time updates)
     */
    integration?: TimelineIntegrationConfig;
    /**
     * Estimated height of each item (for virtualization)
     */
    estimateSize?: number;
    /**
     * Overscan count for virtualization
     */
    overscan?: number;
    /**
     * Whether to show a loading indicator at the top
     */
    loadingTop?: boolean;
    /**
     * Whether to show a loading indicator at the bottom
     */
    loadingBottom?: boolean;
    /**
     * Whether we've reached the end of the feed
     */
    endReached?: boolean;
    /**
     * Callback when scrolling near the top
     */
    onLoadMore?: () => void;
    /**
     * Callback when scrolling near the bottom
     */
    onLoadPrevious?: () => void;
    /**
     * Callback when a status is clicked
     */
    onStatusClick?: (status: Status) => void;
    /**
     * Callback when a status is updated
     */
    onStatusUpdate?: (status: Status) => void;
    /**
     * Custom gap loader content
     */
    gapLoader?: Snippet;
    /**
     * Custom end of feed content
     */
    endOfFeed?: Snippet;
    /**
     * Custom real-time indicator content
     */
    realtimeIndicator?: Snippet<[{ 
      connected: boolean; 
      error: string | null; 
      unreadCount: number;
      onSync: () => void;
    }]>;
    /**
     * CSS class for the timeline
     */
    class?: string;
    /**
     * Density for status cards
     */
    density?: 'compact' | 'comfortable';
    /**
     * Auto-connect on mount
     */
    autoConnect?: boolean;
    /**
     * Show real-time status indicator
     */
    showRealtimeIndicator?: boolean;
    /**
     * Action handlers for timeline status cards
     */
    actionHandlers?: StatusActionHandlers | ((status: Status) => StatusActionHandlers | undefined);
  }

  let {
    items: propItems = [],
    integration,
    estimateSize = 200,
    overscan = 5,
    loadingTop: propLoadingTop = false,
    loadingBottom: propLoadingBottom = false,
    endReached: propEndReached = false,
    onLoadMore,
    onLoadPrevious,
    onStatusClick,
    onStatusUpdate,
    gapLoader,
    endOfFeed,
    realtimeIndicator,
    class: className = '',
    density = 'comfortable',
    autoConnect = true,
    showRealtimeIndicator = true,
    actionHandlers
  }: Props = $props();

  // Create integration instance if config is provided
  let timelineIntegration = integration ? createTimelineIntegration(integration) : null;
  let mounted = false;

  // Use store data when integration is available, otherwise fall back to props
  const items = $derived(timelineIntegration ? timelineIntegration.items : propItems);
  const loadingTop = $derived(timelineIntegration ? timelineIntegration.state.loadingTop : propLoadingTop);
  const loadingBottom = $derived(timelineIntegration ? timelineIntegration.state.loadingBottom : propLoadingBottom);
  const endReached = $derived(timelineIntegration ? timelineIntegration.state.endReached : propEndReached);
  const connected = $derived(timelineIntegration ? timelineIntegration.state.connected : true);
  const error = $derived(timelineIntegration ? timelineIntegration.state.error : null);
  const unreadCount = $derived(timelineIntegration ? timelineIntegration.state.unreadCount : 0);

  let scrollElement = $state<HTMLDivElement>();
  let prevScrollTop = 0;
  let prevItemCount = 0;

  const virtualizer = $derived(
    scrollElement
      ? createVirtualizer({
          count: items.length,
          getScrollElement: () => scrollElement,
          estimateSize: () => estimateSize,
          overscan
        })
      : null
  );

  // Auto-connect on mount
  $effect(() => {
    if (!mounted && timelineIntegration && autoConnect) {
      mounted = true;
      timelineIntegration.connect().catch(err => {
        console.error('Failed to connect timeline:', err);
      });
      
      return () => {
        timelineIntegration?.disconnect();
      };
    }
  });

  // Handle status updates
  $effect(() => {
    if (onStatusUpdate && timelineIntegration) {
      // Subscribe to status updates from the store
      // This would be implemented based on the specific update mechanism
    }
  });

  function handleScroll() {
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const scrollDirection = scrollTop > prevScrollTop ? 'down' : 'up';
    prevScrollTop = scrollTop;

    // Load more when scrolling near the bottom
    if (scrollDirection === 'down' && !loadingBottom && !endReached) {
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom < 500) {
        if (timelineIntegration) {
          timelineIntegration.loadOlder();
        } else {
          onLoadMore?.();
        }
      }
    }

    // Load previous when scrolling near the top
    if (scrollDirection === 'up' && !loadingTop) {
      if (scrollTop < 500) {
        if (timelineIntegration) {
          timelineIntegration.loadNewer();
        } else {
          onLoadPrevious?.();
        }
      }
    }
  }

  // Preserve scroll position when items are prepended
  $effect(() => {
    if (!scrollElement) return;
    
    const currentItemCount = items.length;
    
    if (currentItemCount > prevItemCount && prevItemCount > 0) {
      const prevScrollHeight = scrollElement.scrollHeight;
      
      // Use requestAnimationFrame to wait for DOM updates
      requestAnimationFrame(() => {
        const newScrollHeight = scrollElement.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeight;
        
        // If items were likely added to the top (scroll position near top)
        if (heightDiff > 0 && scrollElement.scrollTop < 1000) {
          scrollElement.scrollTop += heightDiff;
        }
      });
    }
    
    prevItemCount = currentItemCount;
  });

  const virtualItems = $derived(virtualizer?.getVirtualItems() || []);
  const totalSize = $derived(virtualizer?.getTotalSize() || 0);

  function handleStatusCardClick(status: Status) {
    onStatusClick?.(status);
  }

  function handleSyncClick() {
    if (timelineIntegration) {
      timelineIntegration.loadNewer();
    }
  }

  function handleRefresh() {
    if (timelineIntegration) {
      timelineIntegration.refresh();
    }
  }
</script>

<div 
  class={`timeline-virtualized ${className}`}
  role="feed"
  aria-label="Timeline"
  aria-busy={loadingTop || loadingBottom}
>
  {#if showRealtimeIndicator && timelineIntegration}
    <div class="realtime-status" class:connected class:error={!!error}>
      {#if realtimeIndicator}
        {@render realtimeIndicator({ connected, error, unreadCount, onSync: handleSyncClick })}
      {:else}
        <div class="realtime-indicator">
          <div class="connection-status">
            {#if connected}
              <div class="status-dot connected" aria-label="Connected"></div>
              <span>Live</span>
            {:else if error}
              <div class="status-dot error" aria-label="Connection error"></div>
              <span>Error</span>
            {:else}
              <div class="status-dot reconnecting" aria-label="Reconnecting"></div>
              <span>Connecting...</span>
            {/if}
          </div>
          
          {#if unreadCount > 0}
            <button 
              class="unread-indicator"
              onclick={handleSyncClick}
              aria-label={`Load ${unreadCount} new items`}
            >
              {unreadCount} new
            </button>
          {/if}
          
          {#if error}
            <button 
              class="retry-button"
              onclick={handleRefresh}
              aria-label="Retry connection"
            >
              Retry
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <div 
    class="timeline-scroll"
    bind:this={scrollElement}
    onscroll={handleScroll}
  >
    {#if loadingTop}
      <div class="loading-indicator top">
        <div class="spinner" aria-label="Loading new items"></div>
      </div>
    {/if}

    <div 
      class="virtual-list"
      style={`height: ${totalSize}px; position: relative;`}
    >
      {#each virtualItems as virtualItem (items[virtualItem.index]?.id || virtualItem.index)}
        {@const item = items[virtualItem.index]}
        {#if item}
          {@const handlersForItem = typeof actionHandlers === 'function'
            ? actionHandlers(item)
            : actionHandlers}
          <div
            data-index={virtualItem.index}
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: {virtualItem.size}px;
              transform: translateY({virtualItem.start}px);
            "
          >
            <StatusCard 
              status={item}
              {density}
              showActions={true}
              actionHandlers={handlersForItem}
              onClick={() => handleStatusCardClick(item)}
            />
          </div>
        {/if}
      {/each}
    </div>

    {#if loadingBottom && !endReached}
      <div class="loading-indicator bottom">
        {#if gapLoader}
          {@render gapLoader()}
        {:else}
          <div class="spinner" aria-label="Loading more items"></div>
        {/if}
      </div>
    {/if}

    {#if endReached}
      <div class="end-of-feed">
        {#if endOfFeed}
          {@render endOfFeed()}
        {:else}
          <p>You've reached the end</p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .timeline-virtualized {
    height: 100%;
    overflow: hidden;
    position: relative;
    background: var(--color-bg, white);
    display: flex;
    flex-direction: column;
  }

  .realtime-status {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--color-bg-secondary, #f7f9fa);
    border-bottom: 1px solid var(--color-border, #e1e8ed);
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
  }

  .realtime-status.connected {
    background: var(--color-success-bg, #e8f5e8);
    border-bottom-color: var(--color-success, #00ba7c);
  }

  .realtime-status.error {
    background: var(--color-error-bg, #fef2f2);
    border-bottom-color: var(--color-error, #ef4444);
  }

  .realtime-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    justify-content: space-between;
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: 500;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-dot.connected {
    background: var(--color-success, #00ba7c);
  }

  .status-dot.error {
    background: var(--color-error, #ef4444);
  }

  .status-dot.reconnecting {
    background: var(--color-warning, #f59e0b);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .unread-indicator {
    background: var(--color-primary, #1d9bf0);
    color: white;
    border: none;
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    border-radius: var(--radius-full, 9999px);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .unread-indicator:hover {
    background: var(--color-primary-hover, #1a91da);
    transform: translateY(-1px);
  }

  .retry-button {
    background: var(--color-error, #ef4444);
    color: white;
    border: none;
    padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
    border-radius: var(--radius-md, 8px);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-button:hover {
    background: var(--color-error-hover, #dc2626);
  }

  .timeline-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }

  .virtual-list {
    position: relative;
    width: 100%;
  }

  .loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-lg, 1.5rem);
    background: var(--color-bg, white);
  }

  .loading-indicator.top {
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid var(--color-border, #e1e8ed);
  }

  .loading-indicator.bottom {
    border-top: 1px solid var(--color-border, #e1e8ed);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border, #e1e8ed);
    border-top-color: var(--color-primary, #1d9bf0);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .end-of-feed {
    padding: var(--spacing-xl, 2rem);
    text-align: center;
    color: var(--color-text-secondary, #536471);
    border-top: 1px solid var(--color-border, #e1e8ed);
  }

  .end-of-feed p {
    margin: 0;
  }

  /* Scrollbar styling */
  .timeline-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .timeline-scroll::-webkit-scrollbar-track {
    background: var(--color-bg-secondary, #f7f9fa);
  }

  .timeline-scroll::-webkit-scrollbar-thumb {
    background: var(--color-border, #e1e8ed);
    border-radius: 4px;
  }

  .timeline-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary, #536471);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .spinner,
    .status-dot {
      animation: none;
    }
    
    .unread-indicator {
      transition: none;
    }
  }

  /* High contrast support */
  @media (prefers-contrast: high) {
    .realtime-status {
      border-bottom-width: 2px;
    }
    
    .status-dot {
      border: 1px solid;
    }
  }
</style>
