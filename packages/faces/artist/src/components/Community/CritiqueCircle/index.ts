/**
 * CritiqueCircle Compound Component
 *
 * A compound component for critique circle functionality.
 * Implements REQ-COMM-001: Critique Circles
 *
 * @module @equaltoai/greater-components/faces/artist/Community/CritiqueCircle
 *
 * @example
 * ```svelte
 * <script>
 *   import { CritiqueCircle } from '@equaltoai/greater-components/faces/artist';
 * </script>
 *
 * <CritiqueCircle.Root {circle} membership="member" {handlers}>
 *   <CritiqueCircle.Queue />
 *   <CritiqueCircle.Session />
 *   <CritiqueCircle.History />
 *   <CritiqueCircle.Members />
 * </CritiqueCircle.Root>
 * ```
 */

import Root from './Root.svelte';
import Queue from './Queue.svelte';
import Session from './Session.svelte';
import History from './History.svelte';
import Members from './Members.svelte';

export {
	CRITIQUE_CIRCLE_CONTEXT_KEY,
	createCritiqueCircleContext,
	getCritiqueCircleContext,
	hasCritiqueCircleContext,
	canModerate,
	canSubmit,
	canCritique,
	canInvite,
	canRemoveMember,
	calculateEstimatedWaitTime,
	formatWaitTime,
	getMemberBadge,
	type CritiqueCircleContext,
	type CritiqueCircleConfig,
	type MembershipStatus,
	type SessionState,
	type QueueState,
} from './context.js';

export const CritiqueCircle = {
	Root,
	Queue,
	Session,
	History,
	Members,
};

export default CritiqueCircle;
