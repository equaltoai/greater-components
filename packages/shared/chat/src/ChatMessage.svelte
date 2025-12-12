<!--
  ChatMessage - Individual Chat Message Display Component
  
  Displays chat messages with role-based styling, markdown rendering,
  streaming support, and interactive features.
  
  @component
  @example
  ```svelte
  <ChatMessage 
    role="assistant" 
    content="Hello! How can I help you today?"
    streaming={false}
  />
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Avatar, CopyButton, Button } from '@equaltoai/greater-components-primitives';
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import { RefreshCwIcon } from '@equaltoai/greater-components-icons';
	import { formatMessageTime } from './context.svelte.js';
	import type { MessageRole } from './types.js';

	/**
	 * ChatMessage component props
	 */
	interface Props {
		/**
		 * Role of the message sender
		 */
		role: MessageRole;

		/**
		 * Message content (may be partial during streaming)
		 */
		content: string;

		/**
		 * Timestamp when the message was created
		 */
		timestamp?: Date;

		/**
		 * Avatar URL for the message sender
		 */
		avatar?: string;

		/**
		 * Whether to show the avatar
		 * @default true
		 */
		showAvatar?: boolean;

		/**
		 * Whether the message is currently streaming
		 * @default false
		 */
		streaming?: boolean;

		/**
		 * Message status for error handling
		 */
		status?: 'pending' | 'streaming' | 'complete' | 'error';

		/**
		 * Error message if status is 'error'
		 */
		error?: string;

		/**
		 * Whether to show the copy button for assistant messages
		 * @default true (for assistant messages)
		 */
		showCopyButton?: boolean;

		/**
		 * Whether to show the retry button for error states
		 * @default true (when status is 'error')
		 */
		showRetryButton?: boolean;

		/**
		 * Callback when retry button is clicked
		 */
		onRetry?: () => void;

		/**
		 * Custom actions snippet for additional message actions
		 */
		actions?: Snippet;

		/**
		 * Custom user avatar snippet
		 */
		userAvatar?: Snippet;

		/**
		 * Custom assistant avatar snippet
		 */
		assistantAvatar?: Snippet;

		/**
		 * Custom content renderer snippet
		 * Receives { content, streaming } as parameters
		 */
		renderContent?: Snippet<[{ content: string; streaming: boolean }]>;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		role,
		content,
		timestamp,
		avatar,
		showAvatar = true,
		streaming = false,
		status = 'complete',
		error,
		showCopyButton,
		showRetryButton,
		onRetry,
		actions,
		userAvatar,
		assistantAvatar,
		renderContent,
		class: className = '',
	}: Props = $props();

	// Track hover state for copy button visibility
	let isHovered = $state(false);

	// Compute effective showCopyButton (default true for assistant)
	const effectiveShowCopyButton = $derived(showCopyButton ?? role === 'assistant');

	// Compute effective showRetryButton (default true for error state)
	const effectiveShowRetryButton = $derived(showRetryButton ?? status === 'error');

	// Check if message has error
	const hasError = $derived(status === 'error');

	// Compute message classes
	const messageClass = $derived.by(() => {
		const classes = [
			'chat-message',
			`chat-message--${role}`,
			streaming && 'chat-message--streaming',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Avatar name for accessibility
	const avatarName = $derived.by(() => {
		switch (role) {
			case 'user':
				return 'User';
			case 'assistant':
				return 'AI Assistant';
			case 'system':
				return 'System';
			default:
				return 'Unknown';
		}
	});

	// Avatar label for display (short text for chat bubbles)
	const avatarLabel = $derived.by(() => {
		switch (role) {
			case 'user':
				return 'You';
			case 'assistant':
				return 'AI';
			case 'system':
				return 'Sys';
			default:
				return '?';
		}
	});
</script>

<div
	class={messageClass}
	role="article"
	aria-label={`${avatarName} message`}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{#if role !== 'system' && showAvatar}
		<div class="chat-message__avatar">
			{#if role === 'user' && userAvatar}
				{@render userAvatar()}
			{:else if role === 'assistant' && assistantAvatar}
				{@render assistantAvatar()}
			{:else}
				<Avatar
					src={avatar}
					name={avatarName}
					label={avatarLabel}
					fallbackMode="label"
					size="sm"
					shape="circle"
				/>
			{/if}
		</div>
	{/if}

	<div class="chat-message__content-wrapper">
		<div class="chat-message__bubble" class:chat-message__bubble--error={hasError}>
			{#if renderContent}
				<!-- Custom content renderer -->
				{@render renderContent({ content, streaming })}
			{:else if role === 'assistant'}
				<!-- Assistant messages use MarkdownRenderer -->
				<div class="chat-message__content">
					<MarkdownRenderer {content} sanitize={true} enableLinks={true} openLinksInNewTab={true} />
					{#if streaming}
						<span class="chat-message__cursor" aria-hidden="true"></span>
					{/if}
				</div>
			{:else if role === 'user'}
				<!-- User messages display plain text -->
				<div class="chat-message__content">
					{content}
				</div>
			{:else}
				<!-- System messages -->
				<div class="chat-message__content">
					{content}
				</div>
			{/if}

			{#if hasError && error}
				<div class="chat-message__error">
					<span class="chat-message__error-text">{error}</span>
				</div>
			{/if}
		</div>

		<!-- Message actions (visible on hover) -->
		<div
			class="chat-message__actions"
			class:chat-message__actions--visible={isHovered && !streaming}
		>
			{#if actions}
				{@render actions()}
			{/if}

			{#if effectiveShowCopyButton && content && !hasError}
				<CopyButton text={content} variant="icon" buttonVariant="ghost" size="sm" />
			{/if}

			{#if effectiveShowRetryButton && hasError && onRetry}
				<Button variant="ghost" size="sm" onclick={onRetry} aria-label="Retry message">
					{#snippet prefix()}
						<RefreshCwIcon size={14} />
					{/snippet}
				</Button>
			{/if}
		</div>

		{#if timestamp}
			<time class="chat-message__timestamp" datetime={timestamp.toISOString()}>
				{formatMessageTime(timestamp)}
			</time>
		{/if}
	</div>
</div>

<style>
	/* Base message styles */
	.chat-message {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		animation: message-enter 0.3s ease-out;
	}

	@keyframes message-enter {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chat-message__avatar {
		flex-shrink: 0;
	}

	.chat-message__content-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
		min-width: 0;
		max-width: 80%;
	}

	.chat-message__bubble {
		position: relative;
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
		border-radius: var(--gr-radii-lg);
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.chat-message__content {
		line-height: 1.5;
	}

	.chat-message__timestamp {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		padding-left: var(--gr-spacing-scale-1);
	}

	.chat-message__actions {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		margin-top: var(--gr-spacing-scale-1);
		opacity: 0;
		transition: opacity 0.15s ease-in-out;
	}

	.chat-message__actions--visible,
	.chat-message:hover .chat-message__actions {
		opacity: 1;
	}

	/* Position actions differently for user messages */
	.chat-message--user .chat-message__actions {
		justify-content: flex-end;
	}

	/* User message styles - Right aligned, primary background */
	.chat-message--user {
		flex-direction: row-reverse;
	}

	.chat-message--user .chat-message__content-wrapper {
		align-items: flex-end;
	}

	.chat-message--user .chat-message__bubble {
		background-color: var(--gr-color-primary-600);
		color: var(--gr-color-base-white);
		border-bottom-right-radius: var(--gr-radii-sm);
	}

	.chat-message--user .chat-message__timestamp {
		text-align: right;
		padding-right: var(--gr-spacing-scale-1);
		padding-left: 0;
	}

	/* Assistant message styles - Left aligned, outlined card */
	.chat-message--assistant {
		flex-direction: row;
	}

	.chat-message--assistant .chat-message__content-wrapper {
		align-items: flex-start;
	}

	.chat-message--assistant .chat-message__bubble {
		background-color: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
		color: var(--gr-semantic-foreground-primary);
		border-bottom-left-radius: var(--gr-radii-sm);
		box-shadow: var(--gr-shadows-sm);
	}

	/* System message styles - Centered, muted background */
	.chat-message--system {
		justify-content: center;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	.chat-message--system .chat-message__content-wrapper {
		align-items: center;
		max-width: 100%;
	}

	.chat-message--system .chat-message__bubble {
		background-color: var(--gr-semantic-background-tertiary);
		color: var(--gr-semantic-foreground-secondary);
		font-size: var(--gr-typography-fontSize-sm);
		text-align: center;
		border-radius: var(--gr-radii-full);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	/* Error state styles */
	.chat-message__bubble--error {
		border-color: var(--gr-color-error-500);
	}

	.chat-message__error {
		margin-top: var(--gr-spacing-scale-2);
		padding-top: var(--gr-spacing-scale-2);
		border-top: 1px solid var(--gr-semantic-border-subtle);
	}

	.chat-message__error-text {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-error-600);
	}

	/* Streaming cursor animation */
	.chat-message__cursor {
		display: inline-block;
		width: 2px;
		height: 1em;
		background-color: currentColor;
		margin-left: 2px;
		vertical-align: text-bottom;
		animation: cursor-blink 0.5s step-end infinite;
	}

	@keyframes cursor-blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* Streaming state */

	/* Dark mode is handled automatically via semantic tokens */
	/* No explicit dark mode overrides needed - semantic tokens adapt to theme */

	/* Responsive styles */
	@media (max-width: 640px) {
		.chat-message {
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
			gap: var(--gr-spacing-scale-2);
		}

		.chat-message__content-wrapper {
			max-width: 85%;
		}

		.chat-message__bubble {
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		}
	}

	/* Markdown content styling within assistant messages */
	.chat-message--assistant :global(.gr-markdown) {
		font-size: inherit;
		line-height: inherit;
	}

	.chat-message--assistant :global(.gr-markdown p) {
		margin: 0 0 var(--gr-spacing-scale-2) 0;
	}

	.chat-message--assistant :global(.gr-markdown p:last-child) {
		margin-bottom: 0;
	}

	.chat-message--assistant :global(.gr-markdown code) {
		background-color: var(--gr-semantic-background-tertiary);
		padding: 0.125rem 0.25rem;
		border-radius: var(--gr-radii-sm);
		font-size: 0.875em;
	}

	.chat-message--assistant :global(.gr-markdown pre) {
		background-color: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		padding: var(--gr-spacing-scale-3);
		border-radius: var(--gr-radii-md);
		overflow-x: auto;
		margin: var(--gr-spacing-scale-2) 0;
	}

	.chat-message--assistant :global(.gr-markdown pre code) {
		background-color: transparent;
		padding: 0;
	}
</style>
