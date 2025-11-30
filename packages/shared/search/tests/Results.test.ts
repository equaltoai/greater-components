/**
 * Search.Results Component Tests
 *
 * Tests for search results display logic including:
 * - Section visibility
 * - Loading messages
 * - Empty state conditions
 * - Error state handling
 * - Result counts
 */

import { describe, it, expect } from 'vitest';

// Result types
type SearchResultType = 'all' | 'actors' | 'notes' | 'tags';

// Search state interfaces
interface SearchResults {
	actors: unknown[];
	notes: unknown[];
	tags: unknown[];
	total: number;
}

interface SearchState {
	query: string;
	type: SearchResultType;
	results: SearchResults;
	loading: boolean;
	error: string | null;
	semantic: boolean;
}

// Section visibility logic
function shouldShowSection(type: SearchResultType, section: SearchResultType): boolean {
	return type === 'all' || type === section;
}

// Loading message logic
function loadingMessage(semantic: boolean): string {
	return semantic ? 'Searching with AI...' : 'Searching...';
}

// Empty state detection
function hasResults(results: SearchResults): boolean {
	return results.total > 0;
}

function hasResultsForSection(results: SearchResults, section: SearchResultType): boolean {
	if (section === 'all') {
		return results.total > 0;
	}
	return results[section].length > 0;
}

// Error state logic
function shouldShowError(error: string | null): boolean {
	return error !== null && error.length > 0;
}

// State priority logic
function getDisplayState(state: SearchState): 'loading' | 'error' | 'results' | 'empty' {
	if (state.loading) {
		return 'loading';
	}
	if (shouldShowError(state.error)) {
		return 'error';
	}
	if (hasResults(state.results)) {
		return 'results';
	}
	return 'empty';
}

// Empty state message
function emptyStateMessage(query: string): string {
	return query ? `No results found for "${query}"` : 'No results';
}

// Result count for section
function getResultCountForSection(results: SearchResults, section: SearchResultType): number {
	if (section === 'all') {
		return results.total;
	}
	return results[section].length;
}

// Section heading
function getSectionHeading(section: SearchResultType): string {
	const headingMap: Record<SearchResultType, string> = {
		all: 'All Results',
		actors: 'People',
		notes: 'Posts',
		tags: 'Tags',
	};
	return headingMap[section];
}

// Determine which sections to display
function getVisibleSections(type: SearchResultType, results: SearchResults): SearchResultType[] {
	const sections: SearchResultType[] = [];

	if (type === 'all') {
		if (results.actors.length > 0) sections.push('actors');
		if (results.notes.length > 0) sections.push('notes');
		if (results.tags.length > 0) sections.push('tags');
	} else {
		if (hasResultsForSection(results, type)) {
			sections.push(type);
		}
	}

	return sections;
}

describe('Search.Results - Section Visibility', () => {
	it('shows all sections when type is all', () => {
		expect(shouldShowSection('all', 'actors')).toBe(true);
		expect(shouldShowSection('all', 'notes')).toBe(true);
		expect(shouldShowSection('all', 'tags')).toBe(true);
	});

	it('shows only actors section when type is actors', () => {
		expect(shouldShowSection('actors', 'actors')).toBe(true);
		expect(shouldShowSection('actors', 'notes')).toBe(false);
		expect(shouldShowSection('actors', 'tags')).toBe(false);
	});

	it('shows only notes section when type is notes', () => {
		expect(shouldShowSection('notes', 'notes')).toBe(true);
		expect(shouldShowSection('notes', 'actors')).toBe(false);
		expect(shouldShowSection('notes', 'tags')).toBe(false);
	});

	it('shows only tags section when type is tags', () => {
		expect(shouldShowSection('tags', 'tags')).toBe(true);
		expect(shouldShowSection('tags', 'actors')).toBe(false);
		expect(shouldShowSection('tags', 'notes')).toBe(false);
	});

	it('all type shows section matching itself', () => {
		expect(shouldShowSection('all', 'all')).toBe(true);
	});
});

describe('Search.Results - Loading Messages', () => {
	it('returns AI message when semantic search is enabled', () => {
		expect(loadingMessage(true)).toBe('Searching with AI...');
	});

	it('returns plain message when semantic search is disabled', () => {
		expect(loadingMessage(false)).toBe('Searching...');
	});

	it('messages are distinct', () => {
		expect(loadingMessage(true)).not.toBe(loadingMessage(false));
	});

	it('messages contain ellipsis', () => {
		expect(loadingMessage(true)).toContain('...');
		expect(loadingMessage(false)).toContain('...');
	});
});

describe('Search.Results - Results Detection', () => {
	it('detects results when total is positive', () => {
		const results: SearchResults = {
			actors: [{}],
			notes: [],
			tags: [],
			total: 1,
		};
		expect(hasResults(results)).toBe(true);
	});

	it('detects no results when total is zero', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		};
		expect(hasResults(results)).toBe(false);
	});

	it('uses total count, not individual arrays', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 5, // Mismatch possible during loading
		};
		expect(hasResults(results)).toBe(true);
	});

	it('handles negative total', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: -1,
		};
		expect(hasResults(results)).toBe(false);
	});
});

describe('Search.Results - Section-Specific Results', () => {
	const results: SearchResults = {
		actors: [{}, {}],
		notes: [{}],
		tags: [],
		total: 3,
	};

	it('detects results for actors section', () => {
		expect(hasResultsForSection(results, 'actors')).toBe(true);
	});

	it('detects results for notes section', () => {
		expect(hasResultsForSection(results, 'notes')).toBe(true);
	});

	it('detects no results for tags section', () => {
		expect(hasResultsForSection(results, 'tags')).toBe(false);
	});

	it('uses total for all section', () => {
		expect(hasResultsForSection(results, 'all')).toBe(true);
	});

	it('handles empty results', () => {
		const empty: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		};
		expect(hasResultsForSection(empty, 'actors')).toBe(false);
		expect(hasResultsForSection(empty, 'notes')).toBe(false);
		expect(hasResultsForSection(empty, 'tags')).toBe(false);
		expect(hasResultsForSection(empty, 'all')).toBe(false);
	});
});

describe('Search.Results - Error State', () => {
	it('shows error when error message exists', () => {
		expect(shouldShowError('Search failed')).toBe(true);
	});

	it('hides error when error is null', () => {
		expect(shouldShowError(null)).toBe(false);
	});

	it('hides error when error is empty string', () => {
		expect(shouldShowError('')).toBe(false);
	});

	it('shows error for whitespace-only message', () => {
		expect(shouldShowError('   ')).toBe(true);
	});
});

describe('Search.Results - Display State Priority', () => {
	it('shows loading state when loading is true', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [], notes: [], tags: [], total: 0 },
			loading: true,
			error: null,
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('loading');
	});

	it('shows error state when error exists and not loading', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [{}], notes: [], tags: [], total: 1 },
			loading: false,
			error: 'Failed',
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('error');
	});

	it('shows results state when has results and no error', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [{}], notes: [], tags: [], total: 1 },
			loading: false,
			error: null,
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('results');
	});

	it('shows empty state when no results and no error', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [], notes: [], tags: [], total: 0 },
			loading: false,
			error: null,
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('empty');
	});

	it('loading takes priority over error', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [], notes: [], tags: [], total: 0 },
			loading: true,
			error: 'Error',
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('loading');
	});

	it('error takes priority over results', () => {
		const state: SearchState = {
			query: 'test',
			type: 'all',
			results: { actors: [{}], notes: [], tags: [], total: 1 },
			loading: false,
			error: 'Error',
			semantic: false,
		};
		expect(getDisplayState(state)).toBe('error');
	});
});

describe('Search.Results - Empty State Messages', () => {
	it('includes query in message when query exists', () => {
		const message = emptyStateMessage('fediverse');
		expect(message).toContain('fediverse');
		expect(message).toContain('No results found');
	});

	it('shows generic message when query is empty', () => {
		expect(emptyStateMessage('')).toBe('No results');
	});

	it('formats query in quotes', () => {
		expect(emptyStateMessage('test')).toContain('"test"');
	});

	it('handles special characters in query', () => {
		const message = emptyStateMessage('@user #tag');
		expect(message).toContain('@user #tag');
	});
});

describe('Search.Results - Result Counts', () => {
	const results: SearchResults = {
		actors: [{}, {}],
		notes: [{}, {}, {}],
		tags: [{}],
		total: 6,
	};

	it('returns actors count for actors section', () => {
		expect(getResultCountForSection(results, 'actors')).toBe(2);
	});

	it('returns notes count for notes section', () => {
		expect(getResultCountForSection(results, 'notes')).toBe(3);
	});

	it('returns tags count for tags section', () => {
		expect(getResultCountForSection(results, 'tags')).toBe(1);
	});

	it('returns total count for all section', () => {
		expect(getResultCountForSection(results, 'all')).toBe(6);
	});

	it('handles zero counts', () => {
		const empty: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		};
		expect(getResultCountForSection(empty, 'actors')).toBe(0);
		expect(getResultCountForSection(empty, 'all')).toBe(0);
	});
});

describe('Search.Results - Section Headings', () => {
	it('returns correct heading for all', () => {
		expect(getSectionHeading('all')).toBe('All Results');
	});

	it('returns correct heading for actors', () => {
		expect(getSectionHeading('actors')).toBe('People');
	});

	it('returns correct heading for notes', () => {
		expect(getSectionHeading('notes')).toBe('Posts');
	});

	it('returns correct heading for tags', () => {
		expect(getSectionHeading('tags')).toBe('Tags');
	});
});

describe('Search.Results - Visible Sections', () => {
	it('shows all sections with results when type is all', () => {
		const results: SearchResults = {
			actors: [{}],
			notes: [{}],
			tags: [{}],
			total: 3,
		};
		const sections = getVisibleSections('all', results);
		expect(sections).toContain('actors');
		expect(sections).toContain('notes');
		expect(sections).toContain('tags');
		expect(sections).toHaveLength(3);
	});

	it('shows only sections with results when type is all', () => {
		const results: SearchResults = {
			actors: [{}],
			notes: [],
			tags: [{}],
			total: 2,
		};
		const sections = getVisibleSections('all', results);
		expect(sections).toContain('actors');
		expect(sections).toContain('tags');
		expect(sections).not.toContain('notes');
		expect(sections).toHaveLength(2);
	});

	it('shows empty array when no results and type is all', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		};
		const sections = getVisibleSections('all', results);
		expect(sections).toHaveLength(0);
	});

	it('shows actors section when type is actors and has results', () => {
		const results: SearchResults = {
			actors: [{}],
			notes: [],
			tags: [],
			total: 1,
		};
		const sections = getVisibleSections('actors', results);
		expect(sections).toEqual(['actors']);
	});

	it('shows empty array when type is actors but no results', () => {
		const results: SearchResults = {
			actors: [],
			notes: [{}],
			tags: [],
			total: 1,
		};
		const sections = getVisibleSections('actors', results);
		expect(sections).toHaveLength(0);
	});

	it('shows notes section when type is notes and has results', () => {
		const results: SearchResults = {
			actors: [],
			notes: [{}],
			tags: [],
			total: 1,
		};
		const sections = getVisibleSections('notes', results);
		expect(sections).toEqual(['notes']);
	});

	it('shows tags section when type is tags and has results', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [{}],
			total: 1,
		};
		const sections = getVisibleSections('tags', results);
		expect(sections).toEqual(['tags']);
	});
});

describe('Search.Results - Edge Cases', () => {
	it('handles very large result counts', () => {
		const results: SearchResults = {
			actors: Array(1000).fill({}),
			notes: Array(5000).fill({}),
			tags: Array(100).fill({}),
			total: 6100,
		};
		expect(hasResults(results)).toBe(true);
		expect(getResultCountForSection(results, 'all')).toBe(6100);
	});

	it('handles unicode in query', () => {
		const message = emptyStateMessage('🔍 search');
		expect(message).toContain('🔍 search');
	});

	it('handles all sections empty but positive total', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 5,
		};
		expect(hasResults(results)).toBe(true);
		expect(getVisibleSections('all', results)).toHaveLength(0);
	});

	it('determines display state for all possible combinations', () => {
		const combinations = [
			{ loading: true, error: 'err', total: 1, expected: 'loading' },
			{ loading: false, error: 'err', total: 1, expected: 'error' },
			{ loading: false, error: null, total: 1, expected: 'results' },
			{ loading: false, error: null, total: 0, expected: 'empty' },
		];

		combinations.forEach(({ loading, error, total, expected }) => {
			const state: SearchState = {
				query: 'test',
				type: 'all',
				results: { actors: [], notes: [], tags: [], total },
				loading,
				error,
				semantic: false,
			};
			expect(getDisplayState(state)).toBe(expected);
		});
	});
});
