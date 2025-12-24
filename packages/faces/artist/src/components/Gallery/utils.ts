/**
 * Gallery Utilities
 *
 * Shared utility functions for gallery layout calculations.
 * Supports REQ-PERF-004, REQ-PERF-005 for performance requirements.
 *
 * @module @equaltoai/greater-components-artist/components/Gallery/utils
 */

import type { ArtworkData } from '../Artwork/context.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Column configuration for responsive layouts
 */
export interface ColumnConfig {
	/** Minimum column width in pixels */
	minWidth: number;
	/** Maximum number of columns */
	maxColumns: number;
	/** Gap between items */
	gap: number;
}

/**
 * Virtual scroll configuration
 */
export interface VirtualScrollConfig {
	/** Container height */
	containerHeight: number;
	/** Estimated item height */
	estimatedItemHeight: number;
	/** Number of items to render outside viewport */
	overscan: number;
	/** Total number of items */
	totalItems: number;
}

/**
 * Virtual scroll state
 */
export interface VirtualScrollState {
	/** Start index of visible items */
	startIndex: number;
	/** End index of visible items */
	endIndex: number;
	/** Offset for positioning */
	offsetTop: number;
	/** Total height of all items */
	totalHeight: number;
	/** Visible items */
	visibleItems: number[];
}

/**
 * Masonry column data
 */
export interface MasonryColumn {
	/** Items in this column */
	items: ArtworkData[];
	/** Current height of the column */
	height: number;
}

/**
 * Gap size mapping
 */
export type GapSize = 'sm' | 'md' | 'lg';

/**
 * Clustering mode for gallery items
 */
export type ClusteringMode = 'none' | 'artist' | 'theme' | 'smart';

// ============================================================================
// Constants
// ============================================================================

/**
 * Gap size values in pixels
 */
export const GAP_SIZES: Record<GapSize, number> = {
	sm: 8,
	md: 16,
	lg: 24,
};

/**
 * Default breakpoints for responsive columns
 */
export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	'2xl': 1536,
};

/**
 * Virtual scrolling threshold (REQ-PERF-005)
 */
export const VIRTUAL_SCROLL_THRESHOLD = 50;

// ============================================================================
// Column Calculation
// ============================================================================

/**
 * Calculate optimal column count based on container width
 * Implements auto-responsive column count based on viewport (REQ-VIEW-001)
 *
 * @param containerWidth - Width of the container in pixels
 * @param config - Column configuration options
 * @returns Optimal number of columns
 */
export function calculateColumns(
	containerWidth: number,
	config: Partial<ColumnConfig> = {}
): number {
	const { minWidth = 280, maxColumns = 6, gap = GAP_SIZES.md } = config;

	if (containerWidth <= 0) return 1;

	// Calculate how many columns fit
	const availableWidth = containerWidth + gap;
	const columnWithGap = minWidth + gap;
	const columns = Math.floor(availableWidth / columnWithGap);

	// Clamp between 1 and maxColumns
	return Math.max(1, Math.min(columns, maxColumns));
}

/**
 * Calculate column width based on container and column count
 *
 * @param containerWidth - Width of the container
 * @param columns - Number of columns
 * @param gap - Gap between columns
 * @returns Width of each column
 */
export function calculateColumnWidth(containerWidth: number, columns: number, gap: number): number {
	const totalGap = gap * (columns - 1);
	return (containerWidth - totalGap) / columns;
}

// ============================================================================
// Masonry Layout
// ============================================================================

/**
 * Balance items across columns for masonry layout
 * Implements column balancing algorithm (REQ-VIEW-001)
 *
 * @param items - Array of artwork items
 * @param columnCount - Number of columns
 * @returns Array of columns with balanced items
 */
export function balanceColumns(items: ArtworkData[], columnCount: number): MasonryColumn[] {
	if (columnCount < 1) return [];

	// Initialize columns
	const columns: MasonryColumn[] = Array.from({ length: columnCount }, () => ({
		items: [],
		height: 0,
	}));

	// Distribute items to shortest column
	for (const item of items) {
		const aspectRatio = measureAspectRatio(item);
		const itemHeight = 1 / aspectRatio; // Normalized height

		// Find shortest column
		let shortestIndex = 0;
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		let shortestHeight = columns[0]!.height;

		for (let i = 1; i < columns.length; i++) {
			const col = columns[i];
			if (col && col.height < shortestHeight) {
				shortestIndex = i;
				shortestHeight = col.height;
			}
		}

		// Add item to shortest column
		const targetColumn = columns[shortestIndex];
		if (targetColumn) {
			targetColumn.items.push(item);
			targetColumn.height += itemHeight;
		}
	}

	return columns;
}

/**
 * Calculate item positions for masonry layout
 *
 * @param items - Array of artwork items
 * @param columnCount - Number of columns
 * @param columnWidth - Width of each column
 * @param gap - Gap between items
 * @returns Array of positioned items with x, y, width, height
 */
export function calculateMasonryPositions(
	items: ArtworkData[],
	columnCount: number,
	columnWidth: number,
	gap: number
): Array<{ item: ArtworkData; x: number; y: number; width: number; height: number }> {
	const columnHeights = new Array(columnCount).fill(0);
	const positions: Array<{
		item: ArtworkData;
		x: number;
		y: number;
		width: number;
		height: number;
	}> = [];

	for (const item of items) {
		const aspectRatio = measureAspectRatio(item);
		const height = columnWidth / aspectRatio;

		// Find shortest column
		let shortestIndex = 0;
		let shortestHeight = columnHeights[0];

		for (let i = 1; i < columnCount; i++) {
			if (columnHeights[i] < shortestHeight) {
				shortestIndex = i;
				shortestHeight = columnHeights[i];
			}
		}

		// Calculate position
		const x = shortestIndex * (columnWidth + gap);
		const y = columnHeights[shortestIndex];

		positions.push({
			item,
			x,
			y,
			width: columnWidth,
			height,
		});

		// Update column height
		columnHeights[shortestIndex] += height + gap;
	}

	return positions;
}

// ============================================================================
// Aspect Ratio
// ============================================================================

/**
 * Measure aspect ratio of an artwork
 * Implements variable-sized tiles based on artwork aspect ratios (REQ-VIEW-001)
 *
 * @param artwork - Artwork data
 * @returns Aspect ratio (width / height), defaults to 1 if unknown
 */
export function measureAspectRatio(artwork: ArtworkData): number {
	if (artwork.dimensions?.width && artwork.dimensions?.height) {
		return artwork.dimensions.width / artwork.dimensions.height;
	}
	// Default to square if dimensions unknown
	return 1;
}

/**
 * Calculate height from width and aspect ratio
 *
 * @param width - Target width
 * @param aspectRatio - Aspect ratio (width / height)
 * @returns Calculated height
 */
export function calculateHeight(width: number, aspectRatio: number): number {
	return width / aspectRatio;
}

// ============================================================================
// Virtual Scrolling
// ============================================================================

/**
 * Create virtual scroller state
 * Implements virtual scrolling for galleries > 50 items (REQ-PERF-005)
 *
 * @param config - Virtual scroll configuration
 * @param scrollTop - Current scroll position
 * @returns Virtual scroll state
 */
export function createVirtualScroller(
	config: VirtualScrollConfig,
	scrollTop: number
): VirtualScrollState {
	const { containerHeight, estimatedItemHeight, overscan, totalItems } = config;

	// Calculate visible range
	const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan);
	const visibleCount = Math.ceil(containerHeight / estimatedItemHeight) + 2 * overscan;
	const endIndex = Math.min(totalItems - 1, startIndex + visibleCount);

	// Calculate offset
	const offsetTop = startIndex * estimatedItemHeight;
	const totalHeight = totalItems * estimatedItemHeight;

	// Generate visible item indices
	const visibleItems: number[] = [];
	for (let i = startIndex; i <= endIndex; i++) {
		visibleItems.push(i);
	}

	return {
		startIndex,
		endIndex,
		offsetTop,
		totalHeight,
		visibleItems,
	};
}

/**
 * Check if virtual scrolling should be enabled
 * REQ-PERF-005: Virtual scrolling required for galleries > 50 items
 *
 * @param itemCount - Number of items in gallery
 * @returns Whether virtual scrolling should be enabled
 */
export function shouldUseVirtualScrolling(itemCount: number): boolean {
	return itemCount > VIRTUAL_SCROLL_THRESHOLD;
}

// ============================================================================
// Clustering
// ============================================================================

/**
 * Cluster items by artist
 *
 * @param items - Array of artwork items
 * @returns Map of artist ID to items
 */
export function clusterByArtist(items: ArtworkData[]): Map<string, ArtworkData[]> {
	const clusters = new Map<string, ArtworkData[]>();

	for (const item of items) {
		const artistId = item.artist.id;
		const existing = clusters.get(artistId) || [];
		existing.push(item);
		clusters.set(artistId, existing);
	}

	return clusters;
}

/**
 * Cluster items by theme/tags
 *
 * @param items - Array of artwork items
 * @returns Map of theme to items
 */
export function clusterByTheme(items: ArtworkData[]): Map<string, ArtworkData[]> {
	const clusters = new Map<string, ArtworkData[]>();

	for (const item of items) {
		const tags = item.metadata.tags || ['uncategorized'];
		const primaryTag = tags[0] || 'uncategorized';

		const existing = clusters.get(primaryTag) || [];
		existing.push(item);
		clusters.set(primaryTag, existing);
	}

	return clusters;
}

/**
 * Smart clustering using multiple factors
 *
 * @param items - Array of artwork items
 * @returns Clustered items maintaining visual flow
 */
export function clusterSmart(items: ArtworkData[]): ArtworkData[] {
	// Sort by a combination of factors for visual flow
	return [...items].sort((a, b) => {
		// Primary: group by artist
		if (a.artist.id !== b.artist.id) {
			return a.artist.id.localeCompare(b.artist.id);
		}
		// Secondary: sort by creation date
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return dateB - dateA;
	});
}

// ============================================================================
// Scroll Position
// ============================================================================

/**
 * Save scroll position for restoration
 * Implements maintain scroll position on navigation (REQ-PERF-004)
 *
 * @param key - Unique key for this scroll position
 * @param position - Scroll position to save
 */
export function saveScrollPosition(key: string, position: number): void {
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem(`gallery-scroll-${key}`, String(position));
	}
}

/**
 * Restore saved scroll position
 *
 * @param key - Unique key for this scroll position
 * @returns Saved scroll position or 0
 */
export function restoreScrollPosition(key: string): number {
	if (typeof sessionStorage !== 'undefined') {
		const saved = sessionStorage.getItem(`gallery-scroll-${key}`);
		return saved ? parseInt(saved, 10) : 0;
	}
	return 0;
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

/**
 * Calculate next index for arrow key navigation
 * Implements arrow key navigation through grid (REQ-A11Y-004)
 *
 * @param currentIndex - Current focused item index
 * @param direction - Navigation direction
 * @param columns - Number of columns in grid
 * @param totalItems - Total number of items
 * @returns Next index to focus
 */
export function getNextIndex(
	currentIndex: number,
	direction: 'up' | 'down' | 'left' | 'right',
	columns: number,
	totalItems: number
): number {
	let nextIndex = currentIndex;

	switch (direction) {
		case 'up':
			nextIndex = currentIndex - columns;
			break;
		case 'down':
			nextIndex = currentIndex + columns;
			break;
		case 'left':
			nextIndex = currentIndex - 1;
			break;
		case 'right':
			nextIndex = currentIndex + 1;
			break;
	}

	// Clamp to valid range
	return Math.max(0, Math.min(nextIndex, totalItems - 1));
}

/**
 * Get row and column position for screen reader announcement
 *
 * @param index - Item index
 * @param columns - Number of columns
 * @param totalItems - Total number of items
 * @returns Position info for screen reader
 */
export function getPositionInfo(
	index: number,
	columns: number,
	totalItems: number
): { row: number; column: number; totalRows: number } {
	const row = Math.floor(index / columns) + 1;
	const column = (index % columns) + 1;
	const totalRows = Math.ceil(totalItems / columns);

	return { row, column, totalRows };
}
