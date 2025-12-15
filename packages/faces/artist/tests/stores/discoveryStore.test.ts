/**
 * Discovery Store Tests
 *
 * Tests for discovery store including:
 * - Search debouncing
 * - Filter combination
 * - Search history
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDiscoveryStore } from '../../src/stores/discoveryStore.js';
import { createMockAdapter } from '../mocks/mockAdapter.js';
import { createMockArtworkList } from '../mocks/mockArtwork.js';
import * as utils from '../../src/stores/utils.js';

// Mock persistance but keep other utils
vi.mock('../../src/stores/utils.js', async (importOriginal) => {
	const actual = await importOriginal<typeof utils>();
	return {
		...actual,
		loadFromLocalStorage: vi.fn((_key, def) => def),
		persistToLocalStorage: vi.fn(),
	};
});

const tick = () => Promise.resolve();

describe('DiscoveryStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.useFakeTimers();
		vi.mocked(utils.loadFromLocalStorage).mockClear();
		vi.mocked(utils.persistToLocalStorage).mockClear();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Search Debouncing', () => {
		it('debounces search queries', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 300 });
			const artworks = createMockArtworkList(1);

			mockAdapter.query.mockResolvedValue({
				data: { discoverArtworks: { edges: artworks.map((a) => ({ node: a })) } },
			});

			store.search('a');
			store.search('ab');
			store.search('abc');

			expect(mockAdapter.query).not.toHaveBeenCalled();

			vi.advanceTimersByTime(300);
			await tick();

			expect(mockAdapter.query).toHaveBeenCalledTimes(1);
			expect(mockAdapter.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({ query: 'abc' }),
				})
			);
		});

		it('executes search immediately if enough time passes', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 300 });

			mockAdapter.query.mockResolvedValue({
				data: { discoverArtworks: { edges: [] } },
			});

			store.search('query1');
			vi.advanceTimersByTime(300);
			await tick();
			expect(mockAdapter.query).toHaveBeenCalledTimes(1);

			store.search('query2');
			vi.advanceTimersByTime(300);
			await tick();

			expect(mockAdapter.query).toHaveBeenCalledTimes(2);
		});
	});

	describe('Filter Combination', () => {
		it('combines query and filters', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });

			mockAdapter.query.mockResolvedValue({
				data: { discoverArtworks: { edges: [] } },
			});

			store.updateFilters({ styles: ['Abstract'], mediums: ['Digital'] });

			store.search('test');
			vi.advanceTimersByTime(1);
			await tick();

			expect(mockAdapter.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: expect.objectContaining({
						query: 'test',
						styles: ['Abstract'],
					}),
				})
			);
		});

		it('clears individual filter', () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any });
			store.updateFilters({ mood: { energy: 0.5, valence: 0.5 } });

			store.updateFilters({ mood: undefined });
			expect(store.get().filters.mood).toBeUndefined();
		});

		it('clears all filters', () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any });
			store.updateFilters({ styles: ['Abstract'] });
			store.clearFilters();
			expect(Object.keys(store.get().filters)).toHaveLength(0);
		});
	});

	describe('Search History', () => {
		it('saves search to history', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			mockAdapter.query.mockResolvedValue({ data: {} });

			store.search('landscape');
			vi.advanceTimersByTime(1);
			await tick();

			expect(store.get().recentSearches).toContain('landscape');
		});

		it('limits history size', async () => {
			const maxHistory = 5;
			const store = createDiscoveryStore({
				adapter: mockAdapter as any,
				debounceMs: 0,
				maxRecentSearches: maxHistory,
			});
			mockAdapter.query.mockResolvedValue({ data: {} });

			for (let i = 0; i < maxHistory + 2; i++) {
				store.search(`search ${i}`);
				vi.advanceTimersByTime(1);
				await tick();
			}

			expect(store.get().recentSearches.length).toBe(maxHistory);
			expect(store.get().recentSearches[0]).toBe('search 6'); // Most recent first
		});

		it('clears history', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			mockAdapter.query.mockResolvedValue({ data: {} });
			store.search('test');
			vi.advanceTimersByTime(1);
			await tick();

			expect(store.get().recentSearches).toHaveLength(1);

			store.clearRecentSearches();
			expect(store.get().recentSearches).toHaveLength(0);
		});
	});

	describe('Saved Searches', () => {
		it('saves a search', () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any });
			store.search('favorite');
			store.updateFilters({ styles: ['Pop Art'] });

			store.saveSearch('My Search');

			const saved = store.get().savedSearches;
			expect(saved).toHaveLength(1);
			expect(saved[0]?.name).toBe('My Search');
			expect(saved[0]?.query).toBe('favorite');
			expect(saved[0]?.filters.styles).toContain('Pop Art');
		});

		it('deletes a saved search', () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any });
			store.saveSearch('To Delete');
			const id = store.get().savedSearches[0]?.id;

			if (id) {
				store.deleteSavedSearch(id);
			}
			expect(store.get().savedSearches).toHaveLength(0);
		});
	});

	describe('Suggestions', () => {
		it('loads suggestions based on query', async () => {
			const store = createDiscoveryStore({
				adapter: mockAdapter as any,
				enableSuggestions: true,
			});
			const artworks = createMockArtworkList(2);

			mockAdapter.query.mockResolvedValue({
				data: { artworkSuggestions: { edges: artworks.map((a) => ({ node: a })) } },
			});

			await store.loadSuggestions();

			expect(store.get().suggestions).toHaveLength(2);
			expect(mockAdapter.query).toHaveBeenCalledWith(
				expect.objectContaining({
					query: 'GetArtworkSuggestions',
				})
			);
		});
	});

	describe('State Transitions & Error Handling', () => {
		it('sets loading state during search', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			let resolveQuery: (val: any) => void = () => {};
			const queryPromise = new Promise((resolve) => {
				resolveQuery = resolve;
			});

			mockAdapter.query.mockReturnValue(queryPromise);

			store.search('loading test');
			vi.advanceTimersByTime(1);

			expect(store.get().loading).toBe(true);

			// Flush microtasks to allow query promise resolution to proceed
			if (resolveQuery) resolveQuery({ data: { discoverArtworks: { edges: [] } } });
			// Flush microtasks to allow query promise resolution to proceed
			await tick();

			expect(store.get().loading).toBe(false);
		});

		it('handles search error', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			mockAdapter.query.mockRejectedValue(new Error('Search failed'));

			store.search('error test');
			vi.advanceTimersByTime(1);
			// Allow promise rejection to process
			await tick();

			expect(store.get().error).toBeTruthy();
			expect(store.get().loading).toBe(false);
		});

		it('replaces results on new search', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			const initialArtworks = createMockArtworkList(2);
			const newArtworks = createMockArtworkList(1);
			if (newArtworks[0]) newArtworks[0].id = 'new-1';

			// First search
			mockAdapter.query.mockResolvedValueOnce({
				data: { discoverArtworks: { edges: initialArtworks.map((a) => ({ node: a })) } },
			});
			store.search('first');
			vi.advanceTimersByTime(1);
			await tick();
			expect(store.get().results).toHaveLength(2);

			// Second search
			mockAdapter.query.mockResolvedValueOnce({
				data: { discoverArtworks: { edges: newArtworks.map((a) => ({ node: a })) } },
			});
			store.search('second');
			vi.advanceTimersByTime(1);
			await tick();

			expect(store.get().results).toHaveLength(1);
			expect(store.get().results[0]?.id).toBe('new-1');
		});

		it('clears results on empty query and no filters', async () => {
			const store = createDiscoveryStore({ adapter: mockAdapter as any, debounceMs: 0 });
			// Setup initial state
			mockAdapter.query.mockResolvedValueOnce({
				data: { discoverArtworks: { edges: createMockArtworkList(1).map((a) => ({ node: a })) } },
			});
			store.search('initial');
			vi.advanceTimersByTime(1);
			await tick();
			expect(store.get().results).toHaveLength(1);

			// Clear
			store.search('');
			vi.advanceTimersByTime(1);
			await tick();

			// Should NOT call adapter for empty query/filters
			// The previous call was 1. Expect still 1.
			expect(mockAdapter.query).toHaveBeenCalledTimes(1);
			expect(store.get().results).toHaveLength(0);
		});
	});
});
