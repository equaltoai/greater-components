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

export type RealtimeConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConversationRealtimeUpdate {
	conversation: Conversation;
	message?: DirectMessage;
}

export interface MessagesRealtimeCallbacks {
	onConversationUpdate: (update: ConversationRealtimeUpdate) => void;
	onConnectionStatusChange?: (status: RealtimeConnectionStatus, reason?: string) => void;
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
	/**
	 * Subscribe to realtime conversation updates
	 */
	onSubscribeToConversationUpdates?: (
		callbacks: MessagesRealtimeCallbacks
	) => (() => void) | Promise<(() => void) | void> | void;
}

export interface MessageMediaUploadMetadata {
	mediaCategory: MediaCategory;
	sensitive: boolean;
	spoilerText?: string;
	description?: string;
}

export interface FetchConversationsOptions {
	preserveSelection?: boolean;
	background?: boolean;
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

	/**
	 * Number of pending message requests
	 */
	requestCount: number;

	/**
	 * Realtime status
	 */
	realtimeStatus: RealtimeConnectionStatus;

	/**
	 * Optional realtime status message
	 */
	realtimeStatusMessage: string | null;
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
	fetchConversations: (folder?: ConversationFolder, options?: FetchConversationsOptions) => Promise<void>;

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

	/**
	 * Start realtime updates (if supported)
	 */
	startRealtime: () => void;

	/**
	 * Stop realtime updates
	 */
	stopRealtime: () => void;
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
		requestCount: 0,
		realtimeStatus: 'idle',
		realtimeStatusMessage: null,
	});

	const requestTracker = new Set<string>();
	const realtimeRetryDelays = [2000, 5000, 10000, 20000];
	let realtimeRetryIndex = 0;
	let realtimeRetryTimer: ReturnType<typeof setTimeout> | undefined;
	let realtimeSubscriptionStop: (() => void) | undefined;
	let autoReconnectEnabled = true;

	const syncRequestCount = () => {
		state.requestCount = requestTracker.size;
	};

	const updateRequestTracker = (conversations: Conversation[]) => {
		for (const conversation of conversations) {
			const requestState = conversation.requestState ?? 'ACCEPTED';
			if (requestState === 'PENDING') {
				requestTracker.add(conversation.id);
			} else {
				requestTracker.delete(conversation.id);
			}
		}
		syncRequestCount();
	};

	const removePendingRequest = (conversationId: string) => {
		if (requestTracker.delete(conversationId)) {
			syncRequestCount();
		}
	};

	const sortByUpdatedAt = (items: Conversation[]) =>
		[...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

	const defaultRealtimeMessage = (status: RealtimeConnectionStatus) => {
		switch (status) {
			case 'connecting':
				return 'Connecting to realtime updates…';
			case 'disconnected':
				return 'Realtime paused — retrying shortly.';
			case 'error':
				return 'Realtime temporarily unavailable.';
			default:
				return null;
		}
	};

	const setRealtimeStatus = (status: RealtimeConnectionStatus, message?: string) => {
		state.realtimeStatus = status;
		state.realtimeStatusMessage = message ?? defaultRealtimeMessage(status);
	};

	const clearRealtimeRetry = () => {
		if (realtimeRetryTimer) {
			clearTimeout(realtimeRetryTimer);
			realtimeRetryTimer = undefined;
		}
		realtimeRetryIndex = 0;
	};

	const cleanupRealtimeSubscription = () => {
		if (realtimeSubscriptionStop) {
			realtimeSubscriptionStop();
			realtimeSubscriptionStop = undefined;
		}
		clearRealtimeRetry();
	};

	const scheduleRealtimeReconnect = () => {
		const subscribeHandler = handlers.onSubscribeToConversationUpdates;
		if (!subscribeHandler || realtimeRetryTimer || !autoReconnectEnabled) {
			return;
		}

		const delay = realtimeRetryDelays[Math.min(realtimeRetryIndex, realtimeRetryDelays.length - 1)];
		realtimeRetryIndex += 1;
		setRealtimeStatus('disconnected', `Realtime paused — retrying in ${delay / 1000}s…`);

		realtimeRetryTimer = setTimeout(() => {
			realtimeRetryTimer = undefined;
			startRealtime();
		}, delay);
	};

	const handleRealtimeConnectionChange = (status: RealtimeConnectionStatus, reason?: string) => {
		setRealtimeStatus(status, reason);
		if (status === 'connected') {
			clearRealtimeRetry();
			autoReconnectEnabled = true;
			return;
		}

		if (status === 'disconnected' || status === 'error') {
			scheduleRealtimeReconnect();
		}
	};

	const applyRealtimeConversationUpdate = ({ conversation, message }: ConversationRealtimeUpdate) => {
		const existing =
			state.conversations.find((c) => c.id === conversation.id) ?? state.selectedConversation;
		const requestState = conversation.requestState ?? existing?.requestState ?? 'ACCEPTED';
		const folder =
			conversation.folder ??
			existing?.folder ??
			(requestState === 'PENDING' ? 'REQUESTS' : 'INBOX');

		const merged: Conversation = {
			...conversation,
			participants:
				conversation.participants?.length
					? conversation.participants
					: existing?.participants ?? [],
			lastMessage: message ?? conversation.lastMessage ?? existing?.lastMessage,
			requestState,
			folder,
		};

		if (requestState === 'PENDING') {
			requestTracker.add(conversation.id);
		} else {
			requestTracker.delete(conversation.id);
		}
		syncRequestCount();

		if (state.folder === folder) {
			const remaining = state.conversations.filter((c) => c.id !== conversation.id);
			state.conversations = sortByUpdatedAt([merged, ...remaining]);
		} else if (state.conversations.some((c) => c.id === conversation.id)) {
			// Remove conversation when it moves out of the active folder
			state.conversations = state.conversations.filter((c) => c.id !== conversation.id);
		}

		if (state.selectedConversation?.id === conversation.id) {
			state.selectedConversation = { ...state.selectedConversation, ...merged };
			if (message && !state.messages.some((m) => m.id === message.id)) {
				state.messages = [...state.messages, message];
			}
		}
	};

	const startRealtime = () => {
		const subscribeHandler = handlers.onSubscribeToConversationUpdates;
		if (!subscribeHandler) {
			return;
		}

		autoReconnectEnabled = true;
		cleanupRealtimeSubscription();
		setRealtimeStatus('connecting');

		try {
			const subscription = subscribeHandler({
				onConversationUpdate: applyRealtimeConversationUpdate,
				onConnectionStatusChange: handleRealtimeConnectionChange,
			});

			Promise.resolve(subscription)
				.then((unsubscribe) => {
					if (typeof unsubscribe === 'function') {
						realtimeSubscriptionStop = unsubscribe;
					}
				})
				.catch((error) => {
					handleRealtimeConnectionChange(
						'error',
						error instanceof Error ? error.message : 'Realtime unavailable'
					);
				});
		} catch (error) {
			handleRealtimeConnectionChange(
				'error',
				error instanceof Error ? error.message : 'Realtime unavailable'
			);
		}
	};

	const stopRealtime = () => {
		autoReconnectEnabled = false;
		cleanupRealtimeSubscription();
		setRealtimeStatus('disconnected', 'Realtime updates paused');
	};

	const fetchConversations: MessagesContext['fetchConversations'] = async (
		folder,
		options: FetchConversationsOptions = {}
	) => {
		const nextFolder = folder ?? state.folder ?? 'INBOX';
		const folderChanged = nextFolder !== state.folder;
		const isBackground = Boolean(options.background);

		if (!isBackground) {
			state.loadingConversations = true;
			state.error = null;

			if (folderChanged) {
				state.folder = nextFolder;
				if (!options.preserveSelection) {
					state.selectedConversation = null;
					state.messages = [];
				}
			}
		} else {
			state.error = null;
		}

		try {
			const conversations = await handlers.onFetchConversations?.(nextFolder);
			if (conversations) {
				updateRequestTracker(conversations);
				if (!isBackground) {
					state.conversations = sortByUpdatedAt(conversations);
				}
			}
		} catch (error) {
			if (!isBackground) {
				state.error = error instanceof Error ? error.message : 'Failed to fetch conversations';
			}
		} finally {
			if (!isBackground) {
				state.loadingConversations = false;
			}
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
				removePendingRequest(conversationId);
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
				removePendingRequest(conversationId);
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
					const updated = state.conversations.map((c) =>
						c.id === state.selectedConversation?.id
							? { ...c, lastMessage: message, updatedAt: message.createdAt }
							: c
					);
					state.conversations = sortByUpdatedAt(updated);

					if (state.selectedConversation) {
						state.selectedConversation = {
							...state.selectedConversation,
							lastMessage: message,
							updatedAt: message.createdAt,
						};
					}
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
				removePendingRequest(conversationId);

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
		startRealtime,
		stopRealtime,
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
