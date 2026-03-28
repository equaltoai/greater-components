import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { IdentityNexus, NexusDashboard } from '../src/index.js';
import type { IdentityNexusData, NexusDashboardData } from '../src/index.js';

const baseBrand = {
	name: 'Celestial',
	editionLabel: 'Agent Genesis',
	environmentLabel: 'Staging orbit',
};

const baseNav = [
	{ id: 'agents', label: 'Agents', active: true },
	{ id: 'nexus', label: 'Nexus', badge: '3' },
];

const identity = {
	id: 'agent-1',
	name: 'Astra Voyager',
	handle: '@astravoyager',
	summary: 'Coordinates network health, attribution, and continuity after graduation.',
	currentPhase: 'continuity' as const,
	currentState: 'continuity.monitoring' as const,
	steward: {
		id: 'steward-1',
		name: 'Archon Prime',
		role: 'Workflow steward',
	},
	tags: ['Soulbound', 'Continuity'],
};

describe('faces/agent profile and continuity compositions', () => {
	it('renders active roster and continuity timeline on the dashboard', () => {
		const data: NexusDashboardData = {
			brand: baseBrand,
			navItems: baseNav,
			hero: {
				eyebrow: 'Nexus Dashboard',
				title: 'Nexus Dashboard',
				summary:
					'Keep launch readiness, continuity loops, and workflow activity in one operational view.',
			},
			identity,
			graduation: {
				id: 'graduation-1',
				title: 'Launch readiness',
				readiness: 'ready' as const,
				summary: 'All core milestones are complete and continuity ownership is active.',
				nextStep: 'Continue weekly evidence reviews while the next cohort transitions in.',
			},
			continuity: {
				id: 'continuity-1',
				title: 'Continuity loop',
				objective: 'Keep the launched workflow observable and stewarded after promotion.',
				owner: {
					id: 'owner-1',
					name: 'Lumina Proxy',
					role: 'Continuity owner',
				},
				feedbackLoop: 'Weekly evidence review and incident triage.',
				followUps: [
					{
						id: 'followup-1',
						title: 'Weekly evidence review',
						summary: 'Audit the launch packet and confirm the public proofs still align.',
						owner: {
							id: 'owner-1',
							name: 'Lumina Proxy',
							role: 'Continuity owner',
						},
						cadence: 'Weekly',
					},
				],
			},
			roster: [
				identity,
				{
					id: 'agent-2',
					name: 'Lumina Proxy',
					handle: '@luminaproxy',
					summary: 'Tracks data integrity and incident routing.',
					currentPhase: 'continuity' as const,
					currentState: 'continuity.monitoring' as const,
					metrics: [{ label: 'Sync', value: '99.8%' }],
				},
			],
			continuityMoments: [
				{
					id: 'moment-1',
					title: 'Weekly evidence review',
					summary: 'Audit the launch packet and confirm the public proofs still align.',
					meta: 'Lumina Proxy · Weekly',
					phase: 'continuity',
					tone: 'accent',
				},
			],
			workflowNotifications: [
				{
					id: 'notification-1',
					type: 'workflow_event' as const,
					createdAt: '2026-03-28T12:00:00Z',
					account: {
						id: 'account-1',
						username: 'lumina',
						acct: 'lumina',
						displayName: 'Lumina Proxy',
						avatar: 'avatar.png',
						url: 'https://example.com/lumina',
						createdAt: '2026-03-20T00:00:00Z',
					},
					workflowEvent: {
						kind: 'graduated' as const,
						title: 'Graduated',
						summary: 'Astra Voyager has entered the continuity lane.',
						phase: 'continuity',
					},
				},
			],
		};

		render(NexusDashboard, {
			props: {
				data,
			},
		});

		expect(screen.getByText('Active roster')).toBeTruthy();
		expect(screen.getAllByText('Lumina Proxy').length).toBeGreaterThan(0);
		expect(screen.getByText('Continuity timeline')).toBeTruthy();
		expect(screen.getAllByText('Weekly evidence review').length).toBeGreaterThan(0);
	});

	it('renders attribution changes and continuity moments in identity nexus', () => {
		const data: IdentityNexusData = {
			brand: baseBrand,
			navItems: baseNav,
			hero: {
				eyebrow: 'Identity Nexus',
				title: 'Identity Nexus',
				summary: 'Pair declaration state with reachability and continuity context.',
			},
			identity,
			declaration: {
				id: 'declaration-1',
				title: 'Soul issuance declaration',
				statement: 'The workflow is ready for controlled graduation and monitored continuity.',
				confidence: 'Strong confidence',
				declaredScope: ['Issuance API', 'Signer workflow'],
			},
			channels: {
				ens: { name: 'astra.eth' },
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
			attributions: [
				{
					id: 'attribution-1',
					title: 'Celestial core routing',
					summary:
						'Control moved from the local drone namespace into the permanent soulbound lane.',
					sourceLabel: 'Drone Astra-7',
					targetLabel: 'aura.eth',
					timestampLabel: 'Mar 28',
					tone: 'success',
				},
			],
			timeline: [
				{
					id: 'timeline-1',
					title: 'Monitoring window opened',
					summary: 'Continuity review began after the handoff to the Celestial core.',
					meta: 'Archon Prime · Daily',
					phase: 'continuity',
					tone: 'accent',
				},
			],
		};

		render(IdentityNexus, {
			props: {
				data,
			},
		});

		expect(screen.getByText('Attribution ledger')).toBeTruthy();
		expect(screen.getByText('Celestial core routing')).toBeTruthy();
		expect(screen.getByText('Continuity moments')).toBeTruthy();
		expect(screen.getByText('Monitoring window opened')).toBeTruthy();
	});
});
