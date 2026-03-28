import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import {
	AgentIdentityCard,
	AgentStateBadge,
	ContinuityPanel,
	DeclarationPreviewCard,
	GraduationSummaryCard,
	ReviewDecisionCard,
	SignatureCheckpointCard,
	SoulLifecycleRail,
	SoulRequestCard,
} from '../src/index.js';

describe('shared/agent surface components', () => {
	it('renders the identity card with stewardship and metrics', () => {
		render(AgentIdentityCard, {
			props: {
				identity: {
					id: 'agent-1',
					name: 'Aetherius',
					handle: '@aetherius',
					summary: 'Coordinates request intake, review, and graduation checkpoints.',
					currentPhase: 'review',
					currentState: 'review.in_review',
					steward: {
						id: 'owner-1',
						name: 'Aether Core',
						role: 'Workflow steward',
					},
					tags: ['Genesis', 'Soulbound'],
					metrics: [
						{ label: 'Requests', value: 18 },
						{ label: 'Approvals', value: '92%' },
					],
				},
			},
		});

		expect(screen.getByText('Aetherius')).toBeTruthy();
		expect(screen.getByText(/workflow steward/i)).toBeTruthy();
		expect(screen.getByText('Requests')).toBeTruthy();
	});

	it('formats workflow states in the badge export', () => {
		render(AgentStateBadge, {
			props: {
				state: 'graduation.ready',
			},
		});

		expect(screen.getByText('Ready')).toBeTruthy();
	});

	it('renders request constraints and artifacts for soul requests', () => {
		render(SoulRequestCard, {
			props: {
				request: {
					id: 'request-1',
					title: 'Prepare the new soul issuance flow',
					summary: 'Package the declaration and signer memo for downstream review.',
					requestedBy: {
						id: 'requester-1',
						name: 'Drone Alpha-9',
						role: 'Request owner',
					},
					constraints: ['Strict CSP host', 'Needs review by Monday'],
					artifacts: [
						{
							id: 'artifact-1',
							title: 'Declaration memo',
							description: 'Initial claim and supporting evidence bundle.',
						},
					],
					routeDecision: 'send-to-review',
				},
			},
		});

		expect(screen.getByText('Strict CSP host')).toBeTruthy();
		expect(screen.getByText('Declaration memo')).toBeTruthy();
	});

	it('renders lifecycle steps with workflow titles', () => {
		render(SoulLifecycleRail, {
			props: {
				currentPhase: 'signing',
				steps: [
					{ phase: 'request', status: 'complete' },
					{ phase: 'review', status: 'complete' },
					{ phase: 'signing', status: 'active' },
				],
			},
		});

		expect(screen.getByText('Request')).toBeTruthy();
		expect(screen.getByText('Signing')).toBeTruthy();
	});

	it('renders review findings and evidence', () => {
		render(ReviewDecisionCard, {
			props: {
				decision: {
					id: 'review-1',
					title: 'Graduation readiness review',
					decision: 'changes_requested',
					reviewer: {
						id: 'reviewer-1',
						name: 'Drone Zephyr-2',
						role: 'Approver',
					},
					decisionSummary: 'The evidence is strong, but signing coverage still needs one more approver.',
					findings: [
						{
							id: 'finding-1',
							title: 'Missing signer',
							detail: 'One final approver has not acknowledged the declaration.',
						},
					],
					evidence: [{ id: 'evidence-1', title: 'Review deck' }],
				},
			},
		});

		expect(screen.getByText('Missing signer')).toBeTruthy();
		expect(screen.getByText('Review deck')).toBeTruthy();
	});

	it('renders declaration scope and risks', () => {
		render(DeclarationPreviewCard, {
			props: {
				declaration: {
					id: 'declaration-1',
					title: 'Soul issuance declaration',
					statement: 'The workflow is ready for controlled graduation.',
					confidence: 'Strong confidence',
					declaredScope: ['Issuance API', 'Signer workflow'],
					risks: ['One fallback path remains manual'],
				},
			},
		});

		expect(screen.getByText('Issuance API')).toBeTruthy();
		expect(screen.getByText('One fallback path remains manual')).toBeTruthy();
	});

	it('renders signer checkpoint statuses', () => {
		render(SignatureCheckpointCard, {
			props: {
				checkpoint: {
					id: 'signing-1',
					title: 'Approval checkpoint',
					readinessLabel: 'Awaiting final signature',
					signers: [
						{
							id: 'signer-1',
							name: 'Archon Prime',
							role: 'Final approver',
							status: 'pending',
						},
					],
				},
			},
		});

		expect(screen.getByText('Archon Prime')).toBeTruthy();
		expect(screen.getByText('Pending')).toBeTruthy();
	});

	it('renders continuity loops and ownership', () => {
		render(ContinuityPanel, {
			props: {
				panel: {
					id: 'continuity-1',
					title: 'Operational continuity',
					objective: 'Keep downstream agents aligned after launch.',
					owner: {
						id: 'owner-1',
						name: 'Lumina-4',
						role: 'Continuity owner',
					},
					feedbackLoop: 'Weekly learning review plus runtime incident triage.',
					followUps: [
						{
							id: 'follow-up-1',
							title: 'Quarterly evidence refresh',
							summary: 'Refresh declaration artifacts and note exceptions.',
							owner: {
								id: 'owner-2',
								name: 'Scout Delta',
								role: 'Operations',
							},
						},
					],
				},
			},
		});

		expect(screen.getByText('Quarterly evidence refresh')).toBeTruthy();
		expect(screen.getByText(/continuity owner/i)).toBeTruthy();
	});

	it('renders graduation milestones and next step', () => {
		render(GraduationSummaryCard, {
			props: {
				summary: {
					id: 'graduation-1',
					title: 'Soul graduation',
					readiness: 'ready',
					summary: 'All review and signing requirements are satisfied for launch.',
					completedMilestones: ['Declaration attested', 'Approvals collected'],
					exitCriteria: ['Launch memo published'],
					nextStep: 'Promote the workflow to the graduation dashboard.',
				},
			},
		});

		expect(screen.getByText('Approvals collected')).toBeTruthy();
		expect(screen.getByText('Promote the workflow to the graduation dashboard.')).toBeTruthy();
	});
});
