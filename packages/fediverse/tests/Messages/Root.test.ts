/**
 * Messages.Root Component Tests
 * 
 * Tests for messages context helper functions including:
 * - Message time formatting
 * - Conversation name generation
 * - Participant filtering
 * - Time difference calculations
 */

import { describe, it, expect } from 'vitest';

// Message and conversation interfaces
interface MessageParticipant {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
}

interface DirectMessage {
	id: string;
	conversationId: string;
	sender: MessageParticipant;
	content: string;
	createdAt: string;
	read: boolean;
	mediaAttachments?: {
		url: string;
		type: string;
		previewUrl?: string;
	}[];
}

interface Conversation {
	id: string;
	participants: MessageParticipant[];
	lastMessage?: DirectMessage;
	unreadCount: number;
	updatedAt: string;
}

// Format message timestamp
function formatMessageTime(timestamp: string): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 7) {
		return date.toLocaleDateString();
	}
	if (days > 0) {
		return `${days}d ago`;
	}
	if (hours > 0) {
		return `${hours}h ago`;
	}
	if (minutes > 0) {
		return `${minutes}m ago`;
	}
	return 'Just now';
}

// Get conversation display name
function getConversationName(conversation: Conversation, currentUserId: string): string {
	const otherParticipants = conversation.participants.filter((p) => p.id !== currentUserId);
	if (otherParticipants.length === 0) return 'Me';
	if (otherParticipants.length === 1 && otherParticipants[0]) return otherParticipants[0].displayName;
	return otherParticipants.map((p) => p.displayName).join(', ');
}

// Get other participants (excluding current user)
function getOtherParticipants(
	participants: MessageParticipant[],
	currentUserId: string
): MessageParticipant[] {
	return participants.filter((p) => p.id !== currentUserId);
}

// Count unread conversations
function countUnreadConversations(conversations: Conversation[]): number {
	return conversations.filter((c) => c.unreadCount > 0).length;
}

// Get total unread messages
function getTotalUnreadCount(conversations: Conversation[]): number {
	return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}

// Check if conversation has unread messages
function hasUnreadMessages(conversation: Conversation): boolean {
	return conversation.unreadCount > 0;
}

// Sort conversations by updated time (newest first)
function sortConversationsByDate(conversations: Conversation[]): Conversation[] {
	return [...conversations].sort((a, b) => {
		const dateA = new Date(a.updatedAt).getTime();
		const dateB = new Date(b.updatedAt).getTime();
		return dateB - dateA;
	});
}

// Check if message has media attachments
function hasMediaAttachments(message: DirectMessage): boolean {
	return message.mediaAttachments !== undefined && message.mediaAttachments.length > 0;
}

// Get media count
function getMediaCount(message: DirectMessage): number {
	return message.mediaAttachments?.length || 0;
}

// Check if message is read
function isMessageRead(message: DirectMessage): boolean {
	return message.read;
}

// Filter unread messages
function filterUnreadMessages(messages: DirectMessage[]): DirectMessage[] {
	return messages.filter((m) => !m.read);
}

// Get conversation participants display
function formatParticipantsDisplay(participants: MessageParticipant[]): string {
	if (participants.length === 0) return '';
	if (participants.length === 1) return participants[0].displayName;
	if (participants.length === 2) return participants.map((p) => p.displayName).join(' and ');
	return participants.map((p) => p.displayName).join(', ');
}

describe('Messages.Root - Time Formatting', () => {
	it('formats just now for very recent messages', () => {
		const now = new Date();
		const recent = new Date(now.getTime() - 30000); // 30 seconds ago
		expect(formatMessageTime(recent.toISOString())).toBe('Just now');
	});

	it('formats minutes ago', () => {
		const now = new Date();
		const fiveMin = new Date(now.getTime() - 5 * 60 * 1000);
		expect(formatMessageTime(fiveMin.toISOString())).toBe('5m ago');
	});

	it('formats hours ago', () => {
		const now = new Date();
		const threeHours = new Date(now.getTime() - 3 * 60 * 60 * 1000);
		expect(formatMessageTime(threeHours.toISOString())).toBe('3h ago');
	});

	it('formats days ago', () => {
		const now = new Date();
		const twoDays = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
		expect(formatMessageTime(twoDays.toISOString())).toBe('2d ago');
	});

	it('formats date for messages over 7 days', () => {
		const now = new Date();
		const tenDays = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
		const formatted = formatMessageTime(tenDays.toISOString());
		// Should be a date string
		expect(formatted).not.toContain('ago');
	});

	it('formats exactly 7 days as 7d ago', () => {
		const now = new Date();
		const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		expect(formatMessageTime(sevenDays.toISOString())).toBe('7d ago');
	});

	it('prefers larger time units', () => {
		const now = new Date();
		const oneHourThirty = new Date(now.getTime() - 90 * 60 * 1000);
		expect(formatMessageTime(oneHourThirty.toISOString())).toBe('1h ago');
	});
});

describe('Messages.Root - Conversation Name', () => {
	it('returns other participant name for 1-on-1 conversation', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: 'user1', username: 'alice', displayName: 'Alice' },
				{ id: 'user2', username: 'bob', displayName: 'Bob' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getConversationName(conversation, 'user1')).toBe('Bob');
	});

	it('returns comma-separated names for group conversation', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: 'user1', username: 'alice', displayName: 'Alice' },
				{ id: 'user2', username: 'bob', displayName: 'Bob' },
				{ id: 'user3', username: 'charlie', displayName: 'Charlie' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getConversationName(conversation, 'user1')).toBe('Bob, Charlie');
	});

	it('returns Me for conversation with only current user', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: 'user1', username: 'alice', displayName: 'Alice' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getConversationName(conversation, 'user1')).toBe('Me');
	});

	it('handles empty participants', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getConversationName(conversation, 'user1')).toBe('Me');
	});

	it('filters current user from participants', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: 'user1', username: 'alice', displayName: 'Alice' },
				{ id: 'user2', username: 'bob', displayName: 'Bob' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		const name = getConversationName(conversation, 'user1');
		expect(name).not.toContain('Alice');
		expect(name).toContain('Bob');
	});
});

describe('Messages.Root - Participant Filtering', () => {
	const participants: MessageParticipant[] = [
		{ id: 'user1', username: 'alice', displayName: 'Alice' },
		{ id: 'user2', username: 'bob', displayName: 'Bob' },
		{ id: 'user3', username: 'charlie', displayName: 'Charlie' },
	];

	it('filters out current user', () => {
		const others = getOtherParticipants(participants, 'user1');
		expect(others).toHaveLength(2);
		expect(others.find(p => p.id === 'user1')).toBeUndefined();
	});

	it('returns all participants when current user not in list', () => {
		const others = getOtherParticipants(participants, 'user4');
		expect(others).toHaveLength(3);
	});

	it('returns empty array when only current user', () => {
		const others = getOtherParticipants([participants[0]], 'user1');
		expect(others).toHaveLength(0);
	});

	it('preserves order of filtered participants', () => {
		const others = getOtherParticipants(participants, 'user1');
		expect(others[0].id).toBe('user2');
		expect(others[1].id).toBe('user3');
	});
});

describe('Messages.Root - Unread Conversations', () => {
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

	it('counts conversations with unread messages', () => {
		expect(countUnreadConversations(conversations)).toBe(2);
	});

	it('returns 0 for all read conversations', () => {
		const allRead = conversations.map(c => ({ ...c, unreadCount: 0 }));
		expect(countUnreadConversations(allRead)).toBe(0);
	});

	it('gets total unread count', () => {
		expect(getTotalUnreadCount(conversations)).toBe(8);
	});

	it('returns 0 total for all read', () => {
		const allRead = conversations.map(c => ({ ...c, unreadCount: 0 }));
		expect(getTotalUnreadCount(allRead)).toBe(0);
	});

	it('detects conversation with unread messages', () => {
		expect(hasUnreadMessages(conversations[0])).toBe(true);
	});

	it('detects conversation with no unread messages', () => {
		expect(hasUnreadMessages(conversations[1])).toBe(false);
	});
});

describe('Messages.Root - Conversation Sorting', () => {
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

	it('sorts by date newest first', () => {
		const sorted = sortConversationsByDate(conversations);
		expect(sorted[0].id).toBe('2'); // Jan 3
		expect(sorted[1].id).toBe('3'); // Jan 2
		expect(sorted[2].id).toBe('1'); // Jan 1
	});

	it('does not mutate original array', () => {
		const original = [...conversations];
		sortConversationsByDate(conversations);
		expect(conversations).toEqual(original);
	});

	it('handles empty array', () => {
		expect(sortConversationsByDate([])).toHaveLength(0);
	});
});

describe('Messages.Root - Media Attachments', () => {
	it('detects message with media', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Check this out',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
			mediaAttachments: [
				{ url: 'https://example.com/image.jpg', type: 'image' },
			],
		};
		expect(hasMediaAttachments(message)).toBe(true);
	});

	it('detects message without media', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(hasMediaAttachments(message)).toBe(false);
	});

	it('detects empty media array', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
			mediaAttachments: [],
		};
		expect(hasMediaAttachments(message)).toBe(false);
	});

	it('counts media attachments', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Check these out',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
			mediaAttachments: [
				{ url: 'https://example.com/1.jpg', type: 'image' },
				{ url: 'https://example.com/2.jpg', type: 'image' },
			],
		};
		expect(getMediaCount(message)).toBe(2);
	});

	it('returns 0 for no attachments', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(getMediaCount(message)).toBe(0);
	});
});

describe('Messages.Root - Message Read Status', () => {
	it('detects read message', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isMessageRead(message)).toBe(true);
	});

	it('detects unread message', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: false,
		};
		expect(isMessageRead(message)).toBe(false);
	});

	it('filters unread messages', () => {
		const messages: DirectMessage[] = [
			{
				id: '1',
				conversationId: 'conv1',
				sender: { id: '1', username: 'alice', displayName: 'Alice' },
				content: 'Message 1',
				createdAt: '2024-01-01T00:00:00Z',
				read: true,
			},
			{
				id: '2',
				conversationId: 'conv1',
				sender: { id: '1', username: 'alice', displayName: 'Alice' },
				content: 'Message 2',
				createdAt: '2024-01-01T00:00:00Z',
				read: false,
			},
		];

		const unread = filterUnreadMessages(messages);
		expect(unread).toHaveLength(1);
		expect(unread[0].id).toBe('2');
	});
});

describe('Messages.Root - Participants Display', () => {
	const participants: MessageParticipant[] = [
		{ id: '1', username: 'alice', displayName: 'Alice' },
		{ id: '2', username: 'bob', displayName: 'Bob' },
		{ id: '3', username: 'charlie', displayName: 'Charlie' },
	];

	it('formats single participant', () => {
		expect(formatParticipantsDisplay([participants[0]])).toBe('Alice');
	});

	it('formats two participants with "and"', () => {
		expect(formatParticipantsDisplay(participants.slice(0, 2))).toBe('Alice and Bob');
	});

	it('formats three or more with commas', () => {
		expect(formatParticipantsDisplay(participants)).toBe('Alice, Bob, Charlie');
	});

	it('returns empty string for no participants', () => {
		expect(formatParticipantsDisplay([])).toBe('');
	});
});

describe('Messages.Root - Edge Cases', () => {
	it('handles unicode in display names', () => {
		const conversation: Conversation = {
			id: '1',
			participants: [
				{ id: 'user1', username: 'me', displayName: 'Me' },
				{ id: 'user2', username: 'user', displayName: '世界 🌍' },
			],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};
		expect(getConversationName(conversation, 'user1')).toBe('世界 🌍');
	});

	it('handles very large unread counts', () => {
		const conversations: Conversation[] = [
			{
				id: '1',
				participants: [],
				unreadCount: 999999,
				updatedAt: '2024-01-01T00:00:00Z',
			},
		];
		expect(getTotalUnreadCount(conversations)).toBe(999999);
	});

	it('handles messages with many media attachments', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: '1', username: 'alice', displayName: 'Alice' },
			content: 'Photos',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
			mediaAttachments: Array(10).fill({ url: 'https://example.com/img.jpg', type: 'image' }),
		};
		expect(getMediaCount(message)).toBe(10);
	});

	it('handles invalid date strings gracefully', () => {
		const formatted = formatMessageTime('invalid-date');
		expect(typeof formatted).toBe('string');
	});
});

describe('Messages.Root - Integration', () => {
	it('processes complete conversation', () => {
		const conversation: Conversation = {
			id: 'conv1',
			participants: [
				{ id: 'user1', username: 'me', displayName: 'Me' },
				{ id: 'user2', username: 'alice', displayName: 'Alice Johnson' },
			],
			unreadCount: 3,
			updatedAt: '2024-01-01T00:00:00Z',
			lastMessage: {
				id: 'msg1',
				conversationId: 'conv1',
				sender: { id: 'user2', username: 'alice', displayName: 'Alice Johnson' },
				content: 'Hello!',
				createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
				read: false,
			},
		};

		expect(getConversationName(conversation, 'user1')).toBe('Alice Johnson');
		expect(hasUnreadMessages(conversation)).toBe(true);
		expect(formatMessageTime(conversation.lastMessage!.createdAt)).toBe('5m ago');
		expect(isMessageRead(conversation.lastMessage!)).toBe(false);
	});

	it('sorts and filters conversations', () => {
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
				updatedAt: '2024-01-03T00:00:00Z',
			},
			{
				id: '3',
				participants: [],
				unreadCount: 2,
				updatedAt: '2024-01-02T00:00:00Z',
			},
		];

		const sorted = sortConversationsByDate(conversations);
		expect(sorted[0].id).toBe('2');

		expect(countUnreadConversations(conversations)).toBe(2);
		expect(getTotalUnreadCount(conversations)).toBe(7);
	});
});

