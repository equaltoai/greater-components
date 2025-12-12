/**
 * Article Context Tests
 *
 * Tests for Article component context and helper functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ArticleData, ArticleConfig, ArticleHandlers, HeadingData } from '../src/types';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

// Import after mock is set up
import {
	ARTICLE_CONTEXT_KEY,
	DEFAULT_ARTICLE_CONFIG,
	createArticleContext,
	getArticleContext,
	hasArticleContext,
	updateHeadings,
	updateActiveHeading,
	updateScrollProgress,
} from '../src/components/Article/context';

// Test data factories
const makeArticle = (id: string = '1', overrides: Partial<ArticleData> = {}): ArticleData => ({
	id,
	slug: `test-article-${id}`,
	metadata: {
		title: 'Test Article Title',
		description: 'Test article description',
		publishedAt: new Date('2024-01-15'),
		readingTime: 5,
		tags: ['test', 'svelte'],
	},
	content: '<p>Test content</p>',
	contentFormat: 'html',
	author: {
		id: '1',
		name: 'Test Author',
		avatar: '/avatar.jpg',
	},
	isPublished: true,
	...overrides,
});

const makeHeadings = (): HeadingData[] => [
	{ id: 'intro', text: 'Introduction', level: 2 },
	{ id: 'getting-started', text: 'Getting Started', level: 2 },
	{ id: 'prerequisites', text: 'Prerequisites', level: 3 },
	{ id: 'conclusion', text: 'Conclusion', level: 2 },
];

describe('Article Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	describe('ARTICLE_CONTEXT_KEY', () => {
		it('should be a unique symbol', () => {
			expect(typeof ARTICLE_CONTEXT_KEY).toBe('symbol');
			expect(ARTICLE_CONTEXT_KEY.description).toBe('article-context');
		});
	});

	describe('DEFAULT_ARTICLE_CONFIG', () => {
		it('should have comfortable density by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.density).toBe('comfortable');
		});

		it('should show table of contents by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showTableOfContents).toBe(true);
		});

		it('should show reading progress by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showReadingProgress).toBe(true);
		});

		it('should show share bar by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showShareBar).toBe(true);
		});

		it('should show related posts by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showRelatedPosts).toBe(true);
		});

		it('should show author by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showAuthor).toBe(true);
		});

		it('should hide comments by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.showComments).toBe(false);
		});

		it('should have empty class by default', () => {
			expect(DEFAULT_ARTICLE_CONFIG.class).toBe('');
		});
	});

	describe('createArticleContext', () => {
		it('creates context with article data', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			expect(context.article).toBe(article);
		});

		it('creates context with default config', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			expect(context.config.density).toBe('comfortable');
			expect(context.config.showTableOfContents).toBe(true);
		});

		it('merges custom config with defaults', () => {
			const article = makeArticle();
			const customConfig: ArticleConfig = {
				density: 'compact',
				showComments: true,
			};
			const context = createArticleContext(article, customConfig);

			expect(context.config.density).toBe('compact');
			expect(context.config.showComments).toBe(true);
			expect(context.config.showTableOfContents).toBe(true); // from defaults
		});

		it('creates context with handlers', () => {
			const article = makeArticle();
			const handlers: ArticleHandlers = {
				onBookmark: vi.fn(),
				onShare: vi.fn(),
			};
			const context = createArticleContext(article, {}, handlers);

			expect(context.handlers.onBookmark).toBeDefined();
			expect(context.handlers.onShare).toBeDefined();
		});

		it('initializes with empty headings', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			expect(context.headings).toEqual([]);
		});

		it('initializes with null activeHeadingId', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			expect(context.activeHeadingId).toBeNull();
		});

		it('initializes with zero scrollProgress', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			expect(context.scrollProgress).toBe(0);
		});

		it('stores context using setContext', () => {
			const article = makeArticle();
			createArticleContext(article);

			expect(contextStore.has(ARTICLE_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getArticleContext', () => {
		it('retrieves stored context', () => {
			const article = makeArticle();
			const createdContext = createArticleContext(article);
			const retrievedContext = getArticleContext();

			expect(retrievedContext).toBe(createdContext);
		});

		it('throws error when context does not exist', () => {
			contextStore.clear();

			expect(() => getArticleContext()).toThrow(
				'Article context not found. Make sure this component is used within an Article.Root component.'
			);
		});
	});

	describe('hasArticleContext', () => {
		it('returns true when context exists', () => {
			const article = makeArticle();
			createArticleContext(article);

			expect(hasArticleContext()).toBe(true);
		});

		it('returns false when context does not exist', () => {
			contextStore.clear();

			expect(hasArticleContext()).toBe(false);
		});
	});

	describe('updateHeadings', () => {
		it('updates headings in context', () => {
			const article = makeArticle();
			const context = createArticleContext(article);
			const headings = makeHeadings();

			updateHeadings(context, headings);

			expect(context.headings).toEqual(headings);
		});

		it('replaces existing headings', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateHeadings(context, [{ id: 'first', text: 'First', level: 2 }]);
			updateHeadings(context, [{ id: 'second', text: 'Second', level: 2 }]);

			expect(context.headings).toHaveLength(1);
			expect(context.headings[0].id).toBe('second');
		});
	});

	describe('updateActiveHeading', () => {
		it('updates activeHeadingId in context', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateActiveHeading(context, 'intro');

			expect(context.activeHeadingId).toBe('intro');
		});

		it('accepts null to clear active heading', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateActiveHeading(context, 'intro');
			updateActiveHeading(context, null);

			expect(context.activeHeadingId).toBeNull();
		});
	});

	describe('updateScrollProgress', () => {
		it('updates scrollProgress in context', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateScrollProgress(context, 0.5);

			expect(context.scrollProgress).toBe(0.5);
		});

		it('clamps progress to minimum of 0', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateScrollProgress(context, -0.5);

			expect(context.scrollProgress).toBe(0);
		});

		it('clamps progress to maximum of 1', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateScrollProgress(context, 1.5);

			expect(context.scrollProgress).toBe(1);
		});

		it('handles boundary values correctly', () => {
			const article = makeArticle();
			const context = createArticleContext(article);

			updateScrollProgress(context, 0);
			expect(context.scrollProgress).toBe(0);

			updateScrollProgress(context, 1);
			expect(context.scrollProgress).toBe(1);
		});
	});
});

describe('Blog Types', () => {
	describe('ArticleData', () => {
		it('supports full article with all fields', () => {
			const article: ArticleData = {
				id: '1',
				slug: 'full-article',
				metadata: {
					title: 'Full Article',
					subtitle: 'With all fields',
					description: 'A complete article',
					publishedAt: new Date('2024-01-15'),
					updatedAt: new Date('2024-01-20'),
					readingTime: 10,
					wordCount: 2000,
					featuredImage: '/images/featured.jpg',
					featuredImageAlt: 'Featured image alt',
					featuredImageCaption: 'Photo credit',
					canonicalUrl: 'https://example.com/article',
					tags: ['test', 'full'],
					category: 'Technology',
					series: {
						id: 'series-1',
						title: 'Test Series',
						description: 'A test series',
						totalParts: 3,
						currentPart: 1,
						parts: [
							{ number: 1, title: 'Part 1', slug: 'part-1', isPublished: true },
							{ number: 2, title: 'Part 2', slug: 'part-2', isPublished: true },
							{ number: 3, title: 'Part 3', slug: 'part-3', isPublished: false },
						],
					},
				},
				content: '<h1>Content</h1>',
				contentFormat: 'html',
				author: {
					id: '1',
					name: 'Author Name',
					username: 'author',
					bio: 'Author bio',
					avatar: '/avatar.jpg',
					socialLinks: {
						twitter: '@author',
						github: 'author',
					},
				},
				publication: {
					id: 'pub-1',
					name: 'Test Publication',
					tagline: 'Testing all the things',
				},
				isPublished: true,
				isFeatured: true,
				viewCount: 1000,
				reactions: {
					total: 50,
					byType: { like: 40, love: 10 },
					userReaction: 'like',
				},
				commentCount: 10,
			};

			expect(article.id).toBe('1');
			expect(article.metadata.series?.totalParts).toBe(3);
			expect(article.reactions?.total).toBe(50);
		});

		it('supports minimal article with required fields only', () => {
			const article: ArticleData = {
				id: '2',
				slug: 'minimal',
				metadata: {
					title: 'Minimal',
					description: 'Minimal article',
					publishedAt: new Date(),
				},
				content: 'Content',
				contentFormat: 'markdown',
				author: {
					id: '1',
					name: 'Author',
				},
				isPublished: false,
			};

			expect(article.id).toBe('2');
			expect(article.metadata.readingTime).toBeUndefined();
			expect(article.reactions).toBeUndefined();
		});
	});

	describe('HeadingData', () => {
		it('supports all heading levels', () => {
			const headings: HeadingData[] = [
				{ id: 'h1', text: 'Heading 1', level: 1 },
				{ id: 'h2', text: 'Heading 2', level: 2 },
				{ id: 'h3', text: 'Heading 3', level: 3 },
				{ id: 'h4', text: 'Heading 4', level: 4 },
				{ id: 'h5', text: 'Heading 5', level: 5 },
				{ id: 'h6', text: 'Heading 6', level: 6 },
			];

			expect(headings).toHaveLength(6);
			headings.forEach((h, i) => {
				expect(h.level).toBe(i + 1);
			});
		});
	});

	describe('ArticleConfig', () => {
		it('supports all density options', () => {
			const compact: ArticleConfig = { density: 'compact' };
			const comfortable: ArticleConfig = { density: 'comfortable' };
			const spacious: ArticleConfig = { density: 'spacious' };

			expect(compact.density).toBe('compact');
			expect(comfortable.density).toBe('comfortable');
			expect(spacious.density).toBe('spacious');
		});
	});

	describe('ArticleHandlers', () => {
		it('supports all handler types', async () => {
			const article = makeArticle();
			const handlers: ArticleHandlers = {
				onBookmark: vi.fn(),
				onShare: vi.fn(),
				onReact: vi.fn(),
				onComment: vi.fn(),
				onHeadingClick: vi.fn(),
			};

			await handlers.onBookmark?.(article);
			await handlers.onShare?.(article, 'twitter');
			await handlers.onReact?.(article, 'like');
			await handlers.onComment?.(article, 'Great article!');
			handlers.onHeadingClick?.('intro');

			expect(handlers.onBookmark).toHaveBeenCalledWith(article);
			expect(handlers.onShare).toHaveBeenCalledWith(article, 'twitter');
			expect(handlers.onReact).toHaveBeenCalledWith(article, 'like');
			expect(handlers.onComment).toHaveBeenCalledWith(article, 'Great article!');
			expect(handlers.onHeadingClick).toHaveBeenCalledWith('intro');
		});
	});
});
