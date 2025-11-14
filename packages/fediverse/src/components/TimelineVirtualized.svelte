<script lang="ts">
  import StatusCard from './StatusCard.svelte';
  import type { Status } from '../types';
  import type { StatusActionHandlers } from './Status/context.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /**
     * Array of status items to display
     */
    items: Status[];
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
     * Custom gap loader content
     */
    gapLoader?: Snippet;
    /**
     * Custom end of feed content
     */
    endOfFeed?: Snippet;
    /**
     * CSS class for the timeline
     */
    class?: string;
    /**
     * Density for status cards
     */
    density?: 'compact' | 'comfortable';
    /**
     * Action handlers to pass into StatusCard
     */
    actionHandlers?: StatusActionHandlers | ((status: Status) => StatusActionHandlers | undefined);
  }

  let {
    items = [],
    estimateSize = 200,
    overscan = 5,
    loadingTop = false,
    loadingBottom = false,
    endReached = false,
    onLoadMore,
    onLoadPrevious,
    gapLoader,
    endOfFeed,
    class: className = '',
    density = 'comfortable',
    actionHandlers,
  }: Props = $props();

  // Preserve unused props for API compatibility
  void estimateSize;
  void overscan;
  void onLoadMore;
  void onLoadPrevious;

</script>

<div 
  class={`timeline-virtualized ${className}`}
  role="feed"
  aria-label="Timeline"
  aria-busy={loadingTop || loadingBottom}
>
  {#if loadingTop}
    <div class="loading-indicator top">
      <div class="spinner" aria-label="Loading new items"></div>
    </div>
  {/if}

  <div class="virtual-list">
    {#each items as item, index (item?.id || index)}
      {@const handlersForItem = typeof actionHandlers === 'function'
        ? actionHandlers(item)
        : actionHandlers}
      <div class="virtual-row">
        <StatusCard 
          status={item}
          {density}
          showActions={true}
          actionHandlers={handlersForItem}
        />
      </div>
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

<style>
  .timeline-virtualized {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background: var(--color-bg, white);
  }

  .virtual-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    padding: 0 var(--spacing-md, 1rem) var(--spacing-xl, 2rem);
  }

  .virtual-row {
    position: relative;
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
  .timeline-virtualized::-webkit-scrollbar {
    width: 8px;
  }

  .timeline-virtualized::-webkit-scrollbar-track {
    background: var(--color-bg-secondary, #f7f9fa);
  }

  .timeline-virtualized::-webkit-scrollbar-thumb {
    background: var(--color-border, #e1e8ed);
    border-radius: 4px;
  }

  .timeline-virtualized::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary, #536471);
  }
</style>
