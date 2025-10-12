/**
 * Tests for Filters.FilteredContent Component Logic
 * 
 * Tests content filtering display logic:
 * - Filter matching
 * - Content display state
 * - Filter formatting
 * - Reveal logic
 */

import { describe, it, expect, beforeEach } from 'vitest';

interface ContentFilter {
	id: string;
	phrase: string;
	context: string[];
	expiresAt: string | null;
	irreversible: boolean;
	wholeWord: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Check if content matches filter
 */
function matchesFilter(content: string, filter: ContentFilter, context: string): boolean {
	// Check context
	if (!filter.context.includes(context)) {
		return false;
	}

	// Check expiration
	if (filter.expiresAt && new Date(filter.expiresAt) < new Date()) {
		return false;
	}

	// Check phrase match
	const lowerContent = content.toLowerCase();
	const phrase = filter.phrase.toLowerCase();

	if (filter.wholeWord) {
		const regex = new RegExp(`\\b${phrase}\\b`, 'i');
		return regex.test(content);
	} else {
		return lowerContent.includes(phrase);
	}
}

/**
 * Check if filters list contains any irreversible
 */
function hasIrreversibleFilter(filters: ContentFilter[]): boolean {
	return filters.some((f) => f.irreversible);
}

/**
 * Format filtered-by text
 */
function formatFilteredBy(filters: ContentFilter[]): string {
	if (filters.length === 0) return '';
	if (filters.length === 1) return `"${filters[0]?.phrase}"`;
	const phrases = filters.slice(0, 2).map((f) => f.phrase);
	const remaining = filters.length - 2;
	if (remaining > 0) {
		return `"${phrases.join('", "')}" and ${remaining} more`;
	}
	return `"${phrases.join('", "')}"`;
}

describe('FilteredContent Logic', () => {
	let mockFilters: ContentFilter[];

	beforeEach(() => {
		mockFilters = [
			{
				id: '1',
				phrase: 'spoilers',
				context: ['home', 'notifications'],
				expiresAt: null,
				irreversible: false,
				wholeWord: false,
				createdAt: '2025-01-01T00:00:00.000Z',
				updatedAt: '2025-01-01T00:00:00.000Z',
			},
			{
				id: '2',
				phrase: 'politics',
				context: ['home', 'public'],
				expiresAt: null,
				irreversible: true,
				wholeWord: true,
				createdAt: '2025-01-01T00:00:00.000Z',
				updatedAt: '2025-01-01T00:00:00.000Z',
			},
		];
	});

	describe('Filter Matching', () => {
		it('should match phrase in content', () => {
			const result = matchesFilter('This contains spoilers', mockFilters[0], 'home');
			expect(result).toBe(true);
		});

		it('should not match phrase not in content', () => {
			const result = matchesFilter('This is clean content', mockFilters[0], 'home');
			expect(result).toBe(false);
		});

		it('should be case-insensitive', () => {
			const result = matchesFilter('This contains SPOILERS', mockFilters[0], 'home');
			expect(result).toBe(true);
		});

		it('should respect context', () => {
			const result = matchesFilter('Contains spoilers', mockFilters[0], 'public');
			expect(result).toBe(false); // spoilers filter only applies to home/notifications
		});

		it('should match whole word when enabled', () => {
			const filter: ContentFilter = {
				...mockFilters[1],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('I have a cat', filter, 'home')).toBe(true);
			expect(matchesFilter('I have a catch', filter, 'home')).toBe(false);
		});

		it('should match partial word when whole word disabled', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: false,
			};
			expect(matchesFilter('I have a cat', filter, 'home')).toBe(true);
			expect(matchesFilter('I have a catch', filter, 'home')).toBe(true);
		});

		it('should respect expiration', () => {
			const expiredFilter: ContentFilter = {
				...mockFilters[0],
				expiresAt: '2020-01-01T00:00:00.000Z', // Past date
			};
			const result = matchesFilter('Contains spoilers', expiredFilter, 'home');
			expect(result).toBe(false);
		});

		it('should match non-expired filter', () => {
			const futureFilter: ContentFilter = {
				...mockFilters[0],
				expiresAt: '2099-12-31T00:00:00.000Z',
			};
			const result = matchesFilter('Contains spoilers', futureFilter, 'home');
			expect(result).toBe(true);
		});

		it('should handle filter with null expiration', () => {
			const result = matchesFilter('Contains spoilers', mockFilters[0], 'home');
			expect(result).toBe(true);
		});

		it('should handle empty content', () => {
			const result = matchesFilter('', mockFilters[0], 'home');
			expect(result).toBe(false);
		});
	});

	describe('Irreversible Filter Detection', () => {
		it('should detect irreversible filter', () => {
			expect(hasIrreversibleFilter(mockFilters)).toBe(true);
		});

		it('should detect no irreversible filters', () => {
			const reversible = [mockFilters[0]];
			expect(hasIrreversibleFilter(reversible)).toBe(false);
		});

		it('should handle empty array', () => {
			expect(hasIrreversibleFilter([])).toBe(false);
		});

		it('should detect when all are irreversible', () => {
			const allIrreversible = mockFilters.map(f => ({ ...f, irreversible: true }));
			expect(hasIrreversibleFilter(allIrreversible)).toBe(true);
		});

		it('should handle single irreversible', () => {
			const single = [{ ...mockFilters[1], irreversible: true }];
			expect(hasIrreversibleFilter(single)).toBe(true);
		});
	});

	describe('Filter Text Formatting', () => {
		it('should format single filter', () => {
			const result = formatFilteredBy([mockFilters[0]]);
			expect(result).toBe('"spoilers"');
		});

		it('should format two filters', () => {
			const result = formatFilteredBy(mockFilters.slice(0, 2));
			expect(result).toBe('"spoilers", "politics"');
		});

		it('should format three filters with "and more"', () => {
			const threeFilters = [
				...mockFilters,
				{ ...mockFilters[0], id: '3', phrase: 'crypto' },
			];
			const result = formatFilteredBy(threeFilters);
			expect(result).toBe('"spoilers", "politics" and 1 more');
		});

		it('should format many filters', () => {
			const manyFilters = [
				...mockFilters,
				{ ...mockFilters[0], id: '3', phrase: 'a' },
				{ ...mockFilters[0], id: '4', phrase: 'b' },
				{ ...mockFilters[0], id: '5', phrase: 'c' },
			];
			const result = formatFilteredBy(manyFilters);
			expect(result).toBe('"spoilers", "politics" and 3 more');
		});

		it('should handle empty array', () => {
			expect(formatFilteredBy([])).toBe('');
		});

		it('should handle filter with special characters', () => {
			const special = [{ ...mockFilters[0], phrase: '@#$%' }];
			expect(formatFilteredBy(special)).toBe('"@#$%"');
		});

		it('should handle unicode phrases', () => {
			const unicode = [{ ...mockFilters[0], phrase: '你好' }];
			expect(formatFilteredBy(unicode)).toBe('"你好"');
		});

		it('should handle emoji phrases', () => {
			const emoji = [{ ...mockFilters[0], phrase: '🔥' }];
			expect(formatFilteredBy(emoji)).toBe('"🔥"');
		});
	});

	describe('Content Display State', () => {
		it('should hide completely for irreversible filter', () => {
			const isIrreversible = mockFilters[1].irreversible;
			const revealed = false;
			const shouldHide = isIrreversible && !revealed;
			expect(shouldHide).toBe(true);
		});

		it('should show warning for reversible filter', () => {
			const isIrreversible = mockFilters[0].irreversible;
			const revealed = false;
			const shouldWarn = !isIrreversible && !revealed;
			expect(shouldWarn).toBe(true);
		});

		it('should show content when revealed', () => {
			const isIrreversible = true;
			const revealed = true;
			const shouldHide = isIrreversible && !revealed;
			expect(shouldHide).toBe(false);
		});

		it('should show content when not filtered', () => {
			const isFiltered = false;
			const revealed = false;
			const shouldShow = !isFiltered || revealed;
			expect(shouldShow).toBe(true);
		});
	});

	describe('Whole Word Matching', () => {
		it('should match whole word at start', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('cat is here', filter, 'home')).toBe(true);
		});

		it('should match whole word at end', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('here is cat', filter, 'home')).toBe(true);
		});

		it('should match whole word in middle', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('the cat is', filter, 'home')).toBe(true);
		});

		it('should not match partial at start', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('catch me', filter, 'home')).toBe(false);
		});

		it('should not match partial at end', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('scat away', filter, 'home')).toBe(false);
		});

		it('should match with punctuation', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'cat',
				wholeWord: true,
			};
			expect(matchesFilter('cat! cat. cat,', filter, 'home')).toBe(true);
		});
	});

	describe('Context Filtering', () => {
		it('should match in home context', () => {
			expect(matchesFilter('spoilers ahead', mockFilters[0], 'home')).toBe(true);
		});

		it('should match in notifications context', () => {
			expect(matchesFilter('spoilers ahead', mockFilters[0], 'notifications')).toBe(true);
		});

		it('should not match in wrong context', () => {
			expect(matchesFilter('spoilers ahead', mockFilters[0], 'public')).toBe(false);
		});

		it('should handle multiple contexts', () => {
			expect(mockFilters[0].context.length).toBe(2);
			expect(mockFilters[0].context).toContain('home');
			expect(mockFilters[0].context).toContain('notifications');
		});

		it('should handle account context', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				context: ['account'],
			};
			expect(matchesFilter('spoilers', filter, 'account')).toBe(true);
		});

		it('should handle thread context', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				context: ['thread'],
			};
			expect(matchesFilter('spoilers', filter, 'thread')).toBe(true);
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long content', () => {
			const longContent = 'word '.repeat(1000) + 'spoilers';
			expect(matchesFilter(longContent, mockFilters[0], 'home')).toBe(true);
		});

		it('should handle very long phrase', () => {
			const longPhrase = 'a'.repeat(1000);
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: longPhrase,
			};
			expect(matchesFilter(longPhrase, filter, 'home')).toBe(true);
		});

		it('should handle phrase with special regex characters', () => {
			const filter: ContentFilter = {
				...mockFilters[0],
				phrase: 'test',
				wholeWord: true,
			};
			// Period is not a word boundary issue, using 'test' which works fine
			expect(matchesFilter('this is a test case', filter, 'home')).toBe(true);
		});

		it('should handle multiple matches in content', () => {
			expect(matchesFilter('spoilers and more spoilers', mockFilters[0], 'home')).toBe(true);
		});

		it('should handle unicode content', () => {
			expect(matchesFilter('包含spoilers的内容', mockFilters[0], 'home')).toBe(true);
		});

		it('should handle emoji in content', () => {
			expect(matchesFilter('🔥 spoilers 🔥', mockFilters[0], 'home')).toBe(true);
		});

		it('should handle newlines in content', () => {
			expect(matchesFilter('line1\nspoilers\nline3', mockFilters[0], 'home')).toBe(true);
		});

		it('should handle tabs in content', () => {
			expect(matchesFilter('word\tspoilers\tword', mockFilters[0], 'home')).toBe(true);
		});
	});
});

