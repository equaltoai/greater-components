# Status.Root

**Component**: Context Provider & Container  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 42 passing tests

---

## 📋 Overview

`Status.Root` is the foundational component for all Status compound components. It creates and provides status context to child components, manages reblog detection, handles root-level interactions, and coordinates the display of individual posts/statuses.

### **Key Features**:
- ✅ **Context Provider** - Provides shared state to child components
- ✅ **Reblog Handling** - Automatically detects and handles boosted posts
- ✅ **Click Handling** - Optional clickable status cards
- ✅ **Keyboard Support** - Enter/Space activation for clickable statuses
- ✅ **Density Modes** - Compact/comfortable display options
- ✅ **Type-Safe** - Full TypeScript support with generic types
- ✅ **Accessible** - Proper ARIA attributes and semantic HTML
- ✅ **Flexible** - Composable with other Status components

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Hello from the fediverse!</p>',
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
    repliesCount: 3,
    reblogged: false,
    favourited: false,
    bookmarked: false
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `status` | `GenericStatus` | - | Yes | Status data to display |
| `config` | `StatusConfig` | `{}` | No | Configuration options |
| `handlers` | `StatusActionHandlers` | `{}` | No | Event handlers for interactions |
| `children` | `Snippet` | - | No | Child components (Header, Content, etc.) |

### StatusConfig

```typescript
interface StatusConfig {
  /**
   * Display density variant
   * @default 'comfortable'
   */
  density?: 'compact' | 'comfortable';

  /**
   * Whether to show action buttons
   * @default true
   */
  showActions?: boolean;

  /**
   * Whether status card is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * Whether to show thread indicators
   * @default true
   */
  showThread?: boolean;

  /**
   * Custom CSS class
   * @default ''
   */
  class?: string;
}
```

### StatusActionHandlers

```typescript
interface StatusActionHandlers {
  /**
   * Called when status is clicked (if clickable)
   */
  onClick?: (status: GenericStatus) => void;

  /**
   * Reply action handler
   */
  onReply?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Boost/reblog action handler
   */
  onBoost?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Favorite/like action handler
   */
  onFavorite?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Share action handler
   */
  onShare?: (status: GenericStatus) => Promise<void> | void;

  /**
   * Bookmark action handler
   */
  onBookmark?: (status: GenericStatus) => Promise<void> | void;
}
```

---

## 💡 Examples

### Example 1: Clickable Status Card

Navigate to status detail when clicked:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  let status: GenericStatus = $state({
    id: '12345',
    content: '<p>Interesting discussion about web standards</p>',
    account: {
      id: '1',
      username: 'webdev',
      displayName: 'WebDev Pro',
      avatar: 'https://example.com/avatar.jpg',
      acct: 'webdev@mastodon.social'
    },
    createdAt: '2025-10-12T10:30:00Z',
    reblogsCount: 42,
    favouritesCount: 156,
    repliesCount: 23,
    reblogged: false,
    favourited: true,
    url: 'https://mastodon.social/@webdev/12345'
  });

  function handleStatusClick(status: GenericStatus) {
    // Navigate to detail view
    window.location.href = `/status/${status.id}`;
  }

  const config = {
    clickable: true,
    density: 'comfortable' as const
  };

  const handlers = {
    onClick: handleStatusClick
  };
</script>

<Status.Root {status} {config} {handlers}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>

<style>
  :global(.status-root--clickable) {
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  :global(.status-root--clickable:hover) {
    background: #f7f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

---

### Example 2: Boosted/Reblogged Status

Display reblogged content with boost indicator:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  // Status that represents a boost/reblog
  const boostedStatus: GenericStatus = {
    id: '1',
    account: {
      id: '1',
      username: 'bob',
      displayName: 'Bob',
      avatar: 'https://example.com/bob.jpg',
      acct: 'bob@mastodon.social'
    },
    createdAt: '2025-10-12T12:00:00Z',
    reblogsCount: 0,
    favouritesCount: 0,
    repliesCount: 0,
    // The original boosted post
    reblog: {
      id: '2',
      content: '<p>This is an amazing article about #Svelte5!</p>',
      account: {
        id: '2',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'https://example.com/alice.jpg',
        acct: 'alice@social.example'
      },
      createdAt: '2025-10-12T10:00:00Z',
      reblogsCount: 50,
      favouritesCount: 150,
      repliesCount: 25,
      mediaAttachments: [
        {
          id: '1',
          type: 'image',
          url: 'https://example.com/article.jpg',
          previewUrl: 'https://example.com/article-preview.jpg',
          description: 'Screenshot of Svelte 5 runes'
        }
      ],
      tags: [{ name: 'Svelte5', url: 'https://mastodon.social/tags/Svelte5' }]
    }
  };

  // Context automatically handles reblog detection
  // - Shows "Bob boosted" indicator
  // - Displays Alice's original content
  // - Interaction counts are from original post
</script>

<Status.Root status={boostedStatus}>
  <!-- Header shows boost indicator + original author -->
  <Status.Header />
  
  <!-- Content is from the original post -->
  <Status.Content />
  
  <!-- Media from original post -->
  <Status.Media />
  
  <!-- Actions affect the original post -->
  <Status.Actions />
</Status.Root>

<style>
  /* Boost indicator styling is automatic */
  :global(.status-header__reblog-indicator) {
    color: #22c55e;
    font-weight: 600;
  }
</style>
```

---

### Example 3: With Optimistic Updates

Instant UI feedback with error rollback:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  let status: GenericStatus = $state({
    id: '1',
    content: '<p>Great post!</p>',
    account: mockAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 10,
    favouritesCount: 25,
    repliesCount: 5,
    reblogged: false,
    favourited: false,
    bookmarked: false
  });

  let isUpdating = $state({
    boost: false,
    favorite: false,
    bookmark: false
  });

  async function handleBoost(s: GenericStatus) {
    // Prevent double-clicks
    if (isUpdating.boost) return;
    isUpdating.boost = true;

    // Store original state for rollback
    const originalBoosted = s.reblogged;
    const originalCount = s.reblogsCount;

    // Optimistic update
    s.reblogged = !s.reblogged;
    s.reblogsCount += s.reblogged ? 1 : -1;

    try {
      const endpoint = s.reblogged ? `/api/statuses/${s.id}/reblog` : `/api/statuses/${s.id}/unreblog`;
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to boost status');
      }

      const data = await response.json();
      
      // Update with server response
      s.reblogged = data.reblogged;
      s.reblogsCount = data.reblogsCount;
    } catch (error) {
      console.error('Boost failed:', error);
      
      // Rollback on error
      s.reblogged = originalBoosted;
      s.reblogsCount = originalCount;
      
      // Show error notification
      alert('Failed to boost post. Please try again.');
    } finally {
      isUpdating.boost = false;
    }
  }

  async function handleFavorite(s: GenericStatus) {
    if (isUpdating.favorite) return;
    isUpdating.favorite = true;

    const originalFavorited = s.favourited;
    const originalCount = s.favouritesCount;

    s.favourited = !s.favourited;
    s.favouritesCount += s.favourited ? 1 : -1;

    try {
      const endpoint = s.favourited ? `/api/statuses/${s.id}/favourite` : `/api/statuses/${s.id}/unfavourite`;
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to favorite status');
      }

      const data = await response.json();
      s.favourited = data.favourited;
      s.favouritesCount = data.favouritesCount;
    } catch (error) {
      console.error('Favorite failed:', error);
      
      s.favourited = originalFavorited;
      s.favouritesCount = originalCount;
      
      alert('Failed to favorite post. Please try again.');
    } finally {
      isUpdating.favorite = false;
    }
  }

  async function handleBookmark(s: GenericStatus) {
    if (isUpdating.bookmark) return;
    isUpdating.bookmark = true;

    const originalBookmarked = s.bookmarked;

    s.bookmarked = !s.bookmarked;

    try {
      const endpoint = s.bookmarked ? `/api/statuses/${s.id}/bookmark` : `/api/statuses/${s.id}/unbookmark`;
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to bookmark status');
      }

      const data = await response.json();
      s.bookmarked = data.bookmarked;
    } catch (error) {
      console.error('Bookmark failed:', error);
      
      s.bookmarked = originalBookmarked;
      
      alert('Failed to bookmark post. Please try again.');
    } finally {
      isUpdating.bookmark = false;
    }
  }

  const handlers = {
    onBoost: handleBoost,
    onFavorite: handleFavorite,
    onBookmark: handleBookmark
  };
</script>

<Status.Root {status} {handlers}>
  <Status.Header />
  <Status.Content />
  <Status.Actions />
</Status.Root>
```

**Optimistic Update Pattern**:
1. Store original state
2. Update UI immediately
3. Call API
4. Update with server response
5. Rollback on error
6. Prevent duplicate requests

---

### Example 4: Compact Display Mode

Show status in compact format:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  let statuses: GenericStatus[] = $state([]);

  // Load statuses
  $effect(() => {
    loadStatuses();
  });

  async function loadStatuses() {
    const response = await fetch('/api/statuses/recent');
    const data = await response.json();
    statuses = data.items;
  }

  const compactConfig = {
    density: 'compact' as const,
    showActions: true
  };
</script>

<div class="compact-status-list">
  <h2>Recent Posts</h2>
  
  {#each statuses as status}
    <Status.Root {status} config={compactConfig}>
      <div class="compact-layout">
        <Status.Header />
        <Status.Content />
        <Status.Actions />
      </div>
    </Status.Root>
  {/each}
</div>

<style>
  .compact-status-list {
    max-width: 400px;
    margin: 0 auto;
  }

  .compact-status-list h2 {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid #e1e8ed;
    font-size: 1rem;
    font-weight: 700;
  }

  .compact-layout {
    font-size: 0.875rem;
  }

  :global(.status-root--compact) {
    padding: 0.75rem;
  }

  :global(.status-root--compact .status-header__avatar-img) {
    width: 32px;
    height: 32px;
  }

  :global(.status-root--compact .status-content) {
    font-size: 0.875rem;
    margin: 0.25rem 0;
  }
</style>
```

---

### Example 5: Custom Status Card with Analytics

Track status visibility and interactions:

```svelte
<script lang="ts">
  import { Status } from '@equaltoai/greater-components-fediverse';
  import type { GenericStatus } from '@equaltoai/greater-components-fediverse/generics';

  let status: GenericStatus = $state(mockStatus());
  let analytics = $state({
    viewed: false,
    viewDuration: 0,
    interactions: 0,
    lastInteraction: null as Date | null
  });

  let viewStartTime: number | null = null;
  let visibilityObserver: IntersectionObserver;

  // Track visibility
  function observeVisibility(element: HTMLElement) {
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!analytics.viewed) {
              analytics.viewed = true;
              trackAnalyticsEvent('status_viewed', {
                statusId: status.id,
                timestamp: new Date().toISOString()
              });
            }
            viewStartTime = Date.now();
          } else if (viewStartTime) {
            const duration = Date.now() - viewStartTime;
            analytics.viewDuration += duration;
            viewStartTime = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    visibilityObserver.observe(element);

    return {
      destroy() {
        visibilityObserver.disconnect();
      }
    };
  }

  function trackInteraction(action: string) {
    analytics.interactions++;
    analytics.lastInteraction = new Date();
    
    trackAnalyticsEvent('status_interaction', {
      statusId: status.id,
      action,
      totalInteractions: analytics.interactions,
      timestamp: new Date().toISOString()
    });
  }

  function trackAnalyticsEvent(event: string, data: Record<string, any>) {
    console.log('Analytics:', event, data);
    
    // Send to analytics service
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event, ...data })
    // });
  }

  const handlers = {
    onReply: (s: GenericStatus) => {
      trackInteraction('reply');
      // Open reply composer
    },
    onBoost: (s: GenericStatus) => {
      trackInteraction('boost');
      // Handle boost
    },
    onFavorite: (s: GenericStatus) => {
      trackInteraction('favorite');
      // Handle favorite
    },
    onClick: (s: GenericStatus) => {
      trackInteraction('click');
      window.location.href = `/status/${s.id}`;
    }
  };
</script>

<div class="tracked-status" use:observeVisibility>
  {#if analytics.viewed}
    <div class="analytics-badge" title="Status viewed">
      👁️ Viewed • {analytics.interactions} interactions
    </div>
  {/if}

  <Status.Root 
    {status} 
    {handlers}
    config={{ clickable: true }}
  >
    <Status.Header />
    <Status.Content />
    <Status.Actions />
  </Status.Root>
</div>

<style>
  .tracked-status {
    position: relative;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }

  .analytics-badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 0.75rem;
    background: rgba(29, 155, 240, 0.1);
    border: 1px solid rgba(29, 155, 240, 0.3);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #1d9bf0;
    z-index: 10;
  }
</style>
```

**Analytics Tracking**:
- ✅ View tracking with IntersectionObserver
- ✅ View duration calculation
- ✅ Interaction counting
- ✅ Event timestamps
- ✅ Ready for analytics service integration

---

## 🎯 Context Creation

Status.Root creates context that child components access:

```typescript
// Internal implementation
const context = createStatusContext(status, config, handlers);

// Context value structure:
{
  status: GenericStatus,           // Original status
  actualStatus: GenericStatus,     // Handles reblog
  account: Account,                // Display account
  isReblog: boolean,               // Whether this is a reblog
  config: StatusConfig,            // Configuration
  handlers: StatusActionHandlers   // Event handlers
}
```

**Reblog Handling**:
- If `status.reblog` exists, `actualStatus` = `status.reblog`
- Otherwise, `actualStatus` = `status`
- Child components use `actualStatus` for display
- This allows automatic boost/reblog support

---

## 🎨 Styling

### CSS Classes

```css
.status-root {
  padding: var(--status-padding, 1rem);
  border-bottom: 1px solid var(--status-border-color, #e1e8ed);
  background: var(--status-bg, white);
  transition: background-color 0.2s;
}

.status-root--compact {
  padding: var(--status-padding-compact, 0.75rem);
}

.status-root--comfortable {
  padding: var(--status-padding-comfortable, 1rem);
}

.status-root--clickable {
  cursor: pointer;
}

.status-root--clickable:hover {
  background: var(--status-bg-hover, #f7f9fa);
}

.status-root--clickable:focus {
  outline: 2px solid var(--status-focus-ring, #3b82f6);
  outline-offset: -2px;
}
```

### Custom Styling

```svelte
<Status.Root {status} config={{ class: 'my-custom-status' }}>
  <!-- Content -->
</Status.Root>

<style>
  :global(.my-custom-status) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 0.5rem;
  }

  :global(.my-custom-status:hover) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
</style>
```

---

## ♿ Accessibility

### Semantic HTML

```html
<article 
  class="status-root"
  role="article"
  tabindex="0"
  aria-label="Post by Alice"
>
  <!-- Status content -->
</article>
```

### Keyboard Support

```svelte
<Status.Root {status} config={{ clickable: true }}>
  <!-- Press Enter or Space to activate -->
</Status.Root>
```

**Keyboard Events**:
- `Enter` - Activate status
- `Space` - Activate status  
- `Tab` - Navigate to next element
- `Shift+Tab` - Navigate to previous element

---

## 🧪 Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Status } from '@equaltoai/greater-components-fediverse';

describe('Status.Root', () => {
  it('renders status content', () => {
    const status = mockStatus({ content: '<p>Test</p>' });
    
    render(Status.Root, { props: { status } });
    
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const status = mockStatus();
    
    render(Status.Root, {
      props: {
        status,
        config: { clickable: true },
        handlers: { onClick }
      }
    });
    
    await fireEvent.click(screen.getByRole('article'));
    
    expect(onClick).toHaveBeenCalledWith(status);
  });

  it('handles keyboard activation', async () => {
    const onClick = vi.fn();
    const status = mockStatus();
    
    render(Status.Root, {
      props: {
        status,
        config: { clickable: true },
        handlers: { onClick }
      }
    });
    
    const article = screen.getByRole('article');
    await fireEvent.keyPress(article, { key: 'Enter' });
    
    expect(onClick).toHaveBeenCalledWith(status);
  });
});
```

---

## 🔗 Related Components

- [Status.Header](./Header.md) - Avatar and author info
- [Status.Content](./Content.md) - Post content
- [Status.Media](./Media.md) - Media attachments
- [Status.Actions](./Actions.md) - Interaction buttons

---

## 📚 See Also

- [Status Components README](./README.md)
- [Timeline.Item](../Timeline/Item.md) - Timeline integration
- [Compound Component Pattern](../../guides/compound-components.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

