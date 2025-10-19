# Notifications.Filter

**Component**: Notification Type Filter  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 8 passing tests

---

## 📋 Overview

`Notifications.Filter` provides a tabbed interface for filtering notifications by type. It displays filter options with icons and labels, highlights the active filter, and integrates seamlessly with the Notifications context to update the displayed notifications when filters change.

### **Key Features**:
- ✅ Six predefined filter types (All, Mentions, Follows, Boosts, Favorites, Polls)
- ✅ Visual active state indicator
- ✅ Icon-based navigation with labels
- ✅ Responsive design (icons-only on mobile)
- ✅ Sticky positioning option
- ✅ Keyboard navigation support
- ✅ ARIA attributes for accessibility
- ✅ Smooth transitions and hover effects
- ✅ Context-aware state management
- ✅ Event handler integration
- ✅ Customizable styling

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

Or with pnpm:

```bash
pnpm add @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications: Notification[] = [
    // ... notification data
  ];

  let activeFilter = $state('all');

  const handlers = {
    onFilterChange: (filter) => {
      activeFilter = filter;
      console.log('Filter changed to:', filter);
    }
  };
</script>

<Notifications.Root {notifications} {handlers}>
  <Notifications.Filter />
  
  {#each notifications as notification}
    <Notifications.Item {notification} />
  {/each}
</Notifications.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `class` | `string` | `''` | No | Additional CSS class for styling |

### **Filter Types**

The component provides six filter options:

```typescript
type NotificationFilter = 
  | 'all'        // All notifications
  | 'mentions'   // Mentions only
  | 'follows'    // Follow/follow request notifications
  | 'boosts'     // Boost/reblog notifications
  | 'favorites'  // Favorite/like notifications
  | 'polls';     // Poll notifications
```

### **Filter Configuration**

Each filter has:
- **Value**: The filter identifier
- **Label**: Display text (hidden on mobile)
- **Icon**: Emoji icon for visual identification

```typescript
const filters = [
  { value: 'all', label: 'All', icon: '🔔' },
  { value: 'mentions', label: 'Mentions', icon: '@' },
  { value: 'follows', label: 'Follows', icon: '👤' },
  { value: 'boosts', label: 'Boosts', icon: '🔁' },
  { value: 'favorites', label: 'Favorites', icon: '⭐' },
  { value: 'polls', label: 'Polls', icon: '📊' }
];
```

---

## 📤 Events

The component automatically calls the `onFilterChange` handler from the parent `Notifications.Root` context:

| Event | Handler | Parameters | Description |
|-------|---------|------------|-------------|
| Filter Click | `onFilterChange` | `filter: NotificationFilter` | Called when a filter tab is clicked |

---

## 💡 Examples

### Example 1: Basic Filter Implementation

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([
    {
      id: '1',
      type: 'follow',
      createdAt: '2025-10-12T10:00:00Z',
      account: {
        id: 'user1',
        username: 'alice',
        displayName: 'Alice Smith',
        avatar: 'https://cdn.example.com/avatars/alice.jpg'
      },
      read: false
    },
    {
      id: '2',
      type: 'mention',
      createdAt: '2025-10-12T09:30:00Z',
      account: {
        id: 'user2',
        username: 'bob',
        displayName: 'Bob Jones',
        avatar: 'https://cdn.example.com/avatars/bob.jpg'
      },
      status: {
        id: 'status1',
        content: '<p>Hey <span class="mention">@you</span>!</p>',
        createdAt: '2025-10-12T09:30:00Z'
      },
      read: false
    },
    {
      id: '3',
      type: 'favourite',
      createdAt: '2025-10-12T09:00:00Z',
      account: {
        id: 'user3',
        username: 'carol',
        displayName: 'Carol Davis',
        avatar: 'https://cdn.example.com/avatars/carol.jpg'
      },
      status: {
        id: 'status2',
        content: '<p>My post</p>',
        createdAt: '2025-10-11T15:00:00Z'
      },
      read: true
    },
    {
      id: '4',
      type: 'reblog',
      createdAt: '2025-10-12T08:30:00Z',
      account: {
        id: 'user4',
        username: 'dave',
        displayName: 'Dave Wilson',
        avatar: 'https://cdn.example.com/avatars/dave.jpg'
      },
      status: {
        id: 'status3',
        content: '<p>Another post</p>',
        createdAt: '2025-10-10T12:00:00Z'
      },
      read: true
    },
    {
      id: '5',
      type: 'poll',
      createdAt: '2025-10-12T08:00:00Z',
      account: {
        id: 'user5',
        username: 'eve',
        displayName: 'Eve Anderson',
        avatar: 'https://cdn.example.com/avatars/eve.jpg'
      },
      status: {
        id: 'status4',
        content: '<p>Poll results are in!</p>',
        createdAt: '2025-10-09T10:00:00Z'
      },
      read: false
    }
  ]);

  let activeFilter = $state<'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls'>('all');

  // Filter notifications based on active filter
  const filteredNotifications = $derived(() => {
    if (activeFilter === 'all') {
      return notifications;
    }

    const filterMap: Record<typeof activeFilter, string[]> = {
      mentions: ['mention'],
      follows: ['follow', 'follow_request'],
      boosts: ['reblog'],
      favorites: ['favourite'],
      polls: ['poll'],
      all: []
    };

    const allowedTypes = filterMap[activeFilter] || [];
    return notifications.filter(n => allowedTypes.includes(n.type));
  });

  const handlers = {
    onFilterChange: (filter: typeof activeFilter) => {
      activeFilter = filter;
      console.log('Active filter:', filter);
      console.log('Filtered count:', filteredNotifications.length);
    }
  };

  const config = {
    mode: 'flat' as const,
    showTimestamps: true,
    showAvatars: true,
    filter: activeFilter
  };

  // Calculate counts per filter
  const filterCounts = $derived({
    all: notifications.length,
    mentions: notifications.filter(n => n.type === 'mention').length,
    follows: notifications.filter(n => n.type === 'follow' || n.type === 'follow_request').length,
    boosts: notifications.filter(n => n.type === 'reblog').length,
    favorites: notifications.filter(n => n.type === 'favourite').length,
    polls: notifications.filter(n => n.type === 'poll').length
  });
</script>

<div class="notifications-container">
  <header class="notifications-header">
    <h1>Notifications</h1>
    <div class="filter-summary">
      Showing {filteredNotifications.length} 
      {activeFilter === 'all' ? '' : activeFilter} 
      {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
    </div>
  </header>

  <Notifications.Root 
    notifications={filteredNotifications} 
    {handlers}
    {config}
  >
    <Notifications.Filter />
    
    <div class="notifications-list">
      {#if filteredNotifications.length === 0}
        <div class="empty-state">
          <p>No {activeFilter === 'all' ? '' : activeFilter} notifications</p>
        </div>
      {:else}
        {#each filteredNotifications as notification (notification.id)}
          <Notifications.Item {notification} />
        {/each}
      {/if}
    </div>
  </Notifications.Root>
  
  <footer class="filter-counts">
    <h3>Notification Counts</h3>
    <ul>
      <li>All: {filterCounts.all}</li>
      <li>Mentions: {filterCounts.mentions}</li>
      <li>Follows: {filterCounts.follows}</li>
      <li>Boosts: {filterCounts.boosts}</li>
      <li>Favorites: {filterCounts.favorites}</li>
      <li>Polls: {filterCounts.polls}</li>
    </ul>
  </footer>
</div>

<style>
  .notifications-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .notifications-header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .notifications-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .filter-summary {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .notifications-list {
    min-height: 300px;
  }
  
  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-secondary);
  }
  
  .filter-counts {
    margin-top: 2rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
  }
  
  .filter-counts h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 700;
  }
  
  .filter-counts ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .filter-counts li {
    padding: 0.25rem 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

### Example 2: Filter with Badge Counts

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([
    // ... sample notifications covering all types
  ]);

  let activeFilter = $state<'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls'>('all');

  const filteredNotifications = $derived(() => {
    if (activeFilter === 'all') return notifications;

    const filterMap: Record<typeof activeFilter, string[]> = {
      mentions: ['mention'],
      follows: ['follow', 'follow_request'],
      boosts: ['reblog'],
      favorites: ['favourite'],
      polls: ['poll'],
      all: []
    };

    return notifications.filter(n => filterMap[activeFilter]?.includes(n.type));
  });

  // Calculate unread counts per filter
  const unreadCounts = $derived({
    all: notifications.filter(n => !n.read).length,
    mentions: notifications.filter(n => n.type === 'mention' && !n.read).length,
    follows: notifications.filter(n => (n.type === 'follow' || n.type === 'follow_request') && !n.read).length,
    boosts: notifications.filter(n => n.type === 'reblog' && !n.read).length,
    favorites: notifications.filter(n => n.type === 'favourite' && !n.read).length,
    polls: notifications.filter(n => n.type === 'poll' && !n.read).length
  });

  const handlers = {
    onFilterChange: (filter: typeof activeFilter) => {
      activeFilter = filter;
    },
    onNotificationClick: (notification: Notification) => {
      // Mark as read when clicked
      notifications = notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      );
    }
  };
</script>

<div class="notifications-with-badges">
  <Notifications.Root 
    notifications={filteredNotifications} 
    {handlers}
    config={{ filter: activeFilter }}
  >
    <div class="filter-wrapper">
      <Notifications.Filter class="enhanced-filter" />
      
      <!-- Custom badge overlays -->
      <div class="filter-badges">
        {#if unreadCounts.mentions > 0 && activeFilter !== 'mentions'}
          <span class="filter-badge filter-badge--mentions" style="left: calc(16.66% * 1 + 8.33%)">
            {unreadCounts.mentions}
          </span>
        {/if}
        
        {#if unreadCounts.follows > 0 && activeFilter !== 'follows'}
          <span class="filter-badge filter-badge--follows" style="left: calc(16.66% * 2 + 8.33%)">
            {unreadCounts.follows}
          </span>
        {/if}
        
        {#if unreadCounts.boosts > 0 && activeFilter !== 'boosts'}
          <span class="filter-badge filter-badge--boosts" style="left: calc(16.66% * 3 + 8.33%)">
            {unreadCounts.boosts}
          </span>
        {/if}
        
        {#if unreadCounts.favorites > 0 && activeFilter !== 'favorites'}
          <span class="filter-badge filter-badge--favorites" style="left: calc(16.66% * 4 + 8.33%)">
            {unreadCounts.favorites}
          </span>
        {/if}
        
        {#if unreadCounts.polls > 0 && activeFilter !== 'polls'}
          <span class="filter-badge filter-badge--polls" style="left: calc(16.66% * 5 + 8.33%)">
            {unreadCounts.polls}
          </span>
        {/if}
      </div>
    </div>
    
    {#each filteredNotifications as notification (notification.id)}
      <Notifications.Item {notification} />
    {/each}
  </Notifications.Root>
</div>

<style>
  .notifications-with-badges {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .filter-wrapper {
    position: relative;
  }
  
  .filter-badges {
    position: absolute;
    top: 0.5rem;
    left: 0;
    right: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  .filter-badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: #dc2626;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    border-radius: 9px;
    transform: translateX(-50%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translateX(-50%) scale(1);
    }
    50% {
      transform: translateX(-50%) scale(1.1);
    }
  }
  
  .filter-badge--mentions { background: #8b5cf6; }
  .filter-badge--follows { background: #3b82f6; }
  .filter-badge--boosts { background: #10b981; }
  .filter-badge--favorites { background: #f59e0b; }
  .filter-badge--polls { background: #ec4899; }
</style>
```

### Example 3: Filter with Persistence (localStorage)

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import { onMount } from 'svelte';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([]);
  let activeFilter = $state<'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls'>('all');
  let loading = $state(true);

  // Load saved filter preference from localStorage
  onMount(() => {
    const savedFilter = localStorage.getItem('notification-filter');
    if (savedFilter) {
      activeFilter = savedFilter as typeof activeFilter;
    }
    
    // Fetch notifications
    fetchNotifications();
  });

  async function fetchNotifications() {
    loading = true;
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      notifications = data.notifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      loading = false;
    }
  }

  const filteredNotifications = $derived(() => {
    if (activeFilter === 'all') return notifications;

    const filterMap: Record<typeof activeFilter, string[]> = {
      mentions: ['mention'],
      follows: ['follow', 'follow_request'],
      boosts: ['reblog'],
      favorites: ['favourite'],
      polls: ['poll'],
      all: []
    };

    return notifications.filter(n => filterMap[activeFilter]?.includes(n.type));
  });

  const handlers = {
    onFilterChange: (filter: typeof activeFilter) => {
      activeFilter = filter;
      
      // Save preference to localStorage
      localStorage.setItem('notification-filter', filter);
      
      // Track analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'filter_change', {
          event_category: 'notifications',
          event_label: filter
        });
      }
      
      console.log('Filter changed and saved:', filter);
    }
  };

  // Restore scroll position when filter changes
  let scrollContainer: HTMLElement | null = null;
  
  $effect(() => {
    // React to filter changes
    const savedScroll = sessionStorage.getItem(`scroll-${activeFilter}`);
    if (savedScroll && scrollContainer) {
      scrollContainer.scrollTop = parseInt(savedScroll, 10);
    }
  });

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    sessionStorage.setItem(`scroll-${activeFilter}`, target.scrollTop.toString());
  }
</script>

<div class="persistent-notifications">
  <header class="header">
    <h1>Notifications</h1>
    <div class="header-info">
      <span class="filter-label">Filter: {activeFilter}</span>
      {#if activeFilter !== 'all'}
        <button 
          class="reset-filter"
          onclick={() => handlers.onFilterChange('all')}
        >
          Show All
        </button>
      {/if}
    </div>
  </header>

  <Notifications.Root 
    {notifications}
    {handlers}
    config={{ filter: activeFilter }}
  >
    <Notifications.Filter />
    
    <div 
      class="notifications-scroll"
      bind:this={scrollContainer}
      onscroll={handleScroll}
    >
      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      {:else if filteredNotifications.length === 0}
        <div class="empty-state">
          <p>No {activeFilter === 'all' ? '' : activeFilter} notifications</p>
          <p class="empty-hint">
            {#if activeFilter !== 'all'}
              Try switching to "All" to see other notifications
            {:else}
              When you receive notifications, they'll appear here
            {/if}
          </p>
        </div>
      {:else}
        {#each filteredNotifications as notification (notification.id)}
          <Notifications.Item {notification} />
        {/each}
      {/if}
    </div>
  </Notifications.Root>
</div>

<style>
  .persistent-notifications {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
  }
  
  .header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .header-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .filter-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-transform: capitalize;
  }
  
  .reset-filter {
    padding: 0.25rem 0.75rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reset-filter:hover {
    background: var(--bg-hover);
  }
  
  .notifications-scroll {
    flex: 1;
    overflow-y: auto;
  }
  
  .loading,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
    text-align: center;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .empty-hint {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

### Example 4: Filter with URL Query Parameters

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([]);

  // Get active filter from URL query parameter
  const activeFilter = $derived(
    ($page.url.searchParams.get('filter') as 'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls') || 'all'
  );

  const filteredNotifications = $derived(() => {
    if (activeFilter === 'all') return notifications;

    const filterMap: Record<typeof activeFilter, string[]> = {
      mentions: ['mention'],
      follows: ['follow', 'follow_request'],
      boosts: ['reblog'],
      favorites: ['favourite'],
      polls: ['poll'],
      all: []
    };

    return notifications.filter(n => filterMap[activeFilter]?.includes(n.type));
  });

  const handlers = {
    onFilterChange: (filter: typeof activeFilter) => {
      // Update URL with new filter
      const url = new URL(window.location.href);
      
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      
      // Navigate without page reload
      goto(url.pathname + url.search, { replaceState: true });
    }
  };

  // Generate shareable links for each filter
  function getFilterLink(filter: typeof activeFilter): string {
    const url = new URL(window.location.href);
    
    if (filter === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', filter);
    }
    
    return url.pathname + url.search;
  }

  async function copyFilterLink(filter: typeof activeFilter) {
    const link = window.location.origin + getFilterLink(filter);
    
    try {
      await navigator.clipboard.writeText(link);
      alert(`Link copied: ${link}`);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }
</script>

<div class="url-filtered-notifications">
  <Notifications.Root 
    {notifications}
    {handlers}
    config={{ filter: activeFilter }}
  >
    <div class="filter-section">
      <Notifications.Filter />
      
      <div class="share-section">
        <button 
          class="share-button"
          onclick={() => copyFilterLink(activeFilter)}
          title="Copy link to this filtered view"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          Share Filter
        </button>
      </div>
    </div>
    
    <div class="filter-info">
      <p>Current filter: <strong>{activeFilter}</strong></p>
      <p>Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? '' : 's'}</p>
    </div>
    
    {#each filteredNotifications as notification (notification.id)}
      <Notifications.Item {notification} />
    {/each}
  </Notifications.Root>
</div>

<style>
  .url-filtered-notifications {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
  }
  
  .share-section {
    flex-shrink: 0;
  }
  
  .share-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .share-button svg {
    width: 1rem;
    height: 1rem;
  }
  
  .share-button:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .filter-info {
    padding: 1rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .filter-info p {
    margin: 0.25rem 0;
  }
  
  .filter-info strong {
    color: var(--text-primary);
    text-transform: capitalize;
  }
</style>
```

### Example 5: Advanced Filter with Animation and Statistics

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import { fly, fade } from 'svelte/transition';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([]);
  let activeFilter = $state<'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls'>('all');
  let previousFilter = $state<typeof activeFilter>('all');
  let filterTransition = $state(false);

  const filteredNotifications = $derived(() => {
    if (activeFilter === 'all') return notifications;

    const filterMap: Record<typeof activeFilter, string[]> = {
      mentions: ['mention'],
      follows: ['follow', 'follow_request'],
      boosts: ['reblog'],
      favorites: ['favourite'],
      polls: ['poll'],
      all: []
    };

    return notifications.filter(n => filterMap[activeFilter]?.includes(n.type));
  });

  // Calculate detailed statistics
  const statistics = $derived(() => {
    const stats = {
      all: { total: 0, unread: 0, read: 0 },
      mentions: { total: 0, unread: 0, read: 0 },
      follows: { total: 0, unread: 0, read: 0 },
      boosts: { total: 0, unread: 0, read: 0 },
      favorites: { total: 0, unread: 0, read: 0 },
      polls: { total: 0, unread: 0, read: 0 }
    };

    notifications.forEach(n => {
      stats.all.total++;
      if (!n.read) stats.all.unread++;
      else stats.all.read++;

      if (n.type === 'mention') {
        stats.mentions.total++;
        if (!n.read) stats.mentions.unread++;
        else stats.mentions.read++;
      } else if (n.type === 'follow' || n.type === 'follow_request') {
        stats.follows.total++;
        if (!n.read) stats.follows.unread++;
        else stats.follows.read++;
      } else if (n.type === 'reblog') {
        stats.boosts.total++;
        if (!n.read) stats.boosts.unread++;
        else stats.boosts.read++;
      } else if (n.type === 'favourite') {
        stats.favorites.total++;
        if (!n.read) stats.favorites.unread++;
        else stats.favorites.read++;
      } else if (n.type === 'poll') {
        stats.polls.total++;
        if (!n.read) stats.polls.unread++;
        else stats.polls.read++;
      }
    });

    return stats;
  });

  const handlers = {
    onFilterChange: (filter: typeof activeFilter) => {
      previousFilter = activeFilter;
      filterTransition = true;
      
      setTimeout(() => {
        activeFilter = filter;
        filterTransition = false;
      }, 150);
    }
  };

  // Get emoji for filter type
  function getFilterEmoji(filter: typeof activeFilter): string {
    const emojis: Record<typeof activeFilter, string> = {
      all: '🔔',
      mentions: '@',
      follows: '👤',
      boosts: '🔁',
      favorites: '⭐',
      polls: '📊'
    };
    return emojis[filter];
  }

  // Calculate percentage for progress bars
  function getReadPercentage(filter: typeof activeFilter): number {
    const stat = statistics[filter];
    if (stat.total === 0) return 0;
    return Math.round((stat.read / stat.total) * 100);
  }
</script>

<div class="advanced-filter-notifications">
  <Notifications.Root 
    {notifications}
    {handlers}
    config={{ filter: activeFilter }}
  >
    <Notifications.Filter class="animated-filter" />
    
    <div class="statistics-panel">
      <div class="current-filter">
        <span class="filter-emoji">{getFilterEmoji(activeFilter)}</span>
        <div class="filter-details">
          <h3>{activeFilter === 'all' ? 'All Notifications' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</h3>
          <div class="filter-counts">
            <span class="count-total">{statistics[activeFilter].total} total</span>
            <span class="count-divider">•</span>
            <span class="count-unread">{statistics[activeFilter].unread} unread</span>
            <span class="count-divider">•</span>
            <span class="count-read">{statistics[activeFilter].read} read</span>
          </div>
        </div>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill"
          style="width: {getReadPercentage(activeFilter)}%"
        ></div>
      </div>
      
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-label">Total</div>
          <div class="stat-value">{statistics[activeFilter].total}</div>
        </div>
        <div class="stat-card stat-card--unread">
          <div class="stat-label">Unread</div>
          <div class="stat-value">{statistics[activeFilter].unread}</div>
        </div>
        <div class="stat-card stat-card--read">
          <div class="stat-label">Read</div>
          <div class="stat-value">{statistics[activeFilter].read}</div>
        </div>
      </div>
    </div>
    
    <div class="notifications-list">
      {#if filterTransition}
        <div class="transition-overlay" transition:fade={{ duration: 150 }}>
          <div class="transition-content">
            <div class="transition-emoji">{getFilterEmoji(activeFilter)}</div>
            <p>Loading {activeFilter} notifications...</p>
          </div>
        </div>
      {/if}
      
      {#each filteredNotifications as notification (notification.id)}
        <div transition:fly={{ y: 20, duration: 200 }}>
          <Notifications.Item {notification} />
        </div>
      {/each}
    </div>
  </Notifications.Root>
</div>

<style>
  .advanced-filter-notifications {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .statistics-panel {
    padding: 1rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .current-filter {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .filter-emoji {
    font-size: 2.5rem;
    line-height: 1;
  }
  
  .filter-details h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
    text-transform: capitalize;
  }
  
  .filter-counts {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  
  .count-total {
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .count-unread {
    color: #1d9bf0;
    font-weight: 600;
  }
  
  .count-read {
    color: var(--text-secondary);
  }
  
  .count-divider {
    color: var(--text-secondary);
  }
  
  .progress-bar {
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #16a34a);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: center;
  }
  
  .stat-card--unread {
    border-color: #1d9bf0;
    background: rgba(29, 155, 240, 0.05);
  }
  
  .stat-card--read {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
  
  .stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .notifications-list {
    position: relative;
    min-height: 400px;
  }
  
  .transition-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    z-index: 10;
  }
  
  .transition-content {
    text-align: center;
  }
  
  .transition-emoji {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    animation: bounce 0.6s infinite;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .transition-content p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.notification-filter` | Root filter container |
| `.notification-filter__tabs` | Tabs container with horizontal scroll |
| `.notification-filter__tab` | Individual filter tab button |
| `.notification-filter__tab--active` | Applied to active tab |
| `.notification-filter__icon` | Tab icon container |
| `.notification-filter__label` | Tab label text |

### **CSS Custom Properties**

```css
:root {
  --notifications-filter-bg: #ffffff;
  --notifications-filter-hover-bg: #f7f9fa;
  --notifications-border: #e1e8ed;
  --notifications-text-primary: #0f1419;
  --notifications-text-secondary: #536471;
  --notifications-primary: #1d9bf0;
  --notifications-font-size-base: 1rem;
}
```

### **Custom Styling Example**

```svelte
<Notifications.Root {notifications} {handlers}>
  <Notifications.Filter class="custom-filter" />
</Notifications.Root>

<style>
  :global(.custom-filter) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 0.5rem;
  }
  
  :global(.custom-filter .notification-filter__tab) {
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  :global(.custom-filter .notification-filter__tab--active) {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
  }
</style>
```

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<nav aria-label="Filter notifications">
  <button aria-current="page">All</button>
  <button>Mentions</button>
  <!-- ... -->
</nav>
```

### **Keyboard Navigation**

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate between filter tabs |
| `Arrow Left` / `Arrow Right` | Navigate tabs (with roving tabindex) |
| `Enter` / `Space` | Activate filter |
| `Home` | Jump to first filter |
| `End` | Jump to last filter |

### **Screen Reader Support**

- Announces current filter
- Announces filter changes
- Proper semantic HTML (`<nav>`, `<button>`)
- `aria-current="page"` for active filter

---

## 🔒 Security

### **Input Validation**

Always validate filter values:

```typescript
const validFilters = ['all', 'mentions', 'follows', 'boosts', 'favorites', 'polls'];

function isValidFilter(filter: string): filter is NotificationFilter {
  return validFilters.includes(filter);
}

// Use when reading from URL or localStorage
const filter = urlParams.get('filter');
if (filter && isValidFilter(filter)) {
  activeFilter = filter;
}
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Memoize filtered results**:
   ```typescript
   const filtered = $derived(filterNotifications(notifications, activeFilter));
   ```

2. **Debounce filter changes** if triggering API calls:
   ```typescript
   const debouncedFilter = debounce((filter) => {
     fetchFilteredNotifications(filter);
   }, 300);
   ```

3. **Use CSS containment**:
   ```css
   .notification-filter {
     contain: layout style paint;
   }
   ```

---

## 🧪 Testing

Test file: `packages/fediverse/tests/NotificationFilter.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Notifications } from '@equaltoai/greater-components-fediverse';

describe('Notifications.Filter', () => {
  it('renders all filter tabs', () => {
    render(Notifications.Filter);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Mentions')).toBeInTheDocument();
    expect(screen.getByText('Follows')).toBeInTheDocument();
  });
  
  it('calls onFilterChange when tab is clicked', async () => {
    const onFilterChange = vi.fn();
    const handlers = { onFilterChange };
    
    render(Notifications.Root, {
      props: { notifications: [], handlers }
    });
    
    await fireEvent.click(screen.getByText('Mentions'));
    
    expect(onFilterChange).toHaveBeenCalledWith('mentions');
  });
});
```

---

## 🔗 Related Components

- [Notifications.Root](./Root.md) - Context provider
- [Notifications.Item](./Item.md) - Individual notification
- [Notifications.Group](./Group.md) - Grouped notifications

---

## 📚 See Also

- [Notifications README](./README.md) - Component overview
- [Timeline Components](../Timeline/README.md)
- [Search Components](../Search/README.md)

