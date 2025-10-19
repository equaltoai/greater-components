<script lang="ts">
  import { TimelineVirtualized, type Status } from '@equaltoai/greater-components-fediverse';
  import { generateMockStatuses } from '@equaltoai/greater-components-fediverse/src/mockData';
  import { onMount } from 'svelte';

  let items = $state<Status[]>([]);
  let loadingTop = $state(false);
  let loadingBottom = $state(false);
  let endReached = $state(false);
  let totalLoaded = $state(0);
  const maxItems = 500;
  const batchSize = 50;

  onMount(() => {
    // Load initial items
    loadInitialItems();
  });

  function loadInitialItems() {
    items = generateMockStatuses(batchSize);
    totalLoaded = batchSize;
  }

  async function loadMore() {
    if (loadingBottom || endReached) return;
    
    loadingBottom = true;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const remaining = maxItems - totalLoaded;
    const toLoad = Math.min(batchSize, remaining);
    
    if (toLoad > 0) {
      const newItems = generateMockStatuses(toLoad).map((item, index) => ({
        ...item,
        id: `status-${totalLoaded + index}`,
        createdAt: new Date(Date.now() - (totalLoaded + index) * 3600000).toISOString()
      }));
      
      items = [...items, ...newItems];
      totalLoaded += toLoad;
      
      if (totalLoaded >= maxItems) {
        endReached = true;
      }
    }
    
    loadingBottom = false;
  }

  async function loadPrevious() {
    if (loadingTop) return;
    
    loadingTop = true;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add some new items at the top
    const newItems = generateMockStatuses(10).map((item, index) => ({
      ...item,
      id: `new-status-${Date.now()}-${index}`,
      createdAt: new Date(Date.now() + index * 60000).toISOString()
    }));
    
    items = [...newItems, ...items];
    
    loadingTop = false;
  }
</script>

<div class="timeline-page">
  <header class="timeline-header">
    <h1>Home Timeline</h1>
    <p class="timeline-stats">
      {items.length} items loaded · {endReached ? 'End reached' : `${maxItems - totalLoaded} remaining`}
    </p>
  </header>
  
  <div class="timeline-container">
    <TimelineVirtualized
      {items}
      {loadingTop}
      {loadingBottom}
      {endReached}
      onLoadMore={loadMore}
      onLoadPrevious={loadPrevious}
      estimateSize={200}
      overscan={3}
      density="comfortable"
    >
      {#snippet endOfFeed()}
        <div class="end-message">
          <p>🎉 You've seen all {maxItems} posts!</p>
          <button onclick={loadInitialItems}>Refresh Timeline</button>
        </div>
      {/snippet}
    </TimelineVirtualized>
  </div>
</div>

<style>
  .timeline-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-secondary, #f7f9fa);
  }

  .timeline-header {
    padding: var(--spacing-md, 1rem);
    background: var(--color-bg, white);
    border-bottom: 1px solid var(--color-border, #e1e8ed);
    flex-shrink: 0;
  }

  .timeline-header h1 {
    margin: 0;
    font-size: var(--font-size-xl, 1.5rem);
  }

  .timeline-stats {
    margin: var(--spacing-xs, 0.25rem) 0 0;
    color: var(--color-text-secondary, #536471);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .timeline-container {
    flex: 1;
    overflow: hidden;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    background: var(--color-bg, white);
    border-left: 1px solid var(--color-border, #e1e8ed);
    border-right: 1px solid var(--color-border, #e1e8ed);
  }

  .end-message {
    text-align: center;
    padding: var(--spacing-xl, 2rem);
  }

  .end-message p {
    margin-bottom: var(--spacing-md, 1rem);
    font-size: var(--font-size-lg, 1.125rem);
  }

  .end-message button {
    padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem);
    background: var(--color-primary, #1d9bf0);
    color: white;
    border: none;
    border-radius: var(--radius-md, 8px);
    font-size: var(--font-size-md, 1rem);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .end-message button:hover {
    background: var(--color-primary-hover, #1a8cd8);
  }

  .end-message button:focus-visible {
    outline: 2px solid var(--color-focus, #1d9bf0);
    outline-offset: 2px;
  }
</style>