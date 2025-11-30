# Chat Component Suite for Greater Components

## Objective

Implement a complete, production-ready chat component suite in Greater Components that enables building AI chat interfaces like the PAI demo. These components should integrate seamlessly with pai-socket for real-time streaming.

## Target Package

Create a new package: `packages/shared/chat/`

This follows the existing shared package pattern (like `messaging/`, `compose/`, `notifications/`).

## Components to Implement

### 1. ChatContainer

The main wrapper component that orchestrates the chat experience.

**File:** `src/ChatContainer.svelte`

**Props:**
```typescript
interface ChatContainerProps {
  messages: ChatMessage[];
  streaming?: boolean;
  streamContent?: string;
  class?: string;
  children?: Snippet;
}
```

**Features:**
- Provides chat context to child components
- Auto-scrolls to bottom on new messages
- Handles keyboard shortcuts globally
- Mobile-responsive flex layout
- Manages connection status state

**Usage:**
```svelte
<ChatContainer {messages} {streaming} {streamContent}>
  <ChatHeader title="PAI Demo" />
  <ChatMessages />
  <ChatInput onSend={handleSend} />
</ChatContainer>
```

---

### 2. ChatMessage

Individual message bubble with role-based styling.

**File:** `src/ChatMessage.svelte`

**Props:**
```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  avatar?: string;
  streaming?: boolean;
  class?: string;
}
```

**Features:**
- Role-based alignment (user right, assistant left, system centered)
- Integrates `MarkdownRenderer` for assistant messages
- Shows `StreamingText` when `streaming=true`
- Avatar display using `Avatar` component
- Copy button on hover (uses `CopyButton`)
- Timestamp display (optional)
- Smooth entrance animation

**Styling:**
- User messages: Warm primary background, white text, right-aligned
- Assistant messages: Card with outline, left-aligned
- System messages: Muted background, centered, smaller text

---

### 3. ChatMessages

Scrollable message list container.

**File:** `src/ChatMessages.svelte`

**Props:**
```typescript
interface ChatMessagesProps {
  class?: string;
}
```

**Features:**
- Consumes messages from ChatContainer context
- Auto-scroll to bottom behavior
- Scroll-to-bottom button when scrolled up
- Empty state with suggestions
- Loading skeleton during initial load

---

### 4. ChatInput

Smart message composer with auto-resize.

**File:** `src/ChatInput.svelte`

**Props:**
```typescript
interface ChatInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showFileUpload?: boolean;
  onSend: (content: string, files?: File[]) => void;
  class?: string;
}
```

**Features:**
- Auto-resizing textarea (grows with content, max 6 lines)
- Enter to send, Shift+Enter for newline
- File upload button with `DropZone` integration
- Send button with loading state
- Character count indicator (optional)
- Disabled state during streaming

**Keyboard Shortcuts:**
- `Enter` - Send message
- `Shift+Enter` - New line
- `Escape` - Clear input
- `Ctrl/Cmd+V` - Paste (including images)

---

### 5. ChatToolCall

Display for tool/function invocations during AI response.

**File:** `src/ChatToolCall.svelte`

**Props:**
```typescript
interface ChatToolCallProps {
  tool: string;
  args?: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  collapsible?: boolean;
  class?: string;
}
```

**Features:**
- Collapsible card showing tool execution
- Tool name with icon badge
- Formatted arguments display
- Result preview (truncated with expand)
- Status indicator (spinner, checkmark, error)
- Syntax highlighting for code results

**Tool Icons:**
- `query_knowledge` - Book/search icon
- `read_file` - File icon
- `list_files` - Folder icon
- Default - Gear icon

---

### 6. ChatSuggestions

Quick prompt suggestions shown in empty state or after responses.

**File:** `src/ChatSuggestions.svelte`

**Props:**
```typescript
interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  variant?: 'pills' | 'cards';
  class?: string;
}
```

**Features:**
- Pill-shaped clickable suggestions (default)
- Card variant for longer suggestions with descriptions
- Horizontal scroll on mobile
- Hover/focus states with warm primary accent
- Keyboard navigable

**Default Suggestions for PAI:**
```typescript
const defaultSuggestions = [
  "What is PAI?",
  "How do I create a scope?",
  "Show me an example workflow",
  "What knowledgebases are available?"
];
```

---

### 7. ChatHeader

Top bar with title, controls, and status.

**File:** `src/ChatHeader.svelte`

**Props:**
```typescript
interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  showClearButton?: boolean;
  showSettingsButton?: boolean;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  onClear?: () => void;
  onSettings?: () => void;
  class?: string;
}
```

**Features:**
- Title and optional subtitle
- Connection status indicator (green/yellow/red dot)
- Clear conversation button
- Settings menu trigger
- Responsive layout

---

### 8. ChatSettings (Modal)

Settings panel for chat configuration.

**File:** `src/ChatSettings.svelte`

**Props:**
```typescript
interface ChatSettingsProps {
  open?: boolean;
  onClose?: () => void;
  settings: ChatSettingsState;
  onSettingsChange: (settings: ChatSettingsState) => void;
}

interface ChatSettingsState {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  knowledgeBases?: string[];
}
```

**Features:**
- Model selection dropdown
- Temperature slider
- Max tokens input
- Knowledge base toggles
- Uses existing `Modal`, `Select`, `Switch` components

---

## Context System

### ChatContext

**File:** `src/context.ts`

```typescript
interface ChatContextValue {
  // State
  messages: ChatMessage[];
  streaming: boolean;
  streamContent: string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  error: string | null;
  
  // Actions
  sendMessage: (content: string, files?: File[]) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => void;
  cancelStream: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  status?: 'sending' | 'sent' | 'error';
}

interface ToolCall {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'running' | 'complete' | 'error';
}
```

---

## Types

**File:** `src/types.ts`

Export all TypeScript interfaces for external use.

---

## Styling Requirements

### Design Tokens

Use existing Greater Components design tokens:
- `--gr-color-primary-*` for accents
- `--gr-color-gray-*` for backgrounds
- `--gr-radii-*` for border radius
- `--gr-shadows-*` for elevation

### Dark Mode

Full dark mode support using `[data-theme='dark']` selectors.

### Animations

- Message entrance: fade-up animation (0.3s)
- Streaming cursor: blink animation (0.5s)
- Tool call expand/collapse: smooth height transition
- Scroll-to-bottom button: fade in/out

---

## Dependencies

### Internal (Greater Components):
- `@equaltoai/greater-components-primitives` - Button, Card, Container, TextArea, Avatar, Modal, Select, Switch, Skeleton, CopyButton, DropZone
- `@equaltoai/greater-components-content` - MarkdownRenderer, CodeBlock
- `@equaltoai/greater-components-icons` - Various icons
- `@equaltoai/greater-components-headless` - Headless primitives

### External (Peer Dependencies):
- None required (MarkdownRenderer deps are already peer deps of content package)

---

## File Structure

```
packages/shared/chat/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── svelte.config.js
├── README.md
└── src/
    ├── index.ts
    ├── context.ts
    ├── types.ts
    ├── ChatContainer.svelte
    ├── ChatMessages.svelte
    ├── ChatMessage.svelte
    ├── ChatInput.svelte
    ├── ChatToolCall.svelte
    ├── ChatSuggestions.svelte
    ├── ChatHeader.svelte
    └── ChatSettings.svelte
```

---

## Exports

**File:** `src/index.ts`

```typescript
// Components
export { default as Container } from './ChatContainer.svelte';
export { default as Messages } from './ChatMessages.svelte';
export { default as Message } from './ChatMessage.svelte';
export { default as Input } from './ChatInput.svelte';
export { default as ToolCall } from './ChatToolCall.svelte';
export { default as Suggestions } from './ChatSuggestions.svelte';
export { default as Header } from './ChatHeader.svelte';
export { default as Settings } from './ChatSettings.svelte';

// Context
export { getChatContext, setChatContext } from './context.js';

// Types
export type * from './types.js';
```

---

## Usage Example

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';
  
  let messages = $state([]);
  let streaming = $state(false);
  let streamContent = $state('');
  
  async function handleSend(content: string) {
    // Add user message
    messages = [...messages, {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    }];
    
    // Connect to pai-socket and stream response
    streaming = true;
    // ... WebSocket logic ...
  }
</script>

<Chat.Container {messages} {streaming} {streamContent}>
  <Chat.Header 
    title="PAI Demo" 
    subtitle="Powered by pai-socket"
    connectionStatus="connected"
  />
  
  <Chat.Messages>
    {#each messages as message}
      <Chat.Message 
        role={message.role}
        content={message.content}
        timestamp={message.timestamp}
      />
    {/each}
    
    {#if streaming}
      <Chat.Message 
        role="assistant"
        content={streamContent}
        streaming={true}
      />
    {/if}
  </Chat.Messages>
  
  <Chat.Suggestions 
    suggestions={["What is PAI?", "How do scopes work?"]}
    onSelect={handleSend}
  />
  
  <Chat.Input 
    onSend={handleSend}
    disabled={streaming}
    placeholder="Ask PAI anything..."
  />
</Chat.Container>
```

---

## Integration with Umbrella Package

Add to `packages/greater-components/package.json` exports:

```json
"./chat": {
  "types": "./dist/shared/chat/index.d.ts",
  "svelte": "./dist/shared/chat/src/index.ts",
  "import": "./dist/shared/chat/index.js"
}
```

Update `scripts/build.js` to include the chat package.

---

## Testing Requirements

- Unit tests for each component
- Integration test for full chat flow
- Accessibility tests (keyboard navigation, screen reader)
- Visual regression tests for light/dark mode

---

## Success Criteria

1. All 8 components implemented and exported
2. Full TypeScript types
3. Dark mode support
4. Responsive design (mobile-first)
5. Accessible (WCAG 2.1 AA)
6. Documented with examples
7. Integrated into umbrella package
8. Working demo in playground app

