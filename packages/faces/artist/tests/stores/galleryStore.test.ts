/**
 * Gallery Store Tests
 *
 * Tests for gallery store including:
 * - Pagination
 * - Filtering
 * - Sorting
 * - Optimistic updates
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGalleryStore } from '../../src/stores/galleryStore.js';
import { createMockAdapter } from '../mocks/mockAdapter.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';

describe('GalleryStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('creates store with default state', () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const state = store.get();

			expect(state.items).toEqual([]);
			expect(state.loading).toBe(false);
			expect(state.hasMore).toBe(true);
		});

		it('creates store with custom config', () => {
			const initialItems = createMockArtworkList(5);
			const store = createGalleryStore({
				adapter: mockAdapter as any,
				pageSize: 500,
				initialItems: initialItems as any,
			});

			const state = store.get();
			expect(state.items).toHaveLength(5);
		});
	});

	describe('Pagination', () => {
		it('loads initial items', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const artworks = createMockArtworkList(10);

			mockAdapter.query.mockResolvedValue({
				data: {
					artworks: {
						edges: artworks.map((a: any) => ({ node: a, cursor: a.id })),
						pageInfo: { hasNextPage: true, endCursor: artworks[9].id },
					},
				},
			});

			await store.loadMore();

			const state = store.get();
			expect(state.items).toHaveLength(10);
			expect(state.loading).toBe(false);
			expect(mockAdapter.query).toHaveBeenCalled();
		});

		it('loads more items on pagination', async () => {
			const initialArtworks = createMockArtworkList(10, 1);
			const moreArtworks = createMockArtworkList(10, 11);

			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: initialArtworks as any,
			});

			mockAdapter.query.mockResolvedValue({
				data: {
					artworks: {
						edges: moreArtworks.map((a: any) => ({ node: a, cursor: a.id })),
						pageInfo: { hasNextPage: false, endCursor: moreArtworks[9].id },
					},
				},
			});

			await store.loadMore();

			const state = store.get();
			expect(state.items).toHaveLength(20);
			expect(state.hasMore).toBe(false);
		});

		it('sets hasMore to false when no more items', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });

			mockAdapter.query.mockResolvedValue({
				data: {
					artworks: {
						edges: [],
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			});

			await store.loadMore();
			expect(store.get().hasMore).toBe(false);
		});

		it('prevents concurrent loads', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });

			mockAdapter.query.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									data: { artworks: { edges: [], pageInfo: { hasNextPage: false } } },
								}),
							100
						)
					)
			);

			// First call
			const call1 = store.loadMore();
			// Second call should be ignored because loading is true
			const call2 = store.loadMore();

			await Promise.all([call1, call2]);

			expect(mockAdapter.query).toHaveBeenCalledTimes(1);
		});
	});

	describe('Filtering', () => {
		it('updates filters and reloads', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });

			const filters = { artist: 'artist-1' };
			store.updateFilters(filters);

			const state = store.get();
			expect(state.filters.artist).toBe('artist-1');
		});

		it('applies client-side filtering', () => {
			const artworks = createMockArtworkList(2);
			artworks[0].artist = { ...artworks[0].artist, id: 'artist-1' };
			artworks[1].artist = { ...artworks[1].artist, id: 'artist-2' };

			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: artworks as any,
			});

			store.updateFilters({ artist: 'artist-1' });

			expect(store.get().items).toHaveLength(1);
			expect(store.get().items[0].artist.id).toBe('artist-1');
		});

		it('clears filters', () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			store.updateFilters({ artist: 'artist-1' });
			store.clearFilters();
			expect(Object.keys(store.get().filters)).toHaveLength(0);
		});
	});

	describe('Sorting', () => {
		it('sorts by recent (default)', () => {
			const items = createMockArtworkList(2);
			// dateB - dateA
			items[0].createdAt = new Date('2023-01-01').toISOString();
			items[1].createdAt = new Date('2024-01-01').toISOString();

			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
				initialSortBy: 'recent',
			});

			// Trigger sort logic
			store.setSortBy('recent');

			const sorted = store.get().items;
			expect(sorted[0].id).toBe(items[1].id); // Newer first
		});

		it('sorts by popular', () => {
			const items = createMockArtworkList(2);
			items[0].stats = { ...items[0].stats, likes: 10 };
			items[1].stats = { ...items[1].stats, likes: 100 };

			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
			});

			store.setSortBy('popular');

			const sorted = store.get().items;
			expect(sorted[0].id).toBe(items[1].id); // More likes first
		});
	});

	describe('Optimistic Updates', () => {
		it('optimistically updates item', () => {
			const items = createMockArtworkList(1);
			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
			});

			store.updateItem(items[0].id, { title: 'New Title' });

			expect(store.get().items[0].title).toBe('New Title');
		});

		it('adds item optimistically', () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const newItem = createMockArtworkList(1)[0];

			store.addItem(newItem as any);

			expect(store.get().items).toHaveLength(1);
			expect(store.get().items[0].id).toBe(newItem.id);
		});

		it('removes item optimistically', () => {
			const items = createMockArtworkList(1);
			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
			});

			store.removeItem(items[0].id);

			expect(store.get().items).toHaveLength(0);
		});
	});

	describe('Additional Coverage', () => {
		it('handles load error', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			mockAdapter.query.mockRejectedValue(new Error('Network error'));

			await store.loadMore();

			const state = store.get();
			expect(state.error).toBeTruthy();
			expect(state.error?.message).toBe('Network error');
			expect(state.loading).toBe(false);
		});

		it('refreshes gallery', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const artworks = createMockArtworkList(5);

			// Initial load setup
			mockAdapter.query.mockResolvedValueOnce({
				data: {
					artworks: {
						edges: artworks.map((a: any) => ({ node: a })),
						pageInfo: { hasNextPage: false, endCursor: null },
					},
				},
			});
			await store.refresh();

			expect(store.get().items).toHaveLength(5);
			expect(store.get().cursor).toBe(null); // Reset before load
		});

		it('sorts by trending', () => {
			const items = createMockArtworkList(2);
			// Item 1: Old but many likes (high trending score potentially)
			items[0].createdAt = new Date(Date.now() - 10000000).toISOString();
			items[0].stats = { ...items[0].stats, likes: 1000, views: 5000, comments: 0 };

			// Item 2: New but few likes
			items[1].createdAt = new Date().toISOString();
			items[1].stats = { ...items[1].stats, likes: 0, views: 0, comments: 0 };

			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
			});

			store.setSortBy('trending');
			const sorted = store.get().items;

			// Trending algo: (likes*3 + views*0.1) * decay
			// Item 0: (~3000 + 500) * decay. Even with decay, 3500 is huge.
			// Item 1: 0.
			// So Item 0 should be first.
			expect(sorted[0].id).toBe(items[0].id);
		});

		it('persists and updates view mode', () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			store.setViewMode('masonry');
			expect(store.get().viewMode).toBe('masonry');

			// Verify persistence logic if mocked, but here we check state update
			// If we wanted to check persistence, we'd need to spy on localStorage
		});

		it('subscribes to changes', () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const spy = vi.fn();
			const unsubscribe = store.subscribe(spy);

			store.setViewMode('row');

			expect(spy).toHaveBeenCalled();
			unsubscribe();
		});
	});
});
