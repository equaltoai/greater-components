import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import RootWrapper from './RootWrapper.svelte';
import { createSearchContext } from '../src/context.svelte.js';

// Mock the context creation
vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		createSearchContext: vi.fn((state, handlers) => {
			return {
				state,
				handlers,
				search: vi.fn(),
				clear: vi.fn(),
				setType: vi.fn(),
				toggleSemantic: vi.fn(),
				toggleFollowing: vi.fn(),
				addRecentSearch: vi.fn(),
				clearRecentSearches: vi.fn(),
			};
		}),
	};
});

describe('Root Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders children and applies custom class', () => {
		const target = document.createElement('div');
		const instance = mount(RootWrapper, {
			target,
			props: {
				className: 'custom-class',
			},
		});

		const rootDiv = target.querySelector('.search-root');
		expect(rootDiv).toBeTruthy();
		expect(rootDiv?.classList.contains('custom-class')).toBe(true);
		expect(target.querySelector('[data-testid="child-content"]')).toBeTruthy();

		unmount(instance);
	});

	it('triggers search with initialQuery', async () => {
		const target = document.createElement('div');
		const instance = mount(RootWrapper, {
			target,
			props: {
				initialQuery: 'test query',
			},
		});

		// Use flushSync to ensure effects run
		await flushSync();

		// Get the mock context return value
		const mockContext = vi.mocked(createSearchContext).mock.results[0].value;

		expect(mockContext.search).toHaveBeenCalledWith('test query');

		unmount(instance);
	});

	it('does not trigger search without initialQuery', async () => {
		const target = document.createElement('div');
		const instance = mount(RootWrapper, {
			target,
			props: {
				initialQuery: '',
			},
		});

		await flushSync();

		const mockContext = vi.mocked(createSearchContext).mock.results[0].value;

		expect(mockContext.search).not.toHaveBeenCalled();

		unmount(instance);
	});

	it('passes handlers to context', () => {
		const target = document.createElement('div');
		const handlers = {
			onSearch: vi.fn(),
		};

		const instance = mount(RootWrapper, {
			target,
			props: {
				handlers,
			},
		});

		expect(createSearchContext).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining(handlers)
		);

		unmount(instance);
	});
});
