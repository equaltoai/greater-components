/**
 * Integration utilities for connecting stores to components
 * Provides hooks and utilities for reactive store integration
 */

import type { Status } from '../types';
import { TimelineStore, type TimelineConfig } from './timelineStore';
import { NotificationStore, type NotificationConfig } from './notificationStore';
import { TransportManager, type TransportConfig } from './transport';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import { GraphQLTimelineStore, type GraphQLTimelineView } from './graphqlTimelineStore';
import { SvelteSet } from 'svelte/reactivity';

type UnknownRecord = Record<string, unknown>;

function normalizeError(error: unknown, message: string): Error {
	const detail =
		error instanceof Error ? error.message : typeof error === 'string' ? error : undefined;
	const normalized = new Error(detail ? `${message}: ${detail}` : message);
	(normalized as { cause?: unknown }).cause = error;
	return normalized;
}

export class RealtimeErrorBoundary {
	private errorHandlers = new SvelteSet<(error: Error) => void>();

	onError(handler: (error: Error) => void): () => void {
		this.errorHandlers.add(handler);

		return () => {
			this.errorHandlers.delete(handler);
		};
	}

	handleError(error: Error): void {
		let handlerError: Error | null = null;

		for (const handler of this.errorHandlers) {
			try {
				handler(error);
			} catch (err) {
				handlerError = normalizeError(err, 'Realtime error handler failed');
			}
		}

		if (handlerError) {
			throw handlerError;
		}
	}
}

export const realtimeErrorBoundary = new RealtimeErrorBoundary();

function invokeAsync(action: () => Promise<void>, message: string): void {
	void action().catch((error) => {
		const normalized = normalizeError(error, message);
		realtimeErrorBoundary.handleError(normalized);
	});
}

export interface ConnectionConfig {
	baseUrl: string;
	accessToken?: string;
	transport?: TransportConfig;
	autoConnect?: boolean;
}

export interface TimelineIntegrationConfig extends ConnectionConfig {
	timeline?: TimelineConfig;
}

export interface NotificationIntegrationConfig extends ConnectionConfig {
	notification?: NotificationConfig;
}

/**
 * Create an integrated timeline with transport connection
 */
export function createTimelineIntegration(config: TimelineIntegrationConfig) {
	const timeline = new TimelineStore(config.timeline);
	let transport: TransportManager | null = null;
	let connected = false;

	// Create transport if configured
	if (config.transport) {
		transport = new TransportManager({
			...config.transport,
			baseUrl: config.baseUrl,
			accessToken: config.accessToken,
		});

		timeline.connectTransport(transport);
	}

	return {
		store: timeline,
		transport,

		/**
		 * Connect to the server and load initial data
		 */
		async connect(): Promise<void> {
			if (connected) return;

			try {
				// Connect transport if available
				if (transport) {
					await transport.connect();
				}

				// Load initial timeline data
				await timeline.loadInitial(config.baseUrl, config.accessToken);
				connected = true;
			} catch (error) {
				const normalized = normalizeError(error, 'Failed to connect timeline');
				realtimeErrorBoundary.handleError(normalized);
				throw normalized;
			}
		},

		/**
		 * Disconnect from the server
		 */
		disconnect(): void {
			if (transport) {
				transport.disconnect();
			}
			timeline.disconnectTransport();
			connected = false;
		},

		/**
		 * Load more recent items
		 */
		async loadNewer(): Promise<void> {
			await timeline.loadNewer(config.baseUrl, config.accessToken);
			timeline.clearUnreadCount();
		},

		/**
		 * Load older items
		 */
		async loadOlder(): Promise<void> {
			await timeline.loadOlder(config.baseUrl, config.accessToken);
		},

		/**
		 * Refresh the timeline
		 */
		async refresh(): Promise<void> {
			await timeline.refresh(config.baseUrl, config.accessToken);
		},

		/**
		 * Update a status
		 */
		updateStatus(status: Status): void {
			timeline.updateStatus(status);
		},

		/**
		 * Get reactive state
		 */
		get state() {
			return timeline.currentState;
		},

		/**
		 * Get items
		 */
		get items() {
			return timeline.items;
		},

		/**
		 * Cleanup
		 */
		destroy(): void {
			this.disconnect();
			timeline.destroy();
		},
	};
}

/**
 * Create a GraphQL integrated timeline
 */
export function createGraphQLTimelineIntegration(
	adapter: LesserGraphQLAdapter,
	view: GraphQLTimelineView
) {
	const timeline = new GraphQLTimelineStore(adapter, view);

	return {
		store: timeline,
		transport: null,

		async connect(): Promise<void> {
			await timeline.connect();
		},

		disconnect(): void {
			timeline.disconnect();
		},

		async loadNewer(): Promise<void> {
			await timeline.loadNewer();
		},

		async loadOlder(): Promise<void> {
			await timeline.loadOlder();
		},

		async refresh(): Promise<void> {
			await timeline.refresh();
		},

		updateStatus(status: Status): void {
			timeline.updateStatus(status);
		},

		get state() {
			return timeline.currentState;
		},

		get items() {
			return timeline.items;
		},

		destroy(): void {
			timeline.destroy();
		},
	};
}

/**
 * Create an integrated notification feed with transport connection
 */
export function createNotificationIntegration(config: NotificationIntegrationConfig) {
	const notifications = new NotificationStore(config.notification);
	let transport: TransportManager | null = null;
	let connected = false;

	// Create transport if configured
	if (config.transport) {
		transport = new TransportManager({
			...config.transport,
			baseUrl: config.baseUrl,
			accessToken: config.accessToken,
		});

		notifications.connectTransport(transport);
	}

	return {
		store: notifications,
		transport,

		/**
		 * Connect to the server and load initial data
		 */
		async connect(): Promise<void> {
			if (connected) return;

			try {
				// Connect transport if available
				if (transport) {
					await transport.connect();
				}

				// Load initial notification data
				await notifications.loadInitial(config.baseUrl, config.accessToken);
				connected = true;
			} catch (error) {
				const normalized = normalizeError(error, 'Failed to connect notifications');
				realtimeErrorBoundary.handleError(normalized);
				throw normalized;
			}
		},

		/**
		 * Disconnect from the server
		 */
		disconnect(): void {
			if (transport) {
				transport.disconnect();
			}
			notifications.disconnectTransport();
			connected = false;
		},

		/**
		 * Load more notifications
		 */
		async loadMore(): Promise<void> {
			await notifications.loadMore(config.baseUrl, config.accessToken);
		},

		/**
		 * Mark notification as read
		 */
		async markAsRead(notificationId: string): Promise<void> {
			await notifications.markAsRead(notificationId, config.baseUrl, config.accessToken);
		},

		/**
		 * Mark all notifications as read
		 */
		async markAllAsRead(): Promise<void> {
			await notifications.markAllAsRead(config.baseUrl, config.accessToken);
		},

		/**
		 * Dismiss notification
		 */
		async dismiss(notificationId: string): Promise<void> {
			await notifications.dismissNotification(notificationId, config.baseUrl, config.accessToken);
		},

		/**
		 * Toggle grouping
		 */
		toggleGrouping(): void {
			notifications.toggleGrouping();
		},

		/**
		 * Refresh notifications
		 */
		async refresh(): Promise<void> {
			await notifications.refresh(config.baseUrl, config.accessToken);
		},

		/**
		 * Get reactive state
		 */
		get state() {
			return notifications.currentState;
		},

		/**
		 * Get notifications
		 */
		get items() {
			return notifications.items;
		},

		/**
		 * Get notification groups
		 */
		get groups() {
			return notifications.groups;
		},

		/**
		 * Cleanup
		 */
		destroy(): void {
			this.disconnect();
			notifications.destroy();
		},
	};
}

/**
 * Utility to create a shared transport for multiple integrations
 */
export function createSharedTransport(config: TransportConfig): TransportManager {
	return new TransportManager(config);
}

/**
 * Real-time status indicator component props
 */
export interface RealtimeIndicatorProps {
	connected: boolean;
	error?: string | null;
	reconnecting?: boolean;
	className?: string;
}

type TimelineIntegrationInstance = ReturnType<typeof createTimelineIntegration>;
type NotificationIntegrationInstance = ReturnType<typeof createNotificationIntegration>;
type RealtimeIntegration = TimelineIntegrationInstance | NotificationIntegrationInstance;

type RealtimeEnhancements = {
	connected: boolean;
	onLoadMore?: () => void;
	onLoadPrevious?: () => void;
	onMarkAsRead?: (notificationId: string) => void;
	onMarkAllAsRead?: () => void;
	onDismiss?: (notificationId: string) => void;
};

type ComponentRenderer<P extends UnknownRecord> = (props: P) => unknown;

function isTimelineIntegration(
	integration: RealtimeIntegration
): integration is TimelineIntegrationInstance {
	return 'loadOlder' in integration;
}

function isNotificationIntegration(
	integration: RealtimeIntegration
): integration is NotificationIntegrationInstance {
	return 'loadMore' in integration;
}

/**
 * Higher-order function to add real-time capabilities to existing components
 */
export function withRealtime<TProps extends UnknownRecord>(
	Component: ComponentRenderer<TProps & UnknownRecord & RealtimeEnhancements>,
	integration: RealtimeIntegration
) {
	return function RealtimeWrapper(props: TProps) {
		let mounted = false;

		// Connect on mount
		$effect(() => {
			if (!mounted) {
				mounted = true;
				invokeAsync(() => integration.connect(), 'Failed to connect realtime integration');
			}

			return () => {
				if (mounted) {
					integration.disconnect();
				}
			};
		});

		const handlerProps = props as Partial<RealtimeEnhancements>;
		const rawIntegrationState = integration.state;
		const isConnected =
			typeof rawIntegrationState === 'object' &&
			rawIntegrationState !== null &&
			'connected' in rawIntegrationState &&
			typeof (rawIntegrationState as { connected?: unknown }).connected === 'boolean'
				? (rawIntegrationState as { connected: boolean }).connected
				: false;
		const timelineIntegration = isTimelineIntegration(integration) ? integration : null;
		const notificationIntegration = isNotificationIntegration(integration) ? integration : null;

		const enhancedProps: RealtimeEnhancements = {
			connected: isConnected,
			onLoadMore:
				handlerProps.onLoadMore ??
				(notificationIntegration
					? () =>
							invokeAsync(
								() => notificationIntegration.loadMore(),
								'Failed to load more notifications'
							)
					: timelineIntegration
						? () =>
								invokeAsync(
									() => timelineIntegration.loadOlder(),
									'Failed to load older timeline items'
								)
						: undefined),
			onLoadPrevious:
				handlerProps.onLoadPrevious ??
				(timelineIntegration
					? () =>
							invokeAsync(
								() => timelineIntegration.loadNewer(),
								'Failed to load newer timeline items'
							)
					: undefined),
			onMarkAsRead:
				handlerProps.onMarkAsRead ??
				(notificationIntegration
					? (notificationId: string) =>
							invokeAsync(
								() => notificationIntegration.markAsRead(notificationId),
								'Failed to mark notification as read'
							)
					: undefined),
			onMarkAllAsRead:
				handlerProps.onMarkAllAsRead ??
				(notificationIntegration
					? () =>
							invokeAsync(
								() => notificationIntegration.markAllAsRead(),
								'Failed to mark all notifications as read'
							)
					: undefined),
			onDismiss:
				handlerProps.onDismiss ??
				(notificationIntegration
					? (notificationId: string) =>
							invokeAsync(
								() => notificationIntegration.dismiss(notificationId),
								'Failed to dismiss notification'
							)
					: undefined),
		};

		const stateProps =
			typeof rawIntegrationState === 'object' && rawIntegrationState !== null
				? (rawIntegrationState as unknown as UnknownRecord)
				: {};

		const combinedProps = {
			...props,
			...stateProps,
			...enhancedProps,
		} as TProps & UnknownRecord & RealtimeEnhancements;

		return Component(combinedProps);
	};
}
