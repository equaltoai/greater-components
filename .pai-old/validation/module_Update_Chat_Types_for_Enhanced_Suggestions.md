# Module: Update Chat Types for Enhanced Suggestions

## Type: update

## Files:
[packages/shared/chat/src/types.ts]

## File Changes:
- packages/shared/chat/src/types.ts: BEFORE: <<<
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
>>> | AFTER: <<<
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
  /** Optional description (shown in cards variant) */
  description?: string;
}

/**
 * Simple suggestion item for string-based API
 */
export interface ChatSuggestionItem {
  /** Display text */
  text: string;
  /** Optional description (shown in cards variant) */
  description?: string;
}

/**
 * Chat suggestions component props
 */
export interface ChatSuggestionsProps {
  /** Array of suggestions to display - can be strings or objects */
  suggestions: string[] | ChatSuggestionItem[];
  /** Called when a suggestion is selected */
  onSelect: (suggestion: string) => void;
  /** Visual variant - pills (default) or cards */
  variant?: 'pills' | 'cards';
  /** Custom CSS class */
  class?: string;
}
>>> | TYPE: content replacement | DESC: Update ChatSuggestionsProps to support string arrays, variant prop, and simplified onSelect callback
