/**
 * Gallery Components
 *
 * Components for gallery layouts and artwork display.
 * Implements REQ-VIEW-001, REQ-PERF-004, REQ-PERF-005, REQ-DESIGN-006, REQ-A11Y-004
 *
 * @module @equaltoai/greater-components-artist/components/Gallery
 */

// Component exports
export { default as GalleryGrid } from './Grid.svelte';
export { default as GalleryRow } from './Row.svelte';
export { default as GalleryMasonry } from './Masonry.svelte';

// Utility exports
export {
	calculateColumns,
	calculateColumnWidth,
	balanceColumns,
	calculateMasonryPositions,
	measureAspectRatio,
	calculateHeight,
	createVirtualScroller,
	shouldUseVirtualScrolling,
	clusterByArtist,
	clusterByTheme,
	clusterSmart,
	saveScrollPosition,
	restoreScrollPosition,
	getNextIndex,
	getPositionInfo,
	GAP_SIZES,
	BREAKPOINTS,
	VIRTUAL_SCROLL_THRESHOLD,
} from './utils.js';

// Type exports
export type {
	ColumnConfig,
	VirtualScrollConfig,
	VirtualScrollState,
	MasonryColumn,
	GapSize,
	ClusteringMode,
} from './utils.js';

// Gallery namespace for convenient access
import GalleryGrid from './Grid.svelte';
import GalleryRow from './Row.svelte';
import GalleryMasonry from './Masonry.svelte';

/**
 * Gallery namespace object for convenient component access
 *
 * @example
 * ```svelte
 * <Gallery.Grid items={artworks} />
 * <Gallery.Row items={featured} title="Featured" />
 * <Gallery.Masonry items={artworks} />
 * ```
 */
export const Gallery = {
	Grid: GalleryGrid,
	Row: GalleryRow,
	Masonry: GalleryMasonry,
} as const;
