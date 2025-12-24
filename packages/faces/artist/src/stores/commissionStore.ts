/**
 * Commission Store
 *
 * Reactive state management for commission workflows.
 * Handles commission lifecycle, messaging, and real-time updates.
 *
 * @module @equaltoai/greater-components-artist/stores/commissionStore
 */

import type { CommissionData, CommissionStatus } from '../types/creative-tools.js';
import type { CommissionStore, CommissionStoreState, CommissionStoreConfig } from './types.js';
import { ReactiveState } from './utils.js';

interface GraphQLExecutor {
	query<T = unknown>(options: {
		query: string;
		variables?: Record<string, unknown>;
	}): Promise<{ data: T }>;
	mutate<T = unknown>(options: {
		mutation: string;
		variables?: Record<string, unknown>;
	}): Promise<{ data: T }>;
}

/**
 * Creates a commission store instance
 */
export function createCommissionStore(config: CommissionStoreConfig): CommissionStore {
	const { transportManager, adapter, role, userId } = config;

	// Initialize state
	const state = new ReactiveState<CommissionStoreState>({
		commissions: [],
		activeCommission: null,
		role,
		loading: false,
		error: null,
	});

	// Streaming subscription cleanup
	let streamingUnsubscribe: (() => void) | null = null;

	/**
	 * Loads commissions from the API
	 */
	async function loadCommissions(): Promise<void> {
		state.update((current) => ({ ...current, loading: true, error: null }));

		try {
			if (!adapter) {
				state.update((current) => ({ ...current, loading: false }));
				return;
			}

			const queryName = role === 'artist' ? 'GetArtistCommissions' : 'GetClientCommissions';
			const executor = adapter as unknown as GraphQLExecutor;

			type CommissionsResponse = {
				commissions: {
					edges: Array<{ node: CommissionData }>;
				};
			};

			const response = await executor.query<CommissionsResponse>({
				query: queryName,
				variables: { userId },
			});

			const commissions = response.data?.commissions?.edges?.map((edge) => edge.node) ?? [];

			state.update((current) => ({
				...current,
				commissions,
				loading: false,
			}));
		} catch (error) {
			state.update((current) => ({
				...current,
				loading: false,
				error: error instanceof Error ? error : new Error('Failed to load commissions'),
			}));
		}
	}

	/**
	 * Sets the active commission
	 */
	function setActiveCommission(id: string | null): void {
		if (id === null) {
			state.update((current) => ({ ...current, activeCommission: null }));
			return;
		}

		const commission = state.value.commissions.find((c) => c.id === id);
		state.update((current) => ({
			...current,
			activeCommission: commission ?? null,
		}));
	}

	/**
	 * Updates commission status
	 */
	async function updateStatus(id: string, status: CommissionStatus): Promise<void> {
		// Optimistic update
		state.update((current) => ({
			...current,
			commissions: current.commissions.map((c) => (c.id === id ? { ...c, status } : c)),
			activeCommission:
				current.activeCommission?.id === id
					? { ...current.activeCommission, status }
					: current.activeCommission,
		}));

		try {
			if (!adapter) return;

			const executor = adapter as unknown as GraphQLExecutor;
			await executor.mutate({
				mutation: 'UpdateCommissionStatus',
				variables: { id, status },
			});
		} catch (error) {
			// Rollback on error
			await loadCommissions();
			throw error;
		}
	}

	/**
	 * Adds a message to a commission
	 */
	async function addMessage(id: string, message: string): Promise<void> {
		try {
			if (!adapter) return;

			const executor = adapter as unknown as GraphQLExecutor;
			await executor.mutate({
				mutation: 'AddCommissionMessage',
				variables: { commissionId: id, message },
			});

			// Reload to get updated messages
			await loadCommissions();
		} catch (error) {
			state.update((current) => ({
				...current,
				error: error instanceof Error ? error : new Error('Failed to send message'),
			}));
			throw error;
		}
	}

	/**
	 * Handles real-time commission updates
	 */
	function handleCommissionUpdate(event: { type: string; data: CommissionData }): void {
		const { type, data } = event;

		switch (type) {
			case 'commission.updated':
				state.update((current) => ({
					...current,
					commissions: current.commissions.map((c) => (c.id === data.id ? data : c)),
					activeCommission:
						current.activeCommission?.id === data.id ? data : current.activeCommission,
				}));
				break;

			case 'commission.created':
				state.update((current) => ({
					...current,
					commissions: [data, ...current.commissions],
				}));
				break;

			case 'commission.message':
				// Reload to get new messages
				loadCommissions();
				break;
		}
	}

	/**
	 * Starts streaming updates
	 */
	function startStreaming(): void {
		if (!transportManager || streamingUnsubscribe) return;

		const channel =
			role === 'artist' ? `artist:${userId}:commissions` : `client:${userId}:commissions`;

		streamingUnsubscribe = transportManager.on(channel, (event: unknown) => {
			const e = event as { type: string; data: CommissionData };
			handleCommissionUpdate(e);
		});
	}

	/**
	 * Stops streaming updates
	 */
	function stopStreaming(): void {
		if (streamingUnsubscribe) {
			streamingUnsubscribe();
			streamingUnsubscribe = null;
		}
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: CommissionStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): CommissionStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		stopStreaming();
	}

	return {
		subscribe,
		get,
		destroy,
		loadCommissions,
		setActiveCommission,
		updateStatus,
		addMessage,
		startStreaming,
		stopStreaming,
	};
}
