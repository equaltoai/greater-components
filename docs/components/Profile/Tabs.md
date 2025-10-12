# Profile.Tabs

**Component**: Profile Navigation Tabs  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 22 passing tests

---

## 📋 Overview

`Profile.Tabs` provides tab navigation for different profile sections such as posts, replies, media, and likes. It integrates with the headless tabs primitive for accessibility and keyboard navigation, with support for custom tabs, icons, and count badges.

### **Key Features**:
- ✅ Tab navigation for profile sections
- ✅ Active tab indicator
- ✅ Optional count badges
- ✅ Icon support
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Customizable tab list
- ✅ Responsive design with overflow handling
- ✅ Accessible with ARIA attributes

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

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  const handlers = {
    onTabChange: (tabId: string) => {
      console.log('Tab changed to:', tabId);
    }
  };
</script>

<Profile.Root {profile} {handlers}>
  <Profile.Header />
  <Profile.Tabs />
</Profile.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Custom CSS class |

The tabs are configured through the Profile context's `tabs` property.

### **ProfileTab Interface**

```typescript
interface ProfileTab {
  id: string;
  label: string;
  count?: number;
  icon?: string; // SVG path data
}
```

---

## 💡 Examples

### **Example 1: Default Tabs**

Use default tabs with basic configuration:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { ProfileData, ProfileHandlers } from '@greater/fediverse/Profile';

  const profile: ProfileData = {
    id: '123',
    username: 'alice',
    displayName: 'Alice Wonder',
    bio: 'Software developer',
    avatar: 'https://cdn.example.com/avatars/alice.jpg',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let activeTab = $state('posts');
  let content = $state<any[]>([]);

  const handlers: ProfileHandlers = {
    onTabChange: async (tabId: string) => {
      activeTab = tabId;
      await loadTabContent(tabId);
    }
  };

  async function loadTabContent(tabId: string) {
    const response = await fetch(`/api/profiles/${profile.id}/${tabId}`);
    content = await response.json();
  }

  // Load initial content
  $effect(() => {
    loadTabContent('posts');
  });
</script>

<div class="profile-with-tabs">
  <Profile.Root {profile} {handlers}>
    <Profile.Header />
    <Profile.Stats />
    <Profile.Tabs />
    
    <div class="tab-content">
      {#if content.length === 0}
        <div class="empty-state">
          <p>No {activeTab} to display</p>
        </div>
      {:else}
        {#each content as item}
          <div class="content-item">
            <!-- Render item based on tab type -->
            {item.content}
          </div>
        {/each}
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .profile-with-tabs {
    max-width: 600px;
    margin: 0 auto;
  }

  .tab-content {
    padding: 1rem;
    min-height: 400px;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--text-secondary, #536471);
  }

  .content-item {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color, #eff3f4);
  }
</style>
```

### **Example 2: Custom Tabs with Icons and Counts**

Configure custom tabs with icons and badge counts:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import type { ProfileTab } from '@greater/fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  // Custom tabs with icons and counts
  const customTabs: ProfileTab[] = [
    {
      id: 'posts',
      label: 'Posts',
      count: 245,
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'
    },
    {
      id: 'media',
      label: 'Media',
      count: 89,
      icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'
    },
    {
      id: 'likes',
      label: 'Likes',
      count: 423,
      icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    },
    {
      id: 'replies',
      label: 'Replies',
      count: 156,
      icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z'
    }
  ];

  let activeTab = $state('posts');

  // Update context with custom tabs
  $effect(() => {
    // This would be set via initialState in Profile.Root
    // For demonstration, showing the concept
  });

  const handlers = {
    onTabChange: (tabId: string) => {
      activeTab = tabId;
      console.log('Switched to tab:', tabId);
    }
  };
</script>

<div class="custom-tabs-profile">
  <Profile.Root 
    {profile} 
    {handlers}
    initialState={{ tabs: customTabs, activeTab: 'posts' }}
  >
    <Profile.Tabs />
    
    <div class="tab-panels">
      {#if activeTab === 'posts'}
        <div class="panel">Posts content</div>
      {:else if activeTab === 'media'}
        <div class="panel">Media gallery</div>
      {:else if activeTab === 'likes'}
        <div class="panel">Liked posts</div>
      {:else if activeTab === 'replies'}
        <div class="panel">Replies</div>
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .custom-tabs-profile {
    max-width: 600px;
    margin: 0 auto;
  }

  .tab-panels {
    padding: 1.5rem;
  }

  .panel {
    min-height: 300px;
  }
</style>
```

### **Example 3: With Lazy Loading**

Lazy load tab content when tabs are activated:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let activeTab = $state('posts');
  let tabData = $state<{ [key: string]: { loading: boolean; data: any[] } }>({
    posts: { loading: false, data: [] },
    replies: { loading: false, data: [] },
    media: { loading: false, data: [] },
    likes: { loading: false, data: [] }
  });

  const handlers = {
    onTabChange: async (tabId: string) => {
      activeTab = tabId;
      
      // Load data if not already loaded
      if (tabData[tabId].data.length === 0 && !tabData[tabId].loading) {
        await loadTabData(tabId);
      }
    }
  };

  async function loadTabData(tabId: string) {
    tabData[tabId].loading = true;

    try {
      const response = await fetch(
        `/api/profiles/${profile.id}/${tabId}?limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to load data');
      }

      const data = await response.json();
      tabData[tabId] = {
        loading: false,
        data
      };
    } catch (error) {
      console.error('Error loading tab data:', error);
      tabData[tabId].loading = false;
    }
  }

  // Load initial tab data
  $effect(() => {
    loadTabData('posts');
  });
</script>

<div class="lazy-tabs-profile">
  <Profile.Root {profile} {handlers}>
    <Profile.Tabs />
    
    <div class="tab-content">
      {#if tabData[activeTab].loading}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading {activeTab}...</p>
        </div>
      {:else if tabData[activeTab].data.length === 0}
        <div class="empty-state">
          <p>No {activeTab} to display</p>
        </div>
      {:else}
        <div class="data-list">
          {#each tabData[activeTab].data as item}
            <div class="data-item">
              {JSON.stringify(item)}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .lazy-tabs-profile {
    max-width: 600px;
    margin: 0 auto;
  }

  .tab-content {
    padding: 1.5rem;
    min-height: 400px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    gap: 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #eff3f4;
    border-top-color: #1d9bf0;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #536471;
  }

  .data-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .data-item {
    padding: 1rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
  }
</style>
```

### **Example 4: With URL Routing**

Sync tabs with URL routing:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  // Get active tab from URL
  const activeTab = $derived($page.url.searchParams.get('tab') || 'posts');

  const handlers = {
    onTabChange: (tabId: string) => {
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabId);
      goto(url.toString(), { replaceState: true, noScroll: true });
    }
  };

  // Load content based on active tab
  let content = $state<any[]>([]);
  let loading = $state(false);

  async function loadContent() {
    loading = true;
    try {
      const response = await fetch(
        `/api/profiles/${profile.id}/${activeTab}`
      );
      content = await response.json();
    } catch (error) {
      console.error('Failed to load content:', error);
      content = [];
    } finally {
      loading = false;
    }
  }

  // Reload content when tab changes
  $effect(() => {
    loadContent();
  });
</script>

<svelte:head>
  <title>{profile.displayName} - {activeTab} | My App</title>
</svelte:head>

<div class="routed-tabs-profile">
  <Profile.Root {profile} {handlers} initialState={{ activeTab }}>
    <Profile.Header />
    <Profile.Tabs />
    
    <div class="tab-content">
      {#if loading}
        <div class="loading">Loading...</div>
      {:else}
        <div class="content-grid">
          {#each content as item}
            <div class="content-card">{item.title}</div>
          {/each}
        </div>
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .routed-tabs-profile {
    max-width: 600px;
    margin: 0 auto;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #536471;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .content-card {
    padding: 1rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
  }
</style>
```

### **Example 5: With Infinite Scroll Per Tab**

Implement infinite scroll for each tab's content:

```svelte
<script lang="ts">
  import * as Profile from '@greater/fediverse/Profile';
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  const profile = {
    id: '123',
    username: 'alice',
    displayName: 'Alice',
    bio: 'Developer',
    followersCount: 1234,
    followingCount: 567,
    statusesCount: 8910
  };

  let activeTab = $state('posts');

  // Create infinite queries for each tab
  const queries = {
    posts: createInfiniteQuery({
      queryKey: ['profile', profile.id, 'posts'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetch(
          `/api/profiles/${profile.id}/posts?offset=${pageParam}&limit=20`
        );
        return response.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length * 20 : undefined;
      },
      enabled: activeTab === 'posts'
    }),
    media: createInfiniteQuery({
      queryKey: ['profile', profile.id, 'media'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetch(
          `/api/profiles/${profile.id}/media?offset=${pageParam}&limit=20`
        );
        return response.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length * 20 : undefined;
      },
      enabled: activeTab === 'media'
    }),
    likes: createInfiniteQuery({
      queryKey: ['profile', profile.id, 'likes'],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await fetch(
          `/api/profiles/${profile.id}/likes?offset=${pageParam}&limit=20`
        );
        return response.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length * 20 : undefined;
      },
      enabled: activeTab === 'likes'
    })
  };

  const currentQuery = $derived(queries[activeTab as keyof typeof queries]);
  const items = $derived(
    $currentQuery.data?.pages.flatMap(page => page.items) ?? []
  );

  const handlers = {
    onTabChange: (tabId: string) => {
      activeTab = tabId;
    }
  };

  // Intersection observer for infinite scroll
  let sentinelElement: HTMLElement;

  $effect(() => {
    if (!sentinelElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && $currentQuery.hasNextPage) {
          $currentQuery.fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinelElement);

    return () => observer.disconnect();
  });
</script>

<div class="infinite-scroll-profile">
  <Profile.Root {profile} {handlers}>
    <Profile.Tabs />
    
    <div class="tab-content">
      {#if $currentQuery.isPending}
        <div class="loading">Loading...</div>
      {:else if items.length === 0}
        <div class="empty">No {activeTab} to display</div>
      {:else}
        <div class="items-list">
          {#each items as item}
            <div class="item-card">{item.content}</div>
          {/each}
        </div>

        {#if $currentQuery.hasNextPage}
          <div bind:this={sentinelElement} class="sentinel">
            {#if $currentQuery.isFetchingNextPage}
              <div class="loading-more">Loading more...</div>
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </Profile.Root>
</div>

<style>
  .infinite-scroll-profile {
    max-width: 600px;
    margin: 0 auto;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 2rem;
    color: #536471;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-card {
    padding: 1rem;
    background: #f7f9fa;
    border: 1px solid #eff3f4;
    border-radius: 0.5rem;
  }

  .sentinel {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-more {
    color: #536471;
    font-size: 0.875rem;
  }
</style>
```

---

## 🔒 Security Considerations

### **Content Filtering**

Filter sensitive content based on user preferences:

```typescript
// server/api/profile-content.ts
export async function GET(request: Request) {
  const userId = await getAuthenticatedUserId(request);
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const tab = searchParams.get('tab');

  // Check if user can view this content
  const canView = await checkViewPermission(userId, profileId, tab);
  if (!canView) {
    return new Response('Forbidden', { status: 403 });
  }

  // Filter based on privacy settings
  const content = await getFilteredContent(profileId, tab, userId);

  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 🎨 Styling

```css
.profile-tabs {
  --tabs-border-color: var(--border-color, #e1e8ed);
  --tabs-active-color: var(--primary-color, #1d9bf0);
  --tabs-text-color: var(--text-secondary, #536471);
  --tabs-active-text: var(--text-primary, #0f1419);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .profile-tabs {
    --tabs-border-color: #38444d;
    --tabs-text-color: #8899a6;
    --tabs-active-text: #f7f9fa;
  }
}
```

---

## ♿ Accessibility

- ✅ **ARIA Roles**: Proper `role="tablist"` and `role="tab"`
- ✅ **Keyboard Navigation**: Arrow keys, Home, End
- ✅ **Focus Management**: Clear focus indicators
- ✅ **Screen Readers**: Proper labels and selected states
- ✅ **ARIA Attributes**: `aria-selected`, `aria-controls`

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import * as Profile from '@greater/fediverse/Profile';

describe('Profile.Tabs', () => {
  const mockProfile = {
    id: '1',
    username: 'alice',
    displayName: 'Alice',
    followersCount: 100,
    followingCount: 50,
    statusesCount: 200
  };

  it('renders all tabs', () => {
    render(Profile.Root, {
      props: { profile: mockProfile, handlers: {} }
    });

    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Replies')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
  });

  it('calls onTabChange when tab clicked', async () => {
    const onTabChange = vi.fn();

    render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: { onTabChange }
      }
    });

    const mediaTab = screen.getByText('Media');
    await fireEvent.click(mediaTab);

    expect(onTabChange).toHaveBeenCalledWith('media');
  });

  it('shows active tab indicator', () => {
    const { container } = render(Profile.Root, {
      props: {
        profile: mockProfile,
        handlers: {},
        initialState: { activeTab: 'media' }
      }
    });

    const mediaTab = screen.getByText('Media').closest('button');
    expect(mediaTab).toHaveClass('profile-tabs__tab--active');
  });
});
```

---

## 🔗 Related Components

- [Profile.Root](./Root.md) - Context provider
- [Profile.Header](./Header.md) - Profile header
- [Profile.Stats](./Stats.md) - Statistics display

---

## 📚 See Also

- [Profile Components Overview](./README.md)
- [Headless Tabs Primitive](../../primitives/TABS.md)
- [Accessibility Guidelines](../../patterns/ACCESSIBILITY.md)
- [Infinite Scroll Pattern](../../patterns/INFINITE_SCROLL.md)

