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

		it('handles initialization failure', async () => {
			vi.mocked(utils.loadFromIndexedDB).mockRejectedValue(new Error('DB Error'));
			expect(() => createOfflineStore()).not.toThrow();
			await new Promise((resolve) => setTimeout(resolve, 0));
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

		it('handles persistence failure when saving artwork', async () => {
			vi.mocked(utils.persistToIndexedDB).mockRejectedValueOnce(new Error('DB Error'));
			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			await store.saveArtwork(createMockArtworkList(1)[0]);
		});

		it('handles persistence failure when removing artwork', async () => {
			const artwork = createMockArtworkList(1)[0];
			vi.mocked(utils.loadFromIndexedDB).mockResolvedValue([artwork]);

			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			vi.mocked(utils.persistToIndexedDB).mockRejectedValueOnce(new Error('DB Error'));

			await store.removeSavedArtwork(artwork.id);
		});
	});

	describe('Sync Queue', () => {
		const mockAction = {
			action: 'create' as const,
			entityType: 'artwork' as const,
			entityId: '1',
			payload: { id: '1' },
		};

		it('queues action', async () => {
			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);

			expect(store.get().syncQueue).toHaveLength(1);
			expect(store.get().syncQueue[0].entityId).toBe('1');
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

			store.queueAction(mockAction);

			// processQueue is async but triggered without await in queueAction
			// We need to wait for it.
			await new Promise((resolve) => setTimeout(resolve, 200)); // Wait > 100ms simulated delay

			// If success, queue should be empty (or contain failures, but we simulate success)
			expect(store.get().syncQueue).toHaveLength(0);
		});

		it('keeps queue if offline', async () => {
			vi.mocked(utils.isOnline).mockReturnValue(false);
			const store = createOfflineStore({ autoSync: true });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);
			await new Promise((resolve) => setTimeout(resolve, 50));

			expect(store.get().syncQueue).toHaveLength(1);
		});

		it('retries failed items', async () => {
			const queueProcessor = vi.fn().mockRejectedValueOnce(new Error('Sync failed'));
			const store = createOfflineStore({ autoSync: true, queueProcessor });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);
			await new Promise((resolve) => setTimeout(resolve, 50));

			const queue = store.get().syncQueue;
			expect(queue).toHaveLength(1);
			expect(queue[0].retryCount).toBe(1);
		});

		it('drops items after max retries', async () => {
			const queueProcessor = vi.fn().mockRejectedValue(new Error('Sync failed'));
			const store = createOfflineStore({ autoSync: true, queueProcessor });
			await new Promise((resolve) => setTimeout(resolve, 0));

			// Manually add item with retry count 2 (so next fail makes it 3)
			// But we can't manually add easily without private access or mocking loadFromIndexedDB
			// Let's use queueAction and let it fail 3 times.
			// But verify delay or just call processQueue manually?
			// processQueue is exposed!

			store.queueAction(mockAction);
			await new Promise((resolve) => setTimeout(resolve, 50)); // Fail 1 (retry 1)

			await store.processQueue(); // Fail 2 (retry 2)
			await store.processQueue(); // Fail 3 (retry 3)
			await store.processQueue(); // Fail 4 (should drop)

			// Wait for processing
			await new Promise((resolve) => setTimeout(resolve, 50));

			const queue = store.get().syncQueue;
			expect(queue).toHaveLength(0);
		});

		it('handles persistence failure', async () => {
			// Mock persistToIndexedDB failure
			vi.mocked(utils.persistToIndexedDB).mockRejectedValueOnce(new Error('DB Error'));

			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			// This should trigger persistToIndexedDB and catch the error (console.warn)
			// We just ensure it doesn't crash
			expect(() => store.queueAction(mockAction)).not.toThrow();
		});

		it('handles persistence failure during queue processing', async () => {
			// Mock persistToIndexedDB to fail when saving queue (which happens in queueAction AND processQueue)
			// We want queueAction to succeed (first call) but processQueue to fail (second call)
			vi.mocked(utils.persistToIndexedDB)
				.mockResolvedValueOnce(undefined) // queueAction
				.mockRejectedValueOnce(new Error('DB Error')); // processQueue

			const store = createOfflineStore({ autoSync: true });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);
			await new Promise((resolve) => setTimeout(resolve, 200));

			// It should have processed (since queueProcessor is default success)
			// But failed to save empty queue to DB.
			// Should log warning.
			// We verify state is updated in memory at least.
			expect(store.get().syncQueue).toHaveLength(0);
		});

		it('explicitly processes queue', async () => {
			const store = createOfflineStore({ autoSync: false });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);
			expect(store.get().syncQueue).toHaveLength(1);

			await store.processQueue();

			expect(store.get().syncQueue).toHaveLength(0);
		});

		it('prevents concurrent processing', async () => {
			let resolveProcessor: () => void;
			const queueProcessor = vi.fn().mockImplementation(() => {
				return new Promise<void>((resolve) => {
					resolveProcessor = resolve;
				});
			});

			const store = createOfflineStore({ autoSync: false, queueProcessor });
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.queueAction(mockAction);

			// Start processing
			const p1 = store.processQueue();

			// Try to start again immediately
			const p2 = store.processQueue();

			// p2 should resolve immediately (return early)
			await p2;

			// Finish p1
			if (resolveProcessor!) resolveProcessor();
			await p1;

			expect(queueProcessor).toHaveBeenCalledTimes(1);
		});
	});

	describe('Cleanup', () => {
		it('cleans up on destroy', async () => {
			const unsubscribe = vi.fn();
			vi.mocked(utils.createNetworkObserver).mockReturnValue(unsubscribe);

			const store = createOfflineStore();
			await new Promise((resolve) => setTimeout(resolve, 0));

			store.destroy();

			expect(unsubscribe).toHaveBeenCalled();
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
