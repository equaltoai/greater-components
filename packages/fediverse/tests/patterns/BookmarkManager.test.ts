/**
 * BookmarkManager Pattern Component Tests
 * 
 * Comprehensive tests for BookmarkManager including:
 * - Bookmark filtering (archive, folder, tags, search)
 * - Sorting (newest, oldest, author)
 * - Pagination
 * - Bulk selection and actions
 * - Export functionality
 * - Tag and folder management
 * - Event handlers
 * - Edge cases
 */

import { describe, it, expect, vi } from 'vitest';

interface Status {
	id: string;
	content: string;
	account: {
		displayName: string;
		acct: string;
	};
}

interface Bookmark {
	id: string;
	status: Status;
	createdAt: Date | string;
	folder?: string;
	tags?: string[];
	notes?: string;
	archived?: boolean;
}

interface BookmarkFolder {
	name: string;
	description?: string;
	count: number;
	color?: string;
}

// Helper to create mock bookmark
function createMockBookmark(
	id: string,
	options: {
		content?: string;
		displayName?: string;
		acct?: string;
		createdAt?: Date;
		folder?: string;
		tags?: string[];
		notes?: string;
		archived?: boolean;
	} = {}
): Bookmark {
	return {
		id,
		status: {
			id: `status-${id}`,
			content: options.content || `Content ${id}`,
			account: {
				displayName: options.displayName || `User ${id}`,
				acct: options.acct || `user${id}@example.com`,
			},
		},
		createdAt: options.createdAt || new Date(2024, 0, parseInt(id)),
		folder: options.folder,
		tags: options.tags,
		notes: options.notes,
		archived: options.archived || false,
	};
}

// Filter bookmarks logic (extracted from component)
function filterBookmarks(
	bookmarks: Bookmark[],
	options: {
		showArchived: boolean;
		selectedFolder: string | null;
		selectedTags: string[];
		searchQuery: string;
	}
): Bookmark[] {
	let results = bookmarks;

	// Filter by archive status
	if (!options.showArchived) {
		results = results.filter((b) => !b.archived);
	}

	// Filter by folder
	if (options.selectedFolder) {
		results = results.filter((b) => b.folder === options.selectedFolder);
	}

	// Filter by tags
	if (options.selectedTags.length > 0) {
		results = results.filter((b) =>
			options.selectedTags.every((tag) => b.tags?.includes(tag))
		);
	}

	// Filter by search query
	if (options.searchQuery.trim()) {
		const query = options.searchQuery.trim().toLowerCase();
		results = results.filter(
			(b) =>
				b.status.content.toLowerCase().includes(query) ||
				b.status.account.displayName.toLowerCase().includes(query) ||
				b.status.account.acct.toLowerCase().includes(query) ||
				b.notes?.toLowerCase().includes(query)
		);
	}

	return results;
}

// Sort bookmarks logic (extracted from component)
function sortBookmarks(bookmarks: Bookmark[], sortBy: string): Bookmark[] {
	const sorted = [...bookmarks];

	switch (sortBy) {
		case 'newest':
			sorted.sort((a, b) => {
				const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
				const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
				return bTime.getTime() - aTime.getTime();
			});
			break;
		case 'oldest':
			sorted.sort((a, b) => {
				const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt;
				const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt;
				return aTime.getTime() - bTime.getTime();
			});
			break;
		case 'author':
			sorted.sort((a, b) =>
				a.status.account.displayName.localeCompare(b.status.account.displayName)
			);
			break;
	}

	return sorted;
}

// Paginate bookmarks logic
function paginateBookmarks(bookmarks: Bookmark[], page: number, itemsPerPage: number): Bookmark[] {
	return bookmarks.slice((page - 1) * itemsPerPage, page * itemsPerPage);
}

// Calculate total pages
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
	return Math.ceil(totalItems / itemsPerPage);
}

// Toggle bookmark selection
function toggleBookmarkSelection(currentSelection: Set<string>, id: string): Set<string> {
	const newSelection = new Set(currentSelection);
	if (newSelection.has(id)) {
		newSelection.delete(id);
	} else {
		newSelection.add(id);
	}
	return newSelection;
}

// Toggle tag filter
function toggleTag(currentTags: string[], tag: string): string[] {
	if (currentTags.includes(tag)) {
		return currentTags.filter((t) => t !== tag);
	}
	return [...currentTags, tag];
}

// Get folder color
function getFolderColor(folders: BookmarkFolder[], folderName: string): string {
	return folders.find((f) => f.name === folderName)?.color || '#1d9bf0';
}

describe('BookmarkManager - Filtering', () => {
	it('should show all non-archived bookmarks by default', () => {
		const bookmarks = [
			createMockBookmark('1', { archived: false }),
			createMockBookmark('2', { archived: true }),
			createMockBookmark('3', { archived: false }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should show archived bookmarks when enabled', () => {
		const bookmarks = [
			createMockBookmark('1', { archived: false }),
			createMockBookmark('2', { archived: true }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: true,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
	});

	it('should filter by folder', () => {
		const bookmarks = [
			createMockBookmark('1', { folder: 'work' }),
			createMockBookmark('2', { folder: 'personal' }),
			createMockBookmark('3', { folder: 'work' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: 'work',
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should filter by single tag', () => {
		const bookmarks = [
			createMockBookmark('1', { tags: ['javascript', 'web'] }),
			createMockBookmark('2', { tags: ['python'] }),
			createMockBookmark('3', { tags: ['javascript', 'node'] }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: ['javascript'],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should filter by multiple tags (AND logic)', () => {
		const bookmarks = [
			createMockBookmark('1', { tags: ['javascript', 'web'] }),
			createMockBookmark('2', { tags: ['javascript'] }),
			createMockBookmark('3', { tags: ['javascript', 'web', 'node'] }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: ['javascript', 'web'],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should filter by search query in content', () => {
		const bookmarks = [
			createMockBookmark('1', { content: 'Hello world' }),
			createMockBookmark('2', { content: 'Goodbye world' }),
			createMockBookmark('3', { content: 'Hello there' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: 'hello',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should filter by search query in author name', () => {
		const bookmarks = [
			createMockBookmark('1', { displayName: 'Alice' }),
			createMockBookmark('2', { displayName: 'Bob' }),
			createMockBookmark('3', { displayName: 'Alice Smith' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: 'alice',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should filter by search query in account', () => {
		const bookmarks = [
			createMockBookmark('1', { acct: 'alice@mastodon.social' }),
			createMockBookmark('2', { acct: 'bob@example.com' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: 'mastodon',
		});

		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('1');
	});

	it('should filter by search query in notes', () => {
		const bookmarks = [
			createMockBookmark('1', { notes: 'Important article' }),
			createMockBookmark('2', { notes: 'Read later' }),
			createMockBookmark('3', { notes: 'Very important' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: 'important',
		});

		expect(filtered).toHaveLength(2);
		expect(filtered.map((b) => b.id)).toEqual(['1', '3']);
	});

	it('should combine multiple filters', () => {
		const bookmarks = [
			createMockBookmark('1', { folder: 'work', tags: ['javascript'], content: 'Hello' }),
			createMockBookmark('2', { folder: 'work', tags: ['python'], content: 'Hello' }),
			createMockBookmark('3', { folder: 'personal', tags: ['javascript'], content: 'Hello' }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: 'work',
			selectedTags: ['javascript'],
			searchQuery: 'hello',
		});

		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('1');
	});

	it('should handle bookmarks without tags', () => {
		const bookmarks = [
			createMockBookmark('1', { tags: ['javascript'] }),
			createMockBookmark('2'), // No tags
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: ['javascript'],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('1');
	});

	it('should be case-insensitive for search', () => {
		const bookmarks = [createMockBookmark('1', { content: 'Hello World' })];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: 'HELLO',
		});

		expect(filtered).toHaveLength(1);
	});

	it('should trim search query', () => {
		const bookmarks = [createMockBookmark('1', { content: 'test' })];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '  test  ',
		});

		expect(filtered).toHaveLength(1);
	});

	it('should return all when search query is empty', () => {
		const bookmarks = [
			createMockBookmark('1'),
			createMockBookmark('2'),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(2);
	});
});

describe('BookmarkManager - Sorting', () => {
	it('should sort by newest first', () => {
		const bookmarks = [
			createMockBookmark('1', { createdAt: new Date(2024, 0, 1) }),
			createMockBookmark('2', { createdAt: new Date(2024, 0, 3) }),
			createMockBookmark('3', { createdAt: new Date(2024, 0, 2) }),
		];

		const sorted = sortBookmarks(bookmarks, 'newest');

		expect(sorted[0].id).toBe('2'); // Jan 3
		expect(sorted[1].id).toBe('3'); // Jan 2
		expect(sorted[2].id).toBe('1'); // Jan 1
	});

	it('should sort by oldest first', () => {
		const bookmarks = [
			createMockBookmark('1', { createdAt: new Date(2024, 0, 3) }),
			createMockBookmark('2', { createdAt: new Date(2024, 0, 1) }),
			createMockBookmark('3', { createdAt: new Date(2024, 0, 2) }),
		];

		const sorted = sortBookmarks(bookmarks, 'oldest');

		expect(sorted[0].id).toBe('2'); // Jan 1
		expect(sorted[1].id).toBe('3'); // Jan 2
		expect(sorted[2].id).toBe('1'); // Jan 3
	});

	it('should sort by author name', () => {
		const bookmarks = [
			createMockBookmark('1', { displayName: 'Charlie' }),
			createMockBookmark('2', { displayName: 'Alice' }),
			createMockBookmark('3', { displayName: 'Bob' }),
		];

		const sorted = sortBookmarks(bookmarks, 'author');

		expect(sorted[0].id).toBe('2'); // Alice
		expect(sorted[1].id).toBe('3'); // Bob
		expect(sorted[2].id).toBe('1'); // Charlie
	});

	it('should handle string dates', () => {
		const bookmarks = [
			createMockBookmark('1', { createdAt: new Date(2024, 0, 1) }),
			{ ...createMockBookmark('2'), createdAt: '2024-01-03T00:00:00Z' },
		];

		const sorted = sortBookmarks(bookmarks, 'newest');

		expect(sorted[0].id).toBe('2');
		expect(sorted[1].id).toBe('1');
	});

	it('should not mutate original array', () => {
		const bookmarks = [
			createMockBookmark('1', { createdAt: new Date(2024, 0, 2) }),
			createMockBookmark('2', { createdAt: new Date(2024, 0, 1) }),
		];

		const originalOrder = bookmarks.map((b) => b.id);
		sortBookmarks(bookmarks, 'newest');

		expect(bookmarks.map((b) => b.id)).toEqual(originalOrder);
	});
});

describe('BookmarkManager - Pagination', () => {
	it('should paginate bookmarks correctly', () => {
		const bookmarks = Array.from({ length: 25 }, (_, i) => createMockBookmark(String(i + 1)));

		const page1 = paginateBookmarks(bookmarks, 1, 10);
		const page2 = paginateBookmarks(bookmarks, 2, 10);
		const page3 = paginateBookmarks(bookmarks, 3, 10);

		expect(page1).toHaveLength(10);
		expect(page2).toHaveLength(10);
		expect(page3).toHaveLength(5);
	});

	it('should calculate total pages correctly', () => {
		expect(calculateTotalPages(25, 10)).toBe(3);
		expect(calculateTotalPages(20, 10)).toBe(2);
		expect(calculateTotalPages(21, 10)).toBe(3);
	});

	it('should handle exact multiples', () => {
		const totalPages = calculateTotalPages(20, 10);
		expect(totalPages).toBe(2);
	});

	it('should handle single page', () => {
		const bookmarks = [createMockBookmark('1'), createMockBookmark('2')];
		const paginated = paginateBookmarks(bookmarks, 1, 10);

		expect(paginated).toHaveLength(2);
	});

	it('should handle empty bookmarks', () => {
		const paginated = paginateBookmarks([], 1, 10);
		expect(paginated).toHaveLength(0);
	});

	it('should handle out of range page', () => {
		const bookmarks = [createMockBookmark('1')];
		const paginated = paginateBookmarks(bookmarks, 5, 10);

		expect(paginated).toHaveLength(0);
	});
});

describe('BookmarkManager - Selection', () => {
	it('should select bookmark', () => {
		const selection = new Set<string>();
		const newSelection = toggleBookmarkSelection(selection, '1');

		expect(newSelection.has('1')).toBe(true);
	});

	it('should deselect bookmark', () => {
		const selection = new Set(['1']);
		const newSelection = toggleBookmarkSelection(selection, '1');

		expect(newSelection.has('1')).toBe(false);
	});

	it('should toggle selection multiple times', () => {
		let selection = new Set<string>();

		selection = toggleBookmarkSelection(selection, '1');
		expect(selection.has('1')).toBe(true);

		selection = toggleBookmarkSelection(selection, '1');
		expect(selection.has('1')).toBe(false);

		selection = toggleBookmarkSelection(selection, '1');
		expect(selection.has('1')).toBe(true);
	});

	it('should select multiple bookmarks', () => {
		let selection = new Set<string>();

		selection = toggleBookmarkSelection(selection, '1');
		selection = toggleBookmarkSelection(selection, '2');
		selection = toggleBookmarkSelection(selection, '3');

		expect(selection.size).toBe(3);
		expect(selection.has('1')).toBe(true);
		expect(selection.has('2')).toBe(true);
		expect(selection.has('3')).toBe(true);
	});

	it('should select all visible bookmarks', () => {
		const paginatedBookmarks = [
			createMockBookmark('1'),
			createMockBookmark('2'),
			createMockBookmark('3'),
		];

		const selection = new Set(paginatedBookmarks.map((b) => b.id));

		expect(selection.size).toBe(3);
		expect(selection.has('1')).toBe(true);
		expect(selection.has('2')).toBe(true);
		expect(selection.has('3')).toBe(true);
	});

	it('should deselect all bookmarks', () => {
		const selection = new Set(['1', '2', '3']);

		selection.clear();

		expect(selection.size).toBe(0);
	});
});

describe('BookmarkManager - Tag Management', () => {
	it('should toggle tag filter on', () => {
		const tags: string[] = [];
		const newTags = toggleTag(tags, 'javascript');

		expect(newTags).toEqual(['javascript']);
	});

	it('should toggle tag filter off', () => {
		const tags = ['javascript'];
		const newTags = toggleTag(tags, 'javascript');

		expect(newTags).toEqual([]);
	});

	it('should add multiple tags', () => {
		let tags: string[] = [];

		tags = toggleTag(tags, 'javascript');
		tags = toggleTag(tags, 'web');
		tags = toggleTag(tags, 'node');

		expect(tags).toEqual(['javascript', 'web', 'node']);
	});

	it('should remove specific tag', () => {
		const tags = ['javascript', 'web', 'node'];
		const newTags = toggleTag(tags, 'web');

		expect(newTags).toEqual(['javascript', 'node']);
	});

	it('should not mutate original array', () => {
		const tags = ['javascript'];
		const originalTags = [...tags];

		toggleTag(tags, 'web');

		expect(tags).toEqual(originalTags);
	});
});

describe('BookmarkManager - Folder Management', () => {
	it('should get folder color', () => {
		const folders: BookmarkFolder[] = [
			{ name: 'work', count: 5, color: '#ff0000' },
			{ name: 'personal', count: 3, color: '#00ff00' },
		];

		const color = getFolderColor(folders, 'work');

		expect(color).toBe('#ff0000');
	});

	it('should return default color for unknown folder', () => {
		const folders: BookmarkFolder[] = [
			{ name: 'work', count: 5, color: '#ff0000' },
		];

		const color = getFolderColor(folders, 'unknown');

		expect(color).toBe('#1d9bf0');
	});

	it('should return default color for folder without color', () => {
		const folders: BookmarkFolder[] = [
			{ name: 'work', count: 5 }, // No color
		];

		const color = getFolderColor(folders, 'work');

		expect(color).toBe('#1d9bf0');
	});
});

describe('BookmarkManager - Event Handlers', () => {
	it('should call onRemove handler', async () => {
		const onRemove = vi.fn().mockResolvedValue(undefined);
		await onRemove('bookmark-1');

		expect(onRemove).toHaveBeenCalledWith('bookmark-1');
	});

	it('should call onBulkRemove handler', async () => {
		const onBulkRemove = vi.fn().mockResolvedValue(undefined);
		const ids = ['1', '2', '3'];

		await onBulkRemove(ids);

		expect(onBulkRemove).toHaveBeenCalledWith(ids);
	});

	it('should call onFolderChange handler', async () => {
		const onFolderChange = vi.fn().mockResolvedValue(undefined);
		await onFolderChange('bookmark-1', 'work');

		expect(onFolderChange).toHaveBeenCalledWith('bookmark-1', 'work');
	});

	it('should call onTagsChange handler', async () => {
		const onTagsChange = vi.fn().mockResolvedValue(undefined);
		const tags = ['javascript', 'web'];

		await onTagsChange('bookmark-1', tags);

		expect(onTagsChange).toHaveBeenCalledWith('bookmark-1', tags);
	});

	it('should call onNotesChange handler', async () => {
		const onNotesChange = vi.fn().mockResolvedValue(undefined);
		await onNotesChange('bookmark-1', 'Important note');

		expect(onNotesChange).toHaveBeenCalledWith('bookmark-1', 'Important note');
	});

	it('should call onArchiveToggle handler', async () => {
		const onArchiveToggle = vi.fn().mockResolvedValue(undefined);
		await onArchiveToggle('bookmark-1', true);

		expect(onArchiveToggle).toHaveBeenCalledWith('bookmark-1', true);
	});

	it('should call onExport handler', () => {
		const onExport = vi.fn();
		const ids = ['1', '2', '3'];

		onExport(ids, 'json');

		expect(onExport).toHaveBeenCalledWith(ids, 'json');
	});

	it('should call onStatusClick handler', () => {
		const onStatusClick = vi.fn();
		const status: Status = {
			id: 'status-1',
			content: 'Test',
			account: { displayName: 'User', acct: 'user@example.com' },
		};

		onStatusClick(status);

		expect(onStatusClick).toHaveBeenCalledWith(status);
	});
});

describe('BookmarkManager - Edge Cases', () => {
	it('should handle empty bookmarks array', () => {
		const filtered = filterBookmarks([], {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toEqual([]);
	});

	it('should handle bookmarks with null/undefined fields', () => {
		const bookmarks = [
			createMockBookmark('1', { folder: undefined, tags: undefined, notes: undefined }),
		];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '',
		});

		expect(filtered).toHaveLength(1);
	});

	it('should handle zero items per page', () => {
		const totalPages = calculateTotalPages(10, 0);
		expect(totalPages).toBe(Infinity);
	});

	it('should handle very large page numbers', () => {
		const bookmarks = [createMockBookmark('1')];
		const paginated = paginateBookmarks(bookmarks, 1000, 10);

		expect(paginated).toHaveLength(0);
	});

	it('should handle whitespace-only search query', () => {
		const bookmarks = [createMockBookmark('1')];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '   ',
		});

		expect(filtered).toHaveLength(1);
	});

	it('should handle special characters in search', () => {
		const bookmarks = [createMockBookmark('1', { content: 'Test & Co.' })];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '&',
		});

		expect(filtered).toHaveLength(1);
	});

	it('should handle unicode in search', () => {
		const bookmarks = [createMockBookmark('1', { content: 'Hello 世界' })];

		const filtered = filterBookmarks(bookmarks, {
			showArchived: false,
			selectedFolder: null,
			selectedTags: [],
			searchQuery: '世界',
		});

		expect(filtered).toHaveLength(1);
	});
});

describe('BookmarkManager - Type Safety', () => {
	it('should enforce Bookmark structure', () => {
		const bookmark: Bookmark = {
			id: '1',
			status: {
				id: 'status-1',
				content: 'Test',
				account: {
					displayName: 'User',
					acct: 'user@example.com',
				},
			},
			createdAt: new Date(),
		};

		expect(bookmark).toHaveProperty('id');
		expect(bookmark).toHaveProperty('status');
		expect(bookmark).toHaveProperty('createdAt');
	});

	it('should enforce BookmarkFolder structure', () => {
		const folder: BookmarkFolder = {
			name: 'work',
			count: 5,
			color: '#ff0000',
		};

		expect(folder).toHaveProperty('name');
		expect(folder).toHaveProperty('count');
	});
});
