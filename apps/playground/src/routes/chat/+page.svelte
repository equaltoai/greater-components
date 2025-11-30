<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';
	import { Button } from '@equaltoai/greater-components-primitives';
	import * as Chat from '@equaltoai/greater-components-chat';
	import type {
		ChatMessage,
		ToolCall,
		ChatSettingsState,
	} from '@equaltoai/greater-components-chat';
	import type { ChatHandlers, ConnectionStatus } from '@equaltoai/greater-components-chat';

	// ============================================
	// Sample Conversation Data
	// ============================================
	const sampleToolCalls: ToolCall[] = [
		{
			id: 'tc_1',
			tool: 'query_knowledge',
			args: { query: 'PAI documentation', knowledgeBase: 'paytheory' },
			result: {
				found: 3,
				snippets: ['PAI is an AI-powered assistant...', 'Scopes define context...'],
			},
			status: 'complete',
		},
		{
			id: 'tc_2',
			tool: 'search_files',
			args: { pattern: '*.svelte', path: 'src/routes' },
			status: 'running',
		},
	];

	const initialMessages: ChatMessage[] = [
		{
			id: 'msg_1',
			role: 'user',
			content: 'What is PAI?',
			timestamp: new Date(Date.now() - 300000),
			status: 'complete',
		},
		{
			id: 'msg_2',
			role: 'assistant',
			content: `**PAI** (Penny AI) is an AI-powered development assistant designed to help you build applications faster.

Key features include:
- **Knowledge Base Integration**: Query documentation and code examples
- **Scope Management**: Define context for focused assistance
- **Tool Execution**: Run commands and search files directly
- **Streaming Responses**: Real-time response generation

Would you like me to show you how to create a scope?`,
			timestamp: new Date(Date.now() - 240000),
			status: 'complete',
			toolCalls: [sampleToolCalls[0]],
		},
		{
			id: 'msg_3',
			role: 'user',
			content: 'Yes, show me how to create a scope with file search.',
			timestamp: new Date(Date.now() - 180000),
			status: 'complete',
		},
		{
			id: 'msg_4',
			role: 'assistant',
			content: `Here's how to create a scope with file search capabilities:

\`\`\`typescript
const scope = createScope({
  name: 'my-project',
  include: ['src/**/*.ts', 'src/**/*.svelte'],
  exclude: ['node_modules', 'dist'],
  knowledgeBases: ['paytheory', 'svelte-docs'],
});
\`\`\`

I'm currently searching for relevant files in your project...`,
			timestamp: new Date(Date.now() - 120000),
			status: 'complete',
			toolCalls: [sampleToolCalls[1]],
		},
	];

	// ============================================
	// State Management
	// ============================================
	let messages = $state<ChatMessage[]>([...initialMessages]);
	let isStreaming = $state(false);
	let streamContent = $state('');
	let connectionStatus = $state<ConnectionStatus>('connected');
	let showSettings = $state(false);
	let showEmptyState = $state(false);

	let settings = $state<ChatSettingsState>({
		model: 'gpt-4',
		temperature: 0.7,
		maxTokens: 4096,
		streaming: true,
		systemPrompt: 'You are PAI, a helpful AI development assistant.',
		knowledgeBases: ['paytheory', 'svelte-docs'],
	});

	const availableModels = [
		{ id: 'gpt-4', name: 'GPT-4' },
		{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
		{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
		{ id: 'claude-3-opus', name: 'Claude 3 Opus' },
		{ id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
	];

	const availableKnowledgeBases = [
		{ id: 'paytheory', name: 'Pay Theory', description: 'Payment processing documentation' },
		{ id: 'svelte-docs', name: 'Svelte Docs', description: 'Svelte framework documentation' },
		{ id: 'typescript', name: 'TypeScript', description: 'TypeScript language reference' },
	];

	const suggestions = [
		'What is PAI?',
		'How do I create a scope?',
		'Show me an example workflow',
		'What knowledgebases are available?',
	];

	// ============================================
	// Simulated Streaming Response
	// ============================================
	const streamingResponses = [
		`Great question! Here's a quick overview of the available knowledge bases:

1. **Pay Theory** - Payment processing APIs and integration guides
2. **Svelte Docs** - Component patterns and reactivity
3. **TypeScript** - Type system and language features

Each knowledge base can be enabled in settings to provide contextual assistance.`,
		`To create a new workflow, you can use the following pattern:

\`\`\`typescript
import { createWorkflow } from '@pai/core';

const workflow = createWorkflow({
  name: 'code-review',
  steps: [
    { action: 'analyze', target: 'src/**/*.ts' },
    { action: 'suggest', type: 'improvements' },
    { action: 'generate', output: 'report.md' },
  ],
});

await workflow.execute();
\`\`\`

This will analyze your TypeScript files and generate improvement suggestions.`,
	];

	async function simulateStreaming(content: string): Promise<void> {
		isStreaming = true;
		streamContent = '';
		connectionStatus = 'connected';

		// Add placeholder assistant message
		const assistantMessage: ChatMessage = {
			id: `msg_${Date.now()}`,
			role: 'assistant',
			content: '',
			timestamp: new Date(),
			status: 'streaming',
		};
		messages = [...messages, assistantMessage];

		// Simulate character-by-character streaming
		const chars = content.split('');
		for (let i = 0; i < chars.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 15 + Math.random() * 25));
			streamContent += chars[i];

			// Update the message content
			messages = messages.map((msg) =>
				msg.id === assistantMessage.id ? { ...msg, content: streamContent } : msg
			);
		}

		// Mark message as complete
		messages = messages.map((msg) =>
			msg.id === assistantMessage.id ? { ...msg, status: 'complete' as const } : msg
		);

		isStreaming = false;
		streamContent = '';
	}

	// ============================================
	// Event Handlers
	// ============================================
	const handlers: ChatHandlers = {
		onSubmit: async (content: string) => {
			// Add user message
			const userMessage: ChatMessage = {
				id: `msg_${Date.now()}`,
				role: 'user',
				content,
				timestamp: new Date(),
				status: 'complete',
			};
			messages = [...messages, userMessage];

			// Simulate response
			const responseIndex = Math.floor(Math.random() * streamingResponses.length);
			await simulateStreaming(streamingResponses[responseIndex]);
		},
		onClear: () => {
			messages = [];
			streamContent = '';
			isStreaming = false;
		},
		onSettingsChange: (newSettings: ChatSettingsState) => {
			settings = newSettings;
		},
		onStopStreaming: () => {
			isStreaming = false;
		},
	};

	function handleSuggestionSelect(suggestion: string) {
		handlers.onSubmit?.(suggestion);
	}

	function handleClearConversation() {
		handlers.onClear?.();
	}

	function toggleEmptyState() {
		showEmptyState = !showEmptyState;
		if (showEmptyState) {
			messages = [];
		} else {
			messages = [...initialMessages];
		}
	}

	function addToolCallDemo() {
		const demoMessage: ChatMessage = {
			id: `msg_${Date.now()}`,
			role: 'assistant',
			content: 'Let me search for that information...',
			timestamp: new Date(),
			status: 'complete',
			toolCalls: [
				{
					id: `tc_${Date.now()}_1`,
					tool: 'query_knowledge',
					args: { query: 'component patterns', limit: 5 },
					status: 'pending',
				},
				{
					id: `tc_${Date.now()}_2`,
					tool: 'read_file',
					args: { path: 'src/lib/components/Button.svelte' },
					status: 'running',
				},
				{
					id: `tc_${Date.now()}_3`,
					tool: 'search_files',
					args: { pattern: '*.test.ts' },
					result: { files: ['Button.test.ts', 'Modal.test.ts'], count: 2 },
					status: 'complete',
				},
			],
		};
		messages = [...messages, demoMessage];
	}

	// ============================================
	// Code Examples
	// ============================================
	const basicUsageSnippet =
		`
<` +
		`script>
  import * as Chat from '@equaltoai/greater-components-chat';

  const handlers = {
    onSubmit: async (content) => {
      // Send message to your AI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      });
      return response.json();
    },
  };
</` +
		`script>

<Chat.Container {handlers}>
  <Chat.Header title="AI Assistant" connectionStatus="connected" />
  <Chat.Messages />
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>`;

	const withSuggestionsSnippet = `
<Chat.Container {handlers}>
  <Chat.Header title="PAI Demo" />
  <Chat.Messages />
  {#if messages.length === 0}
    <Chat.Suggestions
      suggestions={[
        "What is PAI?",
        "How do I create a scope?",
        "Show me an example workflow"
      ]}
      onSelect={(suggestion) => handlers.onSubmit(suggestion)}
    />
  {/if}
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>`;

	const withSettingsSnippet =
		`
<` +
		`script>
  import * as Chat from '@equaltoai/greater-components-chat';
  
  let showSettings = $state(false);
  let settings = $state({
    model: 'gpt-4',
    temperature: 0.7,
    streaming: true,
  });
</` +
		`script>

<Chat.Container {handlers}>
  <Chat.Header
    title="PAI Demo"
    showSettingsButton={true}
    onSettings={() => showSettings = true}
  />
  <Chat.Messages />
  <Chat.Input onSend={(content) => handlers.onSubmit(content)} />
</Chat.Container>

<Chat.Settings
  bind:open={showSettings}
  {settings}
  availableModels={[
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-3', name: 'Claude 3' },
  ]}
  onSettingsChange={(s) => settings = s}
/>`;

	const toolCallSnippet = `
<!-- Tool calls are displayed within assistant messages -->
<Chat.Message
  message={{
    id: '1',
    role: 'assistant',
    content: 'Searching for information...',
    timestamp: new Date(),
    status: 'complete',
    toolCalls: [
      {
        id: 'tc_1',
        tool: 'query_knowledge',
        args: { query: 'search term' },
        status: 'running',
      },
      {
        id: 'tc_2',
        tool: 'read_file',
        args: { path: 'src/index.ts' },
        result: { content: '...' },
        status: 'complete',
      },
    ],
  }}
/>

<!-- Or use Chat.ToolCallDisplay directly -->
<Chat.ToolCallDisplay
  toolCall={{
    id: 'tc_1',
    tool: 'search_files',
    args: { pattern: '*.svelte' },
    result: { files: ['Button.svelte'] },
    status: 'complete',
  }}
  showResult={true}
  collapsible={true}
/>`;

	const accessibilityGuidance = [
		'The chat container uses `role="region"` with `aria-label="Chat conversation"` for screen reader navigation.',
		'Messages are announced via `aria-live="polite"` to notify users of new content.',
		'Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to cancel streaming.',
		'Connection status is conveyed via both visual indicators and `aria-label` attributes.',
		'Tool call status changes are announced to assistive technologies.',
	];
</script>

<DemoPage
	eyebrow="AI Interface"
	title="Chat Components"
	description="AI chat interface components for building conversational UIs with streaming responses, tool calls, and configurable settings."
>
	{#snippet actions()}
		<Button variant="outline" size="sm" onclick={toggleEmptyState}>
			{showEmptyState ? 'Show Messages' : 'Show Empty State'}
		</Button>
		<Button variant="outline" size="sm" onclick={addToolCallDemo}>Add Tool Call Demo</Button>
	{/snippet}

	<!-- Section 1: Full Chat Interface -->
	<section class="chat-section">
		<header>
			<p class="section-eyebrow">01 · Full Chat Interface</p>
			<h2>Complete chat experience with all components</h2>
			<p>
				The chat interface combines <code>Chat.Container</code>, <code>Chat.Header</code>,
				<code>Chat.Messages</code>, <code>Chat.Suggestions</code>, and <code>Chat.Input</code>
				to create a full conversational UI. Try sending a message to see the simulated streaming response.
			</p>
		</header>

		<div class="chat-demo-container">
			<Chat.Container
				{handlers}
				{messages}
				streaming={isStreaming}
				{streamContent}
				{connectionStatus}
				class="chat-demo"
			>
				<Chat.Header
					title="PAI Demo"
					subtitle="Powered by Greater Components"
					{connectionStatus}
					showClearButton={true}
					showSettingsButton={true}
					onClear={handleClearConversation}
					onSettings={() => (showSettings = true)}
				/>

				<Chat.Messages showAvatars={true} />

				{#if messages.length === 0}
					<Chat.Suggestions {suggestions} onSelect={handleSuggestionSelect} variant="cards" />
				{/if}

				<Chat.Input
					placeholder="Ask PAI anything..."
					disabled={isStreaming}
					showFileUpload={false}
					onSend={(content) => handlers.onSubmit?.(content)}
				/>
			</Chat.Container>
		</div>

		<CodeExample
			title="Basic Chat Setup"
			description="Import and configure the chat components"
			code={basicUsageSnippet}
		/>
	</section>

	<!-- Section 2: Suggestions -->
	<section class="chat-section">
		<header>
			<p class="section-eyebrow">02 · Quick Suggestions</p>
			<h2>Prompt suggestions for empty state</h2>
			<p>
				<code>Chat.Suggestions</code> displays clickable prompts to help users get started. Supports
				both <code>pills</code> (horizontal) and <code>cards</code> (grid) variants.
			</p>
		</header>

		<div class="suggestions-demo">
			<div class="suggestions-variant">
				<h3>Pills Variant (default)</h3>
				<Chat.Suggestions
					{suggestions}
					onSelect={(s) => console.log('Selected:', s)}
					variant="pills"
				/>
			</div>

			<div class="suggestions-variant">
				<h3>Cards Variant</h3>
				<Chat.Suggestions
					suggestions={[
						{ text: 'What is PAI?', description: 'Learn about the AI assistant' },
						{ text: 'Create a scope', description: 'Define context for your project' },
						{ text: 'Example workflow', description: 'See automation in action' },
						{ text: 'Knowledge bases', description: 'Explore available documentation' },
					]}
					onSelect={(s) => console.log('Selected:', s)}
					variant="cards"
				/>
			</div>
		</div>

		<CodeExample
			title="Suggestions with empty state"
			description="Show suggestions when conversation is empty"
			code={withSuggestionsSnippet}
		/>
	</section>

	<!-- Section 3: Tool Calls -->
	<section class="chat-section">
		<header>
			<p class="section-eyebrow">03 · Tool Call Display</p>
			<h2>AI tool invocations with status indicators</h2>
			<p>
				<code>Chat.ToolCallDisplay</code> displays tool/function calls during AI responses with collapsible
				results, status indicators, and syntax-highlighted arguments.
			</p>
		</header>

		<div class="tool-calls-demo">
			<div class="tool-call-item">
				<h3>Pending</h3>
				<Chat.ToolCallDisplay
					toolCall={{
						id: 'demo_pending',
						tool: 'query_knowledge',
						args: { query: 'component patterns', knowledgeBase: 'svelte-docs' },
						status: 'pending',
					}}
				/>
			</div>

			<div class="tool-call-item">
				<h3>Running</h3>
				<Chat.ToolCallDisplay
					toolCall={{
						id: 'demo_running',
						tool: 'search_files',
						args: { pattern: '**/*.svelte', path: 'src/lib' },
						status: 'running',
					}}
				/>
			</div>

			<div class="tool-call-item">
				<h3>Complete</h3>
				<Chat.ToolCallDisplay
					toolCall={{
						id: 'demo_complete',
						tool: 'read_file',
						args: { path: 'src/lib/Button.svelte', limit: 50 },
						result: {
							content: '// Svelte component content\nexport let variant = "solid";',
							lines: 50,
						},
						status: 'complete',
					}}
					showResult={true}
					collapsible={true}
				/>
			</div>

			<div class="tool-call-item">
				<h3>Error</h3>
				<Chat.ToolCallDisplay
					toolCall={{
						id: 'demo_error',
						tool: 'execute_command',
						args: { command: 'npm run build' },
						status: 'error',
						error: 'Command failed with exit code 1',
					}}
				/>
			</div>
		</div>

		<CodeExample
			title="Tool Call Usage"
			description="Display tool calls within messages or standalone"
			code={toolCallSnippet}
		/>
	</section>

	<!-- Section 4: Settings Modal -->
	<section class="chat-section">
		<header>
			<p class="section-eyebrow">04 · Settings Configuration</p>
			<h2>Chat settings modal with model selection</h2>
			<p>
				<code>Chat.Settings</code> provides a configuration modal for model selection, temperature, max
				tokens, system prompt, and knowledge base toggles.
			</p>
		</header>

		<div class="settings-demo">
			<div class="settings-preview">
				<h3>Current Settings</h3>
				<dl class="settings-list">
					<dt>Model</dt>
					<dd>{settings.model}</dd>
					<dt>Temperature</dt>
					<dd>{settings.temperature}</dd>
					<dt>Max Tokens</dt>
					<dd>{settings.maxTokens}</dd>
					<dt>Streaming</dt>
					<dd>{settings.streaming ? 'Enabled' : 'Disabled'}</dd>
					<dt>Knowledge Bases</dt>
					<dd>{settings.knowledgeBases?.join(', ') || 'None'}</dd>
				</dl>
				<Button onclick={() => (showSettings = true)}>Open Settings</Button>
			</div>
		</div>

		<CodeExample
			title="Settings Integration"
			description="Add settings button to header and handle changes"
			code={withSettingsSnippet}
		/>
	</section>

	<!-- Section 5: Accessibility -->
	<section class="chat-section">
		<header>
			<p class="section-eyebrow">05 · Accessibility</p>
			<h2>ARIA roles + keyboard navigation</h2>
		</header>
		<ul class="guidance-list">
			{#each accessibilityGuidance as tip (tip)}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>
</DemoPage>

<!-- Settings Modal -->
<Chat.Settings
	bind:open={showSettings}
	{settings}
	{availableModels}
	{availableKnowledgeBases}
	onSettingsChange={(s) => (settings = s)}
	onSave={(s) => {
		settings = s;
		showSettings = false;
	}}
	onClose={() => (showSettings = false)}
/>

<style>
	.chat-section {
		padding: 2.25rem;
		border-radius: var(--gr-radii-2xl);
		border: 1px solid var(--gr-semantic-border-default);
		background: var(--gr-semantic-background-primary);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin-bottom: 0.35rem;
	}

	.chat-section h2 {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xl);
		font-weight: var(--gr-typography-fontWeight-semibold);
	}

	.chat-section h3 {
		margin: 0 0 0.5rem;
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.chat-demo-container {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		overflow: hidden;
		height: 500px;
		display: flex;
		flex-direction: column;
	}

	:global(.chat-demo) {
		height: 100%;
	}

	.suggestions-demo {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.suggestions-variant {
		padding: 1rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
	}

	.tool-calls-demo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.tool-call-item {
		padding: 1rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
	}

	.settings-demo {
		display: flex;
		gap: 1.5rem;
	}

	.settings-preview {
		flex: 1;
		padding: 1.5rem;
		background: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-lg);
	}

	.settings-list {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		margin: 1rem 0;
	}

	.settings-list dt {
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-semantic-foreground-secondary);
	}

	.settings-list dd {
		margin: 0;
		color: var(--gr-semantic-foreground-primary);
	}

	.guidance-list {
		margin: 0;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.guidance-list li {
		color: var(--gr-semantic-foreground-secondary);
	}

	@media (max-width: 720px) {
		.chat-section {
			padding: 1.5rem;
		}

		.chat-demo-container {
			height: 400px;
		}

		.tool-calls-demo {
			grid-template-columns: 1fr;
		}

		.settings-demo {
			flex-direction: column;
		}
	}
</style>
