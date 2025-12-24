import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getContext, setContext } from 'svelte';
import {
	createNavigationContext,
	getNavigationContext,
	hasNavigationContext,
	NAVIGATION_CONTEXT_KEY,
} from '../../../src/components/Navigation/context.js';
import type { ArchiveEntry, CategoryData, TagData } from '../../../src/types.js';

// Mock Svelte context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('Navigation Context', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createNavigationContext', () => {
		it('creates context with default values', () => {
			const context = createNavigationContext();

			expect(setContext).toHaveBeenCalledWith(
				NAVIGATION_CONTEXT_KEY,
				expect.objectContaining({
					archives: [],
					tags: [],
					categories: [],
					currentPath: '',
				})
			);

			expect(context).toEqual({
				archives: [],
				tags: [],
				categories: [],
				currentPath: '',
			});
		});

		it('creates context with provided values', () => {
			const archives: ArchiveEntry[] = [{ year: 2023, months: [] }];
			const tags: TagData[] = [{ slug: 'tag', name: 'Tag', count: 1 }];
			const categories: CategoryData[] = [{ slug: 'cat', name: 'Cat', count: 1 }];
			const currentPath = '/blog';

			createNavigationContext(archives, tags, categories, currentPath);

			expect(setContext).toHaveBeenCalledWith(NAVIGATION_CONTEXT_KEY, {
				archives,
				tags,
				categories,
				currentPath,
			});
		});
	});

	describe('getNavigationContext', () => {
		it('returns context when it exists', () => {
			const mockContext = { archives: [], tags: [], categories: [], currentPath: '' };
			vi.mocked(getContext).mockReturnValue(mockContext);

			const result = getNavigationContext();
			expect(result).toBe(mockContext);
			expect(getContext).toHaveBeenCalledWith(NAVIGATION_CONTEXT_KEY);
		});

		it('throws error when context is missing', () => {
			vi.mocked(getContext).mockReturnValue(undefined);

			expect(() => getNavigationContext()).toThrow('Navigation context not found');
		});
	});

	describe('hasNavigationContext', () => {
		it('returns true when context exists', () => {
			vi.mocked(getContext).mockReturnValue({});
			expect(hasNavigationContext()).toBe(true);
		});

		it('returns false when context is missing (returns undefined)', () => {
			vi.mocked(getContext).mockReturnValue(undefined);
			expect(hasNavigationContext()).toBe(false);
		});

		it('returns false when getContext throws', () => {
			vi.mocked(getContext).mockImplementation(() => {
				throw new Error('Error');
			});
			expect(hasNavigationContext()).toBe(false);
		});
	});
});
