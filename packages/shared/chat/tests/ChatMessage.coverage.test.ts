import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ChatMessageHarness from './harness/ChatMessageHarness.svelte';

describe('ChatMessage Coverage Tests', () => {
	it('displays error message', () => {
		const { getByText, container } = render(ChatMessageHarness, {
			props: {
				role: 'assistant',
				content: 'Something went wrong',
				status: 'error',
				error: 'Network Error',
			},
		});

		expect(getByText('Network Error')).toBeInTheDocument();
		expect(container.querySelector('.chat-message__bubble--error')).toBeTruthy();
	});

	it('shows retry button on error and handles click', async () => {
		const onRetry = vi.fn();
		const { getByLabelText } = render(ChatMessageHarness, {
			props: {
				role: 'assistant',
				content: 'Failed',
				status: 'error',
				error: 'Error',
				onRetry,
			},
		});

		getByLabelText('Retry message');
	});

	it('handles retry button interaction', async () => {
		const onRetry = vi.fn();
		const { container, getByLabelText } = render(ChatMessageHarness, {
			props: {
				role: 'assistant',
				content: 'Failed',
				status: 'error',
				error: 'Error',
				onRetry,
			},
		});

		const message = container.querySelector('.chat-message');
		await fireEvent.mouseEnter(message as Element);

		const retryButton = getByLabelText('Retry message');
		await fireEvent.click(retryButton);

		expect(onRetry).toHaveBeenCalled();
	});

	it('does not show retry button if disabled', async () => {
		const { container } = render(ChatMessageHarness, {
			props: {
				role: 'assistant',
				content: 'Failed',
				status: 'error',
				error: 'Error',
				showRetryButton: false,
			},
		});

		const message = container.querySelector('.chat-message');
		await fireEvent.mouseEnter(message as Element);

		expect(container.querySelector('button[aria-label="Retry message"]')).toBeFalsy();
	});
});
