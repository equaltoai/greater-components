/**
 * Search Context
 * 
 * Provides search state and handlers for all search components.
 * Supports full-text search, semantic search, and filtering by type.
 * 
 * @module Search/context
 */

import { getContext, setContext } from 'svelte';

const SEARCH_CONTEXT_KEY = Symbol('search-context');

/**
 * Search result types
 */
export type SearchResultType = 'actors' | 'notes' | 'tags' | 'all';

/**
 * Actor search result
 */
export interface SearchActor {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
	bio?: string;
	followersCount?: number;
	isFollowing?: boolean;
}

/**
 * Note search result
 */
export interface SearchNote {
	id: string;
	content: string;
	author: {
		id: string;
		username: string;
		displayName: string;
		avatar?: string;
	};
	createdAt: string;
	likesCount?: number;
	repliesCount?: number;
	reblogsCount?: number;
}

/**
 * Tag search result
 */
export interface SearchTag {
	name: string;
	count: number;
	trending?: boolean;
}

/**
 * Search results
 */
export interface SearchResults {
	actors: SearchActor[];
	notes: SearchNote[];
	tags: SearchTag[];
	total: number;
}

/**
 * Search options
 */
export interface SearchOptions {
	/**
	 * Search query
	 */
	query: string;

	/**
	 * Result type filter
	 */
	type?: SearchResultType;

	/**
	 * Maximum results per type
	 * @default 20
	 */
	limit?: number;

	/**
	 * Enable AI semantic search
	 * @default false
	 */
	semantic?: boolean;

	/**
	 * Include only accounts user follows
	 * @default false
	 */
	following?: boolean;
}

/**
 * Search event handlers
 */
export interface SearchHandlers {
	/**
	 * Handle search execution
	 */
	onSearch?: (options: SearchOptions) => Promise<SearchResults>;

	/**
	 * Handle actor result click
	 */
	onActorClick?: (actor: SearchActor) => void;

	/**
	 * Handle note result click
	 */
	onNoteClick?: (note: SearchNote) => void;

	/**
	 * Handle tag result click
	 */
	onTagClick?: (tag: SearchTag) => void;

	/**
	 * Handle follow action from results
	 */
	onFollow?: (actorId: string) => Promise<void>;

	/**
	 * Handle clear search
	 */
	onClear?: () => void;
}

/**
 * Search state
 */
export interface SearchState {
	/**
	 * Current search query
	 */
	query: string;

	/**
	 * Current result type filter
	 */
	type: SearchResultType;

	/**
	 * Search results
	 */
	results: SearchResults;

	/**
	 * Whether search is in progress
	 */
	loading: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Whether semantic search is enabled
	 */
	semantic: boolean;

	/**
	 * Whether to filter by following
	 */
	following: boolean;

	/**
	 * Recent searches
	 */
	recentSearches: string[];
}

/**
 * Search context
 */
export interface SearchContext {
	/**
	 * Current search state
	 */
	state: SearchState;

	/**
	 * Search event handlers
	 */
	handlers: SearchHandlers;

	/**
	 * Update search state
	 */
	updateState: (partial: Partial<SearchState>) => void;

	/**
	 * Clear search error
	 */
	clearError: () => void;

	/**
	 * Execute search
	 */
	search: (query?: string) => Promise<void>;

	/**
	 * Clear search
	 */
	clear: () => void;

	/**
	 * Set result type filter
	 */
	setType: (type: SearchResultType) => void;

	/**
	 * Toggle semantic search
	 */
	toggleSemantic: () => void;

	/**
	 * Toggle following filter
	 */
	toggleFollowing: () => void;

	/**
	 * Add recent search
	 */
	addRecentSearch: (query: string) => void;
}

/**
 * Default empty results
 */
const EMPTY_RESULTS: SearchResults = {
	actors: [],
	notes: [],
	tags: [],
	total: 0,
};

/**
 * Create search context
 * 
 * @param handlers - Search event handlers
 * @param initialQuery - Initial search query
 * @returns Search context
 */
export function createInitialSearchState(initialQuery = ''): SearchState {
	return {
		query: initialQuery,
		type: 'all',
		results: EMPTY_RESULTS,
		loading: false,
		error: null,
		semantic: false,
		following: false,
		recentSearches: loadRecentSearches(),
	};
}

export function createSearchContext(
	state: SearchState,
	handlers: SearchHandlers = {}
): SearchContext {

	const context: SearchContext = {
		state,
		handlers,
		updateState: (partial: Partial<SearchState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		search: async (query?: string) => {
			const searchQuery = query ?? state.query;
			if (!searchQuery.trim()) {
				return;
			}

			state.loading = true;
			state.error = null;

			try {
				const results = await handlers.onSearch?.({
					query: searchQuery.trim(),
					type: state.type === 'all' ? undefined : state.type,
					semantic: state.semantic,
					following: state.following,
				});

				if (results) {
					state.results = results;
					context.addRecentSearch(searchQuery.trim());
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Search failed';
			} finally {
				state.loading = false;
			}
		},
		clear: () => {
			state.query = '';
			state.results = EMPTY_RESULTS;
			state.error = null;
			handlers.onClear?.();
		},
		setType: (type: SearchResultType) => {
			state.type = type;
			if (state.query.trim()) {
				context.search();
			}
		},
		toggleSemantic: () => {
			state.semantic = !state.semantic;
			if (state.query.trim()) {
				context.search();
			}
		},
		toggleFollowing: () => {
			state.following = !state.following;
			if (state.query.trim()) {
				context.search();
			}
		},
		addRecentSearch: (query: string) => {
			const trimmed = query.trim();
			if (!trimmed) return;

			// Remove duplicates and add to front
			state.recentSearches = [
				trimmed,
				...state.recentSearches.filter((q) => q !== trimmed),
			].slice(0, 10); // Keep max 10

			saveRecentSearches(state.recentSearches);
		},
	};

	setContext(SEARCH_CONTEXT_KEY, context);
	return context;
}

/**
 * Get search context
 * 
 * Must be called within a Search component tree.
 * 
 * @throws Error if called outside Search component tree
 * @returns Search context
 */
export function getSearchContext(): SearchContext {
	const context = getContext<SearchContext>(SEARCH_CONTEXT_KEY);
	if (!context) {
		throw new Error('Search components must be used within a Search.Root component');
	}
	return context;
}

/**
 * Load recent searches from localStorage
 */
function loadRecentSearches(): string[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem('greater-search-recent');
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

/**
 * Save recent searches to localStorage
 */
function saveRecentSearches(searches: string[]): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem('greater-search-recent', JSON.stringify(searches));
	} catch {
		// Ignore localStorage errors
	}
}

/**
 * Highlight search query in text
 */
export function highlightQuery(text: string, query: string): string {
	if (!query.trim()) return text;

	const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
	return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Format result count
 */
export function formatResultCount(count: number, type: string): string {
	if (count === 0) return `No ${type}`;
	if (count === 1) return `1 ${type.slice(0, -1)}`; // Remove 's'
	return `${count} ${type}`;
}

/**
 * Format count for display (e.g., 1.2K, 3.4M)
 */
export function formatCount(count: number): string {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	}
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K`;
	}
	return count.toString();
}
