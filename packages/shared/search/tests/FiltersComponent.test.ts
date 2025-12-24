import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Filters from '../src/Filters.svelte';

const mockHandlers = {
	onSearch: vi.fn(),
};

const mockState = {
	query: '',
	type: 'all',
	results: { actors: [], notes: [], tags: [], total: 0 },
	loading: false,
	error: null,
};

const mockContext = {
	state: mockState,
	handlers: mockHandlers,
	setType: vi.fn(),
};

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => mockContext,
	};
});

describe('Filters Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.type = 'all';
		mockState.results = { actors: [], notes: [], tags: [], total: 0 };
	});

	it('renders all filter tabs', () => {
		const target = document.createElement('div');
		const instance = mount(Filters, { target });

		const tabs = target.querySelectorAll('.search-filters__tab');
		expect(tabs.length).toBe(4);
		expect(target.textContent).toContain('All');
		expect(target.textContent).toContain('People');
		expect(target.textContent).toContain('Posts');
		expect(target.textContent).toContain('Tags');

		unmount(instance);
	});

	it('renders counts when > 0', () => {
		mockState.results = {
			actors: [{}],
			notes: [{}, {}],
			tags: [],
			total: 3,
		};
		const target = document.createElement('div');
		const instance = mount(Filters, { target });

		// All (3)
		// People (1)
		// Posts (2)
		// Tags (no count)

		expect(target.textContent).toContain('3');
		expect(target.textContent).toContain('1');
		expect(target.textContent).toContain('2');

		const tabs = target.querySelectorAll('.search-filters__tab');
		// Tags tab is last
		expect(tabs[3].textContent).not.toContain('0');

		unmount(instance);
	});

	it('sets active tab based on state', () => {
		mockState.type = 'notes';
		const target = document.createElement('div');
		const instance = mount(Filters, { target });

		const tabs = target.querySelectorAll('.search-filters__tab');
		// Notes is 3rd tab (index 2)
		expect(tabs[2].classList.contains('search-filters__tab--active')).toBe(true);
		expect(tabs[0].classList.contains('search-filters__tab--active')).toBe(false);

		unmount(instance);
	});

	it('calls setType when tab clicked', async () => {
		const target = document.createElement('div');
		const instance = mount(Filters, { target });
		await flushSync();

		const tabs = target.querySelectorAll('.search-filters__tab');
		// Click People (index 1)
		const peopleTab = tabs[1] as HTMLButtonElement;
		peopleTab.click();
		await flushSync();

		expect(mockContext.setType).toHaveBeenCalledWith('actors');

		unmount(instance);
	});
});
