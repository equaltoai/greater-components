/**
 * Lists.Manager Component Tests
 * 
 * Tests for lists management display logic including:
 * - Visibility labels
 * - Member count formatting
 * - Empty/loading state detection
 * - Card selection logic
 * - Description handling
 */

import { describe, it, expect } from 'vitest';

// List data interface
interface ListData {
	id: string;
	title: string;
	description?: string;
	visibility: 'public' | 'private';
	membersCount: number;
	createdAt?: string;
	updatedAt?: string;
}

// Get visibility label for display
function getVisibilityLabel(visibility: 'public' | 'private'): string {
	return visibility === 'public' ? 'Public' : 'Private';
}

// Format members count for display
function formatMembersCount(count: number): string {
	if (count === 0) return '0';
	if (count === 1) return '1';
	return count.toString();
}

// Check if list is selected
function isListSelected(list: ListData, selectedListId: string | null): boolean {
	return list.id === selectedListId;
}

// Check if should show empty state
function shouldShowEmptyState(lists: ListData[], loading: boolean): boolean {
	return lists.length === 0 && !loading;
}

// Check if should show loading state
function shouldShowLoadingState(lists: ListData[], loading: boolean): boolean {
	return lists.length === 0 && loading;
}

// Check if should show grid
function shouldShowGrid(lists: ListData[], _loading: boolean): boolean {
	return lists.length > 0;
}

// Check if description should be shown
function shouldShowDescription(list: ListData): boolean {
	return list.description !== undefined && list.description.length > 0;
}

// Get delete confirmation message
function getDeleteConfirmMessage(listTitle: string): string {
	return `Delete "${listTitle}"?`;
}

// Get delete button label
function getDeleteButtonLabel(loading: boolean): string {
	return loading ? 'Deleting...' : 'Delete';
}

// Check if delete button should be disabled
function isDeleteButtonDisabled(loading: boolean): boolean {
	return loading;
}

// Sort lists by creation date (newest first)
function sortListsByDate(lists: ListData[]): ListData[] {
	return [...lists].sort((a, b) => {
		const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
		const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
		return dateB - dateA;
	});
}

// Sort lists alphabetically by title
function sortListsByTitle(lists: ListData[]): ListData[] {
	return [...lists].sort((a, b) => a.title.localeCompare(b.title));
}

// Filter lists by visibility
function filterListsByVisibility(
	lists: ListData[],
	visibility: 'public' | 'private' | 'all'
): ListData[] {
	if (visibility === 'all') return lists;
	return lists.filter(list => list.visibility === visibility);
}

// Search lists by title
function searchLists(lists: ListData[], query: string): ListData[] {
	if (!query.trim()) return lists;
	const lowerQuery = query.toLowerCase();
	return lists.filter(list => 
		list.title.toLowerCase().includes(lowerQuery) ||
		(list.description && list.description.toLowerCase().includes(lowerQuery))
	);
}

// Get total members across all lists
function getTotalMembers(lists: ListData[]): number {
	return lists.reduce((sum, list) => sum + list.membersCount, 0);
}

// Check if has lists with members
function hasListsWithMembers(lists: ListData[]): boolean {
	return lists.some(list => list.membersCount > 0);
}

// Get empty lists
function getEmptyLists(lists: ListData[]): ListData[] {
	return lists.filter(list => list.membersCount === 0);
}

describe('Lists.Manager - Visibility Labels', () => {
	it('returns Public for public visibility', () => {
		expect(getVisibilityLabel('public')).toBe('Public');
	});

	it('returns Private for private visibility', () => {
		expect(getVisibilityLabel('private')).toBe('Private');
	});
});

describe('Lists.Manager - Members Count', () => {
	it('formats zero members', () => {
		expect(formatMembersCount(0)).toBe('0');
	});

	it('formats one member', () => {
		expect(formatMembersCount(1)).toBe('1');
	});

	it('formats multiple members', () => {
		expect(formatMembersCount(42)).toBe('42');
	});

	it('formats large member count', () => {
		expect(formatMembersCount(1000)).toBe('1000');
	});
});

describe('Lists.Manager - List Selection', () => {
	const list: ListData = {
		id: 'list-1',
		title: 'My List',
		visibility: 'private',
		membersCount: 5,
	};

	it('detects selected list', () => {
		expect(isListSelected(list, 'list-1')).toBe(true);
	});

	it('detects non-selected list', () => {
		expect(isListSelected(list, 'list-2')).toBe(false);
	});

	it('detects no selection', () => {
		expect(isListSelected(list, null)).toBe(false);
	});
});

describe('Lists.Manager - Empty State', () => {
	it('shows empty state when no lists and not loading', () => {
		expect(shouldShowEmptyState([], false)).toBe(true);
	});

	it('hides empty state when loading', () => {
		expect(shouldShowEmptyState([], true)).toBe(false);
	});

	it('hides empty state when has lists', () => {
		const lists: ListData[] = [{
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		}];
		expect(shouldShowEmptyState(lists, false)).toBe(false);
	});
});

describe('Lists.Manager - Loading State', () => {
	it('shows loading state when no lists and loading', () => {
		expect(shouldShowLoadingState([], true)).toBe(true);
	});

	it('hides loading state when not loading', () => {
		expect(shouldShowLoadingState([], false)).toBe(false);
	});

	it('hides loading state when has lists', () => {
		const lists: ListData[] = [{
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		}];
		expect(shouldShowLoadingState(lists, true)).toBe(false);
	});
});

describe('Lists.Manager - Grid Display', () => {
	it('shows grid when has lists', () => {
		const lists: ListData[] = [{
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		}];
		expect(shouldShowGrid(lists, false)).toBe(true);
		expect(shouldShowGrid(lists, true)).toBe(true);
	});

	it('hides grid when no lists', () => {
		expect(shouldShowGrid([], false)).toBe(false);
		expect(shouldShowGrid([], true)).toBe(false);
	});
});

describe('Lists.Manager - Description Display', () => {
	it('shows description when present and non-empty', () => {
		const list: ListData = {
			id: '1',
			title: 'List',
			description: 'A description',
			visibility: 'private',
			membersCount: 0,
		};
		expect(shouldShowDescription(list)).toBe(true);
	});

	it('hides description when undefined', () => {
		const list: ListData = {
			id: '1',
			title: 'List',
			visibility: 'private',
			membersCount: 0,
		};
		expect(shouldShowDescription(list)).toBe(false);
	});

	it('hides description when empty', () => {
		const list: ListData = {
			id: '1',
			title: 'List',
			description: '',
			visibility: 'private',
			membersCount: 0,
		};
		expect(shouldShowDescription(list)).toBe(false);
	});
});

describe('Lists.Manager - Delete Confirmation', () => {
	it('formats delete confirmation message', () => {
		expect(getDeleteConfirmMessage('My List')).toBe('Delete "My List"?');
	});

	it('includes list title in quotes', () => {
		const message = getDeleteConfirmMessage('Test');
		expect(message).toContain('"Test"');
	});

	it('handles special characters in title', () => {
		expect(getDeleteConfirmMessage('My "Special" List')).toBe('Delete "My "Special" List"?');
	});
});

describe('Lists.Manager - Delete Button', () => {
	it('shows Delete when not loading', () => {
		expect(getDeleteButtonLabel(false)).toBe('Delete');
	});

	it('shows Deleting... when loading', () => {
		expect(getDeleteButtonLabel(true)).toBe('Deleting...');
	});

	it('disables button when loading', () => {
		expect(isDeleteButtonDisabled(true)).toBe(true);
	});

	it('enables button when not loading', () => {
		expect(isDeleteButtonDisabled(false)).toBe(false);
	});
});

describe('Lists.Manager - Sorting by Date', () => {
	const lists: ListData[] = [
		{
			id: '1',
			title: 'First',
			visibility: 'private',
			membersCount: 0,
			createdAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			title: 'Second',
			visibility: 'private',
			membersCount: 0,
			createdAt: '2024-01-03T00:00:00Z',
		},
		{
			id: '3',
			title: 'Third',
			visibility: 'private',
			membersCount: 0,
			createdAt: '2024-01-02T00:00:00Z',
		},
	];

	it('sorts by date newest first', () => {
		const sorted = sortListsByDate(lists);
		expect(sorted[0].id).toBe('2'); // Jan 3
		expect(sorted[1].id).toBe('3'); // Jan 2
		expect(sorted[2].id).toBe('1'); // Jan 1
	});

	it('handles lists without dates', () => {
		const listsNoDates: ListData[] = [
			{ id: '1', title: 'A', visibility: 'private', membersCount: 0 },
			{ id: '2', title: 'B', visibility: 'private', membersCount: 0, createdAt: '2024-01-01T00:00:00Z' },
		];
		const sorted = sortListsByDate(listsNoDates);
		expect(sorted[0].id).toBe('2'); // Has date, comes first
	});

	it('does not mutate original array', () => {
		const original = [...lists];
		sortListsByDate(lists);
		expect(lists).toEqual(original);
	});
});

describe('Lists.Manager - Sorting Alphabetically', () => {
	const lists: ListData[] = [
		{ id: '1', title: 'Zebra', visibility: 'private', membersCount: 0 },
		{ id: '2', title: 'Apple', visibility: 'private', membersCount: 0 },
		{ id: '3', title: 'Middle', visibility: 'private', membersCount: 0 },
	];

	it('sorts alphabetically by title', () => {
		const sorted = sortListsByTitle(lists);
		expect(sorted[0].title).toBe('Apple');
		expect(sorted[1].title).toBe('Middle');
		expect(sorted[2].title).toBe('Zebra');
	});

	it('is case insensitive', () => {
		const mixedCase: ListData[] = [
			{ id: '1', title: 'zebra', visibility: 'private', membersCount: 0 },
			{ id: '2', title: 'APPLE', visibility: 'private', membersCount: 0 },
		];
		const sorted = sortListsByTitle(mixedCase);
		expect(sorted[0].title).toBe('APPLE');
	});

	it('does not mutate original array', () => {
		const original = [...lists];
		sortListsByTitle(lists);
		expect(lists).toEqual(original);
	});
});

describe('Lists.Manager - Filtering by Visibility', () => {
	const lists: ListData[] = [
		{ id: '1', title: 'Public 1', visibility: 'public', membersCount: 0 },
		{ id: '2', title: 'Private 1', visibility: 'private', membersCount: 0 },
		{ id: '3', title: 'Public 2', visibility: 'public', membersCount: 0 },
	];

	it('filters public lists', () => {
		const filtered = filterListsByVisibility(lists, 'public');
		expect(filtered).toHaveLength(2);
		expect(filtered.every(l => l.visibility === 'public')).toBe(true);
	});

	it('filters private lists', () => {
		const filtered = filterListsByVisibility(lists, 'private');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].visibility).toBe('private');
	});

	it('shows all when filter is all', () => {
		const filtered = filterListsByVisibility(lists, 'all');
		expect(filtered).toHaveLength(3);
	});
});

describe('Lists.Manager - Searching Lists', () => {
	const lists: ListData[] = [
		{ id: '1', title: 'Tech News', description: 'Latest technology', visibility: 'public', membersCount: 0 },
		{ id: '2', title: 'Friends', description: 'Close friends', visibility: 'private', membersCount: 0 },
		{ id: '3', title: 'Work', visibility: 'private', membersCount: 0 },
	];

	it('searches by title', () => {
		const results = searchLists(lists, 'Tech');
		expect(results).toHaveLength(1);
		expect(results[0].title).toBe('Tech News');
	});

	it('searches by description', () => {
		const results = searchLists(lists, 'technology');
		expect(results).toHaveLength(1);
		expect(results[0].title).toBe('Tech News');
	});

	it('is case insensitive', () => {
		const results = searchLists(lists, 'FRIENDS');
		expect(results).toHaveLength(1);
		expect(results[0].title).toBe('Friends');
	});

	it('returns all for empty query', () => {
		const results = searchLists(lists, '');
		expect(results).toHaveLength(3);
	});

	it('returns all for whitespace query', () => {
		const results = searchLists(lists, '   ');
		expect(results).toHaveLength(3);
	});

	it('returns empty for no matches', () => {
		const results = searchLists(lists, 'NonExistent');
		expect(results).toHaveLength(0);
	});

	it('matches partial words', () => {
		const results = searchLists(lists, 'ech');
		expect(results).toHaveLength(1);
	});
});

describe('Lists.Manager - Statistics', () => {
	const lists: ListData[] = [
		{ id: '1', title: 'A', visibility: 'public', membersCount: 5 },
		{ id: '2', title: 'B', visibility: 'private', membersCount: 10 },
		{ id: '3', title: 'C', visibility: 'public', membersCount: 0 },
	];

	it('calculates total members', () => {
		expect(getTotalMembers(lists)).toBe(15);
	});

	it('returns 0 for empty lists array', () => {
		expect(getTotalMembers([])).toBe(0);
	});

	it('detects lists with members', () => {
		expect(hasListsWithMembers(lists)).toBe(true);
	});

	it('detects no lists with members', () => {
		const emptyLists: ListData[] = [
			{ id: '1', title: 'A', visibility: 'private', membersCount: 0 },
		];
		expect(hasListsWithMembers(emptyLists)).toBe(false);
	});

	it('returns empty lists', () => {
		const empty = getEmptyLists(lists);
		expect(empty).toHaveLength(1);
		expect(empty[0].id).toBe('3');
	});
});

describe('Lists.Manager - Edge Cases', () => {
	it('handles lists with unicode titles', () => {
		const lists: ListData[] = [
			{ id: '1', title: 'リスト', visibility: 'private', membersCount: 0 },
			{ id: '2', title: 'Liste', visibility: 'private', membersCount: 0 },
		];
		const sorted = sortListsByTitle(lists);
		expect(sorted).toHaveLength(2);
	});

	it('handles very long titles', () => {
		const list: ListData = {
			id: '1',
			title: 'a'.repeat(100),
			visibility: 'private',
			membersCount: 0,
		};
		expect(shouldShowDescription(list)).toBe(false);
	});

	it('handles negative member counts', () => {
		// Shouldn't happen but handle gracefully
		expect(formatMembersCount(-1)).toBe('-1');
	});

	it('handles very large member counts', () => {
		expect(formatMembersCount(999999)).toBe('999999');
	});

	it('searches with special characters', () => {
		const lists: ListData[] = [
			{ id: '1', title: 'My @List #1', visibility: 'private', membersCount: 0 },
		];
		const results = searchLists(lists, '@List');
		expect(results).toHaveLength(1);
	});
});

describe('Lists.Manager - Integration', () => {
	it('combines search, filter, and sort', () => {
		const lists: ListData[] = [
			{ id: '1', title: 'Tech Public', visibility: 'public', membersCount: 5, createdAt: '2024-01-01T00:00:00Z' },
			{ id: '2', title: 'Tech Private', visibility: 'private', membersCount: 10, createdAt: '2024-01-02T00:00:00Z' },
			{ id: '3', title: 'News Public', visibility: 'public', membersCount: 3, createdAt: '2024-01-03T00:00:00Z' },
		];

		// Search for "Tech"
		let results = searchLists(lists, 'Tech');
		expect(results).toHaveLength(2);

		// Filter by public
		results = filterListsByVisibility(results, 'public');
		expect(results).toHaveLength(1);

		// Sort by date
		results = sortListsByDate(results);
		expect(results[0].id).toBe('1');
	});

	it('handles empty lists throughout pipeline', () => {
		const lists: ListData[] = [];
		
		expect(shouldShowEmptyState(lists, false)).toBe(true);
		expect(shouldShowGrid(lists, false)).toBe(false);
		expect(getTotalMembers(lists)).toBe(0);
		expect(searchLists(lists, 'query')).toHaveLength(0);
		expect(filterListsByVisibility(lists, 'public')).toHaveLength(0);
	});
});
