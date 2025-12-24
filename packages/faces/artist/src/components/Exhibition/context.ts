/**
 * Exhibition Component Context
 *
 * Provides shared state and configuration for compound Exhibition components.
 * Uses Svelte 5's context API for passing data between Exhibition.* components.
 * Implements REQ-FR-005: Community Curation Features
 *
 * @module @equaltoai/greater-components/faces/artist/Exhibition/context
 */

import { getContext, setContext } from 'svelte';
import type { ExhibitionData, ExhibitionConfig, ExhibitionHandlers } from '../../types/curation.js';
import type { ArtworkData } from '../../types/artwork.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Exhibition layout mode
 */
export type ExhibitionLayout = 'gallery' | 'narrative' | 'timeline';

/**
 * Navigation state for exhibition
 */
export interface ExhibitionNavigationState {
	/** Current artwork index */
	currentIndex: number;
	/** Total artworks */
	totalArtworks: number;
	/** Current section (for narrative layout) */
	currentSection?: string;
	/** Whether navigation is at start */
	isAtStart: boolean;
	/** Whether navigation is at end */
	isAtEnd: boolean;
}

/**
 * Exhibition context state
 */
export interface ExhibitionContext {
	/** Exhibition data */
	readonly exhibition: ExhibitionData;
	/** Display configuration */
	readonly config: Required<ExhibitionConfig>;
	/** Event handlers */
	readonly handlers: ExhibitionHandlers;
	/** Current layout mode */
	layout: ExhibitionLayout;
	/** Navigation state */
	navigation: ExhibitionNavigationState;
	/** Whether curator statement is expanded */
	statementExpanded: boolean;
	/** Currently focused artwork */
	focusedArtwork: ArtworkData | null;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * Exhibition context key - unique symbol for context identification
 */
export const EXHIBITION_CONTEXT_KEY = Symbol('exhibition-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default exhibition configuration
 */
export const DEFAULT_EXHIBITION_CONFIG: Required<ExhibitionConfig> = {
	variant: 'full',
	showCurator: true,
	showArtworkCount: true,
	showDates: true,
	showLocation: true,
	enableVirtualTour: false,
	class: '',
};

// ============================================================================
// Context Functions
// ============================================================================

/**
 * Helper to resolve value or getter
 */
function resolve<T>(value: T | (() => T)): T {
	return typeof value === 'function' ? (value as () => T)() : value;
}

/**
 * Creates and sets the exhibition context
 * @param exhibition - Exhibition data to display or getter
 * @param config - Display configuration options or getter
 * @param handlers - Event handlers or getter
 * @param layout - Initial layout mode or getter
 * @returns The created context object
 */
export function createExhibitionContext(
	exhibition: ExhibitionData | (() => ExhibitionData),
	config: ExhibitionConfig | (() => ExhibitionConfig) = {},
	handlers: ExhibitionHandlers | (() => ExhibitionHandlers) = {},
	layout: ExhibitionLayout | (() => ExhibitionLayout) = 'gallery'
): ExhibitionContext {
	const context: ExhibitionContext = {
		get exhibition() {
			return resolve(exhibition);
		},
		get config() {
			return {
				...DEFAULT_EXHIBITION_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		layout: resolve(layout),
		navigation: {
			currentIndex: 0,
			get totalArtworks() {
				return resolve(exhibition).artworks.length;
			},
			get isAtStart() {
				return this.currentIndex === 0;
			},
			get isAtEnd() {
				return this.currentIndex === this.totalArtworks - 1;
			},
			currentSection: undefined,
		},
		statementExpanded: false,
		focusedArtwork: null,
	};

	setContext(EXHIBITION_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the exhibition context from a parent component
 * @throws Error if context is not found
 * @returns The exhibition context
 */
export function getExhibitionContext(): ExhibitionContext {
	const context = getContext<ExhibitionContext>(EXHIBITION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Exhibition context not found. Ensure this component is used within an Exhibition.Root component.'
		);
	}
	return context;
}

/**
 * Checks if exhibition context exists
 * @returns Whether context is available
 */
export function hasExhibitionContext(): boolean {
	try {
		getContext<ExhibitionContext>(EXHIBITION_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Navigation Helpers
// ============================================================================

/**
 * Navigate to next artwork
 */
export function navigateNext(ctx: ExhibitionContext): void {
	if (ctx.navigation.currentIndex < ctx.navigation.totalArtworks - 1) {
		ctx.navigation.currentIndex++;
		ctx.focusedArtwork = ctx.exhibition.artworks[ctx.navigation.currentIndex] ?? null;
	}
}

/**
 * Navigate to previous artwork
 */
export function navigatePrevious(ctx: ExhibitionContext): void {
	if (ctx.navigation.currentIndex > 0) {
		ctx.navigation.currentIndex--;
		ctx.focusedArtwork = ctx.exhibition.artworks[ctx.navigation.currentIndex] ?? null;
	}
}

/**
 * Navigate to specific artwork index
 */
export function navigateTo(ctx: ExhibitionContext, index: number): void {
	if (index >= 0 && index < ctx.navigation.totalArtworks) {
		ctx.navigation.currentIndex = index;
		ctx.focusedArtwork = ctx.exhibition.artworks[index] ?? null;
	}
}

/**
 * Format exhibition date range for display
 */
export function formatExhibitionDates(exhibition: ExhibitionData): string {
	const start = new Date(exhibition.startDate);
	const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };

	if (!exhibition.endDate) {
		return `Opens ${start.toLocaleDateString('en-US', options)}`;
	}

	const end = new Date(exhibition.endDate);
	return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}
