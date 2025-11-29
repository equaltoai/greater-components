/**
 * Notification store with real-time updates and grouping
 * Provides reactive state management for notification data
 */

import type { Notification, NotificationGroup } from '../types';
import type { TransportManager } from './transport';
import { groupNotifications } from '../utils/notificationGrouping';

export interface NotificationState {
	items: Notification[];
	groups: NotificationGroup[];
	loading: boolean;
	loadingMore: boolean;
	hasMore: boolean;
	error: string | null;
	lastUpdated: Date | null;
	unreadCount: number;
	totalCount: number;
	connected: boolean;
	grouped: boolean;
}

export interface NotificationConfig {
	maxItems?: number;
	preloadCount?: number;
	enableRealtime?: boolean;
	autoMarkAsRead?: boolean;
	groupSimilar?: boolean;
}

export class NotificationStore {
	private state = $state<NotificationState>({
		items: [],
		groups: [],
		loading: false,
		loadingMore: false,
		hasMore: true,
		error: null,
		lastUpdated: null,
		unreadCount: 0,
		totalCount: 0,
		connected: false,
		grouped: true,
	});

	private config: Required<NotificationConfig>;
	private transport: TransportManager | null = null;
	private itemsMap = new Map<string, Notification>();
	private abortController: AbortController | null = null;

	constructor(config: NotificationConfig = {}) {
		this.config = {
			maxItems: 500,
			preloadCount: 20,
			enableRealtime: true,
			autoMarkAsRead: false,
			groupSimilar: true,
			...config,
		};

		this.state.grouped = this.config.groupSimilar;
	}

	/**
	 * Connect to transport for real-time updates
	 */
	connectTransport(transport: TransportManager): void {
		if (this.transport) {
			this.disconnectTransport();
		}

		this.transport = transport;

		// Listen for connection status
		this.transport.on('connection.open', () => {
			this.state.connected = true;
			this.state.error = null;

			if (this.config.enableRealtime) {
				transport.subscribeToNotifications();
			}
		});

		this.transport.on('connection.close', () => {
			this.state.connected = false;
		});

		this.transport.on('connection.error', (error) => {
			this.state.connected = false;
			this.state.error = error.message;
		});

		// Listen for real-time updates
		if (this.config.enableRealtime) {
			this.transport.on('notification.new', (notification) => {
				this.addNotification(notification);
				this.updateCounts();
				this.updateGroups();
				this.state.lastUpdated = new Date();
			});

			this.transport.on('notification.update', (notification) => {
				this.updateNotification(notification);
				this.updateCounts();
				this.updateGroups();
			});
		}
	}

	/**
	 * Disconnect from transport
	 */
	disconnectTransport(): void {
		if (this.transport) {
			this.transport.off('connection.open', () => {});
			this.transport.off('connection.close', () => {});
			this.transport.off('connection.error', () => {});
			this.transport.off('notification.new', () => {});
			this.transport.off('notification.update', () => {});
			this.transport = null;
			this.state.connected = false;
		}
	}

	/**
	 * Load initial notifications
	 */
	async loadInitial(baseUrl: string, accessToken?: string): Promise<void> {
		if (this.state.loading) return;

		this.state.loading = true;
		this.state.error = null;
		this.abortController = new AbortController();

		try {
			const url = new URL('/api/v1/notifications', baseUrl);
			url.searchParams.set('limit', this.config.preloadCount.toString());

			const headers: Record<string, string> = {};
			if (accessToken) {
				headers['Authorization'] = `Bearer ${accessToken}`;
			}

			const response = await fetch(url.toString(), {
				headers,
				signal: this.abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const notifications: Notification[] = await response.json();

			this.state.items = notifications;
			this.itemsMap.clear();
			notifications.forEach((notification) => this.itemsMap.set(notification.id, notification));

			this.updateCounts();
			this.updateGroups();

			this.state.hasMore = notifications.length >= this.config.preloadCount;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error && error.name !== 'AbortError') {
				this.state.error = error.message;
			}
		} finally {
			this.state.loading = false;
			this.abortController = null;
		}
	}

	/**
	 * Load more notifications
	 */
	async loadMore(baseUrl: string, accessToken?: string): Promise<void> {
		if (this.state.loadingMore || !this.state.hasMore || this.state.items.length === 0) return;

		this.state.loadingMore = true;
		this.state.error = null;

		try {
			const url = new URL('/api/v1/notifications', baseUrl);
			const lastItem = this.state.items[this.state.items.length - 1];
			if (!lastItem) return;
			url.searchParams.set('max_id', lastItem.id);
			url.searchParams.set('limit', this.config.preloadCount.toString());

			const headers: Record<string, string> = {};
			if (accessToken) {
				headers['Authorization'] = `Bearer ${accessToken}`;
			}

			const response = await fetch(url.toString(), { headers });

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const notifications: Notification[] = await response.json();

			// Add new notifications
			notifications.forEach((notification) => this.addNotification(notification, false));

			this.updateCounts();
			this.updateGroups();

			this.state.hasMore = notifications.length >= this.config.preloadCount;
			this.state.lastUpdated = new Date();
		} catch (error) {
			if (error instanceof Error) {
				this.state.error = error.message;
			}
		} finally {
			this.state.loadingMore = false;
		}
	}

	/**
	 * Mark notification as read
	 */
	async markAsRead(notificationId: string, baseUrl: string, accessToken?: string): Promise<void> {
		const notification = this.itemsMap.get(notificationId);
		if (!notification || notification.read) return;

		// Optimistic update
		const updatedNotification = { ...notification, read: true };
		this.updateNotification(updatedNotification);

		try {
			if (baseUrl && accessToken) {
				const url = new URL(`/api/v1/notifications/${notificationId}/dismiss`, baseUrl);
				const headers = {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				};

				const response = await fetch(url.toString(), {
					method: 'POST',
					headers,
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
			}

			this.updateCounts();
			this.updateGroups();
		} catch (error) {
			// Revert optimistic update on error
			this.updateNotification(notification);
			console.error('Failed to mark notification as read:', error);
		}
	}

	/**
	 * Mark all notifications as read
	 */
	async markAllAsRead(baseUrl: string, accessToken?: string): Promise<void> {
		const unreadNotifications = this.state.items.filter((n) => !n.read);
		if (unreadNotifications.length === 0) return;

		// Optimistic update
		const originalItems = [...this.state.items];
		this.state.items.forEach((notification) => {
			if (!notification.read) {
				notification.read = true;
				this.itemsMap.set(notification.id, notification);
			}
		});

		try {
			if (baseUrl && accessToken) {
				const url = new URL('/api/v1/notifications/clear', baseUrl);
				const headers = {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				};

				const response = await fetch(url.toString(), {
					method: 'POST',
					headers,
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
			}

			this.updateCounts();
			this.updateGroups();
		} catch (error) {
			// Revert optimistic update on error
			this.state.items = originalItems;
			originalItems.forEach((notification) => this.itemsMap.set(notification.id, notification));
			console.error('Failed to mark all notifications as read:', error);
		}
	}

	/**
	 * Dismiss notification
	 */
	async dismissNotification(
		notificationId: string,
		baseUrl: string,
		accessToken?: string
	): Promise<void> {
		const notification = this.itemsMap.get(notificationId);
		if (!notification) return;

		// Remove from local state
		this.removeNotification(notificationId);

		try {
			if (baseUrl && accessToken) {
				const url = new URL(`/api/v1/notifications/${notificationId}/dismiss`, baseUrl);
				const headers = {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				};

				const response = await fetch(url.toString(), {
					method: 'POST',
					headers,
				});

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}: ${response.statusText}`);
				}
			}

			this.updateCounts();
			this.updateGroups();
		} catch (error) {
			// Revert removal on error
			this.addNotification(notification, false);
			console.error('Failed to dismiss notification:', error);
		}
	}

	/**
	 * Toggle grouping mode
	 */
	toggleGrouping(): void {
		this.state.grouped = !this.state.grouped;
		this.updateGroups();
	}

	/**
	 * Add a notification to the store
	 */
	private addNotification(notification: Notification, prepend: boolean = true): void {
		// Avoid duplicates
		if (this.itemsMap.has(notification.id)) {
			return;
		}

		this.itemsMap.set(notification.id, notification);

		if (prepend) {
			this.state.items.unshift(notification);
		} else {
			this.state.items.push(notification);
		}

		// Trim to max items
		if (this.state.items.length > this.config.maxItems) {
			const removed = prepend
				? this.state.items.splice(this.config.maxItems)
				: this.state.items.splice(0, this.state.items.length - this.config.maxItems);

			// Remove from map
			removed.forEach((n) => this.itemsMap.delete(n.id));
		}

		// Auto-mark as read if enabled
		if (this.config.autoMarkAsRead && !notification.read) {
			// This would trigger an API call in a real implementation
			setTimeout(() => {
				notification.read = true;
				this.itemsMap.set(notification.id, notification);
				this.updateCounts();
			}, 1000);
		}
	}

	/**
	 * Update a notification in the store
	 */
	private updateNotification(notification: Notification): void {
		this.itemsMap.set(notification.id, notification);
		const index = this.state.items.findIndex((n) => n.id === notification.id);
		if (index >= 0) {
			this.state.items[index] = notification;
		}
	}

	/**
	 * Remove a notification from the store
	 */
	private removeNotification(notificationId: string): void {
		this.itemsMap.delete(notificationId);
		const index = this.state.items.findIndex((n) => n.id === notificationId);
		if (index >= 0) {
			this.state.items.splice(index, 1);
		}
	}

	/**
	 * Update unread and total counts
	 */
	private updateCounts(): void {
		this.state.unreadCount = this.state.items.filter((n) => !n.read).length;
		this.state.totalCount = this.state.items.length;
	}

	/**
	 * Update notification groups
	 */
	private updateGroups(): void {
		if (this.state.grouped) {
			this.state.groups = groupNotifications(this.state.items);
		} else {
			this.state.groups = [];
		}
	}

	/**
	 * Refresh notifications
	 */
	async refresh(baseUrl: string, accessToken?: string): Promise<void> {
		this.state.items = [];
		this.state.groups = [];
		this.itemsMap.clear();
		this.state.hasMore = true;
		await this.loadInitial(baseUrl, accessToken);
	}

	/**
	 * Abort current loading operation
	 */
	abort(): void {
		if (this.abortController) {
			this.abortController.abort();
		}
	}

	/**
	 * Get current state (reactive)
	 */
	get currentState(): NotificationState {
		return this.state;
	}

	/**
	 * Get notifications array (reactive)
	 */
	get items(): Notification[] {
		return this.state.items;
	}

	/**
	 * Get notification groups (reactive)
	 */
	get groups(): NotificationGroup[] {
		return this.state.groups;
	}

	/**
	 * Get loading state
	 */
	get loading(): boolean {
		return this.state.loading;
	}

	/**
	 * Get connection status
	 */
	get connected(): boolean {
		return this.state.connected;
	}

	/**
	 * Get error message
	 */
	get error(): string | null {
		return this.state.error;
	}

	/**
	 * Get unread count
	 */
	get unreadCount(): number {
		return this.state.unreadCount;
	}

	/**
	 * Get grouped state
	 */
	get grouped(): boolean {
		return this.state.grouped;
	}

	/**
	 * Cleanup resources
	 */
	destroy(): void {
		this.abort();
		this.disconnectTransport();
		this.itemsMap.clear();
	}
}
