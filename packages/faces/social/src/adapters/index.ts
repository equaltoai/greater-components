/**
 * Adapter Enhancements
 *
 * Production-ready caching, batching, and optimistic updates for adapters.
 *
 * @module adapters
 * @example
 * ```typescript
 * import { AdapterCache, RequestBatcher, OptimisticManager } from '@equaltoai/greater-components/faces/social/adapters';
 *
 * // Create cache
 * const cache = new AdapterCache({ maxSize: 1000, defaultTTL: 300000 });
 *
 * // Create batcher
 * const batcher = new RequestBatcher(async (requests) => {
 *   return await fetchBatch(requests);
 * });
 *
 * // Use optimistic updates
 * const manager = new OptimisticManager();
 * await manager.add('like-123', applyLike, revertLike, () => api.like('123'));
 * ```
 */

// Cache
export {
	AdapterCache,
	createCacheKey,
	adapterCache,
	type CacheEntry,
	type CacheOptions,
} from './cache.js';

// Batching
export {
	RequestBatcher,
	RequestDeduplicator,
	type BatchRequest,
	type BatcherOptions,
} from './batcher.js';

// Optimistic Updates
export {
	OptimisticManager,
	OptimisticState,
	generateUpdateId,
	type OptimisticUpdate,
	type OptimisticUpdateId,
	type OptimisticManagerOptions,
} from './optimistic.js';

// GraphQL (with built-in caching and deduplication)
export {
	createLesserClient,
	createGraphQLClient,
	LesserClient,
	GraphQLClient,
} from './graphql/index.js';

export type {
	GraphQLConfig,
	Variables,
	GraphQLResponse,
	GraphQLError,
	LesserActor,
	LesserNote,
	LesserActivity,
	ActorListPage,
	TimelineResult,
	ActorResult,
	NoteResult,
	CreateNoteResult,
	LikeResult,
	AnnounceResult,
	FollowResult,
	SubscriptionEvent,
	TimelineUpdateEvent,
	NotificationEvent,
	SearchResult,
	FollowersResult,
	FollowingResult,
	NotificationsResult,
	ProfileFieldInput,
	UpdateProfileInput,
	Visibility,
	ExpandMediaPreference,
	TimelineOrder,
	StreamQuality,
	DigestFrequency,
	UserPreferences,
	PostingPreferences,
	ReadingPreferences,
	DiscoveryPreferences,
	StreamingPreferences,
	NotificationPreferences,
	PrivacyPreferences,
	ReblogFilter,
	UpdateUserPreferencesInput,
	StreamingPreferencesInput,
	ReblogFilterInput,
	UserPreferencesResult,
	UpdateUserPreferencesResult,
	UpdateStreamingPreferencesResult,
	PushSubscription,
	PushSubscriptionKeys,
	PushSubscriptionAlerts,
	PushSubscriptionResult,
	RegisterPushSubscriptionInput,
	RegisterPushSubscriptionResult,
	UpdatePushSubscriptionInput,
	UpdatePushSubscriptionResult,
	DeletePushSubscriptionResult,
	PushSubscriptionKeysInput,
	PushSubscriptionAlertsInput,
} from './graphql/index.js';
