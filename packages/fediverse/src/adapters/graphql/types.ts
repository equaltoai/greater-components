/**
 * GraphQL Types for Lesser
 * 
 * Type definitions for Lesser's GraphQL API based on the ActivityPub schema.
 * 
 * @module adapters/graphql/types
 */

/**
 * GraphQL request configuration
 */
export interface GraphQLConfig {
	/**
	 * GraphQL endpoint URL
	 */
	endpoint: string;

	/**
	 * WebSocket endpoint for subscriptions
	 */
	wsEndpoint?: string;

	/**
	 * Authentication token
	 */
	token?: string;

	/**
	 * Custom headers
	 */
	headers?: Record<string, string>;

	/**
	 * Request timeout in milliseconds
	 * @default 30000
	 */
	timeout?: number;

	/**
	 * Enable request caching
	 * @default true
	 */
	enableCache?: boolean;

	/**
	 * Cache TTL in milliseconds
	 * @default 300000 (5 minutes)
	 */
	cacheTTL?: number;

	/**
	 * Maximum cache size (number of entries)
	 * @default 1000
	 */
	cacheSize?: number;

	/**
	 * Enable request deduplication
	 * @default true
	 */
	enableDeduplication?: boolean;

	/**
	 * Enable debug logging
	 * @default false
	 */
	debug?: boolean;
}

/**
 * GraphQL query variables
 */
export type Variables = Record<string, unknown>;

/**
 * GraphQL response
 */
export interface GraphQLResponse<T = unknown> {
	data?: T;
	errors?: GraphQLError[];
}

/**
 * GraphQL error
 */
export interface GraphQLError {
	message: string;
	locations?: Array<{ line: number; column: number }>;
	path?: Array<string | number>;
	extensions?: Record<string, unknown>;
}

/**
 * Lesser Actor (User/Account) type
 */
export interface LesserActor {
	id: string;
	type: 'Person' | 'Organization' | 'Service' | 'Group' | 'Application';
	name?: string;
	preferredUsername: string;
	summary?: string;
	icon?: {
		url: string;
		mediaType?: string;
	};
	image?: {
		url: string;
		mediaType?: string;
	};
	inbox: string;
	outbox: string;
	following?: string;
	followers?: string;
	url?: string;
	published?: string;
	followersCount?: number;
	followingCount?: number;
	statusesCount?: number;
}

/**
 * Lesser Note (Status/Post) type
 */
export interface LesserNote {
	id: string;
	type: 'Note' | 'Article' | 'Question';
	attributedTo: string;
	content: string;
	summary?: string;
	published: string;
	to?: string[];
	cc?: string[];
	inReplyTo?: string;
	sensitive?: boolean;
	attachment?: Array<{
		type: 'Document' | 'Image' | 'Video' | 'Audio';
		url: string;
		mediaType?: string;
		name?: string;
		blurhash?: string;
		width?: number;
		height?: number;
	}>;
	tag?: Array<{
		type: 'Mention' | 'Hashtag' | 'Emoji';
		name: string;
		href?: string;
		icon?: {
			url: string;
			mediaType?: string;
		};
	}>;
	replies?: {
		totalItems: number;
	};
	likes?: {
		totalItems: number;
	};
	shares?: {
		totalItems: number;
	};
}

/**
 * Lesser Activity type
 */
export interface LesserActivity {
	id: string;
	type: 'Create' | 'Update' | 'Delete' | 'Follow' | 'Accept' | 'Reject' | 'Like' | 'Announce' | 'Undo';
	actor: string;
	object: string | LesserNote | LesserActor;
	published: string;
	to?: string[];
	cc?: string[];
}

/**
 * Timeline query result
 */
export interface TimelineResult {
	timeline: {
		items: LesserActivity[];
		nextCursor?: string;
		prevCursor?: string;
	};
}

/**
 * Actor query result
 */
export interface ActorResult {
	actor: LesserActor;
}

/**
 * Note query result
 */
export interface NoteResult {
	note: LesserNote;
}

/**
 * Create note mutation result
 */
export interface CreateNoteResult {
	createNote: {
		activity: LesserActivity;
		note: LesserNote;
	};
}

/**
 * Like mutation result
 */
export interface LikeResult {
	like: {
		activity: LesserActivity;
	};
}

/**
 * Announce (boost/reblog) mutation result
 */
export interface AnnounceResult {
	announce: {
		activity: LesserActivity;
	};
}

/**
 * Follow mutation result
 */
export interface FollowResult {
	follow: {
		activity: LesserActivity;
	};
}

/**
 * Subscription event types
 */
export type SubscriptionEvent<T = unknown> = {
	type: 'timeline.update' | 'notification.new' | 'account.update';
	data: T;
};

/**
 * Timeline update event
 */
export interface TimelineUpdateEvent {
	type: 'timeline.update';
	data: {
		activity: LesserActivity;
	};
}

/**
 * Notification event
 */
export interface NotificationEvent {
	type: 'notification.new';
	data: {
		activity: LesserActivity;
		read: boolean;
	};
}

/**
 * Search result
 */
export interface SearchResult {
	search: {
		actors: LesserActor[];
		notes: LesserNote[];
		tags: Array<{
			name: string;
			count: number;
		}>;
	};
}

/**
 * Followers result
 */
export interface FollowersResult {
	followers: {
		items: LesserActor[];
		nextCursor?: string;
	};
}

/**
 * Following result
 */
export interface FollowingResult {
	following: {
		items: LesserActor[];
		nextCursor?: string;
	};
}

/**
 * Notifications result
 */
export interface NotificationsResult {
	notifications: {
		items: Array<{
			id: string;
			activity: LesserActivity;
			read: boolean;
			createdAt: string;
		}>;
		nextCursor?: string;
		unreadCount: number;
	};
}

