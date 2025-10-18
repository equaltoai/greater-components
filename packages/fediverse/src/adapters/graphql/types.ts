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
 * Thread query result
 */
export interface ThreadResult {
	thread: {
		root: LesserNote;
		replies: LesserActivity[];
	};
}

/**
 * Outbox query result
 */
export interface OutboxResult {
	outbox: {
		items: LesserActivity[];
		nextCursor?: string;
	};
}

/**
 * Bookmarks query result
 */
export interface BookmarksResult {
	bookmarks: {
		items: LesserNote[];
		nextCursor?: string;
	};
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
 * Update note mutation result
 */
export interface UpdateNoteResult {
	updateNote: {
		activity: LesserActivity;
		note: LesserNote;
	};
}

/**
 * Delete note mutation result
 */
export interface DeleteNoteResult {
	deleteNote: {
		activity: LesserActivity;
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
 * Unlike mutation result
 */
export interface UnlikeResult {
	unlike: {
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
 * Unannounce mutation result
 */
export interface UnannounceResult {
	unannounce: {
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
 * Unfollow mutation result
 */
export interface UnfollowResult {
	unfollow: {
		activity: LesserActivity;
	};
}

/**
 * Block actor mutation result
 */
export interface BlockActorResult {
	block: {
		success: boolean;
	};
}

/**
 * Unblock actor mutation result
 */
export interface UnblockActorResult {
	unblock: {
		success: boolean;
	};
}

/**
 * Mute actor mutation result
 */
export interface MuteActorResult {
	mute: {
		success: boolean;
	};
}

/**
 * Unmute actor mutation result
 */
export interface UnmuteActorResult {
	unmute: {
		success: boolean;
	};
}

/**
 * Bookmark mutation result
 */
export interface BookmarkNoteResult {
	bookmark: {
		success: boolean;
	};
}

/**
 * Unbookmark mutation result
 */
export interface UnbookmarkNoteResult {
	unbookmark: {
		success: boolean;
	};
}

/**
 * Mark notification read result
 */
export interface MarkNotificationReadResult {
	markNotificationRead: {
		success: boolean;
	};
}

/**
 * Mark all notifications read result
 */
export interface MarkAllNotificationsReadResult {
	markAllNotificationsRead: {
		success: boolean;
	};
}

/**
 * Report mutation result
 */
export interface ReportResult {
	report: {
		success: boolean;
		reportId: string;
	};
}

/**
 * Update profile mutation result
 */
export interface UpdateProfileResult {
	updateProfile: {
		actor: LesserActor;
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
 * Account update event
 */
export interface AccountUpdateEvent {
	type: 'account.update';
	data: {
		actor: LesserActor;
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
