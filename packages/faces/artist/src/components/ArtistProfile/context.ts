/**
 * ArtistProfile Component Context
 *
 * Provides shared state and configuration for compound ArtistProfile components.
 * Uses Svelte 5's context API for passing data between ArtistProfile.* components.
 * Implements REQ-FR-002: Artist Profiles as Gallery Spaces
 *
 * @module @equaltoai/greater-components/faces/artist/ArtistProfile/context
 */

import { getContext, setContext } from 'svelte';
import type { ArtworkData } from '../Artwork/context.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Artist status indicator
 */
export type ArtistStatus = 'online' | 'offline' | 'busy' | 'away';

/**
 * Badge type for professional credentials
 */
export type BadgeType = 'verified' | 'educator' | 'institution' | 'mentor' | 'curator';

/**
 * Profile layout mode
 */
export type ProfileLayout = 'gallery' | 'portfolio' | 'timeline';

/**
 * Portfolio section type
 */
export type SectionType =
	| 'recent-work'
	| 'featured'
	| 'collections'
	| 'commissions'
	| 'work-in-progress'
	| 'archived'
	| 'custom';

/**
 * Artist data structure
 */
export interface ArtistData {
	/** Unique artist identifier */
	id: string;
	/** Display name */
	displayName: string;
	/** Username/handle */
	username: string;
	/** Profile URL */
	profileUrl: string;
	/** Avatar image URL */
	avatar?: string;
	/** Hero banner image URL */
	heroBanner?: string;
	/** Rotating hero artworks for banner */
	heroArtworks?: ArtworkData[];
	/** Artist statement (supports markdown) */
	statement?: string;
	/** Professional badges */
	badges: ArtistBadgeData[];
	/** Current status */
	status: ArtistStatus;
	/** Whether artist is verified */
	verified: boolean;
	/** Commission availability */
	commissionStatus: 'open' | 'closed' | 'waitlist';
	/** Artist statistics - REQ-PHIL-008: Transparent, real metrics */
	stats: ArtistStats;
	/** Portfolio sections */
	sections: PortfolioSectionData[];
	/** Join date */
	joinedAt: string | Date;
	/** Last active */
	lastActiveAt?: string | Date;
}

/**
 * Artist badge data
 */
export interface ArtistBadgeData {
	/** Badge type */
	type: BadgeType;
	/** Tooltip explanation */
	tooltip: string;
	/** When badge was awarded */
	awardedAt?: string | Date;
}

/**
 * Artist statistics - REQ-PHIL-008: Transparent, real metrics
 */
export interface ArtistStats {
	/** Number of followers */
	followers: number;
	/** Number of following */
	following: number;
	/** Total artworks */
	works: number;
	/** Exhibition count */
	exhibitions: number;
	/** Collaboration count */
	collaborations: number;
	/** Total views */
	totalViews: number;
}

/**
 * Portfolio section data
 */
export interface PortfolioSectionData {
	/** Section ID */
	id: string;
	/** Section type */
	type: SectionType;
	/** Section title */
	title: string;
	/** Section description */
	description?: string;
	/** Artworks in section */
	items: ArtworkData[];
	/** Section layout */
	layout: 'grid' | 'row' | 'featured';
	/** Section visibility */
	visible: boolean;
	/** Sort order */
	order: number;
}

/**
 * Timeline item for artist activity
 */
export interface TimelineItem {
	/** Item ID */
	id: string;
	/** Item type */
	type: 'post' | 'artwork' | 'exhibition' | 'collaboration' | 'milestone';
	/** Item content */
	content: string;
	/** Associated artwork if applicable */
	artwork?: ArtworkData;
	/** Timestamp */
	createdAt: string | Date;
	/** Social engagement */
	engagement?: {
		likes: number;
		comments: number;
		shares: number;
	};
}

/**
 * Profile event handlers
 */
export interface ProfileHandlers {
	/** Follow button clicked */
	onFollow?: () => void | Promise<void>;
	/** Unfollow button clicked */
	onUnfollow?: () => void | Promise<void>;
	/** Message button clicked */
	onMessage?: () => void | Promise<void>;
	/** Commission button clicked */
	onCommission?: () => void | Promise<void>;
	/** Edit profile clicked */
	onEdit?: () => void | Promise<void>;
	/** Save profile changes */
	onSave?: (data: Partial<ArtistData>) => void | Promise<void>;
	/** Cancel edit */
	onCancel?: () => void;
	/** Section reordered */
	onSectionReorder?: (sectionIds: string[]) => void | Promise<void>;
	/** Section visibility toggled */
	onSectionToggle?: (sectionId: string, visible: boolean) => void | Promise<void>;
	/** Avatar clicked */
	onAvatarClick?: () => void;
	/** Stats item clicked */
	onStatsClick?: (stat: keyof ArtistStats) => void;
}

/**
 * Profile display configuration
 */
export interface ProfileConfig {
	/** Layout mode */
	layout?: ProfileLayout;
	/** Show hero banner */
	showHeroBanner?: boolean;
	/** Enable parallax on hero */
	enableParallax?: boolean;
	/** Show social elements (REQ-VIEW-002 Professional Mode) */
	showSocial?: boolean;
	/** Enable edit mode */
	editable?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * ArtistProfile context state
 */
export interface ArtistProfileContext {
	/** Artist data */
	readonly artist: ArtistData;
	/** Whether viewing own profile */
	readonly isOwnProfile: boolean;
	/** Display configuration */
	readonly config: Required<ProfileConfig>;
	/** Event handlers */
	readonly handlers: ProfileHandlers;
	/** Current layout mode */
	layout: ProfileLayout;
	/** Edit mode active */
	isEditing: boolean;
	/** Follow state */
	isFollowing: boolean;
	/** Professional mode (hides social elements) - REQ-VIEW-002 */
	professionalMode: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * ArtistProfile context key - unique symbol for context identification
 */
export const ARTIST_PROFILE_CONTEXT_KEY = Symbol('artist-profile-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default profile configuration
 */
export const DEFAULT_PROFILE_CONFIG: Required<ProfileConfig> = {
	layout: 'gallery',
	showHeroBanner: true,
	enableParallax: true,
	showSocial: true,
	editable: false,
	class: '',
};

// ============================================================================
// Context Functions
// ============================================================================

/**
 * Creates and sets the artist profile context
 * @param artist - Artist data to display
 * @param isOwnProfile - Whether viewing own profile
 * @param config - Display configuration options
 * @param handlers - Event handlers
 * @returns The created context object
 */
export function createArtistProfileContext(
	artist: ArtistData | (() => ArtistData),
	isOwnProfile: boolean | (() => boolean) = false,
	config: ProfileConfig | (() => ProfileConfig) = {},
	handlers: ProfileHandlers | (() => ProfileHandlers) = {}
): ArtistProfileContext {
	const getArtist = () =>
		typeof artist === 'function' ? (artist as () => ArtistData)() : (artist as ArtistData);
	const getIsOwnProfile = () =>
		typeof isOwnProfile === 'function' ? isOwnProfile() : isOwnProfile;
	const getConfig = () => (typeof config === 'function' ? config() : config);
	const getHandlers = () =>
		typeof handlers === 'function'
			? (handlers as () => ProfileHandlers)()
			: (handlers as ProfileHandlers);

	const context: ArtistProfileContext = {
		get artist() {
			return getArtist();
		},
		get isOwnProfile() {
			return getIsOwnProfile();
		},
		get config() {
			return {
				...DEFAULT_PROFILE_CONFIG,
				...getConfig(),
			};
		},
		get handlers() {
			return getHandlers();
		},
		layout: getConfig().layout ?? 'gallery',
		isEditing: false,
		isFollowing: false,
		get professionalMode() {
			return !this.config.showSocial;
		},
		set professionalMode(_value: boolean) {
			// If we need to support setting it, we might need a backing store or just ignore/warn
			// For now, assuming it's derived from config.showSocial as per original implementation intent
			// If mutable state is needed, we would need $state()
		},
	};

	setContext(ARTIST_PROFILE_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the artist profile context from a parent component
 * @throws Error if context is not found
 * @returns The artist profile context
 */
export function getArtistProfileContext(): ArtistProfileContext {
	const context = getContext<ArtistProfileContext>(ARTIST_PROFILE_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'ArtistProfile context not found. Ensure this component is used within an ArtistProfile.Root component.'
		);
	}
	return context;
}

/**
 * Checks if artist profile context exists
 * @returns Whether context is available
 */
export function hasArtistProfileContext(): boolean {
	try {
		getContext<ArtistProfileContext>(ARTIST_PROFILE_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get initials from display name for avatar fallback
 */
export function getInitials(displayName: string): string {
	return displayName
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Format stat number for display
 */
export function formatStatNumber(num: number): string {
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}K`;
	}
	return num.toString();
}
