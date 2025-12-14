/**
 * Artist Face - Federation and API Integration
 *
 * Exports for ActivityPub federation support and Lesser GraphQL API integration.
 *
 * @module @equaltoai/greater-components-artist
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
// Types
// ============================================================================

export type {
	// Core types
	Account,
	MediaAttachment,
	MediaMeta,
	// Artwork types
	Artwork,
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
	// Artist profile types
	ArtistProfile,
	ArtistBadge,
	BadgeType,
	PortfolioSection,
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
} from './types';
