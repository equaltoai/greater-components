/**
 * Gallery Pattern
 *
 * Factory for gallery layouts with multiple display modes.
 *
 * @module @equaltoai/greater-components-artist/patterns/gallery
 */

import type { ArtworkData, DiscoveryFilters } from '../types/index.js';
import type {
	GalleryPatternConfig,
	GalleryPatternHandlers,
	GalleryLayout,
	GallerySortOption,
	PatternFactoryResult,
	GalleryPatternMethods,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	getCurrentBreakpoint,
	createBreakpointObserver,
	responsive,
	type LoadingStateData,
	type Breakpoint,
} from './utils.js';

// ============================================================================
// Gallery Pattern State
// ============================================================================

/**
 * Gallery pattern state
 */
export interface GalleryPatternState {
	/** Pattern instance ID */
	id: string;
	/** Current layout */
	layout: GalleryLayout;
	/** Current sort option */
	sortOption: GallerySortOption;
	/** Current filters */
	filters: DiscoveryFilters;
	/** Displayed items */
	items: ArtworkData[];
	/** All items (before filtering) */
	allItems: ArtworkData[];
	/** Loading state */
	loadingState: LoadingStateData<ArtworkData[]>;
	/** Current breakpoint */
	breakpoint: Breakpoint;
	/** Viewer state */
	viewerState: {
		isOpen: boolean;
		currentIndex: number;
	};
	/** Infinite scroll state */
	infiniteScrollState: {
		hasMore: boolean;
		isLoading: boolean;
		page: number;
	};
}

// ============================================================================
// Gallery Pattern Factory
// ============================================================================

/**
 * Create gallery pattern instance
 *
 * @example
 * ```typescript
 * const gallery = createGalleryPattern({
 *   items: artworks,
 *   layout: 'masonry',
 *   enableFilters: true,
 *   enableSort: true,
 *   onArtworkClick: (artwork) => openArtwork(artwork),
 * }, {
 *   onLayoutChange: (layout) => savePreference(layout),
 *   onLoadMore: async () => fetchMoreArtworks(),
 * });
 * ```
 */
export function createGalleryPattern(
	config: GalleryPatternConfig,
	handlers: Partial<GalleryPatternHandlers> = {}
): PatternFactoryResult<
	GalleryPatternConfig,
	GalleryPatternHandlers,
	GalleryPatternState & GalleryPatternMethods
> {
	const id = createPatternId('gallery');

	// Initialize state
	const state: GalleryPatternState = {
		id,
		layout: config.layout,
		sortOption: 'newest',
		filters: {},
		items: [...config.items],
		allItems: [...config.items],
		loadingState: createLoadingState<ArtworkData[]>(config.items),
		breakpoint: getCurrentBreakpoint(),
		viewerState: {
			isOpen: false,
			currentIndex: 0,
		},
		infiniteScrollState: {
			hasMore: true,
			isLoading: false,
			page: 1,
		},
	};

	// Set up breakpoint observer
	const cleanupBreakpoint = createBreakpointObserver((breakpoint) => {
		state.breakpoint = breakpoint;
		// Adjust layout for mobile if needed
		if (breakpoint === 'xs' && state.layout === 'masonry') {
			state.layout = 'grid';
		}
	});

	// Sort items
	const sortItems = (items: ArtworkData[], option: GallerySortOption): ArtworkData[] => {
		const sorted = [...items];

		switch (option) {
			case 'newest':
				return sorted.sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case 'oldest':
				return sorted.sort(
					(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case 'popular':
				return sorted.sort((a, b) => b.stats.likes - a.stats.likes);
			case 'title':
				return sorted.sort((a, b) => a.title.localeCompare(b.title));
			case 'artist':
				return sorted.sort((a, b) => a.artist.name.localeCompare(b.artist.name));
			default:
				return sorted;
		}
	};

	// Filter items
	const filterItems = (items: ArtworkData[], filters: DiscoveryFilters): ArtworkData[] => {
		return items.filter((item) => {
			// Query filter
			if (filters.query) {
				const query = filters.query.toLowerCase();
				const matchesQuery =
					item.title.toLowerCase().includes(query) ||
					item.artist.name.toLowerCase().includes(query) ||
					item.description?.toLowerCase().includes(query) ||
					item.metadata.tags?.some((tag) => tag.toLowerCase().includes(query));

				if (!matchesQuery) return false;
			}

			// Style filter
			if (filters.styles?.length) {
				const styles = filters.styles;
				if (!item.metadata.style || !item.metadata.style.some((s) => styles.includes(s))) {
					return false;
				}
			}

			// Medium filter
			if (filters.mediums?.length) {
				if (!item.metadata.medium || !filters.mediums.includes(item.metadata.medium)) {
					return false;
				}
			}

			// For sale filter
			if (filters.forSaleOnly && !item.price?.isForSale) {
				return false;
			}

			// AI usage filter
			if (filters.aiUsage && filters.aiUsage !== 'any') {
				const hasAI = item.aiUsage?.hasAI;
				if (filters.aiUsage === 'no-ai' && hasAI) return false;
				if (filters.aiUsage === 'ai-assisted' && !hasAI) return false;
			}

			return true;
		});
	};

	// Apply sort and filter
	const applyFiltersAndSort = () => {
		let result = [...state.allItems];
		result = filterItems(result, state.filters);
		result = sortItems(result, state.sortOption);
		state.items = result;
	};

	// Change layout
	const setLayout = (layout: GalleryLayout) => {
		state.layout = layout;
		handlers.onLayoutChange?.(layout);
	};

	// Change sort
	const setSort = (option: GallerySortOption) => {
		state.sortOption = option;
		handlers.onSortChange?.(option);
		applyFiltersAndSort();
	};

	// Update filters
	const setFilters = (filters: DiscoveryFilters) => {
		state.filters = filters;
		handlers.onFilterChange?.(filters);
		applyFiltersAndSort();
	};

	// Clear filters
	const clearFilters = () => {
		state.filters = {};
		applyFiltersAndSort();
	};

	// Handle artwork click
	const handleArtworkClick = (artwork: ArtworkData) => {
		config.onArtworkClick(artwork);
	};

	// Open viewer
	const openViewer = (artwork: ArtworkData) => {
		const index = state.items.findIndex((item) => item.id === artwork.id);
		state.viewerState.isOpen = true;
		state.viewerState.currentIndex = index !== -1 ? index : 0;
		handlers.onOpenViewer?.(artwork, state.viewerState.currentIndex);
	};

	// Close viewer
	const closeViewer = () => {
		state.viewerState.isOpen = false;
	};

	// Navigate viewer
	const navigateViewer = (direction: 'next' | 'prev') => {
		const { currentIndex } = state.viewerState;
		const maxIndex = state.items.length - 1;

		if (direction === 'next' && currentIndex < maxIndex) {
			state.viewerState.currentIndex++;
		} else if (direction === 'prev' && currentIndex > 0) {
			state.viewerState.currentIndex--;
		}
	};

	// Get current viewer artwork
	const getCurrentViewerArtwork = (): ArtworkData | undefined => {
		return state.items[state.viewerState.currentIndex];
	};

	// Load more items (infinite scroll)
	const loadMore = async (): Promise<ArtworkData[]> => {
		if (!config.enableInfiniteScroll || state.infiniteScrollState.isLoading) {
			return [];
		}

		state.infiniteScrollState.isLoading = true;
		state.loadingState = setLoading(state.loadingState);
		let result: ArtworkData[] = [];

		try {
			const newItems = await handlers.onLoadMore?.();
			result = newItems || [];

			if (newItems && newItems.length > 0) {
				state.allItems.push(...newItems);
				state.infiniteScrollState.page++;
				applyFiltersAndSort();
			} else {
				state.infiniteScrollState.hasMore = false;
			}

			state.loadingState = setSuccess(state.loadingState, state.items);
		} catch (error) {
			state.loadingState = setError(state.loadingState, error as Error);
		} finally {
			state.infiniteScrollState.isLoading = false;
		}
		return result;
	};

	// Get column count based on breakpoint and layout
	const getColumnCount = (): number => {
		if (state.layout === 'row') return 1;

		return responsive(
			{
				xs: 1,
				sm: 2,
				md: 3,
				lg: state.layout === 'masonry' ? 4 : 3,
				xl: state.layout === 'masonry' ? 5 : 4,
				'2xl': state.layout === 'masonry' ? 6 : 5,
			},
			3
		);
	};

	// Get item count
	const getItemCount = (): number => {
		return state.items.length;
	};

	// Check if empty
	const isEmpty = (): boolean => {
		return state.items.length === 0;
	};

	// Cleanup function
	const destroy = () => {
		cleanupBreakpoint();
	};

	// Compose handlers
	const composedHandlers: GalleryPatternHandlers = {
		onLayoutChange: setLayout,
		onSortChange: setSort,
		onFilterChange: setFilters,
		onLoadMore: loadMore,
		onOpenViewer: openViewer,
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				setLayout,
				setSort,
				setFilters,
				clearFilters,
				handleArtworkClick,
				openViewer,
				closeViewer,
				navigateViewer,
				getCurrentViewerArtwork,
				loadMore,
				getColumnCount,
				getItemCount,
				isEmpty,
			};
		},
		destroy,
	};
}

// ============================================================================
// Gallery Pattern Helpers
// ============================================================================

/**
 * Get layout display name
 */
export function getLayoutDisplayName(layout: GalleryLayout): string {
	const names: Record<GalleryLayout, string> = {
		grid: 'Grid',
		masonry: 'Masonry',
		row: 'Row',
	};

	return names[layout];
}

/**
 * Get layout icon
 */
export function getLayoutIcon(layout: GalleryLayout): string {
	const icons: Record<GalleryLayout, string> = {
		grid: '⊞',
		masonry: '▦',
		row: '☰',
	};

	return icons[layout];
}

/**
 * Get sort option display name
 */
export function getSortDisplayName(option: GallerySortOption): string {
	const names: Record<GallerySortOption, string> = {
		newest: 'Newest First',
		oldest: 'Oldest First',
		popular: 'Most Popular',
		title: 'Title (A-Z)',
		artist: 'Artist (A-Z)',
	};

	return names[option];
}
