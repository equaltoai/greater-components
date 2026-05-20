// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Article } from '../src/components/Article/index.js';
import { ArticleIndexCard, ArticleReader } from '../src/index.js';
import ArticleTestWrapper from './fixtures/ArticleTestWrapper.svelte';
import { createMockArticle } from './mocks/mockArticle.js';
import type { ArticleDisplayData } from '../src/types.js';

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

	it('renders ArticleReader from flat ArticleData-shaped input on the server', () => {
		const article: ArticleDisplayData = {
			id: 'ssr-reader',
			slug: 'ssr-reader',
			title: 'SSR Reader',
			excerpt: 'Server-rendered display surface',
			content: '<h2>Server body</h2><p>Rendered by Lesser.</p>',
			contentFormat: 'HTML',
			author: {
				id: 'author-1',
				username: 'writer',
				displayName: 'Demo Writer',
			},
			publishedAt: '2026-05-20T12:00:00.000Z',
			readingTimeMinutes: 3,
			categories: [{ name: 'Greater' }],
		};

		const result = render(ArticleReader, {
			props: { article },
		});

		expect(result.body).toContain('SSR Reader');
		expect(result.body).toContain('Rendered by Lesser.');
		expect(result.body).not.toContain('role="progressbar"');
	});

	it('renders ArticleIndexCard on the server from the public card export', () => {
		const article = createMockArticle('ssr-card', {
			slug: 'server-card',
			metadata: {
				...createMockArticle('ssr-card').metadata,
				title: 'Server Card',
			},
		});

		const result = render(ArticleIndexCard, {
			props: { article, href: '/articles/server-card' },
		});

		expect(result.body).toContain('href="/articles/server-card"');
		expect(result.body).toContain('Server Card');
		expect(result.body).toContain('Article tags');
	});
});
