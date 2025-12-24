/**
 * Artwork Component Context
 *
 * Provides shared state and configuration for compound Artwork components.
 * Uses Svelte 5's context API for passing data between Artwork.* components.
 *
 * @module @equaltoai/greater-components/faces/artist/Artwork/context
 */

import { getContext, setContext } from 'svelte';
import type { ArtworkData } from '../../types/artwork.js';

export type { ArtworkData } from '../../types/artwork.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Artwork display configuration
 */
export interface ArtworkConfig {
	/** Display density */
	density?: 'compact' | 'comfortable' | 'spacious';
	/** Display mode */
	displayMode?: 'card' | 'detail' | 'immersive';
	/** Show metadata panel */
	showMetadata?: boolean;
	/** Show stats */
	showStats?: boolean;
	/** Show actions */
	showActions?: boolean;
	/** Show AI disclosure */
	showAIDisclosure?: boolean;
	/** Enable progressive loading */
	progressiveLoading?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Artwork event handlers
 */
export interface ArtworkHandlers {
	/** Like button clicked */
	onLike?: (artwork: ArtworkData) => void | Promise<void>;
	/** Collect button clicked */
	onCollect?: (artwork: ArtworkData) => void | Promise<void>;
	/** Share button clicked */
	onShare?: (artwork: ArtworkData) => void | Promise<void>;
	/** Comment button clicked */
	onComment?: (artwork: ArtworkData) => void | Promise<void>;
	/** Artwork clicked (for navigation/lightbox) */
	onClick?: (artwork: ArtworkData) => void | Promise<void>;
	/** Artist attribution clicked */
	onArtistClick?: (artistId: string) => void | Promise<void>;
	/** Image load error */
	onImageError?: (error: Error) => void;
}

/**
 * Artwork context state
 */
export interface ArtworkContext {
	/** Artwork data */
	readonly artwork: ArtworkData;
	/** Display configuration */
	readonly config: Required<ArtworkConfig>;
	/** Event handlers */
	readonly handlers: ArtworkHandlers;
	/** Image loading state */
	imageLoadState: 'loading' | 'loaded' | 'error';
	/** Current image resolution loaded */
	currentResolution: 'thumbnail' | 'preview' | 'standard' | 'full';
	/** Whether user has liked */
	isLiked: boolean;
	/** Whether user has collected */
	isCollected: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * Artwork context key - unique symbol for context identification
 */
export const ARTWORK_CONTEXT_KEY = Symbol('artwork-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default artwork configuration
 */
export const DEFAULT_ARTWORK_CONFIG: Required<ArtworkConfig> = {
	density: 'comfortable',
	displayMode: 'card',
	showMetadata: true,
	showStats: true,
	showActions: true,
	showAIDisclosure: true,
	progressiveLoading: true,
	class: '',
};

// ============================================================================
// Context Functions
// ============================================================================

/**
 * Creates and sets the artwork context
 * @param artwork - Artwork data to display
 * @param config - Display configuration options
 * @param handlers - Event handlers
 * @returns The created context object
 */
export function createArtworkContext(
	artwork: ArtworkData,
	config: ArtworkConfig = {},
	handlers: ArtworkHandlers = {}
): ArtworkContext {
	const context: ArtworkContext = {
		get artwork() {
			return artwork;
		},
		get config() {
			return {
				...DEFAULT_ARTWORK_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
		imageLoadState: 'loading',
		currentResolution: 'thumbnail',
		isLiked: false,
		isCollected: false,
	};

	setContext(ARTWORK_CONTEXT_KEY, context);
	return context;
}

/**
 * Gets the artwork context from a parent component
 * @throws Error if called outside of an Artwork.Root component
 */
export function getArtworkContext(): ArtworkContext {
	const context = getContext<ArtworkContext>(ARTWORK_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Artwork context not found. Make sure this component is used within an Artwork.Root component.'
		);
	}
	return context;
}

/**
 * Checks if artwork context exists
 */
export function hasArtworkContext(): boolean {
	try {
		return !!getContext<ArtworkContext>(ARTWORK_CONTEXT_KEY);
	} catch {
		return false;
	}
}

/**
 * Updates the image load state in the context
 */
export function updateImageLoadState(
	context: ArtworkContext,
	state: 'loading' | 'loaded' | 'error'
): void {
	(context as { imageLoadState: string }).imageLoadState = state;
}

/**
 * Updates the current resolution in the context
 */
export function updateCurrentResolution(
	context: ArtworkContext,
	resolution: 'thumbnail' | 'preview' | 'standard' | 'full'
): void {
	(context as { currentResolution: string }).currentResolution = resolution;
}

// Re-export types for convenience
// Types are already exported
