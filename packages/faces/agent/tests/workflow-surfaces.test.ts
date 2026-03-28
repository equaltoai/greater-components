import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { AgentGenesisWorkspace, SoulRequestCenter } from '../src/index.js';
import type { AgentGenesisWorkspaceData, SoulRequestCenterData } from '../src/index.js';

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

describe('faces/agent workflow compositions', () => {
	it('renders genesis review digests and decision evidence', () => {
		const genesisData: AgentGenesisWorkspaceData = {
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
					routeDecision: 'review_for_graduation',
					artifacts: [
						{
							id: 'artifact-1',
							title: 'Declaration packet',
							description: 'Initial declaration and launch memo bundle.',
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
			],
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
					{
						id: 'finding-2',
						title: 'Rollback memo',
						detail: 'Attach the rollback memo before requesting the final approval.',
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
			conversation: [
				{
					id: 'entry-1',
					role: 'assistant',
					label: 'Aurelius.eth',
					content: 'I can prepare the declaration and route it to the signer queue.',
				},
			],
		};

		render(AgentGenesisWorkspace, {
			props: {
				data: genesisData,
			},
		});

		expect(screen.getByText('Queue depth')).toBeTruthy();
		expect(screen.getByText('2 requests awaiting review')).toBeTruthy();
		expect(screen.getAllByText('Route Review For Graduation').length).toBeGreaterThan(0);
		expect(screen.getByText('Review findings')).toBeTruthy();
		expect(screen.getAllByText('Policy diff').length).toBeGreaterThan(0);
	});

	it('groups workflow digests for the request center inbox', () => {
		const requestCenterData: SoulRequestCenterData = {
			brand: baseBrand,
			navItems: baseNav,
			hero: {
				eyebrow: 'Notification Center',
				title: 'Soul Request Center',
				summary:
					'Keep workflow events, request routing, and review snapshots visible in one inbox.',
			},
			notifications: [
				{
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
						summary: 'Signer review is ready for the graduation lane.',
						phase: 'signing',
						actorLabel: 'Drone Zephyr-2',
						targetLabel: 'Aurelius graduation',
						actionLabel: 'Route to signer queue',
					},
				},
				{
					id: 'notification-2',
					type: 'workflow_event' as const,
					createdAt: '2026-03-28T12:10:00Z',
					account: {
						id: 'account-2',
						username: 'lumina',
						acct: 'lumina',
						displayName: 'Drone Lumina-4',
						avatar: 'avatar.png',
						url: 'https://example.com/lumina',
						createdAt: '2026-03-20T00:00:00Z',
					},
					workflowEvent: {
						kind: 'approval_requested' as const,
						title: 'Approval requested',
						summary: 'Signer review is ready for the graduation lane.',
						phase: 'signing',
						actorLabel: 'Drone Lumina-4',
						targetLabel: 'Aurelius graduation',
						actionLabel: 'Route to signer queue',
					},
				},
				{
					id: 'notification-3',
					type: 'workflow_event' as const,
					createdAt: '2026-03-28T12:20:00Z',
					account: {
						id: 'account-3',
						username: 'sol',
						acct: 'sol',
						displayName: 'Drone Sol-7',
						avatar: 'avatar.png',
						url: 'https://example.com/sol',
						createdAt: '2026-03-20T00:00:00Z',
					},
					workflowEvent: {
						kind: 'review_requested' as const,
						title: 'Review requested',
						summary: 'The declaration evidence has reached the operator queue.',
						phase: 'review',
						actorLabel: 'Drone Sol-7',
						targetLabel: 'Fallback signer memo',
						actionLabel: 'Escalate to steward',
					},
				},
			],
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
					routeDecision: 'review_for_graduation',
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
			],
			focusRequest: {
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
			},
			reviewDecision: {
				id: 'review-1',
				title: 'Graduation readiness review',
				decision: 'queued' as const,
				reviewer: {
					id: 'reviewer-1',
					name: 'Drone Zephyr-2',
					role: 'Approver',
				},
				decisionSummary: 'The next approval window opens after signer validation.',
			},
		};

		render(SoulRequestCenter, {
			props: {
				data: requestCenterData,
			},
		});

		expect(screen.getByText('Approval requested (2)')).toBeTruthy();
		expect(
			screen.getAllByText('Signer review is ready for the graduation lane.').length
		).toBeGreaterThan(0);
		expect(screen.getAllByText('Route Review For Graduation').length).toBeGreaterThan(0);
	});
});
