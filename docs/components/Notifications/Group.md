# Notifications.Group

**Component**: Grouped Notification Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 15 passing tests

---

## 📋 Overview

`Notifications.Group` displays multiple similar notifications grouped together, providing a condensed view when multiple users perform the same action (e.g., "Alice, Bob, and 3 others liked your post"). It intelligently formats account names, displays stacked avatars, and provides expandable grouped content.

### **Key Features**:
- ✅ Intelligent grouping of similar notifications
- ✅ Stacked avatar display for multiple accounts
- ✅ Smart account name formatting ("Alice", "Alice and Bob", "Alice and 2 others")
- ✅ Type-specific icons and text
- ✅ Unread state indicators
- ✅ Expandable group content
- ✅ Timestamp display from latest notification
- ✅ Status content preview for relevant groups
- ✅ Click handlers for navigation
- ✅ Customizable rendering via snippets
- ✅ Accessibility-first design
- ✅ Responsive layout

---

## 📦 Installation

```bash
npm install @equaltoai/greater-components-fediverse
```

---

## 🚀 Basic Usage

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import { groupNotifications } from '@equaltoai/greater-components-fediverse/utils';
  
  const notifications = [
    // Multiple favorites on same post
    { id: '1', type: 'favourite', account: { id: 'u1', username: 'alice', displayName: 'Alice' }, status: { id: 's1' } },
    { id: '2', type: 'favourite', account: { id: 'u2', username: 'bob', displayName: 'Bob' }, status: { id: 's1' } },
    { id: '3', type: 'favourite', account: { id: 'u3', username: 'carol', displayName: 'Carol' }, status: { id: 's1' } }
  ];
  
  const groups = groupNotifications(notifications, {
    timeWindow: 300000, // 5 minutes
    groupableTypes: ['favourite', 'reblog', 'follow']
  });
  
  const handlers = {
    onGroupClick: (group) => {
      console.log('Group clicked:', group);
      // Navigate to the related status or expanded view
      if (group.notifications[0]?.status) {
        window.location.href = `/status/${group.notifications[0].status.id}`;
      }
    }
  };
</script>

<Notifications.Root 
  {notifications} 
  {groups} 
  {handlers}
  config={{ mode: 'grouped', enableGrouping: true }}
>
  {#each groups as group (group.id)}
    <Notifications.Group {group} />
  {/each}
</Notifications.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `group` | `NotificationGroup` | - | **Yes** | Grouped notification data |
| `children` | `Snippet` | - | No | Custom content rendering |
| `class` | `string` | `''` | No | Additional CSS class |

### **NotificationGroup Interface**

```typescript
interface NotificationGroup {
  /**
   * Unique identifier for the group
   */
  id: string;

  /**
   * Notification type (all notifications in group have same type)
   */
  type: NotificationType;

  /**
   * Array of notifications in this group
   */
  notifications: Notification[];

  /**
   * Array of unique accounts involved
   */
  accounts: Account[];

  /**
   * Sample notification (typically the first one)
   */
  sampleNotification: Notification;

  /**
   * Total count of notifications in group
   */
  count: number;

  /**
   * Timestamp of the latest notification
   */
  latestCreatedAt: string | Date;

  /**
   * Whether all notifications in group are read
   */
  allRead: boolean;
}
```

---

## 📤 Events

The component automatically calls handlers from the parent `Notifications.Root` context:

| Event | Handler | Parameters | Description |
|-------|---------|------------|-------------|
| Click | `onGroupClick(group)` | `group: NotificationGroup` | Called when group is clicked |

---

## 💡 Examples

### Example 1: Basic Grouped Notifications

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification, NotificationGroup } from '@equaltoai/greater-components-fediverse/types';

  // Simulate grouped notifications
  let notifications = $state<Notification[]>([
    // Group 1: Multiple people favorited the same post
    {
      id: '1',
      type: 'favourite',
      createdAt: '2025-10-12T10:05:00Z',
      account: {
        id: 'user1',
        username: 'alice',
        displayName: 'Alice Smith',
        avatar: 'https://cdn.example.com/avatars/alice.jpg'
      },
      status: {
        id: 'status1',
        content: '<p>Check out my latest blog post about ActivityPub!</p>',
        createdAt: '2025-10-11T12:00:00Z'
      },
      read: false
    },
    {
      id: '2',
      type: 'favourite',
      createdAt: '2025-10-12T10:03:00Z',
      account: {
        id: 'user2',
        username: 'bob',
        displayName: 'Bob Jones',
        avatar: 'https://cdn.example.com/avatars/bob.jpg'
      },
      status: {
        id: 'status1',
        content: '<p>Check out my latest blog post about ActivityPub!</p>',
        createdAt: '2025-10-11T12:00:00Z'
      },
      read: false
    },
    {
      id: '3',
      type: 'favourite',
      createdAt: '2025-10-12T10:01:00Z',
      account: {
        id: 'user3',
        username: 'carol',
        displayName: 'Carol Davis',
        avatar: 'https://cdn.example.com/avatars/carol.jpg'
      },
      status: {
        id: 'status1',
        content: '<p>Check out my latest blog post about ActivityPub!</p>',
        createdAt: '2025-10-11T12:00:00Z'
      },
      read: false
    },
    
    // Group 2: Multiple people boosted another post
    {
      id: '4',
      type: 'reblog',
      createdAt: '2025-10-12T09:55:00Z',
      account: {
        id: 'user4',
        username: 'dave',
        displayName: 'Dave Wilson',
        avatar: 'https://cdn.example.com/avatars/dave.jpg'
      },
      status: {
        id: 'status2',
        content: '<p>The Fediverse is amazing! 🚀</p>',
        createdAt: '2025-10-10T15:00:00Z'
      },
      read: true
    },
    {
      id: '5',
      type: 'reblog',
      createdAt: '2025-10-12T09:53:00Z',
      account: {
        id: 'user5',
        username: 'eve',
        displayName: 'Eve Anderson',
        avatar: 'https://cdn.example.com/avatars/eve.jpg'
      },
      status: {
        id: 'status2',
        content: '<p>The Fediverse is amazing! 🚀</p>',
        createdAt: '2025-10-10T15:00:00Z'
      },
      read: true
    },
    
    // Group 3: Multiple new followers
    {
      id: '6',
      type: 'follow',
      createdAt: '2025-10-12T09:50:00Z',
      account: {
        id: 'user6',
        username: 'frank',
        displayName: 'Frank Miller',
        avatar: 'https://cdn.example.com/avatars/frank.jpg'
      },
      read: false
    },
    {
      id: '7',
      type: 'follow',
      createdAt: '2025-10-12T09:48:00Z',
      account: {
        id: 'user7',
        username: 'grace',
        displayName: 'Grace Lee',
        avatar: 'https://cdn.example.com/avatars/grace.jpg'
      },
      read: false
    },
    {
      id: '8',
      type: 'follow',
      createdAt: '2025-10-12T09:46:00Z',
      account: {
        id: 'user8',
        username: 'henry',
        displayName: 'Henry Chen',
        avatar: 'https://cdn.example.com/avatars/henry.jpg'
      },
      read: false
    },
    {
      id: '9',
      type: 'follow',
      createdAt: '2025-10-12T09:44:00Z',
      account: {
        id: 'user9',
        username: 'ivy',
        displayName: 'Ivy Park',
        avatar: 'https://cdn.example.com/avatars/ivy.jpg'
      },
      read: false
    }
  ]);

  // Group notifications by type and target
  const groups = $derived(() => {
    const grouped = new Map<string, NotificationGroup>();

    notifications.forEach(notification => {
      // Create group key based on type and target (status ID for status-related notifications)
      let groupKey = notification.type;
      if (notification.status) {
        groupKey += `-${notification.status.id}`;
      }

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          id: `group-${groupKey}`,
          type: notification.type,
          notifications: [],
          accounts: [],
          sampleNotification: notification,
          count: 0,
          latestCreatedAt: notification.createdAt,
          allRead: true
        });
      }

      const group = grouped.get(groupKey)!;
      group.notifications.push(notification);
      
      // Add unique accounts
      if (!group.accounts.find(a => a.id === notification.account.id)) {
        group.accounts.push(notification.account);
      }
      
      group.count = group.notifications.length;
      
      // Update latest timestamp
      if (new Date(notification.createdAt) > new Date(group.latestCreatedAt)) {
        group.latestCreatedAt = notification.createdAt;
      }
      
      // Update read status
      if (!notification.read) {
        group.allRead = false;
      }
    });

    return Array.from(grouped.values());
  });

  const handlers = {
    onGroupClick: (group: NotificationGroup) => {
      console.log('Group clicked:', group);
      
      // Navigate based on group type
      if (group.type === 'follow') {
        // For follows, show list of followers
        console.log('Show followers:', group.accounts.map(a => a.username));
      } else if (group.sampleNotification.status) {
        // For status-related notifications, navigate to the status
        window.location.href = `/status/${group.sampleNotification.status.id}`;
      }
    }
  };

  const config = {
    mode: 'grouped' as const,
    enableGrouping: true,
    showTimestamps: true,
    showAvatars: true
  };
</script>

<div class="grouped-notifications-demo">
  <h2>Grouped Notifications</h2>
  
  <Notifications.Root 
    {notifications} 
    {groups}
    {handlers}
    {config}
  >
    <div class="groups-list">
      {#if groups.length === 0}
        <div class="empty-state">
          <p>No notification groups</p>
        </div>
      {:else}
        {#each groups as group (group.id)}
          <Notifications.Group {group} />
        {/each}
      {/if}
    </div>
  </Notifications.Root>
  
  <div class="summary">
    <p>{groups.length} notification {groups.length === 1 ? 'group' : 'groups'}</p>
    <p>{notifications.length} total notifications</p>
  </div>
</div>

<style>
  .grouped-notifications-demo {
    max-width: 600px;
    margin: 0 auto;
  }
  
  h2 {
    padding: 1rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    border-bottom: 1px solid var(--border-color);
  }
  
  .groups-list {
    min-height: 200px;
  }
  
  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-secondary);
  }
  
  .summary {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .summary p {
    margin: 0.25rem 0;
  }
</style>
```

### Example 2: Custom Grouped Notification Rendering

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { NotificationGroup } from '@equaltoai/greater-components-fediverse/types';

  const group: NotificationGroup = {
    id: 'group-1',
    type: 'favourite',
    notifications: [
      {
        id: '1',
        type: 'favourite',
        createdAt: '2025-10-12T10:05:00Z',
        account: {
          id: 'u1',
          username: 'alice',
          displayName: 'Alice Smith',
          avatar: 'https://cdn.example.com/avatars/alice.jpg',
          verified: true
        },
        status: {
          id: 's1',
          content: '<p>My post about the Fediverse</p>',
          createdAt: '2025-10-11T12:00:00Z'
        },
        read: false
      },
      {
        id: '2',
        type: 'favourite',
        createdAt: '2025-10-12T10:03:00Z',
        account: {
          id: 'u2',
          username: 'bob',
          displayName: 'Bob Jones',
          avatar: 'https://cdn.example.com/avatars/bob.jpg'
        },
        status: {
          id: 's1',
          content: '<p>My post about the Fediverse</p>',
          createdAt: '2025-10-11T12:00:00Z'
        },
        read: false
      },
      {
        id: '3',
        type: 'favourite',
        createdAt: '2025-10-12T10:01:00Z',
        account: {
          id: 'u3',
          username: 'carol',
          displayName: 'Carol Davis',
          avatar: 'https://cdn.example.com/avatars/carol.jpg'
        },
        status: {
          id: 's1',
          content: '<p>My post about the Fediverse</p>',
          createdAt: '2025-10-11T12:00:00Z'
        },
        read: false
      },
      {
        id: '4',
        type: 'favourite',
        createdAt: '2025-10-12T10:00:00Z',
        account: {
          id: 'u4',
          username: 'dave',
          displayName: 'Dave Wilson',
          avatar: 'https://cdn.example.com/avatars/dave.jpg'
        },
        status: {
          id: 's1',
          content: '<p>My post about the Fediverse</p>',
          createdAt: '2025-10-11T12:00:00Z'
        },
        read: false
      },
      {
        id: '5',
        type: 'favourite',
        createdAt: '2025-10-12T09:59:00Z',
        account: {
          id: 'u5',
          username: 'eve',
          displayName: 'Eve Anderson',
          avatar: 'https://cdn.example.com/avatars/eve.jpg'
        },
        status: {
          id: 's1',
          content: '<p>My post about the Fediverse</p>',
          createdAt: '2025-10-11T12:00:00Z'
        },
        read: false
      }
    ],
    accounts: [
      { id: 'u1', username: 'alice', displayName: 'Alice Smith', avatar: 'https://cdn.example.com/avatars/alice.jpg', verified: true },
      { id: 'u2', username: 'bob', displayName: 'Bob Jones', avatar: 'https://cdn.example.com/avatars/bob.jpg' },
      { id: 'u3', username: 'carol', displayName: 'Carol Davis', avatar: 'https://cdn.example.com/avatars/carol.jpg' },
      { id: 'u4', username: 'dave', displayName: 'Dave Wilson', avatar: 'https://cdn.example.com/avatars/dave.jpg' },
      { id: 'u5', username: 'eve', displayName: 'Eve Anderson', avatar: 'https://cdn.example.com/avatars/eve.jpg' }
    ],
    sampleNotification: null as any, // Set to first notification
    count: 5,
    latestCreatedAt: '2025-10-12T10:05:00Z',
    allRead: false
  };

  group.sampleNotification = group.notifications[0];

  let expanded = $state(false);

  const handlers = {
    onGroupClick: (group: NotificationGroup) => {
      expanded = !expanded;
    }
  };

  function formatAccountNames(accounts: any[], count: number): string {
    if (count === 1) {
      return accounts[0].displayName;
    } else if (count === 2) {
      return `${accounts[0].displayName} and ${accounts[1].displayName}`;
    } else if (count === 3) {
      return `${accounts[0].displayName}, ${accounts[1].displayName}, and ${accounts[2].displayName}`;
    } else {
      return `${accounts[0].displayName}, ${accounts[1].displayName}, and ${count - 2} others`;
    }
  }

  function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return then.toLocaleDateString();
  }
</script>

<Notifications.Root 
  notifications={group.notifications} 
  groups={[group]} 
  {handlers}
>
  <Notifications.Group {group}>
    {#snippet children()}
      <article class="custom-group">
        <div class="custom-group__header">
          <div class="custom-group__icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <div class="custom-group__meta">
            <div class="custom-group__action">
              <strong>{group.count} people</strong> favorited your post
            </div>
            <time class="custom-group__time">
              {formatRelativeTime(group.latestCreatedAt)}
            </time>
          </div>
          
          {#if !group.allRead}
            <div class="custom-group__unread-badge"></div>
          {/if}
        </div>
        
        <div class="custom-group__avatars">
          {#each group.accounts.slice(0, 5) as account, i}
            <div 
              class="custom-group__avatar"
              style="z-index: {5 - i}"
              title={account.displayName}
            >
              <img src={account.avatar} alt={account.displayName} />
              {#if account.verified}
                <div class="custom-group__verified">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                  </svg>
                </div>
              {/if}
            </div>
          {/each}
          
          {#if group.count > 5}
            <div class="custom-group__avatar custom-group__avatar--more">
              +{group.count - 5}
            </div>
          {/if}
        </div>
        
        {#if group.sampleNotification.status}
          <div class="custom-group__status">
            {@html group.sampleNotification.status.content}
          </div>
        {/if}
        
        <button 
          class="custom-group__expand"
          onclick={() => expanded = !expanded}
        >
          {expanded ? 'Show less' : `Show all ${group.count} people`}
          <svg 
            class="custom-group__expand-icon"
            class:custom-group__expand-icon--expanded={expanded}
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
        
        {#if expanded}
          <div class="custom-group__details">
            <h4>Everyone who favorited:</h4>
            <ul class="custom-group__accounts-list">
              {#each group.accounts as account}
                <li>
                  <img src={account.avatar} alt={account.displayName} />
                  <div>
                    <div class="account-name">
                      {account.displayName}
                      {#if account.verified}
                        <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                        </svg>
                      {/if}
                    </div>
                    <div class="account-username">@{account.username}</div>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </article>
    {/snippet}
  </Notifications.Group>
</Notifications.Root>

<style>
  .custom-group {
    position: relative;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .custom-group:hover {
    background: var(--bg-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .custom-group__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .custom-group__icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    color: #ef4444;
    flex-shrink: 0;
  }
  
  .custom-group__icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .custom-group__meta {
    flex: 1;
    min-width: 0;
  }
  
  .custom-group__action {
    font-size: 0.9375rem;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }
  
  .custom-group__action strong {
    font-weight: 700;
  }
  
  .custom-group__time {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .custom-group__unread-badge {
    width: 10px;
    height: 10px;
    background: #1d9bf0;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .custom-group__avatars {
    display: flex;
    margin-bottom: 0.75rem;
  }
  
  .custom-group__avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid var(--bg-primary);
    overflow: hidden;
    margin-left: -12px;
    transition: transform 0.2s;
  }
  
  .custom-group__avatar:first-child {
    margin-left: 0;
  }
  
  .custom-group:hover .custom-group__avatar {
    transform: translateX(4px);
  }
  
  .custom-group__avatar:first-child:hover {
    transform: translateX(0);
  }
  
  .custom-group__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .custom-group__avatar--more {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
  }
  
  .custom-group__verified {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .custom-group__verified svg {
    width: 14px;
    height: 14px;
    color: #1d9bf0;
  }
  
  .custom-group__status {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }
  
  .custom-group__expand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .custom-group__expand:hover {
    background: var(--bg-secondary);
  }
  
  .custom-group__expand-icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;
  }
  
  .custom-group__expand-icon--expanded {
    transform: rotate(180deg);
  }
  
  .custom-group__details {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }
  
  .custom-group__details h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .custom-group__accounts-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .custom-group__accounts-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.2s;
  }
  
  .custom-group__accounts-list li:hover {
    background: var(--bg-secondary);
  }
  
  .custom-group__accounts-list img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .account-name {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .verified-icon {
    width: 1rem;
    height: 1rem;
    color: #1d9bf0;
  }
  
  .account-username {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
</style>
```

### Example 3: Group with Interactive Actions

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { NotificationGroup } from '@equaltoai/greater-components-fediverse/types';

  // Group of follow requests
  const followRequestGroup: NotificationGroup = {
    id: 'group-follow-requests',
    type: 'follow_request',
    notifications: [
      {
        id: '1',
        type: 'follow_request',
        createdAt: '2025-10-12T10:00:00Z',
        account: {
          id: 'u1',
          username: 'alice',
          displayName: 'Alice Smith',
          avatar: 'https://cdn.example.com/avatars/alice.jpg'
        },
        read: false
      },
      {
        id: '2',
        type: 'follow_request',
        createdAt: '2025-10-12T09:58:00Z',
        account: {
          id: 'u2',
          username: 'bob',
          displayName: 'Bob Jones',
          avatar: 'https://cdn.example.com/avatars/bob.jpg'
        },
        read: false
      },
      {
        id: '3',
        type: 'follow_request',
        createdAt: '2025-10-12T09:56:00Z',
        account: {
          id: 'u3',
          username: 'carol',
          displayName: 'Carol Davis',
          avatar: 'https://cdn.example.com/avatars/carol.jpg'
        },
        read: false
      }
    ],
    accounts: [],
    sampleNotification: null as any,
    count: 3,
    latestCreatedAt: '2025-10-12T10:00:00Z',
    allRead: false
  };

  followRequestGroup.accounts = followRequestGroup.notifications.map(n => n.account);
  followRequestGroup.sampleNotification = followRequestGroup.notifications[0];

  let processingActions = $state<Record<string, boolean>>({});

  async function acceptRequest(accountId: string, event: Event) {
    event.stopPropagation();
    
    processingActions[accountId] = true;
    
    try {
      await fetch(`/api/accounts/${accountId}/follow-requests/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Remove from group
      followRequestGroup.notifications = followRequestGroup.notifications.filter(
        n => n.account.id !== accountId
      );
      followRequestGroup.accounts = followRequestGroup.accounts.filter(
        a => a.id !== accountId
      );
      followRequestGroup.count = followRequestGroup.notifications.length;
      
      alert('Follow request accepted!');
    } catch (error) {
      console.error('Failed to accept:', error);
      alert('Failed to accept follow request');
    } finally {
      processingActions[accountId] = false;
    }
  }

  async function rejectRequest(accountId: string, event: Event) {
    event.stopPropagation();
    
    processingActions[accountId] = true;
    
    try {
      await fetch(`/api/accounts/${accountId}/follow-requests/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Remove from group
      followRequestGroup.notifications = followRequestGroup.notifications.filter(
        n => n.account.id !== accountId
      );
      followRequestGroup.accounts = followRequestGroup.accounts.filter(
        a => a.id !== accountId
      );
      followRequestGroup.count = followRequestGroup.notifications.length;
      
      alert('Follow request rejected');
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject follow request');
    } finally {
      processingActions[accountId] = false;
    }
  }

  async function acceptAll(event: Event) {
    event.stopPropagation();
    
    if (!confirm(`Accept all ${followRequestGroup.count} follow requests?`)) {
      return;
    }
    
    processingActions.acceptAll = true;
    
    try {
      await Promise.all(
        followRequestGroup.accounts.map(account =>
          fetch(`/api/accounts/${account.id}/follow-requests/accept`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
        )
      );
      
      followRequestGroup.notifications = [];
      followRequestGroup.accounts = [];
      followRequestGroup.count = 0;
      
      alert('All follow requests accepted!');
    } catch (error) {
      console.error('Failed to accept all:', error);
      alert('Failed to accept all requests');
    } finally {
      processingActions.acceptAll = false;
    }
  }

  const handlers = {
    onGroupClick: (group: NotificationGroup) => {
      console.log('Group clicked:', group);
    }
  };
</script>

{#if followRequestGroup.count > 0}
  <Notifications.Root 
    notifications={followRequestGroup.notifications}
    groups={[followRequestGroup]}
    {handlers}
  >
    <div class="interactive-group">
      <div class="interactive-group__header">
        <div class="interactive-group__info">
          <h3>{followRequestGroup.count} New Follow {followRequestGroup.count === 1 ? 'Request' : 'Requests'}</h3>
          <p>Review who wants to follow you</p>
        </div>
        
        <button 
          class="interactive-group__accept-all"
          onclick={acceptAll}
          disabled={processingActions.acceptAll}
        >
          {processingActions.acceptAll ? 'Processing...' : 'Accept All'}
        </button>
      </div>
      
      <Notifications.Group group={followRequestGroup}>
        {#snippet children()}
          <div class="requests-list">
            {#each followRequestGroup.notifications as notification}
              <div class="request-item">
                <img 
                  src={notification.account.avatar}
                  alt={notification.account.displayName}
                  class="request-item__avatar"
                />
                
                <div class="request-item__info">
                  <div class="request-item__name">
                    {notification.account.displayName}
                  </div>
                  <div class="request-item__username">
                    @{notification.account.username}
                  </div>
                </div>
                
                <div class="request-item__actions">
                  <button
                    class="request-item__button request-item__button--accept"
                    onclick={(e) => acceptRequest(notification.account.id, e)}
                    disabled={processingActions[notification.account.id]}
                  >
                    {processingActions[notification.account.id] ? '...' : 'Accept'}
                  </button>
                  <button
                    class="request-item__button request-item__button--reject"
                    onclick={(e) => rejectRequest(notification.account.id, e)}
                    disabled={processingActions[notification.account.id]}
                  >
                    {processingActions[notification.account.id] ? '...' : 'Reject'}
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/snippet}
      </Notifications.Group>
    </div>
  </Notifications.Root>
{:else}
  <div class="no-requests">
    <p>All follow requests have been processed!</p>
  </div>
{/if}

<style>
  .interactive-group {
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .interactive-group__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .interactive-group__info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .interactive-group__info p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .interactive-group__accept-all {
    padding: 0.5rem 1rem;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .interactive-group__accept-all:hover:not(:disabled) {
    background: #15803d;
  }
  
  .interactive-group__accept-all:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .requests-list {
    padding: 0;
  }
  
  .request-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .request-item:last-child {
    border-bottom: none;
  }
  
  .request-item__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .request-item__info {
    flex: 1;
    min-width: 0;
  }
  
  .request-item__name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .request-item__username {
    font-size: 0.875rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .request-item__actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  
  .request-item__button {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .request-item__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .request-item__button--accept {
    background: #16a34a;
    color: white;
  }
  
  .request-item__button--accept:hover:not(:disabled) {
    background: #15803d;
  }
  
  .request-item__button--reject {
    background: #dc2626;
    color: white;
  }
  
  .request-item__button--reject:hover:not(:disabled) {
    background: #b91c1c;
  }
  
  .no-requests {
    max-width: 600px;
    margin: 0 auto;
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-secondary);
  }
</style>
```

### Example 4: Group with Time-based Formatting

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { NotificationGroup } from '@equaltoai/greater-components-fediverse/types';

  // Sample group with various timestamps
  const group: NotificationGroup = {
    id: 'group-1',
    type: 'reblog',
    notifications: [
      /* ... notifications with different timestamps ... */
    ],
    accounts: [],
    sampleNotification: null as any,
    count: 7,
    latestCreatedAt: '2025-10-12T10:05:00Z',
    allRead: false
  };

  function formatDetailedTime(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 30) return 'just now';
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getTimeRange(): string {
    if (group.notifications.length === 0) return '';
    
    const latest = new Date(group.latestCreatedAt);
    const earliest = new Date(group.notifications[group.notifications.length - 1].createdAt);
    const diffMs = latest.getTime() - earliest.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'all within a minute';
    if (diffMins === 1) return 'over 1 minute';
    if (diffMins < 60) return `over ${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'over 1 hour';
    if (diffHours < 24) return `over ${diffHours} hours`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'over 1 day';
    return `over ${diffDays} days`;
  }

  const handlers = {
    onGroupClick: (group: NotificationGroup) => {
      console.log('Group clicked');
    }
  };
</script>

<Notifications.Root 
  notifications={group.notifications}
  groups={[group]}
  {handlers}
>
  <Notifications.Group {group}>
    {#snippet children()}
      <div class="time-formatted-group">
        <div class="time-formatted-group__header">
          <h3>{group.count} people boosted your post</h3>
          <div class="time-formatted-group__timeline">
            <time datetime={group.latestCreatedAt.toString()}>
              Latest: {formatDetailedTime(group.latestCreatedAt)}
            </time>
            <span class="time-formatted-group__divider">•</span>
            <span class="time-formatted-group__range">
              {getTimeRange()}
            </span>
          </div>
        </div>
        
        <div class="time-formatted-group__timeline-viz">
          {#each group.notifications as notification, i}
            <div 
              class="timeline-dot"
              style="left: {(i / (group.count - 1)) * 100}%"
              title="{notification.account.displayName} - {formatDetailedTime(notification.createdAt)}"
            />
          {/each}
        </div>
        
        {#if group.sampleNotification.status}
          <div class="time-formatted-group__status">
            {@html group.sampleNotification.status.content}
          </div>
        {/if}
      </div>
    {/snippet}
  </Notifications.Group>
</Notifications.Root>

<style>
  .time-formatted-group {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
  }
  
  .time-formatted-group__header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  .time-formatted-group__timeline {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .time-formatted-group__divider {
    color: var(--border-color);
  }
  
  .time-formatted-group__timeline-viz {
    position: relative;
    height: 32px;
    margin: 1rem 0;
    background: var(--bg-secondary);
    border-radius: 16px;
  }
  
  .timeline-dot {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background: #1d9bf0;
    border: 2px solid white;
    border-radius: 50%;
    cursor: help;
    transition: all 0.2s;
  }
  
  .timeline-dot:hover {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 1;
  }
  
  .time-formatted-group__status {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.9375rem;
  }
</style>
```

### Example 5: Advanced Group with Analytics

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { NotificationGroup } from '@equaltoai/greater-components-fediverse/types';

  const group: NotificationGroup = {
    id: 'group-1',
    type: 'favourite',
    notifications: [], // ... populated with sample data
    accounts: [],
    sampleNotification: null as any,
    count: 42,
    latestCreatedAt: '2025-10-12T10:05:00Z',
    allRead: false
  };

  // Calculate analytics
  const analytics = $derived(() => {
    const verified = group.accounts.filter(a => a.verified).length;
    const unread = group.notifications.filter(n => !n.read).length;
    
    // Time distribution
    const timeDistribution = {
      lastHour: 0,
      lastDay: 0,
      lastWeek: 0,
      older: 0
    };
    
    const now = new Date().getTime();
    group.notifications.forEach(n => {
      const diff = now - new Date(n.createdAt).getTime();
      const hours = diff / (1000 * 60 * 60);
      
      if (hours < 1) timeDistribution.lastHour++;
      else if (hours < 24) timeDistribution.lastDay++;
      else if (hours < 168) timeDistribution.lastWeek++;
      else timeDistribution.older++;
    });
    
    return {
      total: group.count,
      verified,
      unread,
      verifiedPercent: Math.round((verified / group.count) * 100),
      unreadPercent: Math.round((unread / group.count) * 100),
      timeDistribution
    };
  });

  const handlers = {
    onGroupClick: (group: NotificationGroup) => {
      console.log('Analytics:', analytics);
    }
  };
</script>

<Notifications.Root 
  notifications={group.notifications}
  groups={[group]}
  {handlers}
>
  <Notifications.Group {group}>
    {#snippet children()}
      <div class="analytics-group">
        <div class="analytics-group__summary">
          <div class="summary-stat">
            <div class="summary-stat__value">{analytics.total}</div>
            <div class="summary-stat__label">Total</div>
          </div>
          
          <div class="summary-stat summary-stat--verified">
            <div class="summary-stat__value">{analytics.verified}</div>
            <div class="summary-stat__label">Verified</div>
            <div class="summary-stat__badge">{analytics.verifiedPercent}%</div>
          </div>
          
          <div class="summary-stat summary-stat--unread">
            <div class="summary-stat__value">{analytics.unread}</div>
            <div class="summary-stat__label">Unread</div>
            <div class="summary-stat__badge">{analytics.unreadPercent}%</div>
          </div>
        </div>
        
        <div class="analytics-group__chart">
          <h4>Activity Timeline</h4>
          <div class="chart-bars">
            <div class="chart-bar">
              <div 
                class="chart-bar__fill"
                style="height: {(analytics.timeDistribution.lastHour / analytics.total) * 100}%"
              ></div>
              <div class="chart-bar__label">Last Hour</div>
              <div class="chart-bar__value">{analytics.timeDistribution.lastHour}</div>
            </div>
            
            <div class="chart-bar">
              <div 
                class="chart-bar__fill"
                style="height: {(analytics.timeDistribution.lastDay / analytics.total) * 100}%"
              ></div>
              <div class="chart-bar__label">Last Day</div>
              <div class="chart-bar__value">{analytics.timeDistribution.lastDay}</div>
            </div>
            
            <div class="chart-bar">
              <div 
                class="chart-bar__fill"
                style="height: {(analytics.timeDistribution.lastWeek / analytics.total) * 100}%"
              ></div>
              <div class="chart-bar__label">Last Week</div>
              <div class="chart-bar__value">{analytics.timeDistribution.lastWeek}</div>
            </div>
            
            <div class="chart-bar">
              <div 
                class="chart-bar__fill"
                style="height: {(analytics.timeDistribution.older / analytics.total) * 100}%"
              ></div>
              <div class="chart-bar__label">Older</div>
              <div class="chart-bar__value">{analytics.timeDistribution.older}</div>
            </div>
          </div>
        </div>
        
        {#if group.sampleNotification.status}
          <div class="analytics-group__status">
            {@html group.sampleNotification.status.content}
          </div>
        {/if}
      </div>
    {/snippet}
  </Notifications.Group>
</Notifications.Root>

<style>
  .analytics-group {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
  }
  
  .analytics-group__summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .summary-stat {
    position: relative;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    text-align: center;
  }
  
  .summary-stat__value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }
  
  .summary-stat__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .summary-stat__badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.125rem 0.375rem;
    background: var(--primary-color);
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    border-radius: 9999px;
  }
  
  .summary-stat--verified .summary-stat__badge {
    background: #1d9bf0;
  }
  
  .summary-stat--unread .summary-stat__badge {
    background: #10b981;
  }
  
  .analytics-group__chart {
    margin-bottom: 1rem;
  }
  
  .analytics-group__chart h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .chart-bars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    height: 120px;
  }
  
  .chart-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background: var(--bg-secondary);
    border-radius: 6px 6px 0 0;
    overflow: hidden;
  }
  
  .chart-bar__fill {
    width: 100%;
    background: linear-gradient(180deg, #1d9bf0 0%, #0ea5e9 100%);
    transition: height 0.3s ease;
  }
  
  .chart-bar__label {
    position: absolute;
    bottom: -1.5rem;
    left: 0;
    right: 0;
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-align: center;
  }
  
  .chart-bar__value {
    position: absolute;
    top: 0.25rem;
    left: 0;
    right: 0;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .analytics-group__status {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.9375rem;
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.notification-group` | Root group container |
| `.notification-group--{type}` | Type-specific modifier |
| `.notification-group--unread` | Applied when group has unread notifications |
| `.notification-group__icon` | Group type icon |
| `.notification-group__content` | Main content container |
| `.notification-group__avatars` | Stacked avatars container |
| `.notification-group__avatar` | Individual avatar |
| `.notification-group__body` | Text content container |
| `.notification-group__text` | Group description text |
| `.notification-group__names` | Account names |
| `.notification-group__action` | Action description |
| `.notification-group__timestamp` | Timestamp display |
| `.notification-group__status` | Status content preview |

### **CSS Custom Properties**

```css
:root {
  --notifications-item-bg: #ffffff;
  --notifications-item-hover-bg: #f7f9fa;
  --notifications-unread-bg: #eff6ff;
  --notifications-border: #e1e8ed;
  --notifications-text-primary: #0f1419;
  --notifications-text-secondary: #536471;
  --notifications-status-bg: #f7f9fa;
  --notifications-radius: 8px;
  --notifications-font-size-base: 1rem;
  --notifications-font-size-sm: 0.875rem;
}
```

---

## ♿ Accessibility

### **ARIA Attributes**

```html
<article
  role="article"
  aria-label="{names} {action}"
>
  <!-- content -->
</article>
```

### **Keyboard Navigation**

- `Tab`: Navigate to group
- `Enter` / `Space`: Activate group
- Proper focus management

### **Screen Reader Announcements**

Groups are announced with proper context:
- "Alice and 2 others favorited your post"
- "5 people followed you"

---

## 🔒 Security

### **Content Sanitization**

Always sanitize group content:

```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(group.sampleNotification.status?.content || '');
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Memoize group calculations**
2. **Lazy render expanded content**
3. **Use virtual scrolling for large groups**
4. **Debounce expand/collapse animations**

---

## 🧪 Testing

Test file: `packages/fediverse/tests/notificationGrouping.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Notifications } from '@equaltoai/greater-components-fediverse';

describe('Notifications.Group', () => {
  it('renders grouped notifications', () => {
    const group = {
      id: '1',
      type: 'favourite',
      notifications: [/* ... */],
      count: 3
    };
    
    render(Notifications.Group, { props: { group } });
    expect(screen.getByText(/3 people/)).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Notifications.Root](./Root.md) - Context provider
- [Notifications.Item](./Item.md) - Individual notification
- [Notifications.Filter](./Filter.md) - Type filtering

---

## 📚 See Also

- [Notifications README](./README.md) - Component overview
- [Status Components](../Status/README.md)
- [Timeline Components](../Timeline/README.md)

