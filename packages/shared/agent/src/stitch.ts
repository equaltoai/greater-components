import type { AgentPackageKey } from './boundaries.js';
import type { AgentWorkflowPhase } from './workflow.js';

export interface AgentStitchAnchorDefinition {
	key: string;
	stitchScreenTitle: string;
	workflowPhases: readonly AgentWorkflowPhase[];
	workflowSurface: string;
	componentFamilies: readonly string[];
	sharedPackages: readonly AgentPackageKey[];
	aggregateExports: readonly string[];
	notes: string;
}

export const AGENT_STITCH_ANCHOR_DEFINITIONS = [
	{
		key: 'agent-genesis',
		stitchScreenTitle: 'Agent Genesis',
		workflowPhases: ['request', 'review'],
		workflowSurface: 'genesis-workspace',
		componentFamilies: ['RequestIntakeRail', 'ReviewQueuePanel', 'DecisionSummaryCard'],
		sharedPackages: ['shared/agent', 'shared/notifications', 'shared/messaging', 'faces/agent'],
		aggregateExports: [
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/notifications',
			'@equaltoai/greater-components/shared/messaging',
			'@equaltoai/greater-components/faces/agent',
		],
		notes:
			'Primary agent-first workspace where new work enters, gets triaged, and moves into review.',
	},
	{
		key: 'nexus-dashboard',
		stitchScreenTitle: 'Nexus Dashboard',
		workflowPhases: ['graduation', 'continuity'],
		workflowSurface: 'continuity-dashboard',
		componentFamilies: [
			'GraduationReadinessBoard',
			'OperationalSnapshotGrid',
			'ContinuityOwnerPanel',
		],
		sharedPackages: ['shared/agent', 'shared/notifications', 'faces/agent'],
		aggregateExports: [
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/notifications',
			'@equaltoai/greater-components/faces/agent',
		],
		notes:
			'Dashboard shell for promotion readiness, post-launch visibility, and continuity follow-through.',
	},
	{
		key: 'identity-nexus',
		stitchScreenTitle: 'Identity Nexus',
		workflowPhases: ['declaration', 'continuity'],
		workflowSurface: 'identity-nexus',
		componentFamilies: ['IdentitySummaryPanel', 'DeclarationLedger', 'ReachabilityEvidenceRail'],
		sharedPackages: ['shared/agent', 'shared/soul', 'faces/agent'],
		aggregateExports: [
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/soul',
			'@equaltoai/greater-components/faces/agent',
		],
		notes:
			'Identity-focused shell where declarations and reachability evidence meet a reusable profile context.',
	},
	{
		key: 'soul-request-center',
		stitchScreenTitle: 'Notification Center: Soul Requests',
		workflowPhases: ['request', 'review'],
		workflowSurface: 'soul-request-center',
		componentFamilies: ['SoulRequestInbox', 'PriorityNotificationDigest', 'RouteFilterTabs'],
		sharedPackages: ['shared/soul', 'shared/notifications', 'shared/agent', 'faces/agent'],
		aggregateExports: [
			'@equaltoai/greater-components/shared/soul',
			'@equaltoai/greater-components/shared/notifications',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/faces/agent',
		],
		notes:
			'Async intake view that keeps soul-specific requests out of the main face shell until they are routed.',
	},
	{
		key: 'graduation-approval-thread',
		stitchScreenTitle: 'Direct Message: Graduation Approval',
		workflowPhases: ['signing', 'graduation'],
		workflowSurface: 'graduation-approval-thread',
		componentFamilies: [
			'ApprovalConversationThread',
			'SignerChecklistRail',
			'PromotionDecisionPanel',
		],
		sharedPackages: ['shared/messaging', 'shared/agent', 'shared/chat', 'faces/agent'],
		aggregateExports: [
			'@equaltoai/greater-components/shared/messaging',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/chat',
			'@equaltoai/greater-components/faces/agent',
		],
		notes: 'Conversation-first approval surface for graduation decisions and sign-off follow-up.',
	},
] as const satisfies readonly AgentStitchAnchorDefinition[];

export type AgentStitchAnchorKey = (typeof AGENT_STITCH_ANCHOR_DEFINITIONS)[number]['key'];

export function getAgentStitchAnchor(key: AgentStitchAnchorKey): AgentStitchAnchorDefinition {
	const anchor = AGENT_STITCH_ANCHOR_DEFINITIONS.find((candidate) => candidate.key === key);

	if (!anchor) {
		throw new Error(`Unknown Stitch anchor: ${key}`);
	}

	return anchor;
}
