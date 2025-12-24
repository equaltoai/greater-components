import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Publication } from '../../src/components/Publication/index.js';
import PublicationTestWrapper from '../fixtures/PublicationTestWrapper.svelte';

describe('Newsletter Async State', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles loading and success states', async () => {
		const onSubscribe = vi
			.fn()
			.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

		render(PublicationTestWrapper, {
			props: {
				component: Publication.NewsletterSignup,
				componentProps: { onSubscribe },
			},
		});

		const input = screen.getByPlaceholderText('you@example.com');
		const button = screen.getByRole('button', { name: 'Subscribe' });

		await fireEvent.input(input, { target: { value: 'test@example.com' } });
		await fireEvent.click(button);

		// Check loading state
		expect(button).toBeDisabled();
		expect(button).toHaveTextContent('Subscribing…');
		expect(input).toBeDisabled();

		// Wait for success
		await waitFor(() => {
			expect(screen.getByText('Subscribed!')).toBeInTheDocument();
		});

		expect(button).not.toBeDisabled();
		expect(button).toHaveTextContent('Subscribe');
		expect(input).toHaveValue(''); // Should be cleared
	});

	it('handles error state', async () => {
		const onSubscribe = vi.fn().mockRejectedValue(new Error('Network error'));

		render(PublicationTestWrapper, {
			props: {
				component: Publication.NewsletterSignup,
				componentProps: { onSubscribe },
			},
		});

		const input = screen.getByPlaceholderText('you@example.com');
		const button = screen.getByRole('button', { name: 'Subscribe' });

		await fireEvent.input(input, { target: { value: 'fail@example.com' } });
		await fireEvent.click(button);

		// Wait for error
		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent('Network error');
		});

		expect(button).not.toBeDisabled();
		expect(input).not.toBeDisabled();
	});
});
