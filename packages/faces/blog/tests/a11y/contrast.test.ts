import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import PublicationTestWrapper from '../fixtures/PublicationTestWrapper.svelte';
import { Publication } from '../../src/components/Publication/index.js';

describe('A11y: Contrast & Visuals', () => {
	describe('NewsletterSignup', () => {
		it('applies error styling to alert messages', async () => {
			// We force an error state by passing a component that renders it directly or interacting
			// But simpler: just render the markup structure we expect if we can't easily trigger it without async

			// Actually, we can use the Wrapper and trigger the error state as we did in store tests
			// But here we just want to verify the class is present when error exists.

			// Let's use a pattern: verify the class 'gr-blog-newsletter__error' is used.
			// We can't check the color value in JSDOM easily.

			// We will assume the CSS class handles the color.
			// We verify the class is applied.
			const onSubscribe = () => Promise.reject('Fail');
			render(PublicationTestWrapper, {
				props: {
					component: Publication.NewsletterSignup,
					componentProps: { onSubscribe },
				},
			});

			// Trigger error
			const input = screen.getByPlaceholderText('you@example.com');
			const button = screen.getByRole('button');

			// We need to import fireEvent, waitFor
			const { fireEvent, waitFor } = await import('@testing-library/svelte');

			await fireEvent.input(input, { target: { value: 'fail@example.com' } });
			await fireEvent.click(button);

			await waitFor(() => {
				const alert = screen.getByRole('alert');
				expect(alert).toHaveClass('gr-blog-newsletter__error');
			});
		});
	});
});
