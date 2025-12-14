import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Bar from '../src/Bar.svelte';

// Mock dependencies
vi.mock('@equaltoai/greater-components-headless/button', () => ({
	createButton: (config: any) => ({
		actions: {
			button: (node: HTMLElement) => {
				const handler = (e: Event) => {
					config.onClick?.(e);
				};
				node.addEventListener('click', handler);
				return {
					destroy: () => node.removeEventListener('click', handler),
				};
			},
		},
	}),
}));

const mockHandlers = {
	onSearch: vi.fn(),
};

const mockState = {
	query: '',
	type: 'all',
	results: { actors: [], notes: [], tags: [], total: 0 },
	loading: false,
	error: null,
	semantic: false,
	recentSearches: [] as string[],
};

const mockContext = {
	state: mockState,
	handlers: mockHandlers,
	search: vi.fn(),
	clear: vi.fn(),
	toggleSemantic: vi.fn(),
	updateState: vi.fn((partial) => Object.assign(mockState, partial)),
};

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => mockContext,
	};
});

describe('Bar Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.query = '';
		mockState.semantic = false;
		mockState.recentSearches = [];
		mockState.loading = false;
	});

	it('updates query on input', async () => {
		const target = document.createElement('div');
		const instance = mount(Bar, { target });

		const input = target.querySelector('input') as HTMLInputElement;
		input.value = 'new query';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		expect(mockContext.updateState).toHaveBeenCalledWith({ query: 'new query' });

		unmount(instance);
	});

	it('triggers search on Enter key', async () => {
		const target = document.createElement('div');
		mockState.query = 'search term';
		const instance = mount(Bar, { target });

		const input = target.querySelector('input') as HTMLInputElement;
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await flushSync();

		expect(mockContext.search).toHaveBeenCalled();

		unmount(instance);
	});

	it('triggers search when submit button clicked', async () => {
		const target = document.createElement('div');
		mockState.query = 'search me';
		const instance = mount(Bar, { target });
		await flushSync();

		// Find submit button (class search-bar__submit)
		const submitBtn = target.querySelector('.search-bar__submit') as HTMLButtonElement;
		expect(submitBtn).toBeTruthy();

		submitBtn.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(mockContext.search).toHaveBeenCalled();

		unmount(instance);
	});

	it('clears query when clear button clicked', async () => {
		const target = document.createElement('div');
		mockState.query = 'clear me';
		const instance = mount(Bar, { target });
		await flushSync();

		// Find clear button (it has aria-label="Clear search")
		const clearBtn = target.querySelector('[aria-label="Clear search"]') as HTMLButtonElement;
		expect(clearBtn).toBeTruthy();

		clearBtn.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(mockContext.clear).toHaveBeenCalled();

		unmount(instance);
	});

	it('toggles semantic search', async () => {
		const target = document.createElement('div');
		mockState.semantic = false;
		const instance = mount(Bar, { target, props: { showSemantic: true } });

		// Find semantic button (title="AI Semantic Search")
		const semanticBtn = target.querySelector('[title="AI Semantic Search"]') as HTMLButtonElement;
		expect(semanticBtn).toBeTruthy();

		semanticBtn.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(mockContext.toggleSemantic).toHaveBeenCalled();

		unmount(instance);
	});

	it('shows recent searches on focus when query is empty', async () => {
		const target = document.createElement('div');
		mockState.query = '';
		mockState.recentSearches = ['recent1', 'recent2'];
		const instance = mount(Bar, { target, props: { showRecent: true } });

		const input = target.querySelector('input') as HTMLInputElement;
		input.dispatchEvent(new Event('focus', { bubbles: true }));
		await flushSync();

		const recentList = target.querySelector('.search-bar__recent');
		expect(recentList).toBeTruthy();
		expect(recentList?.textContent).toContain('recent1');
		expect(recentList?.textContent).toContain('recent2');

		unmount(instance);
	});

	it('hides recent searches on Escape', async () => {
		const target = document.createElement('div');
		mockState.query = '';
		mockState.recentSearches = ['recent1'];
		const instance = mount(Bar, { target, props: { showRecent: true } });

		const input = target.querySelector('input') as HTMLInputElement;
		input.dispatchEvent(new Event('focus', { bubbles: true }));
		await flushSync();

		expect(target.querySelector('.search-bar__recent')).toBeTruthy();

		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await flushSync();

		expect(target.querySelector('.search-bar__recent')).toBeFalsy();

		unmount(instance);
	});

	it('triggers search when recent item clicked', async () => {
		const target = document.createElement('div');
		mockState.query = '';
		mockState.recentSearches = ['recent1'];
		const instance = mount(Bar, { target, props: { showRecent: true } });

		const input = target.querySelector('input') as HTMLInputElement;
		input.dispatchEvent(new Event('focus', { bubbles: true }));
		await flushSync();

		const recentItem = target.querySelector('.search-bar__recent-item') as HTMLButtonElement;
		expect(recentItem).toBeTruthy();
		recentItem.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(mockContext.updateState).toHaveBeenCalledWith({ query: 'recent1' });
		expect(mockContext.search).toHaveBeenCalledWith('recent1');

		unmount(instance);
	});
});
