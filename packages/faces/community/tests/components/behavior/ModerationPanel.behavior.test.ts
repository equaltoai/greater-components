import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Moderation } from '../../../src/components/Moderation/index.js';
import ModerationTestWrapper from '../../fixtures/ModerationTestWrapper.svelte';
import type { ModerationQueueItem, ModerationLogEntry } from '../../../src/types.js';

describe('Moderation Panel Behavior', () => {
	const mockQueueItem: ModerationQueueItem = {
		id: 'item-1',
		type: 'post',
		content: {
			id: 'p1',
			title: 'Reported Post',
			type: 'text',
			author: { id: 'u1', username: 'user1' },
			community: { id: 'c1', name: 'test', title: 'Test' },
			score: 1,
			upvoteRatio: 1,
			commentCount: 0,
			createdAt: new Date().toISOString(),
		},
		reports: [{ reason: 'Spam', createdAt: new Date() }],
		queue: 'modqueue',
		queuedAt: new Date(),
	};

	const mockLogEntry: ModerationLogEntry = {
		id: 'log-1',
		action: 'remove',
		moderator: { id: 'm1', username: 'mod1' },
		target: { id: 'p1', username: 'user1' } as any,
		createdAt: new Date(),
	};

	const handlers = {
		onFetchQueue: vi.fn(),
		onFetchLog: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders without errors', () => {
		render(ModerationTestWrapper, {
			props: {
				handlers,
				queue: [mockQueueItem],
				component: Moderation.Panel,
			},
		});

		expect(screen.getByRole('heading', { name: 'Moderation' })).toBeTruthy();
		expect(screen.getByRole('tab', { name: 'Modqueue' })).toBeTruthy();
	});

	it('switches tabs and fetches data', async () => {
		handlers.onFetchQueue.mockResolvedValue([mockQueueItem]);
		handlers.onFetchLog.mockResolvedValue([mockLogEntry]);

		render(ModerationTestWrapper, {
			props: {
				handlers,
				component: Moderation.Panel,
			},
		});

		// Switch to Log tab
		const logTab = screen.getByRole('tab', { name: 'Log' });
		await fireEvent.click(logTab);

		expect(handlers.onFetchLog).toHaveBeenCalled();
		expect(screen.getByRole('tab', { name: 'Log' })).toHaveAttribute('aria-selected', 'true');

		// Switch back to Modqueue tab
		const queueTab = screen.getByRole('tab', { name: 'Modqueue' });
		await fireEvent.click(queueTab);

		expect(handlers.onFetchQueue).toHaveBeenCalledWith('modqueue');
	});

	it('refreshes current tab data when refresh button is clicked', async () => {
		handlers.onFetchQueue.mockResolvedValue([mockQueueItem]);

		render(ModerationTestWrapper, {
			props: {
				handlers,
				component: Moderation.Panel,
			},
		});

		const refreshBtn = screen.getByText('Refresh');
		await fireEvent.click(refreshBtn);

		expect(handlers.onFetchQueue).toHaveBeenCalledWith('modqueue');
	});

	it('displays error message when fetch fails', async () => {
		handlers.onFetchQueue.mockRejectedValue(new Error('Network error'));

		render(ModerationTestWrapper, {
			props: {
				handlers,
				component: Moderation.Panel,
			},
		});

		const refreshBtn = screen.getByText('Refresh');
		await fireEvent.click(refreshBtn);

		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent('Network error');
		});
	});

	it('loads initial data automatically if empty', async () => {
		handlers.onFetchQueue.mockResolvedValue([mockQueueItem]);

		render(ModerationTestWrapper, {
			props: {
				handlers,
				queue: [], // Empty initial queue
				component: Moderation.Panel,
			},
		});

		// Effect should trigger loadQueue
		await waitFor(() => {
			expect(handlers.onFetchQueue).toHaveBeenCalledWith('modqueue');
		});
	});
});
