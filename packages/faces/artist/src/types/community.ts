/**
 * Community Type Definitions
 *
 * Types for critique circles, collaborations, and mentorship.
 *
 * @module @equaltoai/greater-components-artist/types/community
 */

import type { ArtistData } from './artist.js';
import type { ArtworkData } from './artwork.js';
import type { CritiqueAnnotation } from './creative-tools.js';

// ============================================================================
// Critique Circle Types
// ============================================================================

/**
 * Critique circle member role
 */
export type CritiqueCircleMemberRole = 'admin' | 'moderator' | 'member';

/**
 * Critique circle member
 */
export interface CritiqueCircleMember {
	/** Member artist data */
	artist: ArtistData;
	/** Member role */
	role: CritiqueCircleMemberRole;
	/** Join date */
	joinedAt: Date | string;
	/** Number of critiques given */
	critiquesGiven: number;
	/** Number of critiques received */
	critiquesReceived: number;
}

/**
 * Critique submission
 */
export interface CritiqueSubmission {
	/** Submission identifier */
	id: string;
	/** Artwork being critiqued */
	artwork: ArtworkData;
	/** Submitter ID */
	submitterId: string;
	/** Submission date */
	submittedAt: Date | string;
	/** Critique deadline */
	deadline?: Date | string;
	/** Specific feedback requested */
	feedbackRequested?: string;
	/** Critiques received */
	critiques: {
		authorId: string;
		authorName: string;
		annotations: CritiqueAnnotation[];
		summary: string;
		createdAt: Date | string;
	}[];
	/** Whether critique is complete */
	isComplete: boolean;
}

/**
 * Critique circle data
 */
export interface CritiqueCircleData {
	/** Circle identifier */
	id: string;
	/** Circle name */
	name: string;
	/** Circle description */
	description?: string;
	/** Cover image URL */
	coverImage?: string;
	/** Circle members */
	members: CritiqueCircleMember[];
	/** Maximum members */
	maxMembers?: number;
	/** Current submission queue */
	queue: CritiqueSubmission[];
	/** Active critique session */
	activeSession?: CritiqueSubmission;
	/** Critique history */
	history: CritiqueSubmission[];
	/** Circle rules/guidelines */
	guidelines?: string;
	/** Whether circle is public */
	isPublic: boolean;
	/** Required skill level */
	skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'all';
	/** Focus areas */
	focusAreas?: string[];
	/** Created date */
	createdAt: Date | string;
}

/**
 * Critique circle handlers
 */
export interface CritiqueCircleHandlers {
	/** Called when joining circle */
	onJoin?: (circle: CritiqueCircleData) => Promise<void> | void;
	/** Called when leaving circle */
	onLeave?: (circle: CritiqueCircleData) => Promise<void> | void;
	/** Called when submitting artwork for critique */
	onSubmit?: (
		circle: CritiqueCircleData,
		artwork: ArtworkData,
		feedbackRequested?: string
	) => Promise<void> | void;
	/** Called when critique is given */
	onCritique?: (
		submission: CritiqueSubmission,
		annotations: CritiqueAnnotation[],
		summary: string
	) => Promise<void> | void;
	/** Called when member is invited */
	onInvite?: (circle: CritiqueCircleData, artistId: string) => Promise<void> | void;
	/** Called when member role is changed */
	onChangeRole?: (
		circle: CritiqueCircleData,
		memberId: string,
		role: CritiqueCircleMemberRole
	) => Promise<void> | void;
}

// ============================================================================
// Collaboration Types
// ============================================================================

/**
 * Collaboration status
 */
export type CollaborationStatus = 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';

/**
 * Collaboration member
 */
export interface CollaborationMember {
	/** Member artist data */
	artist: ArtistData;
	/** Member role in collaboration */
	role: string;
	/** Join date */
	joinedAt: Date | string;
	/** Contribution description */
	contribution?: string;
}

/**
 * Collaboration update
 */
export interface CollaborationUpdate {
	/** Update identifier */
	id: string;
	/** Author ID */
	authorId: string;
	/** Author name */
	authorName: string;
	/** Update content */
	content: string;
	/** Attached media */
	media?: string[];
	/** Created date */
	createdAt: Date | string;
}

/**
 * Collaboration data
 */
export interface CollaborationData {
	/** Collaboration identifier */
	id: string;
	/** Collaboration title */
	title: string;
	/** Collaboration description */
	description: string;
	/** Cover image URL */
	coverImage?: string;
	/** Collaboration status */
	status: CollaborationStatus;
	/** Collaboration members */
	members: CollaborationMember[];
	/** Maximum members */
	maxMembers?: number;
	/** Updates/activity feed */
	updates: CollaborationUpdate[];
	/** Shared files/assets */
	sharedAssets?: {
		id: string;
		name: string;
		url: string;
		uploadedBy: string;
		uploadedAt: Date | string;
	}[];
	/** Final artwork IDs */
	finalArtworkIds?: string[];
	/** Tags */
	tags?: string[];
	/** Whether collaboration is public */
	isPublic: boolean;
	/** Whether accepting new members */
	acceptingMembers: boolean;
	/** Created date */
	createdAt: Date | string;
	/** Deadline */
	deadline?: Date | string;
}

/**
 * Collaboration handlers
 */
export interface CollaborationHandlers {
	/** Called when joining collaboration */
	onJoin?: (collaboration: CollaborationData) => Promise<void> | void;
	/** Called when leaving collaboration */
	onLeave?: (collaboration: CollaborationData) => Promise<void> | void;
	/** Called when posting update */
	onPostUpdate?: (
		collaboration: CollaborationData,
		content: string,
		media?: string[]
	) => Promise<void> | void;
	/** Called when uploading asset */
	onUploadAsset?: (collaboration: CollaborationData, file: File) => Promise<void> | void;
	/** Called when inviting member */
	onInvite?: (collaboration: CollaborationData, artistId: string) => Promise<void> | void;
	/** Called when status changes */
	onStatusChange?: (
		collaboration: CollaborationData,
		status: CollaborationStatus
	) => Promise<void> | void;
	/** Called when collaboration is completed */
	onComplete?: (
		collaboration: CollaborationData,
		finalArtworkIds: string[]
	) => Promise<void> | void;
}

// ============================================================================
// Mentor Types
// ============================================================================

/**
 * Mentor availability
 */
export interface MentorAvailability {
	/** Available for one-on-one sessions */
	oneOnOne: boolean;
	/** Available for portfolio reviews */
	portfolioReview: boolean;
	/** Available for ongoing mentorship */
	ongoingMentorship: boolean;
	/** Available hours per week */
	hoursPerWeek?: number;
	/** Timezone */
	timezone?: string;
}

/**
 * Mentor filters for matching
 */
export interface MentorFilters {
	/** Art styles/mediums */
	styles?: string[];
	/** Skill areas */
	skillAreas?: string[];
	/** Experience level of mentee */
	menteeLevel?: 'beginner' | 'intermediate' | 'advanced';
	/** Availability requirements */
	availability?: Partial<MentorAvailability>;
	/** Language preferences */
	languages?: string[];
	/** Price range (for paid mentorship) */
	priceRange?: {
		min?: number;
		max?: number;
		currency?: string;
	};
	/** Location/timezone preferences */
	timezone?: string;
	/** Only show verified mentors */
	verifiedOnly?: boolean;
}

/**
 * Mentor match result
 */
export interface MentorMatch {
	/** Mentor artist data */
	mentor: ArtistData;
	/** Match score (0-100) */
	matchScore: number;
	/** Matching criteria */
	matchingCriteria: string[];
	/** Mentor's availability */
	availability: MentorAvailability;
	/** Mentor's rates (if applicable) */
	rates?: {
		hourlyRate?: number;
		portfolioReviewRate?: number;
		currency: string;
	};
	/** Number of current mentees */
	currentMenteeCount?: number;
	/** Reviews/testimonials */
	reviews?: {
		rating: number;
		comment: string;
		menteeId: string;
		menteeName: string;
		createdAt: Date | string;
	}[];
}

/**
 * Mentor match handlers
 */
export interface MentorMatchHandlers {
	/** Called when search is performed */
	onSearch?: (filters: MentorFilters) => Promise<MentorMatch[]> | void;
	/** Called when mentor is contacted */
	onContact?: (mentor: ArtistData, message: string) => Promise<void> | void;
	/** Called when mentorship is requested */
	onRequestMentorship?: (
		mentor: ArtistData,
		type: keyof MentorAvailability
	) => Promise<void> | void;
	/** Called when mentor profile is viewed */
	onViewProfile?: (mentor: ArtistData) => void;
}
