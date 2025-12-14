import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	createSearchContext,
	createInitialSearchState,
	highlightQuery,
	formatResultCount,
	formatCount,
	type SearchHandlers,
	type SearchState,
} from '../src/context.svelte';

// Mock svelte context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('Search Context', () => {
	let handlers: SearchHandlers;
	let state: SearchState;

	beforeEach(() => {
		vi.clearAllMocks();
		handlers = {
			onSearch: vi.fn(),
			onClear: vi.fn(),
			onActorClick: vi.fn(),
		};
		state = createInitialSearchState();
		localStorage.clear();
	});

	describe('createInitialSearchState', () => {
		it('creates default initial state', () => {
			const initialState = createInitialSearchState();
			expect(initialState.query).toBe('');
			expect(initialState.type).toBe('all');
			expect(initialState.results.total).toBe(0);
			expect(initialState.loading).toBe(false);
			expect(initialState.error).toBeNull();
			expect(initialState.recentSearches).toEqual([]);
		});

		it('accepts initial query', () => {
			const initialState = createInitialSearchState('test');
			expect(initialState.query).toBe('test');
		});

		it('loads recent searches from localStorage', () => {
			localStorage.setItem('greater-search-recent', JSON.stringify(['previous', 'search']));
			const initialState = createInitialSearchState();
			expect(initialState.recentSearches).toEqual(['previous', 'search']);
		});

		it('handles localStorage errors gracefully', () => {
			// Mock getItem to throw
			const originalGetItem = localStorage.getItem;
			localStorage.getItem = vi.fn(() => {
				throw new Error('Storage error');
			});

			const initialState = createInitialSearchState();
			expect(initialState.recentSearches).toEqual([]);

			localStorage.getItem = originalGetItem;
		});
	});

	describe('search', () => {
		it('executes search successfully', async () => {
			const mockResults = { actors: [], notes: [], tags: [], total: 10 };
			(handlers.onSearch as any).mockResolvedValue(mockResults);

			const context = createSearchContext(state, handlers);
			context.state.query = 'test';

			await context.search();

			expect(handlers.onSearch).toHaveBeenCalledWith(
				expect.objectContaining({
					query: 'test',
					type: undefined, // 'all' -> undefined
					semantic: false,
					following: false,
				})
			);
			expect(context.state.results).toEqual(mockResults);
			expect(context.state.loading).toBe(false);
			expect(context.state.error).toBeNull();
			// Should add to recent searches
			expect(context.state.recentSearches).toContain('test');
		});

		it('executes search with explicit query', async () => {
			const mockResults = { actors: [], notes: [], tags: [], total: 0 };
			(handlers.onSearch as any).mockResolvedValue(mockResults);

			const context = createSearchContext(state, handlers);
			await context.search('custom');

			expect(handlers.onSearch).toHaveBeenCalledWith(
				expect.objectContaining({
					query: 'custom',
				})
			);
		});

		it('does nothing if query is empty', async () => {
			const context = createSearchContext(state, handlers);
			context.state.query = '   ';
			await context.search();
			expect(handlers.onSearch).not.toHaveBeenCalled();
		});

		it('handles search error', async () => {
			(handlers.onSearch as any).mockRejectedValue(new Error('Search failed'));

			const context = createSearchContext(state, handlers);
			context.state.query = 'test';

			await context.search();

			expect(context.state.error).toBe('Search failed');
			expect(context.state.loading).toBe(false);
		});
	});

	describe('clear', () => {
		it('clears search state', () => {
			const context = createSearchContext(state, handlers);
			context.state.query = 'test';
			context.state.results = { ...context.state.results, total: 5 };
			context.state.error = 'error';

			context.clear();

			expect(context.state.query).toBe('');
			expect(context.state.results.total).toBe(0);
			expect(context.state.error).toBeNull();
			expect(handlers.onClear).toHaveBeenCalled();
		});
	});

	describe('setType', () => {
		it('updates type and triggers search if query exists', () => {
			const context = createSearchContext(state, handlers);
			// Mock search explicitly to avoid side effects
			const searchSpy = vi.spyOn(context, 'search').mockImplementation(async () => {});

			context.state.query = 'test';
			context.setType('actors');

			expect(context.state.type).toBe('actors');
			expect(searchSpy).toHaveBeenCalled();
		});

		it('updates type without search if query empty', () => {
			const context = createSearchContext(state, handlers);
			const searchSpy = vi.spyOn(context, 'search');

			context.state.query = '';
			context.setType('notes');

			expect(context.state.type).toBe('notes');
			expect(searchSpy).not.toHaveBeenCalled();
		});
	});

	describe('toggleSemantic', () => {
		it('toggles semantic and triggers search', () => {
			const context = createSearchContext(state, handlers);
			const searchSpy = vi.spyOn(context, 'search').mockImplementation(async () => {});

			context.state.query = 'test';
			context.state.semantic = false;

			context.toggleSemantic();

			expect(context.state.semantic).toBe(true);
			expect(searchSpy).toHaveBeenCalled();

			context.toggleSemantic();
			expect(context.state.semantic).toBe(false);
		});
	});

	describe('toggleFollowing', () => {
		it('toggles following and triggers search', () => {
			const context = createSearchContext(state, handlers);
			const searchSpy = vi.spyOn(context, 'search').mockImplementation(async () => {});

			context.state.query = 'test';
			context.state.following = false;

			context.toggleFollowing();

			expect(context.state.following).toBe(true);
			expect(searchSpy).toHaveBeenCalled();
		});
	});

	describe('addRecentSearch', () => {
		it('adds search to recent list', () => {
			const context = createSearchContext(state, handlers);
			context.addRecentSearch('new search');

			expect(context.state.recentSearches).toEqual(['new search']);
			expect(localStorage.getItem('greater-search-recent')).toContain('new search');
		});

		it('deduplicates and moves to front', () => {
			const context = createSearchContext(state, handlers);
			context.state.recentSearches = ['a', 'b'];

			context.addRecentSearch('b');

			expect(context.state.recentSearches).toEqual(['b', 'a']);
		});

		it('limits to 10 items', () => {
			const context = createSearchContext(state, handlers);
			context.state.recentSearches = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

			context.addRecentSearch('11');

			expect(context.state.recentSearches).toHaveLength(10);
			expect(context.state.recentSearches[0]).toBe('11');
			expect(context.state.recentSearches).not.toContain('10'); // Should remove last
		});

		it('handles localStorage write errors gracefully', () => {
			const originalSetItem = localStorage.setItem;
			localStorage.setItem = vi.fn(() => {
				throw new Error('Storage write error');
			});

			const context = createSearchContext(state, handlers);
			// Should not throw
			context.addRecentSearch('new search');
			expect(context.state.recentSearches).toContain('new search');

			localStorage.setItem = originalSetItem;
		});
	});

	describe('Helpers', () => {
		describe('highlightQuery', () => {
			it('highlights matching text', () => {
				expect(highlightQuery('Hello world', 'world')).toBe('Hello <mark>world</mark>');
			});

			it('is case insensitive', () => {
				expect(highlightQuery('Hello World', 'world')).toBe('Hello <mark>World</mark>');
			});

			it('handles special characters', () => {
				expect(highlightQuery('Hello (world)', '(world)')).toBe('Hello <mark>(world)</mark>');
			});

			it('returns original if no match', () => {
				expect(highlightQuery('Hello', 'world')).toBe('Hello');
			});

			it('returns original if query empty', () => {
				expect(highlightQuery('Hello', '')).toBe('Hello');
			});
		});

		describe('formatResultCount', () => {
			it('formats zero', () => {
				expect(formatResultCount(0, 'actors')).toBe('No actors');
			});

			it('formats singular', () => {
				expect(formatResultCount(1, 'actors')).toBe('1 actor');
			});

			it('formats plural', () => {
				expect(formatResultCount(5, 'actors')).toBe('5 actors');
			});
		});

		describe('formatCount', () => {
			it('formats small numbers', () => {
				expect(formatCount(999)).toBe('999');
			});

			it('formats thousands', () => {
				expect(formatCount(1200)).toBe('1.2K');
			});

			it('formats millions', () => {
				expect(formatCount(1500000)).toBe('1.5M');
			});
		});
	});
});
