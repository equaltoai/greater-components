import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { AgentGenesisWorkspace, GraduationApprovalThread } from '../src/index.js';
import type { AgentGenesisWorkspaceData, GraduationApprovalThreadData } from '../src/index.js';

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
	currentPhase: 'signing' as const,
	currentState: 'signing.awaiting_signoff' as const,
	steward: {
		id: 'steward-1',
		name: 'Archon Prime',
		role: 'Workflow steward',
	},
	tags: ['Genesis', 'Soulbound'],
};

describe('faces/agent signing compositions', () => {
	it('renders declaration and checkpoint surfaces inside the genesis workspace', () => {
		const data: AgentGenesisWorkspaceData = {
			brand: baseBrand,
			navItems: baseNav,
			hero: {
				eyebrow: 'Agent Genesis',
				title: 'Genesis Workspace',
				summary: 'Compose request intake, review focus, and conversation context in one shell.',
			},
			identity,
			requestQueue: [
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
				},
			],
			conversation: [
				{
					id: 'entry-1',
					role: 'assistant',
					label: 'Aurelius.eth',
					content: 'I have prepared the declaration packet and routed it toward signer review.',
				},
			],
			declaration: {
				id: 'declaration-1',
				title: 'Soul issuance declaration',
				statement: 'The workflow is ready for controlled graduation and monitored continuity.',
				confidence: 'Strong confidence',
				declaredScope: ['Issuance API', 'Signer workflow'],
			},
			checkpoint: {
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
			},
		};

		render(AgentGenesisWorkspace, {
			props: {
				data,
			},
		});

		expect(screen.getByText('Declaration lane')).toBeTruthy();
		expect(screen.getByText('Soul issuance declaration')).toBeTruthy();
		expect(screen.getByText('Awaiting final signature')).toBeTruthy();
	});

	it('renders the approval thread as a declaration-first signing surface', () => {
		const data: GraduationApprovalThreadData = {
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
					content: 'Please confirm the rollback memo before I sign off.',
					createdAt: '2026-03-28T12:30:00Z',
					read: true,
					workflowMoments: [
						{
							id: 'moment-1',
							kind: 'approval_request',
							title: 'Final signature requested',
							summary: 'The signer packet is complete and awaiting review.',
							phase: 'signing',
						},
					],
				},
			],
			declaration: {
				id: 'declaration-1',
				title: 'Soul issuance declaration',
				statement: 'The workflow is ready for controlled graduation and monitored continuity.',
				confidence: 'Strong confidence',
				declaredScope: ['Issuance API', 'Signer workflow', 'Rollback memo'],
			},
			checkpoint: {
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
					},
					{
						id: 'signer-2',
						name: 'Drone Lumina-4',
						role: 'Security steward',
						status: 'approved' as const,
					},
					{
						id: 'signer-3',
						name: 'Drone Sol-7',
						role: 'Operations steward',
						status: 'approved' as const,
					},
				],
			},
			graduation: {
				id: 'graduation-1',
				title: 'Launch readiness',
				readiness: 'watch' as const,
				summary: 'All core milestones are complete and one final approval remains.',
				nextStep: 'Collect the final signature and publish the launch memo.',
			},
		};

		render(GraduationApprovalThread, {
			props: {
				data,
			},
		});

		expect(screen.getByText('Approval digest')).toBeTruthy();
		expect(screen.getAllByText('2/3 approved').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Declaration packet').length).toBeGreaterThan(0);
		expect(screen.getByText('Signer checklist and approval memo')).toBeTruthy();
		expect(
			screen.getAllByText('Collect the final signature and publish the launch memo.').length
		).toBeGreaterThan(0);
	});
});
