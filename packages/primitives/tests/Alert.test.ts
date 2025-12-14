// @vitest-environment jsdom
import { render, fireEvent, screen } from '@testing-library/svelte';
import Alert from '../src/components/Alert.svelte';
import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';

describe('Alert', () => {
	it('renders with default variant (info)', () => {
		render(Alert, {
			props: {
				children: createRawSnippet(() => ({
					render: () => '<span>Default Alert</span>',
				})),
			},
		});

		const alert = screen.getByRole('status');
		expect(alert.classList.contains('gr-alert')).toBe(true);
		expect(alert.classList.contains('gr-alert--info')).toBe(true);
		expect(screen.getByText('Default Alert')).toBeTruthy();
	});

	it('renders error variant with correct role', () => {
		render(Alert, {
			props: {
				variant: 'error',
				children: createRawSnippet(() => ({
					render: () => '<span>Error Alert</span>',
				})),
			},
		});

		const alert = screen.getByRole('alert');
		expect(alert.classList.contains('gr-alert--error')).toBe(true);
	});

	it('renders warning variant with correct role', () => {
		render(Alert, {
			props: {
				variant: 'warning',
				children: createRawSnippet(() => ({
					render: () => '<span>Warning Alert</span>',
				})),
			},
		});

		const alert = screen.getByRole('alert');
		expect(alert.classList.contains('gr-alert--warning')).toBe(true);
	});

	it('renders success variant with correct role', () => {
		render(Alert, {
			props: {
				variant: 'success',
				children: createRawSnippet(() => ({
					render: () => '<span>Success Alert</span>',
				})),
			},
		});

		const alert = screen.getByRole('status');
		expect(alert.classList.contains('gr-alert--success')).toBe(true);
	});

	it('renders title when provided', () => {
		render(Alert, {
			props: {
				title: 'Test Title',
				children: createRawSnippet(() => ({
					render: () => '<span>Content</span>',
				})),
			},
		});

		const title = screen.getByText('Test Title');
		expect(title.classList.contains('gr-alert__title')).toBe(true);
	});

	it('renders dismiss button when dismissible is true', async () => {
		const onDismiss = vi.fn();
		render(Alert, {
			props: {
				dismissible: true,
				onDismiss,
				children: createRawSnippet(() => ({
					render: () => '<span>Dismissible</span>',
				})),
			},
		});

		const dismissBtn = screen.getByLabelText('Dismiss alert');
		expect(dismissBtn).toBeTruthy();
		expect(screen.getByRole('status').classList.contains('gr-alert--dismissible')).toBe(true);

		await fireEvent.click(dismissBtn);
		expect(onDismiss).toHaveBeenCalled();
	});

	it('renders action button when actionLabel is provided', async () => {
		const onAction = vi.fn();
		render(Alert, {
			props: {
				actionLabel: 'Retry',
				onAction,
				children: createRawSnippet(() => ({
					render: () => '<span>Action</span>',
				})),
			},
		});

		const actionBtn = screen.getByText('Retry');
		expect(actionBtn).toBeTruthy();
		expect(actionBtn.classList.contains('gr-alert__action-button')).toBe(true);

		await fireEvent.click(actionBtn);
		expect(onAction).toHaveBeenCalled();
	});

	it('renders custom icon', () => {
		render(Alert, {
			props: {
				icon: createRawSnippet(() => ({
					render: () => '<span data-testid="custom-icon">Icon</span>',
				})),
				children: createRawSnippet(() => ({
					render: () => '<span>Custom Icon</span>',
				})),
			},
		});

		expect(screen.getByTestId('custom-icon')).toBeTruthy();
	});

	it('handles keyboard dismiss (Escape)', async () => {
		const onDismiss = vi.fn();
		render(Alert, {
			props: {
				dismissible: true,
				onDismiss,
				children: createRawSnippet(() => ({
					render: () => '<span>Keyboard Dismiss</span>',
				})),
			},
		});

		const alert = screen.getByRole('status');
		await fireEvent.keyDown(alert, { key: 'Escape' });
		expect(onDismiss).toHaveBeenCalled();
	});

	it('does not dismiss on Escape if not dismissible', async () => {
		const onDismiss = vi.fn();
		render(Alert, {
			props: {
				dismissible: false,
				onDismiss,
				children: createRawSnippet(() => ({
					render: () => '<span>Not Dismissible</span>',
				})),
			},
		});

		const alert = screen.getByRole('status');
		await fireEvent.keyDown(alert, { key: 'Escape' });
		expect(onDismiss).not.toHaveBeenCalled();
	});
});
