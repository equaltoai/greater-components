/**
 * MediaViewer Component Context
 *
 * Provides shared state and configuration for MediaViewer compound components.
 * Uses Svelte 5's context API for passing data between MediaViewer.* components.
 *
 * @module @equaltoai/greater-components/faces/artist/MediaViewer/context
 */

import { getContext, setContext } from 'svelte';
import type { ArtworkData } from '../../types/artwork.js';

// ============================================================================
// Types
// ============================================================================

/**
 * MediaViewer configuration
 */
export interface MediaViewerConfig {
	/** Background style */
	background?: 'dark' | 'black' | 'blur';
	/** Show metadata panel */
	showMetadata?: boolean;
	/** Show social elements */
	showSocial?: boolean;
	/** Enable zoom */
	enableZoom?: boolean;
	/** Enable pan */
	enablePan?: boolean;
	/** Show thumbnail strip */
	showThumbnails?: boolean;
}

/**
 * MediaViewer event handlers
 */
export interface MediaViewerHandlers {
	/** Close viewer */
	onClose?: () => void;
	/** Navigate to artwork */
	onNavigate?: (index: number) => void;
	/** Zoom level changed */
	onZoom?: (level: number) => void;
	/** Interaction (like/collect/share) */
	onInteraction?: (type: string, artwork: ArtworkData) => void;
}

/**
 * MediaViewer context state
 */
export interface MediaViewerContext {
	/** Array of artworks */
	readonly artworks: ArtworkData[];
	/** Current artwork index */
	currentIndex: number;
	/** Display configuration */
	readonly config: Required<MediaViewerConfig>;
	/** Event handlers */
	readonly handlers: MediaViewerHandlers;
	/** Current zoom level (1 = 100%) */
	zoomLevel: number;
	/** Pan offset */
	panOffset: { x: number; y: number };
	/** Is metadata panel visible */
	isMetadataVisible: boolean;
	/** Is viewer open */
	isOpen: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * MediaViewer context key
 */
export const MEDIA_VIEWER_CONTEXT_KEY = Symbol('media-viewer-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default MediaViewer configuration
 */
export const DEFAULT_MEDIA_VIEWER_CONFIG: Required<MediaViewerConfig> = {
	background: 'black',
	showMetadata: true,
	showSocial: false,
	enableZoom: true,
	enablePan: true,
	showThumbnails: true,
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
 * Creates and sets the MediaViewer context
 */
export function createMediaViewerContext(
	artworks: ArtworkData[] | (() => ArtworkData[]),
	currentIndex: number | (() => number) = 0,
	config: MediaViewerConfig | (() => MediaViewerConfig) = {},
	handlers: MediaViewerHandlers | (() => MediaViewerHandlers) = {}
): MediaViewerContext {
	const context: MediaViewerContext = {
		get artworks() {
			return resolve(artworks);
		},
		currentIndex: resolve(currentIndex),
		get config() {
			return {
				...DEFAULT_MEDIA_VIEWER_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		zoomLevel: 1,
		panOffset: { x: 0, y: 0 },
		isMetadataVisible: resolve(config).showMetadata ?? true,
		isOpen: true,
	};

	setContext(MEDIA_VIEWER_CONTEXT_KEY, context);
	return context;
}

/**
 * Gets the MediaViewer context from a parent component
 */
export function getMediaViewerContext(): MediaViewerContext {
	const context = getContext<MediaViewerContext>(MEDIA_VIEWER_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'MediaViewer context not found. Make sure this component is used within a MediaViewer.Root component.'
		);
	}
	return context;
}

/**
 * Checks if MediaViewer context exists
 */
export function hasMediaViewerContext(): boolean {
	try {
		return !!getContext<MediaViewerContext>(MEDIA_VIEWER_CONTEXT_KEY);
	} catch {
		return false;
	}
}

// Re-export types
// Types are already exported
