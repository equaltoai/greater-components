/**
 * GraphQL Adapter for Lesser
 * 
 * Complete GraphQL integration for Lesser's ActivityPub API.
 * Provides a type-safe client with pre-built queries, mutations, and subscriptions.
 * 
 * @module adapters/graphql
 * 
 * @example
 * ```typescript
 * import { createLesserClient } from '@equaltoai/greater-components-fediverse/adapters/graphql';
 * 
 * const client = createLesserClient({
 *   endpoint: 'https://api.lesser.example.com/graphql',
 *   token: 'your-auth-token',
 * });
 * 
 * // Fetch timeline
 * const timeline = await client.getTimeline({ limit: 20 });
 * 
 * // Create a post
 * const post = await client.createNote({
 *   content: 'Hello, Fediverse!',
 *   visibility: 'public',
 * });
 * 
 * // Subscribe to updates
 * const unsubscribe = client.subscribeToTimeline((event) => {
 *   console.log('New activity:', event.data.activity);
 * });
 * ```
 */

export * from './types.js';
export * from './client.js';
export * as queries from './queries.js';

import { GraphQLClient, createGraphQLClient } from './client.js';
import * as queries from './queries.js';
import type {
	AccountUpdateEvent,
	ActorResult,
	AnnounceResult,
	BookmarkNoteResult,
	BookmarksResult,
	BlockActorResult,
	CreateNoteResult,
	DeleteNoteResult,
	FollowResult,
	FollowersResult,
	FollowingResult,
	GraphQLConfig,
	LikeResult,
	MarkAllNotificationsReadResult,
	MarkNotificationReadResult,
	MuteActorResult,
	NotificationEvent,
	NotificationsResult,
	NoteResult,
	OutboxResult,
	ReportResult,
	SearchResult,
	StreamingPreferencesInput,
	SubscriptionEvent,
	ThreadResult,
	TimelineResult,
	TimelineUpdateEvent,
	UpdateStreamingPreferencesResult,
	UnannounceResult,
	UnbookmarkNoteResult,
	UnfollowResult,
	UnlikeResult,
	UnmuteActorResult,
	UnblockActorResult,
	UpdatePushSubscriptionInput,
	UpdateNoteResult,
	UpdateProfileInput,
	UpdateProfileResult,
	UpdateUserPreferencesInput,
	UpdateUserPreferencesResult,
	UserPreferencesResult,
	PushSubscriptionResult,
	RegisterPushSubscriptionInput,
	RegisterPushSubscriptionResult,
	UpdatePushSubscriptionResult,
	DeletePushSubscriptionResult,
} from './types.js';

/**
 * High-level Lesser client with convenience methods
 */
export class LesserClient {
	private client: GraphQLClient;

	constructor(config: GraphQLConfig) {
		this.client = createGraphQLClient(config);
	}

	// ============================================================================
	// QUERIES
	// ============================================================================

	/**
	 * Get timeline
	 */
	async getTimeline(options?: {
		limit?: number;
		cursor?: string;
		type?: 'home' | 'local' | 'federated';
	}): Promise<TimelineResult> {
		return this.client.query<TimelineResult>(queries.GET_TIMELINE, options);
	}

	/**
	 * Get actor by ID or username
	 */
	async getActor(options: { id?: string; username?: string }): Promise<ActorResult> {
		return this.client.query<ActorResult>(queries.GET_ACTOR, options);
	}

	/**
	 * Get note by ID
	 */
	async getNote(id: string): Promise<NoteResult> {
		return this.client.query<NoteResult>(queries.GET_NOTE, { id });
	}

	/**
	 * Get thread (conversation)
	 */
	async getThread(id: string): Promise<ThreadResult> {
		return this.client.query<ThreadResult>(queries.GET_THREAD, { id });
	}

	/**
	 * Search
	 */
	async search(options: {
		query: string;
		type?: 'actors' | 'notes' | 'tags';
		limit?: number;
	}): Promise<SearchResult> {
		return this.client.query<SearchResult>(queries.SEARCH, options);
	}

	/**
	 * Get followers
	 */
	async getFollowers(options: {
		username: string;
		limit?: number;
		cursor?: string;
	}): Promise<FollowersResult> {
		return this.client.query<FollowersResult>(queries.GET_FOLLOWERS, options);
	}

	/**
	 * Get following
	 */
	async getFollowing(options: {
		username: string;
		limit?: number;
		cursor?: string;
	}): Promise<FollowingResult> {
		return this.client.query<FollowingResult>(queries.GET_FOLLOWING, options);
	}

	/**
	 * Get notifications
	 */
	async getNotifications(options?: {
		limit?: number;
		cursor?: string;
		unreadOnly?: boolean;
	}): Promise<NotificationsResult> {
		return this.client.query<NotificationsResult>(queries.GET_NOTIFICATIONS, options);
	}

	/**
	 * Get actor's outbox (posts)
	 */
	async getOutbox(options: { id: string; limit?: number; cursor?: string }): Promise<OutboxResult> {
		return this.client.query<OutboxResult>(queries.GET_OUTBOX, options);
	}

	/**
	 * Get bookmarks
	 */
	async getBookmarks(options?: { limit?: number; cursor?: string }): Promise<BookmarksResult> {
		return this.client.query<BookmarksResult>(queries.GET_BOOKMARKS, options);
	}

	/**
	 * Get user preferences
	 */
	async getUserPreferences(): Promise<UserPreferencesResult> {
		return this.client.query<UserPreferencesResult>(queries.GET_USER_PREFERENCES);
	}

	/**
	 * Get current push subscription (if any)
	 */
	async getPushSubscription(): Promise<PushSubscriptionResult> {
		return this.client.query<PushSubscriptionResult>(queries.GET_PUSH_SUBSCRIPTION);
	}

	// ============================================================================
	// MUTATIONS
	// ============================================================================

	/**
	 * Create a new note (post)
	 */
	async createNote(input: {
		content: string;
		summary?: string;
		inReplyTo?: string;
		sensitive?: boolean;
		visibility?: 'public' | 'unlisted' | 'private' | 'direct';
		attachments?: string[];
	}): Promise<CreateNoteResult> {
		return this.client.mutate<CreateNoteResult>(queries.CREATE_NOTE, { input });
	}

	/**
	 * Update a note
	 */
	async updateNote(
		id: string,
		input: {
			content?: string;
			summary?: string;
			sensitive?: boolean;
		}
	): Promise<UpdateNoteResult> {
		return this.client.mutate<UpdateNoteResult>(queries.UPDATE_NOTE, { id, input });
	}

	/**
	 * Delete a note
	 */
	async deleteNote(id: string): Promise<DeleteNoteResult> {
		return this.client.mutate<DeleteNoteResult>(queries.DELETE_NOTE, { id });
	}

	/**
	 * Like a note
	 */
	async likeNote(id: string): Promise<LikeResult> {
		return this.client.mutate<LikeResult>(queries.LIKE_NOTE, { id });
	}

	/**
	 * Unlike a note
	 */
	async unlikeNote(id: string): Promise<UnlikeResult> {
		return this.client.mutate<UnlikeResult>(queries.UNLIKE_NOTE, { id });
	}

	/**
	 * Announce (boost/reblog) a note
	 */
	async announceNote(id: string): Promise<AnnounceResult> {
		return this.client.mutate<AnnounceResult>(queries.ANNOUNCE_NOTE, { id });
	}

	/**
	 * Unannounce a note
	 */
	async unannounceNote(id: string): Promise<UnannounceResult> {
		return this.client.mutate<UnannounceResult>(queries.UNANNOUNCE_NOTE, { id });
	}

	/**
	 * Follow an actor
	 */
	async followActor(id: string): Promise<FollowResult> {
		return this.client.mutate<FollowResult>(queries.FOLLOW_ACTOR, { id });
	}

	/**
	 * Unfollow an actor
	 */
	async unfollowActor(id: string): Promise<UnfollowResult> {
		return this.client.mutate<UnfollowResult>(queries.UNFOLLOW_ACTOR, { id });
	}

	/**
	 * Block an actor
	 */
	async blockActor(id: string): Promise<BlockActorResult> {
		return this.client.mutate<BlockActorResult>(queries.BLOCK_ACTOR, { id });
	}

	/**
	 * Unblock an actor
	 */
	async unblockActor(id: string): Promise<UnblockActorResult> {
		return this.client.mutate<UnblockActorResult>(queries.UNBLOCK_ACTOR, { id });
	}

	/**
	 * Mute an actor
	 */
	async muteActor(id: string, notifications = true): Promise<MuteActorResult> {
		return this.client.mutate<MuteActorResult>(queries.MUTE_ACTOR, { id, notifications });
	}

	/**
	 * Unmute an actor
	 */
	async unmuteActor(id: string): Promise<UnmuteActorResult> {
		return this.client.mutate<UnmuteActorResult>(queries.UNMUTE_ACTOR, { id });
	}

	/**
	 * Bookmark a note
	 */
	async bookmarkNote(id: string): Promise<BookmarkNoteResult> {
		return this.client.mutate<BookmarkNoteResult>(queries.BOOKMARK_NOTE, { id });
	}

	/**
	 * Remove bookmark
	 */
	async unbookmarkNote(id: string): Promise<UnbookmarkNoteResult> {
		return this.client.mutate<UnbookmarkNoteResult>(queries.UNBOOKMARK_NOTE, { id });
	}

	/**
	 * Mark notification as read
	 */
	async markNotificationRead(id: string): Promise<MarkNotificationReadResult> {
		return this.client.mutate<MarkNotificationReadResult>(queries.MARK_NOTIFICATION_READ, { id });
	}

	/**
	 * Mark all notifications as read
	 */
	async markAllNotificationsRead(): Promise<MarkAllNotificationsReadResult> {
		return this.client.mutate<MarkAllNotificationsReadResult>(queries.MARK_ALL_NOTIFICATIONS_READ);
	}

	/**
	 * Report content or actor
	 */
	async report(input: {
		targetId: string;
		targetType: 'note' | 'actor';
		category: string;
		comment?: string;
		forward?: boolean;
	}): Promise<ReportResult> {
		return this.client.mutate<ReportResult>(queries.REPORT, { input });
	}

	/**
	 * Update overall user preferences
	 */
	async updateUserPreferences(
		input: UpdateUserPreferencesInput
	): Promise<UpdateUserPreferencesResult> {
		return this.client.mutate<UpdateUserPreferencesResult>(queries.UPDATE_USER_PREFERENCES, {
			input,
		});
	}

	/**
	 * Update streaming-specific preferences
	 */
	async updateStreamingPreferences(
		input: StreamingPreferencesInput
	): Promise<UpdateStreamingPreferencesResult> {
		return this.client.mutate<UpdateStreamingPreferencesResult>(
			queries.UPDATE_STREAMING_PREFERENCES,
			{ input }
		);
	}

	/**
	 * Register a new push subscription
	 */
	async registerPushSubscription(
		input: RegisterPushSubscriptionInput
	): Promise<RegisterPushSubscriptionResult> {
		return this.client.mutate<RegisterPushSubscriptionResult>(
			queries.REGISTER_PUSH_SUBSCRIPTION,
			{ input }
		);
	}

	/**
	 * Update the alerts for an existing push subscription
	 */
	async updatePushSubscription(
		input: UpdatePushSubscriptionInput
	): Promise<UpdatePushSubscriptionResult> {
		return this.client.mutate<UpdatePushSubscriptionResult>(
			queries.UPDATE_PUSH_SUBSCRIPTION,
			{ input }
		);
	}

	/**
	 * Delete the current push subscription
	 */
	async deletePushSubscription(): Promise<DeletePushSubscriptionResult> {
		return this.client.mutate<DeletePushSubscriptionResult>(queries.DELETE_PUSH_SUBSCRIPTION);
	}

	/**
	 * Update actor profile
	 */
	async updateProfile(input: UpdateProfileInput): Promise<UpdateProfileResult> {
		return this.client.mutate<UpdateProfileResult>(queries.UPDATE_PROFILE, { input });
	}

	// ============================================================================
	// SUBSCRIPTIONS
	// ============================================================================

	/**
	 * Subscribe to timeline updates
	 */
	subscribeToTimeline(
		callback: (event: TimelineUpdateEvent) => void,
		type?: 'home' | 'local' | 'federated'
	): () => void {
		return this.client.subscribe(
			queries.SUBSCRIBE_TIMELINE,
			callback as (event: SubscriptionEvent) => void,
			{ type }
		);
	}

	/**
	 * Subscribe to new notifications
	 */
	subscribeToNotifications(callback: (event: NotificationEvent) => void): () => void {
		return this.client.subscribe(
			queries.SUBSCRIBE_NOTIFICATIONS,
			callback as (event: SubscriptionEvent) => void
		);
	}

	/**
	 * Subscribe to account updates
	 */
	subscribeToAccount(callback: (event: AccountUpdateEvent) => void): () => void {
		return this.client.subscribe(queries.SUBSCRIBE_ACCOUNT, (event: SubscriptionEvent) => {
			callback(event as AccountUpdateEvent);
		});
	}

	// ============================================================================
	// UTILITIES
	// ============================================================================

	/**
	 * Update authentication token
	 */
	setToken(token: string) {
		this.client.setToken(token);
	}

	/**
	 * Disconnect all WebSocket subscriptions
	 */
	disconnect() {
		this.client.disconnect();
	}

	/**
	 * Get underlying GraphQL client for custom queries
	 */
	getRawClient(): GraphQLClient {
		return this.client;
	}
}

/**
 * Create a Lesser client instance
 * 
 * @param config - GraphQL configuration
 * @returns Lesser client instance
 * 
 * @example
 * ```typescript
 * const client = createLesserClient({
 *   endpoint: 'https://api.lesser.example.com/graphql',
 *   token: 'your-auth-token',
 * });
 * 
 * // Use the client
 * const timeline = await client.getTimeline({ limit: 20 });
 * ```
 */
export function createLesserClient(config: GraphQLConfig): LesserClient {
	return new LesserClient(config);
}
