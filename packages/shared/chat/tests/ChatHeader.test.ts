/**
 * ChatHeader Component Tests
 *
 * Tests for the chat header component including:
 * - Title and subtitle display
 * - Connection status indicator
 * - Clear button functionality
 * - Settings button functionality
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ChatHeaderHarness from './harness/ChatHeaderHarness.svelte';

describe('ChatHeader.svelte', () => {
	describe('Rendering', () => {
		it('renders header element', () => {
			const { container } = render(ChatHeaderHarness);

			expect(container.querySelector('.chat-header')).toBeTruthy();
			expect(container.querySelector('header')).toBeTruthy();
		});

		it('has proper role attribute', () => {
			const { container } = render(ChatHeaderHarness);

			expect(container.querySelector('header')).toHaveAttribute('role', 'banner');
		});

		it('applies custom class', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { class: 'custom-header' },
			});

			expect(container.querySelector('.chat-header.custom-header')).toBeTruthy();
		});
	});

	describe('Title Display', () => {
		it('displays default title', () => {
			const { getByText } = render(ChatHeaderHarness);

			expect(getByText('Chat')).toBeInTheDocument();
		});

		it('displays custom title', () => {
			const { getByText } = render(ChatHeaderHarness, {
				props: { title: 'AI Assistant' },
			});

			expect(getByText('AI Assistant')).toBeInTheDocument();
		});

		it('title is an h1 element', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { title: 'Test Title' },
			});

			const h1 = container.querySelector('h1');
			expect(h1).toBeTruthy();
			expect(h1?.textContent).toBe('Test Title');
		});
	});

	describe('Subtitle Display', () => {
		it('does not show subtitle when not provided', () => {
			const { container } = render(ChatHeaderHarness);

			expect(container.querySelector('.chat-header__subtitle')).toBeFalsy();
		});

		it('displays subtitle when provided', () => {
			const { getByText } = render(ChatHeaderHarness, {
				props: { subtitle: 'Powered by GPT-4' },
			});

			expect(getByText('Powered by GPT-4')).toBeInTheDocument();
		});

		it('subtitle is a p element', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { subtitle: 'Test Subtitle' },
			});

			const subtitle = container.querySelector('.chat-header__subtitle');
			expect(subtitle?.tagName.toLowerCase()).toBe('p');
		});
	});

	describe('Connection Status', () => {
		it('does not show status when not provided', () => {
			const { container } = render(ChatHeaderHarness);

			expect(container.querySelector('.chat-header__status')).toBeFalsy();
		});

		it('shows connected status indicator', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { connectionStatus: 'connected' },
			});

			expect(container.querySelector('.chat-header__status--connected')).toBeTruthy();
		});

		it('shows connecting status indicator', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { connectionStatus: 'connecting' },
			});

			expect(container.querySelector('.chat-header__status--connecting')).toBeTruthy();
		});

		it('shows disconnected status indicator', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { connectionStatus: 'disconnected' },
			});

			expect(container.querySelector('.chat-header__status--disconnected')).toBeTruthy();
		});

		it('status has proper aria-label', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { connectionStatus: 'connected' },
			});

			const status = container.querySelector('.chat-header__status');
			expect(status).toHaveAttribute('aria-label', 'Connected');
		});

		it('status has role="status"', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { connectionStatus: 'connected' },
			});

			const status = container.querySelector('.chat-header__status');
			expect(status).toHaveAttribute('role', 'status');
		});
	});

	describe('Clear Button', () => {
		it('shows clear button by default', () => {
			const { container } = render(ChatHeaderHarness);

			const clearButton = container.querySelector('[aria-label="Clear conversation"]');
			expect(clearButton).toBeTruthy();
		});

		it('hides clear button when showClearButton is false', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { showClearButton: false },
			});

			const clearButton = container.querySelector('[aria-label="Clear conversation"]');
			expect(clearButton).toBeFalsy();
		});

		it('calls onClear when clear button is clicked', async () => {
			const onClear = vi.fn();
			const { container } = render(ChatHeaderHarness, {
				props: { onClear },
			});

			const clearButton = container.querySelector('[aria-label="Clear conversation"]');
			expect(clearButton).toBeTruthy();
			await fireEvent.click(clearButton as Element);

			expect(onClear).toHaveBeenCalled();
		});
	});

	describe('Settings Button', () => {
		it('hides settings button by default', () => {
			const { container } = render(ChatHeaderHarness);

			const settingsButton = container.querySelector('[aria-label="Open settings"]');
			expect(settingsButton).toBeFalsy();
		});

		it('shows settings button when showSettingsButton is true', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { showSettingsButton: true },
			});

			const settingsButton = container.querySelector('[aria-label="Open settings"]');
			expect(settingsButton).toBeTruthy();
		});

		it('calls onSettings when settings button is clicked', async () => {
			const onSettings = vi.fn();
			const { container } = render(ChatHeaderHarness, {
				props: { showSettingsButton: true, onSettings },
			});

			const settingsButton = container.querySelector('[aria-label="Open settings"]');
			expect(settingsButton).toBeTruthy();
			await fireEvent.click(settingsButton as Element);

			expect(onSettings).toHaveBeenCalled();
		});
	});

	describe('Accessibility', () => {
		it('clear button has aria-label', () => {
			const { container } = render(ChatHeaderHarness);

			const clearButton = container.querySelector('[aria-label="Clear conversation"]');
			expect(clearButton).toBeTruthy();
		});

		it('settings button has aria-label', () => {
			const { container } = render(ChatHeaderHarness, {
				props: { showSettingsButton: true },
			});

			const settingsButton = container.querySelector('[aria-label="Open settings"]');
			expect(settingsButton).toBeTruthy();
		});
	});
});
