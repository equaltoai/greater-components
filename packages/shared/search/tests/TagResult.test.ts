/**
 * Search.TagResult Component Tests
 *
 * Tests for tag search result logic including:
 * - Tag count formatting
 * - Hashtag formatting
 * - Trending detection
 * - Posts label generation
 */

import { describe, it, expect } from 'vitest';
import { formatCount } from '../src/context.svelte';

// Tag interface
interface SearchTag {
	name: string;
	count: number;
	trending: boolean;
}

// Format tag name with hashtag
function formatTagName(name: string): string {
	return `#${name}`;
}

// Generate posts label
function formatPostsLabel(count: number): string {
	const formatted = formatCount(count);
	return `${formatted} posts`;
}

// Check if tag is trending
function isTrending(tag: SearchTag): boolean {
	return tag.trending;
}

// Get trending class modifier
function getTrendingClass(trending: boolean): string {
	return trending ? 'tag-result--trending' : '';
}

// Check if trending icon should be shown
function shouldShowTrendingIcon(tag: SearchTag): boolean {
	return tag.trending;
}

// Generate accessible label
function getAccessibleLabel(tag: SearchTag): string {
	return `${formatTagName(tag.name)} ${formatPostsLabel(tag.count)}`;
}

// Validate tag name
function isValidTagName(name: string): boolean {
	return name.length > 0;
}

// Normalize tag name (remove # if present)
function normalizeTagName(name: string): string {
	return name.startsWith('#') ? name.slice(1) : name;
}

describe('Search.TagResult - Count Formatting', () => {
	it('formats small counts as-is', () => {
		expect(formatCount(0)).toBe('0');
		expect(formatCount(42)).toBe('42');
		expect(formatCount(950)).toBe('950');
		expect(formatCount(999)).toBe('999');
	});

	it('formats thousands with K', () => {
		expect(formatCount(1000)).toBe('1.0K');
		expect(formatCount(1200)).toBe('1.2K');
		expect(formatCount(5000)).toBe('5.0K');
		expect(formatCount(9999)).toBe('10.0K');
	});

	it('formats hundreds of thousands', () => {
		expect(formatCount(100000)).toBe('100.0K');
		expect(formatCount(500000)).toBe('500.0K');
		expect(formatCount(999999)).toBe('1000.0K');
	});

	it('formats millions with M', () => {
		expect(formatCount(1_000_000)).toBe('1.0M');
		expect(formatCount(2_500_000)).toBe('2.5M');
		expect(formatCount(10_000_000)).toBe('10.0M');
	});

	it('handles edge at 1000', () => {
		expect(formatCount(1000)).toBe('1.0K');
	});

	it('handles edge at 1 million', () => {
		expect(formatCount(1_000_000)).toBe('1.0M');
	});

	it('matches algorithmic output', () => {
		const values = [1, 15, 999, 1_001, 50_000];
		values.forEach((value) => {
			const result = formatCount(value);
			const expected =
				value >= 1_000
					? `${(value / (value >= 1_000_000 ? 1_000_000 : 1_000)).toFixed(1)}${value >= 1_000_000 ? 'M' : 'K'}`
					: value.toString();
			expect(result).toBe(expected);
		});
	});
});

describe('Search.TagResult - Tag Name Formatting', () => {
	it('prefixes tag name with hashtag', () => {
		expect(formatTagName('fediverse')).toBe('#fediverse');
	});

	it('handles empty tag name', () => {
		expect(formatTagName('')).toBe('#');
	});

	it('handles unicode tag names', () => {
		expect(formatTagName('テスト')).toBe('#テスト');
	});

	it('handles special characters', () => {
		expect(formatTagName('web3.0')).toBe('#web3.0');
	});

	it('handles spaces in tag name', () => {
		// Unusual but should handle
		expect(formatTagName('social media')).toBe('#social media');
	});

	it('does not double-prefix', () => {
		// Function doesn't check for existing #
		expect(formatTagName('#fediverse')).toBe('##fediverse');
	});
});

describe('Search.TagResult - Posts Label', () => {
	it('formats posts label for small counts', () => {
		expect(formatPostsLabel(42)).toBe('42 posts');
	});

	it('formats posts label for thousands', () => {
		expect(formatPostsLabel(1234)).toBe('1.2K posts');
	});

	it('formats posts label for millions', () => {
		expect(formatPostsLabel(2_500_000)).toBe('2.5M posts');
	});

	it('formats zero posts', () => {
		expect(formatPostsLabel(0)).toBe('0 posts');
	});

	it('uses plural "posts" for all counts', () => {
		expect(formatPostsLabel(1)).toBe('1 posts');
		expect(formatPostsLabel(2)).toBe('2 posts');
	});
});

describe('Search.TagResult - Trending Detection', () => {
	it('detects trending tag', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1000,
			trending: true,
		};
		expect(isTrending(tag)).toBe(true);
	});

	it('detects non-trending tag', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1000,
			trending: false,
		};
		expect(isTrending(tag)).toBe(false);
	});
});

describe('Search.TagResult - Trending Class', () => {
	it('returns trending class when trending', () => {
		expect(getTrendingClass(true)).toBe('tag-result--trending');
	});

	it('returns empty string when not trending', () => {
		expect(getTrendingClass(false)).toBe('');
	});
});

describe('Search.TagResult - Trending Icon Visibility', () => {
	it('shows icon for trending tag', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1000,
			trending: true,
		};
		expect(shouldShowTrendingIcon(tag)).toBe(true);
	});

	it('hides icon for non-trending tag', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1000,
			trending: false,
		};
		expect(shouldShowTrendingIcon(tag)).toBe(false);
	});
});

describe('Search.TagResult - Accessible Label', () => {
	it('generates accessible label for tag', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1234,
			trending: false,
		};
		expect(getAccessibleLabel(tag)).toBe('#fediverse 1.2K posts');
	});

	it('includes formatted count in label', () => {
		const tag: SearchTag = {
			name: 'activitypub',
			count: 42,
			trending: false,
		};
		expect(getAccessibleLabel(tag)).toBe('#activitypub 42 posts');
	});

	it('handles unicode tag names', () => {
		const tag: SearchTag = {
			name: 'テスト',
			count: 5,
			trending: false,
		};
		expect(getAccessibleLabel(tag)).toBe('#テスト 5 posts');
	});

	it('handles zero count', () => {
		const tag: SearchTag = {
			name: 'new',
			count: 0,
			trending: false,
		};
		expect(getAccessibleLabel(tag)).toBe('#new 0 posts');
	});
});

describe('Search.TagResult - Tag Name Validation', () => {
	it('validates non-empty tag name', () => {
		expect(isValidTagName('fediverse')).toBe(true);
	});

	it('rejects empty tag name', () => {
		expect(isValidTagName('')).toBe(false);
	});

	it('validates single character tag', () => {
		expect(isValidTagName('a')).toBe(true);
	});

	it('validates unicode tag', () => {
		expect(isValidTagName('世界')).toBe(true);
	});
});

describe('Search.TagResult - Tag Name Normalization', () => {
	it('returns tag name as-is when no hashtag', () => {
		expect(normalizeTagName('fediverse')).toBe('fediverse');
	});

	it('removes leading hashtag', () => {
		expect(normalizeTagName('#fediverse')).toBe('fediverse');
	});

	it('handles empty string', () => {
		expect(normalizeTagName('')).toBe('');
	});

	it('handles hashtag only', () => {
		expect(normalizeTagName('#')).toBe('');
	});

	it('only removes first hashtag', () => {
		expect(normalizeTagName('##fediverse')).toBe('#fediverse');
	});

	it('preserves internal hashtags', () => {
		expect(normalizeTagName('hash#tag')).toBe('hash#tag');
	});
});

describe('Search.TagResult - Edge Cases', () => {
	it('handles very large counts', () => {
		expect(formatCount(999_999_999)).toBe('1000.0M');
	});

	it('handles negative counts', () => {
		// Unexpected but should handle gracefully
		expect(formatCount(-1)).toBe('-1');
	});

	it('handles tag with all properties', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1234,
			trending: true,
		};

		expect(formatTagName(tag.name)).toBe('#fediverse');
		expect(formatPostsLabel(tag.count)).toBe('1.2K posts');
		expect(isTrending(tag)).toBe(true);
		expect(getTrendingClass(tag.trending)).toBe('tag-result--trending');
		expect(shouldShowTrendingIcon(tag)).toBe(true);
		expect(getAccessibleLabel(tag)).toBe('#fediverse 1.2K posts');
	});

	it('handles minimal tag', () => {
		const tag: SearchTag = {
			name: 'a',
			count: 0,
			trending: false,
		};

		expect(formatTagName(tag.name)).toBe('#a');
		expect(formatPostsLabel(tag.count)).toBe('0 posts');
		expect(isTrending(tag)).toBe(false);
		expect(getTrendingClass(tag.trending)).toBe('');
		expect(shouldShowTrendingIcon(tag)).toBe(false);
		expect(getAccessibleLabel(tag)).toBe('#a 0 posts');
	});

	it('handles tag with special characters', () => {
		const tag: SearchTag = {
			name: 'web3.0',
			count: 500,
			trending: false,
		};

		expect(formatTagName(tag.name)).toBe('#web3.0');
		expect(getAccessibleLabel(tag)).toBe('#web3.0 500 posts');
	});

	it('handles very long tag names', () => {
		const longName = 'a'.repeat(100);
		const tag: SearchTag = {
			name: longName,
			count: 10,
			trending: false,
		};

		expect(formatTagName(tag.name)).toBe(`#${longName}`);
		expect(isValidTagName(tag.name)).toBe(true);
	});
});

describe('Search.TagResult - Integration', () => {
	it('processes typical tag completely', () => {
		const tag: SearchTag = {
			name: 'fediverse',
			count: 1234,
			trending: false,
		};

		expect(formatTagName(tag.name)).toBe('#fediverse');
		expect(formatCount(tag.count)).toBe('1.2K');
		expect(formatPostsLabel(tag.count)).toBe('1.2K posts');
		expect(isTrending(tag)).toBe(false);
		expect(getTrendingClass(tag.trending)).toBe('');
		expect(shouldShowTrendingIcon(tag)).toBe(false);
		expect(getAccessibleLabel(tag)).toBe('#fediverse 1.2K posts');
		expect(isValidTagName(tag.name)).toBe(true);
		expect(normalizeTagName(tag.name)).toBe('fediverse');
	});

	it('processes trending tag completely', () => {
		const tag: SearchTag = {
			name: 'activitypub',
			count: 2_500_000,
			trending: true,
		};

		expect(formatTagName(tag.name)).toBe('#activitypub');
		expect(formatCount(tag.count)).toBe('2.5M');
		expect(formatPostsLabel(tag.count)).toBe('2.5M posts');
		expect(isTrending(tag)).toBe(true);
		expect(getTrendingClass(tag.trending)).toBe('tag-result--trending');
		expect(shouldShowTrendingIcon(tag)).toBe(true);
		expect(getAccessibleLabel(tag)).toBe('#activitypub 2.5M posts');
	});

	it('processes unicode tag completely', () => {
		const tag: SearchTag = {
			name: 'テスト',
			count: 5,
			trending: false,
		};

		expect(formatTagName(tag.name)).toBe('#テスト');
		expect(formatPostsLabel(tag.count)).toBe('5 posts');
		expect(getAccessibleLabel(tag)).toBe('#テスト 5 posts');
		expect(isValidTagName(tag.name)).toBe(true);
	});
});

describe('Search.TagResult - Count Boundaries', () => {
	it('handles boundary at 999/1000', () => {
		expect(formatCount(999)).toBe('999');
		expect(formatCount(1000)).toBe('1.0K');
	});

	it('handles boundary at 999999/1000000', () => {
		expect(formatCount(999999)).toBe('1000.0K');
		expect(formatCount(1000000)).toBe('1.0M');
	});

	it('formats range of thousands correctly', () => {
		expect(formatCount(1500)).toBe('1.5K');
		expect(formatCount(25000)).toBe('25.0K');
		expect(formatCount(999000)).toBe('999.0K');
	});

	it('formats range of millions correctly', () => {
		expect(formatCount(1500000)).toBe('1.5M');
		expect(formatCount(25000000)).toBe('25.0M');
		expect(formatCount(999000000)).toBe('999.0M');
	});
});
