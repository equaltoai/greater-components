export interface AgentFaceComposition {
	key: string;
	title: string;
	stitchAnchor: string;
	surfaceKind: 'workspace' | 'dashboard' | 'identity-shell' | 'inbox' | 'checkpoint';
	componentExport:
		| 'AgentGenesisWorkspace'
		| 'NexusDashboard'
		| 'IdentityNexus'
		| 'SoulRequestCenter'
		| 'GraduationApprovalThread';
	workflowPhases: readonly string[];
	componentFamilies: readonly string[];
	aggregateExports: readonly string[];
	layoutBoundaries: readonly string[];
}

export const AGENT_FACE_COMPOSITIONS = [
	{
		key: 'genesis-workspace',
		title: 'Genesis Workspace',
		stitchAnchor: 'Agent Genesis',
		surfaceKind: 'workspace',
		componentExport: 'AgentGenesisWorkspace',
		workflowPhases: ['request', 'review'],
		componentFamilies: ['RequestIntakeRail', 'ReviewQueuePanel', 'DecisionSummaryCard'],
		aggregateExports: [
			'@equaltoai/greater-components/faces/agent',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/notifications',
			'@equaltoai/greater-components/shared/messaging',
		],
		layoutBoundaries: [
			'left rail: intake queue',
			'center pane: active work item',
			'right rail: decision context',
		],
	},
	{
		key: 'nexus-dashboard',
		title: 'Nexus Dashboard',
		stitchAnchor: 'Nexus Dashboard',
		surfaceKind: 'dashboard',
		componentExport: 'NexusDashboard',
		workflowPhases: ['graduation', 'continuity'],
		componentFamilies: [
			'GraduationReadinessBoard',
			'OperationalSnapshotGrid',
			'ContinuityOwnerPanel',
		],
		aggregateExports: [
			'@equaltoai/greater-components/faces/agent',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/notifications',
		],
		layoutBoundaries: ['hero metrics band', 'readiness board', 'continuity follow-through rail'],
	},
	{
		key: 'identity-nexus',
		title: 'Identity Nexus',
		stitchAnchor: 'Identity Nexus',
		surfaceKind: 'identity-shell',
		componentExport: 'IdentityNexus',
		workflowPhases: ['declaration', 'continuity'],
		componentFamilies: ['IdentitySummaryPanel', 'DeclarationLedger', 'ReachabilityEvidenceRail'],
		aggregateExports: [
			'@equaltoai/greater-components/faces/agent',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/soul',
		],
		layoutBoundaries: [
			'identity summary header',
			'declaration ledger column',
			'reachability evidence rail',
		],
	},
	{
		key: 'soul-request-center',
		title: 'Soul Request Center',
		stitchAnchor: 'Notification Center: Soul Requests',
		surfaceKind: 'inbox',
		componentExport: 'SoulRequestCenter',
		workflowPhases: ['request', 'review'],
		componentFamilies: ['SoulRequestInbox', 'PriorityNotificationDigest', 'RouteFilterTabs'],
		aggregateExports: [
			'@equaltoai/greater-components/faces/agent',
			'@equaltoai/greater-components/shared/soul',
			'@equaltoai/greater-components/shared/notifications',
			'@equaltoai/greater-components/shared/agent',
		],
		layoutBoundaries: ['filter strip', 'notification list', 'triage context drawer'],
	},
	{
		key: 'graduation-approval-thread',
		title: 'Graduation Approval Thread',
		stitchAnchor: 'Direct Message: Graduation Approval',
		surfaceKind: 'checkpoint',
		componentExport: 'GraduationApprovalThread',
		workflowPhases: ['signing', 'graduation'],
		componentFamilies: [
			'ApprovalConversationThread',
			'SignerChecklistRail',
			'PromotionDecisionPanel',
		],
		aggregateExports: [
			'@equaltoai/greater-components/faces/agent',
			'@equaltoai/greater-components/shared/messaging',
			'@equaltoai/greater-components/shared/agent',
			'@equaltoai/greater-components/shared/chat',
		],
		layoutBoundaries: ['message transcript', 'signer checklist rail', 'promotion decision panel'],
	},
] as const satisfies readonly AgentFaceComposition[];

export function getAgentFaceComposition(key: AgentFaceComposition['key']): AgentFaceComposition {
	const composition = AGENT_FACE_COMPOSITIONS.find((candidate) => candidate.key === key);

	if (!composition) {
		throw new Error(`Unknown agent face composition: ${key}`);
	}

	return composition;
}
