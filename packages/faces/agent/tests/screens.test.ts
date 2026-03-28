import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import {
	AgentGenesisWorkspace,
	GraduationApprovalThread,
	IdentityNexus,
	NexusDashboard,
	SoulRequestCenter,
} from '../src/index.js';
import type {
	AgentGenesisWorkspaceData,
	GraduationApprovalThreadData,
	IdentityNexusData,
	NexusDashboardData,
	SoulRequestCenterData,
} from '../src/index.js';

const baseBrand = {
	name: 'Celestial',
	editionLabel: 'Agent Genesis',
	environmentLabel: 'Staging orbit',
};

const baseNav = [
	{ id: 'agents', label: 'Agents', active: true },
	{ id: 'requests', label: 'Requests', badge: '4' },
];

const identity = {
	id: 'agent-1',
	name: 'Aurelius.eth',
	handle: '@aurelius',
	summary: 'Coordinates review, declaration, and launch continuity for drone workflows.',
	currentPhase: 'review' as const,
	currentState: 'review.in_review' as const,
	steward: {
		id: 'steward-1',
		name: 'Archon Prime',
		role: 'Workflow steward',
	},
	tags: ['Genesis', 'Soulbound'],
};

const request = {
	id: 'request-1',
	title: 'Promote Alpha-9 to graduation review',
	summary: 'Bundle the declaration evidence and signer memo for controlled launch.',
	requestedBy: {
		id: 'alpha',
		name: 'Drone Alpha-9',
		role: 'Request owner',
	},
	currentState: 'request.submitted' as const,
};

const reviewDecision = {
	id: 'review-1',
	title: 'Graduation readiness review',
	decision: 'changes_requested' as const,
	reviewer: {
		id: 'reviewer-1',
		name: 'Drone Zephyr-2',
		role: 'Approver',
	},
	decisionSummary: 'One signer still needs to acknowledge the declaration packet.',
};

const declaration = {
	id: 'declaration-1',
	title: 'Soul issuance declaration',
	statement: 'The workflow is ready for controlled graduation and monitored continuity.',
	confidence: 'Strong confidence',
	declaredScope: ['Issuance API', 'Signer workflow'],
};

const checkpoint = {
	id: 'checkpoint-1',
	title: 'Graduation sign-off',
	readinessLabel: 'Awaiting final signature',
	signers: [
		{
			id: 'signer-1',
			name: 'Archon Prime',
			role: 'Final approver',
			status: 'pending' as const,
		},
	],
};

const graduation = {
	id: 'graduation-1',
	title: 'Launch readiness',
	readiness: 'watch' as const,
	summary: 'All core milestones are complete and one final approval remains.',
	nextStep: 'Collect the final signature and publish the launch memo.',
};

const continuity = {
	id: 'continuity-1',
	title: 'Continuity loop',
	objective: 'Keep the launched workflow observable and stewarded after promotion.',
	owner: {
		id: 'owner-1',
		name: 'Lumina-4',
		role: 'Continuity owner',
	},
	feedbackLoop: 'Weekly evidence review and incident triage.',
};

const workflowNotification = {
	id: 'notification-1',
	type: 'workflow_event' as const,
	createdAt: '2026-03-28T12:00:00Z',
	account: {
		id: 'account-1',
		username: 'zephyr',
		acct: 'zephyr',
		displayName: 'Drone Zephyr-2',
		avatar: 'avatar.png',
		url: 'https://example.com/zephyr',
		createdAt: '2026-03-20T00:00:00Z',
	},
	workflowEvent: {
		kind: 'approval_requested' as const,
		title: 'Approval requested',
		summary: 'The declaration is ready for signer review.',
		phase: 'signing',
	},
};

const genesisData: AgentGenesisWorkspaceData = {
	brand: baseBrand,
	navItems: baseNav,
	hero: {
		eyebrow: 'Agent Genesis',
		title: 'Genesis Workspace',
		summary: 'Compose request intake, review focus, and conversation context in one shell.',
	},
	identity,
	requestQueue: [request],
	activeRequest: request,
	reviewDecision,
	conversation: [
		{
			id: 'entry-1',
			role: 'assistant',
			label: 'Aurelius.eth',
			content: 'I can prepare the declaration and route it to the signer queue.',
		},
	],
};

const requestCenterData: SoulRequestCenterData = {
	brand: baseBrand,
	navItems: baseNav,
	hero: {
		eyebrow: 'Notification Center',
		title: 'Soul Request Center',
		summary: 'Keep workflow events, request routing, and review snapshots visible in one inbox.',
	},
	notifications: [workflowNotification],
	requestQueue: [request],
	focusRequest: request,
	reviewDecision,
};

const threadData: GraduationApprovalThreadData = {
	brand: baseBrand,
	navItems: baseNav,
	hero: {
		eyebrow: 'Graduation Approval',
		title: 'Graduation Approval Thread',
		summary: 'Bring declaration review, signer context, and launch readiness into one thread.',
	},
	threadSummary: {
		kind: 'approval',
		title: 'Aurelius graduation sign-off',
		state: 'open',
		phase: 'signing',
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
			content: 'Please confirm the rollback memo before I sign off.',
			createdAt: '2026-03-28T12:30:00Z',
			read: true,
		},
	],
	declaration,
	checkpoint,
	graduation,
};

const dashboardData: NexusDashboardData = {
	brand: baseBrand,
	navItems: baseNav,
	hero: {
		eyebrow: 'Nexus Dashboard',
		title: 'Nexus Dashboard',
		summary: 'Keep launch readiness, continuity loops, and workflow activity in one operational view.',
	},
	identity,
	graduation,
	continuity,
	workflowNotifications: [workflowNotification],
};

const identityData: IdentityNexusData = {
	brand: baseBrand,
	navItems: baseNav,
	hero: {
		eyebrow: 'Identity Nexus',
		title: 'Identity Nexus',
		summary: 'Pair declaration state with reachability and continuity context.',
	},
	identity,
	declaration,
	channels: {
		ens: { name: 'aurelius.eth' },
		email: {
			address: 'ops@example.com',
			verified: true,
			capabilities: ['inbound', 'reply'],
		},
	},
	preferences: {
		preferred: 'email',
		fallback: 'activitypub',
		inboundPriority: ['email', 'activitypub'],
		availability: {
			schedule: 'BUSINESS_HOURS',
			timezone: 'America/New_York',
			windows: null,
		},
	},
};

describe('faces/agent screens', () => {
	it('renders the genesis workspace shell', () => {
		render(AgentGenesisWorkspace, {
			props: {
				data: genesisData,
			},
		});

		expect(screen.getByRole('heading', { name: 'Genesis Workspace', level: 1 })).toBeTruthy();
		expect(screen.getAllByText('Promote Alpha-9 to graduation review').length).toBeGreaterThan(0);
	});

	it('renders the soul request center shell', () => {
		render(SoulRequestCenter, {
			props: {
				data: requestCenterData,
			},
		});

		expect(screen.getByRole('heading', { name: 'Soul Request Center', level: 1 })).toBeTruthy();
		expect(screen.getByText('Approval requested')).toBeTruthy();
	});

	it('renders the graduation approval thread shell', () => {
		render(GraduationApprovalThread, {
			props: {
				data: threadData,
			},
		});

		expect(
			screen.getByRole('heading', { name: 'Graduation Approval Thread', level: 1 })
		).toBeTruthy();
		expect(screen.getByText(/rollback memo/i)).toBeTruthy();
	});

	it('renders the nexus dashboard shell', () => {
		render(NexusDashboard, {
			props: {
				data: dashboardData,
			},
		});

		expect(screen.getByRole('heading', { name: 'Nexus Dashboard', level: 1 })).toBeTruthy();
		expect(screen.getByText('Launch readiness')).toBeTruthy();
	});

	it('renders the identity nexus shell', () => {
		render(IdentityNexus, {
			props: {
				data: identityData,
			},
		});

		expect(screen.getByRole('heading', { name: 'Identity Nexus', level: 1 })).toBeTruthy();
		expect(screen.getByText('Reachability ledger')).toBeTruthy();
	});
});
