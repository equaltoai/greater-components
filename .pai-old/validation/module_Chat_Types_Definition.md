# Module: Chat Types Definition

## Type: creation

## Files:
[packages/shared/chat/src/types.ts]

## File Changes:
- packages/shared/chat/src/types.ts: BEFORE: DOES NOT EXIST | AFTER: <<</**
 * Chat Component Types
 *
 * TypeScript interfaces for the AI chat component suite.
 * Supports streaming responses, tool calls, and configurable settings.
 *
 * @module Chat/types
 */

import type { Snippet } from 'svelte';

/**
 * Message role in the conversation
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Message status during streaming
 */
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

/**
 * Tool call status
 */
export type ToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

/**
 * Tool call definition
 */
export interface ToolCall {
  /** Unique identifier for the tool call */
  id: string;
  /** Name of the tool being called */
  tool: string;
  /** Arguments passed to the tool */
  args: Record<string, unknown>;
  /** Result from the tool execution */
  result?: unknown;
  /** Current status of the tool call */
  status: ToolCallStatus;
  /** Error message if status is 'error' */
  error?: string;
}

/**
 * Chat message
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Message content (may be partial during streaming) */
  content: string;
  /** Timestamp when the message was created */
  timestamp: Date;
  /** Tool calls associated with this message */
  toolCalls?: ToolCall[];
  /** Current status of the message */
  status: MessageStatus;
  /** Error message if status is 'error' */
  error?: string;
}

/**
 * Chat container component props
 */
export interface ChatContainerProps {
  /** Custom CSS class */
  class?: string;
  /** Children content */
  children?: Snippet;
}

/**
 * Individual chat message component props
 */
export interface ChatMessageProps {
  /** The message to display */
  message: ChatMessage;
  /** Whether to show the avatar */
  showAvatar?: boolean;
  /** Custom avatar URL for assistant messages */
  assistantAvatar?: string;
  /** Custom avatar URL for user messages */
  userAvatar?: string;
  /** Whether to render markdown in message content */
  renderMarkdown?: boolean;
  /** Custom CSS class */
  class?: string;
}

/**
 * Chat messages list component props
 */
export interface ChatMessagesProps {
  /** Array of messages to display */
  messages: ChatMessage[];
  /** Whether to auto-scroll to new messages */
  autoScroll?: boolean;
  /** Whether to show avatars */
  showAvatars?: boolean;
  /** Custom avatar URL for assistant messages */
  assistantAvatar?: string;
  /** Custom avatar URL for user messages */
  userAvatar?: string;
  /** Whether to render markdown in message content */
  renderMarkdown?: boolean;
  /** Loading state indicator */
  loading?: boolean;
  /** Empty state content */
  emptyState?: Snippet;
  /** Custom CSS class */
  class?: string;
}

/**
 * Chat input component props
 */
export interface ChatInputProps {
  /** Current input value (bindable) */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to auto-focus the input */
  autofocus?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether to allow multiline input */
  multiline?: boolean;
  /** Number of rows for multiline input */
  rows?: number;
  /** Called when message is submitted */
  onSubmit?: (content: string) => void | Promise<void>;
  /** Called when input value changes */
  onChange?: (value: string) => void;
  /** Custom CSS class */
  class?: string;
}

/**
 * Tool call display component props
 */
export interface ChatToolCallProps {
  /** The tool call to display */
  toolCall: ToolCall;
  /** Whether to show the result */
  showResult?: boolean;
  /** Whether the result is collapsible */
  collapsible?: boolean;
  /** Whether the result is initially collapsed */
  defaultCollapsed?: boolean;
  /** Custom CSS class */
  class?: string;
}

/**
 * Suggestion item
 */
export interface ChatSuggestion {
  /** Unique identifier */
  id: string;
  /** Display text */
  text: string;
  /** Optional icon name */
  icon?: string;
}

/**
 * Chat suggestions component props
 */
export interface ChatSuggestionsProps {
  /** Array of suggestions to display */
  suggestions: ChatSuggestion[];
  /** Called when a suggestion is selected */
  onSelect?: (suggestion: ChatSuggestion) => void;
  /** Custom CSS class */
  class?: string;
}

/**
 * Chat header component props
 */
export interface ChatHeaderProps {
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** Whether to show settings button */
  showSettings?: boolean;
  /** Called when settings button is clicked */
  onSettingsClick?: () => void;
  /** Whether to show close button */
  showClose?: boolean;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Custom actions slot */
  actions?: Snippet;
  /** Custom CSS class */
  class?: string;
}

/**
 * Chat settings state
 */
export interface ChatSettingsState {
  /** Model identifier */
  model?: string;
  /** Temperature setting (0-2) */
  temperature?: number;
  /** Maximum tokens for response */
  maxTokens?: number;
  /** System prompt */
  systemPrompt?: string;
  /** Whether to stream responses */
  streaming?: boolean;
  /** Custom settings */
  [key: string]: unknown;
}

/**
 * Chat settings component props
 */
export interface ChatSettingsProps {
  /** Current settings state */
  settings: ChatSettingsState;
  /** Available models */
  availableModels?: Array<{ id: string; name: string }>;
  /** Called when settings change */
  onChange?: (settings: ChatSettingsState) => void;
  /** Called when settings are saved */
  onSave?: (settings: ChatSettingsState) => void;
  /** Called when settings panel is closed */
  onClose?: () => void;
  /** Custom CSS class */
  class?: string;
}>>> | TYPE: content creation | DESC: Creates comprehensive TypeScript type definitions for all chat components including ChatMessage, ToolCall, and all component props interfaces
