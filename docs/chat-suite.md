# Chat Component Suite

<!-- AI Training: This is the user-facing documentation for Greater Components Chat suite -->

Build conversational AI interfaces with the Greater Components Chat suite. These components provide a complete solution for creating chat UIs with streaming responses, tool calls, and configurable settings.

## Package Information

| Property | Value |
|----------|-------|
| **Package** | `@equaltoai/greater-components-chat` |
| **Import Path** | `@equaltoai/greater-components/chat` |
| **Version** | 4.0.0 |
| **Components** | 8 |
| **Svelte Version** | 5.x (Runes) |

## Installation

The chat package is included in the Greater Components umbrella package:

```bash
pnpm add @equaltoai/greater-components
```

Or install the standalone package:

```bash
pnpm add @equaltoai/greater-components-chat
```

## Quick Start

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';

  let messages = $state([]);

  async function handleSend(content) {
    // Add user message
    messages = [...messages, {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'complete',
    }];

    // Call your AI API...
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    });
    const data = await response.json();

    // Add assistant response
    messages = [...messages, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.content,
      timestamp: new Date(),
      status: 'complete',
    }];
  }
</script>

<Chat.Container>
  <Chat.Header title="AI Assistant" connectionStatus="connected" />
  <Chat.Messages {messages} />
  <Chat.Input placeholder="Type a message..." onSend={handleSend} />
</Chat.Container>
```

## Components

### Container

The root component that provides context and layout for the chat interface.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string` | `''` | Custom CSS class |
| `children` | `Snippet` | - | Child components |

**Example:**

```svelte
<Chat.Container class="my-chat">
  <Chat.Header title="AI Assistant" />
  <Chat.Messages {messages} />
  <Chat.Input onSend={handleSend} />
</Chat.Container>
```

---

### Header

Displays the chat title, connection status, and action buttons.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Chat'` | Header title |
| `subtitle` | `string` | - | Optional subtitle |
| `connectionStatus` | `'connected' \| 'connecting' \| 'disconnected'` | - | Connection indicator |
| `showClearButton` | `boolean` | `true` | Show clear conversation button |
| `showSettingsButton` | `boolean` | `false` | Show settings button |
| `onClear` | `() => void` | - | Clear button callback |
| `onSettings` | `() => void` | - | Settings button callback |
| `actions` | `Snippet` | - | Custom actions slot |
| `class` | `string` | `''` | Custom CSS class |

**Example:**

```svelte
<Chat.Header 
  title="PAI Assistant" 
  subtitle="Powered by Claude"
  connectionStatus="connected"
  showClearButton={true}
  showSettingsButton={true}
  onClear={() => messages = []}
  onSettings={() => settingsOpen = true}
/>
```

**Connection Status Indicators:**
- `connected` → Green dot
- `connecting` → Yellow pulsing dot
- `disconnected` → Red dot

---

### Messages

Scrollable container for the message list with auto-scroll and empty state.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `ChatMessage[]` | Required | Array of messages |
| `autoScroll` | `boolean` | `true` | Auto-scroll to new messages |
| `showAvatars` | `boolean` | `true` | Show message avatars |
| `assistantAvatar` | `string` | - | Custom assistant avatar URL |
| `userAvatar` | `string` | - | Custom user avatar URL |
| `renderMarkdown` | `boolean` | `true` | Render markdown in content |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `emptyState` | `Snippet` | - | Custom empty state content |
| `class` | `string` | `''` | Custom CSS class |

**Example:**

```svelte
<Chat.Messages 
  {messages}
  autoScroll={true}
  showAvatars={true}
  renderMarkdown={true}
/>
```

**Auto-Scroll Behavior:**
- Scrolls to bottom when new messages arrive
- Only auto-scrolls if user is at/near bottom
- Preserves scroll position when reading history
- Shows floating "scroll to bottom" button when scrolled up

---

### Message

Individual message bubble with role-based styling.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `ChatMessage` | Required | Message to display |
| `showAvatar` | `boolean` | `true` | Show avatar |
| `assistantAvatar` | `string` | - | Custom assistant avatar |
| `userAvatar` | `string` | - | Custom user avatar |
| `renderMarkdown` | `boolean` | `true` | Render markdown |
| `class` | `string` | `''` | Custom CSS class |

**Role-based Styling:**
- **User**: Right-aligned, primary color background
- **Assistant**: Left-aligned, card with markdown rendering
- **System**: Centered, muted background, full-width

**Example:**

```svelte
<Chat.Message 
  message={{
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help?',
    timestamp: new Date(),
    status: 'complete'
  }}
/>
```

---

### Input

Smart message composer with auto-resize and file upload support.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Input value (bindable) |
| `placeholder` | `string` | `'Type a message...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |
| `autofocus` | `boolean` | `false` | Auto-focus on mount |
| `maxLength` | `number` | - | Character limit |
| `showCharacterCount` | `boolean` | `false` | Show character count |
| `multiline` | `boolean` | `true` | Allow multiline |
| `rows` | `number` | `1` | Initial rows |
| `showFileUpload` | `boolean` | `false` | Show file upload button |
| `acceptedFileTypes` | `string` | `'*'` | Accepted file MIME types |
| `maxFiles` | `number` | `5` | Maximum files |
| `maxFileSize` | `number` | `10485760` | Max file size (bytes) |
| `onSend` | `(content: string, files?: File[]) => void` | - | Send callback |
| `onChange` | `(value: string) => void` | - | Change callback |
| `class` | `string` | `''` | Custom CSS class |

**Keyboard Shortcuts:**
- `Enter` → Send message
- `Shift+Enter` → Insert newline
- `Escape` → Clear input
- `Ctrl/Cmd+V` → Paste (including images)

**Example:**

```svelte
<Chat.Input 
  placeholder="Ask me anything..."
  showFileUpload={true}
  maxLength={4000}
  showCharacterCount={true}
  onSend={(content, files) => handleSend(content, files)}
/>
```

---

### ToolCall

Displays AI tool invocations with collapsible details.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toolCall` | `ToolCall` | Required | Tool call data |
| `showResult` | `boolean` | `true` | Show result section |
| `collapsible` | `boolean` | `true` | Allow collapse/expand |
| `defaultCollapsed` | `boolean` | `true` | Initially collapsed |
| `class` | `string` | `''` | Custom CSS class |

**Status Indicators:**
- `pending` → Gray clock icon
- `running` → Animated spinner
- `complete` → Green checkmark
- `error` → Red X with error message

**Tool Icon Mapping:**
- `query_knowledge` → Book/Search icon
- `read_file` → File icon
- `list_files` → Folder icon
- `code_search` → Code icon
- Default → Gear icon

**Example:**

```svelte
<Chat.ToolCall 
  toolCall={{
    id: '1',
    tool: 'query_knowledge',
    args: { query: 'Svelte 5 runes' },
    result: 'Found 3 relevant documents...',
    status: 'complete'
  }}
/>
```

---

### Suggestions

Quick prompt suggestions displayed in empty state or after responses.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `suggestions` | `string[] \| ChatSuggestionItem[]` | Required | Suggestions to display |
| `onSelect` | `(suggestion: string) => void` | Required | Selection callback |
| `variant` | `'pills' \| 'cards'` | `'pills'` | Visual variant |
| `class` | `string` | `''` | Custom CSS class |

**Variants:**
- **pills**: Compact horizontal pills, wraps on mobile
- **cards**: Larger cards with optional descriptions

**Example:**

```svelte
<!-- Simple strings -->
<Chat.Suggestions 
  suggestions={['What is PAI?', 'Show me examples']}
  onSelect={(s) => handleSend(s)}
/>

<!-- With descriptions -->
<Chat.Suggestions 
  variant="cards"
  suggestions={[
    { text: 'What is PAI?', description: 'Learn about the AI assistant' },
    { text: 'Create a scope', description: 'Start a new project' }
  ]}
  onSelect={(s) => handleSend(s)}
/>
```

**Default PAI Suggestions:**

```typescript
import { defaultPAISuggestions } from '@equaltoai/greater-components/chat';
// ['What is PAI?', 'How do I create a scope?', ...]
```

---

### Settings

Configuration modal for chat settings.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Modal visibility (bindable) |
| `settings` | `ChatSettingsState` | Required | Current settings |
| `availableModels` | `{id: string, name: string}[]` | `defaultModelOptions` | Model options |
| `availableKnowledgeBases` | `KnowledgeBaseConfig[]` | `[]` | Knowledge base options |
| `onSettingsChange` | `(settings: ChatSettingsState) => void` | - | Change callback |
| `onSave` | `(settings: ChatSettingsState) => void` | - | Save callback |
| `onClose` | `() => void` | - | Close callback |
| `class` | `string` | `''` | Custom CSS class |

**ChatSettingsState:**

```typescript
interface ChatSettingsState {
  model?: string;           // Model ID
  temperature?: number;     // 0-2
  maxTokens?: number;       // Max response tokens
  systemPrompt?: string;    // System prompt
  streaming?: boolean;      // Enable streaming
  knowledgeBases?: string[]; // Enabled KB IDs
}
```

**Example:**

```svelte
<script>
  let settingsOpen = $state(false);
  let settings = $state({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
  });
</script>

<Chat.Settings 
  bind:open={settingsOpen}
  {settings}
  availableModels={[
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-3', name: 'Claude 3' },
  ]}
  availableKnowledgeBases={[
    { id: 'docs', name: 'Documentation', enabled: true },
    { id: 'code', name: 'Codebase', enabled: false },
  ]}
  onSettingsChange={(s) => settings = s}
/>
```

---

## Context API

The chat suite provides a context system for shared state management.

### createChatContext

Creates a new chat context with handlers and initial settings.

```typescript
import { createChatContext } from '@equaltoai/greater-components/chat';

const context = createChatContext({
  onSubmit: async (content) => {
    // Handle message submission
  },
  onClear: () => {
    // Handle clear conversation
  },
  onToolResult: async (toolCall) => {
    // Handle tool result
  },
}, {
  model: 'gpt-4',
  temperature: 0.7,
});
```

### getChatContext

Retrieves the current chat context from a parent Container.

```typescript
import { getChatContext } from '@equaltoai/greater-components/chat';

// In a child component
const context = getChatContext();
context.addMessage({
  role: 'user',
  content: 'Hello',
  status: 'complete'
});
```

### hasChatContext

Checks if a chat context exists.

```typescript
import { hasChatContext, getChatContext } from '@equaltoai/greater-components/chat';

if (hasChatContext()) {
  const context = getChatContext();
}
```

### Context Value

```typescript
interface ChatContextValue {
  // State
  state: ChatState;
  
  // Methods
  addMessage: (message: Partial<ChatMessage>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
  setStreaming: (streaming: boolean, content?: string) => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  updateSettings: (settings: Partial<ChatSettingsState>) => void;
  
  // Handlers (passed to createChatContext)
  handlers: ChatHandlers;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  streaming: boolean;
  streamContent: string;
  connectionStatus: ConnectionStatus;
  error: string | null;
  settings: ChatSettingsState;
  settingsOpen: boolean;
}
```

---

## Types

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  status: 'pending' | 'streaming' | 'complete' | 'error';
  error?: string;
}
```

### ToolCall

```typescript
interface ToolCall {
  id: string;
  tool: string;
  args: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'running' | 'complete' | 'error';
  error?: string;
}
```

### ChatSuggestionItem

```typescript
interface ChatSuggestionItem {
  text: string;
  description?: string;
}
```

### KnowledgeBaseConfig

```typescript
interface KnowledgeBaseConfig {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
}
```

---

## Utility Functions

### formatMessageTime

Formats a timestamp for display.

```typescript
import { formatMessageTime } from '@equaltoai/greater-components/chat';

formatMessageTime(new Date()); // "2:30 PM"
```

### formatStreamDuration

Formats streaming duration.

```typescript
import { formatStreamDuration } from '@equaltoai/greater-components/chat';

formatStreamDuration(startTimestamp); // "5s"
```

### getConnectionStatusText

Gets human-readable connection status.

```typescript
import { getConnectionStatusText } from '@equaltoai/greater-components/chat';

getConnectionStatusText('connecting'); // "Connecting..."
```

---

## Complete Example

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';
  
  let messages = $state([]);
  let settingsOpen = $state(false);
  let settings = $state({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4096,
  });

  async function handleSend(content) {
    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'complete',
    };
    messages = [...messages, userMessage];

    // Add streaming assistant placeholder
    const assistantId = crypto.randomUUID();
    messages = [...messages, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'streaming',
    }];

    // Stream response
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ message: content, settings }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      fullContent += decoder.decode(value);
      messages = messages.map(m => 
        m.id === assistantId 
          ? { ...m, content: fullContent }
          : m
      );
    }

    // Mark complete
    messages = messages.map(m => 
      m.id === assistantId 
        ? { ...m, status: 'complete' }
        : m
    );
  }

  function handleClear() {
    messages = [];
  }
</script>

<div class="chat-wrapper">
  <Chat.Container>
    <Chat.Header 
      title="PAI Assistant"
      subtitle="Powered by Claude"
      connectionStatus="connected"
      showClearButton={true}
      showSettingsButton={true}
      onClear={handleClear}
      onSettings={() => settingsOpen = true}
    />

    {#if messages.length === 0}
      <div class="empty-state">
        <h3>How can I help you today?</h3>
        <Chat.Suggestions 
          suggestions={Chat.defaultPAISuggestions}
          onSelect={handleSend}
          variant="cards"
        />
      </div>
    {:else}
      <Chat.Messages {messages} />
    {/if}

    <Chat.Input 
      placeholder="Ask me anything..."
      onSend={handleSend}
    />
  </Chat.Container>

  <Chat.Settings 
    bind:open={settingsOpen}
    {settings}
    onSettingsChange={(s) => settings = s}
  />
</div>

<style>
  .chat-wrapper {
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }
</style>
```

---

## Integration with pai-socket

For real-time streaming with WebSocket connections:

```svelte
<script>
  import * as Chat from '@equaltoai/greater-components/chat';
  
  let messages = $state([]);
  let connectionStatus = $state('disconnected');
  let ws;

  function connect() {
    connectionStatus = 'connecting';
    ws = new WebSocket('wss://your-pai-socket-endpoint');

    ws.onopen = () => {
      connectionStatus = 'connected';
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleServerMessage(data);
    };

    ws.onclose = () => {
      connectionStatus = 'disconnected';
    };
  }

  function handleServerMessage(data) {
    switch (data.type) {
      case 'content.delta':
        // Update streaming message
        break;
      case 'tool.start':
        // Add tool call
        break;
      case 'tool.complete':
        // Update tool result
        break;
      case 'complete':
        // Mark message complete
        break;
    }
  }

  function handleSend(content) {
    ws.send(JSON.stringify({
      action: 'ai.chat',
      content,
    }));
  }
</script>
```

---

## Styling

Components use CSS custom properties for theming:

```css
:root {
  /* Container */
  --chat-bg: var(--gr-color-background);
  --chat-border: var(--gr-color-border);
  --chat-radius: var(--gr-radii-lg);
  
  /* Messages */
  --chat-user-bg: var(--gr-color-primary-500);
  --chat-user-text: white;
  --chat-assistant-bg: var(--gr-color-surface);
  --chat-assistant-text: var(--gr-color-text);
  
  /* Input */
  --chat-input-bg: var(--gr-color-surface);
  --chat-input-border: var(--gr-color-border);
  --chat-input-focus: var(--gr-color-primary-500);
}

[data-theme='dark'] {
  --chat-user-bg: var(--gr-color-primary-600);
  --chat-assistant-bg: var(--gr-color-gray-800);
}
```

---

## Accessibility

The chat components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: Full keyboard support throughout
- **Screen Readers**: ARIA live regions announce new messages
- **Focus Management**: Focus moves appropriately on interactions
- **Color Contrast**: Meets AA contrast requirements
- **Motion**: Respects `prefers-reduced-motion`

---

## Best Practices

1. **Error Handling**: Show clear error states when messages fail
2. **Loading States**: Use loading indicators during API calls
3. **Streaming**: Use streaming for long responses to improve perceived performance
4. **Persistence**: Consider persisting chat history for returning users
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Input Validation**: Validate and sanitize user input
7. **Accessibility**: Test with screen readers and keyboard navigation

---

## Troubleshooting

### Messages not appearing

Ensure messages array is properly reactive:

```svelte
<!-- CORRECT -->
messages = [...messages, newMessage];

<!-- INCORRECT -->
messages.push(newMessage);
```

### Context not found

Ensure components are wrapped in `Chat.Container`:

```svelte
<!-- CORRECT -->
<Chat.Container>
  <Chat.Messages {messages} />
</Chat.Container>

<!-- INCORRECT - no container -->
<Chat.Messages {messages} />
```

### Styling issues

Verify CSS custom properties are defined at the root level and Greater Components CSS is imported.

### Streaming not working

Check that your API endpoint supports streaming and the response is properly chunked with Transfer-Encoding: chunked.

---

## API Reference

For complete TypeScript types and props, see:
- [types.ts](../packages/shared/chat/src/types.ts)
- [context.svelte.ts](../packages/shared/chat/src/context.svelte.ts)
- [index.ts](../packages/shared/chat/src/index.ts)
