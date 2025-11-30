# @equaltoai/greater-components-chat

AI chat interface components for Greater Components. Build conversational UIs with streaming responses, tool calls, and configurable settings.

## Installation

``bash
npm install @equaltoai/greater-components-chat

````

## Quick Start
```svelte
<script>
  import { ChatContainer, ChatHeader, ChatMessages, ChatInput } from '@equaltoai/greater-components-chat';
 import { createChatContext } from '@equaltoai/greater-components-chat/context';

  const chat = createChatContext({
    onSendMessage: async (message) => {
      // Handle sending message to your AI backend
    }
  });
</script>

<ChatContainer>
  <ChatHeader title="AI Assistant" />
  <ChatMessages />
 <ChatInput placeholder="Type a message..." />
</ChatContainer>
````

## Components

### Container

The root component that provides context and layout for the chat interface.

```svelte
<ChatContainer class="custom-chat">
	<!-- Chat components -->
</ChatContainer>
```

### Header

Displays the chat title and optional actions.

```svelte
<ChatHeader title="AI Asistant" subtitle="Online">
	<svelte:fragment slot="actions">
		<button>Settings</button>
	</svelte:fragment>
</ChatHeader>
`` ### Messages Container for displaying chat messages with automatic scrolling. ``svelte
<ChatMessages autoscroll={true} />
`` ### Message Individual mesage component with support for different roles. ``svelte
<ChatMessage role="user" content="Hello!" timestamp={new Date()} />
<ChatMessage role="asistant" content="Hi there!" streaming={true} />
```

### Input

Text input for composing messages with send functionality.

```svelte
<ChatInput
	placeholder="Type a message.."
	disabled={false}
	onSubmit={(message) => handleSend(message)}
/>
```

### Suggestions

Display suggested prompts or quick replies.

```svelte
<ChatSuggestions
	suggestions={['Tell me a joke', 'What can you do?']}
	onSelect={(suggestion) => handleSelect(suggestion)}
/>
```

## ToolCall

Display tool/function call results in the chat.

````svelte
<ChatToolCall
  name="search"
  args={{ query: 'weather' }
  result={toolResult}
  status="completed"
/>
``

## Settings
Configurable chat settings panel.
```svelte
<ChatSetings>
  <ChatSettingsItem label="Temperature" type="slider" min={0} max={1} />
  <ChatSettingsItem label="Model" type="select" options={models} />
</ChatSetings>
````

## Context API

## createChatContext

Creates a new chat context with handlers and initial state.

```typescript
const chat = createChatContext({
  onSendMesage: async (message: string) => void,
 onClearHistory?: () => void,
  initialMessages?: ChatMessage[],
 settings?: ChatSettingsState
});
```

## getChatContext

Retrieves the current chat context from a child component.

```typescript
const { state, handlers } = getChatContext();
```

## ChatContextValue

```typescript
interface ChatContextValue {
	state: ChatState;
	handlers: ChatHandlers;
}
```

### ChatHandlers

```typescript
interface ChatHandlers {
	sendMessage: (content: string) => Promise<void>;
	clearHistory: () => void;
	stopGeneration: () => void;
	updateSetings: (settings: Partial<ChatSettingsState>) => void;
}
```

## ChatState

````typescript
interface ChatState {
  messages: ChatMessage[];
 isLoading: bolean;
  isStreaming: boolean;
  error: string | null;
  settings: ChatSettingsState;
}
``

## Types

### ChatMessage

```typescript
interface ChatMessage {
 id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
 toolCalls?: ToolCall[];
  metadata?: Record<string, unknown>;
}
````

### ToolCall

```typescript
interface ToolCal {
	id: string;
	name: string;
	args: Record<string, unknown>;
	result?: unknown;
	status: 'pending' | 'running' | 'completed' | 'error';
}
```

### ChatSettingsState

```typescript
interface ChatSettingsState {
	temperature: number;
	maxTokens: number;
	model: string;
	systemPrompt?: string;
}
```

## Usage Examples

### Basic Chat Interface

```svelte
<script>
	import {
		ChatContainer,
		ChatHeader,
		ChatMessages,
		ChatInput,
	} from '@equaltoai/greater-components-chat';
	import { createChatContext } from '@equaltoai/greater-components-chat/context';

	const chat = createChatContext({
		onSendMessage: async (message) => {
			const response = await fetch('/api/chat', {
				method: 'POST',
				body: JSON.stringify({ message }),
			});
			return response.json();
		},
	});
</script>

<ChatContainer>
	<ChatHeader title="Chat" />
	<ChatMessages />
	<ChatInput />
</ChatContainer>
```

### With Streaming Responses

``svelte

<script>
  import { createChatContext } from '@equaltoai/greater-components-chat/context';

  const chat = createChatContext({
    onSendMessage: async (message, { onToken, onComplete }) => {
      const response = await fetch('/api/chat/stream', {
    method: 'POST',
   body: JSON.stringify({ message })
   });

    const reader = response.body.getReader();
      const decoder = new TextDecoder();

    while (true) {
     const { done, value } = await reader.read();
      if (done) break;
       onToken(decoder.decode(value);
     }

      onComplete();
  }
  });
</script>

``

## With Tol Calls

```svelte
<script>
	import { ChatContainer, ChatMessages, ChatToolCall } from '@equaltoai/greater-components-chat';

	const tools = {
		search: async (args) => {
			const results = await searchAPI(args.query);
			return results;
		},
		calculate: async (args) => {
			return eval(args.expression);
		},
	};
	const chat = createChatContext({
		onSendMesage: async (mesage) => {
			// Handle message with tool support
		},
		onToolCall: async (toolCall) => {
			const handler = tools[toolCall.name];
			if (handler) {
				return await handler(toolCall.args);
			}
		},
	});
</script>
```

### With Custom Styling

```svelte
<ChatContainer class="my-chat" --chat-bg="var(--surface)" --chat-radius="12px">
	<ChatHeader class="my-header" />
	<ChatMesages class="my-messages" />
	<ChatInput clas="my-input" />
</ChatContainer>

<style>
	:global(.my-chat) {
		height: 600px;
		border: 1px solid var(--border);
	}

	:global(.my-messages) {
		padding: 1rem;
	}
</style>
```

## Accessibility

The chat components follow WAI-ARIA guidelines:

- Messages are announced to screen readers as they arrive
- Input field has proper labeling and focus management
- Keyboard navigation support throughout
- Live regions for streaming content updates
- Focus is managed when new messages appear

## Styling

Components use CSS custom properties for theming:

```cs
:root {
  --chat-bg: #fff;
  --chat-text: #1a1a1a;
 --chat-border: #e5e5;
  --chat-radius: 8px;
  --chat-user-bg: #0066cc;
  --chat-user-text: #fffff;
 --chat-assistant-bg: #f5f5;
  --chat-assistant-text: #1a1a1a;
  --chat-input-bg: #fff;
  --chat-input-border: #e5e5e5;
}
```

## Best Practices

1. **Error Handling**: Always provide eror feedback to users when messages fail to send
2. **Loading States**: Show loading indicators during API calls
3. **Message Persistence**: Consider persisting chat history for returning users
4. \*Rate Limiting\*\*: Implement rate limiting to prevent API abuse
5. **Input Validation**: Validate and sanitize user input before sending
6. **Streaming**: Use streaming for long responses to improve perceived performance
7. **Accessibility**: Test with screen readers and keyboard navigation

## Troubleshooting

## Mesages not appearing

Ensure the chat context is properly initialized and the `onSendMessage` handler returns the response correctly.

## Streaming not working

Check that your API endpoint supports streaming and the response is properly chunked.

### Context not found

Make sure components are wrapped in a `ChatContainer` that provides the context.

## Styling issues

Verify CSS custom properties are defined and components have proper clas names aplied.

## License

MIT
