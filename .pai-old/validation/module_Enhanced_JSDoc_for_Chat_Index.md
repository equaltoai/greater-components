# Module: Enhanced JSDoc for Chat Index

## Type: update

## Files:
[packages/shared/chat/src/index.ts]

## File Changes:
- packages/shared/chat/src/index.ts: BEFORE: <<</**
 * Chat Component Suite
 *
 * AI chat interface components for building conversational UIs.
 * Supports streaming responses, tool calls, and configurable settings.
 *
 * @module @equaltoai/greater-components-chat
 *
 * @example Basic usage
 * ```svelte
 * <script>
 *   import * as Chat from '@equaltoai/greater-components-chat';
 *
 *   const handlers = {
 *     onSubmit: async (content) => {
 *       // Send message to AI backend
 *       const response = await fetch('/api/chat', {
 *         method: 'POST',
 *         body: JSON.stringify({ message: content }),
 *       });
 *       return response.json();
 *     },
 *   };
 * </script>
 *
 * <Chat.Container {handlers}>
 *   <Chat.Header title="AI Assistant" />
 *   <Chat.Messages />
 *   <Chat.Input placeholder="Type a message..." />
 * </Chat.Container>
 * ```
 *
 * @example With suggestions
 * ```svelte
 * <Chat.Container {handlers}>
 *   <Chat.Messages />
 *   <Chat.Suggestions
 *     suggestions={[
 *       { id: '1', text: 'Tell me a joke' },
 *       { id: '2', text: 'What can you help with?' },
 *     ]}
 *   />
 *   <Chat.Input />
 * </Chat.Container>
 * ```
 */

// Export types
export type {
  MessageRole,
  MessageStatus,
  ToolCallStatus,
  ToolCall,
  ChatMessage,
  ChatContainerProps,
  ChatMessageProps,
  ChatMessagesProps,
  ChatInputProps,
  ChatToolCallProps,
  ChatSuggestion,
  ChatSuggestionItem,
  ChatSuggestionsProps,
  ChatHeaderProps,
  ChatSettingsState,
  ChatSettingsProps,
  KnowledgeBaseConfig,
} from './types.js';

// Export context utilities and types
export type {
  ChatHandlers,
  ChatState,
  ChatContextValue,
  ConnectionStatus,
} from './context.svelte.js';

export {
  createChatContext,
  getChatContext,
  setChatContext,
  hasChatContext,
  formatMessageTime,
  formatStreamDuration,
  getConnectionStatusText,
} from './context.svelte.js';

// Component exports
export { default as Container } from './ChatContainer.svelte';

// Component exports
export { default as Message } from './ChatMessage.svelte';

// Messages list container with auto-scroll
export { default as Messages } from './ChatMessages.svelte';

// Chat input component
export { default as Input } from './ChatInput.svelte';

// Tool call display component
export { default as ToolCall } from './ChatToolCall.svelte';

// Chat header component
export { default as Header } from './ChatHeader.svelte';

// Suggestions component for quick prompts
export { default as Suggestions } from './ChatSuggestions.svelte';

// Settings modal component
export { default as Settings } from './ChatSettings.svelte';

/**
 * Default PAI suggestions for empty state
 */
export const defaultPAISuggestions: string[] = [
  "What is PAI?",
  "How do I create a scope?",
  "Show me an example workflow",
  "What knowledgebases are available?"
];

/**
 * Default model options for ChatSettings
 */
export const defaultModelOptions = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3', name: 'Claude 3' },
];>>> | AFTER: <<</**
 * @fileoverview Greater Components Chat - AI chat interface components
 *
 * This package provides a comprehensive set of chat UI components built with
 * Svelte 5 for creating conversational AI interfaces. All components feature
 * full TypeScript support, streaming response handling, tool call visualization,
 * and WCAG 2.1 AA accessibility compliance.
 *
 * @version 4.0.0
 * @author Greater Contributors
 * @license AGPL-3.0-only
 * @module @equaltoai/greater-components-chat
 * @public
 *
 * @example Basic chat interface
 * ```svelte
 * <script>
 *   import * as Chat from '@equaltoai/greater-components-chat';
 *
 *   let messages = $state([]);
 *
 *   async function handleSend(content) {
 *     messages = [...messages, {
 *       id: crypto.randomUUID(),
 *       role: 'user',
 *       content,
 *       timestamp: new Date(),
 *       status: 'complete',
 *     }];
 *     // Call your API...
 *   }
 * </script>
 *
 * <Chat.Container>
 *   <Chat.Header title="AI Assistant" />
 *   <Chat.Messages {messages} />
 *   <Chat.Input placeholder="Type a message..." onSend={handleSend} />
 * </Chat.Container>
 * ```
 *
 * @example With suggestions
 * ```svelte
 * <Chat.Container>
 *   <Chat.Messages {messages} />
 *   <Chat.Suggestions
 *     suggestions={["Tell me a joke", "What can you help with?"]}
 *     onSelect={(s) => handleSend(s)}
 *   />
 *   <Chat.Input onSend={handleSend} />
 * </Chat.Container>
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Message and state types for chat components.
 * @public
 */
export type {
  /** Role of a message sender: 'user', 'assistant', or 'system' */
  MessageRole,
  /** Status of a message: 'pending', 'streaming', 'complete', or 'error' */
  MessageStatus,
  /** Status of a tool call: 'pending', 'running', 'complete', or 'error' */
  ToolCallStatus,
  /** Tool/function call definition with args and result */
  ToolCall,
  /** Chat message with role, content, timestamp, and status */
  ChatMessage,
  /** Props for Chat.Container component */
  ChatContainerProps,
  /** Props for Chat.Message component */
  ChatMessageProps,
  /** Props for Chat.Messages component */
  ChatMessagesProps,
  /** Props for Chat.Input component */
  ChatInputProps,
  /** Props for Chat.ToolCall component */
  ChatToolCallProps,
  /** Suggestion item with id and text */
  ChatSuggestion,
  /** Simple suggestion item for string-based API */
  ChatSuggestionItem,
  /** Props for Chat.Suggestions component */
  ChatSuggestionsProps,
  /** Props for Chat.Header component */
  ChatHeaderProps,
  /** Chat settings state (model, temperature, etc.) */
  ChatSettingsState,
  /** Props for Chat.Settings component */
  ChatSettingsProps,
  /** Knowledge base configuration for settings */
  KnowledgeBaseConfig,
} from './types.js';

/**
 * Context types for chat state management.
 * @public
 */
export type {
  /** Event handlers for chat operations */
  ChatHandlers,
  /** Chat state including messages, streaming, and settings */
  ChatState,
  /** Complete chat context value with state and methods */
  ChatContextValue,
  /** Connection status: 'disconnected', 'connecting', 'connected', or 'error' */
  ConnectionStatus,
} from './context.svelte.js';

// ============================================================================
// Context Utilities
// ============================================================================

/**
 * Creates a new chat context with handlers and initial settings.
 *
 * @param handlers - Chat event handlers (onSubmit, onClear, etc.)
 * @param initialSettings - Initial settings state
 * @returns Chat context value with state and methods
 *
 * @example
 * ```typescript
 * const context = createChatContext({
 *   onSubmit: async (content) => { ... },
 *   onClear: () => { ... },
 * }, {
 *   model: 'gpt-4',
 *   temperature: 0.7,
 * });
 * ```
 * @public
 */
export { createChatContext } from './context.svelte.js';

/**
 * Retrieves the current chat context from a parent Chat.Container.
 * Must be called within a component that is a child of Chat.Container.
 *
 * @returns Chat context value
 * @throws Error if called outside of Chat.Container
 *
 * @example
 * ```typescript
 * const context = getChatContext();
 * context.addMessage({ role: 'user', content: 'Hello', status: 'complete' });
 * ```
 * @public
 */
export { getChatContext } from './context.svelte.js';

/**
 * Sets the chat context. Used internally by Chat.Container.
 * @internal
 */
export { setChatContext } from './context.svelte.js';

/**
 * Checks if a chat context exists in the current component tree.
 *
 * @returns True if chat context is available
 *
 * @example
 * ```typescript
 * if (hasChatContext()) {
 *   const context = getChatContext();
 * }
 * ```
 * @public
 */
export { hasChatContext } from './context.svelte.js';

/**
 * Formats a message timestamp for display.
 *
 * @param date - The date to format
 * @returns Formatted time string (e.g., "2:30 PM")
 * @public
 */
export { formatMessageTime } from './context.svelte.js';

/**
 * Formats streaming duration for display.
 *
 * @param startTime - Stream start timestamp
 * @returns Formatted duration string (e.g., "5s")
 * @public
 */
export { formatStreamDuration } from './context.svelte.js';

/**
 * Gets human-readable text for connection status.
 *
 * @param status - Connection status
 * @returns Status text (e.g., "Connected", "Connecting...")
 * @public
 */
export { getConnectionStatusText } from './context.svelte.js';

// ============================================================================
// Component Exports
// ============================================================================

/**
 * Main chat container component providing context and layout.
 *
 * Provides the chat context and layout wrapper for all chat components.
 *
 * @example
 * ```svelte
 * <Chat.Container>
 *   <Chat.Header title="AI Assistant" />
 *   <Chat.Messages {messages} />
 *   <Chat.Input onSend={handleSend} />
 * </Chat.Container>
 * ```
 * @public
 */
export { default as Container } from './ChatContainer.svelte';

/**
 * Individual chat message display component.
 *
 * Displays chat messages with role-based styling, markdown rendering,
 * and interactive features like copy.
 *
 * @example
 * ```svelte
 * <Chat.Message
 *   message={{ id: '1', role: 'assistant', content: 'Hello!', status: 'complete', timestamp: new Date() }}
 *   showAvatar={true}
 * />
 * ```
 * @public
 */
export { default as Message } from './ChatMessage.svelte';

/**
 * Scrollable message list container with auto-scroll.
 *
 * Provides a scrollable container for the message list with auto-scroll behavior
 * and empty state handling.
 *
 * @example
 * ```svelte
 * <Chat.Messages
 *   {messages}
 *   autoScroll={true}
 *   showAvatars={true}
 * />
 * ```
 * @public
 */
export { default as Messages } from './ChatMessages.svelte';

/**
 * Smart message composer with auto-resize and file upload.
 *
 * Provides a message input with auto-resize textarea, keyboard shortcuts,
 * file upload support, and character count functionality.
 *
 * @example
 * ```svelte
 * <Chat.Input
 *   placeholder="Type a message..."
 *   showFileUpload={true}
 *   onSend={(content, files) => handleSend(content, files)}
 * />
 * ```
 * @public
 */
export { default as Input } from './ChatInput.svelte';

/**
 * Tool/function call display component.
 *
 * Displays AI tool invocations during responses with collapsible card,
 * status indicators, and syntax-highlighted arguments/results.
 *
 * @example
 * ```svelte
 * <Chat.ToolCall
 *   toolCall={{
 *     id: '1',
 *     tool: 'search',
 *     args: { query: 'test' },
 *     status: 'complete',
 *     result: 'Found 3 results'
 *   }}
 * />
 * ```
 * @public
 */
export { default as ToolCall } from './ChatToolCall.svelte';

/**
 * Chat interface header component.
 *
 * Provides the top bar for the chat interface with title, connection status,
 * and action buttons (clear, settings).
 *
 * @example
 * ```svelte
 * <Chat.Header
 *   title="AI Assistant"
 *   subtitle="Powered by GPT-4"
 *   connectionStatus="connected"
 *   showClearButton={true}
 *   onClear={() => clearConversation()}
 * />
 * ```
 * @public
 */
export { default as Header } from './ChatHeader.svelte';

/**
 * Quick prompt suggestions component.
 *
 * Displays clickable prompt suggestions in empty state or after responses.
 * Supports pills (default) and cards variants with full keyboard navigation.
 *
 * @example
 * ```svelte
 * <Chat.Suggestions
 *   suggestions={["What is PAI?", "Show me examples"]}
 *   onSelect={(s) => handleSelect(s)}
 *   variant="pills"
 * />
 * ```
 * @public
 */
export { default as Suggestions } from './ChatSuggestions.svelte';

/**
 * Chat configuration modal component.
 *
 * Provides a settings panel for configuring chat behavior including
 * model selection, temperature, max tokens, and knowledge base toggles.
 *
 * @example
 * ```svelte
 * <Chat.Settings
 *   bind:open={settingsOpen}
 *   settings={chatSettings}
 *   availableModels={[{ id: 'gpt-4', name: 'GPT-4' }]}
 *   onSettingsChange={(s) => chatSettings = s}
 * />
 * ```
 * @public
 */
export { default as Settings } from './ChatSettings.svelte';

// ============================================================================
// Constants
// ============================================================================

/**
 * Default PAI suggestions for empty state.
 *
 * Pre-defined suggestion prompts for PAI-related chat interfaces.
 * Use these as a starting point or replace with your own suggestions.
 *
 * @example
 * ```svelte
 * <Chat.Suggestions
 *   suggestions={defaultPAISuggestions}
 *   onSelect={handleSelect}
 * />
 * ```
 * @public
 */
export const defaultPAISuggestions: string[] = [
  "What is PAI?",
  "How do I create a scope?",
  "Show me an example workflow",
  "What knowledgebases are available?"
];

/**
 * Default model options for ChatSettings.
 *
 * Pre-defined model options for the settings panel.
 * Replace with your own models based on your backend capabilities.
 *
 * @example
 * ```svelte
 * <Chat.Settings
 *   availableModels={defaultModelOptions}
 *   ...
 * />
 * ```
 * @public
 */
export const defaultModelOptions = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3', name: 'Claude 3' },
];>>> | TYPE: content replacement | DESC: Enhanced JSDoc comments following primitives/src/index.ts pattern with comprehensive documentation for all exports
