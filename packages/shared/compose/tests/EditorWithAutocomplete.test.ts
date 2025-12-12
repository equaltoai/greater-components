import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditorWithAutocomplete from '../src/EditorWithAutocomplete.svelte';
import * as Autocomplete from '../src/Autocomplete.js';
import * as Context from '../src/context.js';

// Mock context
const mockContext = {
	state: {
		content: '',
		submitting: false,
	},
	config: {
		characterLimit: 500,
		placeholder: 'Type something...',
	},
	updateState: vi.fn(),
};

vi.mock('../src/context.js', () => ({
	getComposeContext: () => mockContext,
}));

vi.mock('../src/Autocomplete.js', async (importOriginal) => {
	return {
		detectAutocompleteContext: vi.fn(),
		filterSuggestions: vi.fn(),
		insertSuggestion: vi.fn(),
		getCursorPosition: vi.fn(() => 0),
		setCursorPosition: vi.fn(),
	};
});

describe('EditorWithAutocomplete', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockContext.state.content = '';
		mockContext.updateState.mockClear();
		
		// Mock scrollIntoView
		Element.prototype.scrollIntoView = vi.fn();
	});

	it('should render textarea', () => {
		render(EditorWithAutocomplete);
		expect(screen.getByPlaceholderText('Type something...')).toBeTruthy();
	});

	it('should update context on input', async () => {
		render(EditorWithAutocomplete);
		const textarea = screen.getByPlaceholderText('Type something...');
		
		await fireEvent.input(textarea, { target: { value: 'Hello' } });
		
		expect(mockContext.updateState).toHaveBeenCalledWith(expect.objectContaining({
			content: 'Hello'
		}));
	});

	it('should trigger autocomplete', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({
			text: 'Hello @',
			query: '',
			type: 'mention',
			startIndex: 6,
			endIndex: 7
		});
		
		const searchHandler = vi.fn().mockResolvedValue([
			{ type: 'mention', text: 'User', value: 'user' }
		]);
		
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'mention', text: 'User', value: 'user' }
		]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		
		// Simulate input triggering autocomplete
		await fireEvent.input(textarea, { target: { value: 'Hello @' } });
		
		await waitFor(() => {
			expect(searchHandler).toHaveBeenCalled();
			expect(screen.getByText('User')).toBeTruthy(); // Autocomplete menu item
		});
	});

	it('should select suggestion', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({
			text: 'Hello @',
			query: '',
			type: 'mention',
			startIndex: 6,
			endIndex: 7
		});
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'mention', text: 'User', value: 'user' }
		]);
		vi.mocked(Autocomplete.insertSuggestion).mockReturnValue({
			text: 'Hello @user ',
			cursorPosition: 12
		});

		const searchHandler = vi.fn().mockResolvedValue([
			{ type: 'mention', text: 'User', value: 'user' }
		]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		
		await fireEvent.input(textarea, { target: { value: 'Hello @' } });
		
		await waitFor(() => {
			expect(screen.getByText('User')).toBeTruthy();
		});
		
		// Click suggestion
		await fireEvent.click(screen.getByText('User'));
		
		expect(Autocomplete.insertSuggestion).toHaveBeenCalled();
		expect(mockContext.updateState).toHaveBeenCalledWith(expect.objectContaining({
			content: 'Hello @user '
		}));
	});
	
	it('should navigate suggestions with keyboard', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({ text: '#', query: '', type: 'hashtag', startIndex: 0, endIndex: 1 });
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'hashtag', text: 'One', value: 'one' },
			{ type: 'hashtag', text: 'Two', value: 'two' }
		]);
		const searchHandler = vi.fn().mockResolvedValue([]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		await fireEvent.input(textarea, { target: { value: '#' } });
		
		await waitFor(() => {
			expect(screen.getByText('One')).toBeTruthy();
		});
		
		// Arrow Down
		await fireEvent.keyDown(textarea, { key: 'ArrowDown' });
		
		vi.mocked(Autocomplete.insertSuggestion).mockReturnValue({ text: '#Two ', cursorPosition: 5 });
		await fireEvent.keyDown(textarea, { key: 'Enter' });
		
		expect(Autocomplete.insertSuggestion).toHaveBeenCalledWith(expect.any(String), expect.any(Object), expect.objectContaining({ text: 'Two' }));
	});

	it('should navigate up with keyboard', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({ text: '#', query: '', type: 'hashtag', startIndex: 0, endIndex: 1 });
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'hashtag', text: 'One', value: 'one' },
			{ type: 'hashtag', text: 'Two', value: 'two' }
		]);
		const searchHandler = vi.fn().mockResolvedValue([]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		await fireEvent.input(textarea, { target: { value: '#' } });
		
		await waitFor(() => {
			expect(screen.getByText('One')).toBeTruthy();
		});
		
		// Down to select second
		await fireEvent.keyDown(textarea, { key: 'ArrowDown' });
		// Up to select first again
		await fireEvent.keyDown(textarea, { key: 'ArrowUp' });
		
		vi.mocked(Autocomplete.insertSuggestion).mockReturnValue({ text: '#One ', cursorPosition: 5 });
		await fireEvent.keyDown(textarea, { key: 'Enter' });
		
		expect(Autocomplete.insertSuggestion).toHaveBeenCalledWith(expect.any(String), expect.any(Object), expect.objectContaining({ text: 'One' }));
	});

	it('should select with Tab', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({ text: '#', query: '', type: 'hashtag', startIndex: 0, endIndex: 1 });
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'hashtag', text: 'One', value: 'one' }
		]);
		const searchHandler = vi.fn().mockResolvedValue([]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		await fireEvent.input(textarea, { target: { value: '#' } });
		
		await waitFor(() => {
			expect(screen.getByText('One')).toBeTruthy();
		});
		
		vi.mocked(Autocomplete.insertSuggestion).mockReturnValue({ text: '#One ', cursorPosition: 5 });
		await fireEvent.keyDown(textarea, { key: 'Tab' });
		
		expect(Autocomplete.insertSuggestion).toHaveBeenCalled();
	});

	it('should close with Escape', async () => {
		vi.mocked(Autocomplete.detectAutocompleteContext).mockReturnValue({ text: '#', query: '', type: 'hashtag', startIndex: 0, endIndex: 1 });
		vi.mocked(Autocomplete.filterSuggestions).mockReturnValue([
			{ type: 'hashtag', text: 'One', value: 'one' }
		]);
		const searchHandler = vi.fn().mockResolvedValue([]);

		render(EditorWithAutocomplete, { searchHandler });
		const textarea = screen.getByPlaceholderText('Type something...');
		await fireEvent.input(textarea, { target: { value: '#' } });
		
		await waitFor(() => {
			expect(screen.getByText('One')).toBeTruthy();
		});
		
		await fireEvent.keyDown(textarea, { key: 'Escape' });
		
		expect(screen.queryByText('One')).toBeFalsy();
	});
});
