import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Editor } from '../../src/components/Editor/index.js';

describe('Integration: Editor Flow', () => {
	const onSave = vi
		.fn()
		.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
	const onChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Manual Save', () => {
		it('allows typing, updates stats, and saves content', async () => {
			render(Editor.Root, {
				props: {
					draft: {
						id: 'draft-1',
						title: 'My Draft',
						content: '',
						contentFormat: 'markdown',
						savedAt: new Date().toISOString(),
					},
					config: {
						mode: 'markdown',
						showWordCount: true,
						autoSaveInterval: 0, // Disable auto-save for this test
					},
					onSave,
					onChange,
				},
			});

			const textarea = screen.getByRole('textbox');

			// 1. Type content
			await fireEvent.input(textarea, { target: { value: 'Hello world' } });

			// Check onChange
			expect(onChange).toHaveBeenCalled();
			expect(onChange.mock.calls[0][0].content).toBe('Hello world');

			// 2. Check stats (word count)
			expect(screen.getByText('2 words')).toBeInTheDocument();

			// 3. Check unsaved status
			await waitFor(() => {
				expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
			});

			// 4. Trigger Save
			const saveButton = screen.getByText('Save');
			await fireEvent.click(saveButton);

			expect(screen.getByText('Saving…')).toBeInTheDocument();

			await waitFor(() => {
				expect(screen.getByText('Saved')).toBeInTheDocument();
			});

			expect(onSave).toHaveBeenCalledWith(
				expect.objectContaining({
					content: 'Hello world',
				})
			);
		});
	});

	describe('Auto Save', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('triggers auto-save', async () => {
			render(Editor.Root, {
				props: {
					draft: {
						id: 'draft-2',
						title: 'Auto',
						content: '',
						contentFormat: 'markdown',
						savedAt: new Date().toISOString(),
					},
					config: { autoSaveInterval: 500 },
					onSave,
				},
			});

			const textarea = screen.getByRole('textbox');
			await fireEvent.input(textarea, { target: { value: 'Auto save me' } });

			// Fast forward time
			await vi.advanceTimersByTimeAsync(600);

			expect(onSave).toHaveBeenCalled();
		});
	});
});
