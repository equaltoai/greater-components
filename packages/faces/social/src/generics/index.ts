/**
 * Generic TypeScript patterns for ActivityPub
 *
 * This module provides type-safe interfaces that work across
 * any ActivityPub implementation (Mastodon, Pleroma, Lesser, etc.)
 *
 * @module @equaltoai/greater-components/faces/social/generics
 */

/**
 * Base ActivityPub Actor interface
 * Represents any federated actor (Person, Organization, Service, etc.)
 */
export interface ActivityPubActor<TExtensions = Record<string, unknown>> {
	/**
	 * Unique identifier (URI)
	 */
	id: string;

	/**
	 * ActivityPub type (Person, Organization, Service, etc.)
	 */
	type: string;

	/**
	 * Display name
	 */
	name?: string;

	/**
	 * Display name (UI-friendly alias)
	 */
	displayName?: string;

	/**
	 * Preferred username (handle)
	 */
	preferredUsername?: string;

	/**
	 * Username (UI-friendly alias)
	 */
	username?: string;

	/**
	 * Account identifier (e.g. `user@example.com`)
	 */
	acct?: string;

	/**
	 * Bot account indicator (UI-friendly alias)
	 */
	bot?: boolean;

	/**
	 * Avatar URL (UI-friendly alias)
	 */
	avatar?: string;

	/**
	 * Header/banner URL (UI-friendly alias)
	 */
	header?: string;

	/**
	 * Actor summary/bio
	 */
	summary?: string;

	/**
	 * Avatar image
	 */
	icon?: ActivityPubImage | ActivityPubImage[];

	/**
	 * Header/banner image
	 */
	image?: ActivityPubImage | ActivityPubImage[];

	/**
	 * Profile URL
	 */
	url?: string;

	/**
	 * Inbox URL
	 */
	inbox?: string;

	/**
	 * Outbox URL
	 */
	outbox?: string;

	/**
	 * Followers collection URL
	 */
	followers?: string;

	/**
	 * Following collection URL
	 */
	following?: string;

	/**
	 * Public key for verification
	 */
	publicKey?: {
		id: string;
		owner: string;
		publicKeyPem: string;
	};

	/**
	 * Custom extensions (implementation-specific fields)
	 */
	extensions?: TExtensions;
}

/**
 * ActivityPub Image/Document
 */
export interface ActivityPubImage {
	type: 'Image' | 'Document';
	url: string;
	mediaType?: string;
	name?: string; // Alt text
	previewUrl?: string;
	width?: number;
	height?: number;
	blurhash?: string;
	sensitive?: boolean;
	spoilerText?: string | null;
	mediaCategory?: string;
	mimeType?: string;
	size?: number;
}

/**
 * Base ActivityPub Object interface
 * Represents any federated object (Note, Article, Video, etc.)
 */
export interface ActivityPubObject<TExtensions = Record<string, unknown>> {
	/**
	 * Unique identifier (URI)
	 */
	id: string;

	/**
	 * ActivityPub type (Note, Article, Video, etc.)
	 */
	type: string;

	/**
	 * Object author
	 */
	attributedTo: string | ActivityPubActor;

	/**
	 * Content (HTML or plain text)
	 */
	content?: string;

	/**
	 * Content summary (for content warnings)
	 */
	summary?: string;

	/**
	 * Sensitive content flag
	 */
	sensitive?: boolean;

	/**
	 * Publication timestamp
	 */
	published: string | Date;

	/**
	 * Last update timestamp
	 */
	updated?: string | Date;

	/**
	 * Visibility/audience
	 */
	to?: string[];
	cc?: string[];
	bto?: string[];
	bcc?: string[];

	/**
	 * Media attachments
	 */
	attachment?: ActivityPubImage[];

	/**
	 * Tags (mentions, hashtags, emojis)
	 */
	tag?: ActivityPubTag[];

	/**
	 * Reply information
	 */
	inReplyTo?: string;

	/**
	 * URL for viewing
	 */
	url?: string;

	/**
	 * Replies collection
	 */
	replies?: {
		type: 'Collection';
		totalItems?: number;
		first?: string;
	};

	/**
	 * Custom extensions (implementation-specific fields)
	 */
	extensions?: TExtensions;
}

/**
 * ActivityPub Tag (Mention, Hashtag, Emoji)
 */
export interface ActivityPubTag {
	type: 'Mention' | 'Hashtag' | 'Emoji' | string;
	name: string;
	href?: string;
	icon?: ActivityPubImage;
}

/**
 * ActivityPub Activity interface
 * Represents actions (Like, Announce, Follow, etc.)
 */
export interface ActivityPubActivity<
	TObject = ActivityPubObject,
	TExtensions = Record<string, unknown>,
> {
	/**
	 * Unique identifier (URI)
	 */
	id: string;

	/**
	 * Activity type (Like, Announce, Follow, Create, etc.)
	 */
	type: string;

	/**
	 * Actor performing the activity
	 */
	actor: string | ActivityPubActor;

	/**
	 * Target object
	 */
	object: string | TObject;

	/**
	 * Publication timestamp
	 */
	published?: string | Date;

	/**
	 * Target of the activity (for some activity types)
	 */
	target?: string | ActivityPubObject;

	/**
	 * Custom extensions
	 */
	extensions?: TExtensions;
}

/**
 * Generic Status interface
 * Works with any ActivityPub Note-like object
 */
export interface GenericStatus<T extends ActivityPubObject = ActivityPubObject> {
	/**
	 * Unique identifier
	 */
	id: string;

	/**
	 * Raw ActivityPub object
	 */
	activityPubObject: T;

	/**
	 * Author account
	 */
	account: ActivityPubActor;

	/**
	 * Display content
	 */
	content: string;

	/**
	 * Content warning / summary
	 */
	contentWarning?: string;

	/**
	 * Is sensitive content
	 */
	sensitive: boolean;

	/**
	 * Media attachments
	 */
	mediaAttachments: ActivityPubImage[];

	/**
	 * Mentions
	 */
	mentions: ActivityPubTag[];

	/**
	 * Hashtags
	 */
	hashtags: ActivityPubTag[];

	/**
	 * Custom emojis
	 */
	emojis: ActivityPubTag[];

	/**
	 * Timestamps
	 */
	createdAt: Date;
	updatedAt?: Date;

	/**
	 * Interaction counts
	 */
	repliesCount: number;
	reblogsCount: number;
	favouritesCount: number;

	/**
	 * User's interactions
	 */
	reblogged?: boolean;
	favourited?: boolean;
	bookmarked?: boolean;

	/**
	 * Reply information
	 */
	inReplyToId?: string;
	inReplyToAccountId?: string;
	inReplyToAccount?: ActivityPubActor;
	/**
	 * Hydrated parent status (when available)
	 */
	inReplyToStatus?: GenericStatus<T>;

	/**
	 * Reblog information
	 */
	reblog?: GenericStatus<T>;

	/**
	 * Visibility level
	 */
	visibility: 'public' | 'unlisted' | 'private' | 'direct';

	/**
	 * URL for viewing
	 */
	url?: string;
}

/**
 * Generic Timeline Item
 * Can represent a status, boost, or other activity
 */
export interface GenericTimelineItem<T extends ActivityPubObject = ActivityPubObject> {
	/**
	 * Unique identifier for this timeline item
	 */
	id: string;

	/**
	 * Type of timeline item
	 */
	type: 'status' | 'reblog' | 'notification' | 'activity' | 'tombstone' | string;

	/**
	 * The actual status or object
	 */
	status?: GenericStatus<T>;

	/**
	 * Activity information (for boosts, etc.)
	 */
	activity?: ActivityPubActivity<T>;

	/**
	 * When this item appeared in the timeline
	 */
	timestamp: Date;

	/**
	 * Context information
	 */
	context?: {
		isThread?: boolean;
		isReply?: boolean;
		isBoost?: boolean;
	};

	/**
	 * Platform-specific metadata
	 */
	metadata?: {
		lesser?: {
			/** Soft-deleted indicator */
			isDeleted?: boolean;
			/** Deletion timestamp */
			deletedAt?: string;
			/** Original type before deletion */
			formerType?: string;
			/** Estimated cost in microcents */
			estimatedCost?: number;
			/** Moderation score (0-1) */
			moderationScore?: number;
			/** Has community notes attached */
			hasCommunityNotes?: boolean;
			/** Community notes count */
			communityNotesCount?: number;
			/** Is a quote post */
			isQuote?: boolean;
			/** Quote count */
			quoteCount?: number;
			/** Is quoteable */
			quoteable?: boolean;
			/** Quote permission level */
			quotePermission?: 'EVERYONE' | 'FOLLOWERS' | 'NONE';
			/** Trust score of author */
			authorTrustScore?: number;
			/** AI analysis result */
			aiAnalysis?: boolean;
		};
	};
}

/**
 * Generic Notification
 * Works with any ActivityPub activity
 */
export interface GenericNotification<T extends ActivityPubActivity = ActivityPubActivity> {
	/**
	 * Unique identifier
	 */
	id: string;

	/**
	 * Notification type
	 */
	type:
		| 'mention'
		| 'reblog'
		| 'favourite'
		| 'follow'
		| 'follow_request'
		| 'poll'
		| 'status'
		| string;

	/**
	 * Account that triggered the notification
	 */
	account: ActivityPubActor;

	/**
	 * Related status (if applicable)
	 */
	status?: GenericStatus;

	/**
	 * Raw ActivityPub activity
	 */
	activity?: T;

	/**
	 * When the notification occurred
	 */
	createdAt: Date;

	/**
	 * Read status
	 */
	read?: boolean;
}

/**
 * Generic Adapter interface
 * Converts platform-specific types to generic types
 */
export interface GenericAdapter<TRaw = unknown, TGeneric = GenericStatus> {
	/**
	 * Convert platform-specific type to generic type
	 */
	toGeneric(raw: TRaw): TGeneric;

	/**
	 * Convert generic type to platform-specific type
	 */
	fromGeneric(generic: TGeneric): TRaw;

	/**
	 * Validate platform-specific object
	 */
	validate?(raw: unknown): raw is TRaw;
}

/**
 * Type guard: Check if actor is fully loaded
 */
export function isFullActor(actor: string | ActivityPubActor): actor is ActivityPubActor {
	return typeof actor === 'object' && 'id' in actor;
}

/**
 * Type guard: Check if object is fully loaded
 */
export function isFullObject(object: string | ActivityPubObject): object is ActivityPubObject {
	return typeof object === 'object' && 'id' in object;
}

/**
 * Type guard: Check if object is a Note
 */
export function isNote(object: ActivityPubObject): boolean {
	return object.type === 'Note';
}

/**
 * Type guard: Check if activity is a Like
 */
export function isLike(activity: ActivityPubActivity): boolean {
	return activity.type === 'Like';
}

/**
 * Type guard: Check if activity is an Announce (boost)
 */
export function isAnnounce(activity: ActivityPubActivity): boolean {
	return activity.type === 'Announce';
}

/**
 * Type guard: Check if activity is a Follow
 */
export function isFollow(activity: ActivityPubActivity): boolean {
	return activity.type === 'Follow';
}

/**
 * Helper: Extract actor from object or string
 */
export function extractActor(actorOrString: string | ActivityPubActor): string {
	return isFullActor(actorOrString) ? actorOrString.id : actorOrString;
}

/**
 * Helper: Extract object from object or string
 */
export function extractObject(objectOrString: string | ActivityPubObject): string {
	return isFullObject(objectOrString) ? objectOrString.id : objectOrString;
}

/**
 * Helper: Parse timestamp
 */
export function parseTimestamp(timestamp: string | Date): Date {
	return timestamp instanceof Date ? timestamp : new Date(timestamp);
}

/**
 * Helper: Get visibility from ActivityPub audience fields
 */
export function getVisibility(
	object: ActivityPubObject
): 'public' | 'unlisted' | 'private' | 'direct' {
	const to = object.to || [];
	const cc = object.cc || [];

	// Check for public visibility
	const isPublic =
		to.includes('https://www.w3.org/ns/activitystreams#Public') ||
		cc.includes('https://www.w3.org/ns/activitystreams#Public');

	if (isPublic && cc.some((uri) => uri.includes('/followers'))) {
		return 'public';
	}

	if (isPublic) {
		return 'unlisted';
	}

	if (
		to.some((uri) => uri.includes('/followers')) ||
		cc.some((uri) => uri.includes('/followers'))
	) {
		return 'private';
	}

	return 'direct';
}

// ============================================================================
// Lesser-specific Extensions
// ============================================================================

/**
 * Trust category for trust graph relationships
 */
export type TrustCategory = 'CONTENT' | 'BEHAVIOR' | 'TECHNICAL';

/**
 * Quote permission levels
 */
export type QuotePermission = 'EVERYONE' | 'FOLLOWERS' | 'NONE';

/**
 * Quote types
 */
export type QuoteType = 'FULL' | 'PARTIAL' | 'COMMENTARY' | 'REACTION';

/**
 * Reputation evidence for trust calculations
 */
export interface ReputationEvidence {
	totalPosts: number;
	totalFollowers: number;
	accountAge: number;
	vouchCount: number;
	trustingActors: number;
	averageTrustScore: number;
}

/**
 * Reputation information for an actor
 */
export interface Reputation {
	actorId: string;
	instance: string;
	totalScore: number;
	trustScore: number;
	activityScore: number;
	moderationScore: number;
	communityScore: number;
	calculatedAt: string | Date;
	version: string;
	evidence: ReputationEvidence;
	signature?: string;
}

/**
 * Vouch from one actor to another
 */
export interface Vouch {
	id: string;
	from: string | ActivityPubActor;
	to: string | ActivityPubActor;
	confidence: number;
	context: string;
	voucherReputation: number;
	createdAt: string | Date;
	expiresAt: string | Date;
	active: boolean;
	revoked: boolean;
	revokedAt?: string | Date;
}

/**
 * Trust edge in trust graph
 */
export interface TrustEdge {
	from: string | ActivityPubActor;
	to: string | ActivityPubActor;
	category: TrustCategory;
	score: number;
	updatedAt: string | Date;
}

/**
 * Community note attached to content
 */
export interface CommunityNote {
	id: string;
	author: string | ActivityPubActor;
	content: string;
	helpful: number;
	notHelpful: number;
	createdAt: string | Date;
}

/**
 * Quote context for quoted posts
 */
export interface QuoteContext {
	originalAuthor: string | ActivityPubActor;
	originalNote?: string | ActivityPubObject;
	quoteAllowed: boolean;
	quoteType: QuoteType;
	withdrawn: boolean;
}

/**
 * AI analysis results for content
 */
export interface AIAnalysis {
	id: string;
	objectId: string;
	objectType: string;
	overallRisk: number;
	moderationAction: 'NONE' | 'FLAG' | 'HIDE' | 'REMOVE' | 'SHADOW_BAN' | 'REVIEW';
	confidence: number;
	analyzedAt: string | Date;
	textAnalysis?: {
		sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
		toxicityScore: number;
		containsPII: boolean;
		dominantLanguage: string;
	};
	imageAnalysis?: {
		isNSFW: boolean;
		nsfwConfidence: number;
		violenceScore: number;
		weaponsDetected: boolean;
	};
}

/**
 * Lesser-specific extensions for ActivityPub Actors
 */
export interface LesserActorExtensions extends Record<string, unknown> {
	/** Trust score (0-100) */
	trustScore?: number;
	/** Detailed reputation information */
	reputation?: Reputation;
	/** Vouches received from other actors */
	vouches?: Vouch[];
}

/**
 * Lesser-specific extensions for ActivityPub Objects
 */
export interface LesserObjectExtensions extends Record<string, unknown> {
	/** Estimated cost in microcents */
	estimatedCost?: number;
	/** Moderation score (0-1, higher = more problematic) */
	moderationScore?: number;
	/** Community notes attached to this object */
	communityNotes?: CommunityNote[];
	/** Quote post URL if this quotes another post */
	quoteUrl?: string;
	/** Whether this object can be quoted */
	quoteable?: boolean;
	/** Quote permission level */
	quotePermissions?: QuotePermission;
	/** Quote context information */
	quoteContext?: QuoteContext;
	/** Number of times this has been quoted */
	quoteCount?: number;
	/** AI analysis results */
	aiAnalysis?: AIAnalysis;
}

/**
 * Lesser-specific extensions for ActivityPub Activities
 */
export interface LesserActivityExtensions extends Record<string, unknown> {
	/** Cost of this activity in microcents */
	cost?: number;
}

/**
 * ActivityPub Actor with Lesser extensions
 */
export type LesserActor = ActivityPubActor<LesserActorExtensions>;

/**
 * ActivityPub Object with Lesser extensions
 */
export type LesserObject = ActivityPubObject<LesserObjectExtensions>;

/**
 * ActivityPub Activity with Lesser extensions
 */
export type LesserActivity = ActivityPubActivity<LesserObject, LesserActivityExtensions>;

/**
 * Generic Status with Lesser extensions
 */
export type LesserStatus = GenericStatus<LesserObject>;

/**
 * Type guard: Check if actor has Lesser extensions
 */
export function hasLesserActorExtensions(actor: ActivityPubActor): actor is LesserActor {
	return (
		actor.extensions !== undefined &&
		('trustScore' in actor.extensions || 'reputation' in actor.extensions)
	);
}

/**
 * Type guard: Check if object has Lesser extensions
 */
export function hasLesserObjectExtensions(object: ActivityPubObject): object is LesserObject {
	return (
		object.extensions !== undefined &&
		('estimatedCost' in object.extensions ||
			'moderationScore' in object.extensions ||
			'communityNotes' in object.extensions ||
			'quoteUrl' in object.extensions ||
			'quoteable' in object.extensions ||
			'quotePermissions' in object.extensions ||
			'quoteContext' in object.extensions ||
			'quoteCount' in object.extensions ||
			'aiAnalysis' in object.extensions)
	);
}

/**
 * Type guard: Check if activity has Lesser extensions
 */
export function hasLesserActivityExtensions(
	activity: ActivityPubActivity
): activity is LesserActivity {
	return activity.extensions !== undefined && 'cost' in activity.extensions;
}

/**
 * Helper: Extract trust score from actor
 */
export function getTrustScore(actor: ActivityPubActor): number | null {
	if (hasLesserActorExtensions(actor)) {
		const trustScore = actor.extensions?.['trustScore'];
		if (typeof trustScore === 'number') {
			return trustScore;
		}
	}
	return null;
}

/**
 * Helper: Extract estimated cost from object
 */
export function getEstimatedCost(object: ActivityPubObject): number | null {
	if (hasLesserObjectExtensions(object)) {
		const estimatedCost = object.extensions?.['estimatedCost'];
		if (typeof estimatedCost === 'number') {
			return estimatedCost;
		}
	}
	return null;
}

/**
 * Helper: Check if object has community notes
 */
export function hasCommunityNotes(object: ActivityPubObject): boolean {
	if (hasLesserObjectExtensions(object)) {
		const communityNotes = object.extensions?.['communityNotes'];
		if (Array.isArray(communityNotes)) {
			return communityNotes.length > 0;
		}
	}
	return false;
}

/**
 * Helper: Check if object is quoteable
 */
export function isQuoteable(object: ActivityPubObject): boolean {
	if (hasLesserObjectExtensions(object)) {
		const quoteable = object.extensions?.['quoteable'];
		if (typeof quoteable === 'boolean') {
			return quoteable;
		}
	}
	return true; // Default to true if not specified
}

/**
 * Helper: Get quote permission level
 */
export function getQuotePermission(object: ActivityPubObject): QuotePermission {
	if (hasLesserObjectExtensions(object)) {
		const permission = object.extensions?.['quotePermissions'];
		if (permission === 'EVERYONE' || permission === 'FOLLOWERS' || permission === 'NONE') {
			return permission;
		}
	}
	return 'EVERYONE'; // Default permission
}
