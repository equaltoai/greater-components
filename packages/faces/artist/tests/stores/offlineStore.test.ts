import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createOfflineStore } from '../../src/stores/offlineStore.js';
import * as utils from '../../src/stores/utils.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

// Mock utils
vi.mock('../../src/stores/utils.js', async (importOriginal) => {
	const actual = await importOriginal<typeof utils>();
	return {
		...actual,
		persistToIndexedDB: vi.fn().mockResolvedValue(undefined),
		loadFromIndexedDB: vi.fn(),
		isOnline: vi.fn(() => true),
		createNetworkObserver: vi.fn(() => () => {}),
	};
});

describe('OfflineStore', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(utils.isOnline).mockReturnValue(true);
		vi.mocked(utils.loadFromIndexedDB).mockResolvedValue([]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('creates store with default state', async () => {
			const store = createOfflineStore();
			// Wait for async init
			await new Promise((resolve) => setTimeout(resolve, 0));

			const state = store.get();
			expect(state.isOnline).toBe(true);
			expect(state.savedArtworks).toEqual([]);
		});

		it('loads saved artworks from IndexedDB', async () => {
			const artworks = createMockArtworkList(3);
			vi.mocked(utils.loadFromIndexedDB).mockImplementation(async (db, store) => {
				if (store === 'saved-artworks') return artworks;
				return [];
			});

			const store = createOfflineStore();
			// Wait for async init
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(store.get().savedArtworks).toEqual(artworks);
			expect(utils.loadFromIndexedDB).toHaveBeenCalledWith(
				expect.any(String),
				'saved-artworks',
				'artworks'
			);
		});
	});

	describe('Artwork Persistence', () => {
		it('saves artwork', async () => {
			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			const artwork = createMockArtworkList(1)[0];
			await store.saveArtwork(artwork);

			expect(store.get().savedArtworks).toHaveLength(1);
			expect(store.isArtworkSaved(artwork.id)).toBe(true);
			expect(utils.persistToIndexedDB).toHaveBeenCalledWith(
				expect.any(String),
				'saved-artworks',
				'artworks',
				expect.any(Array)
			);
		});

		it('removes saved artwork', async () => {
			const artwork = createMockArtworkList(1)[0];
			vi.mocked(utils.loadFromIndexedDB).mockResolvedValue([artwork]);

			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			await store.removeSavedArtwork(artwork.id);

			expect(store.get().savedArtworks).toHaveLength(0);
			expect(store.isArtworkSaved(artwork.id)).toBe(false);
		});

		it('enforces max saved artworks limit', async () => {
			const store = createOfflineStore({ maxSavedArtworks: 2 });
			await new Promise((resolve) => setTimeout(resolve, 0));

			const artworks = createMockArtworkList(3);

			await store.saveArtwork(artworks[0]);
			await store.saveArtwork(artworks[1]);
			await store.saveArtwork(artworks[2]);

			expect(store.get().savedArtworks).toHaveLength(2);
			expect(store.isArtworkSaved(artworks[2].id)).toBe(true);
			expect(store.isArtworkSaved(artworks[0].id)).toBe(false); // Oldest removed
		});
	});

	describe('Sync Queue', () => {
		it('queues action', async () => {
			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction({ type: 'like', data: { id: '1' } });

			expect(store.get().syncQueue).toHaveLength(1);
			expect(store.get().syncQueue[0].type).toBe('like');
			expect(utils.persistToIndexedDB).toHaveBeenCalledWith(
				expect.any(String),
				'sync-queue',
				'queue',
				expect.any(Array)
			);
		});

		it('processes queue immediately if online', async () => {
			vi.mocked(utils.isOnline).mockReturnValue(true);
			const store = createOfflineStore({ autoSync: true });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction({ type: 'like', data: { id: '1' } });

			// processQueue is async but triggered without await in queueAction
			// We need to wait for it.
			await new Promise((resolve) => setTimeout(resolve, 150)); // Wait > 100ms simulated delay

			// If success, queue should be empty (or contain failures, but we simulate success)
			expect(store.get().syncQueue).toHaveLength(0);
		});

		it('keeps queue if offline', async () => {
			vi.mocked(utils.isOnline).mockReturnValue(false);
			const store = createOfflineStore({ autoSync: true });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction({ type: 'like', data: { id: '1' } });
			await new Promise((resolve) => setTimeout(resolve, 50));

			expect(store.get().syncQueue).toHaveLength(1);
		});
	});

	describe('Network Status', () => {
		it('handles online/offline transitions', async () => {
			let onlineHandler: (() => void) | undefined;
			let offlineHandler: (() => void) | undefined;

			vi.mocked(utils.createNetworkObserver).mockImplementation((onOnline, onOffline) => {
				onlineHandler = onOnline;
				offlineHandler = onOffline;
				return () => {};
			});

			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(store.get().isOnline).toBe(true);

			if (offlineHandler) offlineHandler();
			expect(store.get().isOnline).toBe(false);

			if (onlineHandler) await onlineHandler(); // handleOnline is async
			expect(store.get().isOnline).toBe(true);
		});
	});
});
