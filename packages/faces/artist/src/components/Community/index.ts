/**
 * Community Components
 *
 * Components for structured community interactions including
 * critique circles, collaborations, and mentor matching.
 *
 * Implements:
 * - REQ-COMM-001: Critique Circles
 * - REQ-COMM-002: Collaboration
 * - REQ-COMM-003: Learning & Growth
 *
 * @module @equaltoai/greater-components/faces/artist/Community
 */

// CritiqueCircle compound component
export { CritiqueCircle, default as CritiqueCircleDefault } from './CritiqueCircle/index.js';
export {
	CRITIQUE_CIRCLE_CONTEXT_KEY,
	createCritiqueCircleContext,
	getCritiqueCircleContext,
	hasCritiqueCircleContext,
	canModerate,
	canSubmit,
	canCritique,
	canInvite as canInviteToCritiqueCircle,
	canRemoveMember,
	calculateEstimatedWaitTime,
	formatWaitTime,
	getMemberBadge,
	type CritiqueCircleContext,
	type CritiqueCircleConfig,
	type MembershipStatus,
	type SessionState,
	type QueueState,
} from './CritiqueCircle/context.js';

// Collaboration compound component
export { Collaboration, default as CollaborationDefault } from './Collaboration/index.js';
export {
	COLLABORATION_CONTEXT_KEY,
	createCollaborationContext,
	getCollaborationContext,
	hasCollaborationContext,
	canManage,
	canContribute,
	canUpload,
	canInviteMembers,
	getStatusBadge,
	calculateTotalSplit,
	isSplitValid,
	type CollaborationContext,
	type CollaborationConfig,
	type CollaborationRole,
	type SplitAgreement,
} from './Collaboration/context.js';

// MentorMatch component
export { default as MentorMatch } from './MentorMatch.svelte';
