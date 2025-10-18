/**
 * Optimistic Update Policies for GraphQL Mutations
 * 
 * Provides instant UI feedback before server response
 */

import type { ApolloCache, Reference } from '@apollo/client/core';

type StatusPayload = { __typename?: string; id: string } & Record<string, unknown>;
type TimelineEdge = { __typename?: string; node: Reference; cursor: string };
type TimelineConnection = { edges: TimelineEdge[]; pageInfo: Record<string, unknown> };
type PollOption = { votesCount: number } & Record<string, unknown>;

/**
 * Optimistic response for favouriting a status
 */
export function optimisticFavourite(statusId: string, currentState: boolean) {
	return {
		__typename: 'Status',
		id: statusId,
		favourited: !currentState,
		favouritesCount: currentState ? -1 : 1, // Relative change
	};
}

/**
 * Optimistic response for reblogging a status
 */
export function optimisticReblog(statusId: string, currentState: boolean) {
	return {
		__typename: 'Status',
		id: statusId,
		reblogged: !currentState,
		reblogsCount: currentState ? -1 : 1, // Relative change
	};
}

/**
 * Optimistic response for bookmarking a status
 */
export function optimisticBookmark(statusId: string, currentState: boolean) {
	return {
		__typename: 'Status',
		id: statusId,
		bookmarked: !currentState,
	};
}

/**
 * Optimistic response for following an account
 */
export function optimisticFollow(accountId: string, currentState: boolean) {
	return {
		__typename: 'Relationship',
		id: accountId,
		following: !currentState,
		requested: false,
	};
}

/**
 * Optimistic response for blocking an account
 */
export function optimisticBlock(accountId: string, currentState: boolean) {
	return {
		__typename: 'Relationship',
		id: accountId,
		blocking: !currentState,
		following: false,
		followedBy: false,
	};
}

/**
 * Optimistic response for muting an account
 */
export function optimisticMute(accountId: string, currentState: boolean, notifications = true) {
	return {
		__typename: 'Relationship',
		id: accountId,
		muting: !currentState,
		mutingNotifications: notifications,
	};
}

/**
 * Update cache after favouriting a status
 */
export function updateCacheAfterFavourite(
	cache: ApolloCache<unknown>,
	statusId: string,
	favourited: boolean
) {
	cache.modify({
		id: cache.identify({ __typename: 'Status', id: statusId }),
		fields: {
			favourited: () => favourited,
			favouritesCount: (existing: number) => {
				return Math.max(0, existing + (favourited ? 1 : -1));
			},
		},
	});
}

/**
 * Update cache after reblogging a status
 */
export function updateCacheAfterReblog(
	cache: ApolloCache<unknown>,
	statusId: string,
	reblogged: boolean
) {
	cache.modify({
		id: cache.identify({ __typename: 'Status', id: statusId }),
		fields: {
			reblogged: () => reblogged,
			reblogsCount: (existing: number) => {
				return Math.max(0, existing + (reblogged ? 1 : -1));
			},
		},
	});
}

/**
 * Update cache after bookmarking a status
 */
export function updateCacheAfterBookmark(
	cache: ApolloCache<unknown>,
	statusId: string,
	bookmarked: boolean
) {
	cache.modify({
		id: cache.identify({ __typename: 'Status', id: statusId }),
		fields: {
			bookmarked: () => bookmarked,
		},
	});
}

/**
 * Update cache after following an account
 */
export function updateCacheAfterFollow(
	cache: ApolloCache<unknown>,
	accountId: string,
	following: boolean,
	locked: boolean
) {
	cache.modify({
		id: cache.identify({ __typename: 'Relationship', id: accountId }),
		fields: {
			following: () => (locked ? false : following),
			requested: () => (locked ? following : false),
		},
	});

	// Update follower count on the account
	cache.modify({
		id: cache.identify({ __typename: 'Account', id: accountId }),
		fields: {
			followersCount: (existing: number) => {
				return Math.max(0, existing + (following ? 1 : -1));
			},
		},
	});
}

/**
 * Update cache after blocking an account
 */
export function updateCacheAfterBlock(
	cache: ApolloCache<unknown>,
	accountId: string,
	blocking: boolean
) {
	cache.modify({
		id: cache.identify({ __typename: 'Relationship', id: accountId }),
		fields: {
			blocking: () => blocking,
			following: () => false,
			followedBy: () => false,
			requested: () => false,
		},
	});
}

/**
 * Update cache after muting an account
 */
export function updateCacheAfterMute(
	cache: ApolloCache<unknown>,
	accountId: string,
	muting: boolean,
	notifications = true
) {
	cache.modify({
		id: cache.identify({ __typename: 'Relationship', id: accountId }),
		fields: {
			muting: () => muting,
			mutingNotifications: () => (muting ? notifications : false),
		},
	});
}

/**
 * Remove status from cache (after delete)
 */
export function removeStatusFromCache(cache: ApolloCache<unknown>, statusId: string) {
	const normalizedId = cache.identify({ __typename: 'Status', id: statusId });
	cache.evict({ id: normalizedId });
	cache.gc();
}

/**
 * Add status to cache (after create)
 */
export function addStatusToCache(
	cache: ApolloCache<unknown>,
	status: StatusPayload,
	timelineField = 'homeTimeline'
): void {
	cache.modify<TimelineConnection>({
		fields: {
			[timelineField](
				existingConnection: TimelineConnection | undefined,
				{ toReference }: { toReference: (value: StatusPayload) => Reference | undefined }
			): TimelineConnection {
				const existing = existingConnection ?? { edges: [], pageInfo: {} };
				const reference = toReference(status);
				if (!reference) {
					return existing;
				}

				const newEdge: TimelineEdge = {
					__typename: 'StatusEdge',
					node: reference,
					cursor: status.id,
				};

				return {
					...existing,
					edges: [newEdge, ...existing.edges],
				};
			},
		},
	});
}

/**
 * Update status in cache (after edit)
 */
export function updateStatusInCache(cache: ApolloCache<unknown>, status: StatusPayload) {
	cache.writeFragment({
		id: cache.identify(status),
		fragment: gql`
			fragment UpdatedStatus on Status {
				id
				content
				editedAt
				mediaAttachments {
					id
				}
			}
		`,
		data: status,
	});
}

/**
 * Optimistic response for deleting a status
 */
export function optimisticDeleteStatus(statusId: string) {
	return {
		deleteStatus: {
			__typename: 'Status',
			id: statusId,
		},
	};
}

/**
 * Optimistic response for voting in a poll
 */
export function optimisticVotePoll(pollId: string, choices: number[], options: PollOption[]): { votePoll: { __typename: 'Poll'; id: string; voted: boolean; ownVotes: number[]; votesCount: number; options: PollOption[] } } {
	return {
		votePoll: {
			__typename: 'Poll',
			id: pollId,
			voted: true,
			ownVotes: choices,
			votesCount: 1, // Increment
			options: options.map((option, index) => ({
				...option,
				votesCount: choices.includes(index) ? option.votesCount + 1 : option.votesCount,
			})),
		},
	};
}

// Import gql for fragments
import { gql } from '@apollo/client/core';
