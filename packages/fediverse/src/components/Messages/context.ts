/**
 * Messages Context
 * 
 * Provides direct messages state and handlers for all messages components.
 * Supports conversations list, threaded messages, and message composition.
 * 
 * @module Messages/context
 */

import { getContext, setContext } from 'svelte';
import type { MediaCategory } from '../../types.js';

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
	participants: MessageParticipant[];
	lastMessage?: DirectMessage;
	unreadCount: number;
	updatedAt: string;
}

/**
 * Messages event handlers
 */
export interface MessagesHandlers {
	/**
	 * Fetch all conversations
	 */
	onFetchConversations?: () => Promise<Conversation[]>;

	/**
	 * Fetch messages for a conversation
	 */
	onFetchMessages?: (conversationId: string, options?: { limit?: number; cursor?: string }) => Promise<DirectMessage[]>;

	/**
	 * Send a message
	 */
	onSendMessage?: (conversationId: string, content: string, mediaIds?: string[]) => Promise<DirectMessage>;

	/**
	 * Mark conversation as read
	 */
	onMarkRead?: (conversationId: string) => Promise<void>;

	/**
	 * Delete a message
	 */
	onDeleteMessage?: (messageId: string) => Promise<void>;

	/**
	 * Create new conversation
	 */
	onCreateConversation?: (participantIds: string[]) => Promise<Conversation>;

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
	fetchConversations: () => Promise<void>;

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
	 * Mark conversation as read
	 */
	markRead: (conversationId: string) => Promise<void>;
}

/**
 * Create messages context
 * 
 * @param handlers - Messages event handlers
 * @returns Messages context
 */
export function createMessagesContext(handlers: MessagesHandlers = {}): MessagesContext {
	const state = $state<MessagesState>({
		conversations: [],
		selectedConversation: null,
		messages: [],
		loading: false,
		error: null,
		loadingConversations: false,
		loadingMessages: false,
	});

	const context: MessagesContext = {
		state,
		handlers,
		updateState: (partial: Partial<MessagesState>) => {
			Object.assign(state, partial);
		},
		clearError: () => {
			state.error = null;
		},
		fetchConversations: async () => {
			state.loadingConversations = true;
			state.error = null;

			try {
				const conversations = await handlers.onFetchConversations?.();
				if (conversations) {
					state.conversations = conversations;
				}
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch conversations';
			} finally {
				state.loadingConversations = false;
			}
		},
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
						c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
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

			state.loading = true;
			state.error = null;

			try {
				const message = await handlers.onSendMessage?.(state.selectedConversation.id, content, mediaIds);
				if (message) {
					state.messages = [...state.messages, message];

					// Update last message in conversation
					state.conversations = state.conversations.map((c) =>
						c.id === state.selectedConversation?.id
							? { ...c, lastMessage: message, updatedAt: message.createdAt }
							: c,
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
			state.loading = true;
			state.error = null;

			try {
				await handlers.onDeleteMessage?.(messageId);
				state.messages = state.messages.filter((m) => m.id !== messageId);
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to delete message';
				throw error;
			} finally {
				state.loading = false;
			}
		},
		markRead: async (conversationId: string) => {
			try {
				await handlers.onMarkRead?.(conversationId);
				state.conversations = state.conversations.map((c) =>
					c.id === conversationId ? { ...c, unreadCount: 0 } : c,
				);
			} catch {
				// Silently fail
			}
		},
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

/**
 * Format message timestamp
 */
export function formatMessageTime(timestamp: string): string {
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

/**
 * Get conversation display name
 */
export function getConversationName(conversation: Conversation, currentUserId: string): string {
	const otherParticipants = conversation.participants.filter((p) => p.id !== currentUserId);
	if (otherParticipants.length === 0) return 'Me';
	if (otherParticipants.length === 1 && otherParticipants[0]) return otherParticipants[0].displayName;
	return otherParticipants.map((p) => p.displayName).join(', ');
}
