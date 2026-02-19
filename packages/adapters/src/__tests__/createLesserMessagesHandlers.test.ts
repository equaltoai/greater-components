import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLesserMessagesHandlers } from '../messaging/createLesserMessagesHandlers.js';
import {
	AcceptMessageRequestDocument,
	ConversationMessagesDocument,
	CreateConversationDocument,
	DeclineMessageRequestDocument,
	DeleteConversationDocument,
	DeleteMessageDocument,
	SendMessageDocument,
} from '../graphql/generated/types.js';

describe('createLesserMessagesHandlers', () => {
	const adapter = {
		getConversations: vi.fn(),
		getConversation: vi.fn(),
		subscribeToConversationUpdates: vi.fn(),
		query: vi.fn(),
		mutate: vi.fn(),
		markConversationAsRead: vi.fn(),
		search: vi.fn(),
	} as any;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches conversations by folder', async () => {
		adapter.getConversations.mockResolvedValueOnce([
			{
				id: 'c1',
				unread: true,
				updatedAt: '2026-02-01T00:00:00.000Z',
				accounts: [{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: null }],
				lastStatus: null,
				viewerMetadata: {
					requestState: 'PENDING',
					requestedAt: null,
					acceptedAt: null,
					declinedAt: null,
				},
			},
		]);

		const handlers = createLesserMessagesHandlers({ adapter, pageSize: 10 });
		const conversations = await handlers.onFetchConversations?.('REQUESTS');

		expect(adapter.getConversations).toHaveBeenCalledWith({ folder: 'REQUESTS', first: 10 });
		expect(conversations).toHaveLength(1);
		expect(conversations?.[0]).toMatchObject({
			id: 'c1',
			folder: 'REQUESTS',
			requestState: 'PENDING',
			unreadCount: 1,
		});
	});

	it('fetches messages for a conversation', async () => {
		adapter.query.mockResolvedValueOnce({
			conversationMessages: {
				edges: [
					{
						cursor: 'cursor-1',
						node: {
							id: 'm1',
							content: 'Hello',
							createdAt: '2026-02-01T00:00:00.000Z',
							actor: { id: 'u1', username: 'alice', displayName: 'Alice', avatar: null },
							attachments: [],
						},
					},
				],
			},
		});

		const handlers = createLesserMessagesHandlers({ adapter });
		const messages = await handlers.onFetchMessages?.('c1', { limit: 25 });

		expect(adapter.query).toHaveBeenCalledWith(
			ConversationMessagesDocument,
			expect.objectContaining({ conversationId: 'c1', first: 25 })
		);
		expect(messages).toHaveLength(1);
		expect(messages?.[0]).toMatchObject({ id: 'm1', conversationId: 'c1', content: 'Hello' });
	});

	it('sends a message', async () => {
		adapter.mutate.mockResolvedValueOnce({
			sendMessage: {
				message: {
					id: 'm1',
					content: 'Hi',
					createdAt: '2026-02-01T00:00:00.000Z',
					actor: { id: 'u1', username: 'alice', displayName: 'Alice', avatar: null },
					attachments: [],
				},
			},
		});

		const handlers = createLesserMessagesHandlers({ adapter });
		const message = await handlers.onSendMessage?.('c1', 'Hi');

		expect(adapter.mutate).toHaveBeenCalledWith(
			SendMessageDocument,
			expect.objectContaining({ conversationId: 'c1', content: 'Hi' })
		);
		expect(message).toMatchObject({ id: 'm1', conversationId: 'c1', content: 'Hi' });
	});

	it('creates a 1:1 conversation', async () => {
		adapter.mutate.mockResolvedValueOnce({
			createConversation: {
				id: 'c1',
				unread: false,
				updatedAt: '2026-02-01T00:00:00.000Z',
				accounts: [{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: null }],
				lastStatus: null,
				viewerMetadata: {
					requestState: 'ACCEPTED',
					requestedAt: null,
					acceptedAt: null,
					declinedAt: null,
				},
			},
		});

		const handlers = createLesserMessagesHandlers({ adapter });
		const conversation = await handlers.onCreateConversation?.(['u1']);

		expect(adapter.mutate).toHaveBeenCalledWith(
			CreateConversationDocument,
			expect.objectContaining({ participantId: 'u1' })
		);
		expect(conversation).toMatchObject({ id: 'c1', folder: 'INBOX', requestState: 'ACCEPTED' });
	});

	it('rejects creating group conversations in DM v1', async () => {
		const handlers = createLesserMessagesHandlers({ adapter });
		await expect(handlers.onCreateConversation?.(['u1', 'u2'])).rejects.toThrow('1:1');
	});

	it('accepts/declines message requests', async () => {
		adapter.mutate
			.mockResolvedValueOnce({
				acceptMessageRequest: {
					id: 'c1',
					unread: false,
					updatedAt: '2026-02-01T00:00:00.000Z',
					accounts: [{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: null }],
					lastStatus: null,
					viewerMetadata: {
						requestState: 'ACCEPTED',
						requestedAt: null,
						acceptedAt: '2026-02-01T00:00:00.000Z',
						declinedAt: null,
					},
				},
			})
			.mockResolvedValueOnce({ declineMessageRequest: true });

		const handlers = createLesserMessagesHandlers({ adapter });

		const accepted = await handlers.onAcceptMessageRequest?.('c1');
		expect(adapter.mutate).toHaveBeenCalledWith(
			AcceptMessageRequestDocument,
			expect.objectContaining({ conversationId: 'c1' })
		);
		expect(accepted).toMatchObject({ id: 'c1', requestState: 'ACCEPTED' });

		const declined = await handlers.onDeclineMessageRequest?.('c1');
		expect(adapter.mutate).toHaveBeenCalledWith(
			DeclineMessageRequestDocument,
			expect.objectContaining({ conversationId: 'c1' })
		);
		expect(declined).toBe(true);
	});

	it('marks conversations as read', async () => {
		const handlers = createLesserMessagesHandlers({ adapter });
		await handlers.onMarkRead?.('c1');
		expect(adapter.markConversationAsRead).toHaveBeenCalledWith('c1');
	});

	it('deletes messages and conversations', async () => {
		adapter.mutate
			.mockResolvedValueOnce({ deleteMessage: true })
			.mockResolvedValueOnce({ deleteConversation: true });

		const handlers = createLesserMessagesHandlers({ adapter });

		const deletedMessage = await handlers.onDeleteMessage?.('m1');
		expect(adapter.mutate).toHaveBeenCalledWith(DeleteMessageDocument, { messageId: 'm1' });
		expect(deletedMessage).toBe(true);

		const deletedConversation = await handlers.onDeleteConversation?.('c1');
		expect(adapter.mutate).toHaveBeenCalledWith(DeleteConversationDocument, {
			conversationId: 'c1',
		});
		expect(deletedConversation).toBe(true);
	});

	it('searches participants', async () => {
		adapter.search.mockResolvedValueOnce({
			accounts: [{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: null }],
		});

		const handlers = createLesserMessagesHandlers({ adapter, searchLimit: 5 });
		const results = await handlers.onSearchParticipants?.('ali');

		expect(adapter.search).toHaveBeenCalledWith({
			query: 'ali',
			type: 'accounts',
			first: 5,
		});
		expect(results).toEqual([
			{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: undefined },
		]);
	});

	it('subscribes to conversation updates', async () => {
		const unsubscribe = vi.fn();
		adapter.subscribeToConversationUpdates.mockReturnValueOnce({
			subscribe: ({ next }: any) => {
				next({ data: { conversationUpdates: { id: 'c1' } } });
				return { unsubscribe };
			},
		});

		adapter.getConversation.mockResolvedValueOnce({
			id: 'c1',
			unread: true,
			updatedAt: '2026-02-01T00:00:00.000Z',
			accounts: [{ id: 'u1', username: 'alice', displayName: 'Alice', avatar: null }],
			lastStatus: {
				id: 'm1',
				content: 'Hello',
				createdAt: '2026-02-01T00:00:00.000Z',
				actor: { id: 'u1', username: 'alice', displayName: 'Alice', avatar: null },
				attachments: [],
			},
			viewerMetadata: {
				requestState: 'ACCEPTED',
				requestedAt: null,
				acceptedAt: null,
				declinedAt: null,
			},
		});

		const handlers = createLesserMessagesHandlers({ adapter });

		const statuses: string[] = [];
		const updates: any[] = [];
		const stop = handlers.onSubscribeToConversationUpdates?.({
			onConversationUpdate: (update) => updates.push(update),
			onConnectionStatusChange: (status) => statuses.push(status),
		});

		expect(statuses).toEqual(['connecting', 'connected']);

		await Promise.resolve();

		expect(adapter.getConversation).toHaveBeenCalledWith('c1');
		expect(updates).toHaveLength(1);
		expect(updates[0]).toMatchObject({
			conversation: expect.objectContaining({
				id: 'c1',
				requestState: 'ACCEPTED',
				folder: 'INBOX',
			}),
			message: expect.objectContaining({ id: 'm1', conversationId: 'c1' }),
		});

		stop?.();
		expect(unsubscribe).toHaveBeenCalled();
	});
});
