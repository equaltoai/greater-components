---
"@equaltoai/greater-components": minor
"@equaltoai/greater-components-chat": minor
---

## New Chat Component Suite

Added a complete AI chat interface component suite for building conversational UIs with streaming responses, tool calls, and configurable settings.

### New Components

- **Container** - Main wrapper providing context and flex layout
- **Messages** - Scrollable message list with auto-scroll behavior
- **Message** - Individual message bubble with role-based styling (user/assistant/system)
- **Input** - Smart message composer with auto-resize, keyboard shortcuts, and file upload
- **Header** - Title bar with connection status indicator and action buttons
- **ToolCall** - Tool/function call display with collapsible details and status indicators
- **Suggestions** - Quick prompt suggestions in pills or cards variants
- **Settings** - Configuration modal for model, temperature, and knowledge base settings

### Features

- **Streaming support** - Real-time response streaming with blinking cursor animation
- **Tool call visualization** - Display AI tool invocations with status (pending/running/complete/error)
- **Markdown rendering** - Assistant messages rendered with full markdown support
- **Context API** - Shared state management via `createChatContext`, `getChatContext`, `hasChatContext`
- **Keyboard shortcuts** - Enter to send, Shift+Enter for newline, Escape to clear
- **Connection status** - Visual indicator for WebSocket connection state
- **Dark mode** - Full dark theme support via CSS custom properties
- **Accessibility** - WCAG 2.1 AA compliant with ARIA live regions and keyboard navigation

### Usage

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';
  
  let messages = $state([]);
  
  async function handleSend(content) {
    // Add user message and call your AI API
  }
</script>

<Chat.Container>
  <Chat.Header title="AI Assistant" connectionStatus="connected" />
  <Chat.Messages {messages} />
  <Chat.Input placeholder="Ask me anything..." onSend={handleSend} />
</Chat.Container>
```

### Exports

Import via `@equaltoai/greater-components/chat` or `@equaltoai/greater-components/shared/chat`.



