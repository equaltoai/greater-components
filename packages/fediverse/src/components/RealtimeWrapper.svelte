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

<style>
	.realtime-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.connection-status {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
		background: var(--color-bg-secondary, #f7f9fa);
		border-bottom: 1px solid var(--color-border, #e1e8ed);
		font-size: var(--font-size-sm, 0.875rem);
		transition: all 0.2s ease;
	}

	.connection-status.connected {
		background: var(--color-success-bg, #e8f5e8);
		border-bottom-color: var(--color-success, #00ba7c);
	}

	.connection-status.error {
		background: var(--color-error-bg, #fef2f2);
		border-bottom-color: var(--color-error, #ef4444);
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs, 0.25rem);
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		animation: pulse 2s infinite;
	}

	.status-dot.connected {
		background: var(--color-success, #00ba7c);
	}

	.status-dot.error {
		background: var(--color-error, #ef4444);
	}

	.status-dot.connecting {
		background: var(--color-warning, #f59e0b);
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

	.status-text {
		font-weight: 500;
		color: var(--color-text-secondary, #536471);
	}

	.retry-btn {
		background: var(--color-error, #ef4444);
		color: white;
		border: none;
		padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
		border-radius: var(--radius-sm, 4px);
		font-size: var(--font-size-xs, 0.75rem);
		cursor: pointer;
		transition: background 0.2s ease;
		margin-left: var(--spacing-sm, 0.5rem);
	}

	.retry-btn:hover {
		background: var(--color-error-hover, #dc2626);
	}

	/* Hide connection status when not needed */
	.connection-status:not(.error):not(.connecting) {
		animation: slideUp 0.3s ease-out 3s forwards;
	}

	@keyframes slideUp {
		to {
			transform: translateY(-100%);
			opacity: 0;
			pointer-events: none;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.status-dot,
		.connection-status {
			animation: none;
		}
	}

	/* High contrast support */
	@media (prefers-contrast: high) {
		.connection-status {
			border-bottom-width: 2px;
		}

		.status-dot {
			border: 1px solid;
		}
	}
</style>
