import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Wiki } from '../../../src/components/Wiki/index.js';
import WikiTestWrapper from '../../fixtures/WikiTestWrapper.svelte';

describe('Wiki.Editor Behavior', () => {
	const onSave = vi.fn();
	const wikiData = {
		path: '/wiki/test',
		title: 'Test Page',
		content: 'Initial content',
		revision: 1,
		editPermission: 'everyone' as const,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('allows editing content and saving with reason', async () => {
		onSave.mockResolvedValue(undefined);

		// We render Editor directly to bypass the "click Edit to show" step
		// But verify it works standalone
		render(WikiTestWrapper, {
			props: {
				component: Wiki.Editor,
				wiki: wikiData,
				handlers: { onSave },
			},
		});

		const contentInput = screen.getByRole('textbox', { name: /content/i });
		const reasonInput = screen.getByRole('textbox', { name: /reason/i });
		const saveBtn = screen.getByRole('button', { name: /save/i });

		expect(contentInput).toHaveValue('Initial content');

		await fireEvent.input(contentInput, { target: { value: 'Updated content' } });
		await fireEvent.input(reasonInput, { target: { value: 'Fix typo' } });

		await fireEvent.click(saveBtn);

		expect(onSave).toHaveBeenCalledWith('/wiki/test', 'Updated content', 'Fix typo');
	});

	it('handles save error', async () => {
		onSave.mockRejectedValue(new Error('Save failed'));

		// We need Navigation to see the error message, so we use the default Root rendering
		// and trigger edit mode.
		render(WikiTestWrapper, {
			props: {
				wiki: wikiData,
				handlers: { onSave },
			},
		});

		// Enter edit mode
		await fireEvent.click(screen.getByRole('button', { name: /edit/i }));

		// Change content and save
		const contentInput = screen.getByRole('textbox', { name: /content/i });
		await fireEvent.input(contentInput, { target: { value: 'New content' } });

		await fireEvent.click(screen.getByRole('button', { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent('Save failed');
		});

		// Should still be in edit mode (Editor visible)
		expect(screen.getByRole('textbox', { name: /content/i })).toBeInTheDocument();
	});

	it('updates context and exits edit mode on success', async () => {
		onSave.mockResolvedValue(undefined);

		render(WikiTestWrapper, {
			props: {
				wiki: wikiData,
				handlers: { onSave },
			},
		});

		// Enter edit mode
		await fireEvent.click(screen.getByRole('button', { name: /edit/i }));

		const contentInput = screen.getByRole('textbox', { name: /content/i });
		await fireEvent.input(contentInput, { target: { value: 'Final content' } });

		await fireEvent.click(screen.getByRole('button', { name: /save/i }));

		await waitFor(() => {
			// Editor should be gone
			expect(screen.queryByRole('textbox', { name: /content/i })).not.toBeInTheDocument();
		});

		// Page should display new content (if Page component renders it, which it should)
		// Wiki.Page renders markdown. Assuming 'Final content' is rendered.
		// We check if "Edit" button is back (meaning we are not editing)
		expect(screen.getByRole('button', { name: /edit/i })).toHaveTextContent('Edit');
	});

	it('does nothing if onSave is missing', async () => {
		render(WikiTestWrapper, {
			props: {
				component: Wiki.Editor,
				wiki: wikiData,
				handlers: {}, // No onSave
			},
		});

		const saveBtn = screen.getByRole('button', { name: /save/i });
		await fireEvent.click(saveBtn);

		// No error, no action.
		expect(onSave).not.toHaveBeenCalled();
	});
});
