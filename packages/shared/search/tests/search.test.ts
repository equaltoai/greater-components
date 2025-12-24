import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import FederatedSearch from '../src/FederatedSearch.svelte';
import Bar from '../src/Bar.svelte';
import Results from '../src/Results.svelte';
import Root from '../src/Root.svelte';
import Filters from '../src/Filters.svelte';
import NoteResult from '../src/NoteResult.svelte';
// import * as context from '../src/context.svelte.js';

// Mock dependencies
vi.mock('@equaltoai/greater-components-primitives', () => ({
	Checkbox: () => {},
	Spinner: () => {},
	Input: () => {},
	Button: () => {},
	Badge: () => {},
}));

vi.mock('@equaltoai/greater-components-utils', () => ({
	sanitizeHtml: (html: string) => html,
}));

vi.mock('@equaltoai/greater-components-icons', () => ({
	GlobeIcon: () => {},
	SearchIcon: () => {},
	XIcon: () => {},
	FilterIcon: () => {},
	SparklesIcon: () => {},
	UsersIcon: () => {},
}));

// Mock createButton
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

// Mock getSearchContext
const mockHandlers = {
	onSearch: vi.fn(),
	onClear: vi.fn(),
	onActorClick: vi.fn(),
	onNoteClick: vi.fn(),
	onTagClick: vi.fn(),
	onFollow: vi.fn(),
};

const mockState = {
	query: '',
	type: 'all',
	results: { actors: [] as any[], notes: [] as any[], tags: [] as any[], total: 0 },
	loading: false,
	error: null as string | null,
	semantic: false,
	following: false,
	recentSearches: [],
};

// Exposed spy for search
const searchSpy = vi.fn();

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => ({
			state: mockState,
			handlers: mockHandlers,
			updateState: vi.fn((partial) => Object.assign(mockState, partial)),
			search: searchSpy, // Use exposed spy
			clear: vi.fn(),
			setType: vi.fn(),
			toggleSemantic: vi.fn(),
			toggleFollowing: vi.fn(),
		}),
		formatCount: (n: any) => n.toString(),
		highlightQuery: (text: any) => text,
	};
});

describe('FederatedSearch', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.query = '';
		mockState.results = { actors: [], notes: [], tags: [], total: 0 };
	});

	it('renders instances and toggles them', async () => {
		const target = document.createElement('div');
		const onInstancesChange = vi.fn();
		const instance = mount(FederatedSearch, {
			target,
			props: {
				instances: ['instance1.com', 'instance2.com'],
				enabled: true,
				onInstancesChange,
			},
		});

		const instances = target.querySelectorAll('.federated-search__instance');
		expect(instances.length).toBe(2);

		unmount(instance);
	});

	it('performs federated search when query exists and enabled', async () => {
		const target = document.createElement('div');
		const onSearch = vi.fn().mockResolvedValue(new Map([['instance1.com', { total: 5 }]]));

		mockState.query = 'test';

		const instance = mount(FederatedSearch, {
			target,
			props: {
				instances: ['instance1.com'],
				enabled: true,
				onSearch,
			},
		});

		await flushSync();
		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(onSearch).toHaveBeenCalledWith('test', ['instance1.com']);

		unmount(instance);
	});
});

describe('Bar', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.query = '';
	});

	it('renders and updates query', async () => {
		const target = document.createElement('div');
		const instance = mount(Bar, { target });
		await flushSync();

		const input = target.querySelector('.search-bar__input') as HTMLInputElement;
		input.value = 'hello';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await flushSync();

		expect(mockState.query).toBe('hello');
		unmount(instance);
	});

	it('submits search', async () => {
		const target = document.createElement('div');
		mockState.query = 'hello';
		const instance = mount(Bar, { target });
		await flushSync(); // Ensure actions run

		const submitBtn = target.querySelector('.search-bar__submit') as HTMLButtonElement;
		expect(submitBtn).toBeTruthy();
		expect(submitBtn.disabled).toBe(false);

		submitBtn.dispatchEvent(new Event('click', { bubbles: true }));
		await flushSync();

		expect(searchSpy).toHaveBeenCalled();
		unmount(instance);
	});
});

describe('Results', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.loading = false;
		mockState.error = null;
		mockState.results = { actors: [], notes: [], tags: [], total: 0 };
		mockState.query = '';
	});

	it('shows loading state', async () => {
		mockState.loading = true;
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.search-results__loading')).toBeTruthy();
		unmount(instance);
	});

	it('shows error state', async () => {
		mockState.error = 'Something went wrong';
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.search-results__error')).toBeTruthy();
		expect(target.textContent).toContain('Something went wrong');
		unmount(instance);
	});

	it('shows empty state', async () => {
		mockState.query = 'test'; // Query must be present for empty state to show
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.search-results__empty')).toBeTruthy();
		unmount(instance);
	});

	it('renders actors results', async () => {
		mockState.results = {
			actors: [{ id: '1', username: 'user1', displayName: 'User 1' }],
			notes: [],
			tags: [],
			total: 1,
		};
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.search-results__heading')?.textContent).toBe('People');
		expect(target.querySelector('.actor-result')).toBeTruthy();
		expect(target.textContent).toContain('User 1');

		unmount(instance);
	});

	it('renders tags results', async () => {
		mockState.results = {
			actors: [],
			notes: [],
			tags: [{ name: 'svelte', count: 100 }],
			total: 1,
		};
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.search-results__heading')?.textContent).toBe('Tags');
		expect(target.querySelector('.tag-result')).toBeTruthy();
		expect(target.textContent).toContain('#svelte');

		unmount(instance);
	});
});

describe('Search Smoke Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders Root', () => {
		const target = document.createElement('div');
		const instance = mount(Root, { target, props: { handlers: mockHandlers } });
		// Root renders context, usually slot.
		unmount(instance);
	});

	it('renders Filters', () => {
		const target = document.createElement('div');
		const instance = mount(Filters, { target });
		expect(target.querySelector('.search-filters')).toBeTruthy();
		unmount(instance);
	});

	it('renders NoteResult', async () => {
		const target = document.createElement('div');
		const note = {
			id: '1',
			content: 'Hello world',
			author: { id: 'u1', username: 'user', displayName: 'User' },
			createdAt: new Date().toISOString(),
		};
		const instance = mount(NoteResult, { target, props: { note } });
		await flushSync();
		expect(target.querySelector('.note-result')).toBeTruthy();
		expect(target.textContent).toContain('Hello world');
		unmount(instance);
	});
});
