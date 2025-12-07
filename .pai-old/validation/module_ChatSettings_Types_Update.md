# Module: ChatSettings Types Update

## Type: update

## Files:
[packages/shared/chat/src/types.ts]

## File Changes:
- packages/shared/chat/src/types.ts: BEFORE: <<<
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
}
>>> | AFTER: <<<
/**
 * Knowledge base configuration for chat settings
 */
export interface KnowledgeBaseConfig {
  /** Unique identifier for the knowledge base */
  id: string;
  /** Display name for the knowledge base */
  name: string;
  /** Optional description */
  description?: string;
  /** Whether this knowledge base is enabled */
  enabled?: boolean;
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
  /** Enabled knowledge base IDs */
  knowledgeBases?: string[];
  /** Custom settings */
  [key: string]: unknown;
}

/**
 * Chat settings component props
 */
export interface ChatSettingsProps {
  /** Whether the settings modal is open (bindable) */
  open?: boolean;
  /** Current settings state */
  settings: ChatSettingsState;
  /** Available models for selection */
  availableModels?: Array<{ id: string; name: string }>;
  /** Available knowledge bases for selection */
  availableKnowledgeBases?: KnowledgeBaseConfig[];
  /** Called when settings change (immediate updates) */
  onSettingsChange?: (settings: ChatSettingsState) => void;
  /** Called when settings change (legacy alias) */
  onChange?: (settings: ChatSettingsState) => void;
  /** Called when settings are saved */
  onSave?: (settings: ChatSettingsState) => void;
  /** Called when settings panel is closed */
  onClose?: () => void;
  /** Custom CSS class */
  class?: string;
}
>>> | TYPE: content replacement | DESC: Add KnowledgeBaseConfig interface, knowledgeBases property to ChatSettingsState, and open/availableKnowledgeBases/onSettingsChange props to ChatSettingsProps
