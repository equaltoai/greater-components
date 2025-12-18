/**
 * Offline Store
 *
 * Reactive state management for offline support.
 * Implements REQ-NFR-003: Offline gallery support for saved works.
 *
 * @module @equaltoai/greater-components-artist/stores/offlineStore
 */

import type { ArtworkData } from '../types/artwork.js';
import type {
	OfflineStore,
	OfflineStoreState,
	OfflineStoreConfig,
	SyncQueueItem,
} from './types.js';
import {
	ReactiveState,
	persistToIndexedDB,
	loadFromIndexedDB,
	createNetworkObserver,
	isOnline,
} from './utils.js';

const DEFAULT_DB_NAME = 'artist-face-offline';
const ARTWORKS_STORE = 'saved-artworks';
const SYNC_QUEUE_STORE = 'sync-queue';

/**
 * Creates an offline store instance
 */
export function createOfflineStore(config: OfflineStoreConfig = {}): OfflineStore {
	const { dbName = DEFAULT_DB_NAME, maxSavedArtworks = 100, autoSync = true } = config;

	// Initialize state
	const state = new ReactiveState<OfflineStoreState>({
		isOnline: isOnline(),
		savedArtworks: [],
		syncQueue: [],
		lastSync: null,
		isSyncing: false,
		error: null,
	});

	// Network observer cleanup
	let networkCleanup: (() => void) | null = null;

	/**
	 * Initializes the store
	 */
	async function initialize(): Promise<void> {
		// Load saved artworks from IndexedDB
		try {
			const savedArtworks = await loadFromIndexedDB<ArtworkData[]>(
				dbName,
				ARTWORKS_STORE,
				'artworks'
			);

			const syncQueue = await loadFromIndexedDB<SyncQueueItem[]>(dbName, SYNC_QUEUE_STORE, 'queue');

			state.update((current) => ({
				...current,
				savedArtworks: savedArtworks ?? [],
				syncQueue: syncQueue ?? [],
			}));
		} catch (error) {
			console.warn('[OfflineStore] Failed to load from IndexedDB:', error);
		}

		// Setup network observer
		networkCleanup = createNetworkObserver(
			() => handleOnline(),
			() => handleOffline()
		);
	}

	/**
	 * Handles coming online
	 */
	async function handleOnline(): Promise<void> {
		state.update((current) => ({ ...current, isOnline: true }));

		if (autoSync && state.value.syncQueue.length > 0) {
			await processQueue();
		}
	}

	/**
	 * Handles going offline
	 */
	function handleOffline(): void {
		state.update((current) => ({ ...current, isOnline: false }));
	}

	/**
	 * Saves an artwork for offline viewing
	 */
	async function saveArtwork(artwork: ArtworkData): Promise<void> {
		// Check if already saved
		if (state.value.savedArtworks.some((a) => a.id === artwork.id)) {
			return;
		}

		// Enforce max limit
		let artworks = [...state.value.savedArtworks, artwork];
		if (artworks.length > maxSavedArtworks) {
			artworks = artworks.slice(-maxSavedArtworks);
		}

		state.update((current) => ({
			...current,
			savedArtworks: artworks,
		}));

		// Persist to IndexedDB
		try {
			await persistToIndexedDB(dbName, ARTWORKS_STORE, 'artworks', artworks);
		} catch (error) {
			console.warn('[OfflineStore] Failed to persist artwork:', error);
		}
	}

	/**
	 * Removes a saved artwork
	 */
	async function removeSavedArtwork(id: string): Promise<void> {
		const artworks = state.value.savedArtworks.filter((a) => a.id !== id);

		state.update((current) => ({
			...current,
			savedArtworks: artworks,
		}));

		// Persist to IndexedDB
		try {
			await persistToIndexedDB(dbName, ARTWORKS_STORE, 'artworks', artworks);
		} catch (error) {
			console.warn('[OfflineStore] Failed to remove artwork:', error);
		}
	}

	/**
	 * Checks if an artwork is saved
	 */
	function isArtworkSaved(id: string): boolean {
		return state.value.savedArtworks.some((a) => a.id === id);
	}

	/**
	 * Queues an action for sync
	 */
	function queueAction(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount'>): void {
		const queueItem: SyncQueueItem = {
			...item,
			id: `sync-${globalThis.crypto.randomUUID()}`,
			createdAt: Date.now(),
			retryCount: 0,
		};

		const queue = [...state.value.syncQueue, queueItem];

		state.update((current) => ({
			...current,
			syncQueue: queue,
		}));

		// Persist queue
		persistToIndexedDB(dbName, SYNC_QUEUE_STORE, 'queue', queue).catch((error) => {
			console.warn('[OfflineStore] Failed to persist queue:', error);
		});

		// Try to process immediately if online
		if (state.value.isOnline && autoSync) {
			processQueue().catch((error) => {
				console.warn('[OfflineStore] Failed to auto-process queue:', error);
			});
		}
	}

	/**
	 * Processes the sync queue
	 */
	async function processQueue(): Promise<void> {
		if (state.value.isSyncing || !state.value.isOnline) return;
		if (state.value.syncQueue.length === 0) return;

		state.update((current) => ({ ...current, isSyncing: true, error: null }));

		const processedIds: string[] = [];
		const failedItems: SyncQueueItem[] = [];

		for (const item of state.value.syncQueue) {
			try {
				await processQueueItem(item);
				processedIds.push(item.id);
			} catch (error) {
				console.warn('[OfflineStore] Failed to process queue item:', error);

				if (item.retryCount < 3) {
					failedItems.push({ ...item, retryCount: item.retryCount + 1 });
				}
				// Items with 3+ retries are dropped
			}
		}

		const remainingQueue = failedItems;

		state.update((current) => ({
			...current,
			syncQueue: remainingQueue,
			isSyncing: false,
			lastSync: Date.now(),
		}));

		// Persist updated queue
		await persistToIndexedDB(dbName, SYNC_QUEUE_STORE, 'queue', remainingQueue);
	}

	/**
	 * Processes a single queue item
	 */
	async function processQueueItem(item: SyncQueueItem): Promise<void> {
		if (config.queueProcessor) {
			await config.queueProcessor(item);
			return;
		}

		// This would integrate with the adapter to sync the action
		// For now, we simulate the sync
		// console.log('[OfflineStore] Processing queue item:', item);

		// Simulate network request
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	/**
	 * Clears the sync queue
	 */
	function clearQueue(): void {
		state.update((current) => ({
			...current,
			syncQueue: [],
		}));

		persistToIndexedDB(dbName, SYNC_QUEUE_STORE, 'queue', []).catch((error) => {
			console.warn('[OfflineStore] Failed to clear queue:', error);
		});
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: OfflineStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): OfflineStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		if (networkCleanup) {
			networkCleanup();
			networkCleanup = null;
		}
	}

	// Initialize on creation
	initialize();

	return {
		subscribe,
		get,
		destroy,
		saveArtwork,
		removeSavedArtwork,
		isArtworkSaved,
		queueAction,
		processQueue,
		clearQueue,
	};
}
