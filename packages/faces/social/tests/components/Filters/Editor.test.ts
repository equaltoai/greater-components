import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import EditorTest from './EditorTest.svelte';

describe('Filters Editor', () => {
	const mockFilter = {
		id: '1',
		phrase: 'badword',
		context: ['home', 'public'] as const,
		expiresAt: null,
		irreversible: false,
		wholeWord: true,
		createdAt: '2023-01-01',
		updatedAt: '2023-01-01',
	};

	const renderComponent = (props = {}) => {
		return render(EditorTest, {
			props: {
				handlers: {
					onCreateFilter: vi.fn(),
					onUpdateFilter: vi.fn(),
				},
				...props,
			},
		});
	};

	it('renders "New Filter" title when creating', () => {
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: null },
		});
		expect(screen.getByText('New Filter')).toBeTruthy();
		expect(screen.getByText('Create Filter')).toBeTruthy();
	});

	it('renders "Edit Filter" title when editing', () => {
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: mockFilter },
		});
		expect(screen.getByText('Edit Filter')).toBeTruthy();
		expect(screen.getByText('Update Filter')).toBeTruthy();
		expect(screen.getByDisplayValue('badword')).toBeTruthy();
	});

	it('validates contexts', async () => {
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: null },
		});

		// Default has 'home' selected.
		// Toggle 'home' off.
		const homeButton = screen.getByText('Home timeline').closest('button');
		if (homeButton) await fireEvent.click(homeButton);

		expect(screen.getByText('Select at least one context')).toBeTruthy();
		const saveButton = screen.getByText('Create Filter');
		expect(saveButton.disabled).toBe(true);
	});

	it('toggles whole word hint', async () => {
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: null },
		});

		// Default true
		expect(screen.getByText(/Will match "cat" but not "catch"/)).toBeTruthy();

		const checkbox = screen.getByLabelText('Match whole word only');
		await fireEvent.click(checkbox);

		expect(screen.getByText(/Will match "cat" in "catch"/)).toBeTruthy();
	});

	it('shows expiration hint', async () => {
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: null },
		});

		const select = screen.getByLabelText('Expire after');

		// Default null (Never)
		expect(screen.getByText('Filter will remain active until manually removed')).toBeTruthy();

		// Change to 1 hour (3600)
		await fireEvent.change(select, { target: { value: '3600' } });

		expect(
			screen.getByText('Filter will automatically be removed after this duration')
		).toBeTruthy();
	});

	it('handles saving state', () => {
		renderComponent({
			initialState: { editorOpen: true, saving: true },
		});

		expect(screen.getByText('Saving...')).toBeTruthy();
		expect(screen.getByText('Saving...').disabled).toBe(true);
		expect(screen.getByText('Cancel').disabled).toBe(true);
	});

	it('shows error banner', () => {
		renderComponent({
			initialState: { editorOpen: true, error: 'Something went wrong' },
		});

		expect(screen.getByText('Something went wrong')).toBeTruthy();
	});

	it('calls createFilter on submit', async () => {
		const onCreateFilter = vi.fn().mockResolvedValue({ ...mockFilter, id: '2' });
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: null },
			handlers: { onCreateFilter },
		});

		const input = screen.getByLabelText('Keyword or phrase');
		await fireEvent.input(input, { target: { value: 'newword' } });

		const saveButton = screen.getByText('Create Filter');
		await fireEvent.click(saveButton);

		expect(onCreateFilter).toHaveBeenCalledWith(
			expect.objectContaining({
				phrase: 'newword',
				context: ['home'],
				expiresIn: null,
				irreversible: false,
				wholeWord: true,
			})
		);
	});

	it('calls updateFilter on submit', async () => {
		const onUpdateFilter = vi.fn().mockResolvedValue(mockFilter);
		renderComponent({
			initialState: { editorOpen: true, selectedFilter: mockFilter },
			handlers: { onUpdateFilter },
		});

		const input = screen.getByLabelText('Keyword or phrase');
		await fireEvent.input(input, { target: { value: 'updatedword' } });

		const saveButton = screen.getByText('Update Filter');
		await fireEvent.click(saveButton);

		expect(onUpdateFilter).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({
				phrase: 'updatedword',
			})
		);
	});
});
