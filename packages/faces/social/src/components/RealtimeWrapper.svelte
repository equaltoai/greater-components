<!--
  Backward-compatible wrapper that provides real-time capabilities
  to existing components while maintaining their original APIs
-->

<script lang="ts">
	import type { Status, Notification, NotificationGroup } from '../types';
	import type {
		TimelineIntegrationConfig,
		NotificationIntegrationConfig,
	} from '../lib/integration';
	import { createTimelineIntegration, createNotificationIntegration } from '../lib/integration';
	import TimelineVirtualized from './TimelineVirtualized.svelte';
	import NotificationsFeed from './NotificationsFeed.svelte';
	import type { Snippet } from 'svelte';

	interface TimelineWrapperProps {
		component: 'timeline';
		/**
		 * Timeline integration config for real-time updates
		 */
		integration: TimelineIntegrationConfig;
		/**
		 * Original component props
		 */
		props?: {
			estimateSize?: number;
			overscan?: number;
			onLoadMore?: () => void;
			onLoadPrevious?: () => void;
			onStatusClick?: (status: Status) => void;
			gapLoader?: Snippet;
			endOfFeed?: Snippet;
			class?: string;
			density?: 'compact' | 'comfortable';
		};
		/**
		 * Auto-connect on mount
		 */
		autoConnect?: boolean;
		/**
		 * Show connection status
		 */
		showConnectionStatus?: boolean;
	}

	interface NotificationWrapperProps {
		component: 'notifications';
		/**
		 * Notification integration config for real-time updates
		 */
		integration: NotificationIntegrationConfig;
		/**
		 * Original component props
		 */
		props?: {
			grouped?: boolean;
			onNotificationClick?: (notification: Notification) => void;
			emptyStateMessage?: string;
			estimateSize?: number;
			overscan?: number;
			density?: 'compact' | 'comfortable';
			className?: string;
			emptyState?: Snippet;
			loadingState?: Snippet;
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
		};
		/**
		 * Auto-connect on mount
		 */
		autoConnect?: boolean;
		/**
		 * Show connection status
		 */
		showConnectionStatus?: boolean;
	}

	type Props = TimelineWrapperProps | NotificationWrapperProps;

	let {
		component,
		integration,
		props = {},
		autoConnect = true,
		showConnectionStatus = true,
	}: Props = $props();

	// Create appropriate integration
	let timelineIntegration =
		component === 'timeline'
			? createTimelineIntegration(integration as TimelineIntegrationConfig)
			: null;
	let notificationIntegration =
		component === 'notifications'
			? createNotificationIntegration(integration as NotificationIntegrationConfig)
			: null;

	let mounted = false;
	let connectionError = $state<string | null>(null);
	let isConnected = $state(false);

	// Auto-connect on mount
	$effect(() => {
		if (!mounted && autoConnect) {
			mounted = true;

			const connect = async () => {
				try {
					if (timelineIntegration) {
						await timelineIntegration.connect();
						isConnected = timelineIntegration.state.connected;
					} else if (notificationIntegration) {
						await notificationIntegration.connect();
						isConnected = notificationIntegration.state.connected;
					}
					connectionError = null;
				} catch (error) {
					connectionError = error instanceof Error ? error.message : 'Connection failed';
					isConnected = false;
				}
			};

			connect();

			return () => {
				if (timelineIntegration) {
					timelineIntegration.disconnect();
				} else if (notificationIntegration) {
					notificationIntegration.disconnect();
				}
			};
		}
	});

	// Monitor connection status
	$effect(() => {
		if (timelineIntegration) {
			isConnected = timelineIntegration.state.connected;
			connectionError = timelineIntegration.state.error;
		} else if (notificationIntegration) {
			isConnected = notificationIntegration.state.connected;
			connectionError = notificationIntegration.state.error;
		}
	});

	function handleRetry() {
		if (timelineIntegration) {
			timelineIntegration.connect().catch((err) => {
				connectionError = err.message;
			});
		} else if (notificationIntegration) {
			notificationIntegration.connect().catch((err) => {
				connectionError = err.message;
			});
		}
	}
</script>

<div class="realtime-wrapper">
	{#if showConnectionStatus}
		<div class="connection-status" class:connected={isConnected} class:error={!!connectionError}>
			<div class="status-indicator">
				{#if isConnected}
					<div class="status-dot connected" aria-label="Connected to real-time updates"></div>
					<span class="status-text">Live updates enabled</span>
				{:else if connectionError}
					<div class="status-dot error" aria-label="Connection error"></div>
					<span class="status-text">Connection error</span>
					<button class="retry-btn" onclick={handleRetry}>Retry</button>
				{:else}
					<div class="status-dot connecting" aria-label="Connecting"></div>
					<span class="status-text">Connecting...</span>
				{/if}
			</div>
		</div>
	{/if}

	{#if component === 'timeline' && timelineIntegration}
		<TimelineVirtualized
			items={timelineIntegration.items}
			loadingTop={timelineIntegration.state.loadingTop}
			loadingBottom={timelineIntegration.state.loadingBottom}
			endReached={timelineIntegration.state.endReached}
			onLoadMore={() => timelineIntegration.loadOlder()}
			onLoadPrevious={() => timelineIntegration.loadNewer()}
			{...props}
		/>
	{:else if component === 'notifications' && notificationIntegration}
		<NotificationsFeed
			notifications={notificationIntegration.items}
			groups={notificationIntegration.groups}
			grouped={notificationIntegration.state.grouped}
			loading={notificationIntegration.state.loading}
			loadingMore={notificationIntegration.state.loadingMore}
			hasMore={notificationIntegration.state.hasMore}
			onLoadMore={() => notificationIntegration.loadMore()}
			onMarkAsRead={(id) => notificationIntegration.markAsRead(id)}
			onMarkAllAsRead={() => notificationIntegration.markAllAsRead()}
			onDismiss={(id) => notificationIntegration.dismiss(id)}
			{...props}
		/>
	{/if}
</div>
