import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Moderation } from '../../src/components/Moderation/index.js';
import ModerationTestWrapper from '../fixtures/ModerationTestWrapper.svelte';
import { createMockPost } from '../mocks/mockPost.js';

describe('Moderation Store Async State', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles loading and data population', async () => {
		const mockItems = [
			{
				id: 'item-1',
				type: 'post' as const,
				content: createMockPost('1'),
				reports: [],
				queue: 'modqueue' as const,
				queuedAt: new Date(),
			},
		];

		const onFetchQueue = vi
			.fn()
			.mockImplementation(
				() => new Promise((resolve) => setTimeout(() => resolve(mockItems), 100))
			);

		render(ModerationTestWrapper, {
			props: {
				handlers: { onFetchQueue },
				component: Moderation.Panel,
			},
		});

		// Initial state might trigger load if queue is empty (auto-load)
		// Panel.svelte has logic: if (context.queue.length === 0 && context.handlers.onFetchQueue) void loadQueue(...)

		// Check loading state
		await waitFor(() => {
			expect(screen.getByText('Loading…')).toBeInTheDocument();
		});

		// Wait for data
		await waitFor(() => {
			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
		});

		expect(screen.queryByText('Loading…')).toBeNull();
	});

	it('handles fetch error', async () => {
		const onFetchQueue = vi.fn().mockRejectedValue(new Error('Failed to load queue'));

		render(ModerationTestWrapper, {
			props: {
				handlers: { onFetchQueue },
				component: Moderation.Panel,
			},
		});

		// Wait for error
		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent('Failed to load queue');
		});

		expect(screen.queryByText('Loading…')).toBeNull();
	});
});
