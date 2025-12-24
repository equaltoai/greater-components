/**
 * CritiqueCircle Component Context
 *
 * Provides shared state and configuration for compound CritiqueCircle components.
 * Uses Svelte 5's context API for passing data between CritiqueCircle.* components.
 * Implements REQ-COMM-001: Critique Circles
 *
 * @module @equaltoai/greater-components/faces/artist/Community/CritiqueCircle/context
 */

import { getContext, setContext } from 'svelte';
import type {
	CritiqueCircleData,
	CritiqueCircleMember,
	CritiqueCircleMemberRole,
	CritiqueSubmission,
	CritiqueCircleHandlers,
} from '../../../types/community.js';

// ============================================================================
// Types
// ============================================================================

/**
 * User membership status in the circle
 */
export type MembershipStatus = 'member' | 'moderator' | 'admin' | 'viewer' | 'pending';

/**
 * Session state for active critique
 */
export interface SessionState {
	/** Whether a session is active */
	isActive: boolean;
	/** Current submission being critiqued */
	currentSubmission: CritiqueSubmission | null;
	/** Time remaining in session (seconds) */
	timeRemaining: number | null;
	/** Current turn holder ID */
	currentTurnHolder: string | null;
	/** Whether user can give feedback */
	canGiveFeedback: boolean;
}

/**
 * Queue state
 */
export interface QueueState {
	/** User's position in queue (null if not in queue) */
	userPosition: number | null;
	/** Estimated wait time in minutes */
	estimatedWaitTime: number | null;
	/** Whether user has priority */
	hasPriority: boolean;
}

/**
 * CritiqueCircle display configuration
 */
export interface CritiqueCircleConfig {
	/** Show queue panel */
	showQueue?: boolean;
	/** Show session panel */
	showSession?: boolean;
	/** Show history panel */
	showHistory?: boolean;
	/** Show members panel */
	showMembers?: boolean;
	/** Enable anonymous feedback */
	enableAnonymousFeedback?: boolean;
	/** Enable real-time updates */
	enableRealtime?: boolean;
	/** Custom CSS class */
	class?: string;
}

/**
 * CritiqueCircle context state
 */
export interface CritiqueCircleContext {
	/** Circle data */
	readonly circle: CritiqueCircleData;
	/** Display configuration */
	readonly config: Required<CritiqueCircleConfig>;
	/** Event handlers */
	readonly handlers: CritiqueCircleHandlers;
	/** User's membership status */
	membership: MembershipStatus;
	/** Current user's member data */
	currentMember: CritiqueCircleMember | null;
	/** Session state */
	session: SessionState;
	/** Queue state */
	queue: QueueState;
	/** Selected history item for viewing */
	selectedHistoryItem: CritiqueSubmission | null;
	/** Whether user is submitting */
	isSubmitting: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

/**
 * CritiqueCircle context key - unique symbol for context identification
 */
export const CRITIQUE_CIRCLE_CONTEXT_KEY = Symbol('critique-circle-context');

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default CritiqueCircle configuration
 */
export const DEFAULT_CRITIQUE_CIRCLE_CONFIG: Required<CritiqueCircleConfig> = {
	showQueue: true,
	showSession: true,
	showHistory: true,
	showMembers: true,
	enableAnonymousFeedback: true,
	enableRealtime: true,
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
 * Creates and sets the CritiqueCircle context
 * @param circle - Circle data or getter
 * @param membership - User's membership status or getter
 * @param config - Display configuration options or getter
 * @param handlers - Event handlers or getter
 * @returns The created context object
 */
export function createCritiqueCircleContext(
	circle: CritiqueCircleData | (() => CritiqueCircleData),
	membership: MembershipStatus | (() => MembershipStatus) = 'viewer',
	config: CritiqueCircleConfig | (() => CritiqueCircleConfig) = {},
	handlers: CritiqueCircleHandlers | (() => CritiqueCircleHandlers) = {}
): CritiqueCircleContext {
	const context: CritiqueCircleContext = {
		get circle() {
			return resolve(circle);
		},
		get config() {
			return {
				...DEFAULT_CRITIQUE_CIRCLE_CONFIG,
				...resolve(config),
			};
		},
		get handlers() {
			return resolve(handlers);
		},
		get membership() {
			return resolve(membership);
		},
		get currentMember() {
			const c = resolve(circle);
			const m = resolve(membership);
			return (
				c.members.find(
					(member) =>
						member.role === m ||
						(m === 'admin' && member.role === 'admin') ||
						(m === 'moderator' && member.role === 'moderator')
				) || null
			);
		},
		session: {
			get isActive() {
				return !!resolve(circle).activeSession;
			},
			get currentSubmission() {
				return resolve(circle).activeSession || null;
			},
			timeRemaining: null,
			currentTurnHolder: null,
			get canGiveFeedback() {
				const m = resolve(membership);
				return m !== 'viewer' && m !== 'pending';
			},
		},
		queue: {
			userPosition: null,
			estimatedWaitTime: null,
			hasPriority: false,
		},
		selectedHistoryItem: null,
		isSubmitting: false,
	};

	setContext(CRITIQUE_CIRCLE_CONTEXT_KEY, context);
	return context;
}

/**
 * Retrieves the CritiqueCircle context from a parent component
 * @throws Error if context is not found
 * @returns The CritiqueCircle context
 */
export function getCritiqueCircleContext(): CritiqueCircleContext {
	const context = getContext<CritiqueCircleContext>(CRITIQUE_CIRCLE_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'CritiqueCircle context not found. Ensure this component is used within a CritiqueCircle.Root component.'
		);
	}
	return context;
}

/**
 * Checks if CritiqueCircle context exists
 * @returns Whether context is available
 */
export function hasCritiqueCircleContext(): boolean {
	try {
		getContext<CritiqueCircleContext>(CRITIQUE_CIRCLE_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

// ============================================================================
// Permission Helpers
// ============================================================================

/**
 * Check if user can moderate the circle
 */
export function canModerate(ctx: CritiqueCircleContext): boolean {
	return ctx.membership === 'admin' || ctx.membership === 'moderator';
}

/**
 * Check if user can submit artwork for critique
 */
export function canSubmit(ctx: CritiqueCircleContext): boolean {
	return (
		ctx.membership === 'member' || ctx.membership === 'moderator' || ctx.membership === 'admin'
	);
}

/**
 * Check if user can give critique
 */
export function canCritique(ctx: CritiqueCircleContext): boolean {
	return ctx.membership !== 'viewer' && ctx.membership !== 'pending';
}

/**
 * Check if user can invite members
 */
export function canInvite(ctx: CritiqueCircleContext): boolean {
	return ctx.membership === 'admin' || ctx.membership === 'moderator';
}

/**
 * Check if user can remove members
 */
export function canRemoveMember(ctx: CritiqueCircleContext): boolean {
	return ctx.membership === 'admin';
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate estimated wait time based on queue position
 */
export function calculateEstimatedWaitTime(
	position: number,
	avgSessionMinutes: number = 30
): number {
	return position * avgSessionMinutes;
}

/**
 * Format wait time for display
 */
export function formatWaitTime(minutes: number): string {
	if (minutes < 60) {
		return `~${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	if (remainingMinutes === 0) {
		return `~${hours} hr`;
	}
	return `~${hours} hr ${remainingMinutes} min`;
}

/**
 * Get member badge based on role
 */
export function getMemberBadge(role: CritiqueCircleMemberRole): { label: string; color: string } {
	switch (role) {
		case 'admin':
			return { label: 'Admin', color: 'var(--gr-color-warning-500)' };
		case 'moderator':
			return { label: 'Moderator', color: 'var(--gr-color-primary-500)' };
		default:
			return { label: 'Member', color: 'var(--gr-color-gray-500)' };
	}
}
