/**
 * Gallery Type Definitions
 *
 * Types for gallery layouts, clustering, and display configurations.
 *
 * @module @equaltoai/greater-components-artist/types/gallery
 */

import type { ArtworkData } from './artwork.js';

// ============================================================================
// Gallery Layout Types
// ============================================================================

/**
 * Gallery layout modes
 */
export type GalleryLayoutMode = 'grid' | 'masonry' | 'row' | 'carousel' | 'justified';

/**
 * Gallery clustering modes for organizing artworks
 */
export type GalleryClusteringMode =
	| 'none'
	| 'color'
	| 'style'
	| 'mood'
	| 'date'
	| 'medium'
	| 'collection';

/**
 * Gallery sort options
 */
export type GallerySortOption =
	| 'newest'
	| 'oldest'
	| 'popular'
	| 'trending'
	| 'alphabetical'
	| 'random';

// ============================================================================
// Gallery Configuration
// ============================================================================

/**
 * Gallery grid configuration
 */
export interface GalleryGridConfig {
	/** Number of columns (responsive object or fixed number) */
	columns: number | { sm?: number; md?: number; lg?: number; xl?: number };
	/** Gap between items in pixels */
	gap: number;
	/** Aspect ratio for grid items */
	aspectRatio?: number;
}

/**
 * Gallery masonry configuration
 */
export interface GalleryMasonryConfig {
	/** Number of columns */
	columns: number | { sm?: number; md?: number; lg?: number; xl?: number };
	/** Gap between items in pixels */
	gap: number;
	/** Minimum item height */
	minHeight?: number;
	/** Maximum item height */
	maxHeight?: number;
}

/**
 * Gallery row configuration
 */
export interface GalleryRowConfig {
	/** Target row height in pixels */
	targetHeight: number;
	/** Gap between items in pixels */
	gap: number;
	/** Minimum items per row */
	minItemsPerRow?: number;
	/** Maximum items per row */
	maxItemsPerRow?: number;
}

/**
 * Gallery carousel configuration
 */
export interface GalleryCarouselConfig {
	/** Items visible at once */
	visibleItems: number | { sm?: number; md?: number; lg?: number };
	/** Gap between items in pixels */
	gap: number;
	/** Enable auto-play */
	autoPlay?: boolean;
	/** Auto-play interval in ms */
	autoPlayInterval?: number;
	/** Enable infinite loop */
	infinite?: boolean;
	/** Show navigation arrows */
	showArrows?: boolean;
	/** Show pagination dots */
	showDots?: boolean;
}

/**
 * Full gallery configuration
 */
export interface GalleryConfig {
	/** Layout mode */
	layout: GalleryLayoutMode;
	/** Grid-specific configuration */
	grid?: GalleryGridConfig;
	/** Masonry-specific configuration */
	masonry?: GalleryMasonryConfig;
	/** Row-specific configuration */
	row?: GalleryRowConfig;
	/** Carousel-specific configuration */
	carousel?: GalleryCarouselConfig;
	/** Clustering mode */
	clustering?: GalleryClusteringMode;
	/** Sort option */
	sort?: GallerySortOption;
	/** Enable lazy loading */
	lazyLoad?: boolean;
	/** Number of items to load initially */
	initialLoadCount?: number;
	/** Number of items to load on scroll */
	loadMoreCount?: number;
	/** Show artwork titles on hover */
	showTitlesOnHover?: boolean;
	/** Show artist names */
	showArtistNames?: boolean;
	/** Enable lightbox on click */
	enableLightbox?: boolean;
	/** Custom CSS class */
	class?: string;
}

// ============================================================================
// Gallery Cluster Types
// ============================================================================

/**
 * Gallery cluster data
 */
export interface GalleryCluster {
	/** Cluster identifier */
	id: string;
	/** Cluster label */
	label: string;
	/** Cluster description */
	description?: string;
	/** Artworks in this cluster */
	artworks: ArtworkData[];
	/** Cluster metadata (varies by clustering mode) */
	metadata?: {
		/** For color clustering: dominant color */
		color?: string;
		/** For style clustering: style name */
		style?: string;
		/** For mood clustering: mood dimensions */
		mood?: { energy: number; valence: number };
		/** For date clustering: date range */
		dateRange?: { start: Date | string; end: Date | string };
	};
}

// ============================================================================
// Gallery Handlers
// ============================================================================

/**
 * Gallery action handlers
 */
export interface GalleryHandlers {
	/** Called when artwork is clicked */
	onArtworkClick?: (artwork: ArtworkData, index: number) => void;
	/** Called when more items should be loaded */
	onLoadMore?: () => Promise<ArtworkData[]> | void;
	/** Called when sort option changes */
	onSortChange?: (sort: GallerySortOption) => void;
	/** Called when clustering mode changes */
	onClusteringChange?: (mode: GalleryClusteringMode) => void;
	/** Called when layout mode changes */
	onLayoutChange?: (layout: GalleryLayoutMode) => void;
}
