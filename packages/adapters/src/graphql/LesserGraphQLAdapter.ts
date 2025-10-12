/**
 * Lesser GraphQL Adapter
 * 
 * Main adapter class for interacting with Lesser's GraphQL API.
 * Provides methods for all queries, mutations, and subscriptions.
 */

import { gql, type Observable, type FetchResult } from '@apollo/client/core';
import { createGraphQLClient, type GraphQLClientConfig, type GraphQLClientInstance } from './client.js';
import * as optimistic from './optimistic.js';

// Import query/mutation/subscription documents
// Note: In production, these would be imported from compiled .graphql files
// For now, we'll define them inline using gql`` template literals

/**
 * Lesser GraphQL Adapter configuration
 */
export interface LesserGraphQLAdapterConfig extends GraphQLClientConfig {
	/**
	 * Enable optimistic updates for better UX
	 * @default true
	 */
	enableOptimisticUpdates?: boolean;

	/**
	 * Cache time-to-live in seconds
	 * @default 300 (5 minutes)
	 */
	cacheTTL?: number;
}

/**
 * Timeline query variables
 */
export interface TimelineVariables {
	limit?: number;
	maxId?: string;
	minId?: string;
	sinceId?: string;
}

/**
 * Status mutation variables
 */
export interface CreateStatusVariables {
	status: string;
	spoilerText?: string;
	visibility?: 'public' | 'unlisted' | 'private' | 'direct';
	sensitive?: boolean;
	language?: string;
	mediaIds?: string[];
	poll?: PollInput;
	inReplyToId?: string;
	contentWarning?: string;
	scheduledAt?: string;
}

export interface PollInput {
	options: string[];
	expiresIn: number;
	multiple?: boolean;
	hideTotals?: boolean;
}

/**
 * Search variables
 */
export interface SearchVariables {
	query: string;
	type?: 'accounts' | 'hashtags' | 'statuses';
	resolve?: boolean;
	following?: boolean;
	limit?: number;
	offset?: number;
}

/**
 * Subscription event
 */
export interface SubscriptionEvent<T = any> {
	event: 'update' | 'delete' | 'notification' | 'filters_changed' | 'conversation';
	payload?: T;
}

/**
 * Lesser GraphQL Adapter
 * 
 * Provides a high-level API for interacting with Lesser's GraphQL endpoint.
 */
export class LesserGraphQLAdapter {
	private client: GraphQLClientInstance;
	private enableOptimisticUpdates: boolean;

	constructor(config: LesserGraphQLAdapterConfig) {
		this.client = createGraphQLClient(config);
		this.enableOptimisticUpdates = config.enableOptimisticUpdates ?? true;
	}

	/**
	 * Update authentication token
	 */
	updateToken(token: string | null): void {
		this.client.updateToken(token);
	}

	/**
	 * Close client and cleanup resources
	 */
	close(): void {
		this.client.close();
	}

	// ============================================================================
	// TIMELINE QUERIES
	// ============================================================================

	/**
	 * Fetch home timeline
	 */
	async fetchHomeTimeline(variables?: TimelineVariables) {
		const result = await this.client.client.query({
			query: gql`
				query HomeTimeline($limit: Int, $maxId: ID, $minId: ID, $sinceId: ID) {
					homeTimeline(limit: $limit, maxId: $maxId, minId: $minId, sinceId: $sinceId) {
						edges {
							node {
								id
								content
								createdAt
								# ... other fields
							}
							cursor
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			variables,
		});

		return result.data.homeTimeline;
	}

	/**
	 * Fetch public timeline
	 */
	async fetchPublicTimeline(variables?: TimelineVariables & { local?: boolean }) {
		const result = await this.client.client.query({
			query: gql`
				query PublicTimeline($limit: Int, $maxId: ID, $local: Boolean) {
					publicTimeline(limit: $limit, maxId: $maxId, local: $local) {
						edges {
							node {
								id
								content
								createdAt
							}
							cursor
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			variables,
		});

		return result.data.publicTimeline;
	}

	/**
	 * Fetch hashtag timeline
	 */
	async fetchHashtagTimeline(hashtag: string, variables?: TimelineVariables) {
		const result = await this.client.client.query({
			query: gql`
				query HashtagTimeline($hashtag: String!, $limit: Int, $maxId: ID) {
					hashtagTimeline(hashtag: $hashtag, limit: $limit, maxId: $maxId) {
						edges {
							node {
								id
								content
								createdAt
							}
							cursor
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			variables: { hashtag, ...variables },
		});

		return result.data.hashtagTimeline;
	}

	// ============================================================================
	// STATUS QUERIES & MUTATIONS
	// ============================================================================

	/**
	 * Get a single status by ID
	 */
	async getStatus(id: string) {
		const result = await this.client.client.query({
			query: gql`
				query GetStatus($id: ID!) {
					status(id: $id) {
						id
						content
						createdAt
						favourited
						reblogged
						bookmarked
					}
				}
			`,
			variables: { id },
		});

		return result.data.status;
	}

	/**
	 * Create a new status
	 */
	async createStatus(variables: CreateStatusVariables) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation CreateStatus($status: String!, $visibility: VisibilityType, $mediaIds: [ID!]) {
					createStatus(input: { status: $status, visibility: $visibility, mediaIds: $mediaIds }) {
						id
						content
						createdAt
					}
				}
			`,
			variables,
			// Optimistically update cache
			update: (cache, { data }) => {
				if (data?.createStatus) {
					optimistic.addStatusToCache(cache, data.createStatus);
				}
			},
		});

		return result.data?.createStatus;
	}

	/**
	 * Delete a status
	 */
	async deleteStatus(id: string) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation DeleteStatus($id: ID!) {
					deleteStatus(id: $id) {
						id
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? optimistic.optimisticDeleteStatus(id)
				: undefined,
			update: (cache) => {
				optimistic.removeStatusFromCache(cache, id);
			},
		});

		return result.data?.deleteStatus;
	}

	/**
	 * Favourite a status
	 */
	async favouriteStatus(id: string, currentState = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation FavouriteStatus($id: ID!) {
					favouriteStatus(id: $id) {
						id
						favourited
						favouritesCount
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? { favouriteStatus: optimistic.optimisticFavourite(id, currentState) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.favouriteStatus) {
					optimistic.updateCacheAfterFavourite(cache, id, data.favouriteStatus.favourited);
				}
			},
		});

		return result.data?.favouriteStatus;
	}

	/**
	 * Unfavourite a status
	 */
	async unfavouriteStatus(id: string) {
		return this.favouriteStatus(id, true);
	}

	/**
	 * Reblog/boost a status
	 */
	async reblogStatus(id: string, currentState = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation ReblogStatus($id: ID!) {
					reblogStatus(id: $id) {
						id
						reblogged
						reblogsCount
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? { reblogStatus: optimistic.optimisticReblog(id, currentState) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.reblogStatus) {
					optimistic.updateCacheAfterReblog(cache, id, data.reblogStatus.reblogged);
				}
			},
		});

		return result.data?.reblogStatus;
	}

	/**
	 * Unreblog/unboost a status
	 */
	async unreblogStatus(id: string) {
		return this.reblogStatus(id, true);
	}

	/**
	 * Bookmark a status
	 */
	async bookmarkStatus(id: string, currentState = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation BookmarkStatus($id: ID!) {
					bookmarkStatus(id: $id) {
						id
						bookmarked
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? { bookmarkStatus: optimistic.optimisticBookmark(id, currentState) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.bookmarkStatus) {
					optimistic.updateCacheAfterBookmark(cache, id, data.bookmarkStatus.bookmarked);
				}
			},
		});

		return result.data?.bookmarkStatus;
	}

	/**
	 * Unbookmark a status
	 */
	async unbookmarkStatus(id: string) {
		return this.bookmarkStatus(id, true);
	}

	// ============================================================================
	// ACCOUNT QUERIES & MUTATIONS
	// ============================================================================

	/**
	 * Get account by ID
	 */
	async getAccount(id: string) {
		const result = await this.client.client.query({
			query: gql`
				query GetAccount($id: ID!) {
					account(id: $id) {
						id
						username
						displayName
						avatar
					}
				}
			`,
			variables: { id },
		});

		return result.data.account;
	}

	/**
	 * Follow an account
	 */
	async followAccount(id: string, currentState = false, locked = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation FollowAccount($id: ID!) {
					followAccount(id: $id) {
						id
						following
						requested
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? { followAccount: optimistic.optimisticFollow(id, currentState) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.followAccount) {
					optimistic.updateCacheAfterFollow(cache, id, data.followAccount.following, locked);
				}
			},
		});

		return result.data?.followAccount;
	}

	/**
	 * Unfollow an account
	 */
	async unfollowAccount(id: string) {
		return this.followAccount(id, true);
	}

	/**
	 * Block an account
	 */
	async blockAccount(id: string, currentState = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation BlockAccount($id: ID!) {
					blockAccount(id: $id) {
						id
						blocking
					}
				}
			`,
			variables: { id },
			optimisticResponse: this.enableOptimisticUpdates
				? { blockAccount: optimistic.optimisticBlock(id, currentState) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.blockAccount) {
					optimistic.updateCacheAfterBlock(cache, id, data.blockAccount.blocking);
				}
			},
		});

		return result.data?.blockAccount;
	}

	/**
	 * Unblock an account
	 */
	async unblockAccount(id: string) {
		return this.blockAccount(id, true);
	}

	/**
	 * Mute an account
	 */
	async muteAccount(id: string, notifications = true, currentState = false) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation MuteAccount($id: ID!, $notifications: Boolean) {
					muteAccount(id: $id, notifications: $notifications) {
						id
						muting
						mutingNotifications
					}
				}
			`,
			variables: { id, notifications },
			optimisticResponse: this.enableOptimisticUpdates
				? { muteAccount: optimistic.optimisticMute(id, currentState, notifications) }
				: undefined,
			update: (cache, { data }) => {
				if (data?.muteAccount) {
					optimistic.updateCacheAfterMute(cache, id, data.muteAccount.muting, notifications);
				}
			},
		});

		return result.data?.muteAccount;
	}

	/**
	 * Unmute an account
	 */
	async unmuteAccount(id: string) {
		return this.muteAccount(id, true, true);
	}

	// ============================================================================
	// SEARCH
	// ============================================================================

	/**
	 * Search for accounts, statuses, and hashtags
	 */
	async search(variables: SearchVariables) {
		const result = await this.client.client.query({
			query: gql`
				query Search($query: String!, $type: SearchType, $limit: Int) {
					search(query: $query, type: $type, limit: $limit) {
						accounts {
							id
							username
							displayName
						}
						statuses {
							id
							content
						}
						hashtags {
							name
						}
					}
				}
			`,
			variables,
		});

		return result.data.search;
	}

	// ============================================================================
	// NOTIFICATIONS
	// ============================================================================

	/**
	 * Fetch notifications
	 */
	async fetchNotifications(variables?: { types?: string[]; limit?: number; maxId?: string }) {
		const result = await this.client.client.query({
			query: gql`
				query GetNotifications($types: [NotificationType!], $limit: Int, $maxId: ID) {
					notifications(types: $types, limit: $limit, maxId: $maxId) {
						edges {
							node {
								id
								type
								createdAt
								account {
									id
									username
								}
							}
							cursor
						}
						pageInfo {
							hasNextPage
							endCursor
						}
					}
				}
			`,
			variables,
		});

		return result.data.notifications;
	}

	/**
	 * Mark notifications as read
	 */
	async markNotificationsAsRead(ids: string[]) {
		const result = await this.client.client.mutate({
			mutation: gql`
				mutation MarkNotificationsAsRead($ids: [ID!]!) {
					markNotificationsAsRead(ids: $ids)
				}
			`,
			variables: { ids },
		});

		return result.data?.markNotificationsAsRead;
	}

	// ============================================================================
	// SUBSCRIPTIONS
	// ============================================================================

	/**
	 * Subscribe to home timeline updates
	 */
	subscribeToHomeTimeline(): Observable<FetchResult<SubscriptionEvent>> {
		return this.client.client.subscribe({
			query: gql`
				subscription SubscribeToHomeTimeline {
					homeTimelineUpdate {
						event
						payload {
							id
							content
							createdAt
						}
					}
				}
			`,
		});
	}

	/**
	 * Subscribe to notifications
	 */
	subscribeToNotifications(types?: string[]): Observable<FetchResult<SubscriptionEvent>> {
		return this.client.client.subscribe({
			query: gql`
				subscription SubscribeToNotifications($types: [NotificationType!]) {
					notificationUpdate(types: $types) {
						event
						payload {
							id
							type
							createdAt
						}
					}
				}
			`,
			variables: { types },
		});
	}

	/**
	 * Subscribe to public timeline updates
	 */
	subscribeToPublicTimeline(local = false): Observable<FetchResult<SubscriptionEvent>> {
		return this.client.client.subscribe({
			query: gql`
				subscription SubscribeToPublicTimeline($local: Boolean) {
					publicTimelineUpdate(local: $local) {
						event
						payload {
							id
							content
							createdAt
						}
					}
				}
			`,
			variables: { local },
		});
	}

	/**
	 * Subscribe to hashtag timeline updates
	 */
	subscribeToHashtagTimeline(hashtag: string): Observable<FetchResult<SubscriptionEvent>> {
		return this.client.client.subscribe({
			query: gql`
				subscription SubscribeToHashtagTimeline($hashtag: String!) {
					hashtagTimelineUpdate(hashtag: $hashtag) {
						event
						payload {
							id
							content
							createdAt
						}
					}
				}
			`,
			variables: { hashtag },
		});
	}
}

/**
 * Create a new Lesser GraphQL Adapter instance
 */
export function createLesserGraphQLAdapter(config: LesserGraphQLAdapterConfig): LesserGraphQLAdapter {
	return new LesserGraphQLAdapter(config);
}

