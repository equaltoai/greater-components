# Module: Chat Context System

## Type: creation

## Files:
[packages/shared/chat/src/context.ts]

## File Changes:
- packages/shared/chat/src/context.ts: BEFORE: DOES NOT EXIST | AFTER: <<</**
 * Chat Context
 *
 * Provides shared state and handlers for all chat components.
 * Supports message management, streaming, and settings.
 *
 * @module Chat/context
 */

import { getContext, setContext } from 'svelte';
import type {
  ChatMessage,
  ChatSettingsState,
} from './types.js';

/**
 * Chat context key
 */
const CHAT_CONTEXT_KEY = Symbol('chat-context');

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
   * Called when streaming should be stopped
   */
  onStopStreaming?: () => void;
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
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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
  const state: ChatState = {
    messages: [],
    loading: false,
    streaming: false,
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
  };

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
        timestamp: new Date(),
      };
      state.messages = [...state.messages, newMessage];
      return newMessage;
    },

    updateMessage: (id: string, updates: Partial<ChatMessage>) => {
      state.messages = state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      );
    },

    removeMessage: (id: string) => {
      state.messages = state.messages.filter((msg) => msg.id !== id);
    },

    clearMessages: () => {
      state.messages = [];
      state.error = null;
    },

    setError: (error: string | null) => {
      state.error = error;
    },

    toggleSettings: () => {
      state.settingsOpen = !state.settingsOpen;
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
    throw new Error('Chat components must be used within a Chat.Root component');
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
}>>> | TYPE: content creation | DESC: Creates context system with ChatContextValue interface, createChatContext factory, getChatContext/setChatContext functions following the established pattern from messaging and compose packages
