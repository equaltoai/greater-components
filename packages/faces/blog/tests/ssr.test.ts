// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Article } from '../src/components/Article/index.js';
import ArticleTestWrapper from './fixtures/ArticleTestWrapper.svelte';
import { createMockArticle } from './mocks/mockArticle.js';

describe('Blog face SSR safety', () => {
	it('renders Article.Root with ShareBar on the server without browser globals', () => {
		const article = createMockArticle('ssr-article');
		const result = render(ArticleTestWrapper, {
			props: {
				article,
				component: Article.ShareBar,
			},
		});

		expect(result.body).toContain(article.id);
		expect(result.body).toContain('Copy Link');
	});
});
