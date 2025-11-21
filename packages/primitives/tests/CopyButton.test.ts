import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import CopyButton from '../src/components/CopyButton.svelte';
import * as Utils from '@equaltoai/greater-components-utils';

// Mock the Utils module
vi.mock('@equaltoai/greater-components-utils', async () => {
	const actual = await vi.importActual('@equaltoai/greater-components-utils');
	return {
		...actual,
		copyToClipboard: vi.fn(),
		copyElementText: vi.fn(),
	};
});

describe('CopyButton.svelte', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers(); // Ensure real timers by default
	});

	it('renders with default props', () => {
		const { getByRole } = render(CopyButton, { props: { text: 'test' } });
		const button = getByRole('button');
		expect(button).toBeTruthy();
	});

	it('calls copyToClipboard with text when clicked', async () => {
		vi.mocked(Utils.copyToClipboard).mockResolvedValue({ success: true });
		const { getByRole } = render(CopyButton, { props: { text: 'copy me' } });

		await fireEvent.click(getByRole('button'));

		expect(Utils.copyToClipboard).toHaveBeenCalledWith('copy me');
	});

	it('shows success feedback on successful copy', async () => {
		vi.mocked(Utils.copyToClipboard).mockResolvedValue({ success: true });
		const { getByRole } = render(CopyButton, { props: { text: 'test', variant: 'text' } }); // Use text variant to see label

		const button = getByRole('button');

		// Initial state
		expect(button.textContent?.trim()).toBe('Copy');

		await fireEvent.click(button);

		// Should change to success label
		await waitFor(() => {
			expect(button.textContent?.trim()).toBe('Copied!');
		});
	});

	it('reverts to default state after feedbackDuration', async () => {
		vi.useFakeTimers();
		vi.mocked(Utils.copyToClipboard).mockResolvedValue({ success: true });
		const { getByRole } = render(CopyButton, {
			props: {
				text: 'test',
				variant: 'text',
				feedbackDuration: 1000,
			},
		});

		const button = getByRole('button');
		await fireEvent.click(button);

		// Wait for DOM update to show "Copied!"
		// Since we are in fake timers, we might need to advance a little bit for microtasks/svelte updates if waitFor hangs?
		// But usually waitFor works.
		// However, simply awaiting the click and checking might be enough if Svelte updates are synchronous enough in test env.
		// But better use waitFor. If waitFor fails with fake timers, we might need to tick.

		// Instead of waitFor which might timeout with fake timers if not configured:
		// Just advance a tiny bit?

		// Let's try waiting for condition.
		await waitFor(() => {
			expect(button.textContent?.trim()).toBe('Copied!');
		}); // This might hang if fake timers stop the world?
		// No, waitFor uses interval. With fake timers it might be stuck.
		// But vitest fake timers usually handle intervals?

		// Let's explicitly use real timers for the wait, then fake?
		// Or just advance timers.

		// Advance time to expire the feedback
		vi.advanceTimersByTime(1000);

		await waitFor(() => {
			expect(button.textContent?.trim()).toBe('Copy');
		});
		vi.useRealTimers();
	});

	it('calls copyElementText when targetSelector is used', async () => {
		const mockCopyElement = vi.mocked(Utils.copyElementText).mockResolvedValue({ success: true });

		// Setup DOM element to find
		const element = document.createElement('div');
		element.id = 'target';
		element.textContent = 'target text';
		document.body.appendChild(element);

		const { getByRole } = render(CopyButton, { props: { targetSelector: '#target' } });

		await fireEvent.click(getByRole('button'));

		expect(mockCopyElement).toHaveBeenCalled();

		document.body.removeChild(element);
	});

	it('shows error label on failure', async () => {
		vi
			.mocked(Utils.copyToClipboard)
			.mockResolvedValue({ success: false, error: 'Failed' });
		const { getByRole } = render(CopyButton, { props: { text: 'test', variant: 'text' } });

		await fireEvent.click(getByRole('button'));

		await waitFor(() => {
			expect(getByRole('button').textContent?.trim()).toBe('Error');
		});
	});
});
