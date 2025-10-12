/**
 * GraphQL Adapter Exports
 * 
 * Exports all GraphQL-related functionality for Lesser integration
 */

export { createGraphQLClient, getGraphQLClient, closeGraphQLClient } from './client.js';
export type { GraphQLClientConfig, GraphQLClientInstance } from './client.js';

export { LesserGraphQLAdapter, createLesserGraphQLAdapter } from './LesserGraphQLAdapter.js';
export type {
	LesserGraphQLAdapterConfig,
	TimelineVariables,
	CreateStatusVariables,
	PollInput,
	SearchVariables,
	SubscriptionEvent,
} from './LesserGraphQLAdapter.js';

export { typePolicies, cacheConfig, evictStaleCache, limitCacheSize } from './cache.js';

export * as optimistic from './optimistic.js';

// Re-export all GraphQL operations (when using codegen, these would be generated)
// For now, they're defined inline in the adapter class

