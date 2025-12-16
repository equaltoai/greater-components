/**
 * Artist Face - Portfolio and federation tooling
 *
 * Exports UI components for artist portfolio experiences plus ActivityPub federation utilities.
 *
 * @module @equaltoai/greater-components/faces/artist
 */

// ============================================================================
// Adapters
// ============================================================================

export {
	createArtistAdapter,
	type ArtistAdapter,
	type ColorSearchOptions,
	type ArtistProfileInput,
} from './adapters/artistAdapter';

// ============================================================================
// Federation Utilities
// ============================================================================

export {
	// ActivityPub conversion
	toActivityPubNote,
	fromActivityPubNote,
	toActivityPubCollection,
	// URI utilities
	generateArtworkUri,
	parseArtworkUri,
	// Metadata serialization
	serializeMetadata,
	parseMetadata,
	handleMissingMetadata,
	// Rights federation
	serializeLicense,
	serializeNoAI,
	parseRights,
	// Types
	type ActivityPubNote,
	type ActivityPubAttachment,
	type ActivityPubTag,
	type ActivityPubCollection,
	type ArtworkMetadataExtension,
} from './utils/federation';

// ============================================================================
// Subscriptions
// ============================================================================

export {
	// Subscription functions
	subscribeToGallery,
	subscribeToCommission,
	subscribeToFederation,
	subscribeToArtworkInteractions,
	subscribeToMyCommissions,
	// Subscription stores
	createGalleryStore,
	createCommissionStore,
	// Types
	type GalleryEvent,
	type GalleryEventType,
	type CommissionEvent,
	type CommissionEventType,
	type FederationEvent,
	type FederationEventType,
} from './subscriptions';

// ============================================================================
// UI Components
// ============================================================================

export { Artwork } from './components/Artwork/index.js';
export { ArtistProfile } from './components/ArtistProfile/index.js';

export { Gallery, GalleryGrid, GalleryRow, GalleryMasonry } from './components/Gallery/index.js';

export {
	DiscoveryEngine,
	ColorPaletteSearch,
	StyleFilter,
	MoodMap,
} from './components/Discovery/index.js';

export { MediaViewer } from './components/MediaViewer/index.js';
export { Exhibition } from './components/Exhibition/index.js';

export {
	WorkInProgress,
	CritiqueMode,
	ReferenceBoard,
	CommissionWorkflow,
} from './components/CreativeTools/index.js';

export { CritiqueCircle, Collaboration, MentorMatch } from './components/Community/index.js';

export { Transparency, ProcessDocumentation, AIOptOutControls, EthicalSourcingBadge } from './components/Transparency/index.js';

export {
	Monetization,
	TipJar,
	DirectPurchase,
	PremiumBadge,
	ProtectionTools,
	InstitutionalTools,
} from './components/Monetization/index.js';

export { CuratorSpotlight, CollectionCard } from './components/Curation/index.js';

export { default as ArtworkCard } from './components/ArtworkCard.svelte';
export { default as ArtistTimeline } from './components/ArtistTimeline.svelte';
export { default as PortfolioSection } from './components/PortfolioSection.svelte';
export { default as ArtistBadge } from './components/ArtistBadge.svelte';

// ============================================================================
// Stores (namespaced to avoid export collisions)
// ============================================================================

export * as Stores from './stores/index.js';

export {
	createDiscoveryStore,
	createArtistProfileStore,
	createRealtimeStore,
	createOfflineStore,
} from './stores/index.js';

export {
	createGalleryStore as createGalleryStateStore,
	createCommissionStore as createCommissionStateStore,
} from './stores/index.js';

// ============================================================================
// Patterns (namespaced to avoid export collisions)
// ============================================================================

export * as Patterns from './patterns/index.js';

// ============================================================================
// API Entity Types
// ============================================================================

export type {
	// Core types
	Account,
	MediaAttachment,
	MediaMeta,
	// Artwork types (aliased to avoid collision with Artwork component namespace)
	Artwork as ArtworkEntity,
	ArtworkMetadata,
	MoodData,
	AIUsageData,
	AIUsageType,
	ArtworkStats,
	// Input types
	CreateArtworkInput,
	UpdateArtworkInput,
	ArtworkMetadataInput,
	MoodInput,
	AIUsageInput,
	Visibility,
	// Discovery types
	DiscoveryFilter,
	DateRangeInput,
	ColorSearchMode,
	// Artist profile types (aliased to avoid collision with component exports)
	ArtistProfile as ArtistProfileEntity,
	ArtistBadge as ArtistBadgeEntity,
	BadgeType,
	PortfolioSection as PortfolioSectionEntity,
	SectionLayout,
	ArtistStats,
	CommissionInfo,
	// Commission types
	Commission,
	CommissionStatus,
	CommissionRequest,
	CommissionQuote,
	CommissionContract,
	CommissionUpdate,
	CommissionDelivery,
	Money,
	UpdateType,
	// Commission input types
	CommissionRequestInput,
	QuoteInput,
	MoneyInput,
	ProgressInput,
	DeliveryInput,
	// Connection types
	ArtworkConnection,
	ArtworkEdge,
	PageInfo,
	Collection,
} from './types/index.js';
