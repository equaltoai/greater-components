# Module: Update Chat Package Index Exports

## Type: update

## Files:
[packages/shared/chat/src/index.ts]

## File Changes:
- packages/shared/chat/src/index.ts: BEFORE: <<<
// Additional component exports will be added as they are implemented:
// export { default as Header } from './Header.svelte';
// export { default as ToolCall } from './ToolCall.svelte';
// export { default as Suggestions } from './Suggestions.svelte';
// export { default as Settings } from './Settings.svelte';
>>> | AFTER: <<<
// Tool call display component
export { default as ToolCall } from './ChatToolCall.svelte';

// Additional component exports will be added as they are implemented:
// export { default as Header } from './Header.svelte';
// export { default as Suggestions } from './Suggestions.svelte';
// export { default as Settings } from './Settings.svelte';
>>> | TYPE: line edit | DESC: Adds export for ChatToolCall component as ToolCall and removes the commented placeholder
