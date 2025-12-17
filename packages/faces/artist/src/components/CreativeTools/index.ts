/**
 * CreativeTools Components
 *
 * Components for WIP sharing, critique, reference boards, and commissions.
 * Implements REQ-FR-006: Creative Tools for Artistic Process
 *
 * @module @equaltoai/greater-components-artist/components/CreativeTools
 */

// WorkInProgress compound component
export { WorkInProgress } from './WorkInProgress/index.js';
export {
	WIP_CONTEXT_KEY,
	createWIPContext,
	getWIPContext,
	type WIPContext,
	type WIPConfig,
	type WIPStatus,
	type ComparisonMode,
	type ComparisonState,
} from './WorkInProgress/context.js';

// CritiqueMode compound component
export { CritiqueMode } from './CritiqueMode/index.js';
export {
	CRITIQUE_CONTEXT_KEY,
	createCritiqueContext,
	getCritiqueContext,
	type CritiqueContext,
	type AnnotationTool,
	type ZoomState,
} from './CritiqueMode/context.svelte.js';

// ReferenceBoard standalone component
export { default as ReferenceBoard } from './ReferenceBoard.svelte';

// CommissionWorkflow compound component
export { CommissionWorkflow } from './CommissionWorkflow/index.js';
export {
	COMMISSION_CONTEXT_KEY,
	createCommissionContext,
	getCommissionContext,
	type CommissionContext,
	type CommissionRole,
	type CommissionStep,
} from './CommissionWorkflow/context.js';

// Re-export types for convenience
export type {
	WIPThreadData,
	WIPUpdate,
	WIPHandlers,
	CritiqueAnnotation,
	CritiqueConfig,
	CritiqueHandlers,
	ReferenceBoardData,
	ReferenceItem,
	ReferenceBoardHandlers,
	CommissionData,
	CommissionStatus,
	CommissionHandlers,
} from '../../types/creative-tools.js';
