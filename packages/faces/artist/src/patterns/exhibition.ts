/**
 * Exhibition Pattern
 *
 * Factory for exhibition layouts with multiple display modes.
 *
 * @module @equaltoai/greater-components-artist/patterns/exhibition
 */

import type { ArtworkData } from '../types/index.js';
import type {
	ExhibitionPatternConfig,
	ExhibitionPatternHandlers,
	PatternFactoryResult,
} from './types.js';
import {
	createPatternId,
	createLoadingState,
	setLoading,
	setSuccess,
	setError,
	getCurrentBreakpoint,
	createBreakpointObserver,
	responsive,
	type LoadingStateData,
	type Breakpoint,
} from './utils.js';

// ============================================================================
// Exhibition Pattern State
// ============================================================================

/**
 * Exhibition navigation state
 */
export interface ExhibitionNavigationState {
	/** Current artwork index */
	currentIndex: number;
	/** Total artworks */
	totalArtworks: number;
	/** Whether navigation is enabled */
	canNavigate: boolean;
	/** Whether at first artwork */
	isFirst: boolean;
	/** Whether at last artwork */
	isLast: boolean;
}

/**
 * Exhibition pattern state
 */
export interface ExhibitionPatternState {
	/** Pattern instance ID */
	id: string;
	/** Navigation state */
	navigation: ExhibitionNavigationState;
	/** Current breakpoint */
	breakpoint: Breakpoint;
	/** Loading state for share operations */
	shareState: LoadingStateData<string>;
	/** Whether fullscreen mode is active */
	isFullscreen: boolean;
	/** Current layout (may differ from config on mobile) */
	activeLayout: ExhibitionPatternConfig['layout'];
}

// ============================================================================
// Exhibition Pattern Factory
// ============================================================================

/**
 * Create exhibition pattern instance
 *
 * @example
 * ```typescript
 * const exhibition = createExhibitionPattern({
 *   exhibition: exhibitionData,
 *   layout: 'gallery',
 *   showCurator: true,
 *   showArtists: true,
 *   enableNavigation: true,
 * }, {
 *   onArtworkSelect: (artwork) => console.log('Selected:', artwork),
 *   onShare: async (platform) => { ... },
 * });
 * ```
 */
export function createExhibitionPattern(
	config: ExhibitionPatternConfig,
	handlers: Partial<ExhibitionPatternHandlers> = {}
): PatternFactoryResult<ExhibitionPatternConfig, ExhibitionPatternHandlers> {
	const id = createPatternId('exhibition');
	const artworks = config.exhibition.artworks || [];

	// Initialize state
	const state: ExhibitionPatternState = {
		id,
		navigation: {
			currentIndex: 0,
			totalArtworks: artworks.length,
			canNavigate: config.enableNavigation && artworks.length > 1,
			isFirst: true,
			isLast: artworks.length <= 1,
		},
		breakpoint: getCurrentBreakpoint(),
		shareState: createLoadingState<string>(),
		isFullscreen: false,
		activeLayout: config.layout,
	};

	// Adjust layout for mobile
	const updateLayoutForBreakpoint = (breakpoint: Breakpoint) => {
		state.breakpoint = breakpoint;
		// Force simpler layout on mobile
		if (breakpoint === 'xs' || breakpoint === 'sm') {
			state.activeLayout = 'gallery';
		} else {
			state.activeLayout = config.layout;
		}
	};

	// Set up breakpoint observer
	const cleanupBreakpoint = createBreakpointObserver(updateLayoutForBreakpoint);

	// Navigation functions
	const navigateToIndex = (index: number) => {
		if (!state.navigation.canNavigate) return;

		const clampedIndex = Math.max(0, Math.min(index, artworks.length - 1));
		state.navigation.currentIndex = clampedIndex;
		state.navigation.isFirst = clampedIndex === 0;
		state.navigation.isLast = clampedIndex === artworks.length - 1;

		handlers.onNavigate?.(clampedIndex);
	};

	const navigateNext = () => {
		if (!state.navigation.isLast) {
			navigateToIndex(state.navigation.currentIndex + 1);
		}
	};

	const navigatePrevious = () => {
		if (!state.navigation.isFirst) {
			navigateToIndex(state.navigation.currentIndex - 1);
		}
	};

	// Share functionality
	const share = async (platform?: string) => {
		state.shareState = setLoading(state.shareState);

		try {
			await handlers.onShare?.(platform);
			state.shareState = setSuccess(state.shareState, 'shared');
		} catch (error) {
			state.shareState = setError(state.shareState, error as Error);
			throw error;
		}
	};

	// Generate embed code
	const getEmbedCode = (): string => {
		if (handlers.onEmbed) {
			return handlers.onEmbed();
		}

		const { exhibition } = config;
		return `<iframe src="/exhibitions/${exhibition.slug}/embed" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
	};

	// Select artwork
	const selectArtwork = (artwork: ArtworkData) => {
		const index = artworks.findIndex((a) => a.id === artwork.id);
		if (index !== -1) {
			navigateToIndex(index);
		}
		handlers.onArtworkSelect?.(artwork);
	};

	// Get current artwork
	const getCurrentArtwork = (): ArtworkData | undefined => {
		return artworks[state.navigation.currentIndex];
	};

	// Get layout columns based on breakpoint
	const getLayoutColumns = (): number => {
		return responsive(
			{
				xs: 1,
				sm: 2,
				md: 3,
				lg: 4,
				xl: 4,
				'2xl': 5,
			},
			3
		);
	};

	// Cleanup function
	const destroy = () => {
		cleanupBreakpoint();
	};

	// Compose handlers
	const composedHandlers: ExhibitionPatternHandlers = {
		onArtworkSelect: selectArtwork,
		onNavigate: navigateToIndex,
		onShare: share,
		onEmbed: getEmbedCode,
	};

	return {
		config,
		handlers: composedHandlers,
		get state() {
			return {
				...state,
				navigateNext,
				navigatePrevious,
				navigateToIndex,
				getCurrentArtwork,
				getLayoutColumns,
				share,
				getEmbedCode,
			};
		},
		destroy,
	};
}

// ============================================================================
// Pre-configured Exhibition Patterns
// ============================================================================

/**
 * Create gallery-style exhibition pattern
 */
export function createGalleryExhibition(
	config: Omit<ExhibitionPatternConfig, 'layout'>,
	handlers?: Partial<ExhibitionPatternHandlers>
) {
	return createExhibitionPattern({ ...config, layout: 'gallery' }, handlers);
}

/**
 * Create narrative-style exhibition pattern
 */
export function createNarrativeExhibition(
	config: Omit<ExhibitionPatternConfig, 'layout'>,
	handlers?: Partial<ExhibitionPatternHandlers>
) {
	return createExhibitionPattern({ ...config, layout: 'narrative' }, handlers);
}

/**
 * Create timeline-style exhibition pattern
 */
export function createTimelineExhibition(
	config: Omit<ExhibitionPatternConfig, 'layout'>,
	handlers?: Partial<ExhibitionPatternHandlers>
) {
	return createExhibitionPattern({ ...config, layout: 'timeline' }, handlers);
}

// ============================================================================
// Exhibition Pattern Helpers
// ============================================================================

/**
 * Format exhibition dates for display
 */
export function formatExhibitionDates(startDate: Date | string, endDate?: Date | string): string {
	const start = new Date(startDate);
	const formatOptions: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	};

	const startStr = start.toLocaleDateString('en-US', formatOptions);

	if (!endDate) {
		return `Opens ${startStr}`;
	}

	const end = new Date(endDate);
	const endStr = end.toLocaleDateString('en-US', formatOptions);

	// Check if same year
	if (start.getFullYear() === end.getFullYear()) {
		const startShort = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		return `${startShort} – ${endStr}`;
	}

	return `${startStr} – ${endStr}`;
}

/**
 * Get exhibition status label
 */
export function getExhibitionStatusLabel(
	status: 'upcoming' | 'current' | 'past' | 'virtual' | 'permanent'
): string {
	const labels: Record<typeof status, string> = {
		upcoming: 'Opening Soon',
		current: 'Now Showing',
		past: 'Past Exhibition',
		virtual: 'Virtual Exhibition',
		permanent: 'Permanent Collection',
	};

	return labels[status];
}
