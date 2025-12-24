/**
 * CommissionWorkflow Compound Component
 *
 * Components for managing art commissions.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components-artist/components/CreativeTools/CommissionWorkflow
 */

import Root from './Root.svelte';

export {
	COMMISSION_CONTEXT_KEY,
	createCommissionContext,
	getCommissionContext,
	hasCommissionContext,
	navigateToStep,
	getStepOrder,
	isStepComplete,
	type CommissionContext,
	type CommissionRole,
	type CommissionStep,
} from './context.js';

export const CommissionWorkflow = Object.assign(Root, {
	Root,
});

export default CommissionWorkflow;
