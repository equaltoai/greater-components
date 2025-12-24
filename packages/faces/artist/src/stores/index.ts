/**
 * Artist Face Stores
 *
 * State management stores for artist portfolio functionality.
 * Built for Svelte 5 runes compatibility with fallback support.
 *
 * @module @equaltoai/greater-components-artist/stores
 */

// ============================================================================
// Store Factory Functions
// ============================================================================

export { createGalleryStore } from './galleryStore.js';
export { createDiscoveryStore } from './discoveryStore.js';
export { createCommissionStore } from './commissionStore.js';
export { createArtistProfileStore } from './artistProfileStore.js';
export { createRealtimeStore } from './realtimeStore.js';
export { createOfflineStore } from './offlineStore.js';

// ============================================================================
// Store Types
// ============================================================================

export type {
	// Base types
	BaseStore,

	// Gallery store types
	GalleryFilters,
	GalleryStoreState,
	GalleryStoreConfig,
	GalleryStore,

	// Discovery store types
	SavedSearch,
	DiscoveryStoreState,
	DiscoveryStoreConfig,
	DiscoveryStore,

	// Commission store types
	CommissionStoreState,
	CommissionStoreConfig,
	CommissionStore,

	// Artist profile store types
	PortfolioSection,
	ArtistProfileStoreState,
	ArtistProfileStoreConfig,
	ArtistProfileStore,

	// Realtime store types
	RealtimeConnectionState,
	RealtimeStoreState,
	RealtimeStoreConfig,
	RealtimeEventHandler,
	RealtimeStore,

	// Offline store types
	SyncQueueItem,
	OfflineStoreState,
	OfflineStoreConfig,
	OfflineStore,

	// Factory types
	ArtistStoreFactory,
} from './types.js';

// ============================================================================
// Store Utilities
// ============================================================================

export {
	// Reactive state
	ReactiveState,

	// Pagination utilities
	createPaginatedState,
	mergePaginatedItems,
	type PaginatedState,
	type PageInfo,

	// Filter utilities
	createFilterPredicate,
	applyFilters,
	type FilteredState,

	// Optimistic update utilities
	createOptimisticState,
	optimisticAdd,
	optimisticUpdate,
	optimisticDelete,
	confirmOptimistic,
	rollbackOptimistic,
	type OptimisticItem,
	type OptimisticState,

	// Persistence utilities
	persistToLocalStorage,
	loadFromLocalStorage,
	persistToIndexedDB,
	loadFromIndexedDB,

	// Other utilities
	debounce,
	createNetworkObserver,
	isOnline,
} from './utils.js';
