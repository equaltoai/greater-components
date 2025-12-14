/**
 * Gallery Store
 *
 * Reactive state management for gallery/artwork collections.
 * Follows patterns from @equaltoai/greater-components-adapters/stores/timelineStore
 *
 * @module @equaltoai/greater-components-artist/stores/galleryStore
 */

import type { ArtworkData } from '../types/artwork.js';
import type {
	GalleryStore,
	GalleryStoreState,
	GalleryStoreConfig,
	GalleryFilters,
} from './types.js';
import {
	ReactiveState,
	mergePaginatedItems,
	applyFilters,
	optimisticAdd,
	optimisticUpdate,
	optimisticDelete,
	persistToLocalStorage,
	loadFromLocalStorage,
	type OptimisticState,
	type PageInfo,
} from './utils.js';

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

const VIEW_MODE_STORAGE_KEY = 'artist-gallery-view-mode';
const SORT_BY_STORAGE_KEY = 'artist-gallery-sort-by';

/**
 * Creates a gallery store instance
 */
export function createGalleryStore(config: GalleryStoreConfig = {}): GalleryStore {
	const {
		adapter,
		pageSize = 20,
		initialItems = [],
		initialViewMode,
		initialSortBy,
		artistId,
	} = config;

	// Load persisted preferences
	const persistedViewMode = loadFromLocalStorage<'grid' | 'masonry' | 'row'>(
		VIEW_MODE_STORAGE_KEY,
		'grid'
	);
	const persistedSortBy = loadFromLocalStorage<'recent' | 'popular' | 'trending'>(
		SORT_BY_STORAGE_KEY,
		'recent'
	);

	// Initialize state
	const state = new ReactiveState<GalleryStoreState>({
		items: initialItems,
		loading: false,
		error: null,
		hasMore: true,
		cursor: null,
		viewMode: initialViewMode ?? persistedViewMode,
		sortBy: initialSortBy ?? persistedSortBy,
		filters: {},
	});

	// Optimistic state tracking
	let optimisticState: OptimisticState<ArtworkData> = {
		items: initialItems.map((data) => ({ data, isOptimistic: false, version: 0 })),
		pendingOperations: new Map(),
	};

	// (Snipped filterFunctions for brevity, assuming they are unchanged)
	const filterFunctions: Partial<
		Record<keyof GalleryFilters, (item: ArtworkData, value: unknown) => boolean>
	> = {
		artist: (item, value) => item.artistId === value,
		style: (item, value) => {
			const styles = value as string[];
			return styles.length === 0 || styles.some((s) => item.metadata.style?.includes(s));
		},
		medium: (item, value) => {
			const mediums = value as string[];
			return mediums.length === 0 || mediums.includes(item.metadata.medium ?? '');
		},
		hasAI: (item, value) => {
			if (value === undefined) return true;
			return item.aiUsage?.aiUsed === value;
		},
		dateRange: (item, value) => {
			const range = value as { start: Date; end: Date };
			if (!item.createdAt) return true;
			const itemDate = new Date(item.createdAt);
			return itemDate >= range.start && itemDate <= range.end;
		},
	};

	/**
	 * Updates derived state from optimistic state
	 */
	function updateDerivedState(): void {
		const items = optimisticState.items.map((item) => item.data);
		const filteredItems = applyFilters(
			items,
			state.value.filters as Record<string, unknown>,
			filterFunctions
		);

		// Sort items
		const sortedItems = sortItems(filteredItems, state.value.sortBy);

		state.update((current) => ({
			...current,
			items: sortedItems,
		}));
	}

	/**
	 * Sorts items by the specified option
	 */
	function sortItems(
		items: ArtworkData[],
		sortBy: 'recent' | 'popular' | 'trending'
	): ArtworkData[] {
		const sorted = [...items];

		switch (sortBy) {
			case 'recent':
				sorted.sort((a, b) => {
					const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
					const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
					return dateB - dateA;
				});
				break;
			case 'popular':
				sorted.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
				break;
			case 'trending':
				// Trending could be a combination of recency and engagement
				sorted.sort((a, b) => {
					const scoreA = calculateTrendingScore(a);
					const scoreB = calculateTrendingScore(b);
					return scoreB - scoreA;
				});
				break;
		}

		return sorted;
	}

	/**
	 * Calculates trending score for an artwork
	 */
	function calculateTrendingScore(artwork: ArtworkData): number {
		const likes = artwork.likeCount ?? 0;
		const views = artwork.viewCount ?? 0;
		const comments = artwork.commentCount ?? 0;

		const ageInHours = artwork.createdAt
			? (Date.now() - new Date(artwork.createdAt).getTime()) / (1000 * 60 * 60)
			: 1000;

		// Decay factor based on age
		const decayFactor = Math.pow(0.95, ageInHours / 24);

		return (likes * 3 + views * 0.1 + comments * 2) * decayFactor;
	}

	/**
	 * Loads more items from the API
	 */
	async function loadMore(): Promise<void> {
		if (state.value.loading || !state.value.hasMore) return;

		state.update((current) => ({ ...current, loading: true, error: null }));

		try {
			if (!adapter) {
				// Mock implementation for testing without adapter
				state.update((current) => ({
					...current,
					loading: false,
					hasMore: false,
				}));
				return;
			}

			// Build query variables
			const variables = {
				first: pageSize,
				after: state.value.cursor,
				artistId,
				sortBy: state.value.sortBy,
				...buildFilterVariables(state.value.filters),
			};

			// Fetch from adapter (placeholder - actual implementation depends on GraphQL schema)
			const executor = adapter as unknown as GraphQLExecutor;

			type GalleryResponse = {
				artworks: {
					edges: Array<{ node: ArtworkData }>;
					pageInfo: PageInfo;
				};
			};

			const response = await executor.query<GalleryResponse>({
				query: 'GetGalleryArtworks',
				variables,
			});

			const { edges, pageInfo } = response.data?.artworks ?? {
				edges: [],
				pageInfo: { endCursor: null, hasNextPage: false },
			};

			const newItems = edges.map((edge) => edge.node);

			// Merge new items
			const paginatedState = mergePaginatedItems(
				{
					items: optimisticState.items.map((i) => i.data),
					cursor: state.value.cursor,
					hasMore: state.value.hasMore,
					loading: false,
					error: null,
				},
				newItems,
				pageInfo as PageInfo
			);

			// Update optimistic state
			optimisticState = {
				...optimisticState,
				items: paginatedState.items.map((data) => ({
					data,
					isOptimistic: false,
					version: 0,
				})),
			};

			state.update((current) => ({
				...current,
				items: paginatedState.items,
				cursor: paginatedState.cursor,
				hasMore: paginatedState.hasMore,
				loading: false,
			}));

			updateDerivedState();
		} catch (error) {
			state.update((current) => ({
				...current,
				loading: false,
				error: error instanceof Error ? error : new Error('Failed to load gallery'),
			}));
		}
	}

	/**
	 * Builds filter variables for GraphQL query
	 */
	function buildFilterVariables(filters: GalleryFilters): Record<string, unknown> {
		const variables: Record<string, unknown> = {};

		if (filters.artist) variables['artistId'] = filters.artist;
		if (filters.style?.length) variables['styles'] = filters.style;
		if (filters.medium?.length) variables['mediums'] = filters.medium;
		if (filters.hasAI !== undefined) variables['hasAI'] = filters.hasAI;
		if (filters.dateRange) {
			variables['createdAfter'] = filters.dateRange.start.toISOString();
			variables['createdBefore'] = filters.dateRange.end.toISOString();
		}

		return variables;
	}

	/**
	 * Refreshes the gallery from the beginning
	 */
	async function refresh(): Promise<void> {
		state.update((current) => ({
			...current,
			items: [],
			cursor: null,
			hasMore: true,
		}));

		optimisticState = {
			items: [],
			pendingOperations: new Map(),
		};

		await loadMore();
	}

	/**
	 * Sets the view mode
	 */
	function setViewMode(mode: 'grid' | 'masonry' | 'row'): void {
		state.update((current) => ({ ...current, viewMode: mode }));
		persistToLocalStorage(VIEW_MODE_STORAGE_KEY, mode);
	}

	/**
	 * Sets the sort option
	 */
	function setSortBy(sortBy: 'recent' | 'popular' | 'trending'): void {
		state.update((current) => ({ ...current, sortBy }));
		persistToLocalStorage(SORT_BY_STORAGE_KEY, sortBy);
		updateDerivedState();
	}

	/**
	 * Updates filters
	 */
	function updateFilters(filters: Partial<GalleryFilters>): void {
		state.update((current) => ({
			...current,
			filters: { ...current.filters, ...filters },
		}));
		updateDerivedState();
	}

	/**
	 * Clears all filters
	 */
	function clearFilters(): void {
		state.update((current) => ({ ...current, filters: {} }));
		updateDerivedState();
	}

	/**
	 * Adds an item optimistically
	 */
	function addItem(item: ArtworkData): void {
		optimisticState = optimisticAdd(optimisticState, item);
		updateDerivedState();
	}

	/**
	 * Removes an item optimistically
	 */
	function removeItem(id: string): void {
		optimisticState = optimisticDelete(optimisticState, id);
		updateDerivedState();
	}

	/**
	 * Updates an item optimistically
	 */
	function updateItem(id: string, updates: Partial<ArtworkData>): void {
		optimisticState = optimisticUpdate(optimisticState, id, updates);
		updateDerivedState();
	}

	/**
	 * Subscribes to state changes
	 */
	function subscribe(callback: (value: GalleryStoreState) => void): () => void {
		return state.subscribe(callback);
	}

	/**
	 * Gets current state
	 */
	function get(): GalleryStoreState {
		return state.value;
	}

	/**
	 * Cleans up store resources
	 */
	function destroy(): void {
		// Cleanup any subscriptions or timers
	}

	return {
		subscribe,
		get,
		destroy,
		loadMore,
		refresh,
		setViewMode,
		setSortBy,
		updateFilters,
		clearFilters,
		addItem,
		removeItem,
		updateItem,
	};
}
