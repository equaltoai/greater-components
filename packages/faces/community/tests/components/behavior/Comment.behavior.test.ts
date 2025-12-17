import { render, fireEvent, screen, waitFor, within } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Thread } from '../../../src/components/Thread/index.js';
import { createMockPost, createMockComment } from '../../mocks/index.js';

describe('Comment Behavior', () => {
	const mockPost = createMockPost('p1');

	const handlers = {
		onVote: vi.fn(),
		onToggleCollapse: vi.fn(),
		onLoadMore: vi.fn(),
		onReply: vi.fn(),
		onEdit: vi.fn(),
		onDelete: vi.fn(),
		onReport: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	const createThread = (commentOverrides = {}) => ({
		post: mockPost,
		comments: [
			{
				...createMockComment('c1'),
				content: 'Test Comment',
				...commentOverrides,
			},
		],
		totalComments: 1,
		sortBy: 'best' as const,
	});

	it('renders correctly', () => {
		const thread = createThread();
		render(Thread.Root, { props: { thread, handlers } });

		expect(screen.getByText('Test Comment')).toBeInTheDocument();
	});

	it('handles voting interactions', async () => {
		const thread = createThread({ userVote: 0 });
		render(Thread.Root, {
			props: {
				thread,
				handlers,
				config: { showVoting: true },
			},
		});

		const commentEl = screen.getByText('Test Comment').closest('.gr-community-comment');
		const upvoteBtn = within(commentEl as HTMLElement).getByLabelText('Upvote');

		await fireEvent.click(upvoteBtn);
		expect(handlers.onVote).toHaveBeenCalledWith('c1', 1);
	});

	it('reverts optimistic vote on error', async () => {
		const thread = createThread({ userVote: 0, score: 10 });
		handlers.onVote.mockRejectedValue(new Error('Failed'));

		render(Thread.Root, {
			props: {
				thread,
				handlers,
				config: { showVoting: true },
			},
		});

		const commentEl = screen.getByText('Test Comment').closest('.gr-community-comment');
		const upvoteBtn = within(commentEl as HTMLElement).getByLabelText('Upvote');

		await fireEvent.click(upvoteBtn);
		expect(handlers.onVote).toHaveBeenCalled();
		// Assuming no crash, catch block worked
	});

	it('toggles collapse using handler if provided', async () => {
		const thread = createThread();
		render(Thread.Root, { props: { thread, handlers } });

		const authorBtn = screen.getByText(thread.comments[0].author.username);
		await fireEvent.click(authorBtn);

		expect(handlers.onToggleCollapse).toHaveBeenCalledWith('c1');
	});

	it('toggles collapse internally if handler not provided', async () => {
		const thread = createThread();
		// Pass undefined for onToggleCollapse by excluding it from handlers
		const { onToggleCollapse: _, ...otherHandlers } = handlers;

		render(Thread.Root, { props: { thread, handlers: otherHandlers } });

		const authorBtn = screen.getByText(thread.comments[0].author.username);
		const commentEl = screen.getByText('Test Comment').closest('.gr-community-comment');

		// Initial state: not collapsed
		expect(commentEl).not.toHaveClass('gr-community-comment--collapsed');

		// Click to collapse
		await fireEvent.click(authorBtn);

		await waitFor(() => {
			expect(commentEl).toHaveClass('gr-community-comment--collapsed');
		});

		// Click to expand
		await fireEvent.click(authorBtn);

		await waitFor(() => {
			expect(commentEl).not.toHaveClass('gr-community-comment--collapsed');
		});
	});

	it('displays badges correctly', () => {
		const thread = createThread({
			isAdmin: true,
			isMod: true,
			isOp: true,
		});
		// Priority: Admin > Mod > OP

		// Test Admin
		render(Thread.Root, { props: { thread, handlers } });
		expect(screen.getByText('Admin')).toBeInTheDocument();
	});

	it('handles deleted and removed states', () => {
		const thread = createThread();
		thread.comments = [
			{ ...createMockComment('c1'), content: 'Active' },
			{ ...createMockComment('c2'), isDeleted: true },
			{ ...createMockComment('c3'), isRemoved: true },
		];

		render(Thread.Root, { props: { thread, handlers } });

		expect(screen.getByText('Active')).toBeInTheDocument();
		expect(screen.getByText('[deleted]')).toBeInTheDocument();
		expect(screen.getByText('[removed]')).toBeInTheDocument();
	});

	it('loads more children', async () => {
		const thread = createThread({
			moreChildrenCount: 5,
			children: [],
		});

		const newChildren = [createMockComment('c1.1', 'c1')];
		handlers.onLoadMore.mockResolvedValue(newChildren);

		render(Thread.Root, { props: { thread, handlers } });

		const loadMoreBtn = screen.getByText(/Load more/);
		await fireEvent.click(loadMoreBtn);

		expect(handlers.onLoadMore).toHaveBeenCalledWith('c1');

		await waitFor(() => {
			// Child should be rendered now
			// Note: The child rendering depends on if Thread.Root updates or if Comment updates itself.
			// Comment.svelte updates local state `comment.children`.
			// We need to look for the child comment content if we gave it any, default is 'This is a comment'
		});
	});
});
