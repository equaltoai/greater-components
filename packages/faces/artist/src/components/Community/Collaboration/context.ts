/**
 * Collaboration Component Context
 *
 * Provides shared state and configuration for compound Collaboration components.
 * Uses Svelte 5's context API for passing data between Collaboration.* components.
 * Implements REQ-COMM-002: Collaboration
 *
 * @module @equaltoai/greater-components/faces/artist/Community/Collaboration/context
 */

import { getContext, setContext } from 'svelte';
import type {
	CollaborationData,
	CollaborationMember,
	CollaborationStatus,
	CollaborationHandlers,
} from '../../../types/community.js';

// ============================================================================
// Types
// ============================================================================

/**
 * User's role in the collaboration
 */
export type CollaborationRole = 'owner' | 'contributor' | 'viewer' | 'pending';

/**
 * Split agreement data
 */
export interface SplitAgreement {
	/** Split ID */
	id: string;
	/** Splits by contributor */
	splits: {
		artistId: string;
		artistName: string;
		percentage: number;
		confirmed: boolean;
	}[];
	/** Whether all parties have confirmed */
	isConfirmed: boolean;
	/** Created date */
	createdAt: Date | string;
	/** Last updated */
	updatedAt?: Date | string;
}

/**
 * Collaboration display configuration
 */
export interface CollaborationConfig {
	/** Show project overview */
	showProject?: boolean;
	/** Show contributors panel */
	showContributors?: boolean;
	/** Show uploads panel */
	showUploads?: boolean;
	/** Show gallery */
	showGallery?: boolean;
	/** Show split configuration */
	showSplit?: boolean;
	/** Enable file uploads */
	enableUploads?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * Collaboration context state
 */
export interface CollaborationContext {
	/** Collaboration data */
	readonly collaboration: CollaborationData;
	/** Display configuration */
	readonly config: Required<CollaborationConfig>;
	/** Event handlers */
	readonly handlers: CollaborationHandlers;
	/** User's role */
	role: CollaborationRole;
	/** Current user's member data */
	currentMember: CollaborationMember | null;
	/** Split agreement */
	splitAgreement: SplitAgreement | null;
	/** Selected asset for preview */
	selectedAsset: string | null;
	/** Whether user is uploading */
	isUploading: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * Collaboration context key - unique symbol for context identification
 */
export const COLLABORATION_CONTEXT_KEY = Symbol('collaboration-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default Collaboration configuration
 */
export const DEFAULT_COLLABORATION_CONFIG: Required<CollaborationConfig> = {
	showProject: true,
	showContributors: true,
	showUploads: true,
	showGallery: true,
	showSplit: true,
	enableUploads: true,
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
 * Creates and sets the Collaboration context
 * @param collaboration - Collaboration data or getter
 * @param role - User's role in the collaboration or getter
 * @param config - Display configuration options or getter
 * @param handlers - Event handlers or getter
 * @returns The created context object
 */
export function createCollaborationContext(
	collaboration: CollaborationData | (() => CollaborationData),
	role: CollaborationRole | (() => CollaborationRole) = 'viewer',
	config: CollaborationConfig | (() => CollaborationConfig) = {},
	handlers: CollaborationHandlers | (() => CollaborationHandlers) = {}
): CollaborationContext {
	const context: CollaborationContext = {
		get collaboration() {
			return resolve(collaboration);
		},
		get config() {
			return {
				...DEFAULT_COLLABORATION_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		get role() {
			return resolve(role);
		},
		get currentMember() {
			const c = resolve(collaboration);
			const r = resolve(role);
			return c.members.find((m) => m.role === r || r === 'owner') || null;
		},
		splitAgreement: null,
		selectedAsset: null,
		isUploading: false,
	};

	setContext(COLLABORATION_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the Collaboration context from a parent component
 * @throws Error if context is not found
 * @returns The Collaboration context
 */
export function getCollaborationContext(): CollaborationContext {
	const context = getContext<CollaborationContext>(COLLABORATION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Collaboration context not found. Ensure this component is used within a Collaboration.Root component.'
		);
	}
	return context;
}

/**
 * Checks if Collaboration context exists
 * @returns Whether context is available
 */
export function hasCollaborationContext(): boolean {
	try {
		getContext<CollaborationContext>(COLLABORATION_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Permission Helpers
// ============================================================================

/**
 * Check if user can manage the collaboration
 */
export function canManage(ctx: CollaborationContext): boolean {
	return ctx.role === 'owner';
}

/**
 * Check if user can contribute
 */
export function canContribute(ctx: CollaborationContext): boolean {
	return ctx.role === 'owner' || ctx.role === 'contributor';
}

/**
 * Check if user can upload files
 */
export function canUpload(ctx: CollaborationContext): boolean {
	return ctx.config.enableUploads && (ctx.role === 'owner' || ctx.role === 'contributor');
}

/**
 * Check if user can invite members
 */
export function canInviteMembers(ctx: CollaborationContext): boolean {
	return ctx.role === 'owner' && ctx.collaboration.acceptingMembers;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get status badge info
 */
export function getStatusBadge(status: CollaborationStatus): { label: string; color: string } {
	switch (status) {
		case 'planning':
			return { label: 'Planning', color: 'var(--gr-color-warning-500)' };
		case 'active':
			return { label: 'Active', color: 'var(--gr-color-success-500)' };
		case 'paused':
			return { label: 'Paused', color: 'var(--gr-color-gray-500)' };
		case 'completed':
			return { label: 'Completed', color: 'var(--gr-color-primary-500)' };
		case 'cancelled':
			return { label: 'Cancelled', color: 'var(--gr-color-error-500)' };
		default:
			return { label: status, color: 'var(--gr-color-gray-500)' };
	}
}

/**
 * Calculate total split percentage
 */
export function calculateTotalSplit(agreement: SplitAgreement | null): number {
	if (!agreement) return 0;
	return agreement.splits.reduce((sum, split) => sum + split.percentage, 0);
}

/**
 * Check if split is valid (totals 100%)
 */
export function isSplitValid(agreement: SplitAgreement | null): boolean {
	return calculateTotalSplit(agreement) === 100;
}
