import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount } from 'svelte';
import Results from '../src/Results.svelte';

// Mock sub-components
vi.mock('../src/ActorResult.svelte', async () => ({
	default: (await import('./mocks/MockActorResult.svelte')).default,
}));
vi.mock('../src/NoteResult.svelte', async () => ({
	default: (await import('./mocks/MockNoteResult.svelte')).default,
}));
vi.mock('../src/TagResult.svelte', async () => ({
	default: (await import('./mocks/MockTagResult.svelte')).default,
}));

const { mockState } = vi.hoisted(() => {
	return {
		mockState: {
			query: '',
			type: 'all',
			results: { actors: [] as any[], notes: [] as any[], tags: [] as any[], total: 0 },
			loading: false,
			error: null as string | null,
			semantic: false,
		},
	};
});

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => ({ state: mockState }),
	};
});

describe('Results Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockState.query = '';
		mockState.type = 'all';
		mockState.results = { actors: [], notes: [], tags: [], total: 0 };
		mockState.loading = false;
		mockState.error = null;
		mockState.semantic = false;
	});

	it('renders loading state', () => {
		mockState.loading = true;
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.textContent).toContain('Searching...');
		expect(target.textContent).not.toContain('with AI');
		expect(target.querySelector('.search-results__spinner')).toBeTruthy();

		unmount(instance);
	});

	it('renders semantic loading state', () => {
		mockState.loading = true;
		mockState.semantic = true;
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.textContent).toContain('Searching with AI...');

		unmount(instance);
	});

	it('renders error state', () => {
		mockState.error = 'Failed to load';
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.textContent).toContain('Failed to load');

		unmount(instance);
	});

	it('renders empty state when query present but no results', () => {
		mockState.query = 'test';
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.textContent).toContain('No results found');

		unmount(instance);
	});

	it('renders nothing when query empty and no results', () => {
		mockState.query = '';
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.textContent).toBe('');

		unmount(instance);
	});

	it('renders filtered results (all)', () => {
		mockState.query = 'test';
		mockState.results = {
			actors: [{ id: '1' }],
			notes: [{ id: '1' }],
			tags: [{ name: 'tag' }],
			total: 3,
		};
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.mock-actor-result')).toBeTruthy();
		expect(target.querySelector('.mock-note-result')).toBeTruthy();
		expect(target.querySelector('.mock-tag-result')).toBeTruthy();

		unmount(instance);
	});

	it('renders filtered results (actors only)', () => {
		mockState.query = 'test';
		mockState.type = 'actors';
		mockState.results = {
			actors: [{ id: '1' }],
			notes: [{ id: '1' }],
			tags: [{ name: 'tag' }],
			total: 3,
		};
		const target = document.createElement('div');
		const instance = mount(Results, { target });

		expect(target.querySelector('.mock-actor-result')).toBeTruthy();
		expect(target.querySelector('.mock-note-result')).toBeFalsy();
		expect(target.querySelector('.mock-tag-result')).toBeFalsy();

		unmount(instance);
	});
});
