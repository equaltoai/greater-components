<!--
  ChatToolCall - Tool/Function Call Display Component
  
  Displays AI tool invocations during responses with collapsible card,
  status indicators, and syntax-highlighted arguments/results.
  
  @component
  @example
  ```svelte
  <ChatToolCall 
    toolCall={{ 
      id: '1',
      tool: 'query_knowledge', 
      args: { query: "search term" },
      result: "Found 3 results...",
      status: 'complete'
    }}
  />
  ```
-->
<script lang="ts">
	import { Card, Badge } from '@equaltoai/greater-components-primitives';
	import { CodeBlock } from '@equaltoai/greater-components-content';
	import {
		BookIcon,
		SearchIcon,
		FileIcon,
		FolderIcon,
		CodeIcon,
		SettingsIcon,
		CheckCircleIcon,
		XCircleIcon,
		ClockIcon,
		RefreshCwIcon,
		ChevronDownIcon,
		ChevronRightIcon,
	} from '@equaltoai/greater-components-icons';
	import type { ToolCall } from './types.js';
	import { untrack } from 'svelte';

	/**
	 * ChatToolCall component props
	 */
	interface Props {
		/**
		 * The tool call to display
		 */
		toolCall: ToolCall;

		/**
		 * Whether to show the result
		 * @default true
		 */
		showResult?: boolean;

		/**
		 * Whether the card is collapsible
		 * @default true
		 */
		collapsible?: boolean;

		/**
		 * Whether the result is initially collapsed
		 * @default true
		 */
		defaultCollapsed?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		toolCall,
		showResult = true,
		collapsible = true,
		defaultCollapsed = true,
		class: className = '',
	}: Props = $props();

	// Track expanded state
	let isExpanded = $state(untrack(() => !defaultCollapsed));

	// Track result expansion for long results
	let isResultExpanded = $state(false);

	// Maximum result length before truncation
	const MAX_RESULT_LENGTH = 300;

	// Map tool names to icons
	const toolIconMap: Record<string, typeof BookIcon> = {
		query_knowledge: BookIcon,
		search: SearchIcon,
		read_file: FileIcon,
		list_files: FolderIcon,
		file_search: FolderIcon,
		code_search: CodeIcon,
		grep: CodeIcon,
	};

	// Get the appropriate icon for the tool
	const ToolIcon = $derived(toolIconMap[toolCall.tool] || SettingsIcon);

	// Format tool name for display
	const displayName = $derived(
		toolCall.tool
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	);

	// Format arguments as JSON string
	const formattedArgs = $derived(toolCall.args ? JSON.stringify(toolCall.args, null, 2) : null);

	// Get result as string
	const resultString = $derived.by(() => {
		if (!toolCall.result) return null;
		if (typeof toolCall.result === 'string') return toolCall.result;
		return JSON.stringify(toolCall.result, null, 2);
	});

	// Check if result needs truncation
	const needsTruncation = $derived(resultString && resultString.length > MAX_RESULT_LENGTH);

	// Get truncated or full result
	const displayResult = $derived.by(() => {
		if (!resultString) return null;
		if (!needsTruncation || isResultExpanded) return resultString;
		return resultString.slice(0, MAX_RESULT_LENGTH) + '...';
	});

	// Detect if result looks like JSON
	const isJsonResult = $derived.by(() => {
		if (!resultString) return false;
		const trimmed = resultString.trim();
		return (
			(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
			(trimmed.startsWith('[') && trimmed.endsWith(']'))
		);
	});

	// Detect if result looks like code
	const isCodeResult = $derived.by(() => {
		if (!resultString) return false;
		return (
			resultString.includes('function ') ||
			resultString.includes('const ') ||
			resultString.includes('import ') ||
			resultString.includes('export ') ||
			resultString.includes('class ') ||
			resultString.includes('def ') ||
			resultString.includes('```')
		);
	});

	// Get result language for syntax highlighting
	const resultLanguage = $derived.by(() => {
		if (isJsonResult) return 'json';
		if (isCodeResult) return 'typescript';
		return 'text';
	});

	// Compute container classes
	const containerClass = $derived.by(() => {
		const classes = [
			'chat-tool-call',
			`chat-tool-call--${toolCall.status}`,
			collapsible && 'chat-tool-call--collapsible',
			isExpanded && 'chat-tool-call--expanded',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Handle toggle
	function handleToggle() {
		if (collapsible) {
			isExpanded = !isExpanded;
		}
	}

	// Handle keyboard toggle
	function handleKeydown(event: KeyboardEvent) {
		if (collapsible && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			isExpanded = !isExpanded;
		}
	}
</script>

<div class={containerClass}>
	<Card variant="outlined" padding="sm">
		<!-- Header - Always visible -->
		<button
			class="chat-tool-call__header"
			onclick={handleToggle}
			onkeydown={handleKeydown}
			aria-expanded={collapsible ? isExpanded : undefined}
			aria-controls={collapsible ? `tool-call-content-${toolCall.id}` : undefined}
			disabled={!collapsible}
			type="button"
		>
			<!-- Expand/Collapse indicator -->
			{#if collapsible}
				<span class="chat-tool-call__toggle" aria-hidden="true">
					{#if isExpanded}
						<ChevronDownIcon size={14} />
					{:else}
						<ChevronRightIcon size={14} />
					{/if}
				</span>
			{/if}

			<!-- Tool icon and name -->
			<span class="chat-tool-call__tool-info">
				<span class="chat-tool-call__icon" aria-hidden="true">
					<ToolIcon size={14} />
				</span>
				<Badge variant="filled" color="gray" label={displayName} />
			</span>

			<!-- Status indicator -->
			<span class="chat-tool-call__status" aria-label={`Status: ${toolCall.status}`}>
				{#if toolCall.status === 'pending'}
					<span class="chat-tool-call__status-icon chat-tool-call__status-icon--pending">
						<ClockIcon size={14} />
					</span>
				{:else if toolCall.status === 'running'}
					<span class="chat-tool-call__status-icon chat-tool-call__status-icon--running">
						<RefreshCwIcon size={14} />
					</span>
				{:else if toolCall.status === 'complete'}
					<span class="chat-tool-call__status-icon chat-tool-call__status-icon--complete">
						<CheckCircleIcon size={14} />
					</span>
				{:else if toolCall.status === 'error'}
					<span class="chat-tool-call__status-icon chat-tool-call__status-icon--error">
						<XCircleIcon size={14} />
					</span>
				{/if}
			</span>
		</button>

		<!-- Expandable content -->
		{#if !collapsible || isExpanded}
			<div
				id={collapsible ? `tool-call-content-${toolCall.id}` : undefined}
				class="chat-tool-call__content"
			>
				<!-- Arguments section -->
				{#if formattedArgs}
					<div class="chat-tool-call__section">
						<span class="chat-tool-call__section-label">Arguments</span>
						<div class="chat-tool-call__code-wrapper">
							<CodeBlock
								code={formattedArgs}
								language="json"
								showCopy={false}
								showLineNumbers={false}
							/>
						</div>
					</div>
				{/if}

				<!-- Result section -->
				{#if showResult && (resultString || toolCall.error)}
					<div class="chat-tool-call__section">
						<span class="chat-tool-call__section-label">
							{toolCall.error ? 'Error' : 'Result'}
						</span>

						{#if toolCall.error}
							<div class="chat-tool-call__error">
								{toolCall.error}
							</div>
						{:else if displayResult}
							<div class="chat-tool-call__result-wrapper">
								{#if isJsonResult || isCodeResult}
									<div class="chat-tool-call__code-wrapper">
										<CodeBlock
											code={displayResult}
											language={resultLanguage}
											showCopy={false}
											showLineNumbers={false}
										/>
									</div>
								{:else}
									<div class="chat-tool-call__result-text">
										{displayResult}
									</div>
								{/if}

								<!-- Show more/less button for long results -->
								{#if needsTruncation}
									<button
										class="chat-tool-call__show-more"
										onclick={() => (isResultExpanded = !isResultExpanded)}
										type="button"
									>
										{isResultExpanded ? 'Show less' : 'Show more'}
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</Card>
</div>

<style>
	/* Base container styles */
	.chat-tool-call {
		margin: var(--gr-spacing-scale-2, 0.5rem) 0;
		font-size: var(--gr-typography-fontSize-sm, 0.875rem);
	}

	/* Header styles */
	.chat-tool-call__header {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2, 0.5rem);
		width: 100%;
		padding: 0;
		margin: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		color: inherit;
		font: inherit;
	}

	.chat-tool-call__header:disabled {
		cursor: default;
	}

	.chat-tool-call__header:not(:disabled):hover {
		opacity: 0.8;
	}

	.chat-tool-call__header:focus-visible {
		outline: 2px solid var(--gr-color-primary-500, #3b82f6);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm, 0.125rem);
	}

	/* Toggle indicator */
	.chat-tool-call__toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gr-color-gray-500, #6b7280);
		flex-shrink: 0;
	}

	/* Tool info */
	.chat-tool-call__tool-info {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2, 0.5rem);
		flex: 1;
		min-width: 0;
	}

	.chat-tool-call__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gr-color-gray-500, #6b7280);
	}

	/* Status indicator */
	.chat-tool-call__status {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.chat-tool-call__status-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat-tool-call__status-icon--pending {
		color: var(--gr-color-gray-400, #9ca3af);
	}

	.chat-tool-call__status-icon--running {
		color: var(--gr-color-primary-500, #3b82f6);
		animation: spin 1s linear infinite;
	}

	.chat-tool-call__status-icon--complete {
		color: var(--gr-color-success-500, #22c55e);
	}

	.chat-tool-call__status-icon--error {
		color: var(--gr-color-error-500, #ef4444);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Content area */
	.chat-tool-call__content {
		margin-top: var(--gr-spacing-scale-3, 0.75rem);
		padding-top: var(--gr-spacing-scale-3, 0.75rem);
		border-top: 1px solid var(--gr-color-gray-200, #e5e7eb);
		animation: content-enter 0.2s ease-out;
	}

	@keyframes content-enter {
		from {
			opacity: 0;
			transform: translateY(-0.25rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Section styles */
	.chat-tool-call__section {
		margin-bottom: var(--gr-spacing-scale-3, 0.75rem);
	}

	.chat-tool-call__section:last-child {
		margin-bottom: 0;
	}

	.chat-tool-call__section-label {
		display: block;
		font-size: var(--gr-typography-fontSize-xs, 0.75rem);
		font-weight: var(--gr-typography-fontWeight-medium, 500);
		color: var(--gr-color-gray-500, #6b7280);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--gr-spacing-scale-1, 0.25rem);
	}

	/* Code wrapper */
	.chat-tool-call__code-wrapper {
		border-radius: var(--gr-radii-md, 0.375rem);
		overflow: hidden;
		max-height: 150px;
		overflow-y: auto;
	}

	.chat-tool-call__code-wrapper :global(.gr-code-block) {
		margin: 0;
		font-size: var(--gr-typography-fontSize-xs, 0.75rem);
	}

	/* Result text (non-code) */
	.chat-tool-call__result-text {
		padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
		background-color: var(--gr-color-gray-50, #f9fafb);
		border-radius: var(--gr-radii-md, 0.375rem);
		font-family: var(--gr-typography-fontFamily-mono, monospace);
		font-size: var(--gr-typography-fontSize-xs, 0.75rem);
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--gr-color-gray-700, #374151);
		max-height: 200px;
		overflow-y: auto;
	}

	/* Error display */
	.chat-tool-call__error {
		padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-3, 0.75rem);
		background-color: var(--gr-color-error-50, #fef2f2);
		border: 1px solid var(--gr-color-error-200, #fecaca);
		border-radius: var(--gr-radii-md, 0.375rem);
		color: var(--gr-color-error-700, #b91c1c);
		font-size: var(--gr-typography-fontSize-xs, 0.75rem);
		line-height: 1.5;
	}

	/* Show more button */
	.chat-tool-call__show-more {
		display: inline-block;
		margin-top: var(--gr-spacing-scale-2, 0.5rem);
		padding: 0;
		background: transparent;
		border: none;
		color: var(--gr-color-primary-600, #2563eb);
		font-size: var(--gr-typography-fontSize-xs, 0.75rem);
		font-weight: var(--gr-typography-fontWeight-medium, 500);
		cursor: pointer;
		text-decoration: none;
	}

	.chat-tool-call__show-more:hover {
		text-decoration: underline;
	}

	.chat-tool-call__show-more:focus-visible {
		outline: 2px solid var(--gr-color-primary-500, #3b82f6);
		outline-offset: 2px;
		border-radius: var(--gr-radii-sm, 0.125rem);
	}

	/* Dark mode styles */
	:global([data-theme='dark']) .chat-tool-call__content {
		border-top-color: var(--gr-color-gray-700, #374151);
	}

	:global([data-theme='dark']) .chat-tool-call__result-text {
		background-color: var(--gr-color-gray-800, #1f2937);
		color: var(--gr-color-gray-200, #e5e7eb);
	}

	:global([data-theme='dark']) .chat-tool-call__error {
		background-color: var(--gr-color-error-950, #450a0a);
		border-color: var(--gr-color-error-800, #991b1b);
		color: var(--gr-color-error-200, #fecaca);
	}

	:global([data-theme='dark']) .chat-tool-call__toggle,
	:global([data-theme='dark']) .chat-tool-call__icon,
	:global([data-theme='dark']) .chat-tool-call__section-label {
		color: var(--gr-color-gray-400, #9ca3af);
	}

	:global([data-theme='dark']) .chat-tool-call__status-icon--pending {
		color: var(--gr-color-gray-500, #6b7280);
	}

	/* Responsive styles */
	@media (max-width: 640px) {
		.chat-tool-call {
			font-size: var(--gr-typography-fontSize-xs, 0.75rem);
		}

		.chat-tool-call__code-wrapper :global(.gr-code-block) {
			font-size: 0.6875rem;
		}
	}
</style>
