/**
 * Generic TypeScript patterns for ActivityPub
 * 
 * This module provides type-safe interfaces that work across
 * any ActivityPub implementation (Mastodon, Pleroma, Lesser, etc.)
 * 
 * @module @greater/fediverse/generics
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
	 * Preferred username (handle)
	 */
	preferredUsername?: string;

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
	width?: number;
	height?: number;
	blurhash?: string;
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
export interface ActivityPubActivity<TObject = ActivityPubObject, TExtensions = Record<string, unknown>> {
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
	type: 'status' | 'reblog' | 'notification' | 'activity';

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
	type: 'mention' | 'reblog' | 'favourite' | 'follow' | 'follow_request' | 'poll' | 'status' | string;

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
export function getVisibility(object: ActivityPubObject): 'public' | 'unlisted' | 'private' | 'direct' {
	const to = object.to || [];
	const cc = object.cc || [];

	// Check for public visibility
	const isPublic = to.includes('https://www.w3.org/ns/activitystreams#Public') ||
		cc.includes('https://www.w3.org/ns/activitystreams#Public');

	if (isPublic && cc.some((uri) => uri.includes('/followers'))) {
		return 'public';
	}

	if (isPublic) {
		return 'unlisted';
	}

	if (to.some((uri) => uri.includes('/followers')) || cc.some((uri) => uri.includes('/followers'))) {
		return 'private';
	}

	return 'direct';
}

