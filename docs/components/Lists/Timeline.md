# Lists.Timeline

**Component**: List-Specific Timeline Display  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 58 passing tests

---

## 📋 Overview

`Lists.Timeline` displays a customized timeline showing posts from members of the selected list. It provides a focused feed for curated content, with member management integration and customizable display options.

### **Key Features**:
- ✅ Chronological posts from list members only
- ✅ List header with title, description, and metadata
- ✅ Member list display (optional)
- ✅ Add/remove members directly from timeline
- ✅ Empty state when no list is selected
- ✅ Empty state when list has no posts
- ✅ Loading states for content
- ✅ Real-time updates support (WebSocket compatible)
- ✅ Infinite scroll support (via slot)
- ✅ Responsive layout
- ✅ Accessibility features

### **What It Does**:

`Lists.Timeline` provides a dedicated view for list content:

1. **Display List Info**: Shows list title, description, visibility, member count
2. **Show Members**: Optional members section with avatars and names
3. **Render Timeline**: Displays posts from list members chronologically
4. **Member Management**: Quick add/remove members from timeline view
5. **Handle Selection**: Shows message when no list is selected
6. **Empty States**: Helpful messages when list has no members or posts
7. **Slot Support**: Accepts custom timeline components via slot

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

### **Minimal Setup**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import * as Timeline from '@greater/fediverse/Timeline';
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    onFetchTimeline: async (listId, options) => {
      const params = new URLSearchParams({
        limit: options?.limit?.toString() || '20',
        ...(options?.cursor && { cursor: options.cursor }),
      });
      
      const response = await fetch(`/api/lists/${listId}/timeline?${params}`);
      return await response.json();
    },
  };
</script>

<Lists.Root {handlers}>
  <Lists.Manager />
  <Lists.Timeline>
    <!-- Timeline posts will be rendered here -->
    <Timeline.Root />
  </Lists.Timeline>
</Lists.Root>
```

### **With Custom Timeline Component**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import * as Timeline from '@greater/fediverse/Timeline';
  
  let timelineComponent: typeof Timeline.Root;
  let listId = $state<string | null>(null);
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    onListClick: (list) => {
      listId = list.id;
    },
  };
</script>

<Lists.Root {handlers}>
  <div class="lists-layout">
    <aside>
      <Lists.Manager />
    </aside>
    
    <main>
      <Lists.Timeline showMembers={true}>
        {#if listId}
          <Timeline.Root
            bind:this={timelineComponent}
            filters={{ listId }}
          />
        {/if}
      </Lists.Timeline>
    </main>
  </div>
</Lists.Root>

<style>
  .lists-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1rem;
    height: 100vh;
  }
  
  aside,
  main {
    overflow-y: auto;
  }
</style>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `showMembers` | `boolean` | `true` | No | Display members section above timeline |
| `class` | `string` | `''` | No | Custom CSS class for container |
| `children` | `Snippet` | - | No | Custom content (timeline component) |

**Note**: The component automatically displays the currently selected list from context. Use `Lists.Manager` to select a list.

---

## 📤 Events

The component uses handlers provided to `Lists.Root`:

### **Handler Callbacks**:

```typescript
// Fetch timeline posts for a list
handlers.onFetchTimeline?: (
  listId: string,
  options?: { limit?: number; cursor?: string }
) => Promise<any>;

// Remove member from list (when using built-in member display)
handlers.onRemoveMember?: (listId: string, memberId: string) => Promise<void>;
```

### **Context State Used**:

```typescript
const {
  state: {
    selectedList,    // Currently selected list
    members,         // Members of selected list
  },
  removeMember,      // Method to remove member
} = Lists.getListsContext();
```

---

## 💡 Examples

### **Example 1: Complete List Timeline with Posts**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import * as Timeline from '@greater/fediverse/Timeline';
  
  let timelinePosts = $state([]);
  let loading = $state(false);
  let currentListId: string | null = null;
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onFetchMembers: async (listId: string) => {
      const response = await fetch(`/api/lists/${listId}/members`);
      return await response.json();
    },
    
    onListClick: async (list) => {
      currentListId = list.id;
      await loadTimeline(list.id);
    },
    
    onRemoveMember: async (listId: string, memberId: string) => {
      await fetch(`/api/lists/${listId}/members/${memberId}`, {
        method: 'DELETE',
      });
      
      // Reload timeline to remove posts from removed member
      await loadTimeline(listId);
    },
  };
  
  async function loadTimeline(listId: string) {
    loading = true;
    try {
      const response = await fetch(`/api/lists/${listId}/timeline?limit=50`);
      timelinePosts = await response.json();
    } catch (error) {
      console.error('Failed to load timeline:', error);
    } finally {
      loading = false;
    }
  }
</script>

<Lists.Root {handlers}>
  <div class="list-timeline-view">
    <aside class="sidebar">
      <Lists.Manager />
    </aside>
    
    <main class="timeline-main">
      <Lists.Timeline showMembers={true}>
        {#if loading}
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading posts...</p>
          </div>
        {:else if timelinePosts.length === 0}
          <div class="empty-timeline">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <h3>No posts yet</h3>
            <p>Posts from list members will appear here</p>
          </div>
        {:else}
          <div class="post-list">
            {#each timelinePosts as post (post.id)}
              <article class="post-card">
                <div class="post-header">
                  <img src={post.author.avatar} alt={post.author.name} class="post-avatar" />
                  <div class="post-author">
                    <div class="author-name">{post.author.name}</div>
                    <div class="author-username">@{post.author.username}</div>
                  </div>
                  <time class="post-time">{formatTime(post.createdAt)}</time>
                </div>
                <div class="post-content">
                  {post.content}
                </div>
              </article>
            {/each}
          </div>
        {/if}
      </Lists.Timeline>
    </main>
  </div>
</Lists.Root>

<style>
  .list-timeline-view {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }
  
  .sidebar {
    border-right: 1px solid var(--border-color, #e1e8ed);
    overflow-y: auto;
  }
  
  .timeline-main {
    overflow-y: auto;
  }
  
  .loading-state,
  .empty-timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--border-color, #e1e8ed);
    border-top-color: var(--primary-color, #1d9bf0);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .empty-timeline svg {
    width: 3rem;
    height: 3rem;
    color: var(--text-secondary, #536471);
  }
  
  .empty-timeline h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .empty-timeline p {
    margin: 0;
    color: var(--text-secondary, #536471);
  }
  
  .post-list {
    display: flex;
    flex-direction: column;
  }
  
  .post-card {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .post-card:hover {
    background: var(--bg-hover, #eff3f4);
  }
  
  .post-header {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .post-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }
  
  .post-author {
    flex: 1;
  }
  
  .author-name {
    font-weight: 700;
    font-size: 0.9375rem;
  }
  
  .author-username {
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .post-time {
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .post-content {
    font-size: 0.9375rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }
</style>
```

### **Example 2: With Infinite Scroll**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { onMount } from 'svelte';
  
  let timelinePosts = $state<any[]>([]);
  let loading = $state(false);
  let hasMore = $state(true);
  let cursor: string | null = null;
  let currentListId: string | null = null;
  let observerTarget: HTMLElement | null = null;
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onFetchMembers: async (listId: string) => {
      const response = await fetch(`/api/lists/${listId}/members`);
      return await response.json();
    },
    
    onListClick: async (list) => {
      // Reset when switching lists
      currentListId = list.id;
      timelinePosts = [];
      cursor = null;
      hasMore = true;
      await loadMorePosts();
    },
  };
  
  async function loadMorePosts() {
    if (loading || !hasMore || !currentListId) return;
    
    loading = true;
    
    try {
      const params = new URLSearchParams({
        limit: '20',
        ...(cursor && { cursor }),
      });
      
      const response = await fetch(`/api/lists/${currentListId}/timeline?${params}`);
      const data = await response.json();
      
      timelinePosts = [...timelinePosts, ...data.posts];
      cursor = data.nextCursor;
      hasMore = !!data.nextCursor;
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      loading = false;
    }
  }
  
  // Set up Intersection Observer for infinite scroll
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    
    if (observerTarget) {
      observer.observe(observerTarget);
    }
    
    return () => observer.disconnect();
  });
</script>

<Lists.Root {handlers}>
  <div class="infinite-timeline">
    <aside>
      <Lists.Manager />
    </aside>
    
    <main>
      <Lists.Timeline showMembers={true}>
        <div class="posts-container">
          {#each timelinePosts as post (post.id)}
            <article class="post">
              <!-- Post content -->
              <div class="post-author">
                {post.author.name} (@{post.author.username})
              </div>
              <div class="post-content">{post.content}</div>
            </article>
          {/each}
          
          <!-- Observer target for infinite scroll -->
          {#if hasMore}
            <div bind:this={observerTarget} class="scroll-observer">
              {#if loading}
                <div class="loading-more">
                  <div class="spinner"></div>
                  <span>Loading more posts...</span>
                </div>
              {/if}
            </div>
          {:else if timelinePosts.length > 0}
            <div class="end-message">
              You've reached the end of the timeline
            </div>
          {/if}
        </div>
      </Lists.Timeline>
    </main>
  </div>
</Lists.Root>

<style>
  .infinite-timeline {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }
  
  aside,
  main {
    overflow-y: auto;
  }
  
  .posts-container {
    min-height: 100%;
  }
  
  .post {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .scroll-observer {
    padding: 2rem;
    text-align: center;
  }
  
  .loading-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--border-color, #e1e8ed);
    border-top-color: var(--primary-color, #1d9bf0);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .end-message {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary, #536471);
    font-size: 0.875rem;
  }
</style>
```

### **Example 3: With Real-time Updates**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  import { onMount, onDestroy } from 'svelte';
  import { createWebSocketClient } from '$lib/websocket';
  
  let timelinePosts = $state<any[]>([]);
  let currentListId: string | null = null;
  let ws: ReturnType<typeof createWebSocketClient> | null = null;
  let subscription: any = null;
  
  onMount(() => {
    // Initialize WebSocket
    ws = createWebSocketClient('wss://api.example.com/graphql');
  });
  
  onDestroy(() => {
    if (subscription) subscription.unsubscribe();
    ws?.close();
  });
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onFetchMembers: async (listId: string) => {
      const response = await fetch(`/api/lists/${listId}/members`);
      return await response.json();
    },
    
    onListClick: async (list) => {
      // Unsubscribe from previous list
      if (subscription) subscription.unsubscribe();
      
      currentListId = list.id;
      
      // Load initial posts
      const response = await fetch(`/api/lists/${list.id}/timeline?limit=50`);
      timelinePosts = await response.json();
      
      // Subscribe to new posts
      if (ws) {
        subscription = ws.subscribe({
          query: `
            subscription OnListPost($listId: ID!) {
              listPostCreated(listId: $listId) {
                id
                content
                createdAt
                author {
                  id
                  name
                  username
                  avatar
                }
              }
            }
          `,
          variables: { listId: list.id },
          onData: ({ listPostCreated }) => {
            // Add new post to top
            timelinePosts = [listPostCreated, ...timelinePosts];
          },
        });
      }
    },
  };
</script>

<Lists.Root {handlers}>
  <div class="realtime-timeline">
    <aside>
      <Lists.Manager />
    </aside>
    
    <main>
      <Lists.Timeline showMembers={true}>
        {#if currentListId}
          <div class="realtime-indicator">
            <span class="live-dot"></span>
            Live updates enabled
          </div>
        {/if}
        
        <div class="posts">
          {#each timelinePosts as post (post.id)}
            <article class="post">
              <div class="post-header">
                <img src={post.author.avatar} alt={post.author.name} />
                <div>
                  <div class="author-name">{post.author.name}</div>
                  <div class="author-username">@{post.author.username}</div>
                </div>
              </div>
              <div class="post-content">{post.content}</div>
            </article>
          {/each}
        </div>
      </Lists.Timeline>
    </main>
  </div>
</Lists.Root>

<style>
  .realtime-timeline {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }
  
  .realtime-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(0, 186, 124, 0.1);
    border-bottom: 1px solid rgba(0, 186, 124, 0.3);
    color: #00ba7c;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .live-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #00ba7c;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .posts {
    display: flex;
    flex-direction: column;
  }
  
  .post {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .post-header {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .post-header img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }
  
  .author-name {
    font-weight: 700;
  }
  
  .author-username {
    font-size: 0.875rem;
    color: var(--text-secondary, #536471);
  }
  
  .post-content {
    font-size: 0.9375rem;
    line-height: 1.5;
  }
</style>
```

### **Example 4: With Filter Options**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  let filterOptions = $state({
    mediaOnly: false,
    excludeReplies: false,
    excludeReblogs: false,
  });
  
  let timelinePosts = $state<any[]>([]);
  let currentListId: string | null = null;
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onFetchMembers: async (listId: string) => {
      const response = await fetch(`/api/lists/${listId}/members`);
      return await response.json();
    },
    
    onListClick: async (list) => {
      currentListId = list.id;
      await loadTimeline(list.id);
    },
  };
  
  async function loadTimeline(listId: string) {
    const params = new URLSearchParams({
      limit: '50',
      ...(filterOptions.mediaOnly && { media_only: 'true' }),
      ...(filterOptions.excludeReplies && { exclude_replies: 'true' }),
      ...(filterOptions.excludeReblogs && { exclude_reblogs: 'true' }),
    });
    
    const response = await fetch(`/api/lists/${listId}/timeline?${params}`);
    timelinePosts = await response.json();
  }
  
  // Reload timeline when filters change
  $effect(() => {
    filterOptions;
    if (currentListId) {
      loadTimeline(currentListId);
    }
  });
</script>

<Lists.Root {handlers}>
  <div class="filtered-timeline">
    <aside>
      <Lists.Manager />
    </aside>
    
    <main>
      <!-- Filter Controls -->
      <div class="filter-bar">
        <h3>Timeline Filters</h3>
        <div class="filter-options">
          <label class="filter-option">
            <input
              type="checkbox"
              bind:checked={filterOptions.mediaOnly}
            />
            <span>Media only</span>
          </label>
          
          <label class="filter-option">
            <input
              type="checkbox"
              bind:checked={filterOptions.excludeReplies}
            />
            <span>Exclude replies</span>
          </label>
          
          <label class="filter-option">
            <input
              type="checkbox"
              bind:checked={filterOptions.excludeReblogs}
            />
            <span>Exclude reblogs</span>
          </label>
        </div>
      </div>
      
      <Lists.Timeline showMembers={false}>
        <div class="posts">
          {#each timelinePosts as post (post.id)}
            <article class="post">
              <!-- Post content -->
              {post.content}
            </article>
          {/each}
        </div>
      </Lists.Timeline>
    </main>
  </div>
</Lists.Root>

<style>
  .filtered-timeline {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }
  
  .filter-bar {
    padding: 1rem 1.5rem;
    background: var(--bg-secondary, #f7f9fa);
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .filter-bar h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .filter-options {
    display: flex;
    gap: 1.5rem;
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
  }
  
  .filter-option input {
    cursor: pointer;
  }
  
  .posts {
    display: flex;
    flex-direction: column;
  }
  
  .post {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
</style>
```

### **Example 5: With Member Statistics**

```svelte
<script lang="ts">
  import * as Lists from '@greater/fediverse/Lists';
  
  let timelinePosts = $state<any[]>([]);
  let memberStats = $state<Map<string, { postCount: number; lastPostAt: string }>>(new Map());
  
  const handlers = {
    onFetchLists: async () => {
      const response = await fetch('/api/lists');
      return await response.json();
    },
    
    onFetchMembers: async (listId: string) => {
      const response = await fetch(`/api/lists/${listId}/members`);
      return await response.json();
    },
    
    onListClick: async (list) => {
      // Load timeline
      const response = await fetch(`/api/lists/${list.id}/timeline?limit=100`);
      timelinePosts = await response.json();
      
      // Calculate member statistics
      const stats = new Map();
      timelinePosts.forEach(post => {
        const authorId = post.author.id;
        const existing = stats.get(authorId) || { postCount: 0, lastPostAt: null };
        
        stats.set(authorId, {
          postCount: existing.postCount + 1,
          lastPostAt: post.createdAt,
        });
      });
      
      memberStats = stats;
    },
  };
  
  let context: ReturnType<typeof Lists.getListsContext>;
  
  function getMemberStats(memberId: string) {
    return memberStats.get(memberId) || { postCount: 0, lastPostAt: null };
  }
</script>

<Lists.Root {handlers}>
  {#snippet children()}
    {(context = Lists.getListsContext(), null)}
    
    <div class="stats-timeline">
      <aside>
        <Lists.Manager />
      </aside>
      
      <main>
        {#if context.state.selectedList}
          <!-- Member Statistics Panel -->
          <div class="stats-panel">
            <h3>Member Activity</h3>
            <div class="member-stats">
              {#each context.state.members as member (member.id)}
                {@const stats = getMemberStats(member.actor.id)}
                <div class="member-stat-item">
                  <img src={member.actor.avatar} alt={member.actor.displayName} />
                  <div class="member-stat-info">
                    <div class="member-name">{member.actor.displayName}</div>
                    <div class="member-activity">
                      {stats.postCount} post{stats.postCount === 1 ? '' : 's'}
                      {#if stats.lastPostAt}
                        · Last: {formatTime(stats.lastPostAt)}
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <Lists.Timeline showMembers={false}>
          <div class="posts">
            {#each timelinePosts as post (post.id)}
              <article class="post">
                {post.content}
              </article>
            {/each}
          </div>
        </Lists.Timeline>
      </main>
    </div>
  {/snippet}
</Lists.Root>

<style>
  .stats-timeline {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }
  
  .stats-panel {
    padding: 1.5rem;
    background: var(--bg-secondary, #f7f9fa);
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
  
  .stats-panel h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .member-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .member-stat-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e1e8ed);
    border-radius: 0.5rem;
  }
  
  .member-stat-item img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }
  
  .member-stat-info {
    flex: 1;
    min-width: 0;
  }
  
  .member-name {
    font-weight: 600;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .member-activity {
    font-size: 0.75rem;
    color: var(--text-secondary, #536471);
  }
  
  .posts {
    display: flex;
    flex-direction: column;
  }
  
  .post {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color, #e1e8ed);
  }
</style>
```

---

## 🎨 Styling

`Lists.Timeline` uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #1d9bf0;
  --bg-primary: #ffffff;
  --bg-secondary: #f7f9fa;
  --bg-hover: #eff3f4;
  --text-primary: #0f1419;
  --text-secondary: #536471;
  --border-color: #e1e8ed;
}
```

### **Custom Styling**

```svelte
<Lists.Timeline class="custom-timeline" showMembers={true}>
  <!-- Content -->
</Lists.Timeline>

<style>
  :global(.custom-timeline) {
    background: linear-gradient(to bottom, #ffffff, #f7f9fa);
  }
  
  :global(.custom-timeline .lists-timeline__header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  :global(.custom-timeline .lists-timeline__member) {
    border-left: 3px solid var(--primary-color);
  }
</style>
```

---

## 🔒 Security Considerations

### **Validate List Access**

```typescript
// Server-side
app.get('/api/lists/:id/timeline', async (req, res) => {
  const list = await List.findById(req.params.id);
  
  // Check access
  if (list.visibility === 'private' && list.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const posts = await getListTimeline(list.id, req.query);
  res.json(posts);
});
```

---

## ♿ Accessibility

`Lists.Timeline` is fully accessible:

### **Keyboard Navigation**

- **Tab**: Navigate between members and interactive elements
- **Enter/Space**: Activate member removal buttons
- **Arrow Keys**: Navigate timeline posts (when focused)

### **Screen Reader Support**

```html
<article role="article" aria-label="Post by John Doe">
  <!-- Post content -->
</article>

<section aria-label="List members" role="region">
  <div role="list">
    <div role="listitem" aria-label="John Doe, member">
      <!-- Member content -->
    </div>
  </div>
</section>
```

---

## ⚡ Performance

### **Virtualization for Long Lists**

For lists with many posts, consider using virtualization:

```svelte
<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  
  let scrollElement: HTMLElement | null = null;
  
  const rowVirtualizer = $derived(() =>
    scrollElement
      ? createVirtualizer({
          count: timelinePosts.length,
          getScrollElement: () => scrollElement,
          estimateSize: () => 200,
          overscan: 5,
        })
      : null
  );
</script>
```

---

## 🧪 Testing

### **Component Tests**

```typescript
import { render, waitFor } from '@testing-library/svelte';
import * as Lists from '@greater/fediverse/Lists';

describe('Lists.Timeline', () => {
  test('displays list info', async () => {
    const { getByText } = render(Lists.Root, {
      handlers: {
        onFetchLists: async () => [{
          id: '1',
          title: 'Test List',
          visibility: 'public',
          membersCount: 5,
        }],
      },
    });
    
    await waitFor(() => {
      expect(getByText('Test List')).toBeInTheDocument();
    });
  });
});
```

---

## 🔗 Related Components

- [Lists.Root](/docs/components/Lists/Root.md) - Context provider
- [Lists.Manager](/docs/components/Lists/Manager.md) - List overview
- [Lists.MemberPicker](/docs/components/Lists/MemberPicker.md) - Member management
- [Timeline.Root](/docs/components/Timeline/Root.md) - Timeline display component

---

## 📚 See Also

- [Lists Component Overview](/docs/components/Lists/README.md)
- [Timeline Components](/docs/components/Timeline/README.md)
- [Real-time Updates Guide](/docs/guides/realtime.md)
- [Infinite Scroll Patterns](/docs/guides/infinite-scroll.md)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0

