import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModerationTestWrapper from '../fixtures/ModerationTestWrapper.svelte';
import { Moderation } from '../../src/components/Moderation/index.js';
import { createMockPost } from '../mocks/mockPost.js';

describe('Integration: Moderation Workflow', () => {
	const mockItems = [
		{
			id: 'item-1',
			type: 'post' as const,
			content: createMockPost('1', { title: 'Spam Post' }),
			reports: [{ reason: 'Spam', createdAt: new Date() }],
			queue: 'modqueue' as const,
			queuedAt: new Date(),
		},
		{
			id: 'item-2',
			type: 'post' as const,
			content: createMockPost('2', { title: 'Good Post' }),
			reports: [],
			queue: 'modqueue' as const,
			queuedAt: new Date(),
		},
	];

	const handlers = {
		onFetchQueue: vi.fn().mockResolvedValue(mockItems),
		onApprove: vi.fn().mockResolvedValue(undefined),
		onRemove: vi.fn().mockResolvedValue(undefined),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('allows moderator to approve and remove items', async () => {
		render(ModerationTestWrapper, {
			props: {
				handlers,
				component: Moderation.Panel,
			},
		});

		// 1. Load Queue
		await waitFor(() => {
			expect(screen.getByText('Spam Post')).toBeInTheDocument();
		});
		expect(screen.getByText('Good Post')).toBeInTheDocument();

		// 2. Approve 'Good Post'
		// Find the article for item-2
		// We can find button within the article.
		// Testing Library 'within' is useful here but global search is easier for unique text.
		// However, we have multiple 'Approve' buttons.
		const goodPostArticle = screen.getByText('Good Post').closest('article');
		if (!goodPostArticle) throw new Error('Good Post article not found');
		const approveBtn = within(goodPostArticle).getByText('Approve');

		await fireEvent.click(approveBtn);

		expect(handlers.onApprove).toHaveBeenCalledWith('item-2');

		// Optimistic update: Item should be removed from list
		// Note: The Mock logic in Panel replaces the array. But `approve` in `Queue.svelte` removes it from the local array instance.
		await waitFor(() => {
			expect(screen.queryByText('Good Post')).toBeNull();
		});

		// 3. Remove 'Spam Post'
		const spamPostArticle = screen.getByText('Spam Post').closest('article');
		if (!spamPostArticle) throw new Error('Spam Post article not found');
		const removeBtn = within(spamPostArticle).getByText('Remove');

		await fireEvent.click(removeBtn);

		expect(handlers.onRemove).toHaveBeenCalledWith('item-1', expect.any(String));

		await waitFor(() => {
			expect(screen.queryByText('Spam Post')).toBeNull();
		});
	});
});

// Import within
import { within } from '@testing-library/svelte';
