/**
 * Review Compound Component
 *
 * Chrome for the shared-draft review workflow: queue cards, an attribution
 * strip, and confirm-guarded verdict actions.
 *
 * The three components are independent and presentational — there is no shared
 * context to set up. Compose them however the consuming surface needs; the
 * queue card exposes `attribution` and `actions` snippets for the common
 * "card with strip and verdict buttons" arrangement.
 *
 * Lesser owns review semantics. These components render what the pinned
 * contract returns and report reviewer intent back to the caller; they do not
 * decide whether a verdict is permitted or what status results from it.
 *
 * @module @equaltoai/greater-components/faces/blog/Review
 */

export { default as QueueCard } from './QueueCard.svelte';
export { default as AttributionStrip } from './AttributionStrip.svelte';
export { default as VerdictActions } from './VerdictActions.svelte';

export {
	describeApprovalRequirement,
	formatReviewDateTime,
	resolveReviewState,
	reviewActorHandle,
	reviewActorName,
} from './state.js';

export type { DescribeApprovalRequirementOptions } from './state.js';

export const Review = {
	QueueCard: {} as typeof import('./QueueCard.svelte').default,
	AttributionStrip: {} as typeof import('./AttributionStrip.svelte').default,
	VerdictActions: {} as typeof import('./VerdictActions.svelte').default,
};

// Dynamic imports for tree-shaking
import QueueCard from './QueueCard.svelte';
import AttributionStrip from './AttributionStrip.svelte';
import VerdictActions from './VerdictActions.svelte';

Review.QueueCard = QueueCard;
Review.AttributionStrip = AttributionStrip;
Review.VerdictActions = VerdictActions;
