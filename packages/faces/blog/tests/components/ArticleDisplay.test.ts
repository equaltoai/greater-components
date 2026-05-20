import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import {
	Article,
	ArticleCard,
	ArticleIndexCard,
	ArticleReader,
	normalizeArticleData,
} from '../../src/components/Article/index.js';
import type { ArticleDisplayData } from '../../src/types.js';

vi.mock('@equaltoai/greater-components-utils', () => ({
	formatDateTime: (date: Date | string) => new Date(date).toISOString().split('T')[0],
	sanitizeHtml: (html: string) => html,
}));

const flatArticle: ArticleDisplayData = {
	id: 'emdash-article-1',
	slug: 'proven-blog-gaps',
	title: 'Proven Blog Gaps',
	subtitle: 'What Emdash needs from Greater',
	excerpt: 'A first-app proven article display gap.',
	content: '<h2>Evidence</h2><p>Rendered by Lesser.</p>',
	contentFormat: 'HTML',
	author: {
		id: 'actor-1',
		username: 'writer',
		displayName: 'Demo Writer',
		avatarUrl: '/avatar.png',
	},
	publishedAt: '2026-05-20T12:00:00.000Z',
	updatedAt: '2026-05-20T13:00:00.000Z',
	readingTimeMinutes: 4,
	wordCount: 820,
	canonicalUrl: 'https://example.test/articles/proven-blog-gaps',
	categories: [
		{ id: 'c1', name: 'Fediverse', slug: 'fediverse' },
		{ id: 'c2', name: 'Greater', slug: 'greater' },
	],
	featuredImage: {
		url: '/article.png',
		altText: 'Article illustration',
	},
};

describe('Article complete display exports', () => {
	it('keeps additive aliases on the Article namespace', () => {
		expect(Article.Reader).toBe(ArticleReader);
		expect(Article.Card).toBe(ArticleCard);
		expect(Article.IndexCard).toBe(ArticleIndexCard);
	});

	it('normalizes flat Lesser/Emdash ArticleData-shaped input', () => {
		const article = normalizeArticleData(flatArticle);

		expect(article.contentFormat).toBe('html');
		expect(article.author.name).toBe('Demo Writer');
		expect(article.metadata.title).toBe('Proven Blog Gaps');
		expect(article.metadata.description).toBe('A first-app proven article display gap.');
		expect(article.metadata.readingTime).toBe(4);
		expect(article.metadata.tags).toEqual(['Fediverse', 'Greater']);
		expect(article.metadata.featuredImage).toBe('/article.png');
	});

	it('renders an SSR-friendly ArticleReader without browser-only affordances by default', () => {
		render(ArticleReader, { props: { article: flatArticle } });

		expect(screen.getByRole('article')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 1, name: 'Proven Blog Gaps' })).toBeInTheDocument();
		expect(screen.getByText('What Emdash needs from Greater')).toBeInTheDocument();
		expect(screen.getByText('Rendered by Lesser.')).toBeInTheDocument();
		expect(screen.getByText('Demo Writer')).toBeInTheDocument();
		expect(screen.queryByRole('progressbar')).toBeNull();
	});

	it('renders an accessible ArticleCard for index routes', () => {
		render(ArticleCard, {
			props: {
				article: flatArticle,
				href: '/journal/proven-blog-gaps',
			},
		});

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/journal/proven-blog-gaps');
		expect(screen.getByRole('heading', { level: 2, name: 'Proven Blog Gaps' })).toBeInTheDocument();
		expect(screen.getByText('Demo Writer')).toBeInTheDocument();
		expect(screen.getByText('4 min read')).toBeInTheDocument();
		expect(screen.getByText('Fediverse')).toBeInTheDocument();
		expect(screen.getByText('Greater')).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Article illustration' })).toBeInTheDocument();
	});
});
