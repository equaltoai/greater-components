# Module: Chat Index Export Update

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

// Chat header component
export { default as Header } from './ChatHeader.svelte';

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
];
>>> | TYPE: content replacement | DESC: Add KnowledgeBaseConfig to type exports, add Settings component export, add defaultModelOptions constant, remove TODO comment - all changes consolidated into single transformation
