import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { Moderation } from '../../../src/components/Moderation/index.js';
import ModerationTestWrapper from '../../fixtures/ModerationTestWrapper.svelte';
import type { ModerationLogEntry } from '../../../src/types.js';

describe('Moderation.Log Behavior', () => {
	const mockLogs: ModerationLogEntry[] = [
		{
			id: 'log1',
			action: 'deleted',
			moderator: { id: 'm1', username: 'mod1' },
			target: { id: 'p1', title: 'Bad Post' },
			createdAt: new Date('2023-01-01T10:00:00Z').toISOString(),
			details: 'Violation of rules',
		},
		{
			id: 'log2',
			action: 'banned',
			moderator: { id: 'm2', username: 'mod2' },
			target: { id: 'u1', username: 'badUser' },
			createdAt: new Date('2023-01-02T10:00:00Z').toISOString(),
		},
		{
			id: 'log3',
			action: 'removed',
			moderator: { id: 'm1', username: 'mod1' },
			target: { content: 'Bad comment' },
			createdAt: '2023-01-03T10:00:00Z',
		},
		{
			id: 'log4',
			action: 'warned',
			moderator: { id: 'm3', username: 'mod3' },
			target: { id: 'unknown' }, // Fallback case
			createdAt: new Date('2023-01-04T10:00:00Z'),
		},
	];

	it('renders log entries correctly', () => {
		render(ModerationTestWrapper, {
			props: {
				component: Moderation.Log,
				log: mockLogs,
			},
		});

		expect(screen.getByText('deleted')).toBeInTheDocument();
		expect(screen.getAllByText('mod1')[0]).toBeInTheDocument();
		expect(screen.getByText('Post: Bad Post')).toBeInTheDocument();
		expect(screen.getByText('Violation of rules')).toBeInTheDocument();

		expect(screen.getByText('banned')).toBeInTheDocument();
		expect(screen.getByText('User: badUser')).toBeInTheDocument();

		expect(screen.getByText('removed')).toBeInTheDocument();
		expect(screen.getByText('Comment')).toBeInTheDocument();

		expect(screen.getByText('warned')).toBeInTheDocument();
		expect(screen.getByText('Target')).toBeInTheDocument();
	});

	it('renders empty state', () => {
		render(ModerationTestWrapper, {
			props: {
				component: Moderation.Log,
				log: [],
			},
		});

		expect(screen.getByText('No log entries.')).toBeInTheDocument();
	});

	it('handles Date objects and strings for timestamp', () => {
		render(ModerationTestWrapper, {
			props: {
				component: Moderation.Log,
				log: [
					{ ...mockLogs[1], createdAt: new Date('2023-01-01') }, // Date object
					{ ...mockLogs[2], createdAt: '2023-01-02' }, // String
				],
			},
		});

		// Just checking it renders without error and we have list items
		const items = screen.getAllByRole('listitem');
		expect(items.length).toBe(2);
	});
});
