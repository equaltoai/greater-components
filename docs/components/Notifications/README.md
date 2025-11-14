# Notifications Components

**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Components**: 4 compound components

---

## 📋 Overview

The Notifications component group provides a complete, production-ready notification system for ActivityPub/Fediverse applications. Built using the compound component pattern, it offers flexible composition, real-time updates, intelligent grouping, and comprehensive filtering capabilities.

### **Architecture**

The Notifications system follows a compound component architecture with shared context:

```
Notifications.Root (Context Provider)
├── Notifications.Filter (Type filtering)
├── Notifications.Item (Individual notification)
└── Notifications.Group (Grouped notifications)
```

All child components access shared state through React Context, ensuring type safety and consistent behavior across the notification system.

---

## 🎯 Key Features

### **✅ Real-time Notifications**

- WebSocket subscriptions for instant delivery
- GraphQL subscriptions (`onNotificationCreated`)
- Automatic reconnection and error recovery
- Polling fallback for environments without WebSocket support
- Battery-efficient update strategies

### **✅ Intelligent Grouping**

- Group similar notifications ("3 people liked your post")
- Time-based grouping windows (configurable)
- Type-specific grouping logic
- Expandable grouped items
- Avatar stacking for grouped accounts

### **✅ Comprehensive Filtering**

- Filter by notification type (mentions, follows, boosts, favorites, polls)
- "All" view for unfiltered notifications
- Persistent filter state
- Visual feedback for active filters
- Badge counts per filter

### **✅ Read/Unread Management**

- Visual indicators for unread notifications
- Badge counts
- Mark individual notifications as read
- Bulk "mark all as read" functionality
- Automatic read tracking on interaction

### **✅ Notification Types**

- **Mention**: Someone mentioned you in a post
- **Reply**: Someone replied to your post
- **Boost/Reblog**: Someone boosted your post
- **Favorite/Like**: Someone favorited your post
- **Follow**: Someone followed you
- **Follow Request**: Someone requested to follow you
- **Poll**: A poll you voted in has ended
- **Status**: Someone you follow posted
- **Update**: Someone edited a post you interacted with
- **Admin**: Administrative notifications (sign-ups, reports)

### **✅ Accessibility First**

- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Reduced motion support
- High contrast mode compatible

### **✅ Performance Optimized**

- Virtualized scrolling for large notification lists
- Lazy loading with infinite scroll
- Debounced updates
- Memoized grouping logic
- Efficient re-renders

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

## 🚀 Quick Start

### **Basic Notifications Feed**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import type { Notification } from '@equaltoai/greater-components-fediverse/types';

	const notifications: Notification[] = [
		{
			id: '1',
			type: 'follow',
			createdAt: '2025-10-12T10:00:00Z',
			account: {
				id: 'user1',
				username: 'alice',
				displayName: 'Alice Smith',
				avatar: 'https://example.com/alice.jpg',
			},
			read: false,
		},
		{
			id: '2',
			type: 'favourite',
			createdAt: '2025-10-12T09:30:00Z',
			account: {
				id: 'user2',
				username: 'bob',
				displayName: 'Bob Jones',
				avatar: 'https://example.com/bob.jpg',
			},
			status: {
				id: 'status1',
				content: 'Hello Fediverse!',
				createdAt: '2025-10-11T12:00:00Z',
			},
			read: false,
		},
	];

	const handlers = {
		onNotificationClick: (notification) => {
			console.log('Notification clicked:', notification);
		},
		onMarkRead: async (id) => {
			await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
		},
		onMarkAllRead: async () => {
			await fetch('/api/notifications/read-all', { method: 'POST' });
		},
	};
</script>

<Notifications.Root {notifications} {handlers} config={{ mode: 'flat' }}>
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

### **With Filtering**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';

	let notifications = $state([
		/* ... */
	]);
	let activeFilter = $state('all');

	const filtered = $derived(
		activeFilter === 'all'
			? notifications
			: notifications.filter((n) => {
					if (activeFilter === 'mentions') return n.type === 'mention';
					if (activeFilter === 'follows') return n.type === 'follow' || n.type === 'follow_request';
					if (activeFilter === 'boosts') return n.type === 'reblog';
					if (activeFilter === 'favorites') return n.type === 'favourite';
					if (activeFilter === 'polls') return n.type === 'poll';
					return true;
				})
	);

	const handlers = {
		onFilterChange: (filter) => {
			activeFilter = filter;
		},
	};
</script>

<Notifications.Root notifications={filtered} {handlers}>
	<Notifications.Filter />
	{#each filtered as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

### **With Grouping**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { groupNotifications } from '@equaltoai/greater-components-fediverse/utils';

	let notifications = $state([
		/* ... */
	]);

	const groups = $derived(
		groupNotifications(notifications, {
			timeWindow: 300000, // 5 minutes
			groupableTypes: ['favourite', 'reblog', 'follow'],
		})
	);

	const handlers = {
		onGroupClick: (group) => {
			console.log('Group clicked:', group);
			// Navigate to the related status or show expanded view
		},
	};
</script>

<Notifications.Root
	{notifications}
	{groups}
	{handlers}
	config={{ mode: 'grouped', enableGrouping: true }}
>
	{#each groups as group}
		<Notifications.Group {group} />
	{/each}
</Notifications.Root>
```

---

## 🔄 Real-time Integration

### **WebSocket Subscriptions**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { createGraphQLClient } from '@equaltoai/greater-components-adapters';
	import { onMount } from 'svelte';

	let notifications = $state([]);
	let unreadCount = $state(0);

	const client = createGraphQLClient({
		url: 'wss://api.lesser.social/graphql',
		subscriptions: true,
	});

	onMount(() => {
		// Subscribe to new notifications
		const unsubscribe = client.subscribe(
			{
				query: `
        subscription OnNotificationCreated {
          notificationCreated {
            id
            type
            createdAt
            account {
              id
              username
              displayName
              avatar
            }
            status {
              id
              content
            }
            read
          }
        }
      `,
			},
			{
				next: (data) => {
					const newNotification = data.notificationCreated;
					notifications = [newNotification, ...notifications];
					if (!newNotification.read) {
						unreadCount++;
					}

					// Show browser notification if permission granted
					if (Notification.permission === 'granted') {
						new Notification('New Notification', {
							body: `${newNotification.account.displayName} ${getNotificationText(newNotification)}`,
							icon: newNotification.account.avatar,
						});
					}
				},
				error: (error) => {
					console.error('Subscription error:', error);
				},
			}
		);

		return () => {
			unsubscribe();
		};
	});

	function getNotificationText(notification) {
		const texts = {
			follow: 'followed you',
			mention: 'mentioned you',
			reblog: 'boosted your post',
			favourite: 'favorited your post',
			poll: 'poll ended',
			follow_request: 'requested to follow you',
		};
		return texts[notification.type] || 'sent a notification';
	}
</script>

<Notifications.Root {notifications} config={{ realtime: true }} initialState={{ unreadCount }}>
	<Notifications.Filter />
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

### **Polling Fallback**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { onMount } from 'svelte';

	let notifications = $state([]);
	let loading = $state(false);

	async function fetchNotifications() {
		loading = true;
		try {
			const response = await fetch('/api/notifications');
			const data = await response.json();
			notifications = data.notifications;
		} catch (error) {
			console.error('Failed to fetch notifications:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// Initial fetch
		fetchNotifications();

		// Poll every 60 seconds
		const interval = setInterval(fetchNotifications, 60000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<Notifications.Root {notifications} initialState={{ loading }}>
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

---

## 🧩 Component Reference

### **Available Components**

| Component              | Description                     | Documentation            |
| ---------------------- | ------------------------------- | ------------------------ |
| `Notifications.Root`   | Context provider and container  | [Root.md](./Root.md)     |
| `Notifications.Item`   | Individual notification display | [Item.md](./Item.md)     |
| `Notifications.Filter` | Type filter tabs                | [Filter.md](./Filter.md) |
| `Notifications.Group`  | Grouped notifications display   | [Group.md](./Group.md)   |

---

## 🎨 Theming & Customization

### **CSS Custom Properties**

```css
:root {
	/* Background colors */
	--notifications-bg: #ffffff;
	--notifications-header-bg: #f7f9fa;
	--notifications-item-bg: #ffffff;
	--notifications-item-hover-bg: #f7f9fa;
	--notifications-unread-bg: #eff6ff;
	--notifications-status-bg: #f7f9fa;
	--notifications-filter-bg: #ffffff;
	--notifications-filter-hover-bg: #f7f9fa;

	/* Border colors */
	--notifications-border: #e1e8ed;

	/* Text colors */
	--notifications-text-primary: #0f1419;
	--notifications-text-secondary: #536471;

	/* Theme colors */
	--notifications-primary: #1d9bf0;

	/* Error colors */
	--notifications-error-bg: #fee;
	--notifications-error-color: #dc2626;
	--notifications-error-border: #fcc;

	/* Spacing */
	--notifications-radius: 8px;

	/* Typography */
	--notifications-font-size-base: 1rem;
	--notifications-font-size-sm: 0.875rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
	:root {
		--notifications-bg: #15202b;
		--notifications-header-bg: #192734;
		--notifications-item-bg: #15202b;
		--notifications-item-hover-bg: #1e2732;
		--notifications-unread-bg: #1a2a3a;
		--notifications-status-bg: #192734;
		--notifications-filter-bg: #15202b;
		--notifications-filter-hover-bg: #1e2732;
		--notifications-border: #2f3336;
		--notifications-text-primary: #f7f9fa;
		--notifications-text-secondary: #8b98a5;
		--notifications-primary: #1d9bf0;
	}
}
```

### **Custom Styling Example**

```svelte
<style>
	:global(.notifications-root) {
		max-width: 600px;
		margin: 0 auto;
		border: 1px solid var(--notifications-border);
		border-radius: 12px;
		overflow: hidden;
	}

	:global(.notification-item) {
		transition: transform 0.2s;
	}

	:global(.notification-item:hover) {
		transform: translateX(4px);
	}

	:global(.notification-item--unread) {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
```

---

## ♿ Accessibility

### **ARIA Support**

All components include proper ARIA attributes:

- `role="feed"` on notification container
- `role="article"` on individual notifications
- `aria-label` for screen readers
- `aria-busy` during loading states
- `aria-current` for active filter
- `aria-hidden` for decorative icons

### **Keyboard Navigation**

| Key               | Action                          |
| ----------------- | ------------------------------- |
| `Tab`             | Navigate between notifications  |
| `Enter` / `Space` | Activate notification or filter |
| `Escape`          | Dismiss dropdown or modal       |
| `Arrow Keys`      | Navigate filter tabs            |

### **Screen Reader Announcements**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { announce } from '@equaltoai/greater-components-utils/a11y';

	const handlers = {
		onNotificationClick: (notification) => {
			announce(`Opened notification from ${notification.account.displayName}`);
		},
		onMarkAllRead: async () => {
			await markAllAsRead();
			announce('All notifications marked as read');
		},
	};
</script>
```

---

## ⚡ Performance Best Practices

### **Virtualized Scrolling**

For large notification lists, use virtualization:

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { VirtualList } from '@equaltoai/greater-components-primitives';

	let notifications = $state([
		/* ... */
	]);
</script>

<Notifications.Root {notifications}>
	<VirtualList items={notifications} estimateSize={80} overscan={5}>
		{#snippet item(notification)}
			<Notifications.Item {notification} />
		{/snippet}
	</VirtualList>
</Notifications.Root>
```

### **Lazy Loading**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';

	let notifications = $state([]);
	let hasMore = $state(true);
	let cursor = $state(null);

	async function loadMore() {
		if (!hasMore) return;

		const response = await fetch(`/api/notifications?cursor=${cursor}`);
		const data = await response.json();

		notifications = [...notifications, ...data.notifications];
		cursor = data.nextCursor;
		hasMore = data.hasMore;
	}

	const handlers = {
		onLoadMore: loadMore,
	};
</script>

<Notifications.Root
	{notifications}
	{handlers}
	initialState={{ hasMore }}
	config={{ infiniteScroll: true }}
>
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

### **Debounced Grouping**

```typescript
import { debounce } from '@equaltoai/greater-components-utils';

const groupNotificationsDebounced = debounce((notifications) => {
	return groupNotifications(notifications);
}, 300);
```

---

## 🔒 Security Considerations

### **Content Sanitization**

Always sanitize notification content:

```typescript
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(notification.status?.content || '', {
	ALLOWED_TAGS: ['p', 'br', 'a', 'span', 'strong', 'em'],
	ALLOWED_ATTR: ['href', 'class'],
});
```

### **Rate Limiting**

Implement rate limiting for notification actions:

```typescript
import { RateLimiter } from '@equaltoai/greater-components-utils';

const markReadLimiter = new RateLimiter({
	maxRequests: 10,
	windowMs: 60000, // 10 requests per minute
});

async function markAsRead(id: string) {
	if (!markReadLimiter.check()) {
		throw new Error('Rate limit exceeded');
	}

	await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
}
```

### **Privacy Protection**

- Don't expose notification IDs or internal identifiers
- Validate notification ownership before marking as read
- Use HTTPS for all notification API calls
- Implement proper authentication checks
- Sanitize all user-generated content in notifications

---

## 🧪 Testing

### **Unit Tests**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { Notifications } from '@equaltoai/greater-components-fediverse';

describe('Notifications.Item', () => {
	it('renders notification correctly', () => {
		const notification = {
			id: '1',
			type: 'follow',
			account: {
				id: 'user1',
				username: 'alice',
				displayName: 'Alice Smith',
			},
			createdAt: '2025-10-12T10:00:00Z',
			read: false,
		};

		render(Notifications.Item, { props: { notification } });

		expect(screen.getByText('Alice Smith')).toBeInTheDocument();
		expect(screen.getByText('followed you')).toBeInTheDocument();
	});

	it('marks notification as read on click', async () => {
		const markRead = vi.fn();
		const notification = { id: '1', type: 'follow', read: false /* ... */ };

		render(Notifications.Root, {
			props: {
				notifications: [notification],
				handlers: { onMarkRead: markRead },
			},
		});

		await fireEvent.click(screen.getByRole('article'));

		expect(markRead).toHaveBeenCalledWith('1');
	});
});
```

### **Integration Tests**

Test files available:

- `packages/fediverse/tests/Notifications.test.ts`
- `packages/fediverse/tests/NotificationItem.test.ts`
- `packages/fediverse/tests/NotificationsFeed.test.ts`
- `packages/fediverse/tests/notificationGrouping.test.ts`

---

## 📚 Examples

### **Complete Notification System**

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { createNotificationsStore } from '@equaltoai/greater-components-adapters';
	import { onMount } from 'svelte';

	const store = createNotificationsStore({
		endpoint: 'https://api.lesser.social/graphql',
		realtime: true,
		groupSimilar: true,
	});

	let { notifications, groups, state } = $derived(store);

	const handlers = {
		onNotificationClick: (notification) => {
			// Navigate to notification target
			if (notification.status) {
				window.location.href = `/status/${notification.status.id}`;
			} else if (notification.account) {
				window.location.href = `/@${notification.account.username}`;
			}
		},
		onMarkRead: async (id) => {
			await store.markAsRead(id);
		},
		onMarkAllRead: async () => {
			await store.markAllAsRead();
		},
		onDismiss: async (id) => {
			await store.dismiss(id);
		},
		onFilterChange: (filter) => {
			store.setFilter(filter);
		},
		onLoadMore: async () => {
			await store.loadMore();
		},
	};

	onMount(async () => {
		await store.initialize();

		// Request browser notification permission
		if (Notification.permission === 'default') {
			await Notification.requestPermission();
		}
	});
</script>

<div class="notifications-container">
	<Notifications.Root
		{notifications}
		{groups}
		{handlers}
		initialState={state}
		config={{
			mode: 'grouped',
			enableGrouping: true,
			showTimestamps: true,
			showAvatars: true,
			infiniteScroll: true,
			realtime: true,
		}}
	>
		<Notifications.Filter />

		<div class="notifications-content">
			{#if state.loading}
				<div class="loading-spinner">Loading notifications...</div>
			{:else if groups.length > 0}
				{#each groups as group}
					<Notifications.Group {group} />
				{/each}
			{:else if notifications.length > 0}
				{#each notifications as notification}
					<Notifications.Item {notification} />
				{/each}
			{:else}
				<div class="empty-state">
					<p>No notifications yet</p>
					<p class="empty-state-hint">When someone interacts with your posts, you'll see it here</p>
				</div>
			{/if}

			{#if state.hasMore}
				<button class="load-more" onclick={handlers.onLoadMore} disabled={state.loadingMore}>
					{state.loadingMore ? 'Loading...' : 'Load more'}
				</button>
			{/if}
		</div>
	</Notifications.Root>
</div>

<style>
	.notifications-container {
		max-width: 600px;
		margin: 0 auto;
		min-height: 100vh;
	}

	.notifications-content {
		padding: 1rem 0;
	}

	.loading-spinner {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary);
	}

	.empty-state {
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-state p {
		margin: 0.5rem 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.empty-state-hint {
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--text-secondary);
	}

	.load-more {
		display: block;
		width: 100%;
		padding: 1rem;
		margin: 1rem 0;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color);
		cursor: pointer;
		transition: all 0.2s;
	}

	.load-more:hover:not(:disabled) {
		background: var(--bg-hover);
	}

	.load-more:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
```

---

## 🔗 Related Documentation

- [Notifications.Root](./Root.md) - Root context provider
- [Notifications.Item](./Item.md) - Individual notification component
- [Notifications.Filter](./Filter.md) - Type filter tabs
- [Notifications.Group](./Group.md) - Grouped notification display
- [Real-time Integration Guide](../../GETTING_STARTED.md#real-time)
- [GraphQL Subscriptions](../../API_DOCUMENTATION.md#subscriptions)

---

## 📖 See Also

- [Status Components](../Status/README.md) - Status display components
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Profile Components](../Profile/README.md) - User profile components
- [ActivityPub Specification](https://www.w3.org/TR/activitypub/)
- [Mastodon API Documentation](https://docs.joinmastodon.org/client/intro/)

---

**Need Help?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
- 📧 [Email Support](mailto:support@greater.social)
