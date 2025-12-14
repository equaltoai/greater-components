/**
 * WebSocket Subscriptions
 *
 * Real-time subscription utilities for gallery, commission, and federation events.
 * Uses LesserGraphQLAdapter subscription capabilities.
 *
 * @module @equaltoai/greater-components-artist/subscriptions
 */

import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import type { Artwork, Commission } from '../types';

interface SubscriptionObserver {
	unsubscribe(): void;
}
interface Observable<T> {
	subscribe(observer: {
		next: (result: T) => void;
		error?: (error: unknown) => void;
	}): SubscriptionObserver;
}
interface GraphQLSubscriber {
	subscribe<T = unknown>(options: {
		query: string;
		variables?: Record<string, unknown>;
	}): Observable<{ data: T }>;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * Gallery event types
 */
export type GalleryEventType =
	| 'artwork_added'
	| 'artwork_updated'
	| 'artwork_removed'
	| 'artwork_liked'
	| 'artwork_collected'
	| 'artwork_commented';

/**
 * Gallery event payload
 */
export interface GalleryEvent {
	type: GalleryEventType;
	galleryId: string;
	artwork?: Artwork;
	artworkId?: string;
	userId?: string;
	timestamp: string;
}

/**
 * Commission event types
 */
export type CommissionEventType =
	| 'status_changed'
	| 'quote_submitted'
	| 'quote_accepted'
	| 'progress_updated'
	| 'message_received'
	| 'delivery_submitted'
	| 'delivery_accepted';

/**
 * Commission event payload
 */
export interface CommissionEvent {
	type: CommissionEventType;
	commissionId: string;
	commission?: Commission;
	previousStatus?: string;
	newStatus?: string;
	message?: string;
	timestamp: string;
}

/**
 * Federation event types
 */
export type FederationEventType =
	| 'remote_artwork_received'
	| 'remote_artist_followed'
	| 'remote_interaction'
	| 'federation_error';

/**
 * Federation event payload
 */
export interface FederationEvent {
	type: FederationEventType;
	remoteInstance?: string;
	artworkUri?: string;
	artistUri?: string;
	interactionType?: string;
	error?: string;
	timestamp: string;
}

// ============================================================================
// Subscription Functions
// ============================================================================

/**
 * Subscribe to gallery updates
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToGallery(adapter, 'gallery-123', (event) => {
 *   if (event.type === 'artwork_added') {
 *     // Add new artwork to display
 *   }
 * });
 *
 * // Later: cleanup
 * unsubscribe();
 * ```
 */
export function subscribeToGallery(
	adapter: LesserGraphQLAdapter,
	galleryId: string,
	callback: (event: GalleryEvent) => void
): () => void {
	const subscriber = adapter as unknown as GraphQLSubscriber;
	const subscription = subscriber.subscribe<{ galleryUpdated: GalleryEvent }>({
		query: GALLERY_SUBSCRIPTION,
		variables: { galleryId },
	});

	const unsubscribe = subscription.subscribe({
		next: (result) => {
			if (result.data?.galleryUpdated) {
				callback(result.data.galleryUpdated);
			}
		},
		error: (error: unknown) => {
			console.error('Gallery subscription error:', error);
		},
	});

	return () => {
		unsubscribe.unsubscribe();
	};
}

/**
 * Subscribe to commission updates
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToCommission(adapter, 'commission-456', (event) => {
 *   if (event.type === 'progress_updated') {
 *     // Show new progress update
 *   }
 * });
 * ```
 */
export function subscribeToCommission(
	adapter: LesserGraphQLAdapter,
	commissionId: string,
	callback: (event: CommissionEvent) => void
): () => void {
	const subscriber = adapter as unknown as GraphQLSubscriber;
	const subscription = subscriber.subscribe<{ commissionUpdated: CommissionEvent }>({
		query: COMMISSION_SUBSCRIPTION,
		variables: { commissionId },
	});

	const unsubscribe = subscription.subscribe({
		next: (result) => {
			if (result.data?.commissionUpdated) {
				callback(result.data.commissionUpdated);
			}
		},
		error: (error: unknown) => {
			console.error('Commission subscription error:', error);
		},
	});

	return () => {
		unsubscribe.unsubscribe();
	};
}

/**
 * Subscribe to federation events
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeToFederation(adapter, (event) => {
 *   if (event.type === 'remote_artwork_received') {
 *     // Process incoming federated artwork
 *   }
 * });
 * ```
 */
export function subscribeToFederation(
	adapter: LesserGraphQLAdapter,
	callback: (event: FederationEvent) => void
): () => void {
	const subscriber = adapter as unknown as GraphQLSubscriber;
	const subscription = subscriber.subscribe<{ federationEvent: FederationEvent }>({
		query: FEDERATION_SUBSCRIPTION,
	});

	const unsubscribe = subscription.subscribe({
		next: (result) => {
			if (result.data?.federationEvent) {
				callback(result.data.federationEvent);
			}
		},
		error: (error: unknown) => {
			console.error('Federation subscription error:', error);
		},
	});

	return () => {
		unsubscribe.unsubscribe();
	};
}

/**
 * Subscribe to user's artwork interactions (likes, collects, comments)
 */
export function subscribeToArtworkInteractions(
	adapter: LesserGraphQLAdapter,
	artworkId: string,
	callback: (event: GalleryEvent) => void
): () => void {
	const subscriber = adapter as unknown as GraphQLSubscriber;
	const subscription = subscriber.subscribe<{ artworkInteraction: GalleryEvent }>({
		query: ARTWORK_INTERACTIONS_SUBSCRIPTION,
		variables: { artworkId },
	});

	const unsubscribe = subscription.subscribe({
		next: (result) => {
			if (result.data?.artworkInteraction) {
				callback(result.data.artworkInteraction);
			}
		},
		error: (error: unknown) => {
			console.error('Artwork interaction subscription error:', error);
		},
	});

	return () => {
		unsubscribe.unsubscribe();
	};
}

/**
 * Subscribe to all commissions for current user (as artist or client)
 */
export function subscribeToMyCommissions(
	adapter: LesserGraphQLAdapter,
	callback: (event: CommissionEvent) => void
): () => void {
	const subscriber = adapter as unknown as GraphQLSubscriber;
	const subscription = subscriber.subscribe<{ myCommissionUpdated: CommissionEvent }>({
		query: MY_COMMISSIONS_SUBSCRIPTION,
	});

	const unsubscribe = subscription.subscribe({
		next: (result) => {
			if (result.data?.myCommissionUpdated) {
				callback(result.data.myCommissionUpdated);
			}
		},
		error: (error: unknown) => {
			console.error('My commissions subscription error:', error);
		},
	});

	return () => {
		unsubscribe.unsubscribe();
	};
}

// ============================================================================
// GraphQL Subscription Documents
// ============================================================================

const GALLERY_SUBSCRIPTION = /* GraphQL */ `
	subscription GalleryUpdated($galleryId: ID!) {
		galleryUpdated(galleryId: $galleryId) {
			type
			galleryId
			artwork {
				id
				uri
				url
				title
				mediaAttachments {
					id
					previewUrl
				}
			}
			artworkId
			userId
			timestamp
		}
	}
`;

const COMMISSION_SUBSCRIPTION = /* GraphQL */ `
	subscription CommissionUpdated($commissionId: ID!) {
		commissionUpdated(commissionId: $commissionId) {
			type
			commissionId
			commission {
				id
				status
				progress {
					id
					type
					message
					createdAt
				}
			}
			previousStatus
			newStatus
			message
			timestamp
		}
	}
`;

const FEDERATION_SUBSCRIPTION = /* GraphQL */ `
	subscription FederationEvent {
		federationEvent {
			type
			remoteInstance
			artworkUri
			artistUri
			interactionType
			error
			timestamp
		}
	}
`;

const ARTWORK_INTERACTIONS_SUBSCRIPTION = /* GraphQL */ `
	subscription ArtworkInteraction($artworkId: ID!) {
		artworkInteraction(artworkId: $artworkId) {
			type
			galleryId
			artworkId
			userId
			timestamp
		}
	}
`;

const MY_COMMISSIONS_SUBSCRIPTION = /* GraphQL */ `
	subscription MyCommissionUpdated {
		myCommissionUpdated {
			type
			commissionId
			commission {
				id
				status
				client {
					id
					username
				}
				artist {
					id
					username
				}
			}
			previousStatus
			newStatus
			timestamp
		}
	}
`;

// ============================================================================
// Subscription Store Factory
// ============================================================================

/**
 * Create a reactive subscription store for Svelte
 *
 * @example
 * ```svelte
 * <script>
 *   import { createGalleryStore } from '@equaltoai/greater-components-artist/subscriptions';
 *
 *   const gallery = createGalleryStore(adapter, 'gallery-123');
 * </script>
 *
 * {#each $gallery.events as event}
 *   <p>{event.type}: {event.artworkId}</p>
 * {/each}
 * ```
 */
export function createGalleryStore(adapter: LesserGraphQLAdapter, galleryId: string) {
	let events: GalleryEvent[] = $state([]);
	let connected = $state(false);
	const error = $state<string | null>(null);

	const unsubscribe = subscribeToGallery(adapter, galleryId, (event) => {
		events = [...events, event];
	});

	connected = true;

	return {
		get events() {
			return events;
		},
		get connected() {
			return connected;
		},
		get error() {
			return error;
		},
		clearEvents() {
			events = [];
		},
		destroy() {
			unsubscribe();
			connected = false;
		},
	};
}

/**
 * Create a reactive commission subscription store
 */
export function createCommissionStore(adapter: LesserGraphQLAdapter, commissionId: string) {
	let events: CommissionEvent[] = $state([]);
	let connected = $state(false);
	const error = $state<string | null>(null);

	const unsubscribe = subscribeToCommission(adapter, commissionId, (event) => {
		events = [...events, event];
	});

	connected = true;

	return {
		get events() {
			return events;
		},
		get connected() {
			return connected;
		},
		get error() {
			return error;
		},
		clearEvents() {
			events = [];
		},
		destroy() {
			unsubscribe();
			connected = false;
		},
	};
}
