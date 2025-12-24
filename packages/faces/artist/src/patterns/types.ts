/**
 * Pattern Type Definitions
 *
 * Types for reusable UI patterns that compose multiple components.
 *
 * @module @equaltoai/greater-components-artist/patterns/types
 */

import type {
	ExhibitionData,
	ArtistData,
	ArtworkData,
	CommissionData,
	DiscoveryFilters,
	CritiqueAnnotation,
} from '../types/index.js';

// ============================================================================
// Exhibition Pattern Types
// ============================================================================

/**
 * Exhibition layout options
 */
export type ExhibitionLayout = 'gallery' | 'narrative' | 'timeline';

/**
 * Exhibition pattern configuration
 */
export interface ExhibitionPatternConfig {
	/** Exhibition data */
	exhibition: ExhibitionData;
	/** Layout style */
	layout: ExhibitionLayout;
	/** Show curator information */
	showCurator: boolean;
	/** Show participating artists */
	showArtists: boolean;
	/** Enable navigation between artworks */
	enableNavigation: boolean;
	/** Enable share/embed functionality */
	enableShare?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Exhibition pattern handlers
 */
export interface ExhibitionPatternHandlers {
	/** Called when artwork is selected */
	onArtworkSelect?: (artwork: ArtworkData) => void;
	/** Called when navigation changes */
	onNavigate?: (index: number) => void;
	/** Called when exhibition is shared */
	onShare?: (platform?: string) => Promise<void> | void;
	/** Called when embed code is requested */
	onEmbed?: () => string;
}

// ============================================================================
// Commission Pattern Types
// ============================================================================

/**
 * Commission workflow role
 */
export type CommissionRole = 'artist' | 'client';

/**
 * Commission workflow step
 */
export type CommissionStep =
	| 'inquiry'
	| 'quote'
	| 'agreement'
	| 'payment'
	| 'progress'
	| 'review'
	| 'revision'
	| 'delivery'
	| 'complete';

/**
 * Commission pattern configuration
 */
export interface CommissionPatternConfig {
	/** User role in commission */
	role: CommissionRole;
	/** Existing commission data (optional for new commissions) */
	commission?: CommissionData;
	/** Called when a step is completed */
	onStepComplete: (step: CommissionStep, data?: unknown) => void;
	/** Called when commission is cancelled */
	onCancel: () => void;
	/** Enable email notifications */
	enableNotifications?: boolean;
	/** Enable progress persistence */
	enablePersistence?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Commission pattern handlers
 */
export interface CommissionPatternHandlers {
	/** Called when quote is submitted */
	onQuoteSubmit?: (amount: number, details: Record<string, unknown>) => Promise<void>;
	/** Called when agreement is accepted */
	onAgreementAccept?: () => Promise<void>;
	/** Called when payment is processed */
	onPaymentProcess?: (milestoneId?: string) => Promise<void>;
	/** Called when progress update is posted */
	onProgressUpdate?: (update: string, media?: File[]) => Promise<void>;
	/** Called when revision is requested */
	onRevisionRequest?: (feedback: string) => Promise<void>;
	/** Called when work is delivered */
	onDelivery?: (files: string[]) => Promise<void>;
}

// ============================================================================
// Critique Pattern Types
// ============================================================================

/**
 * Critique mode
 */
export type CritiqueMode = 'request' | 'provide' | 'view';

/**
 * Critique pattern configuration
 */
export interface CritiquePatternConfig {
	/** Artwork to critique */
	artwork: ArtworkData;
	/** Critique mode */
	mode: CritiqueMode;
	/** Guided questions for critique */
	questions?: string[];
	/** Allow anonymous critiques */
	anonymous?: boolean;
	/** Enable annotation tools */
	enableAnnotations?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Critique pattern handlers
 */
export interface CritiquePatternHandlers {
	/** Called when critique is submitted */
	onSubmit?: (annotations: CritiqueAnnotation[], summary: string) => Promise<void>;
	/** Called when annotation is added */
	onAnnotationAdd?: (annotation: Omit<CritiqueAnnotation, 'id' | 'createdAt'>) => void;
	/** Called when critique request is sent */
	onRequestSend?: (recipientIds: string[], message?: string) => Promise<void>;
}

// ============================================================================
// Portfolio Pattern Types
// ============================================================================

/**
 * Portfolio section definition
 */
export interface PortfolioSection {
	/** Section identifier */
	id: string;
	/** Section title */
	title: string;
	/** Section type */
	type: 'gallery' | 'featured' | 'series' | 'timeline' | 'about' | 'contact';
	/** Artworks in section */
	artworks?: ArtworkData[];
	/** Section description */
	description?: string;
	/** Display order */
	order: number;
	/** Whether section is visible */
	visible: boolean;
}

/**
 * Portfolio pattern configuration
 */
export interface PortfolioPatternConfig {
	/** Artist data */
	artist: ArtistData;
	/** Portfolio sections */
	sections: PortfolioSection[];
	/** Whether current user is the owner */
	isOwner: boolean;
	/** Enable professional mode (clean, minimal) */
	professionalMode?: boolean;
	/** Enable section management */
	enableSectionManagement?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Portfolio pattern handlers
 */
export interface PortfolioPatternHandlers {
	/** Called when section is added */
	onSectionAdd?: (section: Omit<PortfolioSection, 'id'>) => Promise<void>;
	/** Called when section is updated */
	onSectionUpdate?: (sectionId: string, updates: Partial<PortfolioSection>) => Promise<void>;
	/** Called when section is removed */
	onSectionRemove?: (sectionId: string) => Promise<void>;
	/** Called when sections are reordered */
	onSectionReorder?: (sectionIds: string[]) => Promise<void>;
	/** Called when portfolio is exported */
	onExport?: (format: 'pdf' | 'html' | 'json') => Promise<void>;
	/** Called when portfolio is shared */
	onShare?: (platform?: string) => Promise<void>;
}

// ============================================================================
// Discovery Pattern Types
// ============================================================================

/**
 * Discovery layout options
 */
export type DiscoveryLayout = 'full' | 'sidebar' | 'modal';

/**
 * Discovery pattern configuration
 */
export interface DiscoveryPatternConfig {
	/** Initial search query */
	initialQuery?: string;
	/** Initial filters */
	initialFilters?: DiscoveryFilters;
	/** Layout style */
	layout: DiscoveryLayout;
	/** Called when artwork is selected */
	onSelect: (artwork: ArtworkData) => void;
	/** Enable saved searches */
	enableSavedSearches?: boolean;
	/** Enable recent searches */
	enableRecentSearches?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Saved search definition
 */
export interface SavedSearch {
	/** Search identifier */
	id: string;
	/** Search name */
	name: string;
	/** Search filters */
	filters: DiscoveryFilters;
	/** Created date */
	createdAt: Date | string;
}

/**
 * Discovery pattern handlers
 */
export interface DiscoveryPatternHandlers {
	/** Called when search is performed */
	onSearch?: (filters: DiscoveryFilters) => Promise<ArtworkData[]>;
	/** Called when search is saved */
	onSaveSearch?: (name: string, filters: DiscoveryFilters) => Promise<void>;
	/** Called when saved search is loaded */
	onLoadSearch?: (searchId: string) => void;
	/** Called when filters are cleared */
	onClearFilters?: () => void;
	/** Called when filters change */
	onFilterChange?: (filters: DiscoveryFilters) => void;
}

// ============================================================================
// Gallery Pattern Types
// ============================================================================

/**
 * Gallery layout options
 */
export type GalleryLayout = 'grid' | 'masonry' | 'row';

/**
 * Gallery sort options
 */
export type GallerySortOption = 'newest' | 'oldest' | 'popular' | 'title' | 'artist';

/**
 * Gallery pattern configuration
 */
export interface GalleryPatternConfig {
	/** Artworks to display */
	items: ArtworkData[];
	/** Layout style */
	layout: GalleryLayout;
	/** Enable filter controls */
	enableFilters: boolean;
	/** Enable sort controls */
	enableSort: boolean;
	/** Called when artwork is clicked */
	onArtworkClick: (artwork: ArtworkData) => void;
	/** Enable infinite scroll */
	enableInfiniteScroll?: boolean;
	/** Enable layout switching */
	enableLayoutSwitch?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Gallery pattern handlers
 */
export interface GalleryPatternHandlers {
	/** Called when layout changes */
	onLayoutChange?: (layout: GalleryLayout) => void;
	/** Called when sort changes */
	onSortChange?: (sort: GallerySortOption) => void;
	/** Called when filters change */
	onFilterChange?: (filters: DiscoveryFilters) => void;
	/** Called when more items are needed */
	onLoadMore?: () => Promise<ArtworkData[]>;
	/** Called when artwork is opened in viewer */
	onOpenViewer?: (artwork: ArtworkData, index: number) => void;
}

/**
 * Gallery pattern methods
 */
export interface GalleryPatternMethods {
	setLayout: (layout: GalleryLayout) => void;
	setSort: (option: GallerySortOption) => void;
	setFilters: (filters: DiscoveryFilters) => void;
	clearFilters: () => void;
	handleArtworkClick: (artwork: ArtworkData) => void;
	openViewer: (artwork: ArtworkData) => void;
	closeViewer: () => void;
	navigateViewer: (direction: 'next' | 'prev') => void;
	getCurrentViewerArtwork: () => ArtworkData | undefined;
	loadMore: () => Promise<ArtworkData[]>;
	getColumnCount: () => number;
	getItemCount: () => number;
	isEmpty: () => boolean;
}

// ============================================================================
// Upload Pattern Types
// ============================================================================

/**
 * Upload pattern configuration
 */
export interface UploadPatternConfig {
	/** Maximum number of files */
	maxFiles: number;
	/** Accepted file types (MIME types) */
	acceptedTypes: string[];
	/** Called when files are uploaded */
	onUpload: (files: File[]) => Promise<ArtworkData[]>;
	/** Require metadata before upload */
	requireMetadata: boolean;
	/** Require AI disclosure */
	requireAIDisclosure?: boolean;
	/** Enable batch upload */
	enableBatch?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Upload progress state
 */
export interface UploadProgress {
	/** File being uploaded */
	file: File;
	/** Upload progress (0-100) */
	progress: number;
	/** Upload status */
	status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
	/** Error message if failed */
	error?: string;
	/** Resulting artwork data if complete */
	artwork?: ArtworkData;
}

/**
 * Upload pattern handlers
 */
export interface UploadPatternHandlers {
	/** Called when files are selected */
	onFilesSelect?: (files: File[]) => void;
	/** Called when upload progress updates */
	onProgress?: (progress: UploadProgress[]) => void;
	/** Called when metadata is submitted */
	onMetadataSubmit?: (metadata: Record<string, unknown>) => void;
	/** Called when AI disclosure is submitted */
	onAIDisclosureSubmit?: (disclosure: {
		aiUsed: boolean;
		tools?: string[];
		percentage?: number;
	}) => void;
	/** Called when upload is cancelled */
	onCancel?: (fileIndex: number) => void;
	/** Called when all uploads complete */
	onComplete?: (artworks: ArtworkData[]) => void;
}

// ============================================================================
// Pattern Factory Types
// ============================================================================

/**
 * Pattern factory result
 */
export interface PatternFactoryResult<TConfig, THandlers, TState = unknown> {
	/** Pattern configuration */
	config: TConfig;
	/** Pattern handlers */
	handlers: THandlers;
	/** Pattern state */
	state: TState;
	/** Cleanup function */
	destroy: () => void;
}

/**
 * Pattern factory function type
 */
export type PatternFactory<TConfig, THandlers, TState = Record<string, unknown>> = (
	config: TConfig,
	handlers?: Partial<THandlers>
) => PatternFactoryResult<TConfig, THandlers, TState>;
