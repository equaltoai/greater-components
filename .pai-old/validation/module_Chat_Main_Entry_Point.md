# Module: Chat Main Entry Point

## Type: creation

## Files:
[packages/shared/chat/src/index.ts]

## File Changes:
- packages/shared/chat/src/index.ts: BEFORE: DOES NOT EXIST | AFTER: <<</**
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
 * <Chat.Root {handlers}>
 *   <Chat.Header title="AI Assistant" />
 *   <Chat.Messages />
 *   <Chat.Input placeholder="Type a message..." />
 * </Chat.Root>
 * ```
 *
 * @example With suggestions
 * ```svelte
 * <Chat.Root {handlers}>
 *   <Chat.Messages />
 *   <Chat.Suggestions
 *     suggestions={[
 *       { id: '1', text: 'Tell me a joke' },
 *       { id: '2', text: 'What can you help with?' },
 *     ]}
 *   />
 *   <Chat.Input />
 * </Chat.Root>
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
  ChatSuggestionsProps,
  ChatHeaderProps,
  ChatSettingsState,
  ChatSettingsProps,
} from './types.js';

// Export context utilities
export type {
  ChatHandlers,
  ChatState,
  ChatContextValue,
} from './context.js';

export {
  createChatContext,
  getChatContext,
  setChatContext,
  hasChatContext,
} from './context.js';

// Component exports will be added as they are implemented:
// export { default as Root } from './Root.svelte';
// export { default as Container } from './Container.svelte';
// export { default as Header } from './Header.svelte';
// export { default as Messages } from './Messages.svelte';
// export { default as Message } from './Message.svelte';
// export { default as Input } from './Input.svelte';
// export { default as ToolCall } from './ToolCall.svelte';
// export { default as Suggestions } from './Suggestions.svelte';
// export { default as Settings } from './Settings.svelte';>>> | TYPE: content creation | DESC: Creates main entry point with type exports, context utility exports, and placeholder comments for future component exports
