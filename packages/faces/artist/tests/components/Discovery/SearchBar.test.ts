import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBar from '../../../src/components/Discovery/SearchBar.svelte';
import { createMockDiscoveryStore } from '../../utils/index';
import * as contextModule from '../../../src/components/Discovery/context';

// Mock getDiscoveryContext
vi.mock('../../../src/components/Discovery/context', async (importOriginal) => {
	const actual = await importOriginal<typeof contextModule>();
	return {
		...actual,
		getDiscoveryContext: vi.fn(),
	};
});

describe('Discovery SearchBar', () => {
	const mockStore = createMockDiscoveryStore();
	const mockHandlers = {
		onSearch: vi.fn(),
		onVisualSearch: vi.fn(),
	};
	const mockConfig = {
		enableVisualSearch: true,
		showSuggestions: true,
	};

	const mockContext = {
		store: mockStore,
		config: mockConfig,
		handlers: mockHandlers,
		searchMode: 'text',
	};

	beforeEach(() => {
		vi.mocked(contextModule.getDiscoveryContext).mockReturnValue(mockContext as any);
		mockStore.search.mockClear();
		mockHandlers.onSearch.mockClear();
	});

	it('renders search input', () => {
		render(SearchBar);
		expect(screen.getByPlaceholderText(/Search artworks/i)).toBeInTheDocument();
		expect(screen.getByRole('search')).toBeInTheDocument();
	});

	it('updates input value', async () => {
		render(SearchBar);
		const input = screen.getByPlaceholderText(/Search artworks/i) as HTMLInputElement;

		await fireEvent.input(input, { target: { value: 'test query' } });
		expect(input.value).toBe('test query');
	});

	it('triggers search on submit', async () => {
		render(SearchBar);
		const input = screen.getByPlaceholderText(/Search artworks/i);
		const submitBtn = screen.getByLabelText('Search');

		await fireEvent.input(input, { target: { value: 'test' } });
		await fireEvent.click(submitBtn);

		expect(mockStore.search).toHaveBeenCalledWith('test');
		expect(mockHandlers.onSearch).toHaveBeenCalledWith('test');
	});

	it('triggers search on Enter key', async () => {
		render(SearchBar);
		const input = screen.getByPlaceholderText(/Search artworks/i);

		await fireEvent.input(input, { target: { value: 'test' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(mockStore.search).toHaveBeenCalledWith('test');
	});

	it('shows clear button when input has text', async () => {
		// Render with search-as-you-type disabled to test clear button visibility
		render(SearchBar, { searchAsYouType: false });
		const input = screen.getByPlaceholderText(/Search artworks/i);

		expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

		await fireEvent.input(input, { target: { value: 'test' } });
		expect(screen.getByLabelText('Clear search')).toBeInTheDocument();

		await fireEvent.click(screen.getByLabelText('Clear search'));
		expect(input).toHaveValue('');
		expect(mockStore.search).toHaveBeenCalledWith('');
	});

	it('shows recent searches when focused empty', async () => {
		// Mock store state with recent searches
		mockStore.update((state) => ({
			...state,
			recentSearches: ['recent 1', 'recent 2'],
		}));

		render(SearchBar, { showRecent: true });
		const input = screen.getByPlaceholderText(/Search artworks/i);

		await fireEvent.focus(input);

		expect(screen.getByText('recent 1')).toBeInTheDocument();
		expect(screen.getByText('recent 2')).toBeInTheDocument();
	});

	it('supports visual search upload', async () => {
		render(SearchBar);
		const fileInput = screen.getByLabelText('Upload image for visual search');
		const file = new File(['(⌐□_□)'], 'cool.png', { type: 'image/png' });

		await fireEvent.change(fileInput, { target: { files: [file] } });

		expect(mockContext.searchMode).toBe('visual');
		expect(mockHandlers.onVisualSearch).toHaveBeenCalledWith(file);
	});
});
