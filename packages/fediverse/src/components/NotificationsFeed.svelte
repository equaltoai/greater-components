<script module lang="ts">
	import type { Notification, NotificationGroup } from '../types';

	function isNotificationGroup(item: unknown): item is NotificationGroup {
		if (!item || typeof item !== 'object') {
			return false;
		}

		return 'notifications' in item && Array.isArray((item as NotificationGroup).notifications);
	}

	function getItemId(item: Notification | NotificationGroup): string {
		return isNotificationGroup(item) ? item.id : item.id;
	}
</script>

<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import type { Snippet } from 'svelte';
	import type { Notification, NotificationGroup, NotificationsFeedProps } from '../types';
	import { groupNotifications } from '../utils/notificationGrouping';
	import NotificationItem from './NotificationItem.svelte';

	interface Props extends NotificationsFeedProps {
		/**
		 * Custom empty state content
		 */
		emptyState?: Snippet;
		/**
		 * Custom loading state content
		 */
		loadingState?: Snippet;
		/**
		 * Custom notification item renderer
		 */
		notificationRenderer?: Snippet<
			[
				{
					notification: Notification;
					group?: NotificationGroup;
					isGrouped: boolean;
					onClick: (notification: Notification) => void;
					onMarkAsRead: (notificationId: string) => void;
					onDismiss: (notificationId: string) => void;
				},
			]
		>;
	}

	let {
		notifications = [],
		groups = [],
		grouped = true,
		onNotificationClick,
		onMarkAsRead,
		onMarkAllAsRead,
		onDismiss,
		loading = false,
		loadingMore = false,
		hasMore = false,
		onLoadMore,
		emptyStateMessage = 'No notifications yet',
		estimateSize = 120,
		overscan = 5,
		density = 'comfortable',
		className = '',
		emptyState,
		loadingState,
		notificationRenderer,
	}: Props = $props();

	let scrollElement = $state<HTMLDivElement>();
	let prevScrollTop = 0;
	let prevItemCount = 0;

	// Process notifications into groups or individual items
	const processedItems = $derived(() => {
		if (loading && notifications.length === 0) {
			return [];
		}

		if (grouped && groups.length > 0) {
			return groups;
		} else if (grouped) {
			return groupNotifications(notifications);
		} else {
			return notifications;
		}
	});

	const virtualizer = $derived(
		scrollElement && processedItems.length > 0
			? createVirtualizer({
					count: processedItems.length,
					getScrollElement: () => scrollElement,
					estimateSize: () => estimateSize,
					overscan,
				})
			: null
	);

	const virtualItems = $derived(virtualizer?.getVirtualItems() || []);
	const totalSize = $derived(virtualizer?.getTotalSize() || 0);

	function handleScroll() {
		if (!scrollElement || !onLoadMore || !hasMore || loadingMore) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollElement;
		const scrollDirection = scrollTop > prevScrollTop ? 'down' : 'up';
		prevScrollTop = scrollTop;

		// Load more when scrolling near the bottom
		if (scrollDirection === 'down') {
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			if (distanceFromBottom < 500) {
				onLoadMore();
			}
		}
	}

	// Preserve scroll position when items are prepended
	$effect(() => {
		if (!scrollElement) return;

		const currentItemCount = processedItems.length;

		if (currentItemCount > prevItemCount && prevItemCount > 0) {
			const prevScrollHeight = scrollElement.scrollHeight;

			// Use requestAnimationFrame to wait for DOM updates
			requestAnimationFrame(() => {
				const newScrollHeight = scrollElement.scrollHeight;
				const heightDiff = newScrollHeight - prevScrollHeight;

				// If items were likely added to the top (scroll position near top)
				if (heightDiff > 0 && scrollElement.scrollTop < 1000) {
					scrollElement.scrollTop += heightDiff;
				}
			});
		}

		prevItemCount = currentItemCount;
	});

	function handleNotificationClick(notification: Notification) {
		onNotificationClick?.(notification);

		// Auto-mark as read when clicked
		if (!notification.read) {
			onMarkAsRead?.(notification.id);
		}
	}

	function handleMarkAsRead(notificationId: string) {
		onMarkAsRead?.(notificationId);
	}

	function handleDismiss(notificationId: string) {
		onDismiss?.(notificationId);
	}

	function handleMarkAllAsRead() {
		onMarkAllAsRead?.();
	}

	// Count unread notifications
	const unreadCount = $derived(() => {
		return notifications.filter((n) => !n.read).length;
	});
</script>

<div
	class={`notifications-feed ${className} ${density}`}
	role="main"
	aria-label="Notifications feed"
>
	<!-- Header with mark all as read button -->
	{#if notifications.length > 0 && unreadCount > 0}
		<div class="feed-header">
			<div class="unread-indicator">
				<span class="unread-count" aria-label={`${unreadCount} unread notifications`}>
					{unreadCount} unread
				</span>
			</div>
			{#if onMarkAllAsRead}
				<button
					class="mark-all-read"
					onclick={handleMarkAllAsRead}
					aria-label="Mark all notifications as read"
				>
					Mark all as read
				</button>
			{/if}
		</div>
	{/if}

	<!-- Loading state -->
	{#if loading && notifications.length === 0}
		<div class="loading-container" aria-live="polite">
			{#if loadingState}
				{@render loadingState()}
			{:else}
				<div class="loading-spinner" aria-label="Loading notifications"></div>
				<p>Loading notifications...</p>
			{/if}
		</div>
	{:else if processedItems.length === 0}
		<!-- Empty state -->
		<div class="empty-state" role="status" aria-live="polite">
			{#if emptyState}
				{@render emptyState()}
			{:else}
				<div class="empty-icon">🔔</div>
				<h2>No notifications</h2>
				<p>{emptyStateMessage}</p>
			{/if}
		</div>
	{:else}
		<!-- Virtualized notifications list -->
		<div
			class="notifications-scroll"
			bind:this={scrollElement}
			onscroll={handleScroll}
			role="feed"
			aria-label="Notifications"
			aria-busy={loadingMore}
		>
			<div class="virtual-list" style={`height: ${totalSize}px; position: relative;`}>
				{#each virtualItems as virtualItem (getItemId(processedItems[virtualItem.index]))}
					{@const item = processedItems[virtualItem.index]}
					{#if item}
						<div
							data-index={virtualItem.index}
							style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: {virtualItem.size}px;
                transform: translateY({virtualItem.start}px);
              "
						>
							{#if notificationRenderer}
								{@render notificationRenderer({
									notification: isNotificationGroup(item) ? item.sampleNotification : item,
									group: isNotificationGroup(item) ? item : undefined,
									isGrouped: grouped,
									onClick: handleNotificationClick,
									onMarkAsRead: handleMarkAsRead,
									onDismiss: handleDismiss,
								})}
							{:else}
								<NotificationItem
									notification={isNotificationGroup(item) ? item.sampleNotification : item}
									group={isNotificationGroup(item) ? item : undefined}
									{density}
									onClick={handleNotificationClick}
									onMarkAsRead={handleMarkAsRead}
									onDismiss={handleDismiss}
								/>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- Load more indicator -->
			{#if loadingMore}
				<div class="load-more-indicator" aria-live="polite">
					<div class="loading-spinner" aria-label="Loading more notifications"></div>
					<p>Loading more...</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
