import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import { Publication } from '../../src/components/Publication/index.js';
import PublicationTestWrapper from '../fixtures/PublicationTestWrapper.svelte';

describe('Integration: Publication Flow', () => {
	it('allows newsletter subscription', async () => {
		const onSubscribe = vi
			.fn()
			.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));

		render(PublicationTestWrapper, {
			props: {
				component: Publication.NewsletterSignup,
				componentProps: { onSubscribe },
			},
		});

		const input = screen.getByPlaceholderText('you@example.com');
		const button = screen.getByRole('button', { name: 'Subscribe' });

		// 1. Enter email
		await fireEvent.input(input, { target: { value: 'reader@example.com' } });

		// 2. Submit
		await fireEvent.click(button);

		// 3. Verify loading state
		expect(button).toHaveTextContent('Subscribing…');

		// 4. Verify success
		await waitFor(() => {
			expect(screen.getByText('Subscribed!')).toBeInTheDocument();
		});

		expect(onSubscribe).toHaveBeenCalledWith('reader@example.com');
	});
});
