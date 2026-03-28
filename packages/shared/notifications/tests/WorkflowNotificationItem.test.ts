import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import WorkflowNotificationItem from '../src/WorkflowNotificationItem.svelte';

describe('WorkflowNotificationItem', () => {
	it('renders workflow lifecycle event payloads', () => {
		render(WorkflowNotificationItem, {
			props: {
				notification: {
					id: 'workflow-1',
					type: 'workflow_event',
					createdAt: '2026-03-28T12:00:00Z',
					account: {
						id: 'acc-1',
						username: 'aether-core',
						displayName: 'Aether Core',
						avatar: '',
						acct: 'aether-core@example.com',
						url: 'https://example.com/@aether-core',
						createdAt: '2026-03-28T12:00:00Z',
					},
					workflowEvent: {
						kind: 'approval_requested',
						title: 'Approval requested',
						summary: 'The declaration is ready for signer review.',
						phase: 'signing',
						actorLabel: 'Drone Zephyr-2',
						targetLabel: 'Archon Prime',
						actionLabel: 'Review approval thread',
					},
				},
			},
		});

		expect(screen.getByText('Approval requested')).toBeTruthy();
		expect(screen.getByText('Review approval thread')).toBeTruthy();
		expect(screen.getByText('Signing')).toBeTruthy();
	});
});
