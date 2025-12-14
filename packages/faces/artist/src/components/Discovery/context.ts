/**
 * Discovery Component Context
 *
 * Provides shared state and configuration for compound Discovery components.
 * Uses Svelte 5's context API for passing data between Discovery.* components.
 * Implements REQ-FR-004: AI-Powered Artwork Discovery
 *
 * @module @equaltoai/greater-components/faces/artist/Discovery/context
 */

import { getContext, setContext } from 'svelte';
import type { ArtworkData } from '../../types/artwork.js';
import type { DiscoveryFilters, MoodDimensions } from '../../types/discovery.js';
import type { DiscoveryStore } from '../../stores/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Search mode for discovery
 */
export type SearchMode = 'text' | 'visual' | 'color' | 'mood';

/**
 * Sort options for results
 */
export type SortOption = 'relevance' | 'recent' | 'popular' | 'trending';

/**
 * Search suggestion item
 */
export interface SearchSuggestion {
	/** Suggestion ID */
	id: string;
	/** Suggestion text */
	text: string;
	/** Suggestion type */
	type: 'query' | 'artist' | 'style' | 'tag';
	/** Match score */
	score?: number;
	/** Associated image URL */
	image?: string;
}

/**
 * Visual search result from image upload
 */
export interface VisualSearchResult {
	/** Uploaded image URL */
	uploadedImage: string;
	/** Extracted colors */
	extractedColors: string[];
	/** Detected styles */
	detectedStyles: string[];
	/** Similar artworks */
	similarArtworks: ArtworkData[];
	/** Confidence score */
	confidence: number;
}

/**
 * Discovery event handlers
 */
export interface DiscoveryHandlers {
	/** Search submitted */
	onSearch?: (query: string) => void | Promise<void>;
	/** Visual search with image */
	onVisualSearch?: (file: File) => void | Promise<void>;
	/** Filter changed */
	onFilterChange?: (filters: Partial<DiscoveryFilters>) => void;
	/** Filter cleared */
	onFilterClear?: () => void;
	/** Result clicked */
	onResultClick?: (artwork: ArtworkData) => void;
	/** "More like this" clicked */
	onMoreLikeThis?: (artwork: ArtworkData) => void | Promise<void>;
	/** Search saved */
	onSaveSearch?: (name: string) => void;
	/** Suggestion selected */
	onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
	/** Color palette search */
	onColorSearch?: (colors: string[], tolerance: number, mode: 'any' | 'all' | 'dominant') => void;
	/** Mood selection changed */
	onMoodChange?: (dimensions: MoodDimensions) => void;
	/** Style filter changed */
	onStyleChange?: (styles: string[]) => void;
}

/**
 * Discovery display configuration
 */
export interface DiscoveryConfig {
	/** Enable color palette search */
	enableColorSearch?: boolean;
	/** Enable mood-based discovery */
	enableMoodMap?: boolean;
	/** Enable style filtering */
	enableStyleFilter?: boolean;
	/** Enable visual search (image upload) */
	enableVisualSearch?: boolean;
	/** Enable voice search */
	enableVoiceSearch?: boolean;
	/** Show filter panel */
	showFilters?: boolean;
	/** Show suggestions */
	showSuggestions?: boolean;
	/** Results per page */
	resultsPerPage?: number;
	/** Default sort option */
	defaultSort?: SortOption;
	/** Custom CSS class */
	class?: string;
}

/**
 * Discovery context state
 */
export interface DiscoveryContext {
	/** Discovery store reference */
	readonly store: DiscoveryStore;
	/** Display configuration */
	readonly config: Required<DiscoveryConfig>;
	/** Event handlers */
	readonly handlers: DiscoveryHandlers;
	/** Current search mode */
	searchMode: SearchMode;
	/** Current sort option */
	sortBy: SortOption;
	/** Filter panel expanded */
	filtersExpanded: boolean;
	/** Visual search result */
	visualSearchResult: VisualSearchResult | null;
	/** Active filter count */
	activeFilterCount: number;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * Discovery context key - unique symbol for context identification
 */
export const DISCOVERY_CONTEXT_KEY = Symbol('discovery-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default discovery configuration
 */
export const DEFAULT_DISCOVERY_CONFIG: Required<DiscoveryConfig> = {
	enableColorSearch: true,
	enableMoodMap: true,
	enableStyleFilter: true,
	enableVisualSearch: true,
	enableVoiceSearch: false,
	showFilters: true,
	showSuggestions: true,
	resultsPerPage: 24,
	defaultSort: 'relevance',
	class: '',
};

// ============================================================================
// Context Functions
// ============================================================================

/**
 * Helper to resolve value or getter
 */
function resolve<T>(value: T | (() => T)): T {
	return typeof value === 'function' ? (value as () => T)() : value;
}

/**
 * Creates and sets the discovery context
 * @param store - Discovery store instance or getter
 * @param config - Display configuration options or getter
 * @param handlers - Event handlers or getter
 * @returns The created context object
 */
export function createDiscoveryContext(
	store: DiscoveryStore | (() => DiscoveryStore),
	config: DiscoveryConfig | (() => DiscoveryConfig) = {},
	handlers: DiscoveryHandlers | (() => DiscoveryHandlers) = {}
): DiscoveryContext {
	const context: DiscoveryContext = {
		get store() {
			return resolve(store);
		},
		get config() {
			return {
				...DEFAULT_DISCOVERY_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		searchMode: 'text',
		sortBy: resolve(config).defaultSort ?? 'relevance',
		filtersExpanded: false,
		visualSearchResult: null,
		activeFilterCount: 0,
	};

	setContext(DISCOVERY_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the discovery context from a parent component
 * @throws Error if context is not found
 * @returns The discovery context
 */
export function getDiscoveryContext(): DiscoveryContext {
	const context = getContext<DiscoveryContext>(DISCOVERY_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Discovery context not found. Ensure this component is used within a DiscoveryEngine.Root component.'
		);
	}
	return context;
}

/**
 * Checks if discovery context exists
 * @returns Whether context is available
 */
export function hasDiscoveryContext(): boolean {
	try {
		getContext<DiscoveryContext>(DISCOVERY_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Count active filters
 */
export function countActiveFilters(filters: DiscoveryFilters): number {
	let count = 0;
	if (filters.styles?.length) count++;
	if (filters.mediums?.length) count++;
	if (filters.tags?.length) count++;
	if (filters.colorPalette?.colors?.length) count++;
	if (filters.mood) count++;
	if (filters.dateRange?.from || filters.dateRange?.to) count++;
	if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) count++;
	if (filters.aiUsage && filters.aiUsage !== 'any') count++;
	if (filters.forSaleOnly) count++;
	if (filters.featuredOnly) count++;
	return count;
}

/**
 * Format result count for display
 */
export function formatResultCount(count: number): string {
	if (count === 0) return 'No results';
	if (count === 1) return '1 result';
	if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ results`;
	return `${count} results`;
}
