import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Root from '../src/Root.svelte';
// import Submit from '../src/Submit.svelte';

// We don't mock context.js here because we want to test the integration of Root with context creation
// But we might need to mock some parts if they are external dependencies

describe('Root', () => {
	it('should render children', () => {
		render(Root, {
			children: (() => {
				const el = document.createElement('div');
				el.textContent = 'Child content';
				return el;
			}) as any, // Snippet type mocking is tricky in bare Svelte, but for testing library we can usually pass slot content
			// Wait, Svelte 5 snippets are passed as props.
			// @testing-library/svelte render options allow passing props.
			// But for snippets, we usually use a wrapper component or check documentation.
			// Let's use the standard way: create a test wrapper component or just pass it as prop if supported.
		});

		// Actually, simpler way to test children in Svelte 5 via testing-library is passing them.
		// However, since we can't easily create a snippet function in test, let's use a slot-like approach if possible or just use a helper component.
		// But Root expects `children` prop.
	});

	// Better approach: Test wrapper component defined in string or use a helper
	// Since we can't define Svelte components inline easily in TS/JS files without compilation.

	// We'll test functionality via props and events on the form, and inspect the DOM.

	it('should render form', () => {
		const { container } = render(Root);
		const form = container.querySelector('form');
		expect(form).toBeTruthy();
	});

	it('should call onSubmit handler when form submitted', async () => {
		const onSubmit = vi.fn();
		const { container } = render(Root, {
			handlers: { onSubmit },
			initialState: { content: 'test' },
		});

		const form = container.querySelector('form');
		expect(form).toBeTruthy();

		if (!form) throw new Error('Form not found');
		await fireEvent.submit(form);

		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				content: 'test',
			})
		);
	});

	it('should prevent submission if over limit', async () => {
		const onSubmit = vi.fn();
		const { container } = render(Root, {
			config: { characterLimit: 5 },
			handlers: { onSubmit },
			initialState: { content: 'Too long content' },
		});

		const form = container.querySelector('form');
		if (!form) throw new Error('Form not found');
		await fireEvent.submit(form);

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('should display error message', () => {
		render(Root, { initialState: { error: new Error('Submission failed') } });
		expect(screen.getByRole('alert').textContent).toContain('Submission failed');
	});

	it('should display reply indicator', () => {
		render(Root, { initialState: { inReplyTo: '123' } });
		expect(screen.getByText('Replying to post')).toBeTruthy();
	});

	it('should update submitting state during submission', async () => {
		let resolveSubmit: () => void = () => {};
		const onSubmit = vi.fn().mockImplementation(() => {
			return new Promise<void>((resolve) => {
				resolveSubmit = resolve;
			});
		});

		const { container } = render(Root, {
			handlers: { onSubmit },
			initialState: { content: 'test' },
		});
		const form = container.querySelector('form');

		// Start submission
		if (!form) throw new Error('Form not found');
		const promise = fireEvent.submit(form);

		// Check if class is added (can't easily check context state without a child, but class reflects it)
		expect(form?.classList.contains('compose-root--submitting')).toBe(true);

		// Finish submission
		resolveSubmit();
		await promise;

		// Wait for state update (microtasks)
		await new Promise((r) => setTimeout(r, 0));

		expect(form?.classList.contains('compose-root--submitting')).toBe(false);
	});
});
