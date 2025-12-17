<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { get } from 'svelte/store';
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { Notification, NotificationGroup, NotificationsFeedProps } from '../types';
	import type { NotificationIntegrationConfig } from '../lib/integration';
	import { createNotificationIntegration } from '../lib/integration';
	import NotificationItem from './NotificationItem.svelte';
	import { isNotificationGroup, getItemId } from '../utils/notificationGrouping';

	interface Props extends Omit<NotificationsFeedProps, 'notifications' | 'groups'> {
		/**
		 * Array of notifications (optional when using store integration)
		 */
		notifications?: Notification[];
		/**
		 * Array of notification groups (optional when using store integration)
		 */
		groups?: NotificationGroup[];
		/**
		 * Store integration configuration (enables real-time updates)
		 */
		integration?: NotificationIntegrationConfig;
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
		/**
		 * Custom real-time indicator content
		 */
		realtimeIndicator?: Snippet<
			[
				{
					connected: boolean;
					error: string | null;
					unreadCount: number;
					onSync: () => void;
				},
			]
		>;
		/**
		 * Auto-connect on mount
		 */
		autoConnect?: boolean;
		/**
		 * Show real-time status indicator
		 */
		showRealtimeIndicator?: boolean;
	}

	let {
		notifications: propNotifications = [],
		groups: propGroups = [],
		integration,
		grouped: propGrouped = true,
		onNotificationClick,
		onMarkAsRead: propOnMarkAsRead,
		onMarkAllAsRead: propOnMarkAllAsRead,
		onDismiss: propOnDismiss,
		loading: propLoading = false,
		loadingMore: propLoadingMore = false,
		hasMore: propHasMore = false,
		onLoadMore,
		emptyStateMessage = 'No notifications yet',
		estimateSize = 120,
		overscan = 5,
		density = 'comfortable',
		className = '',
		emptyState,
		loadingState,
		notificationRenderer,
		realtimeIndicator,
		autoConnect = true,
		showRealtimeIndicator = true,
	}: Props = $props();

	// Create integration instance if config is provided

	let notificationIntegration = untrack(() =>
		integration ? createNotificationIntegration(integration) : null
	);
	let mounted = false;

	// Use store data when integration is available, otherwise fall back to props
	const notifications = $derived(
		notificationIntegration ? notificationIntegration.items : propNotifications
	);
	const groups = $derived(notificationIntegration ? notificationIntegration.groups : propGroups);
	const grouped = $derived(
		notificationIntegration ? notificationIntegration.state.grouped : propGrouped
	);
	const loading = $derived(
		notificationIntegration ? notificationIntegration.state.loading : propLoading
	);
	const loadingMore = $derived(
		notificationIntegration ? notificationIntegration.state.loadingMore : propLoadingMore
	);
	const hasMore = $derived(
		notificationIntegration ? notificationIntegration.state.hasMore : propHasMore
	);
	const connected = $derived(
		notificationIntegration ? notificationIntegration.state.connected : true
	);
	const error = $derived(notificationIntegration ? notificationIntegration.state.error : null);
	const unreadCount = $derived(
		notificationIntegration ? notificationIntegration.state.unreadCount : 0
	);

	let scrollElement = $state<HTMLDivElement>();
	let prevScrollTop = 0;
	let prevItemCount = 0;

	// Process notifications into groups or individual items
	const processedItems = $derived.by(() => {
		if (loading && notifications.length === 0) {
			return [];
		}

		if (grouped && groups.length > 0) {
			return groups;
		} else {
			return notifications;
		}
	});

	const virtualizerStore = $derived(
		scrollElement && processedItems.length > 0
			? createVirtualizer({
					count: processedItems.length,
					getScrollElement: () => scrollElement ?? null,
					estimateSize: () => estimateSize,
					overscan,
				})
			: null
	);

	const virtualItems = $derived(virtualizerStore ? get(virtualizerStore).getVirtualItems() : []);
	const totalSize = $derived(virtualizerStore ? get(virtualizerStore).getTotalSize() : 0);

	// Auto-connect on mount
	$effect(() => {
		if (!mounted && notificationIntegration && autoConnect) {
			mounted = true;
			notificationIntegration.connect().catch((err) => {
				console.error('Failed to connect notifications:', err);
			});

			return () => {
				notificationIntegration?.disconnect();
			};
		}
	});

	function handleScroll() {
		if (!scrollElement) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollElement;
		const scrollDirection = scrollTop > prevScrollTop ? 'down' : 'up';
		prevScrollTop = scrollTop;

		// Load more when scrolling near the bottom
		if (scrollDirection === 'down' && !loadingMore && hasMore) {
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			if (distanceFromBottom < 500) {
				if (notificationIntegration) {
					notificationIntegration.loadMore();
				} else {
					onLoadMore?.();
				}
			}
		}
	}

	// Preserve scroll position when items are prepended
	$effect(() => {
		if (!scrollElement) return;

		const currentItemCount = processedItems.length;

		if (currentItemCount > prevItemCount && prevItemCount > 0) {
			const prevScrollHeight = scrollElement.scrollHeight;
			// Capture scrollElement reference for closure
			const element = scrollElement;

			// Use requestAnimationFrame to wait for DOM updates
			requestAnimationFrame(() => {
				if (!element) return;
				const newScrollHeight = element.scrollHeight;
				const heightDiff = newScrollHeight - prevScrollHeight;

				// If items were likely added to the top (scroll position near top)
				if (heightDiff > 0 && element.scrollTop < 1000) {
					element.scrollTop += heightDiff;
				}
			});
		}

		prevItemCount = currentItemCount;
	});

	function handleNotificationClick(notification: Notification) {
		onNotificationClick?.(notification);

		// Auto-mark as read when clicked
		if (!notification.read) {
			handleMarkAsRead(notification.id);
		}
	}

	function handleMarkAsRead(notificationId: string) {
		if (notificationIntegration) {
			notificationIntegration.markAsRead(notificationId);
		} else {
			propOnMarkAsRead?.(notificationId);
		}
	}

	function handleDismiss(notificationId: string) {
		if (notificationIntegration) {
			notificationIntegration.dismiss(notificationId);
		} else {
			propOnDismiss?.(notificationId);
		}
	}

	function handleMarkAllAsRead() {
		if (notificationIntegration) {
			notificationIntegration.markAllAsRead();
		} else {
			propOnMarkAllAsRead?.();
		}
	}

	function handleToggleGrouping() {
		if (notificationIntegration) {
			notificationIntegration.toggleGrouping();
		}
	}

	function handleSyncClick() {
		if (notificationIntegration) {
			notificationIntegration.refresh();
		}
	}

	function handleRefresh() {
		if (notificationIntegration) {
			notificationIntegration.refresh();
		}
	}
</script>

<div
	class={`notifications-feed ${className} ${density}`}
	role="main"
	aria-label="Notifications feed"
>
	{#if showRealtimeIndicator && notificationIntegration}
		<div class="realtime-status" class:connected class:error={!!error}>
			{#if realtimeIndicator}
				{@render realtimeIndicator({ connected, error, unreadCount, onSync: handleSyncClick })}
			{:else}
				<div class="realtime-indicator">
					<div class="connection-status">
						{#if connected}
							<div class="status-dot connected" aria-label="Connected"></div>
							<span>Live</span>
						{:else if error}
							<div class="status-dot error" aria-label="Connection error"></div>
							<span>Error</span>
						{:else}
							<div class="status-dot reconnecting" aria-label="Reconnecting"></div>
							<span>Connecting...</span>
						{/if}
					</div>

					<div class="controls">
						{#if notificationIntegration && notifications.length > 0}
							<button
								class="toggle-grouping"
								onclick={handleToggleGrouping}
								aria-label="Toggle notification grouping"
								title={grouped ? 'Show individual notifications' : 'Group similar notifications'}
							>
								{grouped ? '📋' : '📝'}
							</button>
						{/if}

						{#if error}
							<button class="retry-button" onclick={handleRefresh} aria-label="Retry connection">
								Retry
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Header with mark all as read button -->
	{#if notifications.length > 0 && unreadCount > 0}
		<div class="feed-header">
			<div class="unread-indicator">
				<span class="unread-count" aria-label={`${unreadCount} unread notifications`}>
					{unreadCount} unread
				</span>
			</div>
			<button
				class="mark-all-read"
				onclick={handleMarkAllAsRead}
				aria-label="Mark all notifications as read"
			>
				Mark all as read
			</button>
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
