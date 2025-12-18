/**
 * Chat Context
 *
 * Provides shared state and handlers for all chat components.
 * Supports message management, streaming, tool calls, and settings.
 *
 * @module Chat/context
 */

import { getContext, setContext } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';
import type { ChatMessage, ChatSettingsState, ToolCall } from './types.js';

/**
 * Chat context key
 */
const CHAT_CONTEXT_KEY = Symbol('chat-context');

/**
 * Connection status for streaming
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Chat event handlers
 */
export interface ChatHandlers {
	/**
	 * Called when a message is submitted
	 */
	onSubmit?: (content: string) => Promise<void> | void;

	/**
	 * Called when a message should be regenerated
	 */
	onRegenerate?: (messageId: string) => Promise<void> | void;

	/**
	 * Called when a message should be edited
	 */
	onEdit?: (messageId: string, content: string) => Promise<void> | void;

	/**
	 * Called when a message should be deleted
	 */
	onDelete?: (messageId: string) => Promise<void> | void;

	/**
	 * Called when the conversation should be cleared
	 */
	onClear?: () => Promise<void> | void;

	/**
	 * Called when settings change
	 */
	onSettingsChange?: (settings: ChatSettingsState) => void;

	/**
	 * Called when streaming should be stopped/cancelled
	 */
	onStopStreaming?: () => void;

	/**
	 * Called when the last message should be retried
	 */
	onRetry?: () => Promise<void> | void;
}

/**
 * Chat state
 */
export interface ChatState {
	/** All messages in the conversation */
	messages: ChatMessage[];
	/** Whether a response is being generated */
	loading: boolean;
	/** Whether a response is being streamed */
	streaming: boolean;
	/** Current streaming content (partial response) */
	streamContent: string;
	/** Current connection status */
	connectionStatus: ConnectionStatus;
	/** Current error message */
	error: string | null;
	/** Current settings */
	settings: ChatSettingsState;
	/** Whether settings panel is open */
	settingsOpen: boolean;
}

/**
 * Chat context value
 */
export interface ChatContextValue {
	/** Current chat state */
	state: ChatState;
	/** Event handlers */
	handlers: ChatHandlers;
	/** Update state helper */
	updateState: (partial: Partial<ChatState>) => void;
	/** Add a message to the conversation */
	addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
	/** Update an existing message */
	updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
	/** Remove a message */
	removeMessage: (id: string) => void;
	/** Clear all messages */
	clearMessages: () => void;
	/** Set error state */
	setError: (error: string | null) => void;
	/** Toggle settings panel */
	toggleSettings: () => void;
	/** Send a message (calls onSubmit handler) */
	sendMessage: (content: string) => Promise<void>;
	/** Retry the last failed message */
	retryLastMessage: () => Promise<void>;
	/** Cancel the current stream */
	cancelStream: () => void;
	/** Update stream content */
	updateStreamContent: (content: string) => void;
	/** Set connection status */
	setConnectionStatus: (status: ConnectionStatus) => void;
	/** Add a tool call to a message */
	addToolCall: (messageId: string, toolCall: Omit<ToolCall, 'id'>) => ToolCall;
	/** Update a tool call */
	updateToolCall: (messageId: string, toolCallId: string, updates: Partial<ToolCall>) => void;
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
	return `msg_${globalThis.crypto.randomUUID()}`;
}

/**
 * Generate a unique tool call ID
 */
function generateToolCallId(): string {
	return `tc_${globalThis.crypto.randomUUID()}`;
}

/**
 * Create chat context
 *
 * @param handlers - Chat event handlers
 * @param initialSettings - Initial settings state
 * @returns Chat context value
 */
export function createChatContext(
	handlers: ChatHandlers = {},
	initialSettings: ChatSettingsState = {}
): ChatContextValue {
	const state = $state<ChatState>({
		messages: [],
		loading: false,
		streaming: false,
		streamContent: '',
		connectionStatus: 'disconnected',
		error: null,
		settings: {
			model: undefined,
			temperature: 0.7,
			maxTokens: 4096,
			systemPrompt: undefined,
			streaming: true,
			...initialSettings,
		},
		settingsOpen: false,
	});

	const context: ChatContextValue = {
		state,
		handlers,

		updateState: (partial: Partial<ChatState>) => {
			Object.assign(state, partial);
		},

		addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
			const newMessage: ChatMessage = {
				...message,
				id: generateMessageId(),
				timestamp: new SvelteDate(),
			};
			state.messages = [...state.messages, newMessage];
			return newMessage;
		},

		updateMessage: (id: string, updates: Partial<ChatMessage>) => {
			state.messages = state.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg));
		},

		removeMessage: (id: string) => {
			state.messages = state.messages.filter((msg) => msg.id !== id);
		},

		clearMessages: () => {
			state.messages = [];
			state.error = null;
			state.streamContent = '';
			state.streaming = false;
			handlers.onClear?.();
		},

		setError: (error: string | null) => {
			state.error = error;
			if (error) {
				state.connectionStatus = 'error';
			}
		},

		toggleSettings: () => {
			state.settingsOpen = !state.settingsOpen;
		},

		sendMessage: async (content: string) => {
			if (!content.trim() || state.loading) return;

			state.loading = true;
			state.error = null;
			state.streamContent = '';

			// Add user message
			context.addMessage({
				role: 'user',
				content: content.trim(),
				status: 'complete',
			});

			try {
				await handlers.onSubmit?.(content.trim());
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to send message';
				// Mark the last assistant message as error if it exists
				const lastMessage = state.messages[state.messages.length - 1];
				if (lastMessage && lastMessage.role === 'assistant') {
					context.updateMessage(lastMessage.id, {
						status: 'error',
						error: state.error,
					});
				}
			} finally {
				state.loading = false;
				state.streaming = false;
			}
		},

		retryLastMessage: async () => {
			// Find the last user message
			const lastUserMessageIndex = [...state.messages]
				.reverse()
				.findIndex((m) => m.role === 'user');

			if (lastUserMessageIndex === -1) return;

			const actualIndex = state.messages.length - 1 - lastUserMessageIndex;
			const lastUserMessage = state.messages[actualIndex];

			if (!lastUserMessage) return;

			// Remove all messages after the last user message
			state.messages = state.messages.slice(0, actualIndex + 1);
			state.error = null;
			state.loading = true;

			try {
				await handlers.onRetry?.();
			} catch (error) {
				state.error = error instanceof Error ? error.message : 'Failed to retry message';
			} finally {
				state.loading = false;
				state.streaming = false;
			}
		},

		cancelStream: () => {
			state.streaming = false;
			state.loading = false;
			handlers.onStopStreaming?.();

			// Mark any streaming message as complete with current content
			const streamingMessage = state.messages.find((m) => m.status === 'streaming');
			if (streamingMessage) {
				context.updateMessage(streamingMessage.id, {
					status: 'complete',
					content: state.streamContent || streamingMessage.content,
				});
			}
			state.streamContent = '';
		},

		updateStreamContent: (content: string) => {
			state.streamContent = content;
			state.streaming = true;

			// Update the streaming message content
			const streamingMessage = state.messages.find((m) => m.status === 'streaming');
			if (streamingMessage) {
				context.updateMessage(streamingMessage.id, { content });
			}
		},

		setConnectionStatus: (status: ConnectionStatus) => {
			state.connectionStatus = status;
		},

		addToolCall: (messageId: string, toolCall: Omit<ToolCall, 'id'>): ToolCall => {
			const newToolCall: ToolCall = {
				...toolCall,
				id: generateToolCallId(),
			};

			state.messages = state.messages.map((msg) => {
				if (msg.id === messageId) {
					return {
						...msg,
						toolCalls: [...(msg.toolCalls || []), newToolCall],
					};
				}
				return msg;
			});

			return newToolCall;
		},

		updateToolCall: (messageId: string, toolCallId: string, updates: Partial<ToolCall>) => {
			state.messages = state.messages.map((msg) => {
				if (msg.id === messageId && msg.toolCalls) {
					return {
						...msg,
						toolCalls: msg.toolCalls.map((tc) =>
							tc.id === toolCallId ? { ...tc, ...updates } : tc
						),
					};
				}
				return msg;
			});
		},
	};

	setContext(CHAT_CONTEXT_KEY, context);
	return context;
}

/**
 * Get chat context
 *
 * Must be called within a Chat component tree.
 *
 * @throws Error if called outside Chat component tree
 * @returns Chat context value
 */
export function getChatContext(): ChatContextValue {
	const context = getContext<ChatContextValue>(CHAT_CONTEXT_KEY);
	if (!context) {
		throw new Error('Chat components must be used within a Chat.Container component');
	}
	return context;
}

/**
 * Set chat context (for testing or custom implementations)
 *
 * @param context - Chat context value
 */
export function setChatContext(context: ChatContextValue): void {
	setContext(CHAT_CONTEXT_KEY, context);
}

/**
 * Check if chat context exists
 */
export function hasChatContext(): boolean {
	try {
		const context = getContext<ChatContextValue>(CHAT_CONTEXT_KEY);
		return context !== undefined && context !== null;
	} catch {
		return false;
	}
}

/**
 * Format message timestamp for display
 *
 * @param timestamp - Message timestamp
 * @returns Formatted time string
 */
export function formatMessageTime(timestamp: Date | string): string {
	const date = typeof timestamp === 'string' ? new SvelteDate(timestamp) : timestamp;
	const now = new SvelteDate();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	// Today: show time
	if (days === 0) {
		return date.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	}

	// Yesterday
	if (days === 1) {
		return 'Yesterday';
	}

	// Within a week
	if (days < 7) {
		return date.toLocaleDateString(undefined, { weekday: 'long' });
	}

	// Older: show date
	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
	});
}

/**
 * Format relative time for streaming indicators
 *
 * @param seconds - Number of seconds
 * @returns Formatted duration string
 */
export function formatStreamDuration(seconds: number): string {
	if (seconds < 60) {
		return `${seconds}s`;
	}
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get status text for connection status
 *
 * @param status - Connection status
 * @returns Human-readable status text
 */
export function getConnectionStatusText(status: ConnectionStatus): string {
	switch (status) {
		case 'disconnected':
			return 'Disconnected';
		case 'connecting':
			return 'Connecting...';
		case 'connected':
			return 'Connected';
		case 'error':
			return 'Connection error';
		default:
			return 'Unknown';
	}
}
