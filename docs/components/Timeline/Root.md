# Timeline.Root

**Component**: Context Provider & Container  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 47 passing tests

---

## 📋 Overview

`Timeline.Root` is the foundational component for all Timeline compound components. It creates and provides timeline context to child components, manages virtualization, handles infinite scrolling, and coordinates real-time updates. This component serves as the container for timeline items and manages their lifecycle.

### **Key Features**:
- ✅ **Context Provider** - Provides shared state to child components
- ✅ **Virtual Scrolling** - Efficiently renders large datasets using `@tanstack/svelte-virtual`
- ✅ **Infinite Scroll** - Automatic loading as user scrolls
- ✅ **Real-time Support** - WebSocket subscription integration
- ✅ **Scroll Management** - Tracks scroll position and triggers events
- ✅ **Loading States** - Manages loading, error, and empty states
- ✅ **Type-Safe** - Full TypeScript support with generic types
- ✅ **Accessible** - ARIA roles and keyboard navigation
- ✅ **Performant** - Optimized for 10,000+ items

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([
    {
      id: '1',
      content: 'Hello from the fediverse!',
      account: {
        id: '1',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'https://example.com/avatar.jpg',
        acct: 'alice@social.example'
      },
      createdAt: new Date().toISOString(),
      reblogsCount: 5,
      favouritesCount: 12,
      repliesCount: 3
    }
  ]);
</script>

<Timeline.Root {items}>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <Status.Root status={item}>
        <Status.Header />
        <Status.Content />
        <Status.Actions />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `GenericTimelineItem[]` | `[]` | Yes | Array of timeline items to display |
| `config` | `TimelineCompoundConfig` | `{}` | No | Configuration options for behavior and appearance |
| `handlers` | `TimelineHandlers` | `{}` | No | Event handlers for user interactions |
| `initialState` | `Partial<TimelineCompoundState>` | `{}` | No | Initial component state |
| `children` | `Snippet` | - | No | Child components (Timeline.Item, etc.) |

---

## 📐 Type Definitions

### TimelineCompoundConfig

```typescript
interface TimelineCompoundConfig {
  /**
   * Display mode affecting layout and behavior
   * @default 'feed'
   */
  mode?: 'feed' | 'thread' | 'profile' | 'search';

  /**
   * Display density
   * @default 'comfortable'
   */
  density?: 'compact' | 'comfortable' | 'spacious';

  /**
   * Enable virtual scrolling for performance
   * @default true
   */
  virtualized?: boolean;

  /**
   * Enable infinite scroll (auto-load more)
   * @default true
   */
  infiniteScroll?: boolean;

  /**
   * Enable real-time updates via WebSocket
   * @default false
   */
  realtime?: boolean;

  /**
   * Show loading indicators
   * @default true
   */
  showLoading?: boolean;

  /**
   * Estimated item height for virtualization (px)
   * @default 200
   */
  estimatedItemHeight?: number;

  /**
   * Number of items to render outside viewport (overscan)
   * @default 5
   */
  overscan?: number;

  /**
   * Custom CSS class
   * @default ''
   */
  class?: string;
}
```

### TimelineHandlers

```typescript
interface TimelineHandlers {
  /**
   * Called when more items should be loaded
   * Triggered by infinite scroll or LoadMore component
   */
  onLoadMore?: () => Promise<void> | void;

  /**
   * Called when timeline is refreshed (pull-to-refresh)
   */
  onRefresh?: () => Promise<void> | void;

  /**
   * Called when an item is clicked
   * @param item - The clicked timeline item
   * @param index - Index of the item in the timeline
   */
  onItemClick?: (item: GenericTimelineItem, index: number) => void;

  /**
   * Called when timeline scrolls
   * @param scrollTop - Current scroll position in pixels
   */
  onScroll?: (scrollTop: number) => void;
}
```

### TimelineCompoundState

```typescript
interface TimelineCompoundState {
  /**
   * Whether timeline is currently loading
   */
  loading: boolean;

  /**
   * Whether more items are being loaded
   */
  loadingMore: boolean;

  /**
   * Whether there are more items to load
   */
  hasMore: boolean;

  /**
   * Error state if any
   */
  error: Error | null;

  /**
   * Number of items in timeline
   */
  itemCount: number;

  /**
   * Current scroll position (px)
   */
  scrollTop: number;
}
```

---

## 💡 Examples

### Example 1: Basic Home Timeline

A standard home timeline with manual load more:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let hasMore = $state(true);
  let cursor: string | null = $state(null);

  // Load initial timeline
  $effect(() => {
    loadTimeline();
  });

  async function loadTimeline() {
    try {
      const response = await fetch('/api/timeline/home');
      const data = await response.json();
      
      items = data.items;
      cursor = data.nextCursor;
      hasMore = !!cursor;
    } catch (error) {
      console.error('Failed to load timeline:', error);
    }
  }

  async function loadMore() {
    if (!cursor) return;

    try {
      const response = await fetch(`/api/timeline/home?cursor=${cursor}`);
      const data = await response.json();
      
      items = [...items, ...data.items];
      cursor = data.nextCursor;
      hasMore = !!cursor;
    } catch (error) {
      console.error('Failed to load more:', error);
    }
  }

  const handlers = {
    onLoadMore: loadMore,
    onItemClick: (item, index) => {
      console.log('Clicked item:', item.id, 'at index:', index);
      // Navigate to detail view
      window.location.href = `/status/${item.id}`;
    }
  };

  const initialState = {
    hasMore
  };
</script>

<div class="timeline-container">
  <header class="timeline-header">
    <h1>Home Timeline</h1>
    <button onclick={() => loadTimeline()}>Refresh</button>
  </header>

  <Timeline.Root {items} {handlers} {initialState} config={{ infiniteScroll: false }}>
    {#if items.length === 0}
      <Timeline.EmptyState
        title="Your timeline is empty"
        description="Follow some accounts to see their posts here"
      />
    {:else}
      {#each items as item, index}
        <Timeline.Item {item} {index}>
          <Status.Root status={item}>
            <Status.Header />
            <Status.Content />
            <Status.Media />
            <Status.Actions />
          </Status.Root>
        </Timeline.Item>
      {/each}

      <Timeline.LoadMore buttonText="Load more posts" />
    {/if}
  </Timeline.Root>
</div>

<style>
  .timeline-container {
    max-width: 600px;
    margin: 0 auto;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
    min-height: 100vh;
  }

  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e1e8ed;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .timeline-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .timeline-header button {
    padding: 0.5rem 1rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
  }

  .timeline-header button:hover {
    background: #1a8cd8;
  }
</style>
```

---

### Example 2: Virtual Scrolling for Large Timelines

Efficiently render 10,000+ items using virtual scrolling:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  // Large dataset - 10,000 items
  let items: GenericTimelineItem[] = $state([]);

  // Generate large dataset for demo
  $effect(() => {
    items = Array.from({ length: 10000 }, (_, i) => ({
      id: `${i + 1}`,
      content: `Post #${i + 1} - This is a sample post with some content.`,
      account: {
        id: `${(i % 100) + 1}`,
        username: `user${(i % 100) + 1}`,
        displayName: `User ${(i % 100) + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${(i % 100) + 1}`,
        acct: `user${(i % 100) + 1}@mastodon.social`
      },
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      reblogsCount: Math.floor(Math.random() * 50),
      favouritesCount: Math.floor(Math.random() * 100),
      repliesCount: Math.floor(Math.random() * 20),
      reblogged: false,
      favourited: false,
      bookmarked: false
    }));
  });

  // Virtual scrolling configuration
  const config = {
    virtualized: true,
    estimatedItemHeight: 180, // Average item height
    overscan: 10, // Render 10 extra items above/below viewport
    infiniteScroll: false, // Disable for demo
    density: 'comfortable' as const
  };

  // Track performance
  let scrollPosition = $state(0);
  let visibleRange = $state({ start: 0, end: 0 });

  const handlers = {
    onScroll: (scrollTop: number) => {
      scrollPosition = scrollTop;
      
      // Calculate visible range (rough estimate)
      const itemHeight = config.estimatedItemHeight;
      const viewportHeight = window.innerHeight;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight);
      
      visibleRange = { start: startIndex, end: endIndex };
    }
  };
</script>

<div class="virtual-timeline-demo">
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-label">Total Items:</span>
      <span class="stat-value">{items.length.toLocaleString()}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Scroll Position:</span>
      <span class="stat-value">{scrollPosition.toFixed(0)}px</span>
    </div>
    <div class="stat">
      <span class="stat-label">Visible Range:</span>
      <span class="stat-value">{visibleRange.start}-{visibleRange.end}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Rendered Items:</span>
      <span class="stat-value">~{visibleRange.end - visibleRange.start + config.overscan * 2}</span>
    </div>
  </div>

  <Timeline.Root {items} {config} {handlers}>
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <Status.Root status={item} config={{ density: 'comfortable' }}>
          <Status.Header />
          <Status.Content />
          <Status.Actions />
        </Status.Root>
      </Timeline.Item>
    {/each}
  </Timeline.Root>
</div>

<style>
  .virtual-timeline-demo {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .stats-bar {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f7f9fa;
    border-bottom: 1px solid #e1e8ed;
    font-size: 0.875rem;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    gap: 0.5rem;
  }

  .stat-label {
    color: #536471;
    font-weight: 500;
  }

  .stat-value {
    color: #0f1419;
    font-weight: 700;
  }
</style>
```

**Performance Notes**:
- Only ~30-40 DOM nodes rendered at any time
- Smooth 60fps scrolling
- Memory efficient
- Dynamic item heights supported

---

### Example 3: Real-time Timeline with WebSocket Subscriptions

Live timeline updates via GraphQL subscriptions:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import { createApolloClient } from '@greater/adapters';
  import { gql } from '@apollo/client/core';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  const client = createApolloClient({
    uri: 'https://api.lesser.social/graphql',
    wsUri: 'wss://api.lesser.social/graphql'
  });

  let items: GenericTimelineItem[] = $state([]);
  let newPostsCount = $state(0);
  let showNewPostsIndicator = $state(false);

  // Load initial timeline
  $effect(() => {
    loadInitialTimeline();
    subscribeToNewPosts();
  });

  async function loadInitialTimeline() {
    const { data } = await client.query({
      query: gql`
        query GetHomeTimeline($limit: Int!) {
          homeTimeline(limit: $limit) {
            id
            content
            createdAt
            reblogsCount
            favouritesCount
            repliesCount
            account {
              id
              username
              displayName
              avatar
              acct
            }
            mediaAttachments {
              id
              type
              url
              previewUrl
              description
            }
          }
        }
      `,
      variables: { limit: 20 }
    });

    items = data.homeTimeline;
  }

  function subscribeToNewPosts() {
    const subscription = client.subscribe({
      query: gql`
        subscription OnNewStatus {
          statusCreated(timeline: "home") {
            id
            content
            createdAt
            reblogsCount
            favouritesCount
            repliesCount
            account {
              id
              username
              displayName
              avatar
              acct
            }
            mediaAttachments {
              id
              type
              url
              previewUrl
              description
            }
          }
        }
      `
    });

    subscription.subscribe({
      next: ({ data }) => {
        // Don't auto-insert - show indicator instead
        newPostsCount += 1;
        showNewPostsIndicator = true;
        
        // Store new posts temporarily
        pendingPosts.unshift(data.statusCreated);
      },
      error: (err) => {
        console.error('Subscription error:', err);
        // Attempt to reconnect
        setTimeout(() => subscribeToNewPosts(), 5000);
      }
    });
  }

  let pendingPosts: GenericTimelineItem[] = [];

  function loadNewPosts() {
    // Insert pending posts at the top
    items = [...pendingPosts, ...items];
    pendingPosts = [];
    newPostsCount = 0;
    showNewPostsIndicator = false;
    
    // Scroll to top smoothly
    document.querySelector('.timeline-root')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Optimistic updates for interactions
  async function handleBoost(status: GenericTimelineItem) {
    const originalBoosted = status.reblogged;
    const originalCount = status.reblogsCount;
    
    // Optimistic update
    status.reblogged = !status.reblogged;
    status.reblogsCount += status.reblogged ? 1 : -1;
    items = [...items]; // Trigger reactivity

    try {
      await client.mutate({
        mutation: gql`
          mutation BoostStatus($id: ID!) {
            ${status.reblogged ? 'boostStatus' : 'unboostStatus'}(id: $id) {
              id
              reblogged
              reblogsCount
            }
          }
        `,
        variables: { id: status.id }
      });
    } catch (error) {
      // Rollback on error
      status.reblogged = originalBoosted;
      status.reblogsCount = originalCount;
      items = [...items];
      console.error('Failed to boost:', error);
    }
  }

  async function handleFavorite(status: GenericTimelineItem) {
    const originalFavorited = status.favourited;
    const originalCount = status.favouritesCount;
    
    // Optimistic update
    status.favourited = !status.favourited;
    status.favouritesCount += status.favourited ? 1 : -1;
    items = [...items];

    try {
      await client.mutate({
        mutation: gql`
          mutation FavoriteStatus($id: ID!) {
            ${status.favourited ? 'favoriteStatus' : 'unfavoriteStatus'}(id: $id) {
              id
              favourited
              favouritesCount
            }
          }
        `,
        variables: { id: status.id }
      });
    } catch (error) {
      // Rollback on error
      status.favourited = originalFavorited;
      status.favouritesCount = originalCount;
      items = [...items];
      console.error('Failed to favorite:', error);
    }
  }

  const config = {
    realtime: true,
    virtualized: true,
    infiniteScroll: true
  };
</script>

<div class="realtime-timeline">
  {#if showNewPostsIndicator}
    <button class="new-posts-indicator" onclick={loadNewPosts}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M7 10l5-5 5 5H7z" />
      </svg>
      {newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'}
    </button>
  {/if}

  <Timeline.Root {items} {config}>
    {#each items as item, index}
      <Timeline.Item {item} {index}>
        <Status.Root 
          status={item}
          handlers={{
            onBoost: () => handleBoost(item),
            onFavorite: () => handleFavorite(item)
          }}
        >
          <Status.Header />
          <Status.Content />
          <Status.Media />
          <Status.Actions />
        </Status.Root>
      </Timeline.Item>
    {/each}
  </Timeline.Root>
</div>

<style>
  .realtime-timeline {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
  }

  .new-posts-indicator {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 0.75rem 1.5rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideDown 0.3s ease-out;
  }

  .new-posts-indicator:hover {
    background: #1a8cd8;
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
```

**Real-time Features**:
- ✅ WebSocket subscriptions for new posts
- ✅ New posts indicator (no auto-insert)
- ✅ Optimistic updates for interactions
- ✅ Automatic reconnection on disconnect
- ✅ Error handling and rollback

---

### Example 4: Infinite Scroll Timeline

Automatically load more items as user scrolls:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let hasMore = $state(true);
  let cursor: string | null = $state(null);
  let isLoadingMore = $state(false);
  let error = $state<Error | null>(null);

  // Load initial page
  $effect(() => {
    loadInitialPage();
  });

  async function loadInitialPage() {
    try {
      const data = await fetchTimeline();
      items = data.items;
      cursor = data.nextCursor;
      hasMore = !!cursor;
    } catch (err) {
      error = err as Error;
      console.error('Failed to load timeline:', err);
    }
  }

  async function loadMore() {
    if (!cursor || isLoadingMore || !hasMore) return;

    isLoadingMore = true;
    error = null;

    try {
      const data = await fetchTimeline(cursor);
      
      // Append new items
      items = [...items, ...data.items];
      cursor = data.nextCursor;
      hasMore = !!cursor;
    } catch (err) {
      error = err as Error;
      console.error('Failed to load more:', err);
    } finally {
      isLoadingMore = false;
    }
  }

  async function fetchTimeline(cursor?: string): Promise<{
    items: GenericTimelineItem[];
    nextCursor: string | null;
  }> {
    const url = cursor 
      ? `/api/timeline/home?cursor=${cursor}`
      : '/api/timeline/home';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch timeline');
    }
    
    return response.json();
  }

  async function handleRefresh() {
    cursor = null;
    hasMore = true;
    await loadInitialPage();
  }

  const config = {
    infiniteScroll: true, // Enable auto-load
    virtualized: true,
    showLoading: true
  };

  const handlers = {
    onLoadMore: loadMore,
    onRefresh: handleRefresh
  };

  const initialState = {
    hasMore,
    loadingMore: isLoadingMore,
    error
  };

  // Update state when values change
  $effect(() => {
    initialState.hasMore = hasMore;
    initialState.loadingMore = isLoadingMore;
    initialState.error = error;
  });
</script>

<div class="infinite-scroll-timeline">
  <header class="sticky-header">
    <h1>Home</h1>
    <button 
      onclick={handleRefresh}
      disabled={isLoadingMore}
      aria-label="Refresh timeline"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path 
          fill="currentColor" 
          d="M4.5 12c0-4.14 3.36-7.5 7.5-7.5 1.93 0 3.68.73 5 1.92V4.5h2V10h-5.5V8h2.23c-.89-.86-2.1-1.5-3.73-1.5-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5c2.55 0 4.68-1.74 5.29-4.09l1.96.35C17.5 17.39 14.99 19.5 12 19.5c-4.14 0-7.5-3.36-7.5-7.5z"
        />
      </svg>
    </button>
  </header>

  {#if error}
    <Timeline.ErrorState 
      {error} 
      onRetry={handleRefresh}
    />
  {:else}
    <Timeline.Root {items} {config} {handlers} {initialState}>
      {#if items.length === 0}
        <Timeline.EmptyState
          title="No posts yet"
          description="Follow some accounts to see posts in your timeline"
        >
          {#snippet action()}
            <button class="primary-button">Find accounts to follow</button>
          {/snippet}
        </Timeline.EmptyState>
      {:else}
        {#each items as item, index}
          <Timeline.Item {item} {index}>
            <Status.Root status={item}>
              <Status.Header />
              <Status.Content />
              <Status.Media />
              <Status.Actions />
            </Status.Root>
          </Timeline.Item>
        {/each}

        <!-- Loading indicator for infinite scroll -->
        {#if isLoadingMore}
          <div class="loading-indicator">
            <svg class="spinner" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
            </svg>
            <span>Loading more...</span>
          </div>
        {/if}

        {#if !hasMore}
          <div class="end-of-timeline">
            <p>You've reached the end of the timeline</p>
          </div>
        {/if}
      {/if}
    </Timeline.Root>
  {/if}
</div>

<style>
  .infinite-scroll-timeline {
    max-width: 600px;
    margin: 0 auto;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
    min-height: 100vh;
    background: white;
  }

  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e1e8ed;
  }

  .sticky-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .sticky-header button {
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0f1419;
    transition: background-color 0.2s;
  }

  .sticky-header button:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.05);
  }

  .sticky-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem;
    color: #536471;
  }

  .spinner {
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .end-of-timeline {
    text-align: center;
    padding: 2rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .primary-button {
    padding: 0.75rem 1.5rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
  }

  .primary-button:hover {
    background: #1a8cd8;
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
  }
</style>
```

**Infinite Scroll Behavior**:
- Triggers when user is within 400px of bottom
- Prevents duplicate load requests
- Shows loading indicator while fetching
- Displays "end of timeline" message when no more items
- Pull-to-refresh support

---

### Example 5: Thread/Conversation View

Display a status with its context (ancestors and descendants):

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  interface ThreadContext {
    ancestors: GenericTimelineItem[];
    mainStatus: GenericTimelineItem;
    descendants: GenericTimelineItem[];
  }

  let thread: ThreadContext = $state({
    ancestors: [],
    mainStatus: null!,
    descendants: []
  });

  let focusedStatusId = $state('');
  let isLoading = $state(true);
  let error = $state<Error | null>(null);

  // Load thread context
  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusId = params.get('id');
    if (statusId) {
      loadThread(statusId);
    }
  });

  async function loadThread(statusId: string) {
    isLoading = true;
    error = null;
    focusedStatusId = statusId;

    try {
      const response = await fetch(`/api/status/${statusId}/context`);
      if (!response.ok) throw new Error('Failed to load thread');
      
      const data = await response.json();
      thread = {
        ancestors: data.ancestors || [],
        mainStatus: data.status,
        descendants: data.descendants || []
      };
    } catch (err) {
      error = err as Error;
      console.error('Failed to load thread:', err);
    } finally {
      isLoading = false;
    }
  }

  // Combine all items for timeline
  const allItems = $derived([
    ...thread.ancestors,
    thread.mainStatus,
    ...thread.descendants
  ].filter(Boolean));

  // Calculate indentation based on reply depth
  function getIndentLevel(item: GenericTimelineItem): number {
    // Check if this is in ancestors (parent chain)
    const ancestorIndex = thread.ancestors.findIndex(a => a.id === item.id);
    if (ancestorIndex >= 0) {
      return ancestorIndex;
    }
    
    // Check if this is the main status
    if (item.id === focusedStatusId) {
      return thread.ancestors.length;
    }
    
    // For descendants, calculate depth
    let depth = thread.ancestors.length + 1;
    let current = item;
    
    // Traverse up reply chain
    while (current.inReplyToId && current.inReplyToId !== focusedStatusId) {
      const parent = allItems.find(i => i.id === current.inReplyToId);
      if (!parent) break;
      current = parent;
      depth++;
    }
    
    return depth;
  }

  const config = {
    mode: 'thread' as const,
    virtualized: false, // Threads are usually small
    infiniteScroll: false
  };

  const handlers = {
    onItemClick: (item: GenericTimelineItem) => {
      // Navigate to clicked status in thread view
      if (item.id !== focusedStatusId) {
        loadThread(item.id);
      }
    }
  };
</script>

<div class="thread-view">
  <header class="thread-header">
    <button class="back-button" onclick={() => window.history.back()}>
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="currentColor" d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
      </svg>
      Back
    </button>
    <h1>Thread</h1>
  </header>

  {#if isLoading}
    <div class="loading-state">
      <svg class="spinner" viewBox="0 0 24 24" width="32" height="32">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path fill="currentColor" d="M12 4a8 8 0 0 0-8 8h2a6 6 0 0 1 6-6z" />
      </svg>
      <p>Loading thread...</p>
    </div>
  {:else if error}
    <Timeline.ErrorState 
      {error}
      onRetry={() => loadThread(focusedStatusId)}
    />
  {:else if !thread.mainStatus}
    <Timeline.EmptyState
      title="Thread not found"
      description="This post may have been deleted"
    />
  {:else}
    <Timeline.Root items={allItems} {config} {handlers}>
      {#each allItems as item, index}
        {@const indentLevel = getIndentLevel(item)}
        {@const isFocused = item.id === focusedStatusId}
        
        <Timeline.Item {item} {index}>
          <div 
            class="thread-item"
            class:thread-item--focused={isFocused}
            style="padding-left: {indentLevel * 2}rem"
          >
            {#if indentLevel > 0}
              <div class="thread-line" style="left: {(indentLevel - 1) * 2 + 0.75}rem"></div>
            {/if}

            <Status.Root 
              status={item}
              config={{ 
                clickable: !isFocused,
                showThread: true 
              }}
            >
              <Status.Header />
              <Status.Content />
              <Status.Media />
              {#if isFocused}
                <Status.Actions />
              {/if}
            </Status.Root>
          </div>
        </Timeline.Item>
      {/each}
    </Timeline.Root>
  {/if}
</div>

<style>
  .thread-view {
    max-width: 600px;
    margin: 0 auto;
    border-left: 1px solid #e1e8ed;
    border-right: 1px solid #e1e8ed;
    min-height: 100vh;
    background: white;
  }

  .thread-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e1e8ed;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 600;
    color: #0f1419;
  }

  .back-button:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .thread-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
    color: #536471;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .thread-item {
    position: relative;
    transition: background-color 0.2s;
  }

  .thread-item--focused {
    background: #f7f9fa;
    border-top: 1px solid #e1e8ed;
    border-bottom: 1px solid #e1e8ed;
  }

  .thread-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e1e8ed;
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
  }
</style>
```

**Thread Features**:
- ✅ Displays full conversation context
- ✅ Visual thread lines connecting replies
- ✅ Indentation based on reply depth
- ✅ Highlights focused status
- ✅ Navigate between statuses in thread
- ✅ Supports deeply nested replies

---

## 🔄 Real-time Integration

### WebSocket Connection

```svelte
<script lang="ts">
  import { Timeline } from '@greater/fediverse';
  
  let ws: WebSocket;
  let items = $state([]);

  $effect(() => {
    ws = new WebSocket('wss://api.example.com/stream');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      // Subscribe to home timeline
      ws.send(JSON.stringify({
        type: 'subscribe',
        stream: 'user'
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.event === 'update') {
        // New status received
        items = [data.payload, ...items];
      } else if (data.event === 'delete') {
        // Status deleted
        items = items.filter(item => item.id !== data.payload);
      } else if (data.event === 'status.update') {
        // Status edited
        const index = items.findIndex(item => item.id === data.payload.id);
        if (index >= 0) {
          items[index] = data.payload;
          items = [...items];
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => {
        // Reconnect logic
      }, 5000);
    };

    return () => {
      ws.close();
    };
  });
</script>

<Timeline.Root {items} config={{ realtime: true }}>
  <!-- Timeline items -->
</Timeline.Root>
```

---

## 🔒 Security Considerations

### Content Sanitization

All HTML content is sanitized before rendering:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(content, {
  ALLOWED_TAGS: ['p', 'br', 'a', 'span', 'strong', 'em', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'class', 'rel', 'target'],
  ALLOW_DATA_ATTR: false
});
```

### Rate Limiting

Implement rate limiting for user actions:

```svelte
<script lang="ts">
  import { rateLimit } from '@greater/utils';

  const limitedLoadMore = rateLimit(async () => {
    await loadMore();
  }, 1000); // Max once per second
</script>

<Timeline.Root handlers={{ onLoadMore: limitedLoadMore }}>
  <!-- Timeline -->
</Timeline.Root>
```

### CSP Headers

Set appropriate Content Security Policy headers:

```http
Content-Security-Policy: 
  default-src 'self'; 
  connect-src 'self' wss://api.example.com; 
  img-src 'self' https:; 
  media-src 'self' https:;
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.timeline-root {
  /* Background colors */
  --timeline-bg: white;
  --timeline-item-bg: white;
  --timeline-item-hover-bg: #f7f9fa;
  
  /* Borders */
  --timeline-border: #e1e8ed;
  
  /* Text colors */
  --timeline-text-primary: #0f1419;
  --timeline-text-secondary: #536471;
  
  /* Focus ring */
  --timeline-focus-ring: #3b82f6;
  
  /* Spacing */
  --timeline-spacing: 1rem;
  --timeline-spacing-lg: 2rem;
  --timeline-item-spacing: 1rem;
  
  /* Typography */
  --timeline-font-size-base: 1rem;
  --timeline-font-size-sm: 0.875rem;
  --timeline-font-size-xl: 1.25rem;
  
  /* Scrollbar */
  --timeline-scrollbar-track: transparent;
  --timeline-scrollbar-thumb: #ccc;
  --timeline-scrollbar-thumb-hover: #999;
}
```

### Density Modes

```svelte
<!-- Compact -->
<Timeline.Root config={{ density: 'compact' }}>
  <!-- --timeline-item-spacing: 0.5rem -->
</Timeline.Root>

<!-- Comfortable (default) -->
<Timeline.Root config={{ density: 'comfortable' }}>
  <!-- --timeline-item-spacing: 1rem -->
</Timeline.Root>

<!-- Spacious -->
<Timeline.Root config={{ density: 'spacious' }}>
  <!-- --timeline-item-spacing: 1.5rem -->
</Timeline.Root>
```

---

## ♿ Accessibility

### ARIA Attributes

```html
<div 
  class="timeline-root"
  role="feed"
  aria-busy="false"
  aria-label="Home timeline"
>
  <!-- Items with aria-posinset and aria-setsize -->
</div>
```

### Keyboard Navigation

- `Tab`: Navigate between interactive elements
- `Shift+Tab`: Navigate backwards
- `Enter`/`Space`: Activate focused item
- `Home`: Scroll to top
- `End`: Scroll to bottom

### Screen Reader Support

```svelte
<Timeline.Root {items}>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <!-- Announces: "Article 1 of 100" -->
      <Status.Root status={item}>
        <!-- Screen reader accessible content -->
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>
```

---

## ⚡ Performance

### Optimization Tips

1. **Enable Virtual Scrolling** for timelines with 100+ items
2. **Use Infinite Scroll** instead of pagination for better UX
3. **Implement Optimistic Updates** for instant feedback
4. **Lazy Load Images** with `loading="lazy"` attribute
5. **Debounce Scroll Events** to reduce event handler calls
6. **Use `$derived`** for computed values instead of effects
7. **Minimize Re-renders** by using proper reactivity patterns

### Memory Management

```svelte
<script lang="ts">
  import { Timeline } from '@greater/fediverse';

  let items = $state([]);
  const MAX_ITEMS = 1000;

  function addItems(newItems: GenericTimelineItem[]) {
    items = [...newItems, ...items].slice(0, MAX_ITEMS);
  }
</script>
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/svelte';
import { Timeline } from '@greater/fediverse';

describe('Timeline.Root', () => {
  it('renders timeline items', () => {
    const items = [
      { id: '1', content: 'Post 1', account: mockAccount, createdAt: new Date().toISOString() },
      { id: '2', content: 'Post 2', account: mockAccount, createdAt: new Date().toISOString() }
    ];

    render(Timeline.Root, { props: { items } });

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
  });

  it('triggers onLoadMore when scrolled to bottom', async () => {
    const onLoadMore = vi.fn();
    const items = Array.from({ length: 10 }, (_, i) => mockItem(i));

    const { container } = render(Timeline.Root, {
      props: {
        items,
        config: { infiniteScroll: true },
        handlers: { onLoadMore }
      }
    });

    const timeline = container.querySelector('.timeline-root');
    
    // Simulate scroll to bottom
    Object.defineProperty(timeline, 'scrollHeight', { value: 1000 });
    Object.defineProperty(timeline, 'scrollTop', { value: 700 });
    Object.defineProperty(timeline, 'clientHeight', { value: 500 });

    timeline?.dispatchEvent(new Event('scroll'));

    await vi.waitFor(() => {
      expect(onLoadMore).toHaveBeenCalled();
    });
  });
});
```

---

## 🔗 Related Components

- [Timeline.Item](./Item.md) - Individual timeline item wrapper
- [Timeline.LoadMore](./LoadMore.md) - Load more trigger
- [Timeline.EmptyState](./EmptyState.md) - Empty state display
- [Timeline.ErrorState](./ErrorState.md) - Error state display
- [Status Components](../Status/README.md) - Status display components

---

## 📚 See Also

- [Timeline Components README](./README.md)
- [Virtual Scrolling Guide](../../guides/virtual-scrolling.md)
- [Real-time Integration Guide](../../guides/realtime.md)
- [Performance Optimization](../../guides/performance.md)
- [API Documentation](../../API_DOCUMENTATION.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

