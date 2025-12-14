/**
 * Realtime Store
 *
 * Reactive state management for WebSocket connections and real-time updates.
 * Handles subscriptions, connection state, and reconnection logic.
 *
 * @module @equaltoai/greater-components-artist/stores/realtimeStore
 */

import type {
	RealtimeStore,
	RealtimeStoreState,
	RealtimeStoreConfig,
	RealtimeEventHandler,
} from './types.js';
import { ReactiveState } from './utils.js';

/**
 * Creates a realtime store instance
 */
export function createRealtimeStore(config: RealtimeStoreConfig): RealtimeStore {
	const {
		transportManager,
		heartbeatInterval = 30000,
		maxReconnectAttempts = 5,
		reconnectDelay = 1000,
	} = config;

	// Initialize state
	const state = new ReactiveState<RealtimeStoreState>({
		connectionState: 'disconnected',
		lastHeartbeat: null,
		reconnectAttempts: 0,
		subscriptions: [],
		error: null,
	});

	// Internal tracking
	let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
	let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	const subscriptionHandlers = new Map<string, Set<RealtimeEventHandler>>();

	/**
	 * Connects to the realtime service
	 */
	async function connect(): Promise<void> {
		if (state.value.connectionState === 'connected') return;

		state.update((current) => ({
			...current,
			connectionState: 'connecting',
			error: null,
		}));

		try {
			// Connect via transport manager
			await transportManager.connect();

			state.update((current) => ({
				...current,
				connectionState: 'connected',
				lastHeartbeat: Date.now(),
				reconnectAttempts: 0,
			}));

			// Start heartbeat
			startHeartbeat();

			// Setup disconnect handler
			transportManager.on('close', () => {
				handleDisconnect();
			});
		} catch (error) {
			state.update((current) => ({
				...current,
				connectionState: 'disconnected',
				error: error instanceof Error ? error : new Error('Connection failed'),
			}));

			// Attempt reconnection
			scheduleReconnect();
		}
	}

	/**
	 * Disconnects from the realtime service
	 */
	function disconnect(): void {
		stopHeartbeat();
		clearReconnectTimer();

		transportManager.disconnect();

		state.update((current) => ({
			...current,
			connectionState: 'disconnected',
			subscriptions: [],
		}));

		subscriptionHandlers.clear();
	}

	/**
	 * Handles disconnection
	 */
	function handleDisconnect(): void {
		stopHeartbeat();

		state.update((current) => ({
			...current,
			connectionState: 'reconnecting',
		}));

		scheduleReconnect();
	}

	/**
	 * Schedules a reconnection attempt
	 */
	function scheduleReconnect(): void {
		if (state.value.reconnectAttempts >= maxReconnectAttempts) {
			state.update((current) => ({
				...current,
				connectionState: 'disconnected',
				error: new Error('Max reconnection attempts reached'),
			}));
			return;
		}

		const delay = reconnectDelay * Math.pow(2, state.value.reconnectAttempts);

		reconnectTimer = setTimeout(async () => {
			state.update((current) => ({
				...current,
				reconnectAttempts: current.reconnectAttempts + 1,
			}));

			await connect();

			// Resubscribe to all channels
			if (state.value.connectionState === 'connected') {
				resubscribeAll();
			}
		}, delay);
	}

	/**
	 * Clears reconnect timer
	 */
	function clearReconnectTimer(): void {
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
	}

	/**
	 * Starts heartbeat monitoring
	 */
	function startHeartbeat(): void {
		heartbeatTimer = setInterval(() => {
			state.update((current) => ({
				...current,
				lastHeartbeat: Date.now(),
			}));
		}, heartbeatInterval);
	}

	/**
	 * Stops heartbeat monitoring
	 */
	function stopHeartbeat(): void {
		if (heartbeatTimer) {
			clearInterval(heartbeatTimer);
			heartbeatTimer = null;
		}
	}

	/**
	 * Resubscribes to all channels after reconnection
	 */
	function resubscribeAll(): void {
		for (const [channel, handlers] of subscriptionHandlers) {
			transportManager.on(channel, (event: unknown) => {
				const e = event as { data: unknown };
				handlers.forEach((handler) => handler(e.data));
			});
		}
	}

	/**
	 * Creates a subscription to a channel
	 */
	function createSubscription(channel: string, handler: RealtimeEventHandler): () => void {
		// Track handler
		if (!subscriptionHandlers.has(channel)) {
			subscriptionHandlers.set(channel, new Set());
		}
		const handlers = subscriptionHandlers.get(channel);
		if (handlers) {
			handlers.add(handler);
		}

		// Update state
		state.update((current) => ({
			...current,
			subscriptions: [...new Set([...current.subscriptions, channel])],
		}));

		// Subscribe via transport manager
		const unsubscribe = transportManager.on(channel, (event: unknown) => {
			const e = event as { data: unknown };
			handler(e.data);
		});

		// Return cleanup function
		return () => {
			subscriptionHandlers.get(channel)?.delete(handler);

			if (subscriptionHandlers.get(channel)?.size === 0) {
				subscriptionHandlers.delete(channel);
				state.update((current) => ({
					...current,
					subscriptions: current.subscriptions.filter((s) => s !== channel),
				}));
			}

			unsubscribe();
		};
	}

	/**
	 * Subscribes to gallery updates
	 */
	function subscribeToGallery(artistId: string, handler: RealtimeEventHandler): () => void {
		return createSubscription(`gallery:${artistId}`, handler);
	}

	/**
	 * Subscribes to commission updates
	 */
	function subscribeToCommission(commissionId: string, handler: RealtimeEventHandler): () => void {
		return createSubscription(`commission:${commissionId}`, handler);
	}

	/**
	 * Subscribes to notifications
	 */
	function subscribeToNotifications(handler: RealtimeEventHandler): () => void {
		return createSubscription('notifications', handler);
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: RealtimeStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): RealtimeStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		disconnect();
	}

	return {
		subscribe,
		get,
		destroy,
		connect,
		disconnect,
		subscribeToGallery,
		subscribeToCommission,
		subscribeToNotifications,
	};
}
