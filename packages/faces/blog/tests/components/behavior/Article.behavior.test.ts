import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Article } from '../../../src/components/Article/index.js';
import ArticleTestWrapper from '../../fixtures/ArticleTestWrapper.svelte';
import ArticleWithTOC from '../../fixtures/ArticleWithTOC.svelte';
import { createMockArticle } from '../../mocks/mockArticle.js';

describe('Article Behavior', () => {
	const mockArticle = createMockArticle('behavior-1', {
		content: '<h2 id="section-1">Section 1</h2><p>Content</p><h2 id="section-2">Section 2</h2>',
		contentFormat: 'html',
	});

	const handlers = {
		onBookmark: vi.fn(),
		onShare: vi.fn(),
		onReact: vi.fn(),
		onComment: vi.fn(),
		onHeadingClick: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal('open', vi.fn());
		// Mock navigator.clipboard
		Object.assign(navigator, {
			clipboard: {
				writeText: vi.fn(),
			},
		});
	});

	describe('ShareBar', () => {
		it('triggers onShare handler when platform button is clicked', async () => {
			render(ArticleTestWrapper, {
				props: {
					article: mockArticle,
					handlers,
					component: Article.ShareBar,
				},
			});

			const twitterButton = screen.getByText('Twitter');
			await fireEvent.click(twitterButton);

			expect(handlers.onShare).toHaveBeenCalledWith(
				expect.objectContaining({ id: mockArticle.id }),
				'twitter'
			);
			expect(window.open).toHaveBeenCalled();
		});

		it('copies link when Copy Link is clicked', async () => {
			render(ArticleTestWrapper, {
				props: {
					article: mockArticle,
					handlers,
					component: Article.ShareBar,
				},
			});

			const copyButton = screen.getByText('Copy Link');
			await fireEvent.click(copyButton);

			expect(navigator.clipboard.writeText).toHaveBeenCalled();
			expect(handlers.onShare).toHaveBeenCalledWith(
				expect.objectContaining({ id: mockArticle.id }),
				'copy'
			);
		});
	});

	describe.skip('ReadingProgress', () => {
		it('updates progress on scroll', async () => {
			render(ArticleTestWrapper, {
				props: {
					article: mockArticle,
					component: Article.ReadingProgress,
				},
			});

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-valuenow', '0');

			// Mock scroll dimensions and position
			Object.defineProperty(document.documentElement, 'scrollHeight', {
				value: 2000,
				writable: true,
			});
			Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });

			// JSDOM window.scrollY is read-only, we need to redefine it
			Object.defineProperty(window, 'scrollY', { value: 500, writable: true });

			window.dispatchEvent(new Event('scroll'));

			// Wait for update (500 / (2000 - 1000) = 0.5 = 50%)
			await waitFor(() => {
				expect(progressBar).toHaveAttribute('aria-valuenow', '50');
			});
		});
	});

	describe.skip('TableOfContents', () => {
		it('generates links from content headings and handles clicks', async () => {
			render(ArticleWithTOC, {
				props: {
					article: mockArticle,
					handlers,
				},
			});

			// Check if headings are rendered
			expect(await screen.findByText('Section 1')).toBeInTheDocument();
			expect(screen.getByText('Section 2')).toBeInTheDocument();

			// Ensure the content element has the ID (critical for scrollToHeading)
			expect(document.getElementById('section-1')).not.toBeNull();

			// Click heading button
			const link = await screen.findByRole('button', { name: 'Section 1' });
			await fireEvent.click(link);

			expect(handlers.onHeadingClick).toHaveBeenCalledWith('section-1');
			expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
		});
	});
});
