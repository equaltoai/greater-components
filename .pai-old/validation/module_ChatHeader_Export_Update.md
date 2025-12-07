# Module: ChatHeader Export Update

## Type: update

## Files:
[packages/shared/chat/src/index.ts]

## File Changes:
- packages/shared/chat/src/index.ts: BEFORE: <<<
// Tool call display component
export { default as ToolCall } from './ChatToolCall.svelte';

// Suggestions component for quick prompts
export { default as Suggestions } from './ChatSuggestions.svelte';
>>> | AFTER: <<<
// Tool call display component
export { default as ToolCall } from './ChatToolCall.svelte';

// Chat header component
export { default as Header } from './ChatHeader.svelte';

// Suggestions component for quick prompts
export { default as Suggestions } from './ChatSuggestions.svelte';
>>> | TYPE: line edit | DESC: Add export for ChatHeader component as Header between ToolCall and Suggestions exports
