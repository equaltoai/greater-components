# Status.Header

**Component**: Header Display  
**Package**: `@greater/fediverse`  
**Status**: Production Ready ✅  
**Tests**: 36 passing tests

---

## 📋 Overview

`Status.Header` displays account information and post metadata for a status. It shows the author's avatar, display name, username, timestamp, and automatically handles reblog indicators when a status is boosted/reblogged.

### **Key Features**:
- ✅ **Account Display** - Avatar, display name, username
- ✅ **Timestamp** - Relative and absolute time display
- ✅ **Reblog Indicator** - Automatic "X boosted" display
- ✅ **Bot Badge** - Identifies bot accounts
- ✅ **Customizable** - Custom avatar, account info, timestamp rendering
- ✅ **Accessible** - Proper ARIA labels and semantic HTML
- ✅ **Responsive** - Adapts to compact/comfortable density modes
- ✅ **Type-Safe** - Full TypeScript support

---

## 📦 Installation

```bash
npm install @greater/fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Hello world!</p>',
    account: {
      id: '1',
      username: 'alice',
      displayName: 'Alice',
      avatar: 'https://example.com/avatar.jpg',
      acct: 'alice@social.example',
      bot: false
    },
    createdAt: '2025-10-12T10:30:00Z',
    reblogsCount: 5,
    favouritesCount: 12,
    repliesCount: 3
  };
</script>

<Status.Root {status}>
  <Status.Header />
  <Status.Content />
</Status.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `avatar` | `Snippet` | Default avatar | No | Custom avatar rendering |
| `accountInfo` | `Snippet` | Default account info | No | Custom account information |
| `timestamp` | `Snippet` | Default timestamp | No | Custom timestamp rendering |
| `class` | `string` | `''` | No | Custom CSS class |

---

## 💡 Examples

### Example 1: Standard Header Display

Basic status header with all default elements:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  const status: GenericStatus = {
    id: '12345',
    content: '<p>Just shipped a new feature! 🚀</p>',
    account: {
      id: '1',
      username: 'developer',
      displayName: 'Dev User',
      avatar: 'https://example.com/avatars/developer.jpg',
      acct: 'developer@mastodon.social',
      bot: false,
      url: 'https://mastodon.social/@developer'
    },
    createdAt: '2025-10-12T10:30:00Z',
    reblogsCount: 15,
    favouritesCount: 42,
    repliesCount: 8
  };
</script>

<div class="status-card">
  <Status.Root {status}>
    <Status.Header />
    <Status.Content />
    <Status.Actions />
  </Status.Root>
</div>

<style>
  .status-card {
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }

  /* Header automatically styles avatar, names, and timestamp */
  :global(.status-header) {
    display: flex;
    gap: 0.75rem;
  }

  :global(.status-header__avatar-img) {
    border-radius: 50%;
    transition: transform 0.2s;
  }

  :global(.status-header__avatar-img:hover) {
    transform: scale(1.05);
  }

  :global(.status-header__display-name) {
    font-weight: 700;
    color: #0f1419;
  }

  :global(.status-header__display-name:hover) {
    text-decoration: underline;
  }

  :global(.status-header__time:hover) {
    text-decoration: underline;
  }
</style>
```

---

### Example 2: Bot Account Display

Display bot accounts with badge:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  const botStatus: GenericStatus = {
    id: '1',
    content: '<p>🤖 Automated weather update: Sunny, 72°F</p>',
    account: {
      id: '100',
      username: 'weatherbot',
      displayName: 'Weather Bot',
      avatar: 'https://example.com/bot-avatar.jpg',
      acct: 'weatherbot@bots.social',
      bot: true, // Bot flag
      url: 'https://bots.social/@weatherbot'
    },
    createdAt: new Date().toISOString(),
    reblogsCount: 0,
    favouritesCount: 5,
    repliesCount: 0
  };
</script>

<Status.Root status={botStatus}>
  <!-- Header automatically shows BOT badge -->
  <Status.Header />
  <Status.Content />
</Status.Root>

<style>
  /* Bot badge is automatically styled */
  :global(.status-header__bot-badge) {
    padding: 2px 6px;
    background: #e0f2fe;
    border: 1px solid #7dd3fc;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    color: #0369a1;
    letter-spacing: 0.5px;
  }
</style>
```

---

### Example 3: Reblogged/Boosted Status Header

Display boost indicator automatically:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  // Status that represents a boost
  const boostedStatus: GenericStatus = {
    id: '1',
    account: {
      id: '1',
      username: 'bob',
      displayName: 'Bob Smith',
      avatar: 'https://example.com/bob.jpg',
      acct: 'bob@mastodon.social'
    },
    createdAt: '2025-10-12T12:00:00Z',
    reblogsCount: 0,
    favouritesCount: 0,
    repliesCount: 0,
    // Original boosted post
    reblog: {
      id: '2',
      content: '<p>Check out this amazing article!</p>',
      account: {
        id: '2',
        username: 'alice',
        displayName: 'Alice Johnson',
        avatar: 'https://example.com/alice.jpg',
        acct: 'alice@social.example'
      },
      createdAt: '2025-10-12T10:00:00Z',
      reblogsCount: 50,
      favouritesCount: 150,
      repliesCount: 25
    }
  };
</script>

<Status.Root status={boostedStatus}>
  <!-- Header shows: -->
  <!-- 1. "Bob Smith boosted" indicator with reblog icon -->
  <!-- 2. Alice's avatar and account info -->
  <!-- 3. Original post timestamp -->
  <Status.Header />
  <Status.Content />
</Status.Root>

<style>
  :global(.status-header__reblog-indicator) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #22c55e;
    font-size: 0.875rem;
    font-weight: 600;
  }

  :global(.status-header__reblog-icon) {
    width: 16px;
    height: 16px;
    color: #22c55e;
  }
</style>
```

---

### Example 4: Custom Avatar with Status Indicator

Add online/offline status to avatar:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  let status = $state(mockStatus());
  let isUserOnline = $state(true);

  // Check online status
  $effect(() => {
    checkUserOnlineStatus(status.account.id);
  });

  async function checkUserOnlineStatus(accountId: string) {
    const response = await fetch(`/api/accounts/${accountId}/status`);
    const data = await response.json();
    isUserOnline = data.online;
  }
</script>

<Status.Root {status}>
  <Status.Header>
    {#snippet avatar()}
      <div class="custom-avatar-wrapper">
        <a
          href={status.account.url}
          class="avatar-link"
          aria-label="View {status.account.displayName || status.account.username}'s profile"
        >
          <img
            src={status.account.avatar}
            alt=""
            class="avatar-img"
            loading="lazy"
            width="48"
            height="48"
          />
          
          {#if isUserOnline}
            <span class="status-indicator status-indicator--online" title="Online"></span>
          {/if}
        </a>
      </div>
    {/snippet}
  </Status.Header>
  
  <Status.Content />
</Status.Root>

<style>
  .custom-avatar-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .avatar-link {
    display: block;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
  }

  .avatar-img {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid white;
  }

  .status-indicator--online {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    animation: pulse-online 2s infinite;
  }

  @keyframes pulse-online {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-indicator--online {
      animation: none;
    }
  }
</style>
```

---

### Example 5: Custom Account Info with Badges

Add verification badges and custom metadata:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  interface ExtendedAccount extends GenericStatus['account'] {
    verified?: boolean;
    supporter?: boolean;
    role?: 'admin' | 'moderator' | 'user';
  }

  const status: GenericStatus = {
    id: '1',
    content: '<p>Important announcement from our team!</p>',
    account: {
      id: '1',
      username: 'admin',
      displayName: 'Site Admin',
      avatar: 'https://example.com/admin.jpg',
      acct: 'admin@social.example',
      verified: true,
      supporter: true,
      role: 'admin'
    } as ExtendedAccount,
    createdAt: new Date().toISOString(),
    reblogsCount: 100,
    favouritesCount: 500,
    repliesCount: 50
  };

  const account = status.account as ExtendedAccount;
</script>

<Status.Root {status}>
  <Status.Header>
    {#snippet accountInfo()}
      <div class="custom-account-info">
        <div class="account-name-row">
          <a href={account.url} class="display-name">
            {account.displayName || account.username}
          </a>
          
          {#if account.verified}
            <span class="badge badge--verified" title="Verified account">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </span>
          {/if}
          
          {#if account.supporter}
            <span class="badge badge--supporter" title="Supporter">💎</span>
          {/if}
          
          {#if account.role === 'admin'}
            <span class="badge badge--role badge--admin" title="Administrator">
              ADMIN
            </span>
          {:else if account.role === 'moderator'}
            <span class="badge badge--role badge--moderator" title="Moderator">
              MOD
            </span>
          {/if}
          
          {#if account.bot}
            <span class="badge badge--bot" title="Bot account">BOT</span>
          {/if}
        </div>
        
        <div class="account-username">
          @{account.acct}
        </div>
      </div>
    {/snippet}
  </Status.Header>
  
  <Status.Content />
</Status.Root>

<style>
  .custom-account-info {
    flex: 1;
    min-width: 0;
  }

  .account-name-row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .display-name {
    font-weight: 700;
    color: #0f1419;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .display-name:hover {
    text-decoration: underline;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.5px;
  }

  .badge--verified {
    background: #dbeafe;
    color: #1d4ed8;
    border: 1px solid #93c5fd;
  }

  .badge--supporter {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1px solid #fbbf24;
  }

  .badge--role {
    text-transform: uppercase;
  }

  .badge--admin {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .badge--moderator {
    background: #e0e7ff;
    color: #3730a3;
    border: 1px solid #a5b4fc;
  }

  .badge--bot {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .account-username {
    color: #536471;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
```

---

### Example 6: Custom Timestamp with Detailed Info

Show detailed timestamp with edit history:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';
  import { formatDateTime } from '@greater/utils';

  const status: GenericStatus = {
    id: '1',
    content: '<p>Updated content with corrections</p>',
    account: mockAccount,
    createdAt: '2025-10-12T10:00:00Z',
    editedAt: '2025-10-12T10:30:00Z',
    edited: true,
    reblogsCount: 10,
    favouritesCount: 25,
    repliesCount: 5
  };

  let showEditHistory = $state(false);

  async function loadEditHistory() {
    showEditHistory = !showEditHistory;
    // Load edit history if needed
  }
</script>

<Status.Root {status}>
  <Status.Header>
    {#snippet timestamp()}
      <div class="custom-timestamp">
        <time 
          class="timestamp-time" 
          datetime={status.createdAt}
          title={formatDateTime(status.createdAt).absolute}
        >
          {formatDateTime(status.createdAt).relative}
        </time>
        
        {#if status.edited && status.editedAt}
          <button 
            class="edited-indicator"
            onclick={loadEditHistory}
            title="View edit history"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Edited
          </button>
        {/if}

        {#if showEditHistory}
          <div class="edit-history-popup">
            <div class="edit-history-header">
              <h3>Edit History</h3>
              <button onclick={() => showEditHistory = false}>✕</button>
            </div>
            <div class="edit-history-items">
              <div class="edit-history-item">
                <time>{formatDateTime(status.editedAt!).absolute}</time>
                <span>Latest edit</span>
              </div>
              <div class="edit-history-item">
                <time>{formatDateTime(status.createdAt).absolute}</time>
                <span>Original post</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/snippet}
  </Status.Header>
  
  <Status.Content />
</Status.Root>

<style>
  .custom-timestamp {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .timestamp-time {
    color: #536471;
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;
  }

  .timestamp-time:hover {
    text-decoration: underline;
  }

  .edited-indicator {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 2px 6px;
    background: #f7f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #536471;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edited-indicator:hover {
    background: #e1e8ed;
    border-color: #cbd5e0;
  }

  .edit-history-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    width: 300px;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  .edit-history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e1e8ed;
  }

  .edit-history-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  .edit-history-header button {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: #536471;
    cursor: pointer;
    font-size: 1.25rem;
  }

  .edit-history-items {
    padding: 0.5rem;
  }

  .edit-history-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .edit-history-item:hover {
    background: #f7f9fa;
  }

  .edit-history-item time {
    font-size: 0.875rem;
    color: #0f1419;
    font-weight: 600;
  }

  .edit-history-item span {
    font-size: 0.75rem;
    color: #536471;
  }
</style>
```

---

### Example 7: Compact Mode Header

Optimized header for compact display:

```svelte
<script lang="ts">
  import { Status } from '@greater/fediverse';
  import type { GenericStatus } from '@greater/fediverse/generics';

  let statuses: GenericStatus[] = $state([]);

  const compactConfig = {
    density: 'compact' as const
  };
</script>

<div class="compact-timeline">
  {#each statuses as status}
    <Status.Root {status} config={compactConfig}>
      <Status.Header class="compact-header" />
      <Status.Content />
    </Status.Root>
  {/each}
</div>

<style>
  .compact-timeline {
    max-width: 400px;
  }

  /* Compact mode automatically adjusts sizes */
  :global(.status-root--compact .status-header__avatar-img) {
    width: 32px !important;
    height: 32px !important;
  }

  :global(.status-root--compact .status-header__display-name) {
    font-size: 0.875rem;
  }

  :global(.status-root--compact .status-header__username) {
    font-size: 0.75rem;
  }

  :global(.status-root--compact .status-header__time) {
    font-size: 0.75rem;
  }

  :global(.compact-header) {
    margin-bottom: 0.5rem;
  }
</style>
```

---

## 🎨 Styling

### CSS Custom Properties

```css
.status-header {
  /* Spacing */
  --status-spacing-xs: 0.25rem;
  --status-spacing-sm: 0.5rem;
  
  /* Text colors */
  --status-text-primary: #0f1419;
  --status-text-secondary: #536471;
  
  /* Background colors */
  --status-bg-secondary: #f7f9fa;
  
  /* Borders */
  --status-border-color: #e1e8ed;
  
  /* Typography */
  --status-font-size-sm: 0.875rem;
  --status-font-size-xs: 0.75rem;
  
  /* Focus ring */
  --status-focus-ring: #3b82f6;
  
  /* Border radius */
  --status-radius-xs: 2px;
}
```

### Default Styles

```css
.status-header {
  display: flex;
  flex-direction: column;
  gap: var(--status-spacing-sm, 0.5rem);
}

.status-header__reblog-indicator {
  display: flex;
  align-items: center;
  gap: var(--status-spacing-xs, 0.25rem);
  margin-left: calc(48px + var(--status-spacing-sm, 0.5rem));
  color: var(--status-text-secondary, #536471);
  font-size: var(--status-font-size-sm, 0.875rem);
}

.status-header__main {
  display: flex;
  align-items: flex-start;
  gap: var(--status-spacing-sm, 0.5rem);
}

.status-header__avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.status-header__display-name {
  font-weight: 600;
  color: var(--status-text-primary, #0f1419);
  text-decoration: none;
}

.status-header__username {
  color: var(--status-text-secondary, #536471);
  font-size: var(--status-font-size-sm, 0.875rem);
}

.status-header__time {
  color: var(--status-text-secondary, #536471);
  font-size: var(--status-font-size-sm, 0.875rem);
}
```

---

## ♿ Accessibility

### Semantic HTML

```html
<div class="status-header">
  <!-- Reblog indicator (if applicable) -->
  <div class="status-header__reblog-indicator">
    <svg aria-hidden="true"><!-- Icon --></svg>
    <span>Bob Smith boosted</span>
  </div>

  <div class="status-header__main">
    <!-- Avatar with proper link -->
    <a 
      href="/profile" 
      aria-label="View Alice's profile"
    >
      <img src="avatar.jpg" alt="" />
    </a>

    <!-- Account info -->
    <div class="status-header__account">
      <a href="/profile">Alice</a>
      <span class="status-header__bot-badge" aria-label="Bot account">
        BOT
      </span>
    </div>

    <!-- Timestamp -->
    <time datetime="2025-10-12T10:30:00Z" title="October 12, 2025 at 10:30 AM">
      5 minutes ago
    </time>
  </div>
</div>
```

**Accessibility Features**:
- ✅ Proper link labels for avatars
- ✅ ARIA labels for badges
- ✅ Semantic `<time>` element
- ✅ ISO datetime attribute
- ✅ Absolute timestamp in title
- ✅ Empty alt for decorative avatars
- ✅ Focus states on links

---

## 🧪 Testing

```typescript
import { render, screen } from '@testing-library/svelte';
import { Status } from '@greater/fediverse';

describe('Status.Header', () => {
  it('renders account information', () => {
    const status = mockStatus({
      account: {
        id: '1',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'avatar.jpg',
        acct: 'alice@social.example'
      }
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('@alice@social.example')).toBeInTheDocument();
  });

  it('shows bot badge for bot accounts', () => {
    const status = mockStatus({
      account: { ...mockAccount, bot: true }
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText('BOT')).toBeInTheDocument();
  });

  it('shows reblog indicator', () => {
    const status = mockStatus({
      account: mockAccount,
      reblog: mockStatus({
        account: { ...mockAccount, displayName: 'Original Author' }
      })
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText(/boosted/)).toBeInTheDocument();
  });

  it('renders relative timestamp', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const status = mockStatus({
      createdAt: fiveMinutesAgo.toISOString()
    });

    render(Status.Root, { props: { status } });

    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Status.Root](./Root.md) - Status context provider
- [Status.Content](./Content.md) - Post content
- [Status.Actions](./Actions.md) - Interaction buttons

---

## 📚 See Also

- [Status Components README](./README.md)
- [Date Formatting Utils](../../guides/date-formatting.md)
- [Avatar Best Practices](../../guides/avatars.md)

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0

