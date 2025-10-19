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
	username: string;
	domain?: string | null;
	displayName?: string | null;
	summary?: string;
	avatar?: string | null;
	header?: string | null;
	followers: number;
	following: number;
	statusesCount: number;
	bot: boolean;
	locked: boolean;
	createdAt: string;
	updatedAt: string;
	trustScore?: number;
	fields: Array<{
		name: string;
		value: string;
		verifiedAt?: string | null;
	}>;
	/**
	 * Legacy ActivityPub compatibility fields
	 */
	name?: string | null;
	preferredUsername?: string | null;
	icon?: {
		url: string;
		mediaType?: string;
	} | null;
	image?: {
		url: string;
		mediaType?: string;
	} | null;
	url?: string;
	published?: string;
	followersCount?: number;
	followingCount?: number;
}

/**
 * Paginated list of actors
 */
export interface ActorListPage {
	actors: LesserActor[];
	totalCount: number;
	nextCursor?: string | null;
}

/**
 * Profile field input
 */
export interface ProfileFieldInput {
	name: string;
	value: string;
	verifiedAt?: string | null;
}

/**
 * Update profile input
 */
export interface UpdateProfileInput {
	displayName?: string;
	bio?: string;
	avatar?: string;
	header?: string;
	locked?: boolean;
	bot?: boolean;
	discoverable?: boolean;
	noIndex?: boolean;
	sensitive?: boolean;
	language?: string;
	fields?: ProfileFieldInput[];
}

/**
 * Enum helpers
 */
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS' | 'DIRECT';
export type ExpandMediaPreference = 'DEFAULT' | 'SHOW_ALL' | 'HIDE_ALL';
export type TimelineOrder = 'NEWEST' | 'OLDEST';
export type StreamQuality = 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
export type DigestFrequency = 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

/**
 * User preference structures
 */
export interface PostingPreferences {
	defaultVisibility: Visibility;
	defaultSensitive: boolean;
	defaultLanguage: string;
}

export interface ReadingPreferences {
	expandSpoilers: boolean;
	expandMedia: ExpandMediaPreference;
	autoplayGifs: boolean;
	timelineOrder: TimelineOrder;
}

export interface DiscoveryPreferences {
	showFollowCounts: boolean;
	searchSuggestionsEnabled: boolean;
	personalizedSearchEnabled: boolean;
}

export interface StreamingPreferences {
	defaultQuality: StreamQuality;
	autoQuality: boolean;
	preloadNext: boolean;
	dataSaver: boolean;
}

export interface NotificationPreferences {
	email: boolean;
	push: boolean;
	inApp: boolean;
	digest: DigestFrequency;
}

export interface PrivacyPreferences {
	defaultVisibility: Visibility;
	indexable: boolean;
	showOnlineStatus: boolean;
}

export interface ReblogFilter {
	key: string;
	enabled: boolean;
}

export interface UserPreferences {
	actorId: string;
	posting: PostingPreferences;
	reading: ReadingPreferences;
	discovery: DiscoveryPreferences;
	streaming: StreamingPreferences;
	notifications: NotificationPreferences;
	privacy: PrivacyPreferences;
	reblogFilters: ReblogFilter[];
}

/**
 * Preference inputs
 */
export interface ReblogFilterInput {
	key: string;
	enabled: boolean;
}

export interface StreamingPreferencesInput {
	defaultQuality?: StreamQuality;
	autoQuality?: boolean;
	preloadNext?: boolean;
	dataSaver?: boolean;
}

export interface UpdateUserPreferencesInput {
	language?: string;
	defaultPostingVisibility?: Visibility;
	defaultMediaSensitive?: boolean;
	expandSpoilers?: boolean;
	expandMedia?: ExpandMediaPreference;
	autoplayGifs?: boolean;
	showFollowCounts?: boolean;
	preferredTimelineOrder?: TimelineOrder;
	searchSuggestionsEnabled?: boolean;
	personalizedSearchEnabled?: boolean;
	reblogFilters?: ReblogFilterInput[];
	streaming?: StreamingPreferencesInput;
}

/**
 * Push subscription structures
 */
export interface PushSubscriptionKeys {
	auth: string;
	p256dh: string;
}

export interface PushSubscriptionAlerts {
	follow: boolean;
	favourite: boolean;
	reblog: boolean;
	mention: boolean;
	poll: boolean;
	followRequest: boolean;
	status: boolean;
	update: boolean;
	adminSignUp: boolean;
	adminReport: boolean;
}

export interface PushSubscription {
	id: string;
	endpoint: string;
	keys: PushSubscriptionKeys;
	alerts: PushSubscriptionAlerts;
	policy: string;
	serverKey?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface PushSubscriptionKeysInput {
	auth: string;
	p256dh: string;
}

export interface PushSubscriptionAlertsInput {
	follow?: boolean;
	favourite?: boolean;
	reblog?: boolean;
	mention?: boolean;
	poll?: boolean;
	followRequest?: boolean;
	status?: boolean;
	update?: boolean;
	adminSignUp?: boolean;
	adminReport?: boolean;
}

export interface RegisterPushSubscriptionInput {
	endpoint: string;
	keys: PushSubscriptionKeysInput;
	alerts: PushSubscriptionAlertsInput;
}

export interface UpdatePushSubscriptionInput {
	alerts: PushSubscriptionAlertsInput;
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
	updateProfile: LesserActor;
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
 * User preferences query result
 */
export interface UserPreferencesResult {
	userPreferences: UserPreferences;
}

/**
 * Update user preferences mutation result
 */
export interface UpdateUserPreferencesResult {
	updateUserPreferences: UserPreferences;
}

/**
 * Update streaming preferences mutation result
 */
export interface UpdateStreamingPreferencesResult {
	updateStreamingPreferences: {
		actorId: string;
		streaming: StreamingPreferences;
	};
}

/**
 * Push subscription query result
 */
export interface PushSubscriptionResult {
	pushSubscription: PushSubscription | null;
}

/**
 * Register push subscription mutation result
 */
export interface RegisterPushSubscriptionResult {
	registerPushSubscription: PushSubscription;
}

/**
 * Update push subscription mutation result
 */
export interface UpdatePushSubscriptionResult {
	updatePushSubscription: PushSubscription;
}

/**
 * Delete push subscription mutation result
 */
export interface DeletePushSubscriptionResult {
	deletePushSubscription: boolean;
}

/**
 * Followers result
 */
export interface FollowersResult {
	followers: ActorListPage;
}

/**
 * Following result
 */
export interface FollowingResult {
	following: ActorListPage;
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
