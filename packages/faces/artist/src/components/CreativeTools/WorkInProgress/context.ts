/**
 * WorkInProgress Component Context
 *
 * Provides shared state and configuration for compound WorkInProgress components.
 * Uses Svelte 5's context API for passing data between WorkInProgress.* components.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components/faces/artist/CreativeTools/WorkInProgress/context
 */

import { getContext, setContext } from 'svelte';
import type { WIPThreadData, WIPUpdate, WIPHandlers } from '../../../types/creative-tools.js';

// ============================================================================
// Types
// ============================================================================

/**
 * WIP thread status
 */
export type WIPStatus = 'in-progress' | 'completed' | 'abandoned';

/**
 * Comparison mode for version comparison
 */
export type ComparisonMode = 'side-by-side' | 'slider' | 'overlay';

/**
 * Comparison state
 */
export interface ComparisonState {
	/** Whether comparison is active */
	isActive: boolean;
	/** Comparison mode */
	mode: ComparisonMode;
	/** First version index for comparison */
	versionA: number;
	/** Second version index for comparison */
	versionB: number;
	/** Slider position (0-100) for slider mode */
	sliderPosition: number;
	/** Overlay opacity (0-1) for overlay mode */
	overlayOpacity: number;
}

/**
 * WIP display configuration
 */
export interface WIPConfig {
	/** Show version timeline */
	showTimeline?: boolean;
	/** Show comments section */
	showComments?: boolean;
	/** Enable version comparison */
	enableComparison?: boolean;
	/** Show progress indicator */
	showProgress?: boolean;
	/** Allow posting updates (for owner) */
	allowUpdates?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * WIP context state
 */
export interface WIPContext {
	/** Thread data */
	readonly thread: WIPThreadData;
	/** Display configuration */
	readonly config: Required<WIPConfig>;
	/** Event handlers */
	readonly handlers: WIPHandlers;
	/** Current version index being viewed */
	currentVersionIndex: number;
	/** Comparison state */
	comparison: ComparisonState;
	/** Whether user is following this thread */
	isFollowing: boolean;
	/** Whether current user is the owner */
	isOwner: boolean;
	/** Selected update for detail view */
	selectedUpdate: WIPUpdate | null;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * WIP context key - unique symbol for context identification
 */
export const WIP_CONTEXT_KEY = Symbol('wip-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default WIP configuration
 */
export const DEFAULT_WIP_CONFIG: Required<WIPConfig> = {
	showTimeline: true,
	showComments: true,
	enableComparison: true,
	showProgress: true,
	allowUpdates: false,
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
 * Creates and sets the WIP context
 * @param thread - WIP thread data or getter
 * @param config - Display configuration options or getter
 * @param handlers - Event handlers or getter
 * @param isOwner - Whether current user owns this thread or getter
 * @returns The created context object
 */
export function createWIPContext(
	thread: WIPThreadData | (() => WIPThreadData),
	config: WIPConfig | (() => WIPConfig) = {},
	handlers: WIPHandlers | (() => WIPHandlers) = {},
	isOwner: boolean | (() => boolean) = false
): WIPContext {
	const context: WIPContext = {
		get thread() {
			return resolve(thread);
		},
		get config() {
			return {
				...DEFAULT_WIP_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		currentVersionIndex: resolve(thread).updates.length - 1,
		comparison: {
			isActive: false,
			mode: 'side-by-side',
			versionA: 0,
			versionB: resolve(thread).updates.length - 1,
			sliderPosition: 50,
			overlayOpacity: 0.5,
		},
		isFollowing: false,
		get isOwner() {
			return resolve(isOwner);
		},
		selectedUpdate: null,
	};

	setContext(WIP_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the WIP context from a parent component
 * @throws Error if context is not found
 * @returns The WIP context
 */
export function getWIPContext(): WIPContext {
	const context = getContext<WIPContext>(WIP_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'WIP context not found. Ensure this component is used within a WorkInProgress.Root component.'
		);
	}
	return context;
}

/**
 * Checks if WIP context exists
 * @returns Whether context is available
 */
export function hasWIPContext(): boolean {
	try {
		getContext<WIPContext>(WIP_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Navigation Helpers
// ============================================================================

/**
 * Navigate to next version
 */
export function navigateToNextVersion(ctx: WIPContext): void {
	if (ctx.currentVersionIndex < ctx.thread.updates.length - 1) {
		ctx.currentVersionIndex++;
		ctx.selectedUpdate = ctx.thread.updates[ctx.currentVersionIndex] ?? null;
	}
}

/**
 * Navigate to previous version
 */
export function navigateToPreviousVersion(ctx: WIPContext): void {
	if (ctx.currentVersionIndex > 0) {
		ctx.currentVersionIndex--;
		ctx.selectedUpdate = ctx.thread.updates[ctx.currentVersionIndex] ?? null;
	}
}

/**
 * Navigate to specific version
 */
export function navigateToVersion(ctx: WIPContext, index: number): void {
	if (index >= 0 && index < ctx.thread.updates.length) {
		ctx.currentVersionIndex = index;
		ctx.selectedUpdate = ctx.thread.updates[index] ?? null;
	}
}

/**
 * Toggle comparison mode
 */
export function toggleComparison(ctx: WIPContext): void {
	ctx.comparison.isActive = !ctx.comparison.isActive;
}

/**
 * Set comparison mode
 */
export function setComparisonMode(ctx: WIPContext, mode: ComparisonMode): void {
	ctx.comparison.mode = mode;
}

/**
 * Format time between versions
 */
export function formatTimeBetweenVersions(update1: WIPUpdate, update2: WIPUpdate): string {
	const date1 = new Date(update1.createdAt);
	const date2 = new Date(update2.createdAt);
	const diffMs = Math.abs(date2.getTime() - date1.getTime());
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

	if (diffDays > 0) {
		return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
	}
	if (diffHours > 0) {
		return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
	}
	return 'Less than an hour';
}
