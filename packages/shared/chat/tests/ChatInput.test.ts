/**
 * ChatInput Component Tests
 *
 * Tests for the message input component including:
 * - Value binding
 * - Keyboard shortcuts (Enter, Shift+Enter, Escape)
 * - Disabled state
 * - Send button state
 * - Character count display
 * - File upload integration (Attachments, Drag & Drop, Paste)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/svelte';
import ChatInputHarness from './harness/ChatInputHarness.svelte';

// Helper to create mock files
const createMockFile = (name: string, size: number, type: string) => {
	const file = new File([''], name, { type });
	Object.defineProperty(file, 'size', { value: size });
	return file;
};

describe('ChatInput.svelte', () => {
	// Mock URL.createObjectURL and revokeObjectURL
	beforeAll(() => {
		global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
		global.URL.revokeObjectURL = vi.fn();
	});

	describe('Rendering', () => {
		it('renders textarea', () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend } });
			expect(screen.getByRole('textbox', { name: /message input/i })).toBeTruthy();
		});

		it('renders send button', () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend } });
			expect(screen.getByRole('button', { name: /send message/i })).toBeTruthy();
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
			render(ChatInputHarness, { props: { onSend, placeholder: 'Ask me anything...' } });
			expect(screen.getByPlaceholderText('Ask me anything...')).toBeTruthy();
		});
	});

	describe('Value Binding', () => {
		it('displays initial value', () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: 'Initial text' } });
			expect(screen.getByRole('textbox')).toHaveValue('Initial text');
		});

		it('updates value on input', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: '' } });
			const textarea = screen.getByRole('textbox');
			await fireEvent.input(textarea, { target: { value: 'New text' } });
			expect(textarea).toHaveValue('New text');
		});
	});

	describe('Keyboard Shortcuts', () => {
		it('sends message on Enter key', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: 'Hello' } });
			const textarea = screen.getByRole('textbox');
			await fireEvent.keyDown(textarea, { key: 'Enter' });
			expect(onSend).toHaveBeenCalledWith('Hello', undefined);
		});

		it('does not send on Shift+Enter (allows newline)', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: 'Hello' } });
			const textarea = screen.getByRole('textbox');
			await fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
			expect(onSend).not.toHaveBeenCalled();
		});

		it('clears input on Escape key', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: 'Hello' } });
			const textarea = screen.getByRole('textbox');
			await fireEvent.keyDown(textarea, { key: 'Escape' });
			expect(textarea).toHaveValue('');
		});
	});

	describe('Send Button', () => {
		it('send button is disabled when input is empty and no files', () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: '' } });
			expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
		});

		it('send button triggers onSend when clicked', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, value: 'Hello' } });
			await fireEvent.click(screen.getByRole('button', { name: /send message/i }));
			expect(onSend).toHaveBeenCalledWith('Hello', undefined);
		});
	});

	describe('File Upload', () => {
		it('adds files via input change', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: true },
			});

			const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
			const file = createMockFile('test.png', 1024, 'image/png');

			// Define files property on the input element
			Object.defineProperty(fileInput, 'files', {
				value: [file],
				writable: true,
			});

			await fireEvent.change(fileInput);

			expect(screen.getByText('test.png')).toBeTruthy();
			expect(screen.getByText('1.0 KB')).toBeTruthy();

			// Check that we can send now (even if text empty)
			expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
		});

		it('removes file when remove button clicked', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: true },
			});

			const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
			const file = createMockFile('test.png', 1024, 'image/png');
			Object.defineProperty(fileInput, 'files', { value: [file] });
			await fireEvent.change(fileInput);

			expect(screen.getByText('test.png')).toBeTruthy();

			const removeButton = screen.getByLabelText('Remove test.png');
			await fireEvent.click(removeButton);

			expect(screen.queryByText('test.png')).toBeNull();
		});

		it('handles file paste', async () => {
			const onSend = vi.fn();
			render(ChatInputHarness, { props: { onSend, showFileUpload: true } });

			const file = createMockFile('pasted.png', 1024, 'image/png');
			const clipboardData = {
				items: [
					{
						type: 'image/png',
						getAsFile: () => file,
					},
				],
			};

			const textarea = screen.getByRole('textbox');
			await fireEvent.paste(textarea, { clipboardData });

			expect(screen.getByText('pasted.png')).toBeTruthy();
		});

		it('handles drag and drop', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, { props: { onSend, showFileUpload: true } });

			const dropZone = container.firstChild as HTMLElement;

			// Drag enter
			await fireEvent.dragEnter(dropZone);
			expect(screen.getByText('Drop files here')).toBeTruthy();

			// Drop
			const file = createMockFile('dropped.png', 1024, 'image/png');
			const dataTransfer = {
				files: [file],
				dropEffect: 'none',
			};

			await fireEvent.drop(dropZone, { dataTransfer });

			expect(screen.getByText('dropped.png')).toBeTruthy();
			expect(screen.queryByText('Drop files here')).toBeNull();
		});

		it('enforces max file limits', async () => {
			const onSend = vi.fn();
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: true, maxFiles: 1 },
			});

			const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
			const file1 = createMockFile('1.png', 1024, 'image/png');
			const file2 = createMockFile('2.png', 1024, 'image/png');

			Object.defineProperty(fileInput, 'files', { value: [file1], configurable: true });
			await fireEvent.change(fileInput);

			expect(screen.getByText('1.png')).toBeTruthy();

			// Try to add another
			Object.defineProperty(fileInput, 'files', { value: [file2], configurable: true });
			await fireEvent.change(fileInput);

			// Should not add second file
			expect(screen.queryByText('2.png')).toBeNull();
		});
	});

	describe('Clearing After Send', () => {
		it('clears input and attachments after successful send', async () => {
			const onSend = vi.fn().mockResolvedValue(undefined);
			const { container } = render(ChatInputHarness, {
				props: { onSend, showFileUpload: true },
			});

			// Add text and file
			const textarea = screen.getByRole('textbox');
			await fireEvent.input(textarea, { target: { value: 'Message' } });

			const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
			const file = createMockFile('test.png', 1024, 'image/png');
			Object.defineProperty(fileInput, 'files', { value: [file] });
			await fireEvent.change(fileInput);

			// Send
			await fireEvent.click(screen.getByRole('button', { name: /send message/i }));

			await waitFor(() => {
				expect(textarea).toHaveValue('');
				expect(screen.queryByText('test.png')).toBeNull();
			});
		});
	});
});
