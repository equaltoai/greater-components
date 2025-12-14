/**
 * Artist Face Patterns
 *
 * Reusable patterns for common artist portfolio functionality.
 * Patterns compose multiple components for common use cases.
 *
 * @module @equaltoai/greater-components-artist/patterns
 */

// ============================================================================
// Pattern Types
// ============================================================================

export type {
	// Exhibition pattern types
	ExhibitionLayout,
	ExhibitionPatternConfig,
	ExhibitionPatternHandlers,
	// Commission pattern types
	CommissionRole,
	CommissionStep,
	CommissionPatternConfig,
	CommissionPatternHandlers,
	// Critique pattern types
	CritiqueMode,
	CritiquePatternConfig,
	CritiquePatternHandlers,
	// Portfolio pattern types
	PortfolioSection,
	PortfolioPatternConfig,
	PortfolioPatternHandlers,
	// Discovery pattern types
	DiscoveryLayout,
	DiscoveryPatternConfig,
	DiscoveryPatternHandlers,
	SavedSearch,
	// Gallery pattern types
	GalleryLayout,
	GallerySortOption,
	GalleryPatternConfig,
	GalleryPatternHandlers,
	// Upload pattern types
	UploadPatternConfig,
	UploadPatternHandlers,
	UploadProgress,
	// Factory types
	PatternFactoryResult,
	PatternFactory,
} from './types.js';

// ============================================================================
// Pattern Factories
// ============================================================================

// Exhibition pattern
export {
	createExhibitionPattern,
	createGalleryExhibition,
	createNarrativeExhibition,
	createTimelineExhibition,
	formatExhibitionDates,
	getExhibitionStatusLabel,
	type ExhibitionNavigationState,
	type ExhibitionPatternState,
} from './exhibition.js';

// Commission pattern
export {
	createCommissionPattern,
	COMMISSION_STEP_ORDER,
	ROLE_STEPS,
	STEP_VALIDATIONS,
	getStepDisplayName,
	getStepDescription,
	type CommissionPatternState,
	type StepValidation,
} from './commission.js';

// Critique pattern
export {
	createCritiquePattern,
	DEFAULT_CRITIQUE_QUESTIONS,
	getCritiqueModeDisplayName,
	getAnnotationCategories,
	getSentimentOptions,
	type CritiquePatternState,
	type AnnotationTool,
} from './critique.js';

// Portfolio pattern
export {
	createPortfolioPattern,
	getSectionTypeDisplayName,
	getDefaultSectionTemplate,
	type PortfolioPatternState,
} from './portfolio.js';

// Discovery pattern
export {
	createDiscoveryPattern,
	getLayoutDisplayName as getDiscoveryLayoutDisplayName,
	formatResultCount,
	getFilterSummary,
	type DiscoveryPatternState,
} from './discovery.js';

// Gallery pattern
export {
	createGalleryPattern,
	getLayoutDisplayName as getGalleryLayoutDisplayName,
	getLayoutIcon,
	getSortDisplayName,
	type GalleryPatternState,
} from './gallery.js';

// Upload pattern
export {
	createUploadPattern,
	getUploadStepDisplayName,
	formatFileSize,
	getAcceptedTypesDisplay,
	COMMON_AI_TOOLS,
	type UploadPatternState,
	type UploadStep,
	type FileMetadata,
	type AIDisclosure,
} from './upload.js';

// ============================================================================
// Pattern Utilities
// ============================================================================

export {
	// Breakpoint utilities
	BREAKPOINTS,
	getCurrentBreakpoint,
	matchesBreakpoint,
	responsive,
	createBreakpointObserver,
	type Breakpoint,
	// Animation utilities
	ANIMATION_PRESETS,
	getAnimationStyles,
	staggerDelay,
	type AnimationPreset,
	// Loading state utilities
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	isStale,
	type LoadingState,
	type LoadingStateData,
	// Error boundary utilities
	createErrorBoundaryState,
	handleBoundaryError,
	resetErrorBoundary,
	formatErrorMessage,
	type ErrorBoundaryState,
	// Composition utilities
	composeClasses,
	createPatternId,
	debounce,
	throttle,
} from './utils.js';
