/**
 * Search.Filters Component Tests
 * 
 * Tests for search filter tabs including:
 * - Filter type determination
 * - Result count computation
 * - Active filter logic
 * - Filter labels and order
 */

import { describe, it, expect } from 'vitest';

// Filter types and labels
type FilterType = 'all' | 'actors' | 'notes' | 'tags';

const FILTER_LABELS = ['All', 'People', 'Posts', 'Tags'] as const;
const FILTER_TYPES: FilterType[] = ['all', 'actors', 'notes', 'tags'];

// Result counts interface
interface FilterCounts {
	all: number;
	actors: number;
	notes: number;
	tags: number;
}

// Results interface
interface SearchResults {
	actors: unknown[];
	notes: unknown[];
	tags: unknown[];
	total: number;
}

// Compute counts from results
function computeCounts(results: SearchResults): FilterCounts {
	return {
		all: results.total,
		actors: results.actors.length,
		notes: results.notes.length,
		tags: results.tags.length,
	};
}

// Count visibility logic
function shouldShowCount(value: number): boolean {
	return value > 0;
}

// Active filter logic
function isFilterActive(filterType: FilterType, activeType: FilterType): boolean {
	return filterType === activeType;
}

// Filter label mapping
function getFilterLabel(filterType: FilterType): string {
	const labelMap: Record<FilterType, string> = {
		all: 'All',
		actors: 'People',
		notes: 'Posts',
		tags: 'Tags',
	};
	return labelMap[filterType];
}

// Filter type mapping (reverse)
function getFilterTypeFromLabel(label: string): FilterType | null {
	const typeMap: Record<string, FilterType> = {
		'All': 'all',
		'People': 'actors',
		'Posts': 'notes',
		'Tags': 'tags',
	};
	return typeMap[label] || null;
}

// Get count for specific filter
function getCountForFilter(filterType: FilterType, counts: FilterCounts): number {
	return counts[filterType];
}

// Format count with label
function formatFilterLabel(label: string, count?: number): string {
	if (count !== undefined && count > 0) {
		return `${label} (${count})`;
	}
	return label;
}

describe('Search.Filters - Count Computation', () => {
	it('computes counts from search results', () => {
		const results: SearchResults = {
			actors: [{}, {}],
			notes: [{}, {}, {}],
			tags: [{}],
			total: 6,
		};

		const counts = computeCounts(results);

		expect(counts.all).toBe(6);
		expect(counts.actors).toBe(2);
		expect(counts.notes).toBe(3);
		expect(counts.tags).toBe(1);
	});

	it('handles empty results', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 0,
		};

		const counts = computeCounts(results);

		expect(counts.all).toBe(0);
		expect(counts.actors).toBe(0);
		expect(counts.notes).toBe(0);
		expect(counts.tags).toBe(0);
	});

	it('handles partial results', () => {
		const results: SearchResults = {
			actors: [{}, {}, {}],
			notes: [],
			tags: [],
			total: 3,
		};

		const counts = computeCounts(results);

		expect(counts.all).toBe(3);
		expect(counts.actors).toBe(3);
		expect(counts.notes).toBe(0);
		expect(counts.tags).toBe(0);
	});

	it('handles large result sets', () => {
		const results: SearchResults = {
			actors: Array(100).fill({}),
			notes: Array(250).fill({}),
			tags: Array(50).fill({}),
			total: 400,
		};

		const counts = computeCounts(results);

		expect(counts.all).toBe(400);
		expect(counts.actors).toBe(100);
		expect(counts.notes).toBe(250);
		expect(counts.tags).toBe(50);
	});
});

describe('Search.Filters - Count Visibility', () => {
	it('shows count when value is greater than zero', () => {
		expect(shouldShowCount(1)).toBe(true);
		expect(shouldShowCount(100)).toBe(true);
	});

	it('hides count when value is zero', () => {
		expect(shouldShowCount(0)).toBe(false);
	});

	it('hides count for negative values', () => {
		expect(shouldShowCount(-1)).toBe(false);
	});

	it('handles very large counts', () => {
		expect(shouldShowCount(999999)).toBe(true);
	});
});

describe('Search.Filters - Active Filter Logic', () => {
	it('marks all as active when type is all', () => {
		expect(isFilterActive('all', 'all')).toBe(true);
		expect(isFilterActive('actors', 'all')).toBe(false);
		expect(isFilterActive('notes', 'all')).toBe(false);
		expect(isFilterActive('tags', 'all')).toBe(false);
	});

	it('marks actors as active when type is actors', () => {
		expect(isFilterActive('actors', 'actors')).toBe(true);
		expect(isFilterActive('all', 'actors')).toBe(false);
	});

	it('marks notes as active when type is notes', () => {
		expect(isFilterActive('notes', 'notes')).toBe(true);
		expect(isFilterActive('all', 'notes')).toBe(false);
	});

	it('marks tags as active when type is tags', () => {
		expect(isFilterActive('tags', 'tags')).toBe(true);
		expect(isFilterActive('all', 'tags')).toBe(false);
	});

	it('only one filter is active at a time', () => {
		const activeType: FilterType = 'actors';
		const activeFilters = FILTER_TYPES.filter(type => isFilterActive(type, activeType));
		expect(activeFilters).toHaveLength(1);
		expect(activeFilters[0]).toBe('actors');
	});
});

describe('Search.Filters - Filter Labels', () => {
	it('returns correct label for all', () => {
		expect(getFilterLabel('all')).toBe('All');
	});

	it('returns correct label for actors', () => {
		expect(getFilterLabel('actors')).toBe('People');
	});

	it('returns correct label for notes', () => {
		expect(getFilterLabel('notes')).toBe('Posts');
	});

	it('returns correct label for tags', () => {
		expect(getFilterLabel('tags')).toBe('Tags');
	});

	it('maintains canonical order', () => {
		expect(FILTER_LABELS).toEqual(['All', 'People', 'Posts', 'Tags']);
	});

	it('has corresponding types for all labels', () => {
		expect(FILTER_TYPES).toHaveLength(FILTER_LABELS.length);
	});
});

describe('Search.Filters - Reverse Label Mapping', () => {
	it('maps All to all', () => {
		expect(getFilterTypeFromLabel('All')).toBe('all');
	});

	it('maps People to actors', () => {
		expect(getFilterTypeFromLabel('People')).toBe('actors');
	});

	it('maps Posts to notes', () => {
		expect(getFilterTypeFromLabel('Posts')).toBe('notes');
	});

	it('maps Tags to tags', () => {
		expect(getFilterTypeFromLabel('Tags')).toBe('tags');
	});

	it('returns null for unknown label', () => {
		expect(getFilterTypeFromLabel('Unknown')).toBeNull();
	});

	it('is case sensitive', () => {
		expect(getFilterTypeFromLabel('all')).toBeNull();
		expect(getFilterTypeFromLabel('ALL')).toBeNull();
	});
});

describe('Search.Filters - Count Retrieval', () => {
	const counts: FilterCounts = {
		all: 10,
		actors: 3,
		notes: 5,
		tags: 2,
	};

	it('retrieves count for all', () => {
		expect(getCountForFilter('all', counts)).toBe(10);
	});

	it('retrieves count for actors', () => {
		expect(getCountForFilter('actors', counts)).toBe(3);
	});

	it('retrieves count for notes', () => {
		expect(getCountForFilter('notes', counts)).toBe(5);
	});

	it('retrieves count for tags', () => {
		expect(getCountForFilter('tags', counts)).toBe(2);
	});

	it('handles zero counts', () => {
		const zeroCounts: FilterCounts = {
			all: 0,
			actors: 0,
			notes: 0,
			tags: 0,
		};

		expect(getCountForFilter('all', zeroCounts)).toBe(0);
	});
});

describe('Search.Filters - Label Formatting', () => {
	it('formats label without count when count is zero', () => {
		expect(formatFilterLabel('All', 0)).toBe('All');
	});

	it('formats label without count when count is undefined', () => {
		expect(formatFilterLabel('All')).toBe('All');
	});

	it('formats label with count when count is positive', () => {
		expect(formatFilterLabel('All', 10)).toBe('All (10)');
	});

	it('formats label with large count', () => {
		expect(formatFilterLabel('People', 1000)).toBe('People (1000)');
	});

	it('handles single count', () => {
		expect(formatFilterLabel('Tags', 1)).toBe('Tags (1)');
	});

	it('does not show negative counts', () => {
		expect(formatFilterLabel('All', -1)).toBe('All');
	});
});

describe('Search.Filters - Filter Type Validation', () => {
	it('includes all expected filter types', () => {
		expect(FILTER_TYPES).toContain('all');
		expect(FILTER_TYPES).toContain('actors');
		expect(FILTER_TYPES).toContain('notes');
		expect(FILTER_TYPES).toContain('tags');
	});

	it('has exactly 4 filter types', () => {
		expect(FILTER_TYPES).toHaveLength(4);
	});

	it('maintains consistent order', () => {
		expect(FILTER_TYPES).toEqual(['all', 'actors', 'notes', 'tags']);
	});
});

describe('Search.Filters - Edge Cases', () => {
	it('handles results with mismatched total', () => {
		const results: SearchResults = {
			actors: [{}],
			notes: [{}],
			tags: [{}],
			total: 100, // Mismatch
		};

		const counts = computeCounts(results);
		expect(counts.all).toBe(100); // Uses provided total
		expect(counts.actors + counts.notes + counts.tags).toBe(3);
	});

	it('handles empty arrays with non-zero total', () => {
		const results: SearchResults = {
			actors: [],
			notes: [],
			tags: [],
			total: 5, // Inconsistent but possible during loading
		};

		const counts = computeCounts(results);
		expect(counts.all).toBe(5);
	});

	it('formats all filter types with counts', () => {
		const counts: FilterCounts = {
			all: 100,
			actors: 25,
			notes: 50,
			tags: 25,
		};

		FILTER_TYPES.forEach(type => {
			const label = getFilterLabel(type);
			const count = getCountForFilter(type, counts);
			const formatted = formatFilterLabel(label, count);
			expect(formatted).toContain(label);
			expect(formatted).toContain(count.toString());
		});
	});

	it('correctly identifies active filter for all types', () => {
		FILTER_TYPES.forEach(activeType => {
			FILTER_TYPES.forEach(filterType => {
				const isActive = isFilterActive(filterType, activeType);
				expect(isActive).toBe(filterType === activeType);
			});
		});
	});
});

describe('Search.Filters - Integration', () => {
	it('maps types to labels and back consistently', () => {
		FILTER_TYPES.forEach(type => {
			const label = getFilterLabel(type);
			const mappedType = getFilterTypeFromLabel(label);
			expect(mappedType).toBe(type);
		});
	});

	it('computes and formats complete filter set', () => {
		const results: SearchResults = {
			actors: [{}, {}],
			notes: [{}, {}, {}],
			tags: [{}],
			total: 6,
		};

		const counts = computeCounts(results);

		FILTER_TYPES.forEach(type => {
			const count = getCountForFilter(type, counts);
			expect(count).toBeGreaterThanOrEqual(0);
			
			const label = getFilterLabel(type);
			const formatted = formatFilterLabel(label, count);
			
			if (count > 0) {
				expect(formatted).toContain(count.toString());
			} else {
				expect(formatted).toBe(label);
			}
		});
	});
});
