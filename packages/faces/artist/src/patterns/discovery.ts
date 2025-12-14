/**
 * Discovery Pattern
 *
 * Factory for artwork discovery interfaces.
 *
 * @module @equaltoai/greater-components-artist/patterns/discovery
 */

import type { ArtworkData, DiscoveryFilters } from '../types/index.js';
import type {
	DiscoveryPatternConfig,
	DiscoveryPatternHandlers,
	DiscoveryLayout,
	SavedSearch,
	PatternFactoryResult,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	debounce,
	type LoadingStateData,
} from './utils.js';

// ============================================================================
// Discovery Pattern State
// ============================================================================

/**
 * Discovery pattern state
 */
export interface DiscoveryPatternState {
	/** Pattern instance ID */
	id: string;
	/** Current filters */
	filters: DiscoveryFilters;
	/** Search results */
	results: ArtworkData[];
	/** Total result count */
	totalResults: number;
	/** Current page */
	currentPage: number;
	/** Loading state */
	searchState: LoadingStateData<ArtworkData[]>;
	/** Recent searches */
	recentSearches: string[];
	/** Saved searches */
	savedSearches: SavedSearch[];
	/** Selected artwork */
	selectedArtwork: ArtworkData | null;
	/** Search suggestions */
	suggestions: string[];
	/** Whether filters panel is open */
	filtersOpen: boolean;
}

// ============================================================================
// Discovery Pattern Factory
// ============================================================================

/**
 * Create discovery pattern instance
 *
 * @example
 * ```typescript
 * const discovery = createDiscoveryPattern({
 *   initialQuery: 'landscape',
 *   initialFilters: { styles: ['impressionism'] },
 *   layout: 'full',
 *   onSelect: (artwork) => openArtwork(artwork),
 * }, {
 *   onSearch: async (filters) => fetchArtworks(filters),
 *   onSaveSearch: async (name, filters) => saveSearch(name, filters),
 * });
 * ```
 */
export function createDiscoveryPattern(
	config: DiscoveryPatternConfig,
	handlers: Partial<DiscoveryPatternHandlers> = {}
): PatternFactoryResult<DiscoveryPatternConfig, DiscoveryPatternHandlers> {
	const id = createPatternId('discovery');

	// Initialize state
	const state: DiscoveryPatternState = {
		id,
		filters: {
			query: config.initialQuery || '',
			...config.initialFilters,
		},
		results: [],
		totalResults: 0,
		currentPage: 1,
		searchState: createLoadingState<ArtworkData[]>(),
		recentSearches: loadRecentSearches(),
		savedSearches: loadSavedSearches(),
		selectedArtwork: null,
		suggestions: [],
		filtersOpen: false,
	};

	// Load recent searches from storage
	function loadRecentSearches(): string[] {
		if (!config.enableRecentSearches) return [];

		try {
			const stored = localStorage.getItem('discovery-recent-searches');
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	}

	// Save recent searches to storage
	function saveRecentSearches() {
		if (!config.enableRecentSearches) return;

		try {
			localStorage.setItem(
				'discovery-recent-searches',
				JSON.stringify(state.recentSearches.slice(0, 10))
			);
		} catch {
			// Storage not available
		}
	}

	// Load saved searches from storage
	function loadSavedSearches(): SavedSearch[] {
		if (!config.enableSavedSearches) return [];

		try {
			const stored = localStorage.getItem('discovery-saved-searches');
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	}

	// Save saved searches to storage
	function saveSavedSearches() {
		if (!config.enableSavedSearches) return;

		try {
			localStorage.setItem('discovery-saved-searches', JSON.stringify(state.savedSearches));
		} catch {
			// Storage not available
		}
	}

	// Add to recent searches
	const addToRecentSearches = (query: string) => {
		if (!query.trim()) return;

		// Remove if already exists
		const index = state.recentSearches.indexOf(query);
		if (index !== -1) {
			state.recentSearches.splice(index, 1);
		}

		// Add to beginning
		state.recentSearches.unshift(query);

		// Keep only last 10
		state.recentSearches = state.recentSearches.slice(0, 10);

		saveRecentSearches();
	};

	// Perform search
	const search = async (filters?: Partial<DiscoveryFilters>) => {
		if (filters) {
			state.filters = { ...state.filters, ...filters };
		}

		state.searchState = setLoading(state.searchState);
		state.currentPage = 1;

		try {
			const results = await handlers.onSearch?.(state.filters);

			state.results = results || [];
			state.totalResults = results?.length || 0;
			state.searchState = setSuccess(state.searchState, results || []);

			// Add query to recent searches
			if (state.filters.query) {
				addToRecentSearches(state.filters.query);
			}
		} catch (error) {
			state.searchState = setError(state.searchState, error as Error);
			throw error;
		}

		return state.results;
	};

	// Debounced search for typing
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const debouncedSearch = debounce(search as any, 300);

	// Update query
	const updateQuery = (query: string) => {
		state.filters.query = query;
		debouncedSearch();
	};

	// Update filters
	const updateFilters = (filters: Partial<DiscoveryFilters>) => {
		state.filters = { ...state.filters, ...filters };
		handlers.onFilterChange?.(state.filters);
		search();
	};

	// Clear filters
	const clearFilters = () => {
		state.filters = { query: state.filters.query };
		handlers.onClearFilters?.();
		search();
	};

	// Clear all (including query)
	const clearAll = () => {
		state.filters = {};
		handlers.onClearFilters?.();
		search();
	};

	// Save current search
	const saveSearch = async (name: string) => {
		const savedSearch: SavedSearch = {
			id: createPatternId('saved-search'),
			name,
			filters: { ...state.filters },
			createdAt: new Date().toISOString(),
		};

		state.savedSearches.push(savedSearch);
		saveSavedSearches();

		await handlers.onSaveSearch?.(name, state.filters);
	};

	// Load saved search
	const loadSearch = (searchId: string) => {
		const savedSearch = state.savedSearches.find((s) => s.id === searchId);
		if (savedSearch) {
			state.filters = { ...savedSearch.filters };
			handlers.onLoadSearch?.(searchId);
			search();
		}
	};

	// Delete saved search
	const deleteSavedSearch = (searchId: string) => {
		const index = state.savedSearches.findIndex((s) => s.id === searchId);
		if (index !== -1) {
			state.savedSearches.splice(index, 1);
			saveSavedSearches();
		}
	};

	// Select artwork
	const selectArtwork = (artwork: ArtworkData) => {
		state.selectedArtwork = artwork;
		config.onSelect(artwork);
	};

	// Toggle filters panel
	const toggleFilters = () => {
		state.filtersOpen = !state.filtersOpen;
	};

	// Get active filter count
	const getActiveFilterCount = (): number => {
		let count = 0;

		if (state.filters.styles?.length) count++;
		if (state.filters.mediums?.length) count++;
		if (state.filters.tags?.length) count++;
		if (state.filters.colorPalette) count++;
		if (state.filters.mood) count++;
		if (state.filters.dateRange?.from || state.filters.dateRange?.to) count++;
		if (state.filters.priceRange?.min || state.filters.priceRange?.max) count++;
		if (state.filters.forSaleOnly) count++;
		if (state.filters.aiUsage && state.filters.aiUsage !== 'any') count++;

		return count;
	};

	// Check if has active filters
	const hasActiveFilters = (): boolean => {
		return getActiveFilterCount() > 0;
	};

	// Load more results (pagination)
	const loadMore = async () => {
		state.currentPage++;

		// This would typically append to results
		// Implementation depends on API pagination
	};

	// Cleanup function
	const destroy = () => {
		// No cleanup needed
	};

	// Compose handlers
	const composedHandlers: DiscoveryPatternHandlers = {
		onSearch: search,
		onSaveSearch: saveSearch,
		onLoadSearch: loadSearch,
		onClearFilters: clearFilters,
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				search,
				updateQuery,
				updateFilters,
				clearFilters,
				clearAll,
				saveSearch,
				loadSearch,
				deleteSavedSearch,
				selectArtwork,
				toggleFilters,
				getActiveFilterCount,
				hasActiveFilters,
				loadMore,
			};
		},
		destroy,
	};
}

// ============================================================================
// Discovery Pattern Helpers
// ============================================================================

/**
 * Get layout display name
 */
export function getLayoutDisplayName(layout: DiscoveryLayout): string {
	const names: Record<DiscoveryLayout, string> = {
		full: 'Full Page',
		sidebar: 'Sidebar',
		modal: 'Modal',
	};

	return names[layout];
}

/**
 * Format result count
 */
export function formatResultCount(count: number): string {
	if (count === 0) return 'No results';
	if (count === 1) return '1 result';
	if (count >= 1000) return `${(count / 1000).toFixed(1)}k results`;
	return `${count} results`;
}

/**
 * Get filter summary text
 */
export function getFilterSummary(filters: DiscoveryFilters): string {
	const parts: string[] = [];

	if (filters.query) {
		parts.push(`"${filters.query}"`);
	}

	if (filters.styles?.length) {
		parts.push(`${filters.styles.length} style${filters.styles.length > 1 ? 's' : ''}`);
	}

	if (filters.mediums?.length) {
		parts.push(`${filters.mediums.length} medium${filters.mediums.length > 1 ? 's' : ''}`);
	}

	if (filters.forSaleOnly) {
		parts.push('for sale');
	}

	return parts.join(', ') || 'All artworks';
}
