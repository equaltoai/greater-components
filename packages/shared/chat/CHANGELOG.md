# @equaltoai/greater-components-chat

## 4.2.4

### Patch Changes

- Fix ChatInput vertical alignment - change container from align-items: flex-end to align-items: center so paperclip icon, text input, and send button are all vertically centered.

## 4.2.3

### Patch Changes

- 2264f0b: Fix ChatInput placeholder vertical alignment - ensure textarea height resets to LINE_HEIGHT (24px) when empty, keeping placeholder text vertically centered with adjacent icons like the attachment button.

## 4.2.2

### Patch Changes

- Fix ChatInput container overflow - added box-sizing, width constraints, and min-width to prevent container from overflowing parent wrapper.

## 4.2.1

### Patch Changes

- Fix ChatInput container padding asymmetry - left and right padding are now equal (0.75rem) for proper visual balance of the input field with action buttons.

## 4.2.0

### Minor Changes

- 20e26dc: ## New Chat Component Suite

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

### Patch Changes

- ## ChatInput: Unified Container for Input and Actions

  Fixed visual layout issue where the send button and file upload button appeared outside the input field border.

  ### Changes
  - Moved border, background, and focus styles from textarea to parent `.chat-input__container`
  - Textarea is now transparent with no border, allowing the container to provide unified visual treatment
  - Focus state uses `:focus-within` on container instead of `:focus` on textarea
  - Error state uses `:has()` selector to style container when textarea has error class

  ### Before

  The textarea had its own border/background, causing action buttons to appear visually disconnected and floating outside the input area.

  ### After

  The entire input area (textarea + buttons) is wrapped in a single bordered container, providing a cohesive input field appearance similar to modern chat interfaces.

## 4.1.0

### Minor Changes

- 20e26dc: ## New Chat Component Suite

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
