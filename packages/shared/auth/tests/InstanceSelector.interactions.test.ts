import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import InstanceSelectorTestHarness from './fixtures/InstanceSelectorTestHarness.svelte';

describe('Auth.InstanceSelector Interactions', () => {
	it('updates input value', async () => {
		render(InstanceSelectorTestHarness);
		const input = screen.getByLabelText(/instance/i) as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'test.com' } });
		expect(input.value).toBe('test.com');
	});

	it('shows error for invalid URL', async () => {
		render(InstanceSelectorTestHarness);
		const input = screen.getByLabelText(/instance/i);
		const button = screen.getByRole('button', { name: /continue/i });

		// Empty is invalid? normalizeInstance returns empty string if trimmed is empty. isValidInstanceUrl checks it.
		// Let's rely on component logic.
		await fireEvent.input(input, { target: { value: '   ' } });
		await fireEvent.click(button);

		// expect alert
		const alert = await screen.findByRole('alert');
		expect(alert.textContent).toMatch(/valid instance url/i);
	});

	it('calls onOAuthStart with normalized URL', async () => {
		const onOAuthStart = vi.fn();
		render(InstanceSelectorTestHarness, {
			props: {
				handlers: { onOAuthStart },
			},
		});

		const input = screen.getByLabelText(/instance/i);
		const button = screen.getByRole('button', { name: /continue/i });

		await fireEvent.input(input, { target: { value: 'example.com' } });
		await fireEvent.click(button);

		expect(onOAuthStart).toHaveBeenCalledWith('https://example.com');
	});

	it('calls onOAuthStart with existing protocol', async () => {
		const onOAuthStart = vi.fn();
		render(InstanceSelectorTestHarness, {
			props: {
				handlers: { onOAuthStart },
			},
		});

		const input = screen.getByLabelText(/instance/i);
		const button = screen.getByRole('button', { name: /continue/i });

		await fireEvent.input(input, { target: { value: 'http://local.test' } });
		await fireEvent.click(button);

		expect(onOAuthStart).toHaveBeenCalledWith('http://local.test');
	});

	it('handles handler error', async () => {
		const onOAuthStart = vi.fn().mockRejectedValue(new Error('Network error'));
		render(InstanceSelectorTestHarness, {
			props: {
				handlers: { onOAuthStart },
			},
		});

		const input = screen.getByLabelText(/instance/i);
		const button = screen.getByRole('button', { name: /continue/i });

		await fireEvent.input(input, { target: { value: 'example.com' } });
		await fireEvent.click(button);

		const alert = await screen.findByRole('alert');
		expect(alert.textContent).toContain('Network error');
	});

	it('shows loading state', async () => {
		// Promise that doesn't resolve immediately
		let resolveStart: () => void = () => {};
		const onOAuthStart = vi
			.fn()
			.mockImplementation(() => new Promise<void>((r) => (resolveStart = r)));

		render(InstanceSelectorTestHarness, {
			props: {
				handlers: { onOAuthStart },
			},
		});

		const input = screen.getByLabelText(/instance/i);
		const button = screen.getByRole('button', { name: /continue/i });

		await fireEvent.input(input, { target: { value: 'example.com' } });
		await fireEvent.click(button);

		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(button.hasAttribute('disabled')).toBe(true);
		expect(button.textContent).toContain('Connecting');

		// Cleanup
		resolveStart();
	});
});
