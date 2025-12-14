/**
 * CritiqueMode Component Context
 *
 * Provides shared state and configuration for compound CritiqueMode components.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components/faces/artist/CreativeTools/CritiqueMode/context
 */

import { getContext, setContext } from 'svelte';
import type { ArtworkData } from '../../Artwork/context.js';
import type {
	CritiqueAnnotation,
	CritiqueConfig,
	CritiqueHandlers,
} from '../../../types/creative-tools.js';

export type { CritiqueAnnotation, CritiqueConfig, CritiqueHandlers };

// ============================================================================
// Types
// ============================================================================

/**
 * Annotation tool type
 */
export type AnnotationTool = 'point' | 'area' | 'line' | 'text' | 'select';

/**
 * Zoom state
 */
export interface ZoomState {
	/** Current zoom level (1 = 100%) */
	level: number;
	/** Pan offset X */
	offsetX: number;
	/** Pan offset Y */
	offsetY: number;
}

/**
 * Critique context state
 */
export interface CritiqueContext {
	/** Artwork being critiqued */
	readonly artwork: ArtworkData;
	/** Display configuration */
	readonly config: Required<CritiqueConfig>;
	/** Event handlers */
	readonly handlers: CritiqueHandlers;
	/** Current annotations */
	annotations: CritiqueAnnotation[];
	/** Selected annotation ID */
	selectedAnnotationId: string | null;
	/** Current annotation tool */
	currentTool: AnnotationTool;
	/** Zoom state */
	zoom: ZoomState;
	/** Whether annotation mode is active */
	isAnnotating: boolean;
	/** Pending annotation (being created) */
	pendingAnnotation: Partial<CritiqueAnnotation> | null;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * Critique context key
 */
export const CRITIQUE_CONTEXT_KEY = Symbol('critique-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default critique configuration
 */
export const DEFAULT_CRITIQUE_CONFIG: Required<CritiqueConfig> = {
	enableAnnotations: true,
	enableDrawing: true,
	showCategories: true,
	categories: ['composition', 'color', 'technique', 'concept', 'other'],
	maxAnnotationsPerUser: 20,
	allowAnonymous: false,
	class: '',
};

// ============================================================================
// Context Functions
// ============================================================================

/**
 * Creates and sets the critique context
 */
export function createCritiqueContext(
	artwork: ArtworkData,
	config: CritiqueConfig = {},
	handlers: CritiqueHandlers = {},
	initialAnnotations: CritiqueAnnotation[] = []
): CritiqueContext {
	const context: CritiqueContext = {
		get artwork() {
			return artwork;
		},
		get config() {
			return {
				...DEFAULT_CRITIQUE_CONFIG,
				...config,
			};
		},
		get handlers() {
			return handlers;
		},
		annotations: initialAnnotations,
		selectedAnnotationId: null,
		currentTool: 'point',
		zoom: {
			level: 1,
			offsetX: 0,
			offsetY: 0,
		},
		isAnnotating: false,
		pendingAnnotation: null,
	};

	setContext(CRITIQUE_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the critique context
 */
export function getCritiqueContext(): CritiqueContext {
	const context = getContext<CritiqueContext>(CRITIQUE_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Critique context not found. Ensure this component is used within a CritiqueMode.Root component.'
		);
	}
	return context;
}

/**
 * Checks if critique context exists
 */
export function hasCritiqueContext(): boolean {
	try {
		getContext<CritiqueContext>(CRITIQUE_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Zoom Helpers
// ============================================================================

/**
 * Zoom in
 */
export function zoomIn(ctx: CritiqueContext, step: number = 0.25): void {
	ctx.zoom.level = Math.min(ctx.zoom.level + step, 4);
}

/**
 * Zoom out
 */
export function zoomOut(ctx: CritiqueContext, step: number = 0.25): void {
	ctx.zoom.level = Math.max(ctx.zoom.level - step, 0.5);
}

/**
 * Reset zoom
 */
export function resetZoom(ctx: CritiqueContext): void {
	ctx.zoom = { level: 1, offsetX: 0, offsetY: 0 };
}

/**
 * Set tool
 */
export function setTool(ctx: CritiqueContext, tool: AnnotationTool): void {
	ctx.currentTool = tool;
	ctx.isAnnotating = tool !== 'select';
}
