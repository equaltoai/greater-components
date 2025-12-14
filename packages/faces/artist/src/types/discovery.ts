/**
 * Discovery Type Definitions
 *
 * Types for artwork discovery, search, and filtering.
 *
 * @module @equaltoai/greater-components-artist/types/discovery
 */

// ============================================================================
// Color Palette Types
// ============================================================================

/**
 * Color palette for search and filtering
 */
export interface ColorPalette {
	/** Primary colors (hex values) */
	colors: string[];
	/** Color matching tolerance (0-100) */
	tolerance?: number;
	/** Whether to match exact palette or similar */
	matchMode?: 'exact' | 'similar' | 'contains';
}

/**
 * Color search result
 */
export interface ColorSearchResult {
	/** Artwork ID */
	artworkId: string;
	/** Match score (0-100) */
	score: number;
	/** Matched colors */
	matchedColors: string[];
}

// ============================================================================
// Art Style Types
// ============================================================================

/**
 * Art style categories
 */
export type ArtStyleCategory =
	| 'traditional'
	| 'digital'
	| 'mixed-media'
	| 'photography'
	| 'sculpture'
	| 'installation'
	| 'performance'
	| 'video'
	| 'generative';

/**
 * Art style/movement
 */
export interface ArtStyle {
	/** Style identifier */
	id: string;
	/** Style name */
	name: string;
	/** Style category */
	category: ArtStyleCategory;
	/** Style description */
	description?: string;
	/** Related styles */
	relatedStyles?: string[];
	/** Example artwork IDs */
	examples?: string[];
}

// ============================================================================
// Mood Types
// ============================================================================

/**
 * Mood dimensions for discovery
 */
export interface MoodDimensions {
	/** Energy level (-1 to 1, calm to energetic) */
	energy: number;
	/** Valence (-1 to 1, negative to positive) */
	valence: number;
	/** Complexity (-1 to 1, simple to complex) */
	complexity?: number;
	/** Warmth (-1 to 1, cool to warm) */
	warmth?: number;
}

/**
 * Mood preset
 */
export interface MoodPreset {
	/** Preset identifier */
	id: string;
	/** Preset name */
	name: string;
	/** Mood dimensions */
	dimensions: MoodDimensions;
	/** Preset description */
	description?: string;
	/** Icon or emoji */
	icon?: string;
}

// ============================================================================
// Discovery Filter Types
// ============================================================================

/**
 * Date range filter
 */
export interface DateRangeFilter {
	/** Start date */
	from?: Date | string;
	/** End date */
	to?: Date | string;
}

/**
 * Price range filter
 */
export interface PriceRangeFilter {
	/** Minimum price */
	min?: number;
	/** Maximum price */
	max?: number;
	/** Currency */
	currency?: string;
}

/**
 * Dimension range filter
 */
export interface DimensionRangeFilter {
	/** Minimum dimension */
	min?: number;
	/** Maximum dimension */
	max?: number;
	/** Unit of measurement */
	unit?: 'cm' | 'in' | 'mm' | 'px';
}

/**
 * Comprehensive discovery filters
 */
export interface DiscoveryFilters {
	/** Text search query */
	query?: string;
	/** Art styles to include */
	styles?: string[];
	/** Mediums to include */
	mediums?: string[];
	/** Tags to include */
	tags?: string[];
	/** Color palette filter */
	colorPalette?: ColorPalette;
	/** Mood filter */
	mood?: MoodDimensions;
	/** Date range filter */
	dateRange?: DateRangeFilter;
	/** Price range filter */
	priceRange?: PriceRangeFilter;
	/** Width range filter */
	widthRange?: DimensionRangeFilter;
	/** Height range filter */
	heightRange?: DimensionRangeFilter;
	/** Artist IDs to include */
	artistIds?: string[];
	/** Collection IDs to include */
	collectionIds?: string[];
	/** Only show artworks for sale */
	forSaleOnly?: boolean;
	/** Only show artworks with prints available */
	printsAvailable?: boolean;
	/** AI usage filter */
	aiUsage?: 'any' | 'ai-assisted' | 'no-ai' | 'ai-transparent';
	/** Only show featured artworks */
	featuredOnly?: boolean;
	/** Exclude specific artwork IDs */
	excludeIds?: string[];
}

// ============================================================================
// Discovery Configuration
// ============================================================================

/**
 * Discovery engine configuration
 */
export interface DiscoveryConfig {
	/** Enable color palette search */
	enableColorSearch?: boolean;
	/** Enable mood-based discovery */
	enableMoodMap?: boolean;
	/** Enable style filtering */
	enableStyleFilter?: boolean;
	/** Show filter panel */
	showFilters?: boolean;
	/** Show search suggestions */
	showSuggestions?: boolean;
	/** Number of results per page */
	resultsPerPage?: number;
	/** Available mood presets */
	moodPresets?: MoodPreset[];
	/** Available art styles */
	availableStyles?: ArtStyle[];
	/** Custom CSS class */
	class?: string;
}

// ============================================================================
// Discovery Handlers
// ============================================================================

/**
 * Discovery action handlers
 */
export interface DiscoveryHandlers {
	/** Called when search is performed */
	onSearch?: (filters: DiscoveryFilters) => Promise<void> | void;
	/** Called when filters change */
	onFilterChange?: (filters: DiscoveryFilters) => void;
	/** Called when color is selected */
	onColorSelect?: (color: string) => void;
	/** Called when mood position changes */
	onMoodChange?: (mood: MoodDimensions) => void;
	/** Called when style is selected */
	onStyleSelect?: (style: string) => void;
	/** Called when suggestion is clicked */
	onSuggestionClick?: (suggestion: string) => void;
	/** Called when filters are cleared */
	onClearFilters?: () => void;
}
