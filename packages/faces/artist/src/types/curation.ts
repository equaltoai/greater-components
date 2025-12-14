/**
 * Curation Type Definitions
 *
 * Types for exhibitions, curators, and collections.
 *
 * @module @equaltoai/greater-components-artist/types/curation
 */

import type { ArtworkData } from './artwork.js';
import type { ArtistData } from './artist.js';

// ============================================================================
// Curator Types
// ============================================================================

/**
 * Curator data structure
 */
export interface CuratorData {
	/** Unique curator identifier */
	id: string;
	/** Curator name */
	name: string;
	/** Curator bio */
	bio?: string;
	/** Avatar image URL */
	avatar?: string;
	/** Affiliated institution */
	institution?: string;
	/** Professional credentials */
	credentials?: string[];
	/** Curatorial focus areas */
	focusAreas?: string[];
	/** Number of exhibitions curated */
	exhibitionCount?: number;
	/** Number of followers */
	followerCount?: number;
	/** Social links */
	socialLinks?: {
		website?: string;
		twitter?: string;
		linkedin?: string;
	};
	/** Whether curator is verified */
	isVerified: boolean;
}

// ============================================================================
// Exhibition Types
// ============================================================================

/**
 * Exhibition status
 */
export type ExhibitionStatus = 'upcoming' | 'current' | 'past' | 'virtual' | 'permanent';

/**
 * Exhibition data structure
 */
export interface ExhibitionData {
	/** Unique exhibition identifier */
	id: string;
	/** URL slug */
	slug: string;
	/** Exhibition title */
	title: string;
	/** Exhibition subtitle */
	subtitle?: string;
	/** Exhibition description */
	description: string;
	/** Curator's statement */
	curatorStatement?: string;
	/** Cover image URL */
	coverImage: string;
	/** Banner image URL */
	bannerImage?: string;
	/** Curator information */
	curator: CuratorData;
	/** Featured artworks */
	artworks: ArtworkData[];
	/** Featured artists */
	artists?: ArtistData[];
	/** Exhibition status */
	status: ExhibitionStatus;
	/** Start date */
	startDate: Date | string;
	/** End date */
	endDate?: Date | string;
	/** Physical location (if applicable) */
	location?: {
		venue: string;
		address?: string;
		city?: string;
		country?: string;
	};
	/** Virtual exhibition URL */
	virtualUrl?: string;
	/** Tags/themes */
	tags?: string[];
	/** View count */
	viewCount?: number;
	/** Whether exhibition is featured */
	isFeatured?: boolean;
	/** Created date */
	createdAt: Date | string;
}

/**
 * Exhibition configuration
 */
export interface ExhibitionConfig {
	/** Display variant */
	variant?: 'full' | 'compact' | 'card';
	/** Show curator information */
	showCurator?: boolean;
	/** Show artwork count */
	showArtworkCount?: boolean;
	/** Show dates */
	showDates?: boolean;
	/** Show location */
	showLocation?: boolean;
	/** Enable virtual tour */
	enableVirtualTour?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Exhibition handlers
 */
export interface ExhibitionHandlers {
	/** Called when exhibition is clicked */
	onClick?: (exhibition: ExhibitionData) => void;
	/** Called when artwork in exhibition is clicked */
	onArtworkClick?: (artwork: ArtworkData) => void;
	/** Called when curator is clicked */
	onCuratorClick?: (curator: CuratorData) => void;
	/** Called when exhibition is shared */
	onShare?: (exhibition: ExhibitionData, platform?: string) => Promise<void> | void;
	/** Called when virtual tour is started */
	onStartTour?: (exhibition: ExhibitionData) => void;
}

// ============================================================================
// Collection Types
// ============================================================================

/**
 * Collection visibility
 */
export type CollectionVisibility = 'public' | 'private' | 'unlisted';

/**
 * Collection data structure
 */
export interface CollectionData {
	/** Unique collection identifier */
	id: string;
	/** URL slug */
	slug: string;
	/** Collection name */
	name: string;
	/** Collection description */
	description?: string;
	/** Cover image URL (or first artwork thumbnail) */
	coverImage?: string;
	/** Owner ID */
	ownerId: string;
	/** Owner name */
	ownerName: string;
	/** Owner avatar */
	ownerAvatar?: string;
	/** Artworks in collection */
	artworks: ArtworkData[];
	/** Artwork count */
	artworkCount: number;
	/** Collection visibility */
	visibility: CollectionVisibility;
	/** Whether collection is featured */
	isFeatured?: boolean;
	/** Tags */
	tags?: string[];
	/** Created date */
	createdAt: Date | string;
	/** Last updated date */
	updatedAt?: Date | string;
}

/**
 * Collection configuration
 */
export interface CollectionConfig {
	/** Display variant */
	variant?: 'full' | 'compact' | 'card' | 'minimal';
	/** Show owner information */
	showOwner?: boolean;
	/** Show artwork count */
	showCount?: boolean;
	/** Show preview thumbnails */
	showPreviews?: boolean;
	/** Number of preview thumbnails */
	previewCount?: number;
	/** Custom CSS class */
	class?: string;
}

/**
 * Collection handlers
 */
export interface CollectionHandlers {
	/** Called when collection is clicked */
	onClick?: (collection: CollectionData) => void;
	/** Called when artwork is added */
	onAddArtwork?: (collection: CollectionData, artworkId: string) => Promise<void> | void;
	/** Called when artwork is removed */
	onRemoveArtwork?: (collection: CollectionData, artworkId: string) => Promise<void> | void;
	/** Called when collection is edited */
	onEdit?: (collection: CollectionData, updates: Partial<CollectionData>) => Promise<void> | void;
	/** Called when collection is deleted */
	onDelete?: (collection: CollectionData) => Promise<void> | void;
	/** Called when collection is shared */
	onShare?: (collection: CollectionData, platform?: string) => Promise<void> | void;
}
