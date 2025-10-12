/**
 * Messages.NewConversation Component Tests
 * 
 * Tests for new conversation creation logic including:
 * - Participant selection
 * - Search functionality
 * - Validation
 * - Error handling
 * - Button states
 */

import { describe, it, expect } from 'vitest';

// Interfaces
interface MessageParticipant {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
}

// Check if search query is valid
function isValidSearchQuery(query: string): boolean {
	return query.trim().length > 0;
}

// Check if can create conversation
function canCreateConversation(
	selectedParticipants: MessageParticipant[],
	creating: boolean
): boolean {
	return selectedParticipants.length > 0 && !creating;
}

// Check if participant is already selected
function isParticipantSelected(
	participant: MessageParticipant,
	selectedParticipants: MessageParticipant[]
): boolean {
	return selectedParticipants.some((p) => p.id === participant.id);
}

// Check if can select participant
function canSelectParticipant(
	participant: MessageParticipant,
	selectedParticipants: MessageParticipant[]
): boolean {
	return !isParticipantSelected(participant, selectedParticipants);
}

// Add participant to selection
function addParticipant(
	participant: MessageParticipant,
	selectedParticipants: MessageParticipant[]
): MessageParticipant[] {
	if (isParticipantSelected(participant, selectedParticipants)) {
		return selectedParticipants;
	}
	return [...selectedParticipants, participant];
}

// Remove participant from selection
function removeParticipant(
	participantId: string,
	selectedParticipants: MessageParticipant[]
): MessageParticipant[] {
	return selectedParticipants.filter((p) => p.id !== participantId);
}

// Get participant IDs
function getParticipantIds(participants: MessageParticipant[]): string[] {
	return participants.map((p) => p.id);
}

// Check if search results are empty
function hasSearchResults(results: MessageParticipant[]): boolean {
	return results.length > 0;
}

// Check if should show empty state
function shouldShowEmptyState(
	searchQuery: string,
	searching: boolean,
	results: MessageParticipant[]
): boolean {
	return searchQuery.trim().length > 0 && !searching && results.length === 0;
}

// Check if should show results
function shouldShowResults(results: MessageParticipant[]): boolean {
	return results.length > 0;
}

// Check if input should be disabled
function isInputDisabled(creating: boolean): boolean {
	return creating;
}

// Check if start button should be disabled
function isStartButtonDisabled(
	selectedParticipants: MessageParticipant[],
	creating: boolean
): boolean {
	return creating || selectedParticipants.length === 0;
}

// Get start button text
function getStartButtonText(creating: boolean): string {
	return creating ? 'Creating...' : 'Start Conversation';
}

// Get participant count
function getParticipantCount(participants: MessageParticipant[]): number {
	return participants.length;
}

// Check if has participants
function hasParticipants(participants: MessageParticipant[]): boolean {
	return participants.length > 0;
}

// Find participant by ID
function findParticipantById(
	participants: MessageParticipant[],
	id: string
): MessageParticipant | undefined {
	return participants.find((p) => p.id === id);
}

// Filter participants by query
function filterParticipantsByQuery(
	participants: MessageParticipant[],
	query: string
): MessageParticipant[] {
	const lowerQuery = query.toLowerCase();
	return participants.filter(
		(p) =>
			p.displayName.toLowerCase().includes(lowerQuery) ||
			p.username.toLowerCase().includes(lowerQuery)
	);
}

// Get avatar initial
function getAvatarInitial(participant: MessageParticipant): string {
	return participant.displayName.charAt(0).toUpperCase();
}

// Check if participant has avatar
function hasAvatar(participant: MessageParticipant): boolean {
	return !!participant.avatar;
}

// Check if should show selected section
function shouldShowSelectedSection(selectedParticipants: MessageParticipant[]): boolean {
	return selectedParticipants.length > 0;
}

// Validate participant selection for group
function isValidGroupSize(count: number, maxSize: number = 10): boolean {
	return count > 0 && count <= maxSize;
}

describe('Messages.NewConversation - Search Validation', () => {
	it('validates non-empty query', () => {
		expect(isValidSearchQuery('alice')).toBe(true);
	});

	it('invalidates empty query', () => {
		expect(isValidSearchQuery('')).toBe(false);
	});

	it('invalidates whitespace-only query', () => {
		expect(isValidSearchQuery('   ')).toBe(false);
	});

	it('validates query with leading/trailing whitespace', () => {
		expect(isValidSearchQuery('  alice  ')).toBe(true);
	});
});

describe('Messages.NewConversation - Participant Selection', () => {
	const alice: MessageParticipant = { id: '1', username: 'alice', displayName: 'Alice' };
	const bob: MessageParticipant = { id: '2', username: 'bob', displayName: 'Bob' };
	const charlie: MessageParticipant = { id: '3', username: 'charlie', displayName: 'Charlie' };

	it('detects participant is selected', () => {
		const selected = [alice, bob];
		expect(isParticipantSelected(alice, selected)).toBe(true);
	});

	it('detects participant is not selected', () => {
		const selected = [alice, bob];
		expect(isParticipantSelected(charlie, selected)).toBe(false);
	});

	it('checks if can select participant', () => {
		const selected = [alice];
		expect(canSelectParticipant(bob, selected)).toBe(true);
		expect(canSelectParticipant(alice, selected)).toBe(false);
	});

	it('adds participant to selection', () => {
		const selected = [alice];
		const newSelected = addParticipant(bob, selected);
		expect(newSelected).toHaveLength(2);
		expect(newSelected).toContain(bob);
	});

	it('does not add duplicate participant', () => {
		const selected = [alice];
		const newSelected = addParticipant(alice, selected);
		expect(newSelected).toHaveLength(1);
	});

	it('removes participant from selection', () => {
		const selected = [alice, bob, charlie];
		const newSelected = removeParticipant('2', selected);
		expect(newSelected).toHaveLength(2);
		expect(newSelected.find((p) => p.id === '2')).toBeUndefined();
	});

	it('handles removing non-existent participant', () => {
		const selected = [alice, bob];
		const newSelected = removeParticipant('999', selected);
		expect(newSelected).toHaveLength(2);
	});
});

describe('Messages.NewConversation - Participant IDs', () => {
	const participants: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice' },
		{ id: '2', username: 'bob', displayName: 'Bob' },
		{ id: '3', username: 'charlie', displayName: 'Charlie' },
	];

	it('extracts participant IDs', () => {
		const ids = getParticipantIds(participants);
		expect(ids).toEqual(['1', '2', '3']);
	});

	it('handles empty participants', () => {
		expect(getParticipantIds([])).toEqual([]);
	});

	it('handles single participant', () => {
		expect(getParticipantIds([participants[0]])).toEqual(['1']);
	});
});

describe('Messages.NewConversation - Search Results', () => {
	const results: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice' },
	];

	it('detects has results', () => {
		expect(hasSearchResults(results)).toBe(true);
	});

	it('detects no results', () => {
		expect(hasSearchResults([])).toBe(false);
	});

	it('shows empty state when search complete with no results', () => {
		expect(shouldShowEmptyState('alice', false, [])).toBe(true);
	});

	it('hides empty state when searching', () => {
		expect(shouldShowEmptyState('alice', true, [])).toBe(false);
	});

	it('hides empty state when no query', () => {
		expect(shouldShowEmptyState('', false, [])).toBe(false);
	});

	it('hides empty state when has results', () => {
		expect(shouldShowEmptyState('alice', false, results)).toBe(false);
	});

	it('shows results when available', () => {
		expect(shouldShowResults(results)).toBe(true);
	});

	it('hides results when empty', () => {
		expect(shouldShowResults([])).toBe(false);
	});
});

describe('Messages.NewConversation - Button States', () => {
	const alice: MessageParticipant = { id: '1', username: 'alice', displayName: 'Alice' };

	it('enables start button with participants and not creating', () => {
		expect(canCreateConversation([alice], false)).toBe(true);
	});

	it('disables start button when creating', () => {
		expect(canCreateConversation([alice], true)).toBe(false);
	});

	it('disables start button without participants', () => {
		expect(canCreateConversation([], false)).toBe(false);
	});

	it('disables start button when both', () => {
		expect(canCreateConversation([], true)).toBe(false);
	});

	it('checks start button disabled state', () => {
		expect(isStartButtonDisabled([alice], false)).toBe(false);
		expect(isStartButtonDisabled([], false)).toBe(true);
		expect(isStartButtonDisabled([alice], true)).toBe(true);
	});

	it('gets start button text', () => {
		expect(getStartButtonText(false)).toBe('Start Conversation');
		expect(getStartButtonText(true)).toBe('Creating...');
	});

	it('checks input disabled state', () => {
		expect(isInputDisabled(false)).toBe(false);
		expect(isInputDisabled(true)).toBe(true);
	});
});

describe('Messages.NewConversation - Participant Count', () => {
	const participants: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice' },
		{ id: '2', username: 'bob', displayName: 'Bob' },
	];

	it('counts participants', () => {
		expect(getParticipantCount(participants)).toBe(2);
	});

	it('returns 0 for empty', () => {
		expect(getParticipantCount([])).toBe(0);
	});

	it('checks if has participants', () => {
		expect(hasParticipants(participants)).toBe(true);
		expect(hasParticipants([])).toBe(false);
	});
});

describe('Messages.NewConversation - Find Participant', () => {
	const participants: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice' },
		{ id: '2', username: 'bob', displayName: 'Bob' },
	];

	it('finds participant by ID', () => {
		const found = findParticipantById(participants, '1');
		expect(found?.username).toBe('alice');
	});

	it('returns undefined for non-existent ID', () => {
		expect(findParticipantById(participants, '999')).toBeUndefined();
	});

	it('handles empty participants', () => {
		expect(findParticipantById([], '1')).toBeUndefined();
	});
});

describe('Messages.NewConversation - Filter Participants', () => {
	const participants: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice Smith' },
		{ id: '2', username: 'bob', displayName: 'Bob Jones' },
		{ id: '3', username: 'charlie', displayName: 'Charlie Brown' },
	];

	it('filters by display name', () => {
		const filtered = filterParticipantsByQuery(participants, 'Alice');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('1');
	});

	it('filters by username', () => {
		const filtered = filterParticipantsByQuery(participants, 'bob');
		expect(filtered).toHaveLength(1);
		expect(filtered[0].id).toBe('2');
	});

	it('is case insensitive', () => {
		const filtered = filterParticipantsByQuery(participants, 'ALICE');
		expect(filtered).toHaveLength(1);
	});

	it('returns multiple matches', () => {
		const filtered = filterParticipantsByQuery(participants, 'o');
		expect(filtered.length).toBeGreaterThan(0);
	});

	it('returns empty for no matches', () => {
		const filtered = filterParticipantsByQuery(participants, 'xyz');
		expect(filtered).toHaveLength(0);
	});
});

describe('Messages.NewConversation - Avatar', () => {
	const withAvatar: MessageParticipant = {
		id: '1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'https://example.com/avatar.jpg',
	};

	const withoutAvatar: MessageParticipant = {
		id: '2',
		username: 'bob',
		displayName: 'Bob',
	};

	it('detects participant has avatar', () => {
		expect(hasAvatar(withAvatar)).toBe(true);
	});

	it('detects participant has no avatar', () => {
		expect(hasAvatar(withoutAvatar)).toBe(false);
	});

	it('gets avatar initial', () => {
		expect(getAvatarInitial(withoutAvatar)).toBe('B');
	});

	it('uppercases initial', () => {
		const lowercase: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: 'alice',
		};
		expect(getAvatarInitial(lowercase)).toBe('A');
	});

	it('handles unicode', () => {
		const unicode: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '世界',
		};
		expect(getAvatarInitial(unicode)).toBe('世');
	});
});

describe('Messages.NewConversation - UI State', () => {
	it('shows selected section with participants', () => {
		const alice: MessageParticipant = { id: '1', username: 'alice', displayName: 'Alice' };
		expect(shouldShowSelectedSection([alice])).toBe(true);
	});

	it('hides selected section without participants', () => {
		expect(shouldShowSelectedSection([])).toBe(false);
	});
});

describe('Messages.NewConversation - Group Validation', () => {
	it('validates valid group size', () => {
		expect(isValidGroupSize(1, 10)).toBe(true);
		expect(isValidGroupSize(5, 10)).toBe(true);
		expect(isValidGroupSize(10, 10)).toBe(true);
	});

	it('invalidates group size of 0', () => {
		expect(isValidGroupSize(0, 10)).toBe(false);
	});

	it('invalidates group size over limit', () => {
		expect(isValidGroupSize(11, 10)).toBe(false);
	});

	it('handles custom max size', () => {
		expect(isValidGroupSize(5, 3)).toBe(false);
		expect(isValidGroupSize(3, 3)).toBe(true);
	});
});

describe('Messages.NewConversation - Edge Cases', () => {
	it('handles very long display names', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: 'A'.repeat(100),
		};
		expect(getAvatarInitial(participant)).toBe('A');
		expect(isParticipantSelected(participant, [participant])).toBe(true);
	});

	it('handles special characters in names', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '@#$%',
		};
		expect(getAvatarInitial(participant)).toBe('@');
	});

	it('handles empty display name', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '',
		};
		// charAt(0) on empty string returns ''
		expect(getAvatarInitial(participant)).toBe('');
	});

	it('handles large selection', () => {
		const participants = Array.from({ length: 100 }, (_, i) => ({
			id: String(i),
			username: `user${i}`,
			displayName: `User ${i}`,
		}));

		expect(getParticipantCount(participants)).toBe(100);
		expect(getParticipantIds(participants)).toHaveLength(100);
	});
});

describe('Messages.NewConversation - Integration', () => {
	const alice: MessageParticipant = { id: '1', username: 'alice', displayName: 'Alice' };
	const bob: MessageParticipant = { id: '2', username: 'bob', displayName: 'Bob' };

	it('handles complete participant selection flow', () => {
		let selected: MessageParticipant[] = [];

		// Add Alice
		selected = addParticipant(alice, selected);
		expect(getParticipantCount(selected)).toBe(1);
		expect(canCreateConversation(selected, false)).toBe(true);

		// Add Bob
		selected = addParticipant(bob, selected);
		expect(getParticipantCount(selected)).toBe(2);

		// Try to add Alice again (should not duplicate)
		selected = addParticipant(alice, selected);
		expect(getParticipantCount(selected)).toBe(2);

		// Remove Alice
		selected = removeParticipant('1', selected);
		expect(getParticipantCount(selected)).toBe(1);
		expect(findParticipantById(selected, '1')).toBeUndefined();
	});

	it('handles search and selection flow', () => {
		const allParticipants: MessageParticipant[] = [
			{ id: '1', username: 'alice', displayName: 'Alice Smith' },
			{ id: '2', username: 'bob', displayName: 'Bob Jones' },
			{ id: '3', username: 'charlie', displayName: 'Charlie Brown' },
		];

		const query = 'alice';
		expect(isValidSearchQuery(query)).toBe(true);

		const results = filterParticipantsByQuery(allParticipants, query);
		expect(shouldShowResults(results)).toBe(true);

		const selected: MessageParticipant[] = [];
		const alice = results[0];
		expect(canSelectParticipant(alice, selected)).toBe(true);
	});

	it('handles UI state transitions', () => {
		const alice: MessageParticipant = { id: '1', username: 'alice', displayName: 'Alice' };
		let selected: MessageParticipant[] = [];
		let creating = false;

		// Initial state
		expect(canCreateConversation(selected, creating)).toBe(false);
		expect(isStartButtonDisabled(selected, creating)).toBe(true);
		expect(getStartButtonText(creating)).toBe('Start Conversation');

		// Add participant
		selected = addParticipant(alice, selected);
		expect(canCreateConversation(selected, creating)).toBe(true);
		expect(isStartButtonDisabled(selected, creating)).toBe(false);

		// Start creating
		creating = true;
		expect(canCreateConversation(selected, creating)).toBe(false);
		expect(isStartButtonDisabled(selected, creating)).toBe(true);
		expect(isInputDisabled(creating)).toBe(true);
		expect(getStartButtonText(creating)).toBe('Creating...');
	});

	it('handles empty search results', () => {
		const query = 'nonexistent';
		const searching = false;
		const results: MessageParticipant[] = [];

		expect(isValidSearchQuery(query)).toBe(true);
		expect(shouldShowEmptyState(query, searching, results)).toBe(true);
		expect(shouldShowResults(results)).toBe(false);
	});
});

