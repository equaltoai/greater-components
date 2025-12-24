/**
 * CommissionWorkflow Component Context
 *
 * Provides shared state for commission workflow components.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components/faces/artist/CreativeTools/CommissionWorkflow/context
 */

import { getContext, setContext } from 'svelte';
import type {
	CommissionData,
	CommissionStatus,
	CommissionHandlers,
} from '../../../types/creative-tools.js';

// ============================================================================
// Types
// ============================================================================

/**
 * User role in commission
 */
export type CommissionRole = 'artist' | 'client';

/**
 * Commission step
 */
export type CommissionStep = 'request' | 'quote' | 'contract' | 'progress' | 'delivery' | 'payment';

/**
 * Commission context state
 */
export interface CommissionContext {
	/** Commission data */
	readonly commission: CommissionData;
	/** User role */
	readonly role: CommissionRole;
	/** Event handlers */
	readonly handlers: CommissionHandlers;
	/** Current step */
	currentStep: CommissionStep;
	/** Whether step navigation is allowed */
	canNavigate: boolean;
}

// ============================================================================
// Context Key
// ============================================================================

export const COMMISSION_CONTEXT_KEY = Symbol('commission-context');

// ============================================================================
// Step Mapping
// ============================================================================

const STATUS_TO_STEP: Record<CommissionStatus, CommissionStep> = {
	inquiry: 'request',
	quoted: 'quote',
	accepted: 'contract',
	'in-progress': 'progress',
	review: 'progress',
	revision: 'progress',
	completed: 'delivery',
	cancelled: 'request',
	disputed: 'payment',
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

export function createCommissionContext(
	commission: CommissionData | (() => CommissionData),
	role: CommissionRole | (() => CommissionRole),
	handlers: CommissionHandlers | (() => CommissionHandlers) = {}
): CommissionContext {
	const context: CommissionContext = {
		get commission() {
			return resolve(commission);
		},
		get role() {
			return resolve(role);
		},
		get handlers() {
			return resolve(handlers);
		},
		currentStep: STATUS_TO_STEP[resolve(commission).status] || 'request',
		canNavigate: true,
	};

	setContext(COMMISSION_CONTEXT_KEY, context);
	return context;
}

export function getCommissionContext(): CommissionContext {
	const context = getContext<CommissionContext>(COMMISSION_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			'Commission context not found. Ensure this component is used within a CommissionWorkflow.Root component.'
		);
	}
	return context;
}

export function hasCommissionContext(): boolean {
	try {
		getContext<CommissionContext>(COMMISSION_CONTEXT_KEY);
		return true;
	} catch {
		return false;
	}
}

/**
 * Navigate to step
 */
export function navigateToStep(ctx: CommissionContext, step: CommissionStep): void {
	if (ctx.canNavigate) {
		ctx.currentStep = step;
	}
}

/**
 * Get step order
 */
export function getStepOrder(): CommissionStep[] {
	return ['request', 'quote', 'contract', 'progress', 'delivery', 'payment'];
}

/**
 * Check if step is complete
 */
export function isStepComplete(commission: CommissionData, step: CommissionStep): boolean {
	const stepOrder = getStepOrder();
	const currentStepIndex = stepOrder.indexOf(STATUS_TO_STEP[commission.status]);
	const checkStepIndex = stepOrder.indexOf(step);
	return checkStepIndex < currentStepIndex;
}
