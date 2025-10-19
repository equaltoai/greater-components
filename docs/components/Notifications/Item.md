# Notifications.Item

**Component**: Notification Display  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 12 passing tests

---

## 📋 Overview

`Notifications.Item` displays an individual notification with type-specific rendering, avatars, timestamps, and interactive actions. It automatically adapts its display based on notification type (follow, mention, favorite, boost, etc.) and integrates seamlessly with the Notifications context.

### **Key Features**:
- ✅ Type-specific notification rendering
- ✅ Automatic icon and text generation per type
- ✅ Avatar display with fallback
- ✅ Timestamp formatting
- ✅ Status content preview for relevant notifications
- ✅ Mark as read on click
- ✅ Dismiss functionality
- ✅ Unread visual indicators
- ✅ Accessibility-first design
- ✅ Customizable rendering via snippets
- ✅ Click handlers with event delegation
- ✅ Responsive design

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
  
  const notification = {
    id: '1',
    type: 'follow',
    createdAt: '2025-10-12T10:00:00Z',
    account: {
      id: 'user1',
      username: 'alice',
      displayName: 'Alice Smith',
      avatar: 'https://example.com/alice.jpg'
    },
    read: false
  };
  
  const handlers = {
    onNotificationClick: (notification) => {
      console.log('Notification clicked:', notification);
    },
    onMarkRead: async (id) => {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    }
  };
</script>

<Notifications.Root notifications={[notification]} {handlers}>
  <Notifications.Item {notification} />
</Notifications.Root>
```

---

## 🎛️ Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `notification` | `Notification` | - | **Yes** | Notification data object |
| `children` | `Snippet` | - | No | Custom content rendering |
| `class` | `string` | `''` | No | Additional CSS class |

### **Notification Interface**

```typescript
type NotificationType = 
  | 'mention'
  | 'reblog' 
  | 'favourite'
  | 'follow'
  | 'follow_request'
  | 'poll'
  | 'status'
  | 'update'
  | 'admin.sign_up'
  | 'admin.report';

interface BaseNotification {
  id: string;
  type: NotificationType;
  createdAt: string | Date;
  account: Account;
  read?: boolean;
  dismissed?: boolean;
}

// Type-specific notifications extend BaseNotification
interface MentionNotification extends BaseNotification {
  type: 'mention';
  status: Status;
}

interface ReblogNotification extends BaseNotification {
  type: 'reblog';
  status: Status;
}

interface FavouriteNotification extends BaseNotification {
  type: 'favourite';
  status: Status;
}

interface FollowNotification extends BaseNotification {
  type: 'follow';
}

// ... other notification types
```

### **Account Interface**

```typescript
interface Account {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bot?: boolean;
  verified?: boolean;
}
```

### **Status Interface**

```typescript
interface Status {
  id: string;
  content: string;
  createdAt: string | Date;
  // ... other status fields
}
```

---

## 📤 Events

The component automatically calls handlers from the parent `Notifications.Root` context:

| Event | Handler | Description |
|-------|---------|-------------|
| Click | `onNotificationClick(notification)` | Called when notification is clicked |
| Read | `onMarkRead(id)` | Called when unread notification is clicked |
| Dismiss | `onDismiss(id)` | Called when dismiss button is clicked |

---

## 💡 Examples

### Example 1: Different Notification Types

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  const notifications: Notification[] = [
    // Follow notification
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
    
    // Mention notification
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
        content: '<p>Hey <span class="mention">@you</span>, check this out!</p>',
        createdAt: '2025-10-12T09:30:00Z'
      },
      read: false
    },
    
    // Favorite notification
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
        content: '<p>My amazing post about ActivityPub!</p>',
        createdAt: '2025-10-11T15:00:00Z'
      },
      read: true
    },
    
    // Boost/Reblog notification
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
        content: '<p>The Fediverse is the future of social media! 🚀</p>',
        createdAt: '2025-10-10T12:00:00Z'
      },
      read: true
    },
    
    // Follow request notification
    {
      id: '5',
      type: 'follow_request',
      createdAt: '2025-10-12T08:00:00Z',
      account: {
        id: 'user5',
        username: 'eve',
        displayName: 'Eve Anderson',
        avatar: 'https://cdn.example.com/avatars/eve.jpg'
      },
      read: false
    },
    
    // Poll ended notification
    {
      id: '6',
      type: 'poll',
      createdAt: '2025-10-12T07:30:00Z',
      account: {
        id: 'user6',
        username: 'frank',
        displayName: 'Frank Miller',
        avatar: 'https://cdn.example.com/avatars/frank.jpg'
      },
      status: {
        id: 'status4',
        content: '<p>Which is better?</p>',
        createdAt: '2025-10-09T10:00:00Z'
      },
      read: true
    },
    
    // Status update notification
    {
      id: '7',
      type: 'update',
      createdAt: '2025-10-12T07:00:00Z',
      account: {
        id: 'user7',
        username: 'grace',
        displayName: 'Grace Lee',
        avatar: 'https://cdn.example.com/avatars/grace.jpg'
      },
      status: {
        id: 'status5',
        content: '<p>Updated: Fixed the typo in my previous post</p>',
        createdAt: '2025-10-12T06:00:00Z'
      },
      read: false
    }
  ];

  const handlers = {
    onNotificationClick: (notification: Notification) => {
      console.log('Clicked notification:', notification.id, notification.type);
      
      // Type-specific navigation
      switch (notification.type) {
        case 'follow':
        case 'follow_request':
          window.location.href = `/@${notification.account.username}`;
          break;
          
        case 'mention':
        case 'reblog':
        case 'favourite':
        case 'poll':
        case 'update':
          if (notification.status) {
            window.location.href = `/status/${notification.status.id}`;
          }
          break;
      }
    },
    
    onMarkRead: async (id: string) => {
      try {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const config = {
    mode: 'flat' as const,
    showTimestamps: true,
    showAvatars: true
  };
</script>

<div class="notification-examples">
  <h2>Notification Types</h2>
  
  <Notifications.Root 
    {notifications} 
    {handlers}
    {config}
  >
    {#each notifications as notification (notification.id)}
      <Notifications.Item {notification} />
    {/each}
  </Notifications.Root>
</div>

<style>
  .notification-examples {
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
</style>
```

### Example 2: Custom Rendering with Snippets

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  const notification: Notification = {
    id: '1',
    type: 'favourite',
    createdAt: '2025-10-12T10:00:00Z',
    account: {
      id: 'user1',
      username: 'alice',
      displayName: 'Alice Smith',
      avatar: 'https://cdn.example.com/avatars/alice.jpg',
      verified: true
    },
    status: {
      id: 'status1',
      content: '<p>My amazing post!</p>',
      createdAt: '2025-10-11T12:00:00Z'
    },
    read: false
  };

  const handlers = {
    onNotificationClick: (notification: Notification) => {
      console.log('Clicked:', notification.id);
    }
  };

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

<Notifications.Root notifications={[notification]} {handlers}>
  <Notifications.Item {notification}>
    {#snippet children()}
      <div class="custom-notification">
        <div class="custom-notification__header">
          <img 
            src={notification.account.avatar} 
            alt={notification.account.displayName}
            class="custom-notification__avatar"
          />
          
          <div class="custom-notification__info">
            <div class="custom-notification__name">
              {notification.account.displayName}
              {#if notification.account.verified}
                <svg class="verified-badge" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                </svg>
              {/if}
            </div>
            <div class="custom-notification__username">
              @{notification.account.username}
            </div>
          </div>
          
          <div class="custom-notification__time">
            {formatRelativeTime(notification.createdAt)}
          </div>
        </div>
        
        <div class="custom-notification__content">
          <p class="custom-notification__action">
            <span class="custom-notification__icon">⭐</span>
            favorited your post
          </p>
          
          {#if notification.status}
            <div class="custom-notification__status">
              {@html notification.status.content}
            </div>
          {/if}
        </div>
        
        {#if !notification.read}
          <div class="custom-notification__unread-dot"></div>
        {/if}
      </div>
    {/snippet}
  </Notifications.Item>
</Notifications.Root>

<style>
  .custom-notification {
    position: relative;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-primary);
    transition: all 0.2s;
  }
  
  .custom-notification:hover {
    background: var(--bg-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .custom-notification__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .custom-notification__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .custom-notification__info {
    flex: 1;
    min-width: 0;
  }
  
  .custom-notification__name {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .verified-badge {
    width: 1.125rem;
    height: 1.125rem;
    color: #1d9bf0;
  }
  
  .custom-notification__username {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .custom-notification__time {
    font-size: 0.875rem;
    color: var(--text-secondary);
    flex-shrink: 0;
  }
  
  .custom-notification__content {
    margin-left: calc(48px + 0.75rem);
  }
  
  .custom-notification__action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.5rem 0;
    font-size: 0.9375rem;
    color: var(--text-secondary);
  }
  
  .custom-notification__icon {
    font-size: 1.25rem;
  }
  
  .custom-notification__status {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 0.9375rem;
    color: var(--text-primary);
  }
  
  .custom-notification__unread-dot {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 8px;
    height: 8px;
    background: #1d9bf0;
    border-radius: 50%;
  }
</style>
```

### Example 3: Interactive Notifications with Actions

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  let notifications = $state<Notification[]>([
    {
      id: '1',
      type: 'follow_request',
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
        content: '<p>Hey <span class="mention">@you</span>, what do you think?</p>',
        createdAt: '2025-10-12T09:30:00Z'
      },
      read: false
    }
  ]);

  let processingActions = $state<Record<string, boolean>>({});

  const handlers = {
    onNotificationClick: (notification: Notification) => {
      if (notification.status) {
        window.location.href = `/status/${notification.status.id}`;
      } else {
        window.location.href = `/@${notification.account.username}`;
      }
    },
    
    onDismiss: async (id: string) => {
      try {
        await fetch(`/api/notifications/${id}/dismiss`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        notifications = notifications.filter(n => n.id !== id);
      } catch (error) {
        console.error('Failed to dismiss:', error);
      }
    }
  };

  async function acceptFollowRequest(notificationId: string, accountId: string, event: Event) {
    event.stopPropagation();
    
    processingActions[notificationId] = true;
    
    try {
      await fetch(`/api/accounts/${accountId}/follow-requests/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Remove notification
      notifications = notifications.filter(n => n.id !== notificationId);
    } catch (error) {
      console.error('Failed to accept follow request:', error);
    } finally {
      processingActions[notificationId] = false;
    }
  }

  async function rejectFollowRequest(notificationId: string, accountId: string, event: Event) {
    event.stopPropagation();
    
    processingActions[notificationId] = true;
    
    try {
      await fetch(`/api/accounts/${accountId}/follow-requests/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Remove notification
      notifications = notifications.filter(n => n.id !== notificationId);
    } catch (error) {
      console.error('Failed to reject follow request:', error);
    } finally {
      processingActions[notificationId] = false;
    }
  }

  async function quickReply(notificationId: string, statusId: string, event: Event) {
    event.stopPropagation();
    
    const reply = prompt('Your reply:');
    if (!reply) return;
    
    processingActions[notificationId] = true;
    
    try {
      await fetch('/api/statuses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: reply,
          inReplyToId: statusId
        })
      });
      
      alert('Reply sent!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      processingActions[notificationId] = false;
    }
  }
</script>

<Notifications.Root {notifications} {handlers}>
  {#each notifications as notification (notification.id)}
    <div class="notification-wrapper">
      <Notifications.Item {notification} />
      
      {#if notification.type === 'follow_request'}
        <div class="notification-actions">
          <button
            class="action-button action-button--accept"
            onclick={(e) => acceptFollowRequest(notification.id, notification.account.id, e)}
            disabled={processingActions[notification.id]}
          >
            {processingActions[notification.id] ? 'Processing...' : 'Accept'}
          </button>
          <button
            class="action-button action-button--reject"
            onclick={(e) => rejectFollowRequest(notification.id, notification.account.id, e)}
            disabled={processingActions[notification.id]}
          >
            {processingActions[notification.id] ? 'Processing...' : 'Reject'}
          </button>
        </div>
      {/if}
      
      {#if notification.type === 'mention' && notification.status}
        <div class="notification-actions">
          <button
            class="action-button action-button--reply"
            onclick={(e) => quickReply(notification.id, notification.status.id, e)}
            disabled={processingActions[notification.id]}
          >
            Quick Reply
          </button>
        </div>
      {/if}
    </div>
  {/each}
</Notifications.Root>

<style>
  .notification-wrapper {
    position: relative;
  }
  
  .notification-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }
  
  .action-button {
    flex: 1;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .action-button--accept {
    background: #16a34a;
    color: white;
  }
  
  .action-button--accept:hover:not(:disabled) {
    background: #15803d;
  }
  
  .action-button--reject {
    background: #dc2626;
    color: white;
  }
  
  .action-button--reject:hover:not(:disabled) {
    background: #b91c1c;
  }
  
  .action-button--reply {
    background: #1d9bf0;
    color: white;
  }
  
  .action-button--reply:hover:not(:disabled) {
    background: #1a8cd8;
  }
</style>
```

### Example 4: Rich Notification Display

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  const notification: Notification = {
    id: '1',
    type: 'reblog',
    createdAt: '2025-10-12T10:00:00Z',
    account: {
      id: 'user1',
      username: 'alice',
      displayName: 'Alice Smith',
      avatar: 'https://cdn.example.com/avatars/alice.jpg',
      bot: false,
      verified: true
    },
    status: {
      id: 'status1',
      content: `
        <p>Just published a comprehensive guide to ActivityPub! 📚</p>
        <p>Topics covered:</p>
        <p>• Actor model<br>
        • Activity types<br>
        • Federation protocols<br>
        • Security best practices</p>
        <p><a href="https://example.com/activitypub-guide">#ActivityPub</a> <a href="https://example.com/fediverse">#Fediverse</a></p>
      `,
      createdAt: '2025-10-11T15:00:00Z'
    },
    read: false
  };

  const handlers = {
    onNotificationClick: (notification: Notification) => {
      window.location.href = `/status/${notification.status?.id}`;
    },
    onMarkRead: async (id: string) => {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    }
  };

  function formatTimestamp(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<Notifications.Root notifications={[notification]} {handlers} config={{ showTimestamps: true, showAvatars: true }}>
  <Notifications.Item {notification}>
    {#snippet children()}
      <article class="rich-notification">
        <div class="rich-notification__type">
          <div class="rich-notification__type-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"/>
            </svg>
          </div>
          <span class="rich-notification__type-text">Boosted your post</span>
        </div>
        
        <div class="rich-notification__content">
          <div class="rich-notification__header">
            <img 
              src={notification.account.avatar}
              alt={notification.account.displayName}
              class="rich-notification__avatar"
            />
            
            <div class="rich-notification__meta">
              <div class="rich-notification__account">
                <span class="rich-notification__name">
                  {notification.account.displayName}
                  {#if notification.account.verified}
                    <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                    </svg>
                  {/if}
                  {#if notification.account.bot}
                    <span class="bot-badge">BOT</span>
                  {/if}
                </span>
                <span class="rich-notification__username">
                  @{notification.account.username}
                </span>
              </div>
              
              <time 
                class="rich-notification__time"
                datetime={notification.createdAt.toString()}
                title={new Date(notification.createdAt).toLocaleString()}
              >
                {formatTimestamp(notification.createdAt)}
              </time>
            </div>
          </div>
          
          {#if notification.status}
            <div class="rich-notification__status">
              <div class="rich-notification__status-content">
                {@html notification.status.content}
              </div>
              
              <div class="rich-notification__status-meta">
                <span>Original post from {formatTimestamp(notification.status.createdAt)}</span>
              </div>
            </div>
          {/if}
        </div>
        
        {#if !notification.read}
          <div class="rich-notification__unread-indicator" aria-label="Unread">
            <span class="sr-only">Unread notification</span>
          </div>
        {/if}
      </article>
    {/snippet}
  </Notifications.Item>
</Notifications.Root>

<style>
  .rich-notification {
    position: relative;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-primary);
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .rich-notification:hover {
    background: var(--bg-hover);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .rich-notification__type {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .rich-notification__type-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #16a34a;
  }
  
  .rich-notification__type-icon svg {
    width: 100%;
    height: 100%;
  }
  
  .rich-notification__type-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .rich-notification__header {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .rich-notification__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .rich-notification__meta {
    flex: 1;
    min-width: 0;
  }
  
  .rich-notification__account {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .rich-notification__name {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .verified-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: #1d9bf0;
    flex-shrink: 0;
  }
  
  .bot-badge {
    padding: 0.125rem 0.375rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.625rem;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
  }
  
  .rich-notification__username {
    font-size: 0.9375rem;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .rich-notification__time {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .rich-notification__status {
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  
  .rich-notification__status-content {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--text-primary);
    word-wrap: break-word;
  }
  
  .rich-notification__status-content :global(p) {
    margin: 0 0 0.75rem 0;
  }
  
  .rich-notification__status-content :global(p:last-child) {
    margin-bottom: 0;
  }
  
  .rich-notification__status-content :global(a) {
    color: #1d9bf0;
    text-decoration: none;
  }
  
  .rich-notification__status-content :global(a:hover) {
    text-decoration: underline;
  }
  
  .rich-notification__status-meta {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }
  
  .rich-notification__unread-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 10px;
    height: 10px;
    background: #1d9bf0;
    border-radius: 50%;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Example 5: Notification with Media Preview

```svelte
<script lang="ts">
  import { Notifications } from '@equaltoai/greater-components-fediverse';
  import type { Notification } from '@equaltoai/greater-components-fediverse/types';

  const notification: Notification = {
    id: '1',
    type: 'favourite',
    createdAt: '2025-10-12T10:00:00Z',
    account: {
      id: 'user1',
      username: 'alice',
      displayName: 'Alice Smith',
      avatar: 'https://cdn.example.com/avatars/alice.jpg'
    },
    status: {
      id: 'status1',
      content: '<p>Check out this amazing sunset! 🌅</p>',
      createdAt: '2025-10-11T18:00:00Z',
      mediaAttachments: [
        {
          id: 'media1',
          type: 'image',
          url: 'https://cdn.example.com/media/sunset.jpg',
          previewUrl: 'https://cdn.example.com/media/sunset-thumb.jpg',
          description: 'Beautiful sunset over the ocean'
        }
      ]
    },
    read: false
  };

  const handlers = {
    onNotificationClick: (notification: Notification) => {
      window.location.href = `/status/${notification.status?.id}`;
    }
  };
</script>

<Notifications.Root notifications={[notification]} {handlers}>
  <Notifications.Item {notification}>
    {#snippet children()}
      <div class="media-notification">
        <div class="media-notification__header">
          <img 
            src={notification.account.avatar}
            alt={notification.account.displayName}
            class="media-notification__avatar"
          />
          
          <div class="media-notification__info">
            <div class="media-notification__name">
              {notification.account.displayName}
            </div>
            <div class="media-notification__action">
              <span class="media-notification__icon">⭐</span>
              favorited your post
            </div>
          </div>
        </div>
        
        {#if notification.status}
          <div class="media-notification__status">
            <div class="media-notification__text">
              {@html notification.status.content}
            </div>
            
            {#if notification.status.mediaAttachments && notification.status.mediaAttachments.length > 0}
              <div class="media-notification__media">
                {#each notification.status.mediaAttachments as media}
                  {#if media.type === 'image'}
                    <img
                      src={media.previewUrl || media.url}
                      alt={media.description || 'Media attachment'}
                      class="media-notification__image"
                      loading="lazy"
                    />
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/snippet}
  </Notifications.Item>
</Notifications.Root>

<style>
  .media-notification {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: var(--bg-primary);
  }
  
  .media-notification__header {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .media-notification__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .media-notification__info {
    flex: 1;
  }
  
  .media-notification__name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }
  
  .media-notification__action {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .media-notification__icon {
    font-size: 1rem;
  }
  
  .media-notification__status {
    margin-left: calc(40px + 0.75rem);
  }
  
  .media-notification__text {
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--text-primary);
  }
  
  .media-notification__media {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
  }
  
  .media-notification__image {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
```

---

## 🎨 Styling

### **CSS Classes**

| Class | Description |
|-------|-------------|
| `.notification-item` | Root notification item container |
| `.notification-item--{type}` | Type-specific modifier (e.g., `notification-item--follow`) |
| `.notification-item--unread` | Applied to unread notifications |
| `.notification-item__icon` | Notification type icon |
| `.notification-item__content` | Main content container |
| `.notification-item__avatar` | Account avatar image |
| `.notification-item__body` | Text content container |
| `.notification-item__text` | Notification text |
| `.notification-item__name` | Account name |
| `.notification-item__action` | Action description text |
| `.notification-item__timestamp` | Timestamp display |
| `.notification-item__status` | Status content preview |
| `.notification-item__dismiss` | Dismiss button |

### **CSS Custom Properties**

```css
:root {
  --notifications-item-bg: #ffffff;
  --notifications-item-hover-bg: #f7f9fa;
  --notifications-unread-bg: #eff6ff;
  --notifications-border: #e1e8ed;
  --notifications-text-primary: #0f1419;
  --notifications-text-secondary: #536471;
  --notifications-primary: #1d9bf0;
  --notifications-status-bg: #f7f9fa;
  --notifications-error-color: #dc2626;
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
  aria-label="{displayName} {action}"
>
  <!-- content -->
</article>
```

### **Keyboard Navigation**

- `Tab`: Navigate to notification
- `Enter` / `Space`: Activate notification
- Dismiss button receives focus separately

### **Screen Reader Announcements**

Notifications are announced with proper context:
- "Alice Smith followed you"
- "Bob Jones favorited your post"
- "Carol Davis boosted your post"

---

## 🔒 Security

### **Content Sanitization**

Always sanitize status content:

```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(notification.status?.content || '');
```

### **XSS Prevention**

- Use `{@html}` sparingly and only with sanitized content
- Validate all user-generated content
- Escape HTML entities in plain text fields

---

## ⚡ Performance

- Memoize complex computations
- Use `{#key}` blocks for stable rendering
- Implement virtualization for large lists
- Lazy load avatars and media

---

## 🧪 Testing

Test file: `packages/fediverse/tests/NotificationItem.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Notifications } from '@equaltoai/greater-components-fediverse';

describe('Notifications.Item', () => {
  it('renders notification correctly', () => {
    const notification = {
      id: '1',
      type: 'follow',
      account: { displayName: 'Alice' }
    };
    
    render(Notifications.Item, { props: { notification } });
    expect(screen.getByText('followed you')).toBeInTheDocument();
  });
});
```

---

## 🔗 Related Components

- [Notifications.Root](./Root.md) - Context provider
- [Notifications.Filter](./Filter.md) - Type filtering
- [Notifications.Group](./Group.md) - Grouped notifications

---

## 📚 See Also

- [Notifications README](./README.md) - Component overview
- [Status Components](../Status/README.md)
- [Profile Components](../Profile/README.md)

