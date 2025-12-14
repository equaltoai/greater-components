/**
 * Artist Face Type Definitions
 *
 * TypeScript types for artwork, commission, federation, and related entities.
 *
 * @module @equaltoai/greater-components-artist/types
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Account {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
	uri?: string;
}

export interface MediaAttachment {
	id: string;
	type: 'image' | 'video' | 'audio' | 'gifv';
	url: string;
	previewUrl: string;
	description: string | null;
	blurhash: string | null;
	meta: MediaMeta | null;
}

export interface MediaMeta {
	original?: {
		width: number;
		height: number;
		aspect?: number;
	};
	small?: {
		width: number;
		height: number;
		aspect?: number;
	};
}

// ============================================================================
// Artwork Types
// ============================================================================

export interface Artwork {
	id: string;
	uri: string;
	url: string;
	title: string;
	description: string | null;
	content: string;
	account: Account;
	mediaAttachments: MediaAttachment[];
	metadata: ArtworkMetadata;
	aiUsage: AIUsageData | null;
	stats: ArtworkStats;
	createdAt: string;
	updatedAt: string | null;
}

export interface ArtworkMetadata {
	medium: string | null;
	dimensions: string | null;
	year: number | null;
	materials: string[];
	style: string[];
	colors: string[];
	mood: MoodData | null;
	license: string | null;
	noAI: boolean;
}

export interface MoodData {
	energy: number | null;
	valence: number | null;
	tags: string[];
}

export interface AIUsageData {
	used: boolean;
	type: AIUsageType | null;
	description: string | null;
	tools: string[];
}

export type AIUsageType =
	| 'NONE'
	| 'REFERENCE'
	| 'ASSISTANCE'
	| 'ENHANCEMENT'
	| 'GENERATION'
	| 'FULL_GENERATION';

export interface ArtworkStats {
	viewCount: number;
	likeCount: number;
	collectCount: number;
	commentCount: number;
	shareCount: number;
}

// ============================================================================
// Input Types
// ============================================================================

export interface CreateArtworkInput {
	title: string;
	description?: string;
	content?: string;
	mediaIds: string[];
	metadata: ArtworkMetadataInput;
	aiUsage?: AIUsageInput;
	visibility: Visibility;
}

export interface UpdateArtworkInput {
	title?: string;
	description?: string;
	content?: string;
	metadata?: ArtworkMetadataInput;
	aiUsage?: AIUsageInput;
	visibility?: Visibility;
}

export interface ArtworkMetadataInput {
	medium?: string;
	dimensions?: string;
	year?: number;
	materials?: string[];
	style?: string[];
	colors?: string[];
	mood?: MoodInput;
	license?: string;
	noAI?: boolean;
}

export interface MoodInput {
	energy?: number;
	valence?: number;
	tags?: string[];
}

export interface AIUsageInput {
	used: boolean;
	type?: AIUsageType;
	description?: string;
	tools?: string[];
}

export type Visibility = 'PUBLIC' | 'UNLISTED' | 'FOLLOWERS_ONLY' | 'DIRECT';

// ============================================================================
// Discovery Types
// ============================================================================

export interface DiscoveryFilter {
	styles?: string[];
	mood?: MoodInput;
	medium?: string[];
	artist?: string;
	dateRange?: DateRangeInput;
	includeFederated?: boolean;
}

export interface DateRangeInput {
	from?: string;
	to?: string;
}

export type ColorSearchMode = 'ANY' | 'ALL' | 'DOMINANT' | 'HARMONY';

// ============================================================================
// Artist Profile Types
// ============================================================================

export interface ArtistProfile {
	id: string;
	uri: string;
	account: Account;
	statement: string | null;
	badges: ArtistBadge[];
	sections: PortfolioSection[];
	featuredArtwork: Artwork | null;
	stats: ArtistStats;
	acceptingCommissions: boolean;
	commissionInfo: CommissionInfo | null;
}

export interface ArtistBadge {
	type: BadgeType;
	label: string;
	verifiedAt: string | null;
}

export type BadgeType = 'VERIFIED' | 'EDUCATOR' | 'INSTITUTION' | 'MENTOR' | 'CURATOR' | 'PRO';

export interface PortfolioSection {
	id: string;
	title: string;
	description: string | null;
	artworks: Artwork[];
	layout: SectionLayout;
	order: number;
}

export type SectionLayout = 'GRID' | 'ROW' | 'FEATURED' | 'MASONRY';

export interface ArtistStats {
	artworkCount: number;
	followerCount: number;
	followingCount: number;
	totalViews: number;
	totalLikes: number;
	exhibitionCount: number;
}

export interface CommissionInfo {
	status: CommissionStatus;
	priceRange: string | null;
	turnaround: string | null;
	description: string | null;
}

// ============================================================================
// Commission Types
// ============================================================================

export type CommissionStatus =
	| 'REQUESTED'
	| 'REVIEWING'
	| 'QUOTED'
	| 'ACCEPTED'
	| 'IN_PROGRESS'
	| 'COMPLETED'
	| 'DELIVERED'
	| 'CANCELLED'
	| 'DISPUTED';

export interface Commission {
	id: string;
	client: Account;
	artist: Account;
	status: CommissionStatus;
	request: CommissionRequest;
	quote: CommissionQuote | null;
	contract: CommissionContract | null;
	progress: CommissionUpdate[];
	delivery: CommissionDelivery | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface CommissionRequest {
	id: string;
	description: string;
	references: MediaAttachment[];
	style: string | null;
	medium: string | null;
	dimensions: string | null;
	budget: string | null;
	deadline: string | null;
	notes: string | null;
	createdAt: string;
}

export interface CommissionQuote {
	id: string;
	price: Money;
	estimatedDays: number;
	includes: string[];
	revisions: number;
	expiresAt: string | null;
	notes: string | null;
	createdAt: string;
}

export interface Money {
	amount: number;
	currency: string;
}

export interface CommissionContract {
	id: string;
	price: Money;
	paymentTerms: string;
	deadline: string;
	usageRights: string;
	revisionTerms: string;
	cancellationPolicy: string;
	clientSignedAt: string | null;
	artistSignedAt: string | null;
}

export interface CommissionUpdate {
	id: string;
	type: UpdateType;
	message: string;
	media: MediaAttachment[];
	revisionNumber: number | null;
	createdAt: string;
}

export type UpdateType =
	| 'SKETCH'
	| 'WORK_IN_PROGRESS'
	| 'REVISION'
	| 'MILESTONE'
	| 'MESSAGE'
	| 'REVISION_REQUEST';

export interface CommissionDelivery {
	id: string;
	files: MediaAttachment[];
	message: string | null;
	accepted: boolean;
	acceptedAt: string | null;
	createdAt: string;
}

// ============================================================================
// Commission Input Types
// ============================================================================

export interface CommissionRequestInput {
	artistId: string;
	description: string;
	referenceIds?: string[];
	style?: string;
	medium?: string;
	dimensions?: string;
	budget?: string;
	deadline?: string;
	notes?: string;
}

export interface QuoteInput {
	price: MoneyInput;
	estimatedDays: number;
	includes: string[];
	revisions: number;
	expiresAt?: string;
	notes?: string;
}

export interface MoneyInput {
	amount: number;
	currency: string;
}

export interface ProgressInput {
	type: UpdateType;
	message: string;
	mediaIds?: string[];
	revisionNumber?: number;
}

export interface DeliveryInput {
	fileIds: string[];
	message?: string;
}

// ============================================================================
// Connection Types
// ============================================================================

export interface ArtworkConnection {
	edges: ArtworkEdge[];
	pageInfo: PageInfo;
	totalCount: number;
}

export interface ArtworkEdge {
	cursor: string;
	node: Artwork;
}

export interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
	endCursor: string | null;
}

export interface Collection {
	id: string;
	name: string;
	description: string | null;
	artworks: Artwork[];
	owner: Account;
	isPublic: boolean;
	createdAt: string;
}

// ============================================================================
// Exported Types from Sub-modules
// ============================================================================

export type { ArtworkData } from './artwork.js';
export type { ArtistData } from './artist.js';
export type { DiscoveryFilters } from './discovery.js';
export type { ExhibitionData } from './curation.js';
export type { CommissionData } from './creative-tools.js';
export type { CritiqueAnnotation } from './creative-tools.js';
export type {
	PremiumTier,
	PremiumFeature,
	TipPreset,
	TipJarConfig,
	TipJarHandlers,
} from './monetization.js';
