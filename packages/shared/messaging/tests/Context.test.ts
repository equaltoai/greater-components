import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMessagesContext, type MessagesHandlers, type Conversation, type DirectMessage } from '../src/context.svelte';

// Mock svelte context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('Messages Context', () => {
	let handlers: MessagesHandlers;
	
	beforeEach(() => {
		vi.clearAllMocks();
		handlers = {
			onFetchConversations: vi.fn(),
			onFetchMessages: vi.fn(),
			onSendMessage: vi.fn(),
			onMarkRead: vi.fn(),
			onDeleteMessage: vi.fn(),
		};
	});

	it('creates context with initial state', () => {
		const context = createMessagesContext(handlers);
		expect(context.state.conversations).toEqual([]);
		expect(context.state.selectedConversation).toBeNull();
		expect(context.state.messages).toEqual([]);
		expect(context.state.loading).toBe(false);
		expect(context.state.error).toBeNull();
	});

	describe('fetchConversations', () => {
		it('fetches conversations successfully', async () => {
			const mockConversations: Conversation[] = [
				{ id: '1', participants: [], unreadCount: 0, updatedAt: new Date().toISOString() }
			];
			(handlers.onFetchConversations as any).mockResolvedValue(mockConversations);

			const context = createMessagesContext(handlers);
			await context.fetchConversations();

			expect(handlers.onFetchConversations).toHaveBeenCalled();
			expect(context.state.conversations).toEqual(mockConversations);
			expect(context.state.loadingConversations).toBe(false);
			expect(context.state.error).toBeNull();
		});

		it('handles fetch error', async () => {
			(handlers.onFetchConversations as any).mockRejectedValue(new Error('Fetch failed'));

			const context = createMessagesContext(handlers);
			await context.fetchConversations();

			expect(context.state.error).toBe('Fetch failed');
			expect(context.state.loadingConversations).toBe(false);
		});
	});

	describe('selectConversation', () => {
		it('selects conversation and fetches messages', async () => {
			const conversation: Conversation = { 
				id: '1', 
				participants: [], 
				unreadCount: 1, 
				updatedAt: new Date().toISOString() 
			};
			const mockMessages: DirectMessage[] = [];
			
			(handlers.onFetchMessages as any).mockResolvedValue(mockMessages);
			(handlers.onMarkRead as any).mockResolvedValue(undefined);

			const context = createMessagesContext(handlers);
			// Setup initial conversations to test unread update
			context.state.conversations = [conversation];
			
			await context.selectConversation(conversation);

			expect(context.state.selectedConversation).toEqual(conversation);
			expect(handlers.onFetchMessages).toHaveBeenCalledWith('1');
			expect(handlers.onMarkRead).toHaveBeenCalledWith('1');
			expect(context.state.messages).toEqual(mockMessages);
			
			// Should update unread count locally
			expect(context.state.conversations[0].unreadCount).toBe(0);
		});

		it('handles fetch messages error', async () => {
			const conversation: Conversation = { 
				id: '1', 
				participants: [], 
				unreadCount: 0, 
				updatedAt: new Date().toISOString() 
			};
			(handlers.onFetchMessages as any).mockRejectedValue(new Error('Fetch messages failed'));

			const context = createMessagesContext(handlers);
			await context.selectConversation(conversation);

			expect(context.state.error).toBe('Fetch messages failed');
			expect(context.state.selectedConversation).toEqual(conversation);
		});

		it('clears selection when null is passed', async () => {
			const context = createMessagesContext(handlers);
			await context.selectConversation(null);

			expect(context.state.selectedConversation).toBeNull();
			expect(context.state.messages).toEqual([]);
		});
	});

	describe('sendMessage', () => {
		it('sends message successfully', async () => {
			const conversation: Conversation = { 
				id: '1', 
				participants: [], 
				unreadCount: 0, 
				updatedAt: new Date().toISOString() 
			};
			const newMessage: DirectMessage = {
				id: 'msg1',
				conversationId: '1',
				sender: { id: 'user1', username: 'me', displayName: 'Me' },
				content: 'Hello',
				createdAt: new Date().toISOString(),
				read: true
			};

			(handlers.onSendMessage as any).mockResolvedValue(newMessage);

			const context = createMessagesContext(handlers);
			context.state.selectedConversation = conversation;
			context.state.conversations = [conversation];

			await context.sendMessage('Hello');

			expect(handlers.onSendMessage).toHaveBeenCalledWith('1', 'Hello', undefined);
			expect(context.state.messages).toContainEqual(newMessage);
			expect(context.state.loading).toBe(false);
			
			// Should update conversation last message
			expect(context.state.conversations[0].lastMessage).toEqual(newMessage);
		});

		it('does nothing if no conversation selected', async () => {
			const context = createMessagesContext(handlers);
			await context.sendMessage('Hello');
			expect(handlers.onSendMessage).not.toHaveBeenCalled();
		});

		it('does nothing if content is empty', async () => {
			const context = createMessagesContext(handlers);
			context.state.selectedConversation = { id: '1' } as Conversation;
			await context.sendMessage('   ');
			expect(handlers.onSendMessage).not.toHaveBeenCalled();
		});

		it('handles send error', async () => {
			const conversation: Conversation = { id: '1' } as Conversation;
			(handlers.onSendMessage as any).mockRejectedValue(new Error('Send failed'));

			const context = createMessagesContext(handlers);
			context.state.selectedConversation = conversation;

			await expect(context.sendMessage('Hello')).rejects.toThrow('Send failed');
			expect(context.state.error).toBe('Send failed');
			expect(context.state.loading).toBe(false);
		});
	});

	describe('deleteMessage', () => {
		it('deletes message successfully', async () => {
			const message: DirectMessage = { id: 'msg1' } as DirectMessage;
			(handlers.onDeleteMessage as any).mockResolvedValue(undefined);

			const context = createMessagesContext(handlers);
			context.state.messages = [message];

			await context.deleteMessage('msg1');

			expect(handlers.onDeleteMessage).toHaveBeenCalledWith('msg1');
			expect(context.state.messages).toHaveLength(0);
		});

		it('handles delete error', async () => {
			(handlers.onDeleteMessage as any).mockRejectedValue(new Error('Delete failed'));

			const context = createMessagesContext(handlers);
			
			await expect(context.deleteMessage('msg1')).rejects.toThrow('Delete failed');
			expect(context.state.error).toBe('Delete failed');
		});
	});

	describe('markRead', () => {
		it('marks conversation as read', async () => {
			const conversation: Conversation = { 
				id: '1', 
				participants: [], 
				unreadCount: 5, 
				updatedAt: new Date().toISOString() 
			};
			(handlers.onMarkRead as any).mockResolvedValue(undefined);

			const context = createMessagesContext(handlers);
			context.state.conversations = [conversation];

			await context.markRead('1');

			expect(handlers.onMarkRead).toHaveBeenCalledWith('1');
			expect(context.state.conversations[0].unreadCount).toBe(0);
		});

		it('fails silently', async () => {
			(handlers.onMarkRead as any).mockRejectedValue(new Error('Network error'));
			const context = createMessagesContext(handlers);
			await context.markRead('1');
			// Should not throw
		});
	});
});
