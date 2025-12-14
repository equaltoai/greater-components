/**
 * Artist Face Store Types
 *
 * Type definitions for state management stores.
 * Follows patterns from @equaltoai/greater-components-adapters/stores/types
 *
 * @module @equaltoai/greater-components-artist/stores/types
 */

import type { TransportManager } from '@equaltoai/greater-components-adapters';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
import type { ArtworkData } from '../types/artwork.js';
import type { ArtistData } from '../types/artist.js';
import type { DiscoveryFilters } from '../types/discovery.js';
import type { CommissionData, CommissionStatus } from '../types/creative-tools.js';

// ============================================================================
// Base Store Types
// ============================================================================

/**
 * Base store interface following adapter patterns
 */
export interface BaseStore<T = unknown> {
	/** Subscribe to store updates */
	subscribe(callback: (value: T) => void): () => void;
	/** Cleanup store resources */
	destroy(): void;
	/** Get current store value */
	get(): T;
}

// ============================================================================
// Gallery Store Types
// ============================================================================

/**
 * Gallery filter options
 */
export interface GalleryFilters {
	/** Filter by artist ID */
	artist?: string;
	/** Filter by art styles */
	style?: string[];
	/** Filter by medium */
	medium?: string[];
	/** Filter by date range */
	dateRange?: { start: Date; end: Date };
	/** Filter by AI usage */
	hasAI?: boolean;
}

/**
 * Gallery store state
 */
export interface GalleryStoreState {
	/** Gallery items */
	items: ArtworkData[];
	/** Loading state */
	loading: boolean;
	/** Error state */
	error: Error | null;
	/** Whether more items are available */
	hasMore: boolean;
	/** Pagination cursor */
	cursor: string | null;
	/** Current view mode */
	viewMode: 'grid' | 'masonry' | 'row';
	/** Current sort option */
	sortBy: 'recent' | 'popular' | 'trending';
	/** Active filters */
	filters: GalleryFilters;
}

/**
 * Gallery store configuration
 */
export interface GalleryStoreConfig {
	/** Transport manager for streaming updates */
	transportManager?: TransportManager;
	/** GraphQL adapter for API calls */
	adapter?: LesserGraphQLAdapter;
	/** Page size for pagination */
	pageSize?: number;
	/** Initial items */
	initialItems?: ArtworkData[];
	/** Initial view mode */
	initialViewMode?: 'grid' | 'masonry' | 'row';
	/** Initial sort option */
	initialSortBy?: 'recent' | 'popular' | 'trending';
	/** Artist ID for artist-specific galleries */
	artistId?: string;
}

/**
 * Gallery store interface
 */
export interface GalleryStore extends BaseStore<GalleryStoreState> {
	/** Load more items */
	loadMore(): Promise<void>;
	/** Refresh gallery */
	refresh(): Promise<void>;
	/** Set view mode */
	setViewMode(mode: 'grid' | 'masonry' | 'row'): void;
	/** Set sort option */
	setSortBy(sortBy: 'recent' | 'popular' | 'trending'): void;
	/** Update filters */
	updateFilters(filters: Partial<GalleryFilters>): void;
	/** Clear filters */
	clearFilters(): void;
	/** Add item (optimistic) */
	addItem(item: ArtworkData): void;
	/** Remove item (optimistic) */
	removeItem(id: string): void;
	/** Update item (optimistic) */
	updateItem(id: string, updates: Partial<ArtworkData>): void;
}

// ============================================================================
// Discovery Store Types
// ============================================================================

/**
 * Saved search configuration
 */
export interface SavedSearch {
	/** Search ID */
	id: string;
	/** Search name */
	name: string;
	/** Search query */
	query: string;
	/** Search filters */
	filters: DiscoveryFilters;
	/** Creation timestamp */
	createdAt: Date | string;
}

/**
 * Discovery store state
 */
export interface DiscoveryStoreState {
	/** Current search query */
	query: string;
	/** Search results */
	results: ArtworkData[];
	/** Active filters */
	filters: DiscoveryFilters;
	/** AI-powered suggestions */
	suggestions: ArtworkData[];
	/** Recent search queries */
	recentSearches: string[];
	/** Saved searches */
	savedSearches: SavedSearch[];
	/** Loading state */
	loading: boolean;
	/** Error state */
	error: Error | null;
}

/**
 * Discovery store configuration
 */
export interface DiscoveryStoreConfig {
	/** GraphQL adapter for API calls */
	adapter?: LesserGraphQLAdapter;
	/** Debounce time for search (ms) */
	debounceMs?: number;
	/** Maximum recent searches to store */
	maxRecentSearches?: number;
	/** Enable AI suggestions */
	enableSuggestions?: boolean;
}

/**
 * Discovery store interface
 */
export interface DiscoveryStore extends BaseStore<DiscoveryStoreState> {
	/** Execute search */
	search(query: string): Promise<void>;
	/** Update filters */
	updateFilters(filters: Partial<DiscoveryFilters>): void;
	/** Clear filters */
	clearFilters(): void;
	/** Save current search */
	saveSearch(name: string): void;
	/** Delete saved search */
	deleteSavedSearch(id: string): void;
	/** Clear recent searches */
	clearRecentSearches(): void;
	/** Load suggestions */
	loadSuggestions(): Promise<void>;
}

// ============================================================================
// Commission Store Types
// ============================================================================

/**
 * Commission store state
 */
export interface CommissionStoreState {
	/** All commissions */
	commissions: CommissionData[];
	/** Currently active commission */
	activeCommission: CommissionData | null;
	/** User role in commissions */
	role: 'artist' | 'client';
	/** Loading state */
	loading: boolean;
	/** Error state */
	error: Error | null;
}

/**
 * Commission store configuration
 */
export interface CommissionStoreConfig {
	/** Transport manager for real-time updates */
	transportManager?: TransportManager;
	/** GraphQL adapter for API calls */
	adapter?: LesserGraphQLAdapter;
	/** User role */
	role: 'artist' | 'client';
	/** User ID */
	userId: string;
}

/**
 * Commission store interface
 */
export interface CommissionStore extends BaseStore<CommissionStoreState> {
	/** Load commissions */
	loadCommissions(): Promise<void>;
	/** Set active commission */
	setActiveCommission(id: string | null): void;
	/** Update commission status */
	updateStatus(id: string, status: CommissionStatus): Promise<void>;
	/** Add message to commission */
	addMessage(id: string, message: string): Promise<void>;
	/** Start streaming updates */
	startStreaming(): void;
	/** Stop streaming updates */
	stopStreaming(): void;
}

// ============================================================================
// Artist Profile Store Types
// ============================================================================

/**
 * Portfolio section data
 */
export interface PortfolioSection {
	/** Section ID */
	id: string;
	/** Section title */
	title: string;
	/** Section description */
	description?: string;
	/** Section layout */
	layout: 'grid' | 'row' | 'featured';
	/** Artworks in section */
	items: ArtworkData[];
	/** Section order */
	order: number;
}

/**
 * Artist profile store state
 */
export interface ArtistProfileStoreState {
	/** Artist data */
	artist: ArtistData | null;
	/** Artist artworks */
	artworks: ArtworkData[];
	/** Portfolio sections */
	sections: PortfolioSection[];
	/** Edit mode state */
	isEditing: boolean;
	/** Pending changes */
	pendingChanges: Partial<ArtistData>;
	/** Loading state */
	loading: boolean;
	/** Error state */
	error: Error | null;
}

/**
 * Artist profile store configuration
 */
export interface ArtistProfileStoreConfig {
	/** GraphQL adapter for API calls */
	adapter?: LesserGraphQLAdapter;
	/** Artist ID to load */
	artistId?: string;
	/** Whether this is the current user's profile */
	isOwnProfile?: boolean;
}

/**
 * Artist profile store interface
 */
export interface ArtistProfileStore extends BaseStore<ArtistProfileStoreState> {
	/** Load artist profile */
	loadProfile(artistId: string): Promise<void>;
	/** Enter edit mode */
	startEditing(): void;
	/** Exit edit mode */
	cancelEditing(): void;
	/** Save pending changes */
	saveChanges(): Promise<void>;
	/** Update pending changes */
	updatePendingChanges(changes: Partial<ArtistData>): void;
	/** Reorder sections */
	reorderSections(sectionIds: string[]): void;
	/** Add section */
	addSection(section: Omit<PortfolioSection, 'id' | 'order'>): void;
	/** Remove section */
	removeSection(id: string): void;
}

// ============================================================================
// Realtime Store Types
// ============================================================================

/**
 * Realtime connection state
 */
export type RealtimeConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

/**
 * Realtime store state
 */
export interface RealtimeStoreState {
	/** Connection state */
	connectionState: RealtimeConnectionState;
	/** Last heartbeat timestamp */
	lastHeartbeat: number | null;
	/** Reconnection attempts */
	reconnectAttempts: number;
	/** Active subscriptions */
	subscriptions: string[];
	/** Error state */
	error: Error | null;
}

/**
 * Realtime store configuration
 */
export interface RealtimeStoreConfig {
	/** Transport manager */
	transportManager: TransportManager;
	/** Heartbeat interval (ms) */
	heartbeatInterval?: number;
	/** Max reconnection attempts */
	maxReconnectAttempts?: number;
	/** Reconnection delay (ms) */
	reconnectDelay?: number;
}

/**
 * Realtime event handler
 */
export type RealtimeEventHandler<T = unknown> = (data: T) => void;

/**
 * Realtime store interface
 */
export interface RealtimeStore extends BaseStore<RealtimeStoreState> {
	/** Connect to realtime service */
	connect(): Promise<void>;
	/** Disconnect from realtime service */
	disconnect(): void;
	/** Subscribe to gallery updates */
	subscribeToGallery(artistId: string, handler: RealtimeEventHandler): () => void;
	/** Subscribe to commission updates */
	subscribeToCommission(commissionId: string, handler: RealtimeEventHandler): () => void;
	/** Subscribe to notifications */
	subscribeToNotifications(handler: RealtimeEventHandler): () => void;
}

// ============================================================================
// Offline Store Types
// ============================================================================

/**
 * Sync queue item
 */
export interface SyncQueueItem {
	/** Queue item ID */
	id: string;
	/** Action type */
	action: 'create' | 'update' | 'delete';
	/** Entity type */
	entityType: 'artwork' | 'profile' | 'commission';
	/** Entity ID */
	entityId: string;
	/** Action payload */
	payload: unknown;
	/** Creation timestamp */
	createdAt: number;
	/** Retry count */
	retryCount: number;
}

/**
 * Offline store state
 */
export interface OfflineStoreState {
	/** Network online status */
	isOnline: boolean;
	/** Saved artworks for offline viewing */
	savedArtworks: ArtworkData[];
	/** Pending sync queue */
	syncQueue: SyncQueueItem[];
	/** Last sync timestamp */
	lastSync: number | null;
	/** Sync in progress */
	isSyncing: boolean;
	/** Error state */
	error: Error | null;
}

/**
 * Offline store configuration
 */
export interface OfflineStoreConfig {
	/** IndexedDB database name */
	dbName?: string;
	/** Maximum saved artworks */
	maxSavedArtworks?: number;
	/** Auto-sync when online */
	autoSync?: boolean;
}

/**
 * Offline store interface
 */
export interface OfflineStore extends BaseStore<OfflineStoreState> {
	/** Save artwork for offline viewing */
	saveArtwork(artwork: ArtworkData): Promise<void>;
	/** Remove saved artwork */
	removeSavedArtwork(id: string): Promise<void>;
	/** Check if artwork is saved */
	isArtworkSaved(id: string): boolean;
	/** Queue action for sync */
	queueAction(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount'>): void;
	/** Process sync queue */
	processQueue(): Promise<void>;
	/** Clear sync queue */
	clearQueue(): void;
}

// ============================================================================
// Store Factory Types
// ============================================================================

/**
 * Store factory interface
 */
export interface ArtistStoreFactory {
	/** Create gallery store */
	createGalleryStore(config?: GalleryStoreConfig): GalleryStore;
	/** Create discovery store */
	createDiscoveryStore(config?: DiscoveryStoreConfig): DiscoveryStore;
	/** Create commission store */
	createCommissionStore(config: CommissionStoreConfig): CommissionStore;
	/** Create artist profile store */
	createArtistProfileStore(config?: ArtistProfileStoreConfig): ArtistProfileStore;
	/** Create realtime store */
	createRealtimeStore(config: RealtimeStoreConfig): RealtimeStore;
	/** Create offline store */
	createOfflineStore(config?: OfflineStoreConfig): OfflineStore;
}
