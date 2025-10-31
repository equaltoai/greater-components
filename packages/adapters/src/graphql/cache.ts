/**
 * Apollo Client Cache Configuration for Lesser
 * 
 * Configures normalized caching with:
 * - Type policies for pagination
 * - Field policies for merging
 * - Cache key generation
 * - Garbage collection
 */

import type { ApolloCache, InMemoryCacheConfig, TypePolicies } from '@apollo/client/core/index.js';

type TimestampedNode = { createdAt?: string | null };
type ConnectionEdges = { edges?: Array<{ node: TimestampedNode }> };
type ReadFieldFn = <T>(fieldName: string, from: unknown) => T | undefined;

/**
 * Type policies for Apollo Client cache
 */
export const typePolicies: TypePolicies = {
	Query: {
		fields: {
			/**
			 * Timeline queries use cursor-based pagination
			 */
			homeTimeline: {
				keyArgs: false,
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			publicTimeline: {
				keyArgs: ['local'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			hashtagTimeline: {
				keyArgs: ['hashtag'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			listTimeline: {
				keyArgs: ['listId'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},

			/**
			 * Notifications use cursor-based pagination
			 */
			notifications: {
				keyArgs: ['types'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},

			/**
			 * Search results
			 */
			searchStatuses: {
				keyArgs: ['query', 'resolve'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			searchAccounts: {
				keyArgs: ['query', 'resolve', 'following'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			searchHashtags: {
				keyArgs: ['query'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},

			/**
			 * Conversations/Messages
			 */
			conversations: {
				keyArgs: false,
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},
			conversationMessages: {
				keyArgs: ['conversationId'],
				merge(existing = { edges: [], pageInfo: {} }, incoming) {
					return {
						...incoming,
						edges: [...existing.edges, ...incoming.edges],
						pageInfo: incoming.pageInfo,
					};
				},
			},

		/**
		 * Followers/Following - use username as key and handle ActorListPage structure
		 */
		followers: {
			keyArgs: ['username'],
			merge(existing, incoming) {
				if (!existing) {
					return incoming;
				}
				
				// ActorListPage structure (actors array, not edges)
				const existingActors = existing.actors || [];
				const incomingActors = incoming.actors || [];
				
				return {
					...incoming,
					actors: [...existingActors, ...incomingActors],
					nextCursor: incoming.nextCursor,
					totalCount: incoming.totalCount
				};
			},
		},
		following: {
			keyArgs: ['username'],
			merge(existing, incoming) {
				if (!existing) {
					return incoming;
				}
				
				// ActorListPage structure (actors array, not edges)
				const existingActors = existing.actors || [];
				const incomingActors = incoming.actors || [];
				
				return {
					...incoming,
					actors: [...existingActors, ...incomingActors],
					nextCursor: incoming.nextCursor,
					totalCount: incoming.totalCount
				};
			},
		},
		
		/**
		 * User preferences - always use latest
		 */
		userPreferences: {
			merge(_, incoming) {
				return incoming;
			},
		},
		
		/**
		 * Push subscription - always use latest
		 */
		pushSubscription: {
			merge(_, incoming) {
				return incoming;
			},
		},
		},
	},

	Status: {
		fields: {
			/**
			 * Merge replies and context
			 */
			replies: {
				merge(existing = [], incoming) {
					return [...existing, ...incoming];
				},
			},
			context: {
				merge(existing, incoming) {
					return incoming || existing;
				},
			},
		},
	},

	Actor: {
		keyFields: ['id'],
		fields: {
			/**
			 * Merge actor fields (Lesser uses Actor type)
			 */
			fields: {
				merge(existing = [], incoming) {
					return incoming || existing;
				},
			},
		},
	},

	Account: {
		fields: {
			/**
			 * Merge account fields
			 */
			fields: {
				merge(existing = [], incoming) {
					return incoming || existing;
				},
			},
			emojis: {
				merge(existing = [], incoming) {
					return incoming || existing;
				},
			},
		},
	},
	
	/**
	 * User Preferences - cache by actorId
	 */
	UserPreferences: {
		keyFields: ['actorId'],
	},
	
	/**
	 * Push Subscription - unique per user
	 */
	PushSubscription: {
		keyFields: ['id'],
	},

	Notification: {
		keyFields: ['id', 'type', 'createdAt'],
	},

	Conversation: {
		fields: {
			/**
			 * Always use latest account list
			 */
			accounts: {
				merge(_, incoming) {
					return incoming;
				},
			},
		},
	},

	Poll: {
		fields: {
			/**
			 * Merge poll options
			 */
			options: {
				merge(_, incoming) {
					return incoming;
				},
			},
		},
	},
};

/**
 * Apollo Client cache configuration
 */
export const cacheConfig: InMemoryCacheConfig = {
	typePolicies,
	possibleTypes: {
		// Add any union or interface types here
	},
	addTypename: true,
};

/**
 * Cache eviction policies
 */
export const cacheEvictionPolicies = {
	/**
	 * Maximum age for cached data (in milliseconds)
	 */
	maxAge: {
		default: 1000 * 60 * 30, // 30 minutes
		timeline: 1000 * 60 * 5, // 5 minutes
		notifications: 1000 * 60 * 2, // 2 minutes
		search: 1000 * 60 * 10, // 10 minutes
	},

	/**
	 * Maximum number of items to cache per query
	 */
	maxItems: {
		timeline: 200,
		notifications: 100,
		search: 50,
		conversations: 50,
	},
};

/**
 * Helper to evict stale cache entries
 */
export function evictStaleCache(cache: ApolloCache<unknown>, fieldName: string, maxAge: number): void {
	const now = Date.now();

	try {
		cache.modify<ConnectionEdges>({
			fields: {
				[fieldName](existing: ConnectionEdges | undefined, { readField }: { readField: ReadFieldFn }) {
					if (!existing?.edges) {
						return existing;
					}

					const filtered = existing.edges.filter((edge) => {
						const createdAt = readField<string>('createdAt', edge.node);
						if (!createdAt) {
							return true;
						}

						const age = now - new Date(createdAt).getTime();
						return age < maxAge;
					});

					return {
						...existing,
						edges: filtered,
					};
				},
			},
		});
	} catch (error) {
		console.error(`Error evicting stale cache for ${fieldName}:`, error);
	}
}

/**
 * Helper to limit cache size
 */
export function limitCacheSize(cache: ApolloCache<unknown>, fieldName: string, maxItems: number): void {
	try {
		cache.modify<ConnectionEdges>({
			fields: {
				[fieldName](existing: ConnectionEdges | undefined) {
					if (!existing?.edges) {
						return existing;
					}

					if (existing.edges.length <= maxItems) {
						return existing;
					}

					return {
						...existing,
						edges: existing.edges.slice(0, maxItems),
					};
				},
			},
		});
	} catch (error) {
		console.error(`Error limiting cache size for ${fieldName}:`, error);
	}
}
