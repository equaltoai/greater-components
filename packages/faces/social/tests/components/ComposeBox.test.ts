import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import ComposeBox from '../../src/components/ComposeBox.svelte';

describe('ComposeBox', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		// Mock localStorage
		const localStorageMock = (function () {
			let store: Record<string, string> = {};
			return {
				getItem: vi.fn((key: string) => store[key] || null),
				setItem: vi.fn((key: string, value: string) => {
					store[key] = value.toString();
				}),
				removeItem: vi.fn((key: string) => {
					delete store[key];
				}),
				clear: vi.fn(() => {
					store = {};
				}),
			};
		})();
		Object.defineProperty(window, 'localStorage', {
			value: localStorageMock,
			configurable: true,
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('renders with default props', () => {
		render(ComposeBox);
		expect(screen.getByPlaceholderText("What's on your mind?")).toBeTruthy();
		expect(screen.getByRole('button', { name: /Post/i })).toBeTruthy();
	});

	it('updates content and enables submit button', async () => {
		const onSubmit = vi.fn();
		render(ComposeBox, { onSubmit });

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		const submitButton = screen.getByRole('button', { name: /Post/i });

		expect(submitButton).toBeDisabled();

		await fireEvent.input(textarea, { target: { value: 'Hello world' } });

		expect(textarea).toHaveValue('Hello world');
		expect(submitButton).not.toBeDisabled();

		await fireEvent.click(submitButton);
		expect(onSubmit).toHaveBeenCalled();
	});

	it('shows character count', async () => {
		render(ComposeBox, { maxLength: 100 });

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		await fireEvent.focus(textarea);
		await fireEvent.input(textarea, { target: { value: 'Hello' } });

		// Character count should be visible (soft mode shows length)
		expect(screen.getByText('5')).toBeTruthy();
	});

	it('handles content warnings', async () => {
		render(ComposeBox, { enableContentWarnings: true });

		const cwButton = screen.getByRole('button', { name: 'Add content warning' });
		await fireEvent.click(cwButton);

		const cwInput = screen.getByPlaceholderText('Content warning');
		expect(cwInput).toBeTruthy();

		await fireEvent.input(cwInput, { target: { value: 'Spoilers' } });
		expect(cwInput).toHaveValue('Spoilers');

		// Test toggling off
		await fireEvent.click(screen.getByRole('button', { name: 'Remove content warning' }));
		expect(screen.queryByPlaceholderText('Content warning')).toBeNull();
	});

	it('saves draft to localStorage', async () => {
		const onDraftSave = vi.fn();
		render(ComposeBox, { onDraftSave, draftKey: 'test-draft' });

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		await fireEvent.input(textarea, { target: { value: 'Draft content' } });

		// Wait for debounce
		await vi.advanceTimersByTimeAsync(1100);

		expect(localStorage.setItem).toHaveBeenCalledWith(
			'test-draft',
			expect.stringContaining('Draft content')
		);
		expect(onDraftSave).toHaveBeenCalled();
	});

	it('loads draft from localStorage', async () => {
		const draftData = {
			content: 'Saved draft',
			timestamp: Date.now(),
		};
		vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(draftData));

		render(ComposeBox, { draftKey: 'test-draft' });

		await waitFor(() => {
			expect(screen.getByDisplayValue('Saved draft')).toBeTruthy();
		});
	});

	it('handles media attachments', async () => {
		const onMediaUpload = vi.fn().mockResolvedValue({
			id: 'media1',
			type: 'image',
			url: 'test.jpg',
		});

		const { container } = render(ComposeBox, { onMediaUpload });

		const fileInput = container.querySelector('input[type="file"]');
		expect(fileInput).toBeTruthy();

		// Mock file selection
		const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
		Object.defineProperty(fileInput, 'files', {
			value: [file],
			configurable: true,
		});

		expect(fileInput).toBeTruthy();
		if (fileInput) await fireEvent.change(fileInput);
		else throw new Error('File input not found');

		await waitFor(() => {
			expect(onMediaUpload).toHaveBeenCalled();
		});
	});

	it('cancels and clears form', async () => {
		render(ComposeBox);

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		await fireEvent.input(textarea, { target: { value: 'To be cancelled' } });

		const cancelButton = screen.getByRole('button', { name: /Cancel/i });
		await fireEvent.click(cancelButton);

		expect(textarea).toHaveValue('');
	});

	it('handles submit errors', async () => {
		const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(ComposeBox, { onSubmit });

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		await fireEvent.input(textarea, { target: { value: 'Fail me' } });

		const submitButton = screen.getByRole('button', { name: /Post/i });
		await fireEvent.click(submitButton);

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalled();
		});

		// Content should remain
		expect(textarea).toHaveValue('Fail me');

		consoleSpy.mockRestore();
	});

	it('handles reply context', () => {
		const replyToStatus = {
			id: '1',
			account: { acct: 'user@test.com', displayName: 'User' },
			content: 'Original post',
			createdAt: '2023-01-01',
			uri: 'url',
		};

		render(ComposeBox, { replyToStatus } as any);

		expect(screen.getByText('Replying to @user@test.com')).toBeTruthy();
		expect(screen.getByLabelText('Reply to User')).toBeTruthy();
		expect(screen.getByRole('button', { name: /Reply/i })).toBeTruthy();
	});

	it('handles keyboard shortcuts', async () => {
		const onSubmit = vi.fn();
		const onCancel = vi.fn();

		render(ComposeBox, { onSubmit, onCancel, initialContent: 'Test' });

		const textarea = screen.getByPlaceholderText("What's on your mind?");

		// Ctrl+Enter to submit
		await fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
		expect(onSubmit).toHaveBeenCalled();

		// Escape to cancel
		await fireEvent.keyDown(textarea, { key: 'Escape' });
		expect(onCancel).toHaveBeenCalled();
	});

	it('handles visibility selection', async () => {
		render(ComposeBox);

		const select = screen.getByLabelText('Post visibility');
		await fireEvent.change(select, { target: { value: 'private' } });

		expect(select).toHaveValue('private');
	});

	it('handles hard character limit', async () => {
		render(ComposeBox, { maxLength: 10, characterCountMode: 'hard' });

		const textarea = screen.getByPlaceholderText("What's on your mind?");
		const submitButton = screen.getByRole('button', { name: /Post/i });

		await fireEvent.input(textarea, { target: { value: '12345678901' } }); // 11 chars

		expect(screen.getByText('11/10')).toBeTruthy();
		expect(submitButton).toBeDisabled();
	});
});
