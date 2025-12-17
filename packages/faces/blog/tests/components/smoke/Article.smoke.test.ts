import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Article } from '../../../src/components/Article/index.js';
import ArticleTestWrapper from '../../fixtures/ArticleTestWrapper.svelte';
import { createMockArticle } from '../../mocks/mockArticle.js';

describe('Article Components Smoke Tests', () => {
	const mockArticle = createMockArticle('smoke-test');

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Article Subcomponents', () => {
		const components = [
			{ name: 'Header', Component: Article.Header },
			{ name: 'Content', Component: Article.Content },
			{ name: 'Footer', Component: Article.Footer },
			{ name: 'TableOfContents', Component: Article.TableOfContents },
			{ name: 'ReadingProgress', Component: Article.ReadingProgress },
			{ name: 'ShareBar', Component: Article.ShareBar },
			{ name: 'RelatedPosts', Component: Article.RelatedPosts },
		];

		it.each(components)('renders $name without errors', ({ Component }) => {
			render(ArticleTestWrapper, {
				props: {
					article: mockArticle,
					component: Component,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});

	describe('Article.Root', () => {
		it('renders without errors', () => {
			render(ArticleTestWrapper, {
				props: {
					article: mockArticle,
				},
			});
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
