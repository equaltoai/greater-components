# Notifications.Root

**Component**: Context Provider  
**Package**: `@equaltoai/greater-components-fediverse`  
**Status**: Production Ready ✅  
**Tests**: 18 passing tests

---

## 📋 Overview

`Notifications.Root` is the foundational component for the Notifications system. It creates and provides notification context to all child components, managing shared state, configuration, and event handlers. All Notifications components must be descendants of `Notifications.Root` to function correctly.

### **Key Features**:

- ✅ Centralized notification state management
- ✅ Shared event handlers for notification operations
- ✅ Type-safe context API
- ✅ Flexible composition with child components
- ✅ Error handling and loading states
- ✅ Unread count tracking
- ✅ Built-in "Mark all as read" functionality
- ✅ Support for both grouped and flat display modes
- ✅ Real-time updates integration
- ✅ Accessibility-first design

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
	];

	const handlers = {
		onNotificationClick: (notification) => {
			console.log('Notification clicked:', notification);
		},
		onMarkRead: async (id) => {
			await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
		},
	};
</script>

<Notifications.Root {notifications} {handlers}>
	{#each notifications as notification}
		<Notifications.Item {notification} />
	{/each}
</Notifications.Root>
```

---

## 🎛️ Props

| Prop            | Type                          | Default     | Required | Description                                       |
| --------------- | ----------------------------- | ----------- | -------- | ------------------------------------------------- |
| `notifications` | `Notification[]`              | -           | **Yes**  | Array of notification objects                     |
| `groups`        | `NotificationGroup[]`         | `undefined` | No       | Array of grouped notifications (for grouped mode) |
| `config`        | `NotificationsConfig`         | `{}`        | No       | Configuration options                             |
| `handlers`      | `NotificationsHandlers`       | `{}`        | No       | Event handlers for notification operations        |
| `initialState`  | `Partial<NotificationsState>` | `{}`        | No       | Initial state values                              |
| `children`      | `Snippet`                     | -           | No       | Child components                                  |

### **NotificationsConfig Interface**

```typescript
interface NotificationsConfig {
	/**
	 * Display mode (grouped or flat)
	 * @default 'grouped'
	 */
	mode?: 'grouped' | 'flat';

	/**
	 * Enable grouping similar notifications
	 * @default true
	 */
	enableGrouping?: boolean;

	/**
	 * Show timestamps on notifications
	 * @default true
	 */
	showTimestamps?: boolean;

	/**
	 * Show account avatars
	 * @default true
	 */
	showAvatars?: boolean;

	/**
	 * Enable infinite scroll
	 * @default true
	 */
	infiniteScroll?: boolean;

	/**
	 * Enable real-time updates via WebSocket
	 * @default false
	 */
	realtime?: boolean;

	/**
	 * Active notification filter
	 * @default 'all'
	 */
	filter?: 'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls';

	/**
	 * Custom CSS class
	 */
	class?: string;
}
```

### **NotificationsHandlers Interface**

```typescript
interface NotificationsHandlers {
	/**
	 * Called when a notification is clicked
	 */
	onNotificationClick?: (notification: Notification) => void;

	/**
	 * Called when a notification group is clicked
	 */
	onGroupClick?: (group: NotificationGroup) => void;

	/**
	 * Called when a notification should be marked as read
	 * @returns Promise or void
	 */
	onMarkRead?: (id: string) => Promise<void> | void;

	/**
	 * Called when all notifications should be marked as read
	 * @returns Promise or void
	 */
	onMarkAllRead?: () => Promise<void> | void;

	/**
	 * Called when a notification is dismissed
	 * @returns Promise or void
	 */
	onDismiss?: (id: string) => Promise<void> | void;

	/**
	 * Called when more notifications should be loaded (infinite scroll)
	 * @returns Promise or void
	 */
	onLoadMore?: () => Promise<void> | void;

	/**
	 * Called when the notification filter changes
	 */
	onFilterChange?: (filter: NotificationFilter) => void;
}
```

### **NotificationsState Interface**

```typescript
interface NotificationsState {
	/**
	 * Whether notifications are loading
	 */
	loading: boolean;

	/**
	 * Whether more notifications are being loaded
	 */
	loadingMore: boolean;

	/**
	 * Whether there are more notifications to load
	 */
	hasMore: boolean;

	/**
	 * Error state if any
	 */
	error: Error | null;

	/**
	 * Number of unread notifications
	 */
	unreadCount: number;

	/**
	 * Currently active filter
	 */
	activeFilter: NotificationFilter;
}
```

---

## 💡 Examples

### Example 1: Basic Notifications Display

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
				avatar: 'https://cdn.example.com/avatars/alice.jpg',
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
				avatar: 'https://cdn.example.com/avatars/bob.jpg',
			},
			status: {
				id: 'status1',
				content: '<p>Hello Fediverse!</p>',
				createdAt: '2025-10-11T12:00:00Z',
			},
			read: false,
		},
		{
			id: '3',
			type: 'reblog',
			createdAt: '2025-10-12T09:00:00Z',
			account: {
				id: 'user3',
				username: 'carol',
				displayName: 'Carol Davis',
				avatar: 'https://cdn.example.com/avatars/carol.jpg',
			},
			status: {
				id: 'status2',
				content: '<p>ActivityPub is amazing!</p>',
				createdAt: '2025-10-10T15:00:00Z',
			},
			read: true,
		},
		{
			id: '4',
			type: 'mention',
			createdAt: '2025-10-12T08:30:00Z',
			account: {
				id: 'user4',
				username: 'dave',
				displayName: 'Dave Wilson',
				avatar: 'https://cdn.example.com/avatars/dave.jpg',
			},
			status: {
				id: 'status3',
				content: '<p>Hey <span class="mention">@you</span> check this out!</p>',
				createdAt: '2025-10-12T08:30:00Z',
			},
			read: false,
		},
	]);

	const config = {
		mode: 'flat' as const,
		showTimestamps: true,
		showAvatars: true,
	};

	const handlers = {
		onNotificationClick: (notification: Notification) => {
			console.log('Clicked notification:', notification.id);

			// Navigate based on notification type
			if (notification.status) {
				// Navigate to the status
				window.location.href = `/status/${notification.status.id}`;
			} else if (notification.account) {
				// Navigate to the account profile
				window.location.href = `/@${notification.account.username}`;
			}
		},
	};

	// Calculate unread count
	const unreadCount = $derived(notifications.filter((n) => !n.read).length);

	const initialState = {
		unreadCount,
		loading: false,
		loadingMore: false,
		hasMore: false,
		error: null,
		activeFilter: 'all' as const,
	};
</script>

<div class="notifications-wrapper">
	<h2>Notifications</h2>

	<Notifications.Root {notifications} {config} {handlers} {initialState}>
		{#if notifications.length === 0}
			<div class="empty-state">
				<p>No notifications yet</p>
			</div>
		{:else}
			{#each notifications as notification (notification.id)}
				<Notifications.Item {notification} />
			{/each}
		{/if}
	</Notifications.Root>
</div>

<style>
	.notifications-wrapper {
		max-width: 600px;
		margin: 0 auto;
	}

	h2 {
		padding: 1rem;
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.empty-state {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary);
	}
</style>
```

### Example 2: With Real-time Updates

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { createGraphQLClient } from '@equaltoai/greater-components-adapters';
	import { onMount, onDestroy } from 'svelte';
	import type { Notification } from '@equaltoai/greater-components-fediverse/types';

	let notifications = $state<Notification[]>([]);
	let loading = $state(true);
	let error = $state<Error | null>(null);
	let unreadCount = $state(0);
	let unsubscribe: (() => void) | null = null;

	const client = createGraphQLClient({
		url: 'wss://api.lesser.social/graphql',
		subscriptions: true,
		token: localStorage.getItem('auth_token'),
	});

	const config = {
		mode: 'flat' as const,
		realtime: true,
		showTimestamps: true,
		showAvatars: true,
	};

	const handlers = {
		onNotificationClick: async (notification: Notification) => {
			// Mark as read when clicked
			if (!notification.read) {
				await markAsRead(notification.id);
			}

			// Navigate to notification target
			if (notification.status) {
				window.location.href = `/status/${notification.status.id}`;
			} else if (notification.account) {
				window.location.href = `/@${notification.account.username}`;
			}
		},

		onMarkAllRead: async () => {
			try {
				const response = await fetch('/api/notifications/read-all', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) throw new Error('Failed to mark all as read');

				// Update local state
				notifications = notifications.map((n) => ({ ...n, read: true }));
				unreadCount = 0;

				// Show success notification
				showToast('All notifications marked as read');
			} catch (err) {
				console.error('Failed to mark all as read:', err);
				error = err as Error;
			}
		},
	};

	async function fetchNotifications() {
		loading = true;
		error = null;

		try {
			const response = await fetch('/api/notifications', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			if (!response.ok) throw new Error('Failed to fetch notifications');

			const data = await response.json();
			notifications = data.notifications;
			unreadCount = data.unreadCount || notifications.filter((n) => !n.read).length;
		} catch (err) {
			console.error('Failed to fetch notifications:', err);
			error = err as Error;
		} finally {
			loading = false;
		}
	}

	async function markAsRead(id: string) {
		try {
			const response = await fetch(`/api/notifications/${id}/read`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) throw new Error('Failed to mark as read');

			// Update local state
			notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
			unreadCount = Math.max(0, unreadCount - 1);
		} catch (err) {
			console.error('Failed to mark as read:', err);
		}
	}

	function showToast(message: string) {
		// Implement toast notification
		console.log('Toast:', message);
	}

	onMount(async () => {
		// Initial fetch
		await fetchNotifications();

		// Subscribe to real-time notifications
		unsubscribe = client.subscribe(
			{
				query: `
        subscription OnNotificationCreated {
          notificationCreated {
            id
            type
            createdAt
            read
            account {
              id
              username
              displayName
              avatar
            }
            status {
              id
              content
              createdAt
            }
          }
        }
      `,
			},
			{
				next: (data) => {
					const newNotification = data.notificationCreated;

					// Add to notifications list
					notifications = [newNotification, ...notifications];

					// Update unread count
					if (!newNotification.read) {
						unreadCount++;
					}

					// Show browser notification if permission granted
					if (Notification.permission === 'granted') {
						const notif = new Notification('New Notification', {
							body: `${newNotification.account.displayName} ${getNotificationText(newNotification)}`,
							icon: newNotification.account.avatar,
							tag: newNotification.id,
						});

						notif.onclick = () => {
							window.focus();
							handlers.onNotificationClick(newNotification);
							notif.close();
						};
					}

					// Show in-app toast
					showToast(`New notification from ${newNotification.account.displayName}`);
				},
				error: (err) => {
					console.error('Subscription error:', err);
					error = err;
				},
			}
		);

		// Request browser notification permission if needed
		if (Notification.permission === 'default') {
			await Notification.requestPermission();
		}
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	function getNotificationText(notification: Notification): string {
		const texts: Record<string, string> = {
			follow: 'followed you',
			mention: 'mentioned you',
			reblog: 'boosted your post',
			favourite: 'favorited your post',
			poll: 'poll ended',
			follow_request: 'requested to follow you',
			status: 'posted',
			update: 'edited a post',
		};
		return texts[notification.type] || 'sent a notification';
	}

	const initialState = $derived({
		loading,
		loadingMore: false,
		hasMore: false,
		error,
		unreadCount,
		activeFilter: 'all' as const,
	});
</script>

<div class="notifications-container">
	<Notifications.Root {notifications} {config} {handlers} {initialState}>
		{#if loading}
			<div class="loading">
				<div class="spinner"></div>
				<p>Loading notifications...</p>
			</div>
		{:else if error}
			<div class="error">
				<p>Failed to load notifications</p>
				<button onclick={fetchNotifications}>Retry</button>
			</div>
		{:else}
			{#each notifications as notification (notification.id)}
				<Notifications.Item {notification} />
			{/each}
		{/if}
	</Notifications.Root>
</div>

<style>
	.notifications-container {
		max-width: 600px;
		margin: 0 auto;
		min-height: 100vh;
	}

	.loading,
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
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
		to {
			transform: rotate(360deg);
		}
	}

	.error button {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
</style>
```

### Example 3: With Filtering and Grouping

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { groupNotifications } from '@equaltoai/greater-components-fediverse/utils';
	import type {
		Notification,
		NotificationGroup,
	} from '@equaltoai/greater-components-fediverse/types';

	let notifications = $state<Notification[]>([
		// Sample notifications (multiple of same type to demonstrate grouping)
		{
			id: '1',
			type: 'favourite',
			createdAt: '2025-10-12T10:05:00Z',
			account: { id: 'u1', username: 'alice', displayName: 'Alice' },
			status: { id: 's1', content: '<p>My post</p>', createdAt: '2025-10-11T12:00:00Z' },
			read: false,
		},
		{
			id: '2',
			type: 'favourite',
			createdAt: '2025-10-12T10:03:00Z',
			account: { id: 'u2', username: 'bob', displayName: 'Bob' },
			status: { id: 's1', content: '<p>My post</p>', createdAt: '2025-10-11T12:00:00Z' },
			read: false,
		},
		{
			id: '3',
			type: 'favourite',
			createdAt: '2025-10-12T10:01:00Z',
			account: { id: 'u3', username: 'carol', displayName: 'Carol' },
			status: { id: 's1', content: '<p>My post</p>', createdAt: '2025-10-11T12:00:00Z' },
			read: false,
		},
		{
			id: '4',
			type: 'follow',
			createdAt: '2025-10-12T09:50:00Z',
			account: { id: 'u4', username: 'dave', displayName: 'Dave' },
			read: false,
		},
		{
			id: '5',
			type: 'follow',
			createdAt: '2025-10-12T09:48:00Z',
			account: { id: 'u5', username: 'eve', displayName: 'Eve' },
			read: false,
		},
		{
			id: '6',
			type: 'mention',
			createdAt: '2025-10-12T09:30:00Z',
			account: { id: 'u6', username: 'frank', displayName: 'Frank' },
			status: {
				id: 's2',
				content: '<p>Hey <span class="mention">@you</span></p>',
				createdAt: '2025-10-12T09:30:00Z',
			},
			read: true,
		},
	]);

	let activeFilter = $state<'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls'>(
		'all'
	);
	let useGrouping = $state(true);

	// Filter notifications based on active filter
	const filteredNotifications = $derived(() => {
		if (activeFilter === 'all') return notifications;

		const filterMap: Record<typeof activeFilter, string[]> = {
			mentions: ['mention'],
			follows: ['follow', 'follow_request'],
			boosts: ['reblog'],
			favorites: ['favourite'],
			polls: ['poll'],
			all: [],
		};

		const types = filterMap[activeFilter] || [];
		return notifications.filter((n) => types.includes(n.type));
	});

	// Group notifications if enabled
	const groups = $derived(() => {
		if (!useGrouping) return undefined;

		return groupNotifications(filteredNotifications, {
			timeWindow: 300000, // 5 minutes
			groupableTypes: ['favourite', 'reblog', 'follow'],
		});
	});

	const config = $derived({
		mode: (useGrouping ? 'grouped' : 'flat') as 'grouped' | 'flat',
		enableGrouping: useGrouping,
		showTimestamps: true,
		showAvatars: true,
		filter: activeFilter,
	});

	const handlers = {
		onNotificationClick: (notification: Notification) => {
			console.log('Notification clicked:', notification);
		},

		onGroupClick: (group: NotificationGroup) => {
			console.log('Group clicked:', group);
			// Navigate to the common target (e.g., the status that was favorited)
			if (group.notifications[0]?.status) {
				window.location.href = `/status/${group.notifications[0].status.id}`;
			}
		},

		onFilterChange: (filter: typeof activeFilter) => {
			activeFilter = filter;
		},

		onMarkAllRead: async () => {
			// Mark all filtered notifications as read
			const idsToMark = filteredNotifications.filter((n) => !n.read).map((n) => n.id);

			if (idsToMark.length === 0) return;

			try {
				await fetch('/api/notifications/read-bulk', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ids: idsToMark }),
				});

				// Update local state
				notifications = notifications.map((n) =>
					idsToMark.includes(n.id) ? { ...n, read: true } : n
				);
			} catch (err) {
				console.error('Failed to mark as read:', err);
			}
		},
	};

	const unreadCount = $derived(filteredNotifications.filter((n) => !n.read).length);

	const initialState = $derived({
		loading: false,
		loadingMore: false,
		hasMore: false,
		error: null,
		unreadCount,
		activeFilter,
	});
</script>

<div class="notifications-page">
	<header class="page-header">
		<h1>Notifications</h1>

		<div class="controls">
			<label class="toggle">
				<input type="checkbox" bind:checked={useGrouping} />
				<span>Group similar</span>
			</label>
		</div>
	</header>

	<Notifications.Root
		notifications={filteredNotifications}
		{groups}
		{config}
		{handlers}
		{initialState}
	>
		<Notifications.Filter />

		<div class="notifications-list">
			{#if useGrouping && groups && groups.length > 0}
				{#each groups as group (group.id)}
					<Notifications.Group {group} />
				{/each}
			{:else if filteredNotifications.length > 0}
				{#each filteredNotifications as notification (notification.id)}
					<Notifications.Item {notification} />
				{/each}
			{:else}
				<div class="empty-state">
					<p>No {activeFilter === 'all' ? '' : activeFilter} notifications</p>
				</div>
			{/if}
		</div>
	</Notifications.Root>
</div>

<style>
	.notifications-page {
		max-width: 600px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.toggle input {
		cursor: pointer;
	}

	.notifications-list {
		min-height: 200px;
	}

	.empty-state {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary);
	}
</style>
```

### Example 4: With Infinite Scroll

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { onMount } from 'svelte';
	import type { Notification } from '@equaltoai/greater-components-fediverse/types';

	let notifications = $state<Notification[]>([]);
	let loading = $state(false);
	let loadingMore = $state(false);
	let hasMore = $state(true);
	let cursor = $state<string | null>(null);
	let error = $state<Error | null>(null);
	let observer: IntersectionObserver | null = null;
	let loadMoreTrigger: HTMLElement | null = null;

	const config = {
		mode: 'flat' as const,
		infiniteScroll: true,
		showTimestamps: true,
		showAvatars: true,
	};

	async function loadNotifications(isInitial = false) {
		if (!isInitial && !hasMore) return;
		if (loadingMore || loading) return;

		if (isInitial) {
			loading = true;
		} else {
			loadingMore = true;
		}

		error = null;

		try {
			const url = new URL('/api/notifications', window.location.origin);
			if (cursor) {
				url.searchParams.set('cursor', cursor);
			}
			url.searchParams.set('limit', '20');

			const response = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			if (isInitial) {
				notifications = data.notifications;
			} else {
				notifications = [...notifications, ...data.notifications];
			}

			cursor = data.nextCursor;
			hasMore = data.hasMore;
		} catch (err) {
			console.error('Failed to load notifications:', err);
			error = err as Error;
		} finally {
			loading = false;
			loadingMore = false;
		}
	}

	function setupIntersectionObserver() {
		if (!loadMoreTrigger) return;

		observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && hasMore && !loadingMore) {
					loadNotifications(false);
				}
			},
			{
				root: null,
				rootMargin: '100px', // Start loading 100px before trigger is visible
				threshold: 0,
			}
		);

		observer.observe(loadMoreTrigger);
	}

	const handlers = {
		onNotificationClick: async (notification: Notification) => {
			// Mark as read
			if (!notification.read) {
				try {
					await fetch(`/api/notifications/${notification.id}/read`, {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
						},
					});

					notifications = notifications.map((n) =>
						n.id === notification.id ? { ...n, read: true } : n
					);
				} catch (err) {
					console.error('Failed to mark as read:', err);
				}
			}

			// Navigate
			if (notification.status) {
				window.location.href = `/status/${notification.status.id}`;
			} else if (notification.account) {
				window.location.href = `/@${notification.account.username}`;
			}
		},

		onLoadMore: () => loadNotifications(false),
	};

	onMount(() => {
		loadNotifications(true);
	});

	$effect(() => {
		if (loadMoreTrigger && !observer) {
			setupIntersectionObserver();
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	const unreadCount = $derived(notifications.filter((n) => !n.read).length);

	const initialState = $derived({
		loading,
		loadingMore,
		hasMore,
		error,
		unreadCount,
		activeFilter: 'all' as const,
	});
</script>

<div class="notifications-container">
	<Notifications.Root {notifications} {config} {handlers} {initialState}>
		{#if loading}
			<div class="loading-initial">
				<div class="spinner"></div>
				<p>Loading notifications...</p>
			</div>
		{:else if error && notifications.length === 0}
			<div class="error-state">
				<p>Failed to load notifications</p>
				<button onclick={() => loadNotifications(true)}>Retry</button>
			</div>
		{:else}
			{#each notifications as notification (notification.id)}
				<Notifications.Item {notification} />
			{/each}

			{#if hasMore}
				<div class="load-more-trigger" bind:this={loadMoreTrigger}>
					{#if loadingMore}
						<div class="loading-more">
							<div class="spinner-small"></div>
							<p>Loading more...</p>
						</div>
					{/if}
				</div>
			{:else if notifications.length > 0}
				<div class="end-message">
					<p>You're all caught up!</p>
				</div>
			{/if}

			{#if notifications.length === 0 && !loading}
				<div class="empty-state">
					<p>No notifications yet</p>
				</div>
			{/if}
		{/if}
	</Notifications.Root>
</div>

<style>
	.notifications-container {
		max-width: 600px;
		margin: 0 auto;
		min-height: 100vh;
	}

	.loading-initial,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
	}

	.spinner,
	.spinner-small {
		border: 3px solid var(--border-color);
		border-top-color: var(--primary-color);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.spinner {
		width: 40px;
		height: 40px;
	}

	.spinner-small {
		width: 24px;
		height: 24px;
		border-width: 2px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.load-more-trigger {
		min-height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.loading-more {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		color: var(--text-secondary);
	}

	.end-message {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary);
	}

	.error-state button {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
</style>
```

### Example 5: Advanced Integration with Store Pattern

```svelte
<script lang="ts">
	import { Notifications } from '@equaltoai/greater-components-fediverse';
	import { createNotificationsStore } from '@equaltoai/greater-components-adapters';
	import { onMount } from 'svelte';
	import type {
		Notification,
		NotificationGroup,
	} from '@equaltoai/greater-components-fediverse/types';

	// Create notifications store with full configuration
	const store = createNotificationsStore({
		endpoint: 'https://api.lesser.social/graphql',
		wsEndpoint: 'wss://api.lesser.social/graphql',
		token: localStorage.getItem('auth_token'),
		realtime: true,
		groupSimilar: true,
		maxItems: 500,
		preloadCount: 20,
		autoMarkAsRead: false,
		polling: {
			enabled: true,
			interval: 60000, // Fallback polling every 60 seconds
		},
	});

	// Reactive store values
	const { notifications, groups, state, config } = $derived(store);

	const handlers = {
		onNotificationClick: async (notification: Notification) => {
			// Mark as read
			await store.markAsRead(notification.id);

			// Navigate
			if (notification.status) {
				window.location.href = `/status/${notification.status.id}`;
			} else if (notification.account) {
				window.location.href = `/@${notification.account.username}`;
			}
		},

		onGroupClick: async (group: NotificationGroup) => {
			// Mark all in group as read
			await Promise.all(group.notifications.map((n) => store.markAsRead(n.id)));

			// Navigate to common target
			if (group.notifications[0]?.status) {
				window.location.href = `/status/${group.notifications[0].status.id}`;
			}
		},

		onMarkAllRead: async () => {
			await store.markAllAsRead();
		},

		onDismiss: async (id: string) => {
			await store.dismiss(id);
		},

		onFilterChange: (filter: 'all' | 'mentions' | 'follows' | 'boosts' | 'favorites' | 'polls') => {
			store.setFilter(filter);
		},

		onLoadMore: async () => {
			await store.loadMore();
		},
	};

	onMount(async () => {
		// Initialize store (fetch initial data, setup subscriptions)
		await store.initialize();

		// Request browser notification permission
		if (Notification.permission === 'default') {
			const permission = await Notification.requestPermission();
			console.log('Notification permission:', permission);
		}

		// Cleanup on unmount
		return () => {
			store.cleanup();
		};
	});

	// Setup browser notifications for new items
	$effect(() => {
		// Watch for new unread notifications
		if (state.unreadCount > 0 && Notification.permission === 'granted') {
			const latestUnread = notifications.find((n) => !n.read);

			if (latestUnread) {
				const browserNotif = new Notification('New Notification', {
					body: `${latestUnread.account.displayName} ${getNotificationText(latestUnread)}`,
					icon: latestUnread.account.avatar,
					tag: latestUnread.id,
					requireInteraction: false,
				});

				browserNotif.onclick = () => {
					window.focus();
					handlers.onNotificationClick(latestUnread);
					browserNotif.close();
				};

				// Auto-close after 5 seconds
				setTimeout(() => browserNotif.close(), 5000);
			}
		}
	});

	function getNotificationText(notification: Notification): string {
		const texts: Record<string, string> = {
			follow: 'followed you',
			mention: 'mentioned you',
			reblog: 'boosted your post',
			favourite: 'favorited your post',
			poll: 'poll ended',
			follow_request: 'requested to follow you',
			status: 'posted',
			update: 'edited a post',
		};
		return texts[notification.type] || 'sent a notification';
	}

	// Connection status indicator
	const connectionStatus = $derived(state.connected ? 'online' : 'offline');
</script>

<div class="notifications-app">
	<header class="app-header">
		<h1>Notifications</h1>

		<div class="header-actions">
			<div class="connection-indicator" class:connected={state.connected} title={connectionStatus}>
				<span class="status-dot"></span>
				<span class="status-text">{connectionStatus}</span>
			</div>

			{#if state.unreadCount > 0}
				<span class="unread-badge">{state.unreadCount}</span>
			{/if}
		</div>
	</header>

	<Notifications.Root {notifications} {groups} {config} {handlers} initialState={state}>
		<Notifications.Filter />

		<div class="notifications-content">
			{#if state.loading && notifications.length === 0}
				<div class="loading-state">
					<div class="spinner"></div>
					<p>Loading notifications...</p>
				</div>
			{:else if state.error}
				<div class="error-state">
					<p>Failed to load notifications</p>
					<button onclick={() => store.retry()}>Retry</button>
				</div>
			{:else if config.mode === 'grouped' && groups && groups.length > 0}
				{#each groups as group (group.id)}
					<Notifications.Group {group} />
				{/each}
			{:else if notifications.length > 0}
				{#each notifications as notification (notification.id)}
					<Notifications.Item {notification} />
				{/each}
			{:else}
				<div class="empty-state">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
						/>
					</svg>
					<h3>No notifications</h3>
					<p>When someone interacts with your posts, you'll see it here</p>
				</div>
			{/if}

			{#if state.hasMore && !state.loading}
				<div class="load-more-section">
					<button
						class="load-more-button"
						onclick={handlers.onLoadMore}
						disabled={state.loadingMore}
					>
						{#if state.loadingMore}
							<span class="button-spinner"></span>
							Loading...
						{:else}
							Load more
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</Notifications.Root>
</div>

<style>
	.notifications-app {
		max-width: 600px;
		margin: 0 auto;
		min-height: 100vh;
		background: var(--bg-primary);
	}

	.app-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-primary);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.app-header h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.connection-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #dc2626;
		animation: pulse 2s infinite;
	}

	.connection-indicator.connected .status-dot {
		background: #16a34a;
		animation: none;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.unread-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		background: var(--primary-color);
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: 10px;
	}

	.notifications-content {
		padding-bottom: 2rem;
	}

	.loading-state,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
		text-align: center;
	}

	.empty-state svg {
		width: 4rem;
		height: 4rem;
		color: var(--text-secondary);
		opacity: 0.5;
	}

	.empty-state h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0;
		color: var(--text-secondary);
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
		to {
			transform: rotate(360deg);
		}
	}

	.load-more-section {
		padding: 1rem;
	}

	.load-more-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color);
		cursor: pointer;
		transition: all 0.2s;
	}

	.load-more-button:hover:not(:disabled) {
		background: var(--bg-hover);
	}

	.load-more-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--border-color);
		border-top-color: var(--primary-color);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	.error-state button {
		padding: 0.5rem 1rem;
		background: var(--primary-color);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
</style>
```

---

## 🔄 Context API

The `Notifications.Root` component provides context to all child components through Svelte's context API.

### **Accessing Context**

Child components automatically access context:

```typescript
import { getNotificationsContext } from '@equaltoai/greater-components-fediverse/Notifications/context';

const context = getNotificationsContext();
// Access: context.notifications, context.config, context.handlers, context.state
```

### **Context Structure**

```typescript
interface NotificationsContext {
	/** Notification items */
	notifications: Notification[];

	/** Grouped notifications (if enabled) */
	groups?: NotificationGroup[];

	/** Configuration options */
	config: Required<NotificationsConfig>;

	/** Action handlers */
	handlers: NotificationsHandlers;

	/** Current state */
	state: NotificationsState;

	/** Update state helper */
	updateState: (partial: Partial<NotificationsState>) => void;
}
```

---

## 🎨 Styling

### **CSS Classes**

| Class                               | Description                      |
| ----------------------------------- | -------------------------------- |
| `.notifications-root`               | Root container element           |
| `.notifications-root--grouped`      | Applied when mode is 'grouped'   |
| `.notifications-root--flat`         | Applied when mode is 'flat'      |
| `.notifications-root--loading`      | Applied during loading state     |
| `.notifications-root__header`       | Header section with unread count |
| `.notifications-root__unread-count` | Unread count display             |
| `.notifications-root__mark-read`    | Mark all as read button          |
| `.notifications-root__error`        | Error message container          |
| `.notifications-root__content`      | Main content area                |

### **CSS Custom Properties**

```css
:root {
	--notifications-bg: #ffffff;
	--notifications-header-bg: #f7f9fa;
	--notifications-border: #e1e8ed;
	--notifications-text-primary: #0f1419;
	--notifications-text-secondary: #536471;
	--notifications-primary: #1d9bf0;
	--notifications-error-bg: #fee;
	--notifications-error-color: #dc2626;
	--notifications-error-border: #fcc;
	--notifications-radius: 8px;
	--notifications-font-size-sm: 0.875rem;
}
```

### **Custom Styling Example**

```svelte
<Notifications.Root {notifications} class="custom-notifications">
	<!-- content -->
</Notifications.Root>

<style>
	:global(.custom-notifications) {
		border: 2px solid var(--primary-color);
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.custom-notifications .notifications-root__header) {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
</style>
```

---

## ♿ Accessibility

### **ARIA Attributes**

The component includes proper ARIA attributes:

```html
<div role="feed" aria-busy="{loading}" aria-label="Notifications">
	<!-- content -->
</div>
```

### **Keyboard Navigation**

- `Tab`: Navigate to "Mark all as read" button
- `Enter` / `Space`: Activate button
- Child components handle their own keyboard navigation

### **Screen Reader Support**

- Announces unread count
- Announces loading states
- Proper semantic HTML structure

---

## 🔒 Security Considerations

### **Content Sanitization**

Always sanitize notification content before rendering:

```typescript
import DOMPurify from 'dompurify';

const sanitizedNotifications = notifications.map((n) => ({
	...n,
	status: n.status
		? {
				...n.status,
				content: DOMPurify.sanitize(n.status.content),
			}
		: undefined,
}));
```

### **Authentication**

Ensure proper authentication for notification endpoints:

```typescript
const handlers = {
	onMarkAllRead: async () => {
		const response = await fetch('/api/notifications/read-all', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Unauthorized');
		}
	},
};
```

### **Rate Limiting**

Implement rate limiting to prevent abuse:

```typescript
import { RateLimiter } from '@equaltoai/greater-components-utils';

const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });

const handlers = {
	onMarkRead: async (id: string) => {
		if (!limiter.check()) {
			throw new Error('Too many requests');
		}
		await markAsRead(id);
	},
};
```

---

## ⚡ Performance

### **Optimization Tips**

1. **Use virtualization for large lists**:

   ```svelte
   <VirtualList items={notifications} estimateSize={80}>
   	{#snippet item(notification)}
   		<Notifications.Item {notification} />
   	{/snippet}
   </VirtualList>
   ```

2. **Implement pagination**:

   ```typescript
   const handlers = {
   	onLoadMore: async () => {
   		const next = await fetchNotifications(cursor);
   		notifications = [...notifications, ...next];
   	},
   };
   ```

3. **Debounce grouping**:

   ```typescript
   const debouncedGroup = debounce(groupNotifications, 300);
   ```

4. **Memoize filtered results**:
   ```typescript
   const filtered = $derived(
   	activeFilter === 'all' ? notifications : notifications.filter(filterFn)
   );
   ```

---

## 🧪 Testing

### **Unit Tests**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Notifications } from '@equaltoai/greater-components-fediverse';

describe('Notifications.Root', () => {
	it('renders notifications correctly', () => {
		const notifications = [{ id: '1', type: 'follow', account: { displayName: 'Alice' } }];

		render(Notifications.Root, { props: { notifications } });
		expect(screen.getByRole('feed')).toBeInTheDocument();
	});

	it('shows unread count', () => {
		const notifications = [
			{ id: '1', type: 'follow', read: false },
			{ id: '2', type: 'follow', read: false },
		];

		const initialState = { unreadCount: 2 };

		render(Notifications.Root, {
			props: { notifications, initialState },
		});

		expect(screen.getByText('2 unread')).toBeInTheDocument();
	});
});
```

### **Test Files**

- `packages/fediverse/tests/Notifications.test.ts`
- `packages/fediverse/tests/NotificationsFeed.test.ts`

---

## 🔗 Related Components

- [Notifications.Item](./Item.md) - Individual notification display
- [Notifications.Filter](./Filter.md) - Type filter tabs
- [Notifications.Group](./Group.md) - Grouped notification display

---

## 📚 See Also

- [Notifications README](./README.md) - Component group overview
- [Status Components](../Status/README.md) - Status display components
- [Timeline Components](../Timeline/README.md) - Timeline feed components
- [Real-time Integration Guide](../../GETTING_STARTED.md#real-time)
- [GraphQL Subscriptions](../../API_DOCUMENTATION.md#subscriptions)

---

**Questions or Issues?**

- 📚 [Full Documentation](../../README.md)
- 💬 [Discord Community](https://discord.gg/greater)
- 🐛 [Report Issues](https://github.com/greater/components/issues)
