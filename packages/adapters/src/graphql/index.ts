/**
 * GraphQL Adapter Exports
 *
 * Exports all GraphQL-related functionality for Lesser integration
 */

export { createGraphQLClient, getGraphQLClient, closeGraphQLClient } from './client.js';
export type { GraphQLClientConfig, GraphQLClientInstance } from './client.js';

export {
	LesserGraphQLAdapter,
	LesserGraphQLAdapterError,
	createLesserGraphQLAdapter,
	createSubmitDraftReviewHandler,
	isDraftReviewShareConflict,
} from './LesserGraphQLAdapter.js';
export type {
	LesserGraphQLAdapterConfig,
	DraftReviewSubmission,
	ShareDraftForReviewOutcome,
	SharedDraftReview,
	TimelineVariables,
	CreateNoteVariables,
	ConversationMessagesVariables,
	CreateConversationVariables,
	SearchVariables,
	SendMessageVariables,
	UpdateMediaVariables,
	ViewerQuery,
} from './LesserGraphQLAdapter.js';

export * from './generated/types.js';
export { typePolicies, cacheConfig, evictStaleCache, limitCacheSize } from './cache.js';

export * as optimistic from './optimistic.js';
