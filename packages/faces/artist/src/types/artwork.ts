/**
 * Artwork UI Type Definitions
 *
 * Canonical artwork shape used across Artist Face UI components, patterns, and stores.
 * This is intentionally optimized for rendering (images + attribution + stats), not API transport.
 *
 * @module @equaltoai/greater-components/faces/artist/types/artwork
 */

// ============================================================================
// Core Artwork Types
// ============================================================================

export interface ArtworkImageSet {
	/** Thumbnail (< 1KB recommended, for blur-up placeholder) */
	thumbnail: string;
	/** Low resolution preview */
	preview: string;
	/** Standard resolution */
	standard: string;
	/** High resolution for zoom/immersive */
	full: string;
}

export interface ArtworkArtist {
	/** Artist identifier */
	id: string;
	/** Display name */
	name: string;
	/** Username/handle (used for profile URLs) */
	username: string;
	/** Avatar URL */
	avatar?: string;
	/** Verified professional indicator */
	verified?: boolean;
}

export interface ArtworkDisplayMetadata {
	/** Medium (e.g., "Oil on canvas", "Digital") */
	medium?: string;
	/** Materials used */
	materials?: string[];
	/** Year of creation */
	year?: number;
	/** Human-readable dimensions string (e.g., "24×36 in") */
	dimensions?: string;
	/** Tags/keywords for discovery */
	tags?: string[];
	/** Art styles/movements (used by discovery filters) */
	style?: string[];
	/** Dominant colors (hex values) */
	colors?: string[];
}

export interface ArtworkStats {
	views: number;
	likes: number;
	collections: number;
	comments: number;
	/** Optional share count */
	shares?: number;
}

export interface ArtworkAIUsage {
	/** Whether AI was used */
	hasAI: boolean;
	/** Tools used (free-form strings) */
	tools?: string[];
	/** Percentage of work that is AI-assisted/generated (0-100) */
	percentage?: number;
	/** Additional disclosure details */
	description?: string;
	/** Whether artist opted out of AI training */
	optedOutOfTraining?: boolean;
}

/**
 * Artwork data structure for UI rendering
 */
export interface ArtworkData {
	/** Unique artwork identifier */
	id: string;
	/** Artwork title */
	title: string;
	/** Artwork description */
	description?: string;
	/** Image URLs at different resolutions */
	images: ArtworkImageSet;
	/** Image dimensions */
	dimensions?: {
		width: number;
		height: number;
	};
	/** Artist information */
	artist: ArtworkArtist;
	/** Artwork metadata */
	metadata: ArtworkDisplayMetadata;
	/** Engagement statistics */
	stats: ArtworkStats;
	/** AI usage disclosure */
	aiUsage?: ArtworkAIUsage;
	/** Alt text for accessibility */
	altText: string;
	/** Creation timestamp */
	createdAt: string | Date;
	/** Last update timestamp */
	updatedAt?: string | Date;
	/** Whether artwork is featured */
	isFeatured?: boolean;
	/** Price information (used by monetization/discovery patterns) */
	price?: {
		amount: number;
		currency: string;
		isForSale: boolean;
		isPrintAvailable?: boolean;
	};
}
