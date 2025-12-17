import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Moderation } from '../../../src/components/Moderation/index.js';
import ModerationTestWrapper from '../../fixtures/ModerationTestWrapper.svelte';
import { createMockPost } from '../../mocks/mockPost.js';
import type { ModerationQueueItem } from '../../../src/types.js';

describe('Moderation Behavior', () => {
	const mockPost = createMockPost('mod-1');
	const mockItem: ModerationQueueItem = {
		id: 'item-1',
		type: 'post',
		content: mockPost,
		reports: [{ reason: 'Spam', createdAt: new Date() }],
		queue: 'modqueue',
		queuedAt: new Date(),
	};

	const handlers = {
		onApprove: vi.fn(),
		onRemove: vi.fn(),
		onSpam: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls onApprove when approve button is clicked', async () => {
		render(ModerationTestWrapper, {
			props: {
				handlers,
				queue: [mockItem],
				component: Moderation.Queue,
				componentProps: { queue: 'modqueue' },
			},
		});

		const approveBtn = screen.getByText('Approve');
		await fireEvent.click(approveBtn);

		expect(handlers.onApprove).toHaveBeenCalledWith(mockItem.id);
	});

	it('calls onRemove when remove button is clicked', async () => {
		render(ModerationTestWrapper, {
			props: {
				handlers,
				queue: [mockItem],
				component: Moderation.Queue,
				componentProps: { queue: 'modqueue' },
			},
		});

		const removeBtn = screen.getByText('Remove');
		await fireEvent.click(removeBtn);

		expect(handlers.onRemove).toHaveBeenCalledWith(mockItem.id, expect.any(String));
	});

	it('calls onSpam when spam button is clicked', async () => {
		render(ModerationTestWrapper, {
			props: {
				handlers,
				queue: [mockItem],
				component: Moderation.Queue,
				componentProps: { queue: 'modqueue' },
			},
		});

		const spamBtn = screen.getByRole('button', { name: 'Spam' });
		await fireEvent.click(spamBtn);

		expect(handlers.onSpam).toHaveBeenCalledWith(mockItem.id);
	});
});
