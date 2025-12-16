import { describe, it, expect } from 'vitest';
import { formatMessageTime, getConversationName } from '../src/utils.js';
import type { Conversation, MessageParticipant } from '../src/context.svelte.js';

describe('utils', () => {
	describe('formatMessageTime', () => {
		it('returns "Just now" for current time', () => {
			const now = new Date();
			expect(formatMessageTime(now.toISOString())).toBe('Just now');
		});

		it('returns minutes ago', () => {
			const date = new Date();
			date.setMinutes(date.getMinutes() - 5);
			expect(formatMessageTime(date.toISOString())).toBe('5m ago');
		});

		it('returns hours ago', () => {
			const date = new Date();
			date.setHours(date.getHours() - 2);
			expect(formatMessageTime(date.toISOString())).toBe('2h ago');
		});

		it('returns days ago', () => {
			const date = new Date();
			date.setDate(date.getDate() - 3);
			expect(formatMessageTime(date.toISOString())).toBe('3d ago');
		});

		it('returns full date for > 7 days', () => {
			const date = new Date();
			date.setDate(date.getDate() - 8);
			expect(formatMessageTime(date.toISOString())).toBe(date.toLocaleDateString());
		});
	});

	describe('getConversationName', () => {
		const currentUserId = 'u1';
		const otherUser: MessageParticipant = {
			id: 'u2',
			displayName: 'Other User',
			username: 'other',
		};
		const thirdUser: MessageParticipant = {
			id: 'u3',
			displayName: 'Third User',
			username: 'third',
		};

		it('returns "Me" when no other participants', () => {
			const conversation: Conversation = {
				id: 'c1',
				participants: [{ id: 'u1', displayName: 'Me', username: 'me' }],
				unreadCount: 0,
				updatedAt: '',
			};
			expect(getConversationName(conversation, currentUserId)).toBe('Me');
		});

		it('returns other user name for 1-on-1', () => {
			const conversation: Conversation = {
				id: 'c1',
				participants: [
					{ id: 'u1', displayName: 'Me', username: 'me' },
					otherUser,
				],
				unreadCount: 0,
				updatedAt: '',
			};
			expect(getConversationName(conversation, currentUserId)).toBe('Other User');
		});

		it('returns joined names for group chat', () => {
			const conversation: Conversation = {
				id: 'c1',
				participants: [
					{ id: 'u1', displayName: 'Me', username: 'me' },
					otherUser,
					thirdUser,
				],
				unreadCount: 0,
				updatedAt: '',
			};
			expect(getConversationName(conversation, currentUserId)).toBe(
				'Other User, Third User'
			);
		});
	});
});
