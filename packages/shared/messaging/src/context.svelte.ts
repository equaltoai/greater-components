/**
 * Messages Context
 *
 * Provides direct messages state and handlers for all messages components.
 * Supports conversations list, threaded messages, and message composition.
 *
 * @module Messages/context
 */

import { getContext, setContext } from 'svelte';
import type { MediaCategory } from './types.js';

const MESSAGES_CONTEXT_KEY = Symbol('messages-context');

/**
 * Conversation participant
 */
export interface MessageParticipant {
	id: string;
	username: string;
	displayName: string;
	avatar?: string;
}

/**
 * Direct message
 */
export interface DirectMessage {
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
		sensitive?: boolean;
		spoilerText?: string | null;
		mediaCategory?: MediaCategory;
		description?: string;
	}[];
}

/**
 * Conversation summary
 */
export interface Conversation {
	id: string;
	/**
	 * Folder the conversation belongs to (Inbox vs Requests).
	 *
	 * Optional for backwards compatibility; defaults to `INBOX` when omitted.
	 */
	folder?: ConversationFolder;
	participants: MessageParticipant[];
	lastMessage?: DirectMessage;
	unreadCount: number;
	updatedAt: string;
	/**
	 * Request state for message requests.
	 *
	 * Optional for backwards compatibility; treat missing as `ACCEPTED`.
	 */
	requestState?: DmRequestState;
	requestedAt?: string | null;
	acceptedAt?: string | null;
	declinedAt?: string | null;
}

/**
 * Conversation folder
 */
export type ConversationFolder = 'INBOX' | 'REQUESTS';

/**
 * DM request state
 */
export type DmRequestState = 'PENDING' | 'ACCEPTED' | 'DECLINED';

/**
 * Messages event handlers
 */
export interface MessagesHandlers {
	/**
	 * Fetch all conversations
	 */
	onFetchConversations?: (folder?: ConversationFolder) => Promise<Conversation[]>;

	/**
	 * Fetch messages for a conversation
	 */
	onFetchMessages?: (
		conversationId: string,
		options?: { limit?: number; cursor?: string }
	) => Promise<DirectMessage[]>;

	/**
	 * Send a message
	 */
	onSendMessage?: (
		conversationId: string,
		content: string,
		mediaIds?: string[]
	) => Promise<DirectMessage>;

	/**
	 * Mark conversation as read
	 */
	onMarkRead?: (conversationId: string) => Promise<void>;

	/**
	 * Delete a message
	 */
	onDeleteMessage?: (messageId: string) => Promise<boolean | void>;

	/**
	 * Delete a conversation (delete-for-me)
	 */
	onDeleteConversation?: (conversationId: string) => Promise<boolean | void>;

	/**
	 * Create new conversation
	 */
	onCreateConversation?: (participantIds: string[]) => Promise<Conversation>;

	/**
	 * Accept a pending message request
	 */
	onAcceptMessageRequest?: (conversationId: string) => Promise<Conversation>;

	/**
	 * Decline a pending message request
	 */
	onDeclineMessageRequest?: (conversationId: string) => Promise<boolean>;

	/**
	 * Upload media
	 */
	onUploadMedia?: (
		file: File,
		metadata: MessageMediaUploadMetadata
	) => Promise<{
		id: string;
		url: string;
		previewUrl?: string;
		sensitive?: boolean;
		spoilerText?: string | null;
		mediaCategory?: MediaCategory;
	}>;

	/**
	 * Handle conversation click
	 */
	onConversationClick?: (conversation: Conversation) => void;

	/**
	 * Search for users to start new conversation
	 */
	onSearchParticipants?: (query: string) => Promise<MessageParticipant[]>;
}

export interface MessageMediaUploadMetadata {
	mediaCategory: MediaCategory;
	sensitive: boolean;
	spoilerText?: string;
	description?: string;
}

/**
 * Messages state
 */
export interface MessagesState {
	/**
	 * Active folder (Inbox vs Requests)
	 */
	folder: ConversationFolder;

	/**
	 * All conversations
	 */
	conversations: Conversation[];

	/**
	 * Currently selected conversation
	 */
	selectedConversation: Conversation | null;

	/**
	 * Messages in the selected conversation
	 */
	messages: DirectMessage[];

	/**
	 * Whether a message operation is in progress
	 */
	loading: boolean;

	/**
	 * Current error message
	 */
	error: string | null;

	/**
	 * Whether conversations are loading
	 */
	loadingConversations: boolean;

	/**
	 * Whether messages are loading
	 */
	loadingMessages: boolean;
}

/**
 * Messages context
 */
export interface MessagesContext {
	/**
	 * Current messages state
	 */
	state: MessagesState;

	/**
	 * Messages event handlers
	 */
	handlers: MessagesHandlers;

	/**
	 * Update messages state
	 */
	updateState: (partial: Partial<MessagesState>) => void;

	/**
	 * Clear messages error
	 */
	clearError: () => void;

	/**
	 * Fetch all conversations
	 */
	fetchConversations: (
		folder?: ConversationFolder,
		options?: { preserveSelection?: boolean }
	) => Promise<void>;

	/**
	 * Select a conversation
	 */
	selectConversation: (conversation: Conversation | null) => Promise<void>;

	/**
	 * Send a message
	 */
	sendMessage: (content: string, mediaIds?: string[]) => Promise<void>;

	/**
	 * Delete a message
	 */
	deleteMessage: (messageId: string) => Promise<void>;

	/**
	 * Delete a conversation (delete-for-me)
	 */
	deleteConversation: (conversationId: string) => Promise<void>;

	/**
	 * Mark conversation as read
	 */
	markRead: (conversationId: string) => Promise<void>;

	/**
	 * Accept a pending message request
	 */
	acceptMessageRequest: (conversationId: string) => Promise<void>;

	/**
	 * Decline a pending message request
	 */
	declineMessageRequest: (conversationId: string) => Promise<void>;
}

/**
 * Create messages context
 *
 * @param handlers - Messages event handlers
 * @returns Messages context
 */
export function createMessagesContext(handlers: MessagesHandlers = {}): MessagesContext {
	const state = $state<MessagesState>({
		folder: 'INBOX',
		conversations: [],
		selectedConversation: null,
		messages: [],
		loading: false,
		error: null,
		loadingConversations: false,
		loadingMessages: false,
	});

	const fetchConversations: MessagesContext['fetchConversations'] = async (
		folder,
		options = {}
	) => {
		const nextFolder = folder ?? state.folder ?? 'INBOX';
		const folderChanged = nextFolder !== state.folder;

		state.loadingConversations = true;
		state.error = null;

		if (folderChanged) {
			state.folder = nextFolder;
			if (!options.preserveSelection) {
				state.selectedConversation = null;
				state.messages = [];
			}
		}

		try {
			const conversations = await handlers.onFetchConversations?.(nextFolder);
			if (conversations) {
				state.conversations = conversations;
			}
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to fetch conversations';
		} finally {
			state.loadingConversations = false;
		}
	};

	const acceptMessageRequest: MessagesContext['acceptMessageRequest'] = async (conversationId) => {
		state.loading = true;
		state.error = null;

		try {
			const updated = await handlers.onAcceptMessageRequest?.(conversationId);
			if (updated) {
				const next = { ...updated, requestState: updated.requestState ?? 'ACCEPTED' } as Conversation;

				if (state.selectedConversation?.id === conversationId) {
					state.selectedConversation = { ...state.selectedConversation, ...next };
				}

				state.conversations = state.conversations.map((c) =>
					c.id === conversationId ? { ...c, ...next } : c
				);
			}

			if (state.folder === 'REQUESTS') {
				await fetchConversations('INBOX', { preserveSelection: true });
			}
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to accept message request';
			throw error;
		} finally {
			state.loading = false;
		}
	};

	const declineMessageRequest: MessagesContext['declineMessageRequest'] = async (conversationId) => {
		state.loading = true;
		state.error = null;

		try {
			const ok = await handlers.onDeclineMessageRequest?.(conversationId);
			if (ok) {
				state.conversations = state.conversations.filter((c) => c.id !== conversationId);

				if (state.selectedConversation?.id === conversationId) {
					state.selectedConversation = null;
					state.messages = [];
				}
			}
		} catch (error) {
			state.error = error instanceof Error ? error.message : 'Failed to decline message request';
			throw error;
		} finally {
			state.loading = false;
		}
	};

	const context: MessagesContext = {
		state,
		handlers,
		updateState: (partial: Partial<MessagesState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		fetchConversations,
		selectConversation: async (conversation: Conversation | null) => {
			state.selectedConversation = conversation;
			state.messages = [];

			if (conversation) {
				state.loadingMessages = true;
				state.error = null;

				try {
					const messages = await handlers.onFetchMessages?.(conversation.id);
					if (messages) {
						state.messages = messages;
					}

					// Mark as read
					await handlers.onMarkRead?.(conversation.id);

					// Update unread count in conversations list
					state.conversations = state.conversations.map((c) =>
						c.id === conversation.id ? { ...c, unreadCount: 0 } : c
					);
				} catch (error) {
					state.error = error instanceof Error ? error.message : 'Failed to fetch messages';
				} finally {
					state.loadingMessages = false;
				}
			}
		},
		sendMessage: async (content: string, mediaIds?: string[]) => {
			if (!state.selectedConversation || !content.trim()) return;
			if ((state.selectedConversation.requestState ?? 'ACCEPTED') === 'PENDING') return;

			state.loading = true;
			state.error = null;

			try {
				const message = await handlers.onSendMessage?.(
					state.selectedConversation.id,
					content,
					mediaIds
				);
				if (message) {
					state.messages = [...state.messages, message];

					// Update last message in conversation
					state.conversations = state.conversations.map((c) =>
						c.id === state.selectedConversation?.id
							? { ...c, lastMessage: message, updatedAt: message.createdAt }
							: c
					);
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to send message';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		deleteMessage: async (messageId: string) => {
			if (!handlers.onDeleteMessage) {
				state.error = 'Delete message handler is not provided';
				throw new Error(state.error);
			}

			state.loading = true;
			state.error = null;

			try {
				const ok = await handlers.onDeleteMessage(messageId);
				if (ok === false) {
					return;
				}

				state.messages = state.messages.filter((m) => m.id !== messageId);

				if (state.selectedConversation) {
					const deletedWasLast =
						state.selectedConversation.lastMessage?.id === messageId ||
						state.conversations.find((c) => c.id === state.selectedConversation?.id)?.lastMessage?.id ===
							messageId;

					if (deletedWasLast) {
						const nextLastMessage = state.messages.at(-1);
						const nextUpdatedAt = nextLastMessage?.createdAt ?? state.selectedConversation.updatedAt;

						state.selectedConversation = {
							...state.selectedConversation,
							lastMessage: nextLastMessage,
							updatedAt: nextUpdatedAt,
						};

						state.conversations = state.conversations.map((c) =>
							c.id === state.selectedConversation?.id
								? { ...c, lastMessage: nextLastMessage, updatedAt: nextUpdatedAt }
								: c
						);
					}
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to delete message';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		deleteConversation: async (conversationId: string) => {
			if (!handlers.onDeleteConversation) {
				state.error = 'Delete conversation handler is not provided';
				throw new Error(state.error);
			}

			state.loading = true;
			state.error = null;

			try {
				const ok = await handlers.onDeleteConversation(conversationId);
				if (ok === false) {
					return;
				}

				state.conversations = state.conversations.filter((c) => c.id !== conversationId);

				if (state.selectedConversation?.id === conversationId) {
					state.selectedConversation = null;
					state.messages = [];
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to delete conversation';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		markRead: async (conversationId: string) => {
			try {
				await handlers.onMarkRead?.(conversationId);
				state.conversations = state.conversations.map((c) =>
					c.id === conversationId ? { ...c, unreadCount: 0 } : c
				);
			} catch {
				// Silently fail
			}
		},
		acceptMessageRequest,
		declineMessageRequest,
	};

	setContext(MESSAGES_CONTEXT_KEY, context);
	return context;
}

/**
 * Get messages context
 *
 * Must be called within a Messages component tree.
 *
 * @throws Error if called outside Messages component tree
 * @returns Messages context
 */
export function getMessagesContext(): MessagesContext {
	const context = getContext<MessagesContext>(MESSAGES_CONTEXT_KEY);
	if (!context) {
		throw new Error('Messages components must be used within a Messages.Root component');
	}
	return context;
}
