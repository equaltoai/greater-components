# Timeline.Item

**Component**: Item Wrapper  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 38 passing tests

---

## 📋 Overview

`Timeline.Item` is a wrapper component for individual timeline items. It provides consistent styling, accessibility attributes, event handling, and integration with the Timeline context. This component bridges the gap between the timeline container and the actual content (typically Status components).

### **Key Features**:
- ✅ **Context Integration** - Accesses Timeline.Root context automatically
- ✅ **Event Handling** - Handles item clicks with built-in delegation
- ✅ **Accessibility** - ARIA attributes for screen readers
- ✅ **Styling** - Consistent borders, spacing, and hover effects
- ✅ **Focus Management** - Keyboard navigation support
- ✅ **Custom Content** - Flexible children rendering
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Performance** - Minimal re-renders with proper reactivity

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
| `item` | `GenericTimelineItem` | - | Yes | Timeline item data to display |
| `index` | `number` | - | Yes | Index of item in timeline (for ARIA) |
| `children` | `Snippet` | - | No | Child content (typically Status.Root) |
| `class` | `string` | `''` | No | Custom CSS class to apply |

---

## 📐 Type Definitions

### GenericTimelineItem

```typescript
interface GenericTimelineItem {
  /**
   * Unique identifier for the status
   */
  id: string;

  /**
   * HTML content of the status
   */
  content: string;

  /**
   * Account that created the status
   */
  account: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    acct: string;
    bot?: boolean;
    url?: string;
  };

  /**
   * ISO 8601 timestamp
   */
  createdAt: string;

  /**
   * Interaction counts
   */
  reblogsCount: number;
  favouritesCount: number;
  repliesCount: number;

  /**
   * User's interaction state
   */
  reblogged?: boolean;
  favourited?: boolean;
  bookmarked?: boolean;

  /**
   * Optional fields
   */
  reblog?: GenericTimelineItem;
  inReplyToId?: string | null;
  inReplyToAccountId?: string | null;
  sensitive?: boolean;
  spoilerText?: string;
  visibility?: 'public' | 'unlisted' | 'private' | 'direct';
  mediaAttachments?: MediaAttachment[];
  mentions?: Mention[];
  tags?: Tag[];
  emojis?: CustomEmoji[];
  card?: Card;
  poll?: Poll;
  application?: Application;
  language?: string;
  edited?: boolean;
  editedAt?: string;
}
```

---

## 💡 Examples

### Example 1: Basic Timeline Item

Standard timeline item with Status content:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([
    {
      id: '12345',
      content: '<p>Just deployed a new feature! 🚀</p>',
      account: {
        id: '1',
        username: 'developer',
        displayName: 'Dev User',
        avatar: 'https://example.com/avatar.jpg',
        acct: 'developer@mastodon.social'
      },
      createdAt: '2025-10-12T10:30:00Z',
      reblogsCount: 15,
      favouritesCount: 42,
      repliesCount: 8,
      reblogged: false,
      favourited: true,
      sensitive: false,
      visibility: 'public'
    }
  ]);

  function handleItemClick(item: GenericTimelineItem, index: number) {
    console.log(`Clicked item ${item.id} at position ${index}`);
    // Navigate to detail view
    window.location.href = `/status/${item.id}`;
  }
</script>

<Timeline.Root 
  {items}
  handlers={{ onItemClick: handleItemClick }}
>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <Status.Root 
        status={item}
        handlers={{
          onReply: () => console.log('Reply'),
          onBoost: () => console.log('Boost'),
          onFavorite: () => console.log('Favorite')
        }}
      >
        <Status.Header />
        <Status.Content />
        <Status.Actions />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>

<style>
  :global(.timeline-item) {
    transition: transform 0.2s;
  }

  :global(.timeline-item:hover) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

---

### Example 2: Timeline with Custom Item Styling

Custom styling for different item types:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([
    // Regular post
    {
      id: '1',
      content: 'Regular post',
      account: mockAccount,
      createdAt: new Date().toISOString(),
      reblogsCount: 5,
      favouritesCount: 10,
      repliesCount: 2
    },
    // Boosted post
    {
      id: '2',
      content: '',
      account: mockAccount,
      createdAt: new Date().toISOString(),
      reblogsCount: 0,
      favouritesCount: 0,
      repliesCount: 0,
      reblog: {
        id: '2-reblog',
        content: 'This is a boosted post!',
        account: {
          id: '2',
          username: 'alice',
          displayName: 'Alice',
          avatar: 'https://example.com/alice.jpg',
          acct: 'alice@social.example'
        },
        createdAt: new Date().toISOString(),
        reblogsCount: 25,
        favouritesCount: 50,
        repliesCount: 10
      }
    },
    // Sensitive content
    {
      id: '3',
      content: 'Sensitive content here',
      account: mockAccount,
      createdAt: new Date().toISOString(),
      reblogsCount: 1,
      favouritesCount: 3,
      repliesCount: 0,
      sensitive: true,
      spoilerText: 'CW: Spoilers'
    }
  ]);

  function getItemClass(item: GenericTimelineItem): string {
    const classes = ['timeline-item'];
    
    if (item.reblog) {
      classes.push('timeline-item--boosted');
    }
    
    if (item.sensitive) {
      classes.push('timeline-item--sensitive');
    }
    
    if (item.favourited) {
      classes.push('timeline-item--favorited');
    }
    
    return classes.join(' ');
  }
</script>

<Timeline.Root {items}>
  {#each items as item, index}
    <Timeline.Item 
      {item} 
      {index}
      class={getItemClass(item)}
    >
      <Status.Root status={item}>
        <Status.Header />
        <Status.Content />
        <Status.Media />
        <Status.Actions />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>

<style>
  :global(.timeline-item--boosted) {
    background: #f0f9ff;
    border-left: 3px solid #0ea5e9;
  }

  :global(.timeline-item--sensitive) {
    background: #fef2f2;
    border-left: 3px solid #ef4444;
  }

  :global(.timeline-item--favorited) {
    background: #fef3c7;
  }

  :global(.timeline-item--boosted:hover) {
    background: #e0f2fe;
  }

  :global(.timeline-item--sensitive:hover) {
    background: #fee2e2;
  }

  :global(.timeline-item--favorited:hover) {
    background: #fde68a;
  }
</style>
```

---

### Example 3: Timeline with Custom Content

Using custom content instead of Status components:

```svelte
<script lang="ts">
  import { Timeline } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  interface NotificationItem extends GenericTimelineItem {
    type: 'follow' | 'mention' | 'reblog' | 'favourite';
    notificationAccount?: typeof GenericTimelineItem.account;
  }

  let notifications: NotificationItem[] = $state([
    {
      id: '1',
      type: 'follow',
      content: '',
      account: {
        id: '1',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'https://example.com/alice.jpg',
        acct: 'alice@social.example'
      },
      createdAt: new Date().toISOString(),
      reblogsCount: 0,
      favouritesCount: 0,
      repliesCount: 0
    },
    {
      id: '2',
      type: 'favourite',
      content: 'Your post was great!',
      account: {
        id: '2',
        username: 'bob',
        displayName: 'Bob',
        avatar: 'https://example.com/bob.jpg',
        acct: 'bob@mastodon.social'
      },
      createdAt: new Date().toISOString(),
      reblogsCount: 0,
      favouritesCount: 0,
      repliesCount: 0
    }
  ]);

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'follow':
        return '👤';
      case 'mention':
        return '💬';
      case 'reblog':
        return '🔁';
      case 'favourite':
        return '⭐';
      default:
        return '📢';
    }
  }

  function getNotificationMessage(notification: NotificationItem) {
    const name = notification.account.displayName || notification.account.username;
    
    switch (notification.type) {
      case 'follow':
        return `${name} followed you`;
      case 'mention':
        return `${name} mentioned you`;
      case 'reblog':
        return `${name} boosted your post`;
      case 'favourite':
        return `${name} favourited your post`;
      default:
        return `${name} sent you a notification`;
    }
  }
</script>

<div class="notifications-timeline">
  <h2>Notifications</h2>
  
  <Timeline.Root items={notifications}>
    {#each notifications as notification, index}
      <Timeline.Item item={notification} {index} class="notification-item">
        <div class="notification-content">
          <div class="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div class="notification-body">
            <img 
              src={notification.account.avatar} 
              alt={notification.account.displayName}
              class="notification-avatar"
            />
            
            <div class="notification-text">
              <p class="notification-message">
                {getNotificationMessage(notification)}
              </p>
              
              {#if notification.content}
                <div class="notification-preview">
                  {@html notification.content}
                </div>
              {/if}
              
              <time class="notification-time">
                {new Date(notification.createdAt).toLocaleString()}
              </time>
            </div>
          </div>
        </div>
      </Timeline.Item>
    {/each}
  </Timeline.Root>
</div>

<style>
  .notifications-timeline {
    max-width: 600px;
    margin: 0 auto;
  }

  .notifications-timeline h2 {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid #e1e8ed;
    background: white;
    font-size: 1.25rem;
    font-weight: 700;
  }

  :global(.notification-item) {
    cursor: pointer;
  }

  .notification-content {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  .notification-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .notification-body {
    display: flex;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .notification-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .notification-text {
    flex: 1;
    min-width: 0;
  }

  .notification-message {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    color: #0f1419;
  }

  .notification-preview {
    margin: 0.5rem 0;
    padding: 0.5rem;
    background: #f7f9fa;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #536471;
  }

  .notification-time {
    font-size: 0.875rem;
    color: #536471;
  }
</style>
```

---

### Example 4: Timeline with Interaction Tracking

Track and visualize user interactions:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);
  let viewedItems = $state(new Set<string>());
  let interactedItems = $state(new Set<string>());

  // Track when items enter viewport
  function observeItem(element: HTMLElement, itemId: string) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Mark as viewed
            viewedItems.add(itemId);
            viewedItems = viewedItems; // Trigger reactivity
            
            // Track analytics
            trackItemView(itemId);
          }
        });
      },
      { threshold: 0.5 } // 50% visible
    );

    observer.observe(element);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  function trackItemView(itemId: string) {
    // Send analytics event
    console.log('Item viewed:', itemId);
    
    // Could send to analytics service
    // analytics.track('timeline_item_viewed', { itemId });
  }

  function handleItemClick(item: GenericTimelineItem) {
    interactedItems.add(item.id);
    interactedItems = interactedItems;
    
    // Track click
    console.log('Item clicked:', item.id);
  }

  function isViewed(itemId: string): boolean {
    return viewedItems.has(itemId);
  }

  function isInteracted(itemId: string): boolean {
    return interactedItems.has(itemId);
  }

  // Load sample data
  $effect(() => {
    items = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      content: `Post #${i + 1} content here`,
      account: {
        id: `${i + 1}`,
        username: `user${i + 1}`,
        displayName: `User ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        acct: `user${i + 1}@mastodon.social`
      },
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      reblogsCount: Math.floor(Math.random() * 20),
      favouritesCount: Math.floor(Math.random() * 50),
      repliesCount: Math.floor(Math.random() * 10)
    }));
  });
</script>

<div class="tracked-timeline">
  <div class="stats-panel">
    <div class="stat">
      <span class="stat-label">Total Items:</span>
      <span class="stat-value">{items.length}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Viewed:</span>
      <span class="stat-value">{viewedItems.size}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Interacted:</span>
      <span class="stat-value">{interactedItems.size}</span>
    </div>
    <div class="stat">
      <span class="stat-label">View Rate:</span>
      <span class="stat-value">
        {items.length > 0 ? Math.round((viewedItems.size / items.length) * 100) : 0}%
      </span>
    </div>
  </div>

  <Timeline.Root 
    {items}
    handlers={{ onItemClick: handleItemClick }}
  >
    {#each items as item, index}
      {@const viewed = isViewed(item.id)}
      {@const interacted = isInteracted(item.id)}
      
      <Timeline.Item 
        {item} 
        {index}
        class="tracked-item"
        class:tracked-item--viewed={viewed}
        class:tracked-item--interacted={interacted}
      >
        <div use:observeItem={item.id}>
          <div class="item-badges">
            {#if viewed}
              <span class="badge badge--viewed" title="Viewed">👁️</span>
            {/if}
            {#if interacted}
              <span class="badge badge--interacted" title="Interacted">✓</span>
            {/if}
          </div>

          <Status.Root status={item}>
            <Status.Header />
            <Status.Content />
            <Status.Actions />
          </Status.Root>
        </div>
      </Timeline.Item>
    {/each}
  </Timeline.Root>
</div>

<style>
  .tracked-timeline {
    max-width: 600px;
    margin: 0 auto;
  }

  .stats-panel {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f7f9fa;
    border-bottom: 1px solid #e1e8ed;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    gap: 0.5rem;
  }

  .stat-label {
    color: #536471;
    font-size: 0.875rem;
  }

  .stat-value {
    color: #0f1419;
    font-weight: 700;
    font-size: 0.875rem;
  }

  :global(.tracked-item) {
    position: relative;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  :global(.tracked-item--viewed) {
    opacity: 1;
  }

  :global(.tracked-item--interacted) {
    background: #f0fdf4;
    border-left: 3px solid #22c55e;
  }

  .item-badges {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
    z-index: 10;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 0.75rem;
  }

  .badge--viewed {
    background: #dbeafe;
  }

  .badge--interacted {
    background: #dcfce7;
  }
</style>
```

**Interaction Tracking Features**:
- ✅ Viewport visibility detection with IntersectionObserver
- ✅ View and click tracking
- ✅ Visual indicators for viewed/interacted items
- ✅ Real-time statistics panel
- ✅ Analytics integration ready

---

### Example 5: Timeline with Grouped Items

Group timeline items by date:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';
  import type { GenericTimelineItem } from '@greater/fediverse/generics';

  let items: GenericTimelineItem[] = $state([]);

  // Group items by date
  type GroupedItems = {
    [date: string]: {
      label: string;
      items: GenericTimelineItem[];
    };
  };

  const groupedItems = $derived.by(() => {
    const groups: GroupedItems = {};
    
    items.forEach(item => {
      const date = new Date(item.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          label: formatDateLabel(date),
          items: []
        };
      }
      
      groups[dateKey].items.push(item);
    });
    
    return groups;
  });

  function formatDateLabel(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  // Load sample data with various dates
  $effect(() => {
    items = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(i / 5)); // Group by date
      date.setHours(date.getHours() - (i % 5));
      
      return {
        id: `${i + 1}`,
        content: `Post #${i + 1} from ${date.toLocaleString()}`,
        account: {
          id: `${(i % 10) + 1}`,
          username: `user${(i % 10) + 1}`,
          displayName: `User ${(i % 10) + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${(i % 10) + 1}`,
          acct: `user${(i % 10) + 1}@mastodon.social`
        },
        createdAt: date.toISOString(),
        reblogsCount: Math.floor(Math.random() * 20),
        favouritesCount: Math.floor(Math.random() * 50),
        repliesCount: Math.floor(Math.random() * 10)
      };
    });
  });

  // Flatten grouped items for Timeline
  const flattenedItems = $derived(
    Object.values(groupedItems).flatMap(group => group.items)
  );

  let globalIndex = 0;
</script>

<div class="grouped-timeline">
  <Timeline.Root items={flattenedItems}>
    {#each Object.entries(groupedItems) as [dateKey, group]}
      <div class="date-separator" role="presentation">
        <span class="date-label">{group.label}</span>
      </div>

      {#each group.items as item}
        {@const index = globalIndex++}
        
        <Timeline.Item {item} {index}>
          <Status.Root status={item}>
            <Status.Header />
            <Status.Content />
            <Status.Media />
            <Status.Actions />
          </Status.Root>
        </Timeline.Item>
      {/each}
    {/each}
  </Timeline.Root>
</div>

<style>
  .grouped-timeline {
    max-width: 600px;
    margin: 0 auto;
  }

  .date-separator {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e1e8ed;
  }

  .date-label {
    padding: 0.25rem 1rem;
    background: #1d9bf0;
    color: white;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
  }
</style>
```

**Grouping Features**:
- ✅ Group items by date (Today, Yesterday, specific dates)
- ✅ Sticky date separators
- ✅ Automatic date formatting
- ✅ Maintains proper ARIA indexes

---

## 🎯 Event Handling

### Click Events

Timeline.Item automatically handles clicks while avoiding conflicts with interactive elements:

```svelte
<script lang="ts">
  import { Timeline, Status } from '@greater/fediverse';

  const handlers = {
    onItemClick: (item, index) => {
      // Only triggered when clicking non-interactive areas
      console.log('Navigate to status:', item.id);
      window.location.href = `/status/${item.id}`;
    }
  };
</script>

<Timeline.Root {items} {handlers}>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <Status.Root status={item}>
        <!-- Clicking buttons/links won't trigger onItemClick -->
        <Status.Header />
        <Status.Actions />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>
```

**Event Delegation**:
- Clicks on `<a>` tags are not propagated
- Clicks on `<button>` elements are not propagated
- Clicks on any element inside `<a>` or `<button>` are not propagated
- Only clicks on the item background trigger `onItemClick`

---

## 🎨 Styling

### CSS Classes

Timeline.Item automatically applies classes based on state:

```css
.timeline-item {
  /* Base styles */
  width: 100%;
  border-bottom: 1px solid var(--timeline-border, #e1e8ed);
  background: var(--timeline-item-bg, white);
  transition: background-color 0.2s;
}

.timeline-item:hover {
  background: var(--timeline-item-hover-bg, #f7f9fa);
}

.timeline-item:focus-within {
  outline: 2px solid var(--timeline-focus-ring, #3b82f6);
  outline-offset: -2px;
}

.timeline-item:last-child {
  border-bottom: none;
}
```

### Custom Styling

```svelte
<Timeline.Item item={item} index={index} class="my-custom-item">
  <!-- Content -->
</Timeline.Item>

<style>
  :global(.my-custom-item) {
    padding: 2rem;
    border-radius: 8px;
    margin: 0.5rem;
  }

  :global(.my-custom-item:hover) {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

---

## ♿ Accessibility

### ARIA Attributes

Timeline.Item automatically provides accessibility attributes:

```html
<article
  class="timeline-item"
  role="article"
  aria-posinset="1"
  aria-setsize="100"
  data-index="0"
  data-status-id="12345"
>
  <!-- Content -->
</article>
```

**ARIA Attributes**:
- `role="article"` - Identifies item as an article
- `aria-posinset` - Position in set (1-based)
- `aria-setsize` - Total number of items
- `data-index` - Zero-based index (for developers)
- `data-status-id` - Unique identifier

### Screen Reader Announcements

```svelte
<Timeline.Root {items}>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <!-- Screen reader announces: "Article 1 of 100" -->
      <Status.Root status={item}>
        <Status.Header />
        <Status.Content />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>
```

---

## ⚡ Performance

### Minimize Re-renders

Timeline.Item is optimized to minimize unnecessary re-renders:

```svelte
<script lang="ts">
  // ✅ Good - Item only re-renders when item or index changes
  {#each items as item, index (item.id)}
    <Timeline.Item {item} {index}>
      <!-- Content -->
    </Timeline.Item>
  {/each}

  // ❌ Bad - Missing key causes unnecessary re-renders
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <!-- Content -->
    </Timeline.Item>
  {/each}
</script>
```

### Virtual Scrolling Integration

Timeline.Item works seamlessly with virtual scrolling:

```svelte
<Timeline.Root 
  {items}
  config={{ 
    virtualized: true,
    estimatedItemHeight: 200
  }}
>
  {#each items as item, index}
    <Timeline.Item {item} {index}>
      <!-- Only visible items are rendered -->
    </Timeline.Item>
  {/each}
</Timeline.Root>
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Timeline } from '@greater/fediverse';

describe('Timeline.Item', () => {
  it('renders item content', () => {
    const item = {
      id: '1',
      content: 'Test post',
      account: mockAccount,
      createdAt: new Date().toISOString(),
      reblogsCount: 0,
      favouritesCount: 0,
      repliesCount: 0
    };

    render(TimelineWithItem, { props: { items: [item] } });

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('Test post')).toBeInTheDocument();
  });

  it('calls onItemClick when clicked', async () => {
    const onItemClick = vi.fn();
    const item = mockItem();

    render(TimelineWithItem, {
      props: {
        items: [item],
        handlers: { onItemClick }
      }
    });

    const article = screen.getByRole('article');
    await fireEvent.click(article);

    expect(onItemClick).toHaveBeenCalledWith(item, 0);
  });

  it('does not call onItemClick when clicking links', async () => {
    const onItemClick = vi.fn();
    const item = mockItem();

    render(TimelineWithLink, {
      props: {
        items: [item],
        handlers: { onItemClick }
      }
    });

    const link = screen.getByRole('link');
    await fireEvent.click(link);

    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('has correct ARIA attributes', () => {
    const items = [mockItem(), mockItem(), mockItem()];

    render(TimelineWithItem, { props: { items } });

    const articles = screen.getAllByRole('article');
    
    expect(articles[0]).toHaveAttribute('aria-posinset', '1');
    expect(articles[0]).toHaveAttribute('aria-setsize', '3');
    
    expect(articles[1]).toHaveAttribute('aria-posinset', '2');
    expect(articles[2]).toHaveAttribute('aria-posinset', '3');
  });
});
```

---

## 🔗 Related Components

- [Timeline.Root](./Root.md) - Timeline context provider
- [Timeline.LoadMore](./LoadMore.md) - Load more trigger
- [Timeline.EmptyState](./EmptyState.md) - Empty state display
- [Status.Root](../Status/Root.md) - Status context provider

---

## 📚 See Also

- [Timeline Components README](./README.md)
- [Status Components README](../Status/README.md)
- [Accessibility Guide](../../guides/accessibility.md)
- [Performance Optimization](../../guides/performance.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

