# Timeline Compound Component - Lesser Client Integration

This guide demonstrates integrating the new Timeline compound component into the Lesser native client.

## Basic Feed View

```svelte
<!-- lesser-client/src/routes/home/+page.svelte -->
<script lang="ts">
  import { TimelineCompound as Timeline, StatusCompound as Status } from '@greater/fediverse';
  import type { Status as StatusType } from '@greater/fediverse';
  
  // Lesser API client
  import { lesserApi } from '$lib/api';
  import { goto } from '$app/navigation';
  
  let posts = $state<StatusType[]>([]);
  let loading = $state(true);
  let error = $state<Error | null>(null);
  let hasMore = $state(true);
  
  // Load initial posts
  $effect(() => {
    loadPosts();
  });
  
  async function loadPosts() {
    try {
      loading = true;
      const response = await lesserApi.timeline.home({ limit: 20 });
      posts = response.data;
      hasMore = response.data.length === 20;
    } catch (err) {
      error = err as Error;
    } finally {
      loading = false;
    }
  }
  
  async function loadMore() {
    if (!hasMore || !posts.length) return;
    
    try {
      const maxId = posts[posts.length - 1].id;
      const response = await lesserApi.timeline.home({ 
        limit: 20,
        maxId 
      });
      
      posts = [...posts, ...response.data];
      hasMore = response.data.length === 20;
    } catch (err) {
      error = err as Error;
    }
  }
  
  async function handleRefresh() {
    posts = [];
    hasMore = true;
    await loadPosts();
  }
  
  function handleStatusClick(status: StatusType, index: number) {
    goto(`/status/${status.id}`);
  }
  
  async function handleBoost(status: StatusType) {
    try {
      if (status.reblogged) {
        await lesserApi.statuses.unreblog(status.id);
      } else {
        await lesserApi.statuses.reblog(status.id);
      }
      
      // Update local state
      posts = posts.map(p => 
        p.id === status.id 
          ? { ...p, reblogged: !p.reblogged, reblogsCount: p.reblogsCount + (p.reblogged ? -1 : 1) }
          : p
      );
    } catch (err) {
      console.error('Failed to boost:', err);
    }
  }
  
  async function handleFavorite(status: StatusType) {
    try {
      if (status.favourited) {
        await lesserApi.statuses.unfavourite(status.id);
      } else {
        await lesserApi.statuses.favourite(status.id);
      }
      
      // Update local state
      posts = posts.map(p => 
        p.id === status.id 
          ? { ...p, favourited: !p.favourited, favouritesCount: p.favouritesCount + (p.favourited ? -1 : 1) }
          : p
      );
    } catch (err) {
      console.error('Failed to favorite:', err);
    }
  }
  
  function handleReply(status: StatusType) {
    goto(`/compose?replyTo=${status.id}`);
  }
</script>

<div class="home-timeline">
  <header class="timeline-header">
    <h1>Home</h1>
    <button onclick={handleRefresh} disabled={loading}>
      Refresh
    </button>
  </header>
  
  <Timeline.Root
    items={posts}
    config={{
      mode: 'feed',
      density: 'comfortable',
      virtualized: true,
      infiniteScroll: true,
      class: 'lesser-timeline'
    }}
    handlers={{
      onLoadMore: loadMore,
      onItemClick: handleStatusClick
    }}
    initialState={{ loading, error, hasMore }}
  >
    {#if error}
      <Timeline.ErrorState 
        {error} 
        onRetry={handleRefresh}
      />
    {:else if loading && posts.length === 0}
      <div class="loading-skeleton">
        <!-- Loading skeleton UI -->
        {#each Array(5) as _}
          <div class="skeleton-item"></div>
        {/each}
      </div>
    {:else if posts.length === 0}
      <Timeline.EmptyState
        title="Welcome to Lesser!"
        description="Your home timeline is empty. Follow some accounts to see their posts here."
      >
        {#snippet action()}
          <button onclick={() => goto('/explore')}>
            Discover accounts
          </button>
        {/snippet}
      </Timeline.EmptyState>
    {:else}
      {#each posts as status, index}
        <Timeline.Item {status} {index}>
          <Status.Root
            {status}
            config={{
              density: 'comfortable',
              showActions: true,
              showMedia: true
            }}
            handlers={{
              onBoost: handleBoost,
              onFavorite: handleFavorite,
              onReply: handleReply
            }}
          >
            <Status.Header />
            <Status.Content />
            <Status.Media />
            <Status.Actions />
          </Status.Root>
        </Timeline.Item>
      {/each}
      
      {#if hasMore}
        <Timeline.LoadMore buttonText="Load more posts" />
      {/if}
    {/if}
  </Timeline.Root>
</div>

<style>
  .home-timeline {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
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
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .timeline-header button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .loading-skeleton {
    padding: 1rem;
  }
  
  .skeleton-item {
    height: 150px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Timeline custom styling */
  :global(.lesser-timeline) {
    --timeline-bg: var(--bg-secondary);
    --timeline-border: var(--border-color);
    --timeline-text-primary: var(--text-primary);
    --timeline-text-secondary: var(--text-secondary);
    --timeline-button-bg: var(--primary-color);
    --timeline-button-hover-bg: var(--primary-hover);
    --timeline-item-spacing: 0;
  }
</style>
```

## Profile Timeline

```svelte
<!-- lesser-client/src/routes/profile/[username]/+page.svelte -->
<script lang="ts">
  import { TimelineCompound as Timeline, StatusCompound as Status } from '@greater/fediverse';
  import { page } from '$app/stores';
  import { lesserApi } from '$lib/api';
  
  const username = $derived($page.params.username);
  
  let posts = $state([]);
  let account = $state(null);
  let loading = $state(true);
  
  $effect(() => {
    loadProfile();
  });
  
  async function loadProfile() {
    loading = true;
    try {
      // Load account and their posts
      const [accountRes, postsRes] = await Promise.all([
        lesserApi.accounts.lookup(username),
        lesserApi.accounts.statuses(username, { limit: 20 })
      ]);
      
      account = accountRes.data;
      posts = postsRes.data;
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="profile-page">
  {#if account}
    <div class="profile-header">
      <img src={account.avatar} alt="{account.displayName} avatar" />
      <h1>{account.displayName}</h1>
      <p>@{account.username}</p>
    </div>
  {/if}
  
  <Timeline.Root
    items={posts}
    config={{
      mode: 'profile',
      density: 'comfortable',
      class: 'profile-timeline'
    }}
  >
    {#if posts.length === 0}
      <Timeline.EmptyState
        title="No posts yet"
        description="{account?.displayName || 'This user'} hasn't posted anything."
      />
    {:else}
      {#each posts as status, index}
        <Timeline.Item {status} {index}>
          <Status.Root {status}>
            <Status.Header />
            <Status.Content />
            <Status.Media />
            <Status.Actions />
          </Status.Root>
        </Timeline.Item>
      {/each}
    {/if}
  </Timeline.Root>
</div>
```

## Thread View

```svelte
<!-- lesser-client/src/routes/status/[id]/+page.svelte -->
<script lang="ts">
  import { TimelineCompound as Timeline, StatusCompound as Status } from '@greater/fediverse';
  import { page } from '$app/stores';
  import { lesserApi } from '$lib/api';
  
  const statusId = $derived($page.params.id);
  
  let mainStatus = $state(null);
  let ancestors = $state([]);
  let descendants = $state([]);
  
  $effect(() => {
    loadThread();
  });
  
  async function loadThread() {
    try {
      const [statusRes, contextRes] = await Promise.all([
        lesserApi.statuses.get(statusId),
        lesserApi.statuses.context(statusId)
      ]);
      
      mainStatus = statusRes.data;
      ancestors = contextRes.data.ancestors;
      descendants = contextRes.data.descendants;
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  }
  
  const allPosts = $derived([...ancestors, mainStatus, ...descendants].filter(Boolean));
</script>

<div class="thread-view">
  {#if mainStatus}
    <Timeline.Root
      items={allPosts}
      config={{
        mode: 'thread',
        density: 'spacious',
        class: 'thread-timeline'
      }}
    >
      {#each allPosts as status, index}
        <Timeline.Item {status} {index}>
          <Status.Root
            {status}
            config={{
              density: status.id === statusId ? 'spacious' : 'compact',
              highlight: status.id === statusId
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
  {/if}
</div>

<style>
  :global(.thread-timeline) {
    --timeline-item-spacing: 0.5rem;
  }
</style>
```

## Real-Time Updates

```svelte
<script lang="ts">
  import { TimelineCompound as Timeline } from '@greater/fediverse';
  import { lesserWebSocket } from '$lib/websocket';
  
  let posts = $state([]);
  
  // Subscribe to real-time updates
  $effect(() => {
    const unsubscribe = lesserWebSocket.subscribe('timeline:home', (newStatus) => {
      // Prepend new status
      posts = [newStatus, ...posts];
    });
    
    return unsubscribe;
  });
</script>

<Timeline.Root
  items={posts}
  config={{
    realtime: true,
    infiniteScroll: true
  }}
>
  <!-- Timeline items -->
</Timeline.Root>
```

## Performance Monitoring

```svelte
<script lang="ts">
  import { TimelineCompound as Timeline } from '@greater/fediverse';
  import { onMount } from 'svelte';
  
  let scrollMetrics = $state({ position: 0, velocity: 0 });
  
  function handleScroll(scrollTop: number) {
    // Track scroll for analytics
    scrollMetrics.position = scrollTop;
    
    // Log to Lesser analytics
    if (scrollTop > 1000) {
      lesserAnalytics.track('timeline_deep_scroll', {
        depth: scrollTop
      });
    }
  }
</script>

<Timeline.Root
  {items}
  handlers={{ onScroll: handleScroll }}
>
  <!-- Timeline items -->
</Timeline.Root>
```

## Benefits for Lesser

1. **Maximum Flexibility** - Customize every aspect of the timeline
2. **Performance** - Built-in virtualization for smooth scrolling
3. **Type Safety** - Full TypeScript support
4. **Accessibility** - WCAG 2.1 AA compliant out of the box
5. **Composable** - Mix with other Greater Components easily
6. **Modern** - Uses latest Svelte 5 patterns

