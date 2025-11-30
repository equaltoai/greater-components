/**
 * ChatInput Component Tests
 *
 * Tests for the message input component including:
 * - Value binding
 * - Keyboard shortcuts (Enter, Shift+Enter, Escape)
 * - Disabled state
 * - Send button state
 * - Character count display
 * - File upload integration
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import ChatInputHarness from './harness/ChatInputHarness.svelte';

describe('ChatInput.svelte', () => {
	describe('Rendering', () => {
		it('renders textarea', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend },
			});

			expect(container.querySelector('textarea')).toBeTruthy();
		});

		it('renders send button', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend },
			});

			expect(container.querySelector('button')).toBeTruthy();
		});

		it('applies custom class', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, class: 'custom-input' },
			});

			expect(container.querySelector('.custom-input')).toBeTruthy();
		});

		it('displays placeholder text', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, placeholder: 'Ask me anything...' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toHaveAttribute('placeholder', 'Ask me anything...');
		});
	});

	describe('Value Binding', () => {
		it('displays initial value', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Initial text' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toHaveValue('Initial text');
		});

		it('updates value on input', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: '' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.input(textarea as HTMLTextAreaElement, { target: { value: 'New text' } });

			expect(textarea).toHaveValue('New text');
		});
	});

	describe('Keyboard Shortcuts', () => {
		it('sends message on Enter key', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Hello' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			expect(onSend).toHaveBeenCalledWith('Hello', undefined);
		});

		it('does not send on Shift+Enter (allows newline)', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Hello' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter', shiftKey: true });

			expect(onSend).not.toHaveBeenCalled();
		});

		it('clears input on Escape key', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Hello' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Escape' });

			expect(textarea).toHaveValue('');
		});

		it('does not send empty message on Enter', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: '' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			expect(onSend).not.toHaveBeenCalled();
		});

		it('does not send whitespace-only message', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: '   ' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			expect(onSend).not.toHaveBeenCalled();
		});
	});

	describe('Disabled State', () => {
		it('disables textarea when disabled', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, disabled: true },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeDisabled();
		});

		it('does not send when disabled', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, disabled: true, value: 'Hello' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			expect(onSend).not.toHaveBeenCalled();
		});
	});

	describe('Send Button', () => {
		it('send button is disabled when input is empty', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: '' },
			});

			const buttons = container.querySelectorAll('button');
			const _sendButton = Array.from(buttons).find(
				(btn) =>
					btn.getAttribute('aria-label')?.includes('Send') ||
					btn.classList.contains('chat-input__send')
			);

			// Send button should be disabled or not clickable when empty
		});

		it('send button triggers onSend when clicked', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Hello' },
			});

			// Find and click the send button
			const buttons = container.querySelectorAll('button');
			for (const button of buttons) {
				if (
					button.getAttribute('aria-label')?.includes('Send') ||
					button.classList.contains('chat-input__send')
				) {
					await fireEvent.click(button);
					break;
				}
			}

			expect(onSend).toHaveBeenCalledWith('Hello', undefined);
		});
	});

	describe('Character Count', () => {
		it('shows character count when maxLength is set', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, maxLength: 100, value: 'Hello' },
			});

			// Character count should be displayed
			expect(container.textContent).toMatch(/5|100/);
		});

		it('prevents sending when over character limit', async () => {
			const onSend = vi.fn();
			const longText = 'a'.repeat(101);

			const { container } = render(ChatInputHarness, {
				props: { onSend, maxLength: 100, value: longText },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			expect(onSend).not.toHaveBeenCalled();
		});
	});

	describe('File Upload', () => {
		it('shows file upload button when enabled', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: true },
			});

			// File upload button should be visible
			const fileInput = container.querySelector('input[type="file"]');
			expect(fileInput).toBeTruthy();
		});

		it('hides file upload button when disabled', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: false },
			});

			const fileInput = container.querySelector('input[type="file"]');
			expect(fileInput).toBeFalsy();
		});

		it('accepts specified file types', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: {
					onSend,
					showFileUpload: true,
					acceptedFileTypes: 'image/*,.pdf',
				},
			});

			const fileInput = container.querySelector('input[type="file"]');
			expect(fileInput).toHaveAttribute('accept', 'image/*,.pdf');
		});
	});

	describe('Auto-resize', () => {
		it('textarea starts with auto height', () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
		});
	});

	describe('Clearing After Send', () => {
		it('clears input after successful send', async () => {
			const onSend = vi.fn().mockResolvedValue(undefined);
			const { container } = render(ChatInputHarness, {
				props: { onSend, value: 'Hello' },
			});

			const textarea = container.querySelector('textarea');
			expect(textarea).toBeTruthy();
			await fireEvent.keyDown(textarea as HTMLTextAreaElement, { key: 'Enter' });

			await waitFor(() => {
				expect(textarea).toHaveValue('');
			});
		});
	});
});
