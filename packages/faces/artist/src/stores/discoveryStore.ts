/**
 * Discovery Store
 *
 * Reactive state management for artwork discovery and search.
 * Implements AI-powered search with debouncing and filter management.
 *
 * @module @equaltoai/greater-components-artist/stores/discoveryStore
 */

import type { ArtworkData } from '../types/artwork.js';
import type { DiscoveryFilters } from '../types/discovery.js';
import type {
	DiscoveryStore,
	DiscoveryStoreState,
	DiscoveryStoreConfig,
	SavedSearch,
} from './types.js';
import { ReactiveState, debounce, persistToLocalStorage, loadFromLocalStorage } from './utils.js';

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

const RECENT_SEARCHES_KEY = 'artist-discovery-recent-searches';
const SAVED_SEARCHES_KEY = 'artist-discovery-saved-searches';

/**
 * Creates a discovery store instance
 */
export function createDiscoveryStore(config: DiscoveryStoreConfig = {}): DiscoveryStore {
	const { adapter, debounceMs = 300, maxRecentSearches = 10, enableSuggestions = true } = config;

	// Load persisted data
	const persistedRecentSearches = loadFromLocalStorage<string[]>(RECENT_SEARCHES_KEY, []);
	const persistedSavedSearches = loadFromLocalStorage<SavedSearch[]>(SAVED_SEARCHES_KEY, []);

	// Initialize state
	const state = new ReactiveState<DiscoveryStoreState>({
		query: '',
		results: [],
		filters: {},
		suggestions: [],
		recentSearches: persistedRecentSearches,
		savedSearches: persistedSavedSearches,
		loading: false,
		error: null,
	});

	// Debounced search execution
	const debouncedExecuteSearch = debounce(executeSearchInternal, debounceMs);

	/**
	 * Internal search execution
	 */
	async function executeSearchInternal(query: string, filters: DiscoveryFilters): Promise<void> {
		if (!query.trim() && Object.keys(filters).length === 0) {
			state.update((current) => ({
				...current,
				results: [],
				loading: false,
			}));
			return;
		}

		state.update((current) => ({ ...current, loading: true, error: null }));

		try {
			if (!adapter) {
				// Mock implementation for testing
				state.update((current) => ({
					...current,
					results: [],
					loading: false,
				}));
				return;
			}

			// Build search variables
			const variables = {
				query: query.trim(),
				...buildSearchVariables(filters),
				first: 50,
			};

			// Execute search query
			const executor = adapter as unknown as GraphQLExecutor;

			type DiscoveryResponse = {
				discoverArtworks: {
					edges: Array<{ node: ArtworkData }>;
				};
			};

			const response = await executor.query<DiscoveryResponse>({
				query: 'DiscoverArtworks',
				variables,
			});

			const results = response.data?.discoverArtworks?.edges?.map((edge) => edge.node) ?? [];

			state.update((current) => ({
				...current,
				results,
				loading: false,
			}));

			// Add to recent searches if query is not empty
			if (query.trim()) {
				addToRecentSearches(query.trim());
			}
		} catch (error) {
			state.update((current) => ({
				...current,
				loading: false,
				error: error instanceof Error ? error : new Error('Search failed'),
			}));
		}
	}

	/**
	 * Builds search variables from filters
	 */
	function buildSearchVariables(filters: DiscoveryFilters): Record<string, unknown> {
		const variables: Record<string, unknown> = {};

		if (filters.styles?.length) variables['styles'] = filters.styles;
		if (filters.mediums?.length) variables['mediums'] = filters.mediums;
		if (filters.tags?.length) variables['tags'] = filters.tags;

		if (filters.colorPalette) {
			variables['colors'] = filters.colorPalette.colors;
			variables['colorTolerance'] = filters.colorPalette.tolerance;
		}

		if (filters.mood) {
			variables['moodEnergy'] = filters.mood.energy;
			variables['moodValence'] = filters.mood.valence;
		}

		if (filters.dateRange) {
			if (filters.dateRange.from) {
				variables['createdAfter'] = new Date(filters.dateRange.from).toISOString();
			}
			if (filters.dateRange.to) {
				variables['createdBefore'] = new Date(filters.dateRange.to).toISOString();
			}
		}

		if (filters.priceRange) {
			variables['minPrice'] = filters.priceRange.min;
			variables['maxPrice'] = filters.priceRange.max;
		}

		if (filters.aiUsage) {
			variables['aiUsage'] = filters.aiUsage;
		}

		if (filters.forSaleOnly) variables['forSale'] = true;
		if (filters.featuredOnly) variables['featured'] = true;

		return variables;
	}

	/**
	 * Adds query to recent searches
	 */
	function addToRecentSearches(query: string): void {
		state.update((current) => {
			const filtered = current.recentSearches.filter((s) => s !== query);
			const updated = [query, ...filtered].slice(0, maxRecentSearches);
			persistToLocalStorage(RECENT_SEARCHES_KEY, updated);
			return { ...current, recentSearches: updated };
		});
	}

	/**
	 * Executes a search
	 */
	async function search(query: string): Promise<void> {
		state.update((current) => ({ ...current, query }));
		debouncedExecuteSearch(query, state.value.filters);
	}

	/**
	 * Updates filters and re-executes search
	 */
	function updateFilters(filters: Partial<DiscoveryFilters>): void {
		state.update((current) => ({
			...current,
			filters: { ...current.filters, ...filters },
		}));
		debouncedExecuteSearch(state.value.query, state.value.filters);
	}

	/**
	 * Clears all filters
	 */
	function clearFilters(): void {
		state.update((current) => ({ ...current, filters: {} }));
		debouncedExecuteSearch(state.value.query, {});
	}

	/**
	 * Saves current search
	 */
	function saveSearch(name: string): void {
		const newSearch: SavedSearch = {
			id: `search-${Date.now()}`,
			name,
			query: state.value.query,
			filters: { ...state.value.filters },
			createdAt: new Date().toISOString(),
		};

		state.update((current) => {
			const updated = [...current.savedSearches, newSearch];
			persistToLocalStorage(SAVED_SEARCHES_KEY, updated);
			return { ...current, savedSearches: updated };
		});
	}

	/**
	 * Deletes a saved search
	 */
	function deleteSavedSearch(id: string): void {
		state.update((current) => {
			const updated = current.savedSearches.filter((s) => s.id !== id);
			persistToLocalStorage(SAVED_SEARCHES_KEY, updated);
			return { ...current, savedSearches: updated };
		});
	}

	/**
	 * Clears recent searches
	 */
	function clearRecentSearches(): void {
		state.update((current) => {
			persistToLocalStorage(RECENT_SEARCHES_KEY, []);
			return { ...current, recentSearches: [] };
		});
	}

	/**
	 * Loads AI-powered suggestions
	 */
	async function loadSuggestions(): Promise<void> {
		if (!enableSuggestions || !adapter) return;

		try {
			const executor = adapter as unknown as GraphQLExecutor;

			type SuggestionsResponse = {
				artworkSuggestions: {
					edges: Array<{ node: ArtworkData }>;
				};
			};

			const response = await executor.query<SuggestionsResponse>({
				query: 'GetArtworkSuggestions',
				variables: {
					recentSearches: state.value.recentSearches.slice(0, 5),
					first: 10,
				},
			});

			const suggestions = response.data?.artworkSuggestions?.edges?.map((edge) => edge.node) ?? [];

			state.update((current) => ({ ...current, suggestions }));
		} catch (error) {
			console.warn('[DiscoveryStore] Failed to load suggestions:', error);
		}
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: DiscoveryStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): DiscoveryStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		// Cleanup
	}

	return {
		subscribe,
		get,
		destroy,
		search,
		updateFilters,
		clearFilters,
		saveSearch,
		deleteSavedSearch,
		clearRecentSearches,
		loadSuggestions,
	};
}
