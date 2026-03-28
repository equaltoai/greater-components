import type {
	AgentGenesisWorkspaceData,
	GraduationApprovalThreadData,
	IdentityNexusData,
	NexusDashboardData,
	SoulRequestCenterData,
} from '@equaltoai/greater-components/faces/agent';

export type AgentFaceDemoKey =
	| 'genesis-workspace'
	| 'soul-request-center'
	| 'graduation-approval-thread'
	| 'nexus-dashboard'
	| 'identity-nexus';

export type AgentFaceDemoData =
	| AgentGenesisWorkspaceData
	| SoulRequestCenterData
	| GraduationApprovalThreadData
	| NexusDashboardData
	| IdentityNexusData;

export interface AgentFaceDemoScreen<TData extends AgentFaceDemoData = AgentFaceDemoData> {
	label: string;
	summary: string;
	data: TData;
}

const brand = {
	name: 'Celestial',
	editionLabel: 'Drones Preview',
	environmentLabel: 'Staging orbit',
	supportLabel: 'Host-owned route shell',
};

const navItems = [
	{ id: 'genesis', label: 'Genesis', active: true },
	{ id: 'requests', label: 'Requests', badge: '4' },
	{ id: 'nexus', label: 'Nexus', badge: '2' },
	{ id: 'identity', label: 'Identity' },
];

const identity = {
	id: 'agent-aurelius',
	name: 'Aurelius.eth',
	handle: '@aurelius',
	summary: 'Coordinates review, declaration, launch readiness, and continuity after promotion.',
	currentPhase: 'continuity' as const,
	currentState: 'continuity.monitoring' as const,
	steward: {
		id: 'steward-1',
		name: 'Archon Prime',
		role: 'Workflow steward',
	},
	tags: ['Soulbound', 'Continuity'],
	metrics: [
		{ label: 'Reach', value: '2.4M nodes' },
		{ label: 'Protocol', value: 'v1.2.4' },
	],
};

const declaration = {
	id: 'declaration-1',
	title: 'Soul issuance declaration',
	statement:
		'The workflow is ready for controlled graduation and monitored continuity under the Celestial protocol.',
	confidence: 'Strong confidence',
	owner: {
		id: 'owner-1',
		name: 'Aurelius.eth',
		role: 'Issuance steward',
	},
	declaredScope: ['Issuance API', 'Signer workflow', 'Rollback memo'],
	risks: ['Rollback memo must remain attached to the final launch packet.'],
	supportingArtifacts: [
		{
			id: 'artifact-1',
			title: 'Rollback memo',
			description: 'Signed rollback plan for the final promotion window.',
		},
		{
			id: 'artifact-2',
			title: 'Continuity owner matrix',
			description: 'Escalation routing for the first two monitoring cycles.',
		},
	],
};

const checkpoint = {
	id: 'checkpoint-1',
	title: 'Graduation sign-off',
	readinessLabel: 'Awaiting final signature',
	approvalMemo: 'Final approver is waiting on the rollback memo attachment.',
	signers: [
		{
			id: 'signer-1',
			name: 'Archon Prime',
			role: 'Final approver',
			status: 'pending' as const,
			note: 'Waiting on the rollback memo attachment.',
		},
		{
			id: 'signer-2',
			name: 'Lumina Proxy',
			role: 'Security steward',
			status: 'approved' as const,
		},
		{
			id: 'signer-3',
			name: 'Sol Archive',
			role: 'Operations steward',
			status: 'approved' as const,
		},
	],
};

const graduation = {
	id: 'graduation-1',
	title: 'Launch readiness',
	readiness: 'watch' as const,
	summary: 'All core milestones are complete and one final approval remains before launch.',
	launchOwner: {
		id: 'owner-2',
		name: 'Lumina Proxy',
		role: 'Launch owner',
	},
	completedMilestones: ['Declaration packet prepared', 'Continuity owner assigned'],
	exitCriteria: ['Final approver signs the graduation packet', 'Launch memo published'],
	nextStep: 'Collect the final signature and publish the launch memo.',
	metrics: [
		{ label: 'Approvals', value: '2/3' },
		{ label: 'Observability', value: 'Live' },
	],
};

const continuity = {
	id: 'continuity-1',
	title: 'Continuity loop',
	objective: 'Keep the launched workflow observable, attributable, and stewarded after promotion.',
	owner: {
		id: 'owner-3',
		name: 'Lumina Proxy',
		role: 'Continuity owner',
	},
	feedbackLoop: 'Weekly evidence review and incident triage.',
	metrics: [
		{ label: 'Sync', value: '99.8%' },
		{ label: 'Latency', value: '1.2s' },
	],
	followUps: [
		{
			id: 'followup-1',
			title: 'Weekly evidence review',
			summary: 'Audit public proofs and compare them against the launch packet.',
			owner: {
				id: 'owner-3',
				name: 'Lumina Proxy',
				role: 'Continuity owner',
			},
			cadence: 'Weekly',
		},
	],
};

function workflowNotification(
	id: string,
	accountId: string,
	displayName: string,
	workflowEvent: {
		kind: 'review_requested' | 'approval_requested' | 'graduated';
		title: string;
		summary: string;
		phase: string;
		actorLabel?: string;
		targetLabel?: string;
		actionLabel?: string;
	}
) {
	return {
		id,
		type: 'workflow_event' as const,
		createdAt: '2026-03-28T12:00:00Z',
		account: {
			id: accountId,
			username: displayName.toLowerCase().replaceAll(' ', '-'),
			acct: displayName.toLowerCase().replaceAll(' ', '-'),
			displayName,
			avatar: 'avatar.png',
			url: `https://example.com/${accountId}`,
			createdAt: '2026-03-20T00:00:00Z',
		},
		workflowEvent,
	};
}

const requestQueue = [
	{
		id: 'request-1',
		title: 'Promote Alpha-9 to graduation review',
		summary: 'Bundle the declaration evidence and signer memo for controlled launch.',
		requestedBy: {
			id: 'alpha',
			name: 'Drone Alpha-9',
			role: 'Request owner',
		},
		currentState: 'request.submitted' as const,
		routeDecision: 'review_for_graduation',
		artifacts: [
			{
				id: 'request-artifact-1',
				title: 'Declaration packet',
				description: 'Initial issuance packet and launch memo bundle.',
			},
		],
	},
	{
		id: 'request-2',
		title: 'Verify signer fallback coverage',
		summary: 'Confirm all fallback stewards are present before launch.',
		requestedBy: {
			id: 'beta',
			name: 'Drone Beta-4',
			role: 'Request owner',
		},
		currentState: 'review.requested' as const,
		routeDecision: 'signer_validation',
	},
];

export const agentFaceDemoScreens = {
	'genesis-workspace': {
		label: 'Genesis Workspace',
		summary: 'Request intake, declaration prep, and signer readiness in one agent-first route.',
		data: {
			brand,
			navItems,
			hero: {
				eyebrow: 'Agent Genesis',
				title: 'Genesis Workspace',
				summary:
					'Compose request intake, declaration drafting, and review focus without rebuilding the face locally.',
			},
			actions: [
				{ label: 'Draft declaration', tone: 'primary' as const, detail: 'Host-owned action' },
				{ label: 'Open signer queue', tone: 'secondary' as const },
			],
			statusChips: [
				{ label: 'Identity synthesis', detail: 'Soulbound candidate', tone: 'accent' as const },
				{ label: 'ENS recertification', detail: 'In progress', tone: 'warning' as const },
			],
			identity,
			requestQueue,
			activeRequest: requestQueue[0],
			reviewDecision: {
				id: 'review-1',
				title: 'Graduation readiness review',
				decision: 'changes_requested' as const,
				reviewer: {
					id: 'reviewer-1',
					name: 'Drone Zephyr-2',
					role: 'Approver',
				},
				decisionSummary: 'One signer still needs to acknowledge the declaration packet.',
				findings: [
					{
						id: 'finding-1',
						title: 'Policy diff',
						detail: 'Fallback signer coverage is still missing for one launch lane.',
					},
				],
				evidence: [
					{
						id: 'evidence-1',
						title: 'Signer packet',
						description: 'Current packet awaiting the final approver.',
					},
				],
			},
			declaration,
			checkpoint,
			conversation: [
				{
					id: 'entry-1',
					role: 'assistant' as const,
					label: 'Aurelius.eth',
					content:
						'Before the horizon clears, I must understand the essence of your intent and route it through the declaration lane.',
				},
				{
					id: 'entry-2',
					role: 'user' as const,
					label: 'Archon Prime',
					content:
						'Prepare the declaration packet, keep the rollback memo attached, and advance the signer checklist when ready.',
				},
			],
			focusNotes: [
				{
					id: 'note-1',
					title: 'Primary directive',
					summary: 'Keep the launch memo and rollback memo attached through final approval.',
					meta: 'Pinned by Archon Prime',
					tone: 'accent' as const,
				},
			],
		} satisfies AgentGenesisWorkspaceData,
	},
	'soul-request-center': {
		label: 'Soul Request Center',
		summary:
			'Grouped workflow notifications, review routing, and triage focus for the request inbox.',
		data: {
			brand,
			navItems,
			hero: {
				eyebrow: 'Notification Center',
				title: 'Soul Request Center',
				summary:
					'Keep workflow events, request routing, and review snapshots visible in one inbox surface.',
			},
			filters: [
				{ id: 'urgent', label: 'Urgent', count: 1, active: true },
				{ id: 'graduation', label: 'Graduation', count: 3 },
				{ id: 'system', label: 'System', count: 1 },
			],
			notifications: [
				workflowNotification('notification-1', 'lumina', 'Lumina Proxy', {
					kind: 'approval_requested',
					title: 'Approval requested',
					summary: 'Signer review is ready for the graduation lane.',
					phase: 'signing',
					actorLabel: 'Lumina Proxy',
					targetLabel: 'Aurelius graduation',
					actionLabel: 'Route to signer queue',
				}),
				workflowNotification('notification-2', 'sol', 'Sol Archive', {
					kind: 'approval_requested',
					title: 'Approval requested',
					summary: 'Signer review is ready for the graduation lane.',
					phase: 'signing',
					actorLabel: 'Sol Archive',
					targetLabel: 'Aurelius graduation',
					actionLabel: 'Route to signer queue',
				}),
				workflowNotification('notification-3', 'zephyr', 'Zephyr Review', {
					kind: 'review_requested',
					title: 'Review requested',
					summary: 'The declaration evidence has reached the operator queue.',
					phase: 'review',
					actorLabel: 'Zephyr Review',
					targetLabel: 'Fallback signer memo',
					actionLabel: 'Escalate to steward',
				}),
			],
			requestQueue,
			focusRequest: requestQueue[0],
			reviewDecision: {
				id: 'review-2',
				title: 'Graduation readiness review',
				decision: 'queued' as const,
				reviewer: {
					id: 'reviewer-2',
					name: 'Drone Zephyr-2',
					role: 'Approver',
				},
				decisionSummary: 'The next approval window opens after signer validation.',
			},
			callouts: [
				{
					id: 'callout-1',
					title: 'Horizon insight',
					summary: 'Multiple approval requests are grouped into one digest for faster triage.',
					tone: 'accent' as const,
				},
			],
		} satisfies SoulRequestCenterData,
	},
	'graduation-approval-thread': {
		label: 'Graduation Approval Thread',
		summary: 'Conversation-first declaration review with signer readiness and promotion context.',
		data: {
			brand,
			navItems,
			hero: {
				eyebrow: 'Graduation Approval',
				title: 'Graduation Approval Thread',
				summary: 'Bring declaration review, signer context, and launch readiness into one thread.',
			},
			threadSummary: {
				kind: 'approval' as const,
				title: 'Aurelius graduation sign-off',
				state: 'open' as const,
				phase: 'signing',
				dueLabel: 'Due Mar 31',
				summary: 'Signer review is open while the final approval memo is gathered.',
			},
			messages: [
				{
					id: 'message-1',
					conversationId: 'conversation-1',
					sender: {
						id: 'reviewer-1',
						username: 'archon',
						displayName: 'Archon Prime',
					},
					content:
						'Please confirm the rollback memo before I sign off. The declaration packet looks ready otherwise.',
					createdAt: '2026-03-28T12:30:00Z',
					read: true,
					workflowMoments: [
						{
							id: 'moment-1',
							kind: 'approval_request' as const,
							title: 'Final signature requested',
							summary: 'The signer packet is complete and awaiting review.',
							phase: 'signing',
						},
					],
				},
				{
					id: 'message-2',
					conversationId: 'conversation-1',
					sender: {
						id: 'owner-1',
						username: 'aurelius',
						displayName: 'Aurelius.eth',
					},
					content:
						'Rollback memo attached. I am ready to advance the launch memo once you confirm.',
					createdAt: '2026-03-28T12:45:00Z',
					read: true,
				},
			],
			declaration,
			checkpoint,
			graduation,
			callouts: [
				{
					id: 'callout-2',
					title: 'Launch guidance',
					summary:
						'Publishing the launch memo is host-owned even when the face owns the signing surface.',
					tone: 'warning' as const,
				},
			],
		} satisfies GraduationApprovalThreadData,
	},
	'nexus-dashboard': {
		label: 'Nexus Dashboard',
		summary: 'Operational roster, graduation readiness, and continuity timeline for active agents.',
		data: {
			brand,
			navItems,
			hero: {
				eyebrow: 'Nexus Dashboard',
				title: 'Nexus Dashboard',
				summary:
					'Manage autonomous agents, monitor protocol health, and expand reach across the activity horizon.',
			},
			actions: [{ label: 'Deploy new agent', tone: 'primary' as const }],
			metrics: [
				{
					id: 'metric-1',
					label: 'Network reach',
					value: '2.4M',
					detail: 'Nodes',
					tone: 'accent' as const,
				},
				{
					id: 'metric-2',
					label: 'Active sync',
					value: '99.8%',
					detail: 'Live',
					tone: 'success' as const,
				},
				{
					id: 'metric-3',
					label: 'Protocol',
					value: 'v1.2.4',
					detail: 'Current',
					tone: 'neutral' as const,
				},
			],
			identity,
			graduation,
			continuity,
			roster: [
				identity,
				{
					id: 'agent-lumina',
					name: 'Lumina Proxy',
					handle: '@luminaproxy',
					summary: 'Tracks data integrity and incident routing for the continuity lane.',
					currentPhase: 'continuity' as const,
					currentState: 'continuity.monitoring' as const,
					metrics: [{ label: 'Integrity', value: '62%' }],
				},
				{
					id: 'agent-sol',
					name: 'Sol Archive',
					handle: '@solarchive',
					summary: 'Manages storage health and historical proofs.',
					currentPhase: 'continuity' as const,
					currentState: 'continuity.monitoring' as const,
					metrics: [{ label: 'Storage load', value: '12%' }],
				},
			],
			continuityMoments: [
				{
					id: 'continuity-moment-1',
					title: 'Weekly evidence review',
					summary: 'Audit public proofs and compare them against the launch packet.',
					meta: 'Lumina Proxy · Weekly',
					phase: 'continuity',
					tone: 'accent' as const,
				},
			],
			workflowNotifications: [
				workflowNotification('notification-4', 'lumina', 'Lumina Proxy', {
					kind: 'graduated',
					title: 'Graduated',
					summary: 'Aurelius has entered the continuity lane.',
					phase: 'continuity',
					actorLabel: 'Lumina Proxy',
				}),
			],
			callouts: [
				{
					id: 'callout-3',
					title: 'Expansion protocols',
					summary:
						'Scale the agent fleet with autonomous MCP integration and activity-driven optimization.',
					tone: 'accent' as const,
				},
				{
					id: 'callout-4',
					title: 'Smart sourcing',
					summary: 'Agents automatically discover new data pools across the decentralized sea.',
					tone: 'success' as const,
				},
			],
		} satisfies NexusDashboardData,
	},
	'identity-nexus': {
		label: 'Identity Nexus',
		summary:
			'Identity ledger, attribution changes, channels, and continuity moments for the permanent soulbound lane.',
		data: {
			brand,
			navItems,
			hero: {
				eyebrow: 'Identity Nexus',
				title: 'Identity Nexus',
				summary:
					'Orchestrate the digital essence, manage the transition into the celestial identity ledger, and keep attribution visible.',
			},
			identity,
			declaration,
			channels: {
				ens: { name: 'aura.eth', chain: 'mainnet' },
				email: {
					address: 'ops@example.com',
					verified: true,
					capabilities: ['receive', 'send'],
				},
				phone: null,
			},
			preferences: {
				preferred: 'email',
				fallback: 'activitypub',
				availability: {
					schedule: 'business-hours',
					timezone: 'America/New_York',
					windows: null,
				},
				responseExpectation: {
					target: 'Reply within one business day',
					guarantee: 'best-effort',
				},
				languages: ['en-US'],
			},
			continuity,
			attributions: [
				{
					id: 'attribution-1',
					title: 'Celestial core routing',
					summary:
						'Control moved from the local drone namespace into the permanent soulbound lane.',
					sourceLabel: 'Drone Astra-7',
					targetLabel: 'aura.eth',
					timestampLabel: 'Mar 28',
					tone: 'success' as const,
				},
			],
			timeline: [
				{
					id: 'timeline-1',
					title: 'Monitoring window opened',
					summary: 'Continuity review began after the handoff to the Celestial core.',
					meta: 'Archon Prime · Daily',
					phase: 'continuity',
					tone: 'accent' as const,
				},
			],
			evidence: [
				{
					id: 'evidence-identity-1',
					title: 'Credential vault',
					description: 'Host-owned secrets and revocation metadata remain outside the face.',
				},
			],
			callouts: [
				{
					id: 'callout-5',
					title: 'Identity note',
					summary:
						'Hosts own wallet, ENS, and transport integrations while the face owns the ledger composition.',
					tone: 'warning' as const,
				},
			],
		} satisfies IdentityNexusData,
	},
} satisfies Record<AgentFaceDemoKey, AgentFaceDemoScreen>;
