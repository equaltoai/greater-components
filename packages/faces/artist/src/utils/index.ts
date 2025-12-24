/**
 * Utility Exports
 *
 * Accessibility, performance, and monitoring utilities for the Artist Face.
 *
 * @module @equaltoai/greater-components-artist/utils
 */

// ============================================================================
// Accessibility Utilities (REQ-A11Y-001 through REQ-A11Y-007)
// ============================================================================

export {
	// Focus Management
	createFocusTrap,
	restoreFocus,
	createSkipLink,
	focusFirstInteractive,
	getFocusableElements,
	type FocusTrapConfig,
	type FocusTrap,
	type SkipLinkConfig,

	// Keyboard Navigation
	createGridNavigation,
	createRovingTabIndex,
	handleEscapeKey,
	createKeyboardShortcuts,
	type GridNavigationConfig,
	type RovingTabIndexConfig,
	type KeyboardShortcut,

	// Screen Reader Support
	announceToScreenReader,
	createAriaDescription,
	galleryAnnouncement,
	stateChangeAnnouncement,
	type LiveRegionPoliteness,

	// Alt Text
	validateAltText,
	generateAltTextTemplate,
	type AltTextValidation,
} from './accessibility.js';

// ============================================================================
// High Contrast Utilities (REQ-A11Y-003, REQ-A11Y-006)
// ============================================================================

export {
	detectHighContrastMode,
	createHighContrastObserver,
	calculateContrastRatio,
	ensureContrastRatio,
	getSufficientContrastColor,
	applyHighContrastStyles,
	preserveArtworkColors,
	removeColorPreservation,
	HIGH_CONTRAST_STYLES,
	HIGH_CONTRAST_DARK_STYLES,
	type HighContrastMode,
	type HighContrastStyles,
} from './highContrast.js';

// ============================================================================
// Reduced Motion Utilities (REQ-A11Y-007)
// ============================================================================

export {
	detectReducedMotion,
	createReducedMotionObserver,
	createMotionSafeAnimation,
	staticAlternative,
	instantTransition,
	getTransitionCSS,
	getAnimationCSS,
	motionSafe,
	FADE_IN,
	FADE_OUT,
	SLIDE_UP,
	SCALE_IN,
	GALLERY_REVEAL,
	type AnimationConfig,
	type MotionSafeParams,
} from './reducedMotion.js';

// ============================================================================
// Performance Utilities (REQ-PERF-001 through REQ-PERF-005)
// ============================================================================

export {
	// Image Optimization
	createProgressiveLoader,
	generateSrcSet,
	generateSizes,
	lazyLoadImage,
	preloadCriticalImages,
	preloadImage,
	type ProgressiveLoaderConfig,
	type ProgressiveLoaderState,
	type SrcsetBreakpoint,
	type LazyLoadConfig,

	// Virtual Scrolling
	createVirtualList,
	recycleNodes,
	maintainScrollPosition,
	type VirtualListConfig,
	type VirtualListState,

	// Bundle Optimization
	dynamicImport,
	createCodeSplitBoundary,
} from './performance.js';

// ============================================================================
// Performance Monitoring (REQ-PERF-006)
// ============================================================================

export {
	measureFCP,
	measureLCP,
	measureTTI,
	measureFID,
	measureCLS,
	createMetricsReporter,
	reportMetrics,
	CORE_WEB_VITALS_THRESHOLDS,
	type PerformanceMetric,
	type MetricsReporterConfig,
} from './monitoring.js';

// ============================================================================
// Accessibility Testing
// ============================================================================

export {
	checkColorContrast,
	validateAriaAttributes,
	checkKeyboardAccess,
	generateA11yReport,
	formatA11yReport,
	type A11ySeverity,
	type A11yIssue,
	type A11yReport,
} from './a11y-testing.js';
