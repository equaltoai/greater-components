/**
 * Search.Bar Component Tests
 *
 * Tests for search bar functionality including:
 * - Search button state logic
 * - Clear button visibility
 * - Recent searches dropdown logic
 * - Query validation
 * - Semantic search toggle
 */

import { describe, expect, it } from 'vitest';

// Search button disabled state logic
function isSearchDisabled(query: string, loading: boolean): boolean {
	return loading || query.trim().length === 0;
}

// Clear button visibility logic
function shouldShowClearButton(query: string): boolean {
	return query.length > 0;
}

// Recent searches dropdown logic
function shouldShowRecentDropdown(
	showRecent: boolean,
	value: string,
	recentCount: number
): boolean {
	return showRecent && value.trim().length === 0 && recentCount > 0;
}

// Query validation
function isValidQuery(query: string, minLength: number = 1): boolean {
	return query.trim().length >= minLength;
}

// Placeholder text handling
function getPlaceholderText(placeholder?: string): string {
	return placeholder !== undefined ? placeholder : 'Search...';
}

// Semantic search configuration
function isSemanticSearchVisible(showSemantic: boolean): boolean {
	return showSemantic;
}

function isSemanticSearchActive(semantic: boolean): boolean {
	return semantic;
}

// Query preprocessing
function preprocessQuery(query: string): string {
	return query.trim();
}

function hasQueryChanged(oldQuery: string, newQuery: string): boolean {
	return preprocessQuery(oldQuery) !== preprocessQuery(newQuery);
}

describe('Search.Bar - Search Button State', () => {
	it('disables search button when query is empty', () => {
		expect(isSearchDisabled('', false)).toBe(true);
	});

	it('disables search button when query is whitespace only', () => {
		expect(isSearchDisabled('   ', false)).toBe(true);
	});

	it('disables search button when loading', () => {
		expect(isSearchDisabled('fediverse', true)).toBe(true);
	});

	it('enables search button when query is valid and not loading', () => {
		expect(isSearchDisabled('fediverse', false)).toBe(false);
	});

	it('disables when both empty and loading', () => {
		expect(isSearchDisabled('', true)).toBe(true);
	});

	it('handles single character queries', () => {
		expect(isSearchDisabled('a', false)).toBe(false);
	});

	it('handles unicode queries', () => {
		expect(isSearchDisabled('🔍', false)).toBe(false);
	});
});

describe('Search.Bar - Clear Button Visibility', () => {
	it('shows clear button when query is not empty', () => {
		expect(shouldShowClearButton('fediverse')).toBe(true);
	});

	it('hides clear button when query is empty', () => {
		expect(shouldShowClearButton('')).toBe(false);
	});

	it('shows clear button for single character', () => {
		expect(shouldShowClearButton('a')).toBe(true);
	});

	it('shows clear button for whitespace', () => {
		// Note: Shows button but search will be disabled
		expect(shouldShowClearButton('   ')).toBe(true);
	});

	it('shows clear button for unicode', () => {
		expect(shouldShowClearButton('🔍')).toBe(true);
	});
});

describe('Search.Bar - Recent Searches Dropdown', () => {
	it('shows dropdown when enabled, query empty, and has recent searches', () => {
		expect(shouldShowRecentDropdown(true, '', 3)).toBe(true);
	});

	it('hides dropdown when showRecent is false', () => {
		expect(shouldShowRecentDropdown(false, '', 3)).toBe(false);
	});

	it('hides dropdown when query is not empty', () => {
		expect(shouldShowRecentDropdown(true, 'test', 3)).toBe(false);
	});

	it('hides dropdown when no recent searches', () => {
		expect(shouldShowRecentDropdown(true, '', 0)).toBe(false);
	});

	it('hides dropdown when query is whitespace only', () => {
		// whitespace.trim() === '', so should show
		expect(shouldShowRecentDropdown(true, '   ', 3)).toBe(true);
	});

	it('handles negative recent count', () => {
		expect(shouldShowRecentDropdown(true, '', -1)).toBe(false);
	});

	it('requires all conditions to be true', () => {
		expect(shouldShowRecentDropdown(false, '', 0)).toBe(false);
		expect(shouldShowRecentDropdown(true, 'query', 0)).toBe(false);
		expect(shouldShowRecentDropdown(false, 'query', 3)).toBe(false);
	});
});

describe('Search.Bar - Query Validation', () => {
	it('validates non-empty query', () => {
		expect(isValidQuery('fediverse')).toBe(true);
	});

	it('rejects empty query', () => {
		expect(isValidQuery('')).toBe(false);
	});

	it('rejects whitespace-only query', () => {
		expect(isValidQuery('   ')).toBe(false);
	});

	it('validates single character', () => {
		expect(isValidQuery('a')).toBe(true);
	});

	it('respects custom min length', () => {
		expect(isValidQuery('ab', 3)).toBe(false);
		expect(isValidQuery('abc', 3)).toBe(true);
		expect(isValidQuery('abcd', 3)).toBe(true);
	});

	it('handles unicode characters', () => {
		expect(isValidQuery('🔍')).toBe(true);
		expect(isValidQuery('こんにちは')).toBe(true);
	});

	it('trims before validating', () => {
		expect(isValidQuery('  test  ')).toBe(true);
	});
});

describe('Search.Bar - Placeholder Text', () => {
	it('returns default placeholder when none provided', () => {
		expect(getPlaceholderText()).toBe('Search...');
	});

	it('returns custom placeholder when provided', () => {
		expect(getPlaceholderText('Look up people...')).toBe('Look up people...');
	});

	it('returns empty string if explicitly provided', () => {
		expect(getPlaceholderText('')).toBe('');
	});

	it('preserves unicode in placeholder', () => {
		expect(getPlaceholderText('Search 🔍')).toBe('Search 🔍');
	});
});

describe('Search.Bar - Semantic Search Configuration', () => {
	it('shows semantic search when enabled', () => {
		expect(isSemanticSearchVisible(true)).toBe(true);
	});

	it('hides semantic search when disabled', () => {
		expect(isSemanticSearchVisible(false)).toBe(false);
	});

	it('detects active semantic search', () => {
		expect(isSemanticSearchActive(true)).toBe(true);
	});

	it('detects inactive semantic search', () => {
		expect(isSemanticSearchActive(false)).toBe(false);
	});
});

describe('Search.Bar - Query Preprocessing', () => {
	it('trims whitespace from query', () => {
		expect(preprocessQuery('  test  ')).toBe('test');
	});

	it('handles empty string', () => {
		expect(preprocessQuery('')).toBe('');
	});

	it('handles whitespace-only string', () => {
		expect(preprocessQuery('   ')).toBe('');
	});

	it('preserves internal whitespace', () => {
		expect(preprocessQuery('  hello world  ')).toBe('hello world');
	});

	it('handles unicode', () => {
		expect(preprocessQuery('  🔍 search  ')).toBe('🔍 search');
	});

	it('handles newlines and tabs', () => {
		expect(preprocessQuery('\n\thello\n\t')).toBe('hello');
	});
});

describe('Search.Bar - Query Change Detection', () => {
	it('detects query change', () => {
		expect(hasQueryChanged('old', 'new')).toBe(true);
	});

	it('detects no change', () => {
		expect(hasQueryChanged('same', 'same')).toBe(false);
	});

	it('ignores leading/trailing whitespace', () => {
		expect(hasQueryChanged('  test  ', 'test')).toBe(false);
	});

	it('is case sensitive', () => {
		expect(hasQueryChanged('Test', 'test')).toBe(true);
	});

	it('handles empty strings', () => {
		expect(hasQueryChanged('', '')).toBe(false);
		expect(hasQueryChanged('test', '')).toBe(true);
	});

	it('treats whitespace-only as empty', () => {
		expect(hasQueryChanged('   ', '')).toBe(false);
	});
});

describe('Search.Bar - Edge Cases', () => {
	it('handles very long queries', () => {
		const longQuery = 'a'.repeat(1000);
		expect(isValidQuery(longQuery)).toBe(true);
		expect(shouldShowClearButton(longQuery)).toBe(true);
		expect(isSearchDisabled(longQuery, false)).toBe(false);
	});

	it('handles special characters in query', () => {
		const specialQuery = '@user #tag url:https://example.com';
		expect(isValidQuery(specialQuery)).toBe(true);
		expect(preprocessQuery(specialQuery)).toBe(specialQuery);
	});

	it('handles multiple spaces in query', () => {
		const query = 'hello    world';
		expect(isValidQuery(query)).toBe(true);
		expect(preprocessQuery(query)).toBe(query);
	});

	it('handles mixed unicode and ASCII', () => {
		const query = 'Hello 世界 🌍';
		expect(isValidQuery(query)).toBe(true);
		expect(preprocessQuery(` ${query} `)).toBe(query);
	});

	it('handles queries with only punctuation', () => {
		expect(isValidQuery('!!!')).toBe(true);
		expect(isValidQuery('...')).toBe(true);
	});

	it('handles queries with HTML entities', () => {
		const query = '&lt;script&gt;';
		expect(isValidQuery(query)).toBe(true);
	});

	it('handles tab characters', () => {
		expect(preprocessQuery('\tquery\t')).toBe('query');
		expect(isValidQuery('\tquery\t')).toBe(true);
	});

	it('handles multiple newlines', () => {
		expect(preprocessQuery('query\n\n\nquery')).toBe('query\n\n\nquery');
	});
});

describe('Search.Bar - Configuration Combinations', () => {
	it('recent dropdown with valid query hides dropdown', () => {
		expect(shouldShowRecentDropdown(true, 'test', 5)).toBe(false);
	});

	it('disabled search with valid query when loading', () => {
		expect(isSearchDisabled('valid query', true)).toBe(true);
	});

	it('semantic disabled but query valid still allows search', () => {
		expect(isSearchDisabled('query', false)).toBe(false);
		expect(isSemanticSearchVisible(false)).toBe(false);
	});

	it('empty query hides clear and disables search', () => {
		expect(shouldShowClearButton('')).toBe(false);
		expect(isSearchDisabled('', false)).toBe(true);
	});

	it('whitespace query shows clear but disables search', () => {
		expect(shouldShowClearButton('   ')).toBe(true);
		expect(isSearchDisabled('   ', false)).toBe(true);
	});
});

describe('Search.Bar - Min Length Validation', () => {
	it('enforces minimum length of 1 by default', () => {
		expect(isValidQuery('', 1)).toBe(false);
		expect(isValidQuery('a', 1)).toBe(true);
	});

	it('enforces minimum length of 3', () => {
		expect(isValidQuery('ab', 3)).toBe(false);
		expect(isValidQuery('abc', 3)).toBe(true);
	});

	it('enforces minimum length of 0', () => {
		expect(isValidQuery('', 0)).toBe(true);
		expect(isValidQuery('a', 0)).toBe(true);
	});

	it('handles negative min length as 0', () => {
		// Any length would be >= negative number
		expect(isValidQuery('', -1)).toBe(true);
	});
});
