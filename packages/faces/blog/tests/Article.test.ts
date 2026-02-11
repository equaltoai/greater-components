import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import ArticleRoot from '../src/components/Article/Root.svelte';
import FullArticleTestWrapper from './fixtures/FullArticleTestWrapper.svelte';
import type { ArticleData } from '../src/types.js';

// Mock dependencies
vi.mock('@equaltoai/greater-components-utils', () => ({
	formatDateTime: (date: Date) => date.toISOString().split('T')[0],
	sanitizeHtml: (html: string) => html,
}));

describe('Article Component', () => {
	const _mockArticle: ArticleData = {
		id: '1',
		slug: 'test-article',
		metadata: {
			title: 'Test Article Title',
			description: 'Test article description',
			publishedAt: new Date('2024-01-15'),
			readingTime: 5,
			tags: ['test', 'svelte'],
			featuredImage: 'image.jpg',
			featuredImageAlt: 'Alt text',
			category: 'Tech',
		},
		content: '<h2>Introduction</h2><p>Test content</p><h3>Details</h3>',
		contentFormat: 'html',
		author: {
			id: '1',
			name: 'Test Author',
			avatar: '/avatar.jpg',
		},
		isPublished: true,
	};

	describe('Article.Root', () => {
		it('renders article container with correct class', async () => {
			const { container } = render(ArticleRoot, {
				article: _mockArticle,
			});
			expect(container.querySelector('.gr-blog-article')).toBeTruthy();
		});

		it('applies density class when specified', async () => {
			const { container } = render(ArticleRoot, {
				article: _mockArticle,
				config: { density: 'compact' },
			});
			expect(container.querySelector('.gr-blog-article--compact')).toBeTruthy();
		});

		it('sets data-article-id attribute', async () => {
			const { container } = render(ArticleRoot, {
				article: _mockArticle,
			});
			expect(container.querySelector('[data-article-id="1"]')).toBeTruthy();
		});

		it('applies tag classes', async () => {
			const { container } = render(ArticleRoot, {
				article: _mockArticle,
			});
			expect(container.querySelector('.gr-blog-article--tag-test')).toBeTruthy();
			expect(container.querySelector('.gr-blog-article--tag-svelte')).toBeTruthy();
		});
	});

	describe('Article Integration', () => {
		it('renders header, content, and footer via wrapper', async () => {
			render(FullArticleTestWrapper, { article: _mockArticle });

			// Header
			expect(screen.getByRole('heading', { name: 'Test Article Title' })).toBeTruthy();
			expect(screen.getByText('5 min read')).toBeTruthy();
			expect(screen.getByText('Tech')).toBeTruthy();
			expect(screen.getByRole('img', { name: 'Alt text' })).toBeTruthy();

			// Content (headings from HTML)
			expect(screen.getByRole('heading', { name: 'Introduction' })).toBeTruthy();
			expect(screen.getByRole('heading', { name: 'Details' })).toBeTruthy();

			// Footer
			expect(screen.getByText('test')).toBeTruthy(); // tag
			expect(screen.getByText('svelte')).toBeTruthy(); // tag
			expect(screen.getByText('Test Author')).toBeTruthy();

			// ReadingProgress
			expect(screen.getByRole('progressbar')).toBeTruthy();

			// RelatedPosts
			expect(screen.getByText('Related Posts')).toBeTruthy();
			expect(screen.getByText('Related 1')).toBeTruthy();
		});

		it('handles share actions', async () => {
			render(FullArticleTestWrapper, { article: _mockArticle });

			// Mock window.open and clipboard
			const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
			const writeTextSpy = vi.fn().mockResolvedValue(undefined);
			Object.assign(navigator, {
				clipboard: {
					writeText: writeTextSpy,
				},
			});

			// Twitter share
			const twitterBtn = screen.getByText('Twitter');
			await fireEvent.click(twitterBtn);
			expect(openSpy).toHaveBeenCalled();
			expect(openSpy.mock.calls[0][0]).toContain('twitter.com');

			// Copy link
			const copyBtn = screen.getByText('Copy Link');
			await fireEvent.click(copyBtn);
			expect(writeTextSpy).toHaveBeenCalled();
		});

		it('renders markdown content fallback', () => {
			const markdownArticle = {
				..._mockArticle,
				contentFormat: 'markdown' as const,
				content: 'Markdown content',
			};

			render(FullArticleTestWrapper, { article: markdownArticle });
			expect(screen.getByText('Markdown content')).toBeTruthy();
		});

		it('hides author when configured', () => {
			render(FullArticleTestWrapper, {
				article: _mockArticle,
				config: { showAuthor: false },
			});
			expect(screen.queryByText('Test Author')).toBeNull();
		});
	});
});
