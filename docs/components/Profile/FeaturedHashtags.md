# Profile.FeaturedHashtags

**Component**: Featured Hashtags Display  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 18 passing tests

---

## 📋 Overview

`Profile.FeaturedHashtags` displays a user's featured hashtags - topics they want to highlight on their profile. For profile owners, it supports drag-and-drop reordering, removal, and displays usage statistics.

### **Key Features**:
- ✅ Display featured hashtags
- ✅ Drag-and-drop reordering (own profile)
- ✅ Remove hashtags (own profile)
- ✅ Usage statistics display
- ✅ Last used timestamps
- ✅ Maximum hashtag limits
- ✅ Responsive design

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';

  const hashtags = [
    {
      name: 'javascript',
      usageCount: 42,
      lastUsedAt: '2024-01-15T10:00:00Z'
    },
    {
      name: 'svelte',
      usageCount: 28,
      lastUsedAt: '2024-01-14T14:30:00Z'
    }
  ];

  const handlers = {
    onReorderHashtags: async (hashtagNames: string[]) => {
      console.log('Reordered:', hashtagNames);
    },
    onRemoveHashtag: async (hashtagName: string) => {
      console.log('Removed:', hashtagName);
    }
  };
</script>

<Profile.Root profile={profileData} {handlers} isOwnProfile={true}>
  <Profile.FeaturedHashtags 
    {hashtags}
    isOwnProfile={true}
    enableReordering={true}
    showStats={true}
    maxHashtags={4}
  />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `hashtags` | `FeaturedHashtag[]` | `[]` | No | List of featured hashtags |
| `isOwnProfile` | `boolean` | `false` | No | Whether viewing own profile |
| `enableReordering` | `boolean` | `true` | No | Enable drag-and-drop reordering |
| `showStats` | `boolean` | `true` | No | Show usage statistics |
| `maxHashtags` | `number` | `4` | No | Maximum hashtags to display (0 = all) |
| `class` | `string` | `''` | No | Custom CSS class |

### **FeaturedHashtag Interface**

```typescript
interface FeaturedHashtag {
  name: string;
  usageCount?: number;
  lastUsedAt?: string;
  featuredAt?: string;
}
```

---

## 📤 Events

Handlers are accessed via `ProfileContext`:

```typescript
interface ProfileHandlers {
  onReorderHashtags?: (hashtagNames: string[]) => Promise<void>;
  onRemoveHashtag?: (hashtagName: string) => Promise<void>;
}
```

---

## 💡 Examples

### **Example 1: Complete Featured Hashtags Management**

Full-featured hashtags with reordering and stats:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FeaturedHashtag } from '@greater/fediverse/Profile';

  let hashtags = $state<FeaturedHashtag[]>([
    {
      name: 'javascript',
      usageCount: 142,
      lastUsedAt: '2024-01-15T10:00:00Z',
      featuredAt: '2024-01-10T10:00:00Z'
    },
    {
      name: 'svelte',
      usageCount: 89,
      lastUsedAt: '2024-01-14T14:30:00Z',
      featuredAt: '2024-01-11T12:00:00Z'
    },
    {
      name: 'webdev',
      usageCount: 67,
      lastUsedAt: '2024-01-13T09:15:00Z',
      featuredAt: '2024-01-12T15:00:00Z'
    },
    {
      name: 'opensource',
      usageCount: 34,
      lastUsedAt: '2024-01-12T16:45:00Z',
      featuredAt: '2024-01-13T08:30:00Z'
    }
  ]);

  let removingHashtags = $state<Set<string>>(new Set());

  const handlers = {
    onReorderHashtags: async (hashtagNames: string[]) => {
      try {
        const response = await fetch('/api/profile/hashtags/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashtags: hashtagNames }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to reorder');
        }

        showNotification('Order saved', 'success');
      } catch (error) {
        console.error('Failed to reorder:', error);
        showNotification('Failed to save order', 'error');
      }
    },

    onRemoveHashtag: async (hashtagName: string) => {
      removingHashtags.add(hashtagName);

      try {
        const response = await fetch(`/api/profile/hashtags/${hashtagName}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to remove hashtag');
        }

        // Remove from list
        hashtags = hashtags.filter(h => h.name !== hashtagName);
        
        showNotification('Hashtag removed', 'success');
      } catch (error) {
        console.error('Failed to remove hashtag:', error);
        showNotification('Failed to remove hashtag', 'error');
      } finally {
        removingHashtags.delete(hashtagName);
        removingHashtags = new Set(removingHashtags);
      }
    }
  };

  function showNotification(message: string, type: string) {
    console.log(`[${type}] ${message}`);
  }

  function formatLastUsed(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };
</script>

<div class="hashtags-page">
  <header class="page-header">
    <h1>Featured Hashtags</h1>
    <p class="description">
      Highlight topics you frequently discuss
    </p>
  </header>

  <div class="stats-summary">
    <div class="stat">
      <strong>{hashtags.length}</strong>
      <span>Featured</span>
    </div>
    <div class="stat">
      <strong>{hashtags.reduce((sum, h) => sum + (h.usageCount || 0), 0)}</strong>
      <span>Total Uses</span>
    </div>
  </div>

  <Profile.Root {profile} {handlers} isOwnProfile={true}>
    <Profile.FeaturedHashtags 
      {hashtags}
      isOwnProfile={true}
      enableReordering={true}
      showStats={true}
      maxHashtags={4}
    />
  </Profile.Root>

  {#if hashtags.length > 0}
    <div class="usage-details">
      <h2>Usage Details</h2>
      <div class="details-list">
        {#each hashtags as hashtag}
          <div class="detail-row">
            <span class="hashtag-name">#{hashtag.name}</span>
            <span class="usage-count">{hashtag.usageCount} posts</span>
            <span class="last-used">
              Last used {formatLastUsed(hashtag.lastUsedAt)}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .hashtags-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 700;
  }

  .description {
    margin: 0;
    color: #536471;
    font-size: 1rem;
  }

  .stats-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat {
    padding: 1.5rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #1d9bf0;
    margin-bottom: 0.25rem;
  }

  .stat span {
    font-size: 0.875rem;
    color: #536471;
  }

  .usage-details {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
  }

  .usage-details h2 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .details-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.5rem;
  }

  .hashtag-name {
    font-weight: 600;
    color: #1d9bf0;
    min-width: 120px;
  }

  .usage-count {
    font-size: 0.875rem;
    color: #0f1419;
  }

  .last-used {
    margin-left: auto;
    font-size: 0.8125rem;
    color: #536471;
  }

  @media (max-width: 640px) {
    .detail-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .last-used {
      margin-left: 0;
    }
  }
</style>
```

### **Example 2: Drag-and-Drop Implementation**

Complete drag-and-drop functionality:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FeaturedHashtag } from '@greater/fediverse/Profile';

  let hashtags = $state<FeaturedHashtag[]>([
    { name: 'javascript', usageCount: 42 },
    { name: 'svelte', usageCount: 28 },
    { name: 'webdev', usageCount: 35 },
    { name: 'opensource', usageCount: 19 }
  ]);

  let draggingIndex = $state<number | null>(null);
  let dragOverIndex = $state<number | null>(null);

  function handleDragStart(index: number) {
    return (event: DragEvent) => {
      draggingIndex = index;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString());
      }
    };
  }

  function handleDragOver(index: number) {
    return (event: DragEvent) => {
      event.preventDefault();
      if (draggingIndex !== null && draggingIndex !== index) {
        dragOverIndex = index;
      }
    };
  }

  function handleDrop(index: number) {
    return async (event: DragEvent) => {
      event.preventDefault();

      if (draggingIndex === null || draggingIndex === index) {
        draggingIndex = null;
        dragOverIndex = null;
        return;
      }

      // Reorder array
      const newHashtags = [...hashtags];
      const [movedItem] = newHashtags.splice(draggingIndex, 1);
      newHashtags.splice(index, 0, movedItem);

      hashtags = newHashtags;
      draggingIndex = null;
      dragOverIndex = null;

      // Save order to server
      try {
        const hashtagNames = hashtags.map(h => h.name);
        await fetch('/api/profile/hashtags/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashtags: hashtagNames }),
          credentials: 'include'
        });
      } catch (error) {
        console.error('Failed to save order:', error);
      }
    };
  }

  function handleDragEnd() {
    draggingIndex = null;
    dragOverIndex = null;
  }
</script>

<div class="drag-drop-hashtags">
  <h2>Drag to Reorder Hashtags</h2>

  <div class="hashtags-list">
    {#each hashtags as hashtag, index}
      <div
        class="hashtag-item"
        class:dragging={draggingIndex === index}
        class:drag-over={dragOverIndex === index}
        draggable={true}
        ondragstart={handleDragStart(index)}
        ondragover={handleDragOver(index)}
        ondrop={handleDrop(index)}
        ondragend={handleDragEnd}
      >
        <div class="drag-handle">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zM13 3h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
          </svg>
        </div>

        <div class="hashtag-content">
          <span class="hashtag-symbol">#</span>
          <span class="hashtag-name">{hashtag.name}</span>
        </div>

        {#if hashtag.usageCount}
          <span class="usage-badge">
            {hashtag.usageCount}
          </span>
        {/if}

        <div class="position-indicator">
          #{index + 1}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .drag-drop-hashtags {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .drag-drop-hashtags h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .hashtags-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .hashtag-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: white;
    border: 2px solid #eff3f4;
    border-radius: 0.75rem;
    cursor: move;
    transition: all 0.2s;
  }

  .hashtag-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #1d9bf0;
  }

  .hashtag-item.dragging {
    opacity: 0.5;
  }

  .hashtag-item.drag-over {
    border-color: #1d9bf0;
    background: rgba(29, 155, 240, 0.05);
  }

  .drag-handle {
    width: 20px;
    height: 20px;
    color: #536471;
    opacity: 0.5;
  }

  .hashtag-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.125rem;
  }

  .hashtag-symbol {
    color: #1d9bf0;
    font-weight: 600;
  }

  .hashtag-name {
    color: #0f1419;
    font-weight: 600;
  }

  .usage-badge {
    padding: 0.25rem 0.75rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 9999px;
    font-size: 0.8125rem;
    color: #536471;
    font-weight: 500;
  }

  .position-indicator {
    width: 28px;
    height: 28px;
    background: #1d9bf0;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 600;
  }
</style>
```

### **Example 3: Add Hashtag Flow**

Implement adding new featured hashtags:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FeaturedHashtag } from '@greater/fediverse/Profile';

  let hashtags = $state<FeaturedHashtag[]>([
    { name: 'javascript', usageCount: 42 },
    { name: 'svelte', usageCount: 28 }
  ]);

  let showAddDialog = $state(false);
  let hashtagInput = $state('');
  let searchResults = $state<{ name: string; usageCount: number }[]>([]);
  let searching = $state(false);

  const maxHashtags = 4;
  const canAddMore = $derived(hashtags.length < maxHashtags);

  async function searchHashtags() {
    const query = hashtagInput.trim().replace(/^#/, '');
    
    if (!query) {
      searchResults = [];
      return;
    }

    searching = true;

    try {
      const response = await fetch(
        `/api/search/hashtags?q=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter out already featured hashtags
        searchResults = data.hashtags.filter(
          (h: { name: string }) => !hashtags.some(featured => featured.name === h.name)
        );
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      searching = false;
    }
  }

  async function addHashtag(hashtagName: string) {
    try {
      const response = await fetch('/api/profile/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashtag: hashtagName }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to add hashtag');
      }

      const data = await response.json();
      hashtags = [...hashtags, data.hashtag];
      
      showAddDialog = false;
      hashtagInput = '';
      searchResults = [];
    } catch (error) {
      console.error('Failed to add hashtag:', error);
      alert('Failed to add hashtag');
    }
  }

  $effect(() => {
    const timeoutId = setTimeout(searchHashtags, 300);
    return () => clearTimeout(timeoutId);
  });
</script>

<div class="add-hashtag-flow">
  <h2>Featured Hashtags</h2>

  <Profile.Root profile={profileData} handlers={{}} isOwnProfile={true}>
    <Profile.FeaturedHashtags 
      {hashtags}
      isOwnProfile={true}
      enableReordering={true}
      showStats={true}
      maxHashtags={maxHashtags}
    />
  </Profile.Root>

  {#if canAddMore}
    <button
      class="add-hashtag-button"
      onclick={() => showAddDialog = true}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      Add Hashtag ({hashtags.length}/{maxHashtags})
    </button>
  {:else}
    <div class="max-reached">
      Maximum of {maxHashtags} featured hashtags reached
    </div>
  {/if}

  {#if showAddDialog}
    <div class="dialog-overlay" onclick={() => showAddDialog = false}>
      <div class="dialog" onclick={(e) => e.stopPropagation()}>
        <div class="dialog-header">
          <h3>Add Featured Hashtag</h3>
          <button
            class="close-button"
            onclick={() => showAddDialog = false}
          >
            ×
          </button>
        </div>

        <div class="dialog-body">
          <div class="input-box">
            <span class="hashtag-symbol">#</span>
            <input
              type="text"
              placeholder="Enter hashtag..."
              bind:value={hashtagInput}
              class="hashtag-input"
              autofocus
            />
          </div>

          {#if searching}
            <div class="searching">
              <span class="spinner"></span>
              Searching...
            </div>
          {:else if searchResults.length > 0}
            <div class="search-results">
              <div class="results-header">Your most used hashtags:</div>
              {#each searchResults as result}
                <button
                  class="result-item"
                  onclick={() => addHashtag(result.name)}
                >
                  <span class="result-name">#{result.name}</span>
                  <span class="result-count">{result.usageCount} posts</span>
                  <svg class="add-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              {/each}
            </div>
          {:else if hashtagInput.trim()}
            <div class="no-results">
              <p>No matching hashtags found</p>
              <button
                class="create-button"
                onclick={() => addHashtag(hashtagInput.trim().replace(/^#/, ''))}
              >
                Feature "#{hashtagInput.trim().replace(/^#/, '')}"
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .add-hashtag-flow {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .add-hashtag-flow h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .add-hashtag-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background: white;
    border: 2px dashed #eff3f4;
    border-radius: 0.75rem;
    color: #1d9bf0;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-hashtag-button:hover {
    border-color: #1d9bf0;
    background: rgba(29, 155, 240, 0.05);
  }

  .add-hashtag-button svg {
    width: 20px;
    height: 20px;
  }

  .max-reached {
    padding: 1rem;
    margin-top: 1rem;
    text-align: center;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    color: #536471;
    font-size: 0.875rem;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .dialog {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #eff3f4;
  }

  .dialog-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .close-button {
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #536471;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }

  .close-button:hover {
    background: #f7f9fa;
  }

  .dialog-body {
    padding: 1.5rem;
    overflow-y: auto;
  }

  .input-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    margin-bottom: 1rem;
    border: 2px solid #eff3f4;
    border-radius: 9999px;
    transition: border-color 0.2s;
  }

  .input-box:focus-within {
    border-color: #1d9bf0;
  }

  .hashtag-symbol {
    font-size: 1.125rem;
    color: #1d9bf0;
    font-weight: 600;
  }

  .hashtag-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
  }

  .searching,
  .no-results {
    padding: 2rem;
    text-align: center;
    color: #536471;
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #eff3f4;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .search-results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .results-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    color: #536471;
    font-weight: 500;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .result-item:hover {
    background: #f7f9fa;
    border-color: #1d9bf0;
  }

  .result-name {
    flex: 1;
    font-size: 1rem;
    color: #1d9bf0;
    font-weight: 600;
  }

  .result-count {
    font-size: 0.8125rem;
    color: #536471;
  }

  .add-icon {
    width: 20px;
    height: 20px;
    color: #1d9bf0;
  }

  .no-results p {
    margin: 0 0 1rem;
  }

  .create-button {
    padding: 0.75rem 1.5rem;
    background: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .create-button:hover {
    background: #1a8cd8;
  }
</style>
```

### **Example 4: Server-Side Implementation**

Complete server handlers:

```typescript
// server/api/profile/hashtags.ts
import { db } from '@/lib/database';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response('Username required', { status: 400 });
  }

  try {
    const user = await db.users.findUnique({
      where: { username },
      include: {
        featuredHashtags: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    const hashtags = user.featuredHashtags.map(h => ({
      name: h.hashtag,
      usageCount: h.usageCount,
      lastUsedAt: h.lastUsedAt?.toISOString(),
      featuredAt: h.createdAt.toISOString()
    }));

    return new Response(
      JSON.stringify({ hashtags }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch featured hashtags:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { hashtag } = body;

  if (!hashtag || typeof hashtag !== 'string') {
    return new Response('Invalid hashtag', { status: 400 });
  }

  const normalizedHashtag = hashtag.toLowerCase().replace(/^#/, '');

  try {
    // Check max featured hashtags (e.g., 4)
    const currentCount = await db.featuredHashtags.count({
      where: { userId }
    });

    if (currentCount >= 4) {
      return new Response('Maximum featured hashtags reached', { status: 400 });
    }

    // Check if already featured
    const existing = await db.featuredHashtags.findUnique({
      where: {
        userId_hashtag: {
          userId,
          hashtag: normalizedHashtag
        }
      }
    });

    if (existing) {
      return new Response('Hashtag already featured', { status: 400 });
    }

    // Get usage count
    const usageCount = await db.statuses.count({
      where: {
        userId,
        content: {
          contains: `#${normalizedHashtag}`
        }
      }
    });

    // Get last used
    const lastUsed = await db.statuses.findFirst({
      where: {
        userId,
        content: {
          contains: `#${normalizedHashtag}`
        }
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    // Create featured hashtag
    const featured = await db.featuredHashtags.create({
      data: {
        userId,
        hashtag: normalizedHashtag,
        usageCount,
        lastUsedAt: lastUsed?.createdAt,
        order: currentCount,
        createdAt: new Date()
      }
    });

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'hashtag.featured',
        details: JSON.stringify({ hashtag: normalizedHashtag }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({
        hashtag: {
          name: featured.hashtag,
          usageCount: featured.usageCount,
          lastUsedAt: featured.lastUsedAt?.toISOString(),
          featuredAt: featured.createdAt.toISOString()
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to feature hashtag:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/profile/hashtags/[name].ts
export async function DELETE(
  request: Request,
  context: { params: { name: string } }
): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const hashtagName = context.params.name.toLowerCase();

  try {
    // Delete featured hashtag
    const deleted = await db.featuredHashtags.deleteMany({
      where: {
        userId,
        hashtag: hashtagName
      }
    });

    if (deleted.count === 0) {
      return new Response('Featured hashtag not found', { status: 404 });
    }

    // Reorder remaining hashtags
    const remaining = await db.featuredHashtags.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });

    await Promise.all(
      remaining.map((h, index) =>
        db.featuredHashtags.update({
          where: { id: h.id },
          data: { order: index }
        })
      )
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'hashtag.unfeatured',
        details: JSON.stringify({ hashtag: hashtagName }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Featured hashtag removed' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to remove featured hashtag:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// server/api/profile/hashtags/reorder.ts
export async function POST(request: Request): Promise<Response> {
  const userId = await getAuthenticatedUserId(request);
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { hashtags } = body;

  if (!Array.isArray(hashtags)) {
    return new Response('Invalid hashtags', { status: 400 });
  }

  try {
    // Update order for each hashtag
    await Promise.all(
      hashtags.map((hashtag, index) =>
        db.featuredHashtags.updateMany({
          where: {
            userId,
            hashtag: hashtag.toLowerCase()
          },
          data: { order: index }
        })
      )
    );

    // Create audit log
    await db.auditLogs.create({
      data: {
        userId,
        action: 'featured_hashtags.reordered',
        details: JSON.stringify({ order: hashtags }),
        timestamp: new Date()
      }
    });

    return new Response(
      JSON.stringify({ message: 'Order updated' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to reorder featured hashtags:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### **Example 5: Public View with Clickable Hashtags**

Display featured hashtags on public profile:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { FeaturedHashtag } from '@greater/fediverse/Profile';

  const hashtags: FeaturedHashtag[] = [
    { name: 'javascript', usageCount: 142 },
    { name: 'svelte', usageCount: 89 },
    { name: 'webdev', usageCount: 67 },
    { name: 'opensource', usageCount: 34 }
  ];

  function navigateToHashtag(hashtagName: string) {
    window.location.href = `/tags/${hashtagName}`;
  }
</script>

<div class="public-hashtags">
  <h2>Featured Topics</h2>

  <div class="hashtags-grid">
    {#each hashtags as hashtag}
      <button
        class="hashtag-card"
        onclick={() => navigateToHashtag(hashtag.name)}
      >
        <div class="hashtag-header">
          <span class="hashtag-symbol">#</span>
          <span class="hashtag-name">{hashtag.name}</span>
        </div>

        {#if hashtag.usageCount}
          <div class="hashtag-stats">
            <span class="usage-count">
              {hashtag.usageCount} post{hashtag.usageCount !== 1 ? 's' : ''}
            </span>
          </div>
        {/if}

        <div class="view-arrow">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .public-hashtags {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .public-hashtags h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .hashtags-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .hashtag-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.25rem;
    background: white;
    border: 1px solid #eff3f4;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;
  }

  .hashtag-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #1d9bf0;
    transform: translateY(-2px);
  }

  .hashtag-header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.125rem;
  }

  .hashtag-symbol {
    color: #1d9bf0;
    font-weight: 600;
  }

  .hashtag-name {
    color: #0f1419;
    font-weight: 600;
  }

  .hashtag-stats {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .usage-count {
    font-size: 0.875rem;
    color: #536471;
  }

  .view-arrow {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 20px;
    height: 20px;
    color: #536471;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .hashtag-card:hover .view-arrow {
    opacity: 1;
  }

  @media (max-width: 640px) {
    .hashtags-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

---

## 🔒 Security Considerations

### **Input Validation**

Validate hashtag names:

```typescript
function isValidHashtag(hashtag: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(hashtag);
}

if (!isValidHashtag(normalizedHashtag)) {
  return new Response('Invalid hashtag format', { status: 400 });
}
```

### **Maximum Limits**

Enforce hashtag limits:

```typescript
const MAX_FEATURED_HASHTAGS = 4;

if (currentCount >= MAX_FEATURED_HASHTAGS) {
  return new Response('Maximum featured hashtags reached', { status: 400 });
}
```

### **Audit Logging**

Track all hashtag changes:

```typescript
await db.auditLogs.create({
  data: {
    userId,
    action: 'hashtag.featured',
    details: JSON.stringify({ hashtag }),
    timestamp: new Date()
  }
});
```

---

## 🎨 Styling

```css
.featured-hashtags {
  --hashtag-color: #1d9bf0;
  --hashtag-bg: white;
  --hashtag-border: #eff3f4;
  --hashtag-hover: rgba(29, 155, 240, 0.05);
}
```

---

## ♿ Accessibility

- ✅ **Semantic HTML**: Proper button structure
- ✅ **ARIA Labels**: Drag-and-drop announcements
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Screen Readers**: Descriptive labels

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { FeaturedHashtags } from '@greater/fediverse/Profile';

describe('FeaturedHashtags', () => {
  it('displays featured hashtags', () => {
    const hashtags = [
      { name: 'javascript', usageCount: 42 }
    ];

    render(FeaturedHashtags, { props: { hashtags, isOwnProfile: false } });

    expect(screen.getByText(/javascript/i)).toBeInTheDocument();
  });

  it('shows usage statistics when enabled', () => {
    const hashtags = [
      { name: 'javascript', usageCount: 42 }
    ];

    render(FeaturedHashtags, { 
      props: { hashtags, isOwnProfile: false, showStats: true } 
    });

    expect(screen.getByText(/42/)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md)
- [Profile.Header](./Header.md)
- [Profile.EndorsedAccounts](./EndorsedAccounts.md)

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Mastodon Featured Hashtags](https://docs.joinmastodon.org/user/profile/#featured-tags)
- [Hashtag Best Practices](../../guides/HASHTAG_BEST_PRACTICES.md)

