import { render, fireEvent, screen, within } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Thread } from '../../src/components/Thread/index.js';
import { createMockPost, createMockComment } from '../mocks/index.js';

describe('Integration: Comment Thread Flow', () => {
	const mockThread = {
		post: createMockPost('p1'),
		comments: [
			{
				...createMockComment('c1'),
				content: 'Root Comment',
				children: [{ ...createMockComment('c2', 'c1', 1), content: 'Reply 1' }],
			},
		],
		totalComments: 2,
		sortBy: 'best' as const,
	};

	const handlers = {
		onVote: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders nested comments and allows voting', async () => {
		render(Thread.Root, {
			props: {
				thread: mockThread,
				handlers,
			},
		});

		// 1. Verify Structure
		expect(screen.getByText('Root Comment')).toBeInTheDocument();
		expect(screen.getByText('Reply 1')).toBeInTheDocument();

		// 2. Vote on Root Comment
		const rootComment = screen.getByText('Root Comment').closest('.gr-community-comment');
		if (!rootComment) throw new Error('Root comment not found');

		const header = rootComment.querySelector('.gr-community-comment__header');
		if (!header) throw new Error('Header not found');

		const upvoteBtn = within(header as HTMLElement).getByLabelText('Upvote');

		await fireEvent.click(upvoteBtn);
		expect(handlers.onVote).toHaveBeenCalledWith('c1', 1);
	});
});
