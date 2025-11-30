/**
 * Messages.Thread Component Tests
 *
 * Tests for message thread display logic including:
 * - UI state determination
 * - Message grouping
 * - Empty state detection
 * - Loading state management
 */

import { describe, it, expect } from 'vitest';

// Interfaces
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
}

interface Conversation {
	id: string;
	participants: MessageParticipant[];
	lastMessage?: DirectMessage;
	unreadCount: number;
	updatedAt: string;
}

// UI state determination
function shouldShowNoSelection(selectedConversation: Conversation | null): boolean {
	return selectedConversation === null;
}

function shouldShowLoading(
	selectedConversation: Conversation | null,
	loadingMessages: boolean
): boolean {
	return !!selectedConversation && loadingMessages;
}

function shouldShowEmpty(
	selectedConversation: Conversation | null,
	loadingMessages: boolean,
	messagesCount: number
): boolean {
	return !!selectedConversation && !loadingMessages && messagesCount === 0;
}

function shouldShowList(
	selectedConversation: Conversation | null,
	loadingMessages: boolean,
	messagesCount: number
): boolean {
	return !!selectedConversation && !loadingMessages && messagesCount > 0;
}

// Check if conversation has messages
function hasMessages(messages: DirectMessage[]): boolean {
	return messages.length > 0;
}

// Get message count
function getMessageCount(messages: DirectMessage[]): number {
	return messages.length;
}

// Group messages by date
function groupMessagesByDate(messages: DirectMessage[]): Map<string, DirectMessage[]> {
	const groups = new Map<string, DirectMessage[]>();

	for (const message of messages) {
		const date = new Date(message.createdAt);
		const dateKey = date.toLocaleDateString();

		const existingGroup = groups.get(dateKey);
		if (existingGroup) {
			existingGroup.push(message);
		} else {
			groups.set(dateKey, [message]);
		}
	}

	return groups;
}

// Check if messages are from same sender
function isSameSender(msg1: DirectMessage, msg2: DirectMessage): boolean {
	return msg1.sender.id === msg2.sender.id;
}

// Check if messages are consecutive (within 5 minutes)
function areConsecutive(msg1: DirectMessage, msg2: DirectMessage): boolean {
	const time1 = new Date(msg1.createdAt).getTime();
	const time2 = new Date(msg2.createdAt).getTime();
	const diffMinutes = Math.abs(time2 - time1) / (1000 * 60);
	return diffMinutes <= 5;
}

// Check if messages should be grouped together
function shouldGroupMessages(prev: DirectMessage, current: DirectMessage): boolean {
	return isSameSender(prev, current) && areConsecutive(prev, current);
}

// Get unread messages in thread
function getUnreadMessages(messages: DirectMessage[]): DirectMessage[] {
	return messages.filter((m) => !m.read);
}

// Get read messages in thread
function getReadMessages(messages: DirectMessage[]): DirectMessage[] {
	return messages.filter((m) => m.read);
}

// Find first unread message index
function findFirstUnreadIndex(messages: DirectMessage[]): number {
	return messages.findIndex((m) => !m.read);
}

// Check if has unread messages
function hasUnreadMessages(messages: DirectMessage[]): boolean {
	return messages.some((m) => !m.read);
}

// Get messages from specific sender
function getMessagesFromSender(messages: DirectMessage[], senderId: string): DirectMessage[] {
	return messages.filter((m) => m.sender.id === senderId);
}

// Get last message in thread
function getLastMessage(messages: DirectMessage[]): DirectMessage | undefined {
	if (messages.length === 0) return undefined;
	return messages[messages.length - 1];
}

// Get first message in thread
function getFirstMessage(messages: DirectMessage[]): DirectMessage | undefined {
	return messages[0];
}

// Check if thread is empty
function isThreadEmpty(messages: DirectMessage[]): boolean {
	return messages.length === 0;
}

// Sort messages by date ascending
function sortMessagesByDate(messages: DirectMessage[]): DirectMessage[] {
	return [...messages].sort((a, b) => {
		const dateA = new Date(a.createdAt).getTime();
		const dateB = new Date(b.createdAt).getTime();
		return dateA - dateB;
	});
}

describe('Messages.Thread - UI State', () => {
	const conversation: Conversation = {
		id: 'conv1',
		participants: [],
		unreadCount: 0,
		updatedAt: '2024-01-01T00:00:00Z',
	};

	it('shows no selection when no conversation selected', () => {
		expect(shouldShowNoSelection(null)).toBe(true);
		expect(shouldShowLoading(null, false)).toBe(false);
		expect(shouldShowEmpty(null, false, 0)).toBe(false);
		expect(shouldShowList(null, false, 0)).toBe(false);
	});

	it('shows loading when conversation selected and loading', () => {
		expect(shouldShowNoSelection(conversation)).toBe(false);
		expect(shouldShowLoading(conversation, true)).toBe(true);
		expect(shouldShowEmpty(conversation, true, 0)).toBe(false);
		expect(shouldShowList(conversation, true, 0)).toBe(false);
	});

	it('shows empty when conversation selected, not loading, no messages', () => {
		expect(shouldShowNoSelection(conversation)).toBe(false);
		expect(shouldShowLoading(conversation, false)).toBe(false);
		expect(shouldShowEmpty(conversation, false, 0)).toBe(true);
		expect(shouldShowList(conversation, false, 0)).toBe(false);
	});

	it('shows list when conversation selected, not loading, has messages', () => {
		expect(shouldShowNoSelection(conversation)).toBe(false);
		expect(shouldShowLoading(conversation, false)).toBe(false);
		expect(shouldShowEmpty(conversation, false, 5)).toBe(false);
		expect(shouldShowList(conversation, false, 5)).toBe(true);
	});
});

describe('Messages.Thread - Message Count', () => {
	const messages: DirectMessage[] = [
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user2', username: 'bob', displayName: 'Bob' },
			content: 'Hi',
			createdAt: '2024-01-01T00:01:00Z',
			read: false,
		},
	];

	it('counts messages', () => {
		expect(getMessageCount(messages)).toBe(2);
	});

	it('returns 0 for empty array', () => {
		expect(getMessageCount([])).toBe(0);
	});

	it('checks if has messages', () => {
		expect(hasMessages(messages)).toBe(true);
		expect(hasMessages([])).toBe(false);
	});

	it('checks if thread is empty', () => {
		expect(isThreadEmpty(messages)).toBe(false);
		expect(isThreadEmpty([])).toBe(true);
	});
});

describe('Messages.Thread - Message Grouping', () => {
	const alice: MessageParticipant = { id: 'user1', username: 'alice', displayName: 'Alice' };
	const bob: MessageParticipant = { id: 'user2', username: 'bob', displayName: 'Bob' };

	const msg1: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: alice,
		content: 'Hello',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
	};

	const msg2: DirectMessage = {
		id: '2',
		conversationId: 'conv1',
		sender: alice,
		content: 'How are you?',
		createdAt: '2024-01-01T00:01:00Z',
		read: true,
	};

	const msg3: DirectMessage = {
		id: '3',
		conversationId: 'conv1',
		sender: bob,
		content: 'Good!',
		createdAt: '2024-01-01T00:02:00Z',
		read: true,
	};

	it('detects same sender', () => {
		expect(isSameSender(msg1, msg2)).toBe(true);
		expect(isSameSender(msg1, msg3)).toBe(false);
	});

	it('detects consecutive messages within 5 minutes', () => {
		expect(areConsecutive(msg1, msg2)).toBe(true);
	});

	it('detects non-consecutive messages', () => {
		const farApart: DirectMessage = {
			...msg2,
			createdAt: '2024-01-01T00:10:00Z',
		};
		expect(areConsecutive(msg1, farApart)).toBe(false);
	});

	it('groups messages from same sender within time window', () => {
		expect(shouldGroupMessages(msg1, msg2)).toBe(true);
	});

	it('does not group messages from different senders', () => {
		expect(shouldGroupMessages(msg1, msg3)).toBe(false);
	});

	it('does not group messages far apart in time', () => {
		const farMsg: DirectMessage = {
			...msg1,
			id: '4',
			createdAt: '2024-01-01T01:00:00Z',
		};
		expect(shouldGroupMessages(msg1, farMsg)).toBe(false);
	});
});

describe('Messages.Thread - Date Grouping', () => {
	const messages: DirectMessage[] = [
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 1',
			createdAt: '2024-01-01T10:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 2',
			createdAt: '2024-01-01T11:00:00Z',
			read: true,
		},
		{
			id: '3',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 3',
			createdAt: '2024-01-02T10:00:00Z',
			read: true,
		},
	];

	it('groups messages by date', () => {
		const groups = groupMessagesByDate(messages);
		expect(groups.size).toBe(2);
	});

	it('handles empty messages', () => {
		const groups = groupMessagesByDate([]);
		expect(groups.size).toBe(0);
	});

	it('groups all messages on same date', () => {
		const sameDay = [messages[0], messages[1]];
		const groups = groupMessagesByDate(sameDay);
		expect(groups.size).toBe(1);
	});
});

describe('Messages.Thread - Unread Messages', () => {
	const messages: DirectMessage[] = [
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 1',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 2',
			createdAt: '2024-01-01T00:01:00Z',
			read: false,
		},
		{
			id: '3',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 3',
			createdAt: '2024-01-01T00:02:00Z',
			read: false,
		},
	];

	it('filters unread messages', () => {
		const unread = getUnreadMessages(messages);
		expect(unread).toHaveLength(2);
		expect(unread.map((m) => m.id)).toEqual(['2', '3']);
	});

	it('filters read messages', () => {
		const read = getReadMessages(messages);
		expect(read).toHaveLength(1);
		expect(read[0].id).toBe('1');
	});

	it('finds first unread index', () => {
		expect(findFirstUnreadIndex(messages)).toBe(1);
	});

	it('returns -1 when all read', () => {
		const allRead = messages.map((m) => ({ ...m, read: true }));
		expect(findFirstUnreadIndex(allRead)).toBe(-1);
	});

	it('checks if has unread messages', () => {
		expect(hasUnreadMessages(messages)).toBe(true);
	});

	it('detects all read', () => {
		const allRead = messages.map((m) => ({ ...m, read: true }));
		expect(hasUnreadMessages(allRead)).toBe(false);
	});
});

describe('Messages.Thread - Filter by Sender', () => {
	const messages: DirectMessage[] = [
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 1',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user2', username: 'bob', displayName: 'Bob' },
			content: 'Message 2',
			createdAt: '2024-01-01T00:01:00Z',
			read: true,
		},
		{
			id: '3',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 3',
			createdAt: '2024-01-01T00:02:00Z',
			read: true,
		},
	];

	it('filters messages from specific sender', () => {
		const aliceMessages = getMessagesFromSender(messages, 'user1');
		expect(aliceMessages).toHaveLength(2);
		expect(aliceMessages.map((m) => m.id)).toEqual(['1', '3']);
	});

	it('returns empty for non-existent sender', () => {
		const noMessages = getMessagesFromSender(messages, 'user999');
		expect(noMessages).toHaveLength(0);
	});

	it('handles empty messages', () => {
		const noMessages = getMessagesFromSender([], 'user1');
		expect(noMessages).toHaveLength(0);
	});
});

describe('Messages.Thread - First and Last', () => {
	const messages: DirectMessage[] = [
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'First',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user2', username: 'bob', displayName: 'Bob' },
			content: 'Middle',
			createdAt: '2024-01-01T00:01:00Z',
			read: true,
		},
		{
			id: '3',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Last',
			createdAt: '2024-01-01T00:02:00Z',
			read: true,
		},
	];

	it('gets last message', () => {
		const last = getLastMessage(messages);
		expect(last?.id).toBe('3');
	});

	it('gets first message', () => {
		const first = getFirstMessage(messages);
		expect(first?.id).toBe('1');
	});

	it('returns undefined for empty array', () => {
		expect(getLastMessage([])).toBeUndefined();
		expect(getFirstMessage([])).toBeUndefined();
	});

	it('handles single message', () => {
		const single = [messages[0]];
		expect(getFirstMessage(single)).toBe(messages[0]);
		expect(getLastMessage(single)).toBe(messages[0]);
	});
});

describe('Messages.Thread - Sorting', () => {
	const messages: DirectMessage[] = [
		{
			id: '3',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Third',
			createdAt: '2024-01-01T00:02:00Z',
			read: true,
		},
		{
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'First',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		},
		{
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Second',
			createdAt: '2024-01-01T00:01:00Z',
			read: true,
		},
	];

	it('sorts messages by date ascending', () => {
		const sorted = sortMessagesByDate(messages);
		expect(sorted.map((m) => m.id)).toEqual(['1', '2', '3']);
	});

	it('does not mutate original array', () => {
		const original = [...messages];
		sortMessagesByDate(messages);
		expect(messages).toEqual(original);
	});

	it('handles empty array', () => {
		expect(sortMessagesByDate([])).toHaveLength(0);
	});

	it('handles already sorted messages', () => {
		const sorted = sortMessagesByDate(messages);
		const reSorted = sortMessagesByDate(sorted);
		expect(reSorted).toEqual(sorted);
	});
});

describe('Messages.Thread - Edge Cases', () => {
	it('handles messages with same timestamp', () => {
		const messages: DirectMessage[] = [
			{
				id: '1',
				conversationId: 'conv1',
				sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
				content: 'Message 1',
				createdAt: '2024-01-01T00:00:00Z',
				read: true,
			},
			{
				id: '2',
				conversationId: 'conv1',
				sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
				content: 'Message 2',
				createdAt: '2024-01-01T00:00:00Z',
				read: true,
			},
		];

		expect(areConsecutive(messages[0], messages[1])).toBe(true);
		expect(shouldGroupMessages(messages[0], messages[1])).toBe(true);
	});

	it('handles messages exactly 5 minutes apart', () => {
		const msg1: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 1',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};

		const msg2: DirectMessage = {
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 2',
			createdAt: '2024-01-01T00:05:00Z',
			read: true,
		};

		expect(areConsecutive(msg1, msg2)).toBe(true);
	});

	it('handles messages over 5 minutes apart', () => {
		const msg1: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 1',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};

		const msg2: DirectMessage = {
			id: '2',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Message 2',
			createdAt: '2024-01-01T00:05:01Z',
			read: true,
		};

		expect(areConsecutive(msg1, msg2)).toBe(false);
	});

	it('handles very large thread', () => {
		const largeThread = Array.from({ length: 1000 }, (_, i) => ({
			id: String(i),
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: `Message ${i}`,
			createdAt: '2024-01-01T00:00:00Z',
			read: i % 2 === 0,
		}));

		expect(getMessageCount(largeThread)).toBe(1000);
		expect(hasMessages(largeThread)).toBe(true);
		expect(getUnreadMessages(largeThread)).toHaveLength(500);
	});
});

describe('Messages.Thread - Integration', () => {
	it('processes complete thread state', () => {
		const conversation: Conversation = {
			id: 'conv1',
			participants: [
				{ id: 'user1', username: 'alice', displayName: 'Alice' },
				{ id: 'user2', username: 'bob', displayName: 'Bob' },
			],
			unreadCount: 2,
			updatedAt: '2024-01-01T00:00:00Z',
		};

		const messages: DirectMessage[] = [
			{
				id: '1',
				conversationId: 'conv1',
				sender: conversation.participants[0],
				content: 'Hello!',
				createdAt: '2024-01-01T00:00:00Z',
				read: true,
			},
			{
				id: '2',
				conversationId: 'conv1',
				sender: conversation.participants[1],
				content: 'Hi there',
				createdAt: '2024-01-01T00:01:00Z',
				read: false,
			},
			{
				id: '3',
				conversationId: 'conv1',
				sender: conversation.participants[1],
				content: 'How are you?',
				createdAt: '2024-01-01T00:02:00Z',
				read: false,
			},
		];

		expect(shouldShowList(conversation, false, messages.length)).toBe(true);
		expect(hasMessages(messages)).toBe(true);
		expect(getMessageCount(messages)).toBe(3);
		expect(hasUnreadMessages(messages)).toBe(true);
		expect(getUnreadMessages(messages)).toHaveLength(2);
		expect(findFirstUnreadIndex(messages)).toBe(1);
		expect(getLastMessage(messages)?.content).toBe('How are you?');
		expect(shouldGroupMessages(messages[1], messages[2])).toBe(true);
	});

	it('handles complete UI state transitions', () => {
		const conversation: Conversation = {
			id: 'conv1',
			participants: [],
			unreadCount: 0,
			updatedAt: '2024-01-01T00:00:00Z',
		};

		// No selection
		expect(shouldShowNoSelection(null)).toBe(true);

		// Loading
		expect(shouldShowLoading(conversation, true)).toBe(true);
		expect(shouldShowEmpty(conversation, true, 0)).toBe(false);
		expect(shouldShowList(conversation, true, 0)).toBe(false);

		// Empty
		expect(shouldShowLoading(conversation, false)).toBe(false);
		expect(shouldShowEmpty(conversation, false, 0)).toBe(true);
		expect(shouldShowList(conversation, false, 0)).toBe(false);

		// List
		expect(shouldShowLoading(conversation, false)).toBe(false);
		expect(shouldShowEmpty(conversation, false, 5)).toBe(false);
		expect(shouldShowList(conversation, false, 5)).toBe(true);
	});
});
