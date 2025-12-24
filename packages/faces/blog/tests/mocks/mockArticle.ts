/**
 * Mock Article Data
 *
 * Factory functions for generating sample article data for tests.
 */

import type { ArticleData } from '../../src/types.js';
import { createMockAuthor } from './mockAuthor.js';

export function createMockArticle(id: string, overrides: Partial<ArticleData> = {}): ArticleData {
	const base: ArticleData = {
		id,
		slug: `test-article-${id}`,
		metadata: {
			title: `Test Article ${id}`,
			description: `Description for article ${id}`,
			publishedAt: new Date('2024-01-15'),
			readingTime: 5,
			tags: ['test', 'svelte'],
			series: undefined,
		},
		content: '<h2>Introduction</h2><p>Test content</p>',
		contentFormat: 'html',
		author: createMockAuthor(`author-${id}`),
		isPublished: true,
	};

	return {
		...base,
		...overrides,
		metadata: { ...base.metadata, ...overrides.metadata },
		author: { ...base.author, ...overrides.author },
	};
}

export function createMockArticleList(count: number, startId = 1): ArticleData[] {
	return Array.from({ length: count }, (_, i) => createMockArticle(`article-${startId + i}`));
}

export function createMockArticleWithSeries(id: string): ArticleData {
	return createMockArticle(id, {
		metadata: {
			title: `Series Article ${id}`,
			description: `Part of a series`,
			publishedAt: new Date(),
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
	});
}
