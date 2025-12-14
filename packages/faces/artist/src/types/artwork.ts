/**
 * Artwork Type Definitions
 *
 * Types for artwork display, metadata, and AI usage disclosure.
 *
 * @module @equaltoai/greater-components-artist/types/artwork
 */

// ============================================================================
// Artwork Metadata Types
// ============================================================================

/**
 * Physical dimensions of artwork
 */
export interface ArtworkDimensions {
	/** Width in specified unit */
	width: number;
	/** Height in specified unit */
	height: number;
	/** Depth for 3D works (optional) */
	depth?: number;
	/** Unit of measurement */
	unit: 'cm' | 'in' | 'mm' | 'px';
}

/**
 * Artwork metadata including physical properties
 */
export interface ArtworkMetadata {
	/** Medium used (e.g., "Oil on canvas", "Digital") */
	medium: string;
	/** Physical dimensions */
	dimensions?: ArtworkDimensions;
	/** Year of creation */
	year: number;
	/** Materials used */
	materials?: string[];
	/** Art style or movement */
	style?: string[];
	/** Subject matter tags */
	subjects?: string[];
	/** Dominant colors (hex values) */
	colors?: string[];
	/** Edition information for prints */
	edition?: {
		number: number;
		total: number;
	};
	/** Location where artwork was created */
	location?: string;
	/** Duration for time-based media */
	duration?: number;
}

// ============================================================================
// AI Usage Types
// ============================================================================

/**
 * AI tool used in artwork creation
 */
export interface AITool {
	/** Tool name (e.g., "Midjourney", "DALL-E", "Stable Diffusion") */
	name: string;
	/** Tool version if applicable */
	version?: string;
	/** How the tool was used */
	usage: 'generation' | 'assistance' | 'enhancement' | 'reference';
	/** Description of how tool was used */
	description?: string;
}

/**
 * AI usage disclosure data
 */
export interface AIUsageData {
	/** Whether AI was used in creation */
	aiUsed: boolean;
	/** Percentage of work that is AI-generated (0-100) */
	aiPercentage?: number;
	/** AI tools used */
	tools?: AITool[];
	/** Detailed description of AI involvement */
	description?: string;
	/** Whether artist has opted out of AI training */
	optedOutOfTraining: boolean;
	/** Timestamp of disclosure */
	disclosedAt?: Date | string;
}

// ============================================================================
// Artwork Data Types
// ============================================================================

/**
 * Full artwork data structure
 */
export interface ArtworkData {
	/** Unique artwork identifier */
	id: string;
	/** URL slug */
	slug: string;
	/** Artwork title */
	title: string;
	/** Artwork description */
	description?: string;
	/** Artist statement about the work */
	artistStatement?: string;
	/** Primary image URL */
	imageUrl: string;
	/** Thumbnail image URL */
	thumbnailUrl?: string;
	/** Additional image URLs */
	additionalImages?: string[];
	/** Artwork metadata */
	metadata: ArtworkMetadata;
	/** AI usage disclosure */
	aiUsage?: AIUsageData;
	/** Artist ID */
	artistId: string;
	/** Artist display name */
	artistName: string;
	/** Artist avatar URL */
	artistAvatar?: string;
	/** Creation date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
	/** Whether artwork is published */
	isPublished: boolean;
	/** Whether artwork is featured */
	isFeatured?: boolean;
	/** View count */
	viewCount?: number;
	/** Like/favorite count */
	likeCount?: number;
	/** Comment count */
	commentCount?: number;
	/** Tags for discovery */
	tags?: string[];
	/** Collection IDs this artwork belongs to */
	collectionIds?: string[];
	/** Price information */
	price?: {
		amount: number;
		currency: string;
		isForSale: boolean;
		isPrintAvailable?: boolean;
	};
	/** License information */
	license?: string;
}

/**
 * Artwork component configuration
 */
export interface ArtworkConfig {
	/** Display variant */
	variant?: 'full' | 'compact' | 'card' | 'minimal';
	/** Show metadata panel */
	showMetadata?: boolean;
	/** Show AI disclosure */
	showAIDisclosure?: boolean;
	/** Show artist attribution */
	showAttribution?: boolean;
	/** Show stats (views, likes) */
	showStats?: boolean;
	/** Show action buttons */
	showActions?: boolean;
	/** Enable zoom on image */
	enableZoom?: boolean;
	/** Enable fullscreen view */
	enableFullscreen?: boolean;
	/** Image loading strategy */
	loading?: 'lazy' | 'eager';
	/** Custom CSS class */
	class?: string;
}

/**
 * Artwork action handlers
 */
export interface ArtworkHandlers {
	/** Called when artwork is liked/favorited */
	onLike?: (artwork: ArtworkData) => Promise<void> | void;
	/** Called when artwork is shared */
	onShare?: (artwork: ArtworkData, platform?: string) => Promise<void> | void;
	/** Called when artwork is saved to collection */
	onSave?: (artwork: ArtworkData, collectionId?: string) => Promise<void> | void;
	/** Called when artwork image is clicked */
	onImageClick?: (artwork: ArtworkData) => void;
	/** Called when artist name is clicked */
	onArtistClick?: (artistId: string) => void;
	/** Called when tag is clicked */
	onTagClick?: (tag: string) => void;
	/** Called when purchase/inquiry is initiated */
	onPurchase?: (artwork: ArtworkData) => Promise<void> | void;
	/** Called when comment is submitted */
	onComment?: (artwork: ArtworkData, comment: string) => Promise<void> | void;
	/** Called when artwork is reported */
	onReport?: (artwork: ArtworkData, reason: string) => Promise<void> | void;
}
