import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

/**
 * Push subscription data (from GraphQL)
 */
export interface PushSubscription {
	id: string;
	endpoint: string;
	keys: {
		auth: string;
		p256dh: string;
	};
	alerts: {
		follow: boolean;
		favourite: boolean;
		reblog: boolean;
		mention: boolean;
		poll: boolean;
		followRequest: boolean;
		status: boolean;
		update: boolean;
		adminSignUp: boolean;
		adminReport: boolean;
	};
	policy: string;
	serverKey?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Push notifications state
 */
export interface PushNotificationsState {
	subscription: PushSubscription | null;
	browserSubscription: globalThis.PushSubscription | null;
	loading: boolean;
	registering: boolean;
	error: string | null;
	supported: boolean;
	permission: NotificationPermission;
}

/**
 * Push state change callback
 */
export type PushStateChangeCallback = (state: PushNotificationsState) => void;

/**
 * GraphQL-backed push notifications controller.
 * Manages server-side subscription and browser Push API integration.
 */
export class PushNotificationsController {
	private readonly adapter: LesserGraphQLAdapter;
	private readonly vapidPublicKey: string;
	private readonly serviceWorkerPath: string;
	private state: PushNotificationsState = {
		subscription: null,
		browserSubscription: null,
		loading: false,
		registering: false,
		error: null,
		supported: false,
		permission: 'default',
	};
	private disposed = false;
	private changeListeners: Set<PushStateChangeCallback> = new Set();

	constructor(options: {
		adapter: LesserGraphQLAdapter;
		vapidPublicKey: string;
		serviceWorkerPath?: string;
	}) {
		this.adapter = options.adapter;
		this.vapidPublicKey = options.vapidPublicKey;
		this.serviceWorkerPath = options.serviceWorkerPath ?? '/sw.js';
		this.checkSupport();
	}

	/**
	 * Get current push notifications state
	 */
	getState(): PushNotificationsState {
		return { ...this.state };
	}

	/**
	 * Subscribe to push state changes
	 */
	subscribe(callback: PushStateChangeCallback): () => void {
		this.changeListeners.add(callback);
		callback(this.getState());
		return () => {
			this.changeListeners.delete(callback);
		};
	}

	/**
	 * Check if push notifications are supported in this environment
	 */
	private checkSupport(): void {
		const hasNavigator = typeof navigator !== 'undefined';
		const serviceWorkerContainer = hasNavigator
			? (navigator as Navigator & { serviceWorker?: ServiceWorkerContainer }).serviceWorker
			: undefined;
		const hasServiceWorker = Boolean(serviceWorkerContainer);
		const hasRegistrationAPI = typeof serviceWorkerContainer?.register === 'function';
		const hasWindow = typeof window !== 'undefined';
		const hasPushManagerInterface = hasWindow && 'PushManager' in window;
		const hasNotificationAPI = typeof Notification !== 'undefined';

		const supported =
			hasServiceWorker && hasNotificationAPI && (hasPushManagerInterface || hasRegistrationAPI);

		this.updateState({
			supported,
			permission: supported && hasNotificationAPI ? Notification.permission : 'denied',
		});
	}

	/**
	 * Initialize: load existing subscription from server
	 */
	async initialize(): Promise<void> {
		if (this.disposed) {
			throw new Error('PushNotificationsController has been destroyed');
		}

		if (!this.state.supported) {
			return;
		}

		this.updateState({ loading: true, error: null });

		try {
			const subscription = await this.adapter.getPushSubscription();
			this.updateState({
				subscription: this.normalizeSubscription(subscription),
				loading: false,
			});
		} catch {
			// Subscription might not exist yet, which is fine
			this.updateState({
				subscription: null,
				loading: false,
			});
		}
	}

	/**
	 * Register a new push notification subscription
	 */
	async register(alerts: PushSubscription['alerts']): Promise<void> {
		if (this.disposed) {
			throw new Error('PushNotificationsController has been destroyed');
		}

		if (!this.state.supported) {
			throw new Error('Push notifications are not supported in this browser');
		}

		this.updateState({ registering: true, error: null });

		try {
			// Request notification permission
			const permission = await Notification.requestPermission();
			this.updateState({ permission });

			if (permission !== 'granted') {
				throw new Error('Notification permission denied');
			}

			// Register service worker
			const registration = await this.registerServiceWorker();

			// Subscribe to push
			const browserSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey) as BufferSource,
			});

			// Get subscription details
			const subscriptionJson = browserSubscription.toJSON();
			const keys = subscriptionJson.keys;

			if (!keys || !keys['auth'] || !keys['p256dh'] || !subscriptionJson.endpoint) {
				throw new Error('Invalid push subscription');
			}

			// Register with GraphQL API
			const registered = await this.adapter.registerPushSubscription({
				endpoint: subscriptionJson.endpoint,
				keys: {
					auth: keys['auth'],
					p256dh: keys['p256dh'],
				},
				alerts,
			});

			this.updateState({
				subscription: this.normalizeSubscription(registered),
				browserSubscription,
				registering: false,
			});
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to register push notifications',
				registering: false,
			});
			throw error;
		}
	}

	/**
	 * Update push notification alert preferences
	 */
	async updateAlerts(alerts: Partial<PushSubscription['alerts']>): Promise<void> {
		if (this.disposed) {
			throw new Error('PushNotificationsController has been destroyed');
		}

		if (!this.state.subscription) {
			throw new Error('No active push subscription');
		}

		this.updateState({ loading: true, error: null });

		try {
			// Merge with existing alerts
			const mergedAlerts = {
				...this.state.subscription.alerts,
				...alerts,
			};

			const updated = await this.adapter.updatePushSubscription({
				alerts: mergedAlerts,
			});

			this.updateState({
				subscription: this.normalizeSubscription(updated),
				loading: false,
			});
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to update alert preferences',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Unregister push notifications
	 */
	async unregister(): Promise<void> {
		if (this.disposed) {
			throw new Error('PushNotificationsController has been destroyed');
		}

		this.updateState({ loading: true, error: null });

		try {
			// Unregister from server
			await this.adapter.deletePushSubscription();

			// Unsubscribe browser subscription
			if (this.state.browserSubscription) {
				await this.state.browserSubscription.unsubscribe();
			}

			this.updateState({
				subscription: null,
				browserSubscription: null,
				loading: false,
			});
		} catch (error) {
			this.updateState({
				error: error instanceof Error ? error.message : 'Failed to unregister push notifications',
				loading: false,
			});
			throw error;
		}
	}

	/**
	 * Destroy the controller and clean up resources
	 */
	destroy(): void {
		this.disposed = true;
		this.changeListeners.clear();
	}

	/**
	 * Update internal state and notify listeners
	 */
	private updateState(partial: Partial<PushNotificationsState>): void {
		this.state = { ...this.state, ...partial };
		this.notifyListeners();
	}

	/**
	 * Notify all change listeners
	 */
	private notifyListeners(): void {
		const state = this.getState();
		for (const listener of this.changeListeners) {
			try {
				listener(state);
			} catch (error) {
				console.error('Error in push notifications change listener:', error);
			}
		}
	}

	/**
	 * Register or get existing service worker
	 */
	private async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
		try {
			return await navigator.serviceWorker.register(this.serviceWorkerPath);
		} catch (error) {
			console.warn(
				'Failed to register push service worker, attempting to reuse existing one.',
				error
			);
			// Fallback: use existing registration
			return await navigator.serviceWorker.ready;
		}
	}

	/**
	 * Convert VAPID public key from base64 to Uint8Array
	 */
	private urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

		const rawData = atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	}

	/**
	 * Normalize push subscription payload from GraphQL
	 */
	private normalizeSubscription(data: unknown): PushSubscription | null {
		if (!data || typeof data !== 'object') {
			return null;
		}

		const record = data as Record<string, unknown>;
		const keys =
			typeof record['keys'] === 'object' && record['keys'] !== null
				? (record['keys'] as Record<string, unknown>)
				: {};
		const alerts =
			typeof record['alerts'] === 'object' && record['alerts'] !== null
				? (record['alerts'] as Record<string, unknown>)
				: {};

		return {
			id: String(record['id'] ?? ''),
			endpoint: String(record['endpoint'] ?? ''),
			keys: {
				auth: String(keys['auth'] ?? ''),
				p256dh: String(keys['p256dh'] ?? ''),
			},
			alerts: {
				follow: Boolean(alerts['follow'] ?? true),
				favourite: Boolean(alerts['favourite'] ?? true),
				reblog: Boolean(alerts['reblog'] ?? true),
				mention: Boolean(alerts['mention'] ?? true),
				poll: Boolean(alerts['poll'] ?? true),
				followRequest: Boolean(alerts['followRequest'] ?? true),
				status: Boolean(alerts['status'] ?? true),
				update: Boolean(alerts['update'] ?? true),
				adminSignUp: Boolean(alerts['adminSignUp']),
				adminReport: Boolean(alerts['adminReport']),
			},
			policy: String(record['policy'] ?? 'all'),
			serverKey: typeof record['serverKey'] === 'string' ? record['serverKey'] : undefined,
			createdAt: typeof record['createdAt'] === 'string' ? record['createdAt'] : undefined,
			updatedAt: typeof record['updatedAt'] === 'string' ? record['updatedAt'] : undefined,
		};
	}
}
