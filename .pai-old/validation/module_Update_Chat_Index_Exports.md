# Module: Update Chat Index Exports

## Type: update

## Files:
[packages/shared/chat/src/index.ts]

## File Changes:
- packages/shared/chat/src/index.ts: BEFORE: <<<
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

// Additional component exports will be added as they are implemented:
// export { default as Header } from './Header.svelte';
// export { default as Suggestions } from './Suggestions.svelte';
// export { default as Settings } from './Settings.svelte';
>>> | AFTER: <<<
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

// Suggestions component for quick prompts
export { default as Suggestions } from './ChatSuggestions.svelte';

/**
 * Default PAI suggestions for empty state
 */
export const defaultPAISuggestions: string[] = [
  "What is PAI?",
  "How do I create a scope?",
  "Show me an example workflow",
  "What knowledgebases are available?"
];

// Additional component exports will be added as they are implemented:
// export { default as Header } from './Header.svelte';
// export { default as Settings } from './Settings.svelte';
>>> | TYPE: content replacement | DESC: Add Suggestions component export, defaultPAISuggestions constant, and ChatSuggestionItem type export
