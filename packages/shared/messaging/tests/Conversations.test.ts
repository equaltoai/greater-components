/**
 * Messages.Conversations Component Tests
 *
 * Tests for conversations list logic including:
 * - Conversation selection
 * - Unread message detection
 * - Avatar handling
 * - Preview text truncation
 * - UI state determination
 */

import { describe, it, expect } from 'vitest';
import type { MessageParticipant, DirectMessage, Conversation } from '../src/context.svelte';

// Check if conversation is selected
function isConversationSelected(
	conversation: Conversation,
	selectedConversation: Conversation | null
): boolean {
	return selectedConversation?.id === conversation.id;
}

// Check if conversation has unread messages
function hasUnreadMessages(conversation: Conversation): boolean {
	return conversation.unreadCount > 0;
}

// Get avatar initial
function getAvatarInitial(participant: MessageParticipant | undefined): string {
	if (!participant || !participant.displayName) return '?';
	return participant.displayName[0]?.toUpperCase() || '?';
}

// Check if participant has avatar
function hasAvatar(participant: MessageParticipant | undefined): boolean {
	return !!participant?.avatar;
}

// Check if conversation has last message
function hasLastMessage(conversation: Conversation): boolean {
	return !!conversation.lastMessage;
}

// Get first participant
function getFirstParticipant(conversation: Conversation): MessageParticipant | undefined {
	return conversation.participants[0];
}

// Truncate preview text
function truncatePreview(text: string, maxLength: number = 50): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
}

// Format unread badge text
function getUnreadBadgeText(count: number): string {
	if (count > 99) return '99+';
	return count.toString();
}

// UI state determination
function shouldShowLoading(loadingConversations: boolean): boolean {
	return loadingConversations;
}

function shouldShowEmpty(loadingConversations: boolean, conversationsCount: number): boolean {
	return !loadingConversations && conversationsCount === 0;
}

function shouldShowList(loadingConversations: boolean, conversationsCount: number): boolean {
	return !loadingConversations && conversationsCount > 0;
}

// Get conversation class modifiers
function getConversationClasses(
	conversation: Conversation,
	selectedConversation: Conversation | null
): {
	selected: boolean;
	unread: boolean;
} {
	return {
		selected: isConversationSelected(conversation, selectedConversation),
		unread: hasUnreadMessages(conversation),
	};
}

// Filter conversations by unread
function filterUnreadConversations(conversations: Conversation[]): Conversation[] {
	return conversations.filter((c) => hasUnreadMessages(c));
}

// Find conversation by ID
function findConversationById(conversations: Conversation[], id: string): Conversation | undefined {
	return conversations.find((c) => c.id === id);
}

// Get total unread count
function getTotalUnreadCount(conversations: Conversation[]): number {
	return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}

// Check if any conversations
function hasAnyConversations(conversations: Conversation[]): boolean {
	return conversations.length > 0;
}

// Get most recent conversation
function getMostRecentConversation(conversations: Conversation[]): Conversation | undefined {
	if (conversations.length === 0) return undefined;
	return [...conversations].sort((a, b) => {
		const dateA = new Date(a.updatedAt).getTime();
		const dateB = new Date(b.updatedAt).getTime();
		return dateB - dateA;
	})[0];
}

describe('Messages.Conversations - Selection', () => {
	const conversation: Conversation = {
		id: 'conv1',
		participants: [],
		unreadCount: 0,
		updatedAt: '2024-01-01T00:00:00Z',
	};

	it('detects selected conversation', () => {
		expect(isConversationSelected(conversation, conversation)).toBe(true);
	});

	it('detects non-selected conversation', () => {
		const other: Conversation = { ...conversation, id: 'conv2' };
		expect(isConversationSelected(conversation, other)).toBe(false);
	});

	it('handles null selected conversation', () => {
		expect(isConversationSelected(conversation, null)).toBe(false);
	});

	it('compares by ID', () => {
		const same = { ...conversation, participants: [] };
		expect(isConversationSelected(conversation, same)).toBe(true);
	});
});

describe('Messages.Conversations - Unread Messages', () => {
	it('detects conversation with unread', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 5,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(hasUnreadMessages(conversation)).toBe(true);
	});

	it('detects conversation without unread', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(hasUnreadMessages(conversation)).toBe(false);
	});

	it('treats negative unread as false', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: -1,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(hasUnreadMessages(conversation)).toBe(false);
	});
});

describe('Messages.Conversations - Avatar', () => {
	it('gets avatar initial', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
		};
		expect(getAvatarInitial(participant)).toBe('A');
	});

	it('uppercases initial', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'bob',
			displayName: 'bob',
		};
		expect(getAvatarInitial(participant)).toBe('B');
	});

	it('handles undefined participant', () => {
		expect(getAvatarInitial(undefined)).toBe('?');
	});

	it('handles empty display name', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '',
		};
		expect(getAvatarInitial(participant)).toBe('?');
	});

	it('handles unicode characters', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '世界',
		};
		expect(getAvatarInitial(participant)).toBe('世');
	});

	it('detects avatar URL', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			avatar: 'https://example.com/avatar.jpg',
		};
		expect(hasAvatar(participant)).toBe(true);
	});

	it('detects missing avatar', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
		};
		expect(hasAvatar(participant)).toBe(false);
	});

	it('detects empty avatar string', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'alice',
			displayName: 'Alice',
			avatar: '',
		};
		expect(hasAvatar(participant)).toBe(false);
	});

	it('handles undefined participant for avatar', () => {
		expect(hasAvatar(undefined)).toBe(false);
	});
});

describe('Messages.Conversations - Last Message', () => {
	it('detects conversation with last message', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
			lastMessage: {
				id: 'msg1',
				conversationId: '1',
				sender: { id: '1', username: 'alice', displayName: 'Alice' },
				content: 'Hello',
				createdAt: '2024-01-01T00:00:00Z',
				read: true,
			},
		};
		expect(hasLastMessage(conversation)).toBe(true);
	});

	it('detects conversation without last message', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(hasLastMessage(conversation)).toBe(false);
	});
});

describe('Messages.Conversations - First Participant', () => {
	it('gets first participant', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: '1', username: 'alice', displayName: 'Alice' },
				{ id: '2', username: 'bob', displayName: 'Bob' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		const first = getFirstParticipant(conversation);
		expect(first?.id).toBe('1');
	});

	it('returns undefined for empty participants', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getFirstParticipant(conversation)).toBeUndefined();
	});
});

describe('Messages.Conversations - Preview Text', () => {
	it('does not truncate short text', () => {
		const text = 'Hello world';
		expect(truncatePreview(text, 50)).toBe('Hello world');
	});

	it('truncates long text', () => {
		const text = 'This is a very long message that should be truncated';
		expect(truncatePreview(text, 20)).toBe('This is a very long ...');
	});

	it('handles exact length', () => {
		const text = '12345678901234567890';
		expect(truncatePreview(text, 20)).toBe('12345678901234567890');
	});

	it('handles empty string', () => {
		expect(truncatePreview('', 50)).toBe('');
	});

	it('handles single character', () => {
		expect(truncatePreview('A', 50)).toBe('A');
	});

	it('handles unicode characters', () => {
		const text = '世界世界世界世界世界世界世界世界世界世界世界';
		const truncated = truncatePreview(text, 10);
		expect(truncated).toContain('...');
		expect(truncated.length).toBeLessThanOrEqual(13); // 10 + '...'
	});

	it('uses default max length', () => {
		const text = 'A'.repeat(100);
		const truncated = truncatePreview(text);
		expect(truncated).toHaveLength(53); // 50 + '...'
	});
});

describe('Messages.Conversations - Unread Badge', () => {
	it('formats single digit', () => {
		expect(getUnreadBadgeText(5)).toBe('5');
	});

	it('formats double digits', () => {
		expect(getUnreadBadgeText(42)).toBe('42');
	});

	it('formats 99', () => {
		expect(getUnreadBadgeText(99)).toBe('99');
	});

	it('formats over 99 as 99+', () => {
		expect(getUnreadBadgeText(100)).toBe('99+');
	});

	it('formats large numbers as 99+', () => {
		expect(getUnreadBadgeText(9999)).toBe('99+');
	});

	it('formats zero', () => {
		expect(getUnreadBadgeText(0)).toBe('0');
	});
});

describe('Messages.Conversations - UI State', () => {
	it('shows loading when loading', () => {
		expect(shouldShowLoading(true)).toBe(true);
		expect(shouldShowEmpty(true, 0)).toBe(false);
		expect(shouldShowList(true, 0)).toBe(false);
	});

	it('shows empty when not loading and no conversations', () => {
		expect(shouldShowLoading(false)).toBe(false);
		expect(shouldShowEmpty(false, 0)).toBe(true);
		expect(shouldShowList(false, 0)).toBe(false);
	});

	it('shows list when not loading and has conversations', () => {
		expect(shouldShowLoading(false)).toBe(false);
		expect(shouldShowEmpty(false, 5)).toBe(false);
		expect(shouldShowList(false, 5)).toBe(true);
	});

	it('prioritizes loading over empty', () => {
		expect(shouldShowEmpty(true, 0)).toBe(false);
	});

	it('prioritizes loading over list', () => {
		expect(shouldShowList(true, 5)).toBe(false);
	});
});

describe('Messages.Conversations - Conversation Classes', () => {
	const conversation: Conversation = {
		id: 'conv1',
		participants: [],
		unreadCount: 5,
		updatedAt: '2024-01-01T00:00:00Z',
	};

	it('sets selected and unread classes', () => {
		const classes = getConversationClasses(conversation, conversation);
		expect(classes.selected).toBe(true);
		expect(classes.unread).toBe(true);
	});

	it('sets only unread when not selected', () => {
		const classes = getConversationClasses(conversation, null);
		expect(classes.selected).toBe(false);
		expect(classes.unread).toBe(true);
	});

	it('sets only selected when no unread', () => {
		const readConv = { ...conversation, unreadCount: 0 };
		const classes = getConversationClasses(readConv, readConv);
		expect(classes.selected).toBe(true);
		expect(classes.unread).toBe(false);
	});

	it('sets neither when not selected and no unread', () => {
		const readConv = { ...conversation, unreadCount: 0 };
		const classes = getConversationClasses(readConv, null);
		expect(classes.selected).toBe(false);
		expect(classes.unread).toBe(false);
	});
});

describe('Messages.Conversations - Filtering', () => {
	const conversations: Conversation[] = [
		{
			id: '1',
			participants: [],
			unreadCount: 5,
			updatedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '3',
			participants: [],
			unreadCount: 3,
			updatedAt: '2024-01-01T00:00:00Z',
		},
	];

	it('filters unread conversations', () => {
		const unread = filterUnreadConversations(conversations);
		expect(unread).toHaveLength(2);
		expect(unread.map((c) => c.id)).toEqual(['1', '3']);
	});

	it('returns empty array when all read', () => {
		const allRead = conversations.map((c) => ({ ...c, unreadCount: 0 }));
		expect(filterUnreadConversations(allRead)).toHaveLength(0);
	});

	it('finds conversation by ID', () => {
		const found = findConversationById(conversations, '2');
		expect(found?.id).toBe('2');
	});

	it('returns undefined for non-existent ID', () => {
		expect(findConversationById(conversations, '999')).toBeUndefined();
	});

	it('gets total unread count', () => {
		expect(getTotalUnreadCount(conversations)).toBe(8);
	});

	it('returns 0 for empty conversations', () => {
		expect(getTotalUnreadCount([])).toBe(0);
	});

	it('checks if has any conversations', () => {
		expect(hasAnyConversations(conversations)).toBe(true);
		expect(hasAnyConversations([])).toBe(false);
	});
});

describe('Messages.Conversations - Most Recent', () => {
	const conversations: Conversation[] = [
		{
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		},
		{
			id: '2',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-03T00:00:00Z',
		},
		{
			id: '3',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-02T00:00:00Z',
		},
	];

	it('gets most recent conversation', () => {
		const recent = getMostRecentConversation(conversations);
		expect(recent?.id).toBe('2');
	});

	it('returns undefined for empty list', () => {
		expect(getMostRecentConversation([])).toBeUndefined();
	});

	it('handles single conversation', () => {
		const recent = getMostRecentConversation([conversations[0]]);
		expect(recent?.id).toBe('1');
	});
});

describe('Messages.Conversations - Edge Cases', () => {
	it('handles conversation with no participants', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};

		const first = getFirstParticipant(conversation);
		expect(first).toBeUndefined();
		expect(getAvatarInitial(first)).toBe('?');
	});

	it('handles very large unread count', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 999999,
			updatedAt: '2024-01-01T00:00:00Z',
		};

		expect(hasUnreadMessages(conversation)).toBe(true);
		expect(getUnreadBadgeText(conversation.unreadCount)).toBe('99+');
	});

	it('handles empty preview text', () => {
		expect(truncatePreview('')).toBe('');
	});

	it('handles whitespace-only preview', () => {
		const preview = '     ';
		expect(truncatePreview(preview, 10)).toBe('     ');
	});

	it('handles special characters in display name', () => {
		const participant: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '@Alice#123',
		};
		expect(getAvatarInitial(participant)).toBe('@');
	});
});

describe('Messages.Conversations - Integration', () => {
	it('processes complete conversation display', () => {
		const conversation: Conversation = {
			id: 'conv1',
			participants: [{ id: 'user1', username: 'alice', displayName: 'Alice Johnson' }],
			unreadCount: 5,
			updatedAt: '2024-01-01T00:00:00Z',
			lastMessage: {
				id: 'msg1',
				conversationId: 'conv1',
				sender: { id: 'user1', username: 'alice', displayName: 'Alice Johnson' },
				content: 'Hey! How are you doing? I wanted to chat about the project',
				createdAt: '2024-01-01T00:00:00Z',
				read: false,
			},
		};

		const firstParticipant = getFirstParticipant(conversation);
		expect(getAvatarInitial(firstParticipant)).toBe('A');
		expect(hasLastMessage(conversation)).toBe(true);
		expect(hasUnreadMessages(conversation)).toBe(true);
		expect(getUnreadBadgeText(conversation.unreadCount)).toBe('5');
		const lastMessage = conversation.lastMessage;
		expect(lastMessage).toBeDefined();
		if (!lastMessage) {
			throw new Error('Expected last message to exist for preview truncation');
		}
		expect(truncatePreview(lastMessage.content, 30)).toContain('...');
	});

	it('handles conversation list operations', () => {
		const conversations: Conversation[] = [
			{
				id: '1',
				participants: [{ id: 'u1', username: 'alice', displayName: 'Alice' }],
				unreadCount: 5,
				updatedAt: '2024-01-03T00:00:00Z',
			},
			{
				id: '2',
				participants: [{ id: 'u2', username: 'bob', displayName: 'Bob' }],
				unreadCount: 0,
				updatedAt: '2024-01-02T00:00:00Z',
			},
			{
				id: '3',
				participants: [{ id: 'u3', username: 'charlie', displayName: 'Charlie' }],
				unreadCount: 2,
				updatedAt: '2024-01-01T00:00:00Z',
			},
		];

		expect(hasAnyConversations(conversations)).toBe(true);
		expect(getTotalUnreadCount(conversations)).toBe(7);
		expect(filterUnreadConversations(conversations)).toHaveLength(2);
		expect(getMostRecentConversation(conversations)?.id).toBe('1');
		expect(shouldShowList(false, conversations.length)).toBe(true);
	});
});
