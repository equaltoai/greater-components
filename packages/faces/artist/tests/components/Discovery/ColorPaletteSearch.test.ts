import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ColorPaletteSearch from '@equaltoai/greater-components-artist/components/Discovery/ColorPaletteSearch.svelte';

describe('ColorPaletteSearch', () => {
	it('renders correctly', () => {
		render(ColorPaletteSearch);
		expect(screen.getByText('Search by Color')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /search by colors/i })).toBeDisabled();
	});

	it('adds colors correctly', async () => {
		render(ColorPaletteSearch);

		const colorInput = screen.getByLabelText('Pick a color');
		await fireEvent.input(colorInput, { target: { value: '#ff0000' } });

		const addButton = screen.getByLabelText('Add selected color');
		await fireEvent.click(addButton);

		expect(screen.getByText('#ff0000')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /search by colors/i })).toBeEnabled();
	});

	it('removes colors correctly', async () => {
		render(ColorPaletteSearch, { props: { colors: ['#ff0000'] } });

		expect(screen.getByText('#ff0000')).toBeInTheDocument();

		const removeButton = screen.getByLabelText('Remove color #ff0000');
		await fireEvent.click(removeButton);

		expect(screen.queryByText('#ff0000')).not.toBeInTheDocument();
	});

	it('clears all colors', async () => {
		render(ColorPaletteSearch, { props: { colors: ['#ff0000', '#00ff00'] } });

		const clearButton = screen.getByText('Clear all');
		await fireEvent.click(clearButton);

		expect(screen.queryByText('#ff0000')).not.toBeInTheDocument();
		expect(screen.queryByText('#00ff00')).not.toBeInTheDocument();
	});

	it('does not add duplicate colors', async () => {
		render(ColorPaletteSearch, { props: { colors: ['#ff0000'] } });

		const colorInput = screen.getByLabelText('Pick a color');
		await fireEvent.input(colorInput, { target: { value: '#ff0000' } });

		const addButton = screen.getByLabelText('Add selected color');
		await fireEvent.click(addButton);

		const colors = screen.getAllByText('#ff0000');
		expect(colors).toHaveLength(1);
	});

	it('does not add more than maxColors', async () => {
		render(ColorPaletteSearch, { props: { colors: ['#1', '#2', '#3', '#4', '#5'], maxColors: 5 } });

		// Input should not be present when max colors reached
		expect(screen.queryByLabelText('Pick a color')).not.toBeInTheDocument();
	});

	it('applies preset palettes', async () => {
		render(ColorPaletteSearch);

		const warmPreset = screen.getByLabelText('Apply Warm palette');
		await fireEvent.click(warmPreset);

		expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
	});

	it('handles tolerance change', async () => {
		render(ColorPaletteSearch, { props: { tolerance: 50 } });
		const slider = screen.getByLabelText(/Tolerance:/);
		await fireEvent.input(slider, { target: { value: '80' } });
		expect(screen.getByText('Tolerance: 80%')).toBeInTheDocument();
	});

	it('handles match mode change', async () => {
		render(ColorPaletteSearch);

		const allRadio = screen.getByLabelText('All colors');
		await fireEvent.click(allRadio);

		expect(allRadio).toBeChecked();
	});

	it('calls onSearch with selected colors', async () => {
		const onSearch = vi.fn();
		render(ColorPaletteSearch, { props: { colors: ['#ff0000'], onSearch } });

		const searchButton = screen.getByRole('button', { name: /search by colors/i });
		await fireEvent.click(searchButton);

		expect(onSearch).toHaveBeenCalledWith(['#ff0000']);
	});

	it('extracts colors from image (mock)', async () => {
		render(ColorPaletteSearch);

		const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
		const input = screen.getByLabelText('Upload image for color extraction');

		// Simulate file selection
		await fireEvent.change(input, { target: { files: [file] } });

		// Wait for the mock extraction (which is async but fast)
		// The mock implementation sets hardcoded colors: ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12']
		await screen.findByText('#E74C3C');
		expect(screen.getByText('#3498DB')).toBeInTheDocument();
	});

	it('triggers file input click on extract button click', async () => {
		render(ColorPaletteSearch);

		const extractButton = screen.getByText('Extract from image');
		const fileInput = screen.getByLabelText('Upload image for color extraction');

		const clickSpy = vi.spyOn(fileInput, 'click');
		await fireEvent.click(extractButton);

		expect(clickSpy).toHaveBeenCalled();
	});
});
