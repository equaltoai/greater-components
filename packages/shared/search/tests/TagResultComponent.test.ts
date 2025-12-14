import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import TagResult from '../src/TagResult.svelte';

const { mockHandlers, mockContext } = vi.hoisted(() => {
	const handlers = { onTagClick: vi.fn() };
	return {
		mockHandlers: handlers,
		mockContext: {
			handlers,
			formatCount: (n: number) => n.toString(),
		},
	};
});

vi.mock('../src/context.svelte.js', async () => {
	const actual = await vi.importActual('../src/context.svelte.js');
	return {
		...actual,
		getSearchContext: () => mockContext,
		formatCount: (n: number) => n.toString(),
	};
});

describe('TagResult Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockTag = {
		name: 'svelte',
		count: 100,
		trending: false,
	};

	it('renders tag details', () => {
		const target = document.createElement('div');
		const instance = mount(TagResult, {
			target,
			props: { tag: mockTag },
		});

		expect(target.textContent).toContain('#svelte');
		expect(target.textContent).toContain('100 posts');
		expect(target.querySelector('.tag-result--trending')).toBeFalsy();

		unmount(instance);
	});

	it('renders trending state', () => {
		const target = document.createElement('div');
		const instance = mount(TagResult, {
			target,
			props: { tag: { ...mockTag, trending: true } },
		});

		expect(target.querySelector('.tag-result--trending')).toBeTruthy();
		expect(target.querySelector('.tag-result__trending-icon')).toBeTruthy();

		unmount(instance);
	});

	it('handles click', async () => {
		const target = document.createElement('div');
		const instance = mount(TagResult, {
			target,
			props: { tag: mockTag },
		});
		await flushSync();

		const btn = target.querySelector('.tag-result') as HTMLButtonElement;
		btn.click();
		await flushSync();

		expect(mockHandlers.onTagClick).toHaveBeenCalledWith(mockTag);

		unmount(instance);
	});
});
