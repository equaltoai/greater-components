import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import WorkflowMoment from '../src/ChatWorkflowMoment.svelte';
import WorkflowMetadata from '../src/ChatWorkflowMetadata.svelte';

describe('Chat workflow renderers', () => {
	it('renders artifact card moments with facts and links', () => {
		render(WorkflowMoment, {
			props: {
				moment: {
					id: 'artifact-1',
					kind: 'artifact',
					title: 'Declaration bundle',
					summary: 'Evidence collected for the current request.',
					facts: ['2 artifacts attached', 'Confidence memo included'],
					href: 'https://example.com/artifact',
				},
			},
		});

		expect(screen.getByText('Declaration bundle')).toBeTruthy();
		expect(screen.getByText('2 artifacts attached')).toBeTruthy();
		expect(screen.getByRole('link', { name: 'Open attachment' })).toHaveAttribute(
			'href',
			'https://example.com/artifact'
		);
	});

	it('does not render artifact links with unsafe URL schemes', () => {
		render(WorkflowMoment, {
			props: {
				moment: {
					id: 'artifact-unsafe',
					kind: 'artifact',
					title: 'Unsafe artifact',
					href: 'javascript:alert(1)',
				},
			},
		});

		expect(screen.getByText('Unsafe artifact')).toBeTruthy();
		expect(screen.queryByRole('link', { name: 'Open attachment' })).not.toBeInTheDocument();
	});

	it('renders checkpoint banner moments with structured status', () => {
		render(WorkflowMoment, {
			props: {
				moment: {
					id: 'checkpoint-1',
					kind: 'checkpoint',
					title: 'Review ready',
					status: 'ready',
					detail: 'All declaration artifacts are attached and awaiting review.',
				},
			},
		});

		expect(screen.getByText('Review ready')).toBeTruthy();
		expect(screen.getByText('Ready')).toBeTruthy();
	});

	it('renders action-request moments with assignee and due label', () => {
		render(WorkflowMoment, {
			props: {
				moment: {
					id: 'action-1',
					kind: 'action-request',
					title: 'Request final approval',
					actionLabel: 'Request approval',
					assignee: 'Archon Prime',
					dueLabel: 'Today',
				},
			},
		});

		expect(screen.getByText('Archon Prime')).toBeTruthy();
		expect(screen.getByText('Request approval')).toBeTruthy();
	});

	it('renders declaration, approval, and finalize metadata blocks', () => {
		const { rerender } = render(WorkflowMetadata, {
			props: {
				metadata: {
					kind: 'declaration',
					statement: 'The workflow is ready for controlled rollout.',
					confidence: 'Strong confidence',
					scope: ['Signer path', 'Notification flow'],
				},
			},
		});

		expect(screen.getByText('The workflow is ready for controlled rollout.')).toBeTruthy();
		expect(screen.getByText('Signer path')).toBeTruthy();

		rerender({
			metadata: {
				kind: 'approval',
				reviewer: 'Drone Zephyr-2',
				outcome: 'changes_requested',
				note: 'One additional signer confirmation is still missing.',
			},
		});

		expect(screen.getByText(/changes requested/i)).toBeTruthy();
		expect(screen.getByText('One additional signer confirmation is still missing.')).toBeTruthy();

		rerender({
			metadata: {
				kind: 'finalize',
				readiness: 'ready',
				nextStep: 'Promote to the graduation checkpoint.',
				outputs: ['Launch memo', 'Runtime watch list'],
			},
		});

		expect(screen.getByText('Promote to the graduation checkpoint.')).toBeTruthy();
		expect(screen.getByText('Launch memo')).toBeTruthy();
	});
});
