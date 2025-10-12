/**
 * Messages.Message Component Tests
 * 
 * Tests for individual message display logic including:
 * - Own message detection
 * - Avatar display
 * - Sender name display
 * - Content formatting
 * - Media handling
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
	mediaAttachments?: {
		url: string;
		type: string;
		previewUrl?: string;
	}[];
}

// Check if message is from current user
function isOwnMessage(message: DirectMessage, currentUserId: string): boolean {
	return message.sender.id === currentUserId;
}

// Check if should show avatar (not own message)
function shouldShowAvatar(message: DirectMessage, currentUserId: string): boolean {
	return !isOwnMessage(message, currentUserId);
}

// Check if should show sender name (not own message)
function shouldShowSender(message: DirectMessage, currentUserId: string): boolean {
	return !isOwnMessage(message, currentUserId);
}

// Get avatar initial
function getAvatarInitial(sender: MessageParticipant): string {
	if (!sender.displayName) return '?';
	return sender.displayName[0]?.toUpperCase() || '?';
}

// Check if sender has avatar
function hasAvatar(sender: MessageParticipant): boolean {
	return !!sender.avatar;
}

// Check if message has media
function hasMedia(message: DirectMessage): boolean {
	return !!message.mediaAttachments && message.mediaAttachments.length > 0;
}

// Get media count
function getMediaCount(message: DirectMessage): number {
	return message.mediaAttachments?.length || 0;
}

// Get message alignment
function getMessageAlignment(message: DirectMessage, currentUserId: string): 'left' | 'right' {
	return isOwnMessage(message, currentUserId) ? 'right' : 'left';
}

// Get bubble color
function getBubbleColor(message: DirectMessage, currentUserId: string): 'primary' | 'secondary' {
	return isOwnMessage(message, currentUserId) ? 'primary' : 'secondary';
}

// Check if content is empty
function isContentEmpty(message: DirectMessage): boolean {
	return message.content.trim().length === 0;
}

// Get content length
function getContentLength(message: DirectMessage): number {
	return message.content.length;
}

// Check if content is long
function isLongMessage(message: DirectMessage, threshold: number = 200): boolean {
	return message.content.length > threshold;
}

// Check if message is read
function isMessageRead(message: DirectMessage): boolean {
	return message.read;
}

// Get sender display name
function getSenderDisplayName(message: DirectMessage): string {
	return message.sender.displayName;
}

// Get sender username
function getSenderUsername(message: DirectMessage): string {
	return message.sender.username;
}

// Truncate long content
function truncateContent(content: string, maxLength: number): string {
	if (content.length <= maxLength) return content;
	return content.slice(0, maxLength) + '...';
}

// Check if content has links
function hasLinks(content: string): boolean {
	const urlPattern = /https?:\/\/[^\s]+/;
	return urlPattern.test(content);
}

// Extract links from content
function extractLinks(content: string): string[] {
	const urlPattern = /https?:\/\/[^\s]+/g;
	return content.match(urlPattern) || [];
}

// Check if content has mentions
function hasMentions(content: string): boolean {
	return content.includes('@');
}

// Extract mentions from content
function extractMentions(content: string): string[] {
	const mentionPattern = /@\w+/g;
	return content.match(mentionPattern) || [];
}

describe('Messages.Message - Own Message Detection', () => {
	const alice: MessageParticipant = { id: 'user1', username: 'alice', displayName: 'Alice' };
	const bob: MessageParticipant = { id: 'user2', username: 'bob', displayName: 'Bob' };

	const aliceMessage: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: alice,
		content: 'Hello',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
	};

	const bobMessage: DirectMessage = {
		id: '2',
		conversationId: 'conv1',
		sender: bob,
		content: 'Hi',
		createdAt: '2024-01-01T00:01:00Z',
		read: true,
	};

	it('detects own message', () => {
		expect(isOwnMessage(aliceMessage, 'user1')).toBe(true);
	});

	it('detects other user message', () => {
		expect(isOwnMessage(bobMessage, 'user1')).toBe(false);
	});

	it('handles current user ID', () => {
		expect(isOwnMessage(aliceMessage, 'user1')).toBe(true);
		expect(isOwnMessage(aliceMessage, 'user2')).toBe(false);
	});
});

describe('Messages.Message - Avatar Display', () => {
	const alice: MessageParticipant = { id: 'user1', username: 'alice', displayName: 'Alice' };
	const aliceWithAvatar: MessageParticipant = {
		...alice,
		avatar: 'https://example.com/avatar.jpg',
	};

	const message: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: alice,
		content: 'Hello',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
	};

	const messageWithAvatar: DirectMessage = {
		...message,
		sender: aliceWithAvatar,
	};

	it('shows avatar for other user messages', () => {
		expect(shouldShowAvatar(message, 'user2')).toBe(true);
	});

	it('hides avatar for own messages', () => {
		expect(shouldShowAvatar(message, 'user1')).toBe(false);
	});

	it('detects sender has avatar', () => {
		expect(hasAvatar(aliceWithAvatar)).toBe(true);
	});

	it('detects sender has no avatar', () => {
		expect(hasAvatar(alice)).toBe(false);
	});

	it('gets avatar initial', () => {
		expect(getAvatarInitial(alice)).toBe('A');
	});

	it('uppercases initial', () => {
		const lowercase: MessageParticipant = {
			id: '1',
			username: 'bob',
			displayName: 'bob',
		};
		expect(getAvatarInitial(lowercase)).toBe('B');
	});

	it('handles empty display name', () => {
		const empty: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '',
		};
		expect(getAvatarInitial(empty)).toBe('?');
	});

	it('handles unicode initial', () => {
		const unicode: MessageParticipant = {
			id: '1',
			username: 'user',
			displayName: '世界',
		};
		expect(getAvatarInitial(unicode)).toBe('世');
	});
});

describe('Messages.Message - Sender Display', () => {
	const alice: MessageParticipant = { id: 'user1', username: 'alice', displayName: 'Alice' };
	const message: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: alice,
		content: 'Hello',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
	};

	it('shows sender for other user messages', () => {
		expect(shouldShowSender(message, 'user2')).toBe(true);
	});

	it('hides sender for own messages', () => {
		expect(shouldShowSender(message, 'user1')).toBe(false);
	});

	it('gets sender display name', () => {
		expect(getSenderDisplayName(message)).toBe('Alice');
	});

	it('gets sender username', () => {
		expect(getSenderUsername(message)).toBe('alice');
	});
});

describe('Messages.Message - Media Attachments', () => {
	const message: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
		content: 'Check this out',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
		mediaAttachments: [
			{ url: 'https://example.com/image.jpg', type: 'image' },
		],
	};

	const messageWithoutMedia: DirectMessage = {
		...message,
		mediaAttachments: undefined,
	};

	it('detects message with media', () => {
		expect(hasMedia(message)).toBe(true);
	});

	it('detects message without media', () => {
		expect(hasMedia(messageWithoutMedia)).toBe(false);
	});

	it('counts media attachments', () => {
		expect(getMediaCount(message)).toBe(1);
	});

	it('returns 0 for no attachments', () => {
		expect(getMediaCount(messageWithoutMedia)).toBe(0);
	});

	it('handles multiple attachments', () => {
		const multiMedia: DirectMessage = {
			...message,
			mediaAttachments: [
				{ url: 'https://example.com/1.jpg', type: 'image' },
				{ url: 'https://example.com/2.jpg', type: 'image' },
			],
		};
		expect(getMediaCount(multiMedia)).toBe(2);
	});
});

describe('Messages.Message - Alignment and Styling', () => {
	const message: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
		content: 'Hello',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
	};

	it('aligns own messages to right', () => {
		expect(getMessageAlignment(message, 'user1')).toBe('right');
	});

	it('aligns other messages to left', () => {
		expect(getMessageAlignment(message, 'user2')).toBe('left');
	});

	it('uses primary color for own messages', () => {
		expect(getBubbleColor(message, 'user1')).toBe('primary');
	});

	it('uses secondary color for other messages', () => {
		expect(getBubbleColor(message, 'user2')).toBe('secondary');
	});
});

describe('Messages.Message - Content Analysis', () => {
	it('detects empty content', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: '   ',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isContentEmpty(message)).toBe(true);
	});

	it('detects non-empty content', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isContentEmpty(message)).toBe(false);
	});

	it('gets content length', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(getContentLength(message)).toBe(5);
	});

	it('detects long messages', () => {
		const longContent = 'A'.repeat(300);
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: longContent,
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isLongMessage(message, 200)).toBe(true);
	});

	it('detects short messages', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isLongMessage(message, 200)).toBe(false);
	});

	it('truncates long content', () => {
		const content = 'This is a very long message';
		expect(truncateContent(content, 10)).toBe('This is a ...');
	});

	it('does not truncate short content', () => {
		expect(truncateContent('Hello', 10)).toBe('Hello');
	});
});

describe('Messages.Message - Read Status', () => {
	it('detects read message', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
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
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Hello',
			createdAt: '2024-01-01T00:00:00Z',
			read: false,
		};
		expect(isMessageRead(message)).toBe(false);
	});
});

describe('Messages.Message - Link Detection', () => {
	it('detects links in content', () => {
		const content = 'Check this out: https://example.com';
		expect(hasLinks(content)).toBe(true);
	});

	it('detects no links', () => {
		expect(hasLinks('Just plain text')).toBe(false);
	});

	it('extracts links', () => {
		const content = 'Link 1: https://example.com Link 2: http://test.com';
		const links = extractLinks(content);
		expect(links).toHaveLength(2);
		expect(links).toContain('https://example.com');
		expect(links).toContain('http://test.com');
	});

	it('returns empty array for no links', () => {
		expect(extractLinks('No links here')).toHaveLength(0);
	});
});

describe('Messages.Message - Mention Detection', () => {
	it('detects mentions', () => {
		const content = 'Hey @alice how are you?';
		expect(hasMentions(content)).toBe(true);
	});

	it('detects no mentions', () => {
		expect(hasMentions('Just plain text')).toBe(false);
	});

	it('extracts mentions', () => {
		const content = 'Hey @alice and @bob!';
		const mentions = extractMentions(content);
		expect(mentions).toHaveLength(2);
		expect(mentions).toContain('@alice');
		expect(mentions).toContain('@bob');
	});

	it('returns empty array for no mentions', () => {
		expect(extractMentions('No mentions here')).toHaveLength(0);
	});

	it('handles @ in URLs', () => {
		const content = 'Check https://example.com/@user';
		expect(hasMentions(content)).toBe(true);
	});
});

describe('Messages.Message - Edge Cases', () => {
	it('handles very long content', () => {
		const longContent = 'A'.repeat(10000);
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: longContent,
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(getContentLength(message)).toBe(10000);
		expect(isLongMessage(message, 200)).toBe(true);
	});

	it('handles unicode in content', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: '世界 🌍',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isContentEmpty(message)).toBe(false);
	});

	it('handles special characters', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: '@#$%^&*()',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(isContentEmpty(message)).toBe(false);
	});

	it('handles newlines in content', () => {
		const message: DirectMessage = {
			id: '1',
			conversationId: 'conv1',
			sender: { id: 'user1', username: 'alice', displayName: 'Alice' },
			content: 'Line 1\nLine 2\nLine 3',
			createdAt: '2024-01-01T00:00:00Z',
			read: true,
		};
		expect(getContentLength(message)).toBe(20);
	});
});

describe('Messages.Message - Integration', () => {
	const alice: MessageParticipant = {
		id: 'user1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'https://example.com/avatar.jpg',
	};

	const message: DirectMessage = {
		id: '1',
		conversationId: 'conv1',
		sender: alice,
		content: 'Hey @bob check this out: https://example.com',
		createdAt: '2024-01-01T00:00:00Z',
		read: true,
		mediaAttachments: [
			{ url: 'https://example.com/image.jpg', type: 'image' },
		],
	};

	it('processes complete message display for other user', () => {
		const currentUserId = 'user2';

		expect(isOwnMessage(message, currentUserId)).toBe(false);
		expect(shouldShowAvatar(message, currentUserId)).toBe(true);
		expect(shouldShowSender(message, currentUserId)).toBe(true);
		expect(hasAvatar(alice)).toBe(true);
		expect(getAvatarInitial(alice)).toBe('A');
		expect(getSenderDisplayName(message)).toBe('Alice');
		expect(getMessageAlignment(message, currentUserId)).toBe('left');
		expect(getBubbleColor(message, currentUserId)).toBe('secondary');
		expect(hasMedia(message)).toBe(true);
		expect(hasLinks(message.content)).toBe(true);
		expect(hasMentions(message.content)).toBe(true);
	});

	it('processes complete message display for own message', () => {
		const currentUserId = 'user1';

		expect(isOwnMessage(message, currentUserId)).toBe(true);
		expect(shouldShowAvatar(message, currentUserId)).toBe(false);
		expect(shouldShowSender(message, currentUserId)).toBe(false);
		expect(getMessageAlignment(message, currentUserId)).toBe('right');
		expect(getBubbleColor(message, currentUserId)).toBe('primary');
		expect(hasMedia(message)).toBe(true);
	});
});

