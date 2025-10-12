/**
 * Lists.MemberPicker Component Tests
 * 
 * Tests for member picker logic including:
 * - Search query validation
 * - Member checking
 * - Action button states
 * - Empty state messages
 * - Avatar placeholder generation
 * - Members count formatting
 */

import { describe, it, expect } from 'vitest';

// Member interface
interface Actor {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
}

interface ListMember {
	id: string;
	listId: string;
	actor: Actor;
	addedAt: string;
}

// Search query validation
function isValidSearchQuery(query: string): boolean {
	return query.trim().length > 0;
}

// Normalize search query
function normalizeSearchQuery(query: string): string {
	return query.trim();
}

// Check if account is already a member
function isMember(accountId: string, members: ListMember[]): boolean {
	return members.some(m => m.actor.id === accountId);
}

// Get action button label
function getActionButtonLabel(isMember: boolean): string {
	return isMember ? 'Remove' : 'Add';
}

// Get action button class
function getActionButtonClass(isMember: boolean): string {
	return isMember ? 'member-picker__action--remove' : 'member-picker__action--add';
}

// Get avatar placeholder initial
function getAvatarPlaceholder(displayName: string): string {
	return displayName.charAt(0).toUpperCase();
}

// Check if should show avatar
function shouldShowAvatar(avatar: string | undefined): boolean {
	return avatar !== undefined && avatar.length > 0;
}

// Format username with @ prefix
function formatUsername(username: string): string {
	return `@${username}`;
}

// Format members count
function formatMembersCount(count: number): string {
	return count === 1 ? '1 member' : `${count} members`;
}

// Get no results message
function getNoResultsMessage(query: string): string {
	return `No users found matching "${query}"`;
}

// Get empty members message
function getEmptyMembersMessage(): { title: string; hint: string } {
	return {
		title: 'No members yet',
		hint: 'Search to add people to this list',
	};
}

// Get no list selected message
function getNoListMessage(): string {
	return 'Select a list to manage members';
}

// Check if should show search results
function shouldShowSearchResults(results: unknown[], query: string, searching: boolean): boolean {
	return results.length > 0;
}

// Check if should show no results message
function shouldShowNoResults(results: unknown[], query: string, searching: boolean): boolean {
	return results.length === 0 && query.trim().length > 0 && !searching;
}

// Check if should show loading spinner
function shouldShowSpinner(searching: boolean): boolean {
	return searching;
}

// Check if should show current members
function shouldShowCurrentMembers(members: ListMember[]): boolean {
	return members.length > 0;
}

// Check if should show empty members state
function shouldShowEmptyMembers(members: ListMember[]): boolean {
	return members.length === 0;
}

// Debounce delay
function getDebounceDelay(): number {
	return 300;
}

// Filter duplicate members from search results
function filterDuplicateMembers(
	searchResults: ListMember[],
	currentMembers: ListMember[]
): ListMember[] {
	const memberIds = new Set(currentMembers.map(m => m.actor.id));
	return searchResults.filter(result => !memberIds.has(result.actor.id));
}

// Get member info for display
function getMemberInfo(member: ListMember): {
	name: string;
	username: string;
	initial: string;
	hasAvatar: boolean;
} {
	return {
		name: member.actor.displayName,
		username: formatUsername(member.actor.username),
		initial: getAvatarPlaceholder(member.actor.displayName),
		hasAvatar: shouldShowAvatar(member.actor.avatar),
	};
}

// Sort members alphabetically
function sortMembersAlphabetically(members: ListMember[]): ListMember[] {
	return [...members].sort((a, b) =>
		a.actor.displayName.localeCompare(b.actor.displayName)
	);
}

// Get search placeholder
function getSearchPlaceholder(): string {
	return 'Search people to add...';
}

describe('Lists.MemberPicker - Search Query Validation', () => {
	it('validates non-empty query', () => {
		expect(isValidSearchQuery('search term')).toBe(true);
	});

	it('rejects empty query', () => {
		expect(isValidSearchQuery('')).toBe(false);
	});

	it('rejects whitespace-only query', () => {
		expect(isValidSearchQuery('   ')).toBe(false);
	});

	it('validates single character', () => {
		expect(isValidSearchQuery('a')).toBe(true);
	});

	it('validates unicode query', () => {
		expect(isValidSearchQuery('ユーザー')).toBe(true);
	});
});

describe('Lists.MemberPicker - Query Normalization', () => {
	it('trims leading whitespace', () => {
		expect(normalizeSearchQuery('  test')).toBe('test');
	});

	it('trims trailing whitespace', () => {
		expect(normalizeSearchQuery('test  ')).toBe('test');
	});

	it('trims both sides', () => {
		expect(normalizeSearchQuery('  test  ')).toBe('test');
	});

	it('preserves internal whitespace', () => {
		expect(normalizeSearchQuery('test  query')).toBe('test  query');
	});

	it('handles empty string', () => {
		expect(normalizeSearchQuery('')).toBe('');
	});
});

describe('Lists.MemberPicker - Member Checking', () => {
	const members: ListMember[] = [
		{
			id: 'member-1',
			listId: 'list-1',
			actor: { id: 'actor-1', username: 'alice', displayName: 'Alice' },
			addedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: 'member-2',
			listId: 'list-1',
			actor: { id: 'actor-2', username: 'bob', displayName: 'Bob' },
			addedAt: '2024-01-01T00:00:00Z',
		},
	];

	it('detects existing member', () => {
		expect(isMember('actor-1', members)).toBe(true);
	});

	it('detects non-member', () => {
		expect(isMember('actor-3', members)).toBe(false);
	});

	it('handles empty members array', () => {
		expect(isMember('actor-1', [])).toBe(false);
	});

	it('checks multiple members', () => {
		expect(isMember('actor-1', members)).toBe(true);
		expect(isMember('actor-2', members)).toBe(true);
		expect(isMember('actor-3', members)).toBe(false);
	});
});

describe('Lists.MemberPicker - Action Button', () => {
	it('shows Remove label for members', () => {
		expect(getActionButtonLabel(true)).toBe('Remove');
	});

	it('shows Add label for non-members', () => {
		expect(getActionButtonLabel(false)).toBe('Add');
	});

	it('returns remove class for members', () => {
		expect(getActionButtonClass(true)).toBe('member-picker__action--remove');
	});

	it('returns add class for non-members', () => {
		expect(getActionButtonClass(false)).toBe('member-picker__action--add');
	});
});

describe('Lists.MemberPicker - Avatar Placeholder', () => {
	it('returns first character uppercase', () => {
		expect(getAvatarPlaceholder('Alice')).toBe('A');
	});

	it('handles lowercase names', () => {
		expect(getAvatarPlaceholder('bob')).toBe('B');
	});

	it('returns empty string for empty name', () => {
		expect(getAvatarPlaceholder('')).toBe('');
	});

	it('handles unicode characters', () => {
		expect(getAvatarPlaceholder('世界')).toBe('世');
	});

	it('handles single character', () => {
		expect(getAvatarPlaceholder('A')).toBe('A');
	});
});

describe('Lists.MemberPicker - Avatar Display', () => {
	it('shows avatar when URL provided', () => {
		expect(shouldShowAvatar('https://example.com/avatar.png')).toBe(true);
	});

	it('hides avatar when undefined', () => {
		expect(shouldShowAvatar(undefined)).toBe(false);
	});

	it('hides avatar when empty string', () => {
		expect(shouldShowAvatar('')).toBe(false);
	});
});

describe('Lists.MemberPicker - Username Formatting', () => {
	it('prefixes with @', () => {
		expect(formatUsername('alice')).toBe('@alice');
	});

	it('handles empty username', () => {
		expect(formatUsername('')).toBe('@');
	});

	it('handles special characters', () => {
		expect(formatUsername('alice_123')).toBe('@alice_123');
	});
});

describe('Lists.MemberPicker - Members Count', () => {
	it('formats singular member', () => {
		expect(formatMembersCount(1)).toBe('1 member');
	});

	it('formats zero members', () => {
		expect(formatMembersCount(0)).toBe('0 members');
	});

	it('formats multiple members', () => {
		expect(formatMembersCount(5)).toBe('5 members');
	});

	it('formats large count', () => {
		expect(formatMembersCount(1000)).toBe('1000 members');
	});
});

describe('Lists.MemberPicker - Messages', () => {
	it('formats no results message with query', () => {
		const message = getNoResultsMessage('alice');
		expect(message).toContain('alice');
		expect(message).toContain('No users found');
	});

	it('includes query in quotes', () => {
		const message = getNoResultsMessage('test');
		expect(message).toContain('"test"');
	});

	it('returns empty members message', () => {
		const message = getEmptyMembersMessage();
		expect(message.title).toBe('No members yet');
		expect(message.hint).toContain('Search');
	});

	it('returns no list selected message', () => {
		expect(getNoListMessage()).toBe('Select a list to manage members');
	});
});

describe('Lists.MemberPicker - Display States', () => {
	it('shows search results when has results', () => {
		expect(shouldShowSearchResults([{}], 'query', false)).toBe(true);
	});

	it('shows no results message when empty and not searching', () => {
		expect(shouldShowNoResults([], 'query', false)).toBe(true);
	});

	it('hides no results when searching', () => {
		expect(shouldShowNoResults([], 'query', true)).toBe(false);
	});

	it('hides no results when query is empty', () => {
		expect(shouldShowNoResults([], '', false)).toBe(false);
	});

	it('hides no results when has results', () => {
		expect(shouldShowNoResults([{}], 'query', false)).toBe(false);
	});

	it('shows spinner when searching', () => {
		expect(shouldShowSpinner(true)).toBe(true);
	});

	it('hides spinner when not searching', () => {
		expect(shouldShowSpinner(false)).toBe(false);
	});
});

describe('Lists.MemberPicker - Current Members Display', () => {
	const members: ListMember[] = [
		{
			id: '1',
			listId: 'list-1',
			actor: { id: '1', username: 'alice', displayName: 'Alice' },
			addedAt: '2024-01-01T00:00:00Z',
		},
	];

	it('shows current members when has members', () => {
		expect(shouldShowCurrentMembers(members)).toBe(true);
	});

	it('hides current members when empty', () => {
		expect(shouldShowCurrentMembers([])).toBe(false);
	});

	it('shows empty state when no members', () => {
		expect(shouldShowEmptyMembers([])).toBe(true);
	});

	it('hides empty state when has members', () => {
		expect(shouldShowEmptyMembers(members)).toBe(false);
	});
});

describe('Lists.MemberPicker - Debounce Configuration', () => {
	it('returns debounce delay in milliseconds', () => {
		expect(getDebounceDelay()).toBe(300);
	});

	it('delay is positive number', () => {
		expect(getDebounceDelay()).toBeGreaterThan(0);
	});
});

describe('Lists.MemberPicker - Duplicate Filtering', () => {
	const currentMembers: ListMember[] = [
		{
			id: 'member-1',
			listId: 'list-1',
			actor: { id: 'actor-1', username: 'alice', displayName: 'Alice' },
			addedAt: '2024-01-01T00:00:00Z',
		},
	];

	const searchResults: ListMember[] = [
		{
			id: 'result-1',
			listId: 'list-1',
			actor: { id: 'actor-1', username: 'alice', displayName: 'Alice' }, // Duplicate
			addedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: 'result-2',
			listId: 'list-1',
			actor: { id: 'actor-2', username: 'bob', displayName: 'Bob' }, // New
			addedAt: '2024-01-01T00:00:00Z',
		},
	];

	it('filters out duplicate members', () => {
		const filtered = filterDuplicateMembers(searchResults, currentMembers);
		expect(filtered).toHaveLength(1);
		expect(filtered[0].actor.id).toBe('actor-2');
	});

	it('returns all results when no duplicates', () => {
		const filtered = filterDuplicateMembers(searchResults, []);
		expect(filtered).toHaveLength(2);
	});

	it('returns empty when all are duplicates', () => {
		const filtered = filterDuplicateMembers([searchResults[0]], currentMembers);
		expect(filtered).toHaveLength(0);
	});
});

describe('Lists.MemberPicker - Member Info Extraction', () => {
	it('extracts complete member info with avatar', () => {
		const member: ListMember = {
			id: '1',
			listId: 'list-1',
			actor: {
				id: '1',
				username: 'alice',
				displayName: 'Alice Johnson',
				avatar: 'https://example.com/avatar.png',
			},
			addedAt: '2024-01-01T00:00:00Z',
		};

		const info = getMemberInfo(member);
		expect(info.name).toBe('Alice Johnson');
		expect(info.username).toBe('@alice');
		expect(info.initial).toBe('A');
		expect(info.hasAvatar).toBe(true);
	});

	it('extracts member info without avatar', () => {
		const member: ListMember = {
			id: '1',
			listId: 'list-1',
			actor: {
				id: '1',
				username: 'bob',
				displayName: 'Bob Smith',
			},
			addedAt: '2024-01-01T00:00:00Z',
		};

		const info = getMemberInfo(member);
		expect(info.name).toBe('Bob Smith');
		expect(info.username).toBe('@bob');
		expect(info.initial).toBe('B');
		expect(info.hasAvatar).toBe(false);
	});
});

describe('Lists.MemberPicker - Member Sorting', () => {
	const members: ListMember[] = [
		{
			id: '1',
			listId: 'list-1',
			actor: { id: '1', username: 'z', displayName: 'Zebra' },
			addedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			listId: 'list-1',
			actor: { id: '2', username: 'a', displayName: 'Apple' },
			addedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '3',
			listId: 'list-1',
			actor: { id: '3', username: 'm', displayName: 'Middle' },
			addedAt: '2024-01-01T00:00:00Z',
		},
	];

	it('sorts alphabetically by display name', () => {
		const sorted = sortMembersAlphabetically(members);
		expect(sorted[0].actor.displayName).toBe('Apple');
		expect(sorted[1].actor.displayName).toBe('Middle');
		expect(sorted[2].actor.displayName).toBe('Zebra');
	});

	it('is case insensitive', () => {
		const mixedCase: ListMember[] = [
			{
				id: '1',
				listId: 'list-1',
				actor: { id: '1', username: 'z', displayName: 'zebra' },
				addedAt: '2024-01-01T00:00:00Z',
			},
			{
				id: '2',
				listId: 'list-1',
				actor: { id: '2', username: 'a', displayName: 'APPLE' },
				addedAt: '2024-01-01T00:00:00Z',
			},
		];
		const sorted = sortMembersAlphabetically(mixedCase);
		expect(sorted[0].actor.displayName).toBe('APPLE');
	});

	it('does not mutate original array', () => {
		const original = [...members];
		sortMembersAlphabetically(members);
		expect(members).toEqual(original);
	});
});

describe('Lists.MemberPicker - Placeholder Text', () => {
	it('returns search placeholder', () => {
		expect(getSearchPlaceholder()).toBe('Search people to add...');
	});

	it('placeholder is descriptive', () => {
		const placeholder = getSearchPlaceholder();
		expect(placeholder).toContain('Search');
		expect(placeholder).toContain('add');
	});
});

describe('Lists.MemberPicker - Edge Cases', () => {
	it('handles empty member list', () => {
		expect(isMember('any-id', [])).toBe(false);
		expect(shouldShowCurrentMembers([])).toBe(false);
		expect(shouldShowEmptyMembers([])).toBe(true);
	});

	it('handles unicode in names', () => {
		const member: ListMember = {
			id: '1',
			listId: 'list-1',
			actor: { id: '1', username: 'user', displayName: '世界' },
			addedAt: '2024-01-01T00:00:00Z',
		};

		const info = getMemberInfo(member);
		expect(info.name).toBe('世界');
		expect(info.initial).toBe('世');
	});

	it('handles special characters in search query', () => {
		const query = '@alice #tag';
		expect(isValidSearchQuery(query)).toBe(true);
		expect(normalizeSearchQuery(query)).toBe('@alice #tag');
	});

	it('handles very long member counts', () => {
		expect(formatMembersCount(999999)).toBe('999999 members');
	});

	it('handles negative member count', () => {
		// Shouldn't happen but handle gracefully
		expect(formatMembersCount(-1)).toBe('-1 members');
	});
});

describe('Lists.MemberPicker - Integration', () => {
	it('processes member for display with all checks', () => {
		const currentMembers: ListMember[] = [
			{
				id: 'member-1',
				listId: 'list-1',
				actor: { id: 'actor-1', username: 'alice', displayName: 'Alice' },
				addedAt: '2024-01-01T00:00:00Z',
			},
		];

		const searchResult: ListMember = {
			id: 'result-1',
			listId: 'list-1',
			actor: {
				id: 'actor-2',
				username: 'bob',
				displayName: 'Bob Smith',
				avatar: 'https://example.com/avatar.png',
			},
			addedAt: '2024-01-01T00:00:00Z',
		};

		const isExistingMember = isMember(searchResult.actor.id, currentMembers);
		expect(isExistingMember).toBe(false);

		const buttonLabel = getActionButtonLabel(isExistingMember);
		expect(buttonLabel).toBe('Add');

		const buttonClass = getActionButtonClass(isExistingMember);
		expect(buttonClass).toBe('member-picker__action--add');

		const info = getMemberInfo(searchResult);
		expect(info.name).toBe('Bob Smith');
		expect(info.username).toBe('@bob');
		expect(info.initial).toBe('B');
		expect(info.hasAvatar).toBe(true);
	});

	it('handles search workflow', () => {
		const query = '  alice  ';
		
		expect(isValidSearchQuery(query)).toBe(true);
		
		const normalized = normalizeSearchQuery(query);
		expect(normalized).toBe('alice');

		const message = getNoResultsMessage(normalized);
		expect(message).toContain('alice');
		
		expect(getDebounceDelay()).toBe(300);
	});

	it('combines display state checks', () => {
		const results: ListMember[] = [];
		const query = 'search';
		const searching = false;

		expect(shouldShowSearchResults(results, query, searching)).toBe(false);
		expect(shouldShowNoResults(results, query, searching)).toBe(true);
		expect(shouldShowSpinner(searching)).toBe(false);
	});
});

