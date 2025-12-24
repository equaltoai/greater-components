/**
 * Artist Type Definitions
 *
 * Types for artist profiles, badges, and profile management.
 *
 * @module @equaltoai/greater-components-artist/types/artist
 */

// ============================================================================
// Artist Badge Types
// ============================================================================

/**
 * Types of artist badges
 */
export type ArtistBadgeType =
	| 'verified'
	| 'pro'
	| 'emerging'
	| 'established'
	| 'featured'
	| 'mentor'
	| 'curator'
	| 'institution'
	| 'collector'
	| 'ai-transparent'
	| 'ethical-sourcing';

/**
 * Artist badge data
 */
export interface ArtistBadge {
	/** Badge type */
	type: ArtistBadgeType;
	/** Display label */
	label: string;
	/** Badge description */
	description?: string;
	/** Date badge was awarded */
	awardedAt?: Date | string;
	/** Whether badge is verified */
	verified: boolean;
}

// ============================================================================
// Artist Social Links
// ============================================================================

/**
 * Artist social media and external links
 */
export interface ArtistSocialLinks {
	/** Personal website */
	website?: string;
	/** Instagram handle */
	instagram?: string;
	/** Twitter/X handle */
	twitter?: string;
	/** Mastodon handle */
	mastodon?: string;
	/** Behance profile */
	behance?: string;
	/** Dribbble profile */
	dribbble?: string;
	/** ArtStation profile */
	artstation?: string;
	/** DeviantArt profile */
	deviantart?: string;
	/** LinkedIn profile */
	linkedin?: string;
	/** YouTube channel */
	youtube?: string;
	/** Patreon page */
	patreon?: string;
	/** Ko-fi page */
	kofi?: string;
	/** Email address */
	email?: string;
}

// ============================================================================
// Artist Stats
// ============================================================================

/**
 * Artist statistics
 */
export interface ArtistStats {
	/** Total artworks */
	artworkCount: number;
	/** Total followers */
	followerCount: number;
	/** Total following */
	followingCount: number;
	/** Total views across all artworks */
	totalViews?: number;
	/** Total likes across all artworks */
	totalLikes?: number;
	/** Number of collections */
	collectionCount?: number;
	/** Number of exhibitions */
	exhibitionCount?: number;
}

// ============================================================================
// Artist Timeline Types
// ============================================================================

/**
 * Timeline event types
 */
export type TimelineEventType =
	| 'artwork'
	| 'exhibition'
	| 'award'
	| 'education'
	| 'milestone'
	| 'collaboration'
	| 'publication'
	| 'residency';

/**
 * Timeline event data
 */
export interface TimelineEvent {
	/** Event identifier */
	id: string;
	/** Event type */
	type: TimelineEventType;
	/** Event title */
	title: string;
	/** Event description */
	description?: string;
	/** Event date */
	date: Date | string;
	/** End date for ranges */
	endDate?: Date | string;
	/** Associated image URL */
	imageUrl?: string;
	/** Link to related content */
	link?: string;
	/** Location of event */
	location?: string;
}

// ============================================================================
// Artist Data Types
// ============================================================================

/**
 * Full artist data structure
 */
export interface ArtistData {
	/** Unique artist identifier */
	id: string;
	/** URL slug */
	slug: string;
	/** Display name */
	name: string;
	/** Username/handle */
	username: string;
	/** Pronouns */
	pronouns?: string;
	/** Short bio for compact displays */
	shortBio?: string;
	/** Full artist statement */
	statement?: string;
	/** Avatar image URL */
	avatar?: string;
	/** Hero/banner image URL */
	heroBanner?: string;
	/** Location (city, country) */
	location?: string;
	/** Primary art medium/style */
	primaryMedium?: string;
	/** All mediums/styles */
	mediums?: string[];
	/** Social media links */
	socialLinks?: ArtistSocialLinks;
	/** Artist badges */
	badges?: ArtistBadge[];
	/** Artist statistics */
	stats: ArtistStats;
	/** Whether artist accepts commissions */
	acceptsCommissions?: boolean;
	/** Commission status message */
	commissionStatus?: string;
	/** Whether artist is available for mentoring */
	availableForMentoring?: boolean;
	/** AI usage policy */
	aiPolicy?: {
		usesAI: boolean;
		optedOutOfTraining: boolean;
		statement?: string;
	};
	/** Account creation date */
	createdAt: Date | string;
	/** Last active date */
	lastActiveAt?: Date | string;
	/** Whether profile is verified */
	isVerified: boolean;
	/** Whether profile is featured */
	isFeatured?: boolean;
	/** Timeline events */
	timeline?: TimelineEvent[];
}

/**
 * Artist profile component configuration
 */
export interface ArtistConfig {
	/** Display variant */
	variant?: 'full' | 'compact' | 'card' | 'minimal';
	/** Show hero banner */
	showHeroBanner?: boolean;
	/** Show badges */
	showBadges?: boolean;
	/** Show stats */
	showStats?: boolean;
	/** Show social links */
	showSocialLinks?: boolean;
	/** Show timeline */
	showTimeline?: boolean;
	/** Show portfolio sections */
	showPortfolio?: boolean;
	/** Enable edit mode */
	enableEdit?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Artist profile action handlers
 */
export interface ProfileHandlers {
	/** Called when follow button is clicked */
	onFollow?: (artist: ArtistData) => Promise<void> | void;
	/** Called when unfollow button is clicked */
	onUnfollow?: (artist: ArtistData) => Promise<void> | void;
	/** Called when message button is clicked */
	onMessage?: (artist: ArtistData) => void;
	/** Called when commission button is clicked */
	onCommission?: (artist: ArtistData) => void;
	/** Called when share button is clicked */
	onShare?: (artist: ArtistData, platform?: string) => Promise<void> | void;
	/** Called when profile is edited */
	onEdit?: (artist: ArtistData, updates: Partial<ArtistData>) => Promise<void> | void;
	/** Called when social link is clicked */
	onSocialClick?: (platform: string, url: string) => void;
	/** Called when timeline event is clicked */
	onTimelineClick?: (event: TimelineEvent) => void;
	/** Called when artist is reported */
	onReport?: (artist: ArtistData, reason: string) => Promise<void> | void;
}
