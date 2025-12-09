<!--
  Chat.Container - Main Chat Container Component
  
  Provides the chat context and layout wrapper for all chat components.
  Handles auto-scroll, keyboard shortcuts, and responsive layout.
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Header title="AI Assistant" />
    <Chat.Messages />
    <Chat.Input />
  </Chat.Container>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { createChatContext } from './context.svelte.js';
	import type { ChatHandlers, ConnectionStatus } from './context.svelte.js';
	import type { ChatMessage, ChatSettingsState } from './types.js';

	/**
	 * ChatContainer component props
	 */
	interface Props {
		/**
		 * Chat event handlers
		 */
		handlers?: ChatHandlers;

		/**
		 * Initial messages to display
		 */
		messages?: ChatMessage[];

		/**
		 * Whether currently streaming a response
		 */
		streaming?: boolean;

		/**
		 * Current stream content (partial response)
		 */
		streamContent?: string;

		/**
		 * Loading state for the conversation
		 */
		loading?: boolean;

		/**
		 * Initial connection status
		 */
		connectionStatus?: ConnectionStatus;

		/**
		 * Initial settings
		 */
		initialSettings?: ChatSettingsState;

		/**
		 * Whether to auto-scroll to new messages
		 * @default true
		 */
		autoScroll?: boolean;

		/**
		 * Whether to enable keyboard shortcuts
		 * @default true
		 */
		enableKeyboardShortcuts?: boolean;

		/**
		 * Whether to use flex-based full-height layout
		 * @default false
		 */
		fillHeight?: boolean;

		/**
		 * Alias for fillHeight - enables flex-based full-height layout
		 * @default false
		 */
		flex?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let {
		handlers = {},
		messages = [],
		streaming = false,
		streamContent = '',
		loading = false,
		connectionStatus = 'disconnected',
		initialSettings = {},
		autoScroll = true,
		enableKeyboardShortcuts = true,
		fillHeight = false,
		flex = false,
		class: className = '',
		children,
	}: Props = $props();

	// Compute effective fillHeight (flex is alias)
	const effectiveFillHeight = $derived(fillHeight || flex);

	// Create chat context
	const context = createChatContext(handlers, initialSettings);

	// Container element reference for scrolling
	let containerRef: HTMLDivElement | undefined = $state();
	let messagesEndRef: HTMLDivElement | undefined = $state();

	// Sync external props with context state
	$effect(() => {
		if (messages.length > 0) {
			context.updateState({ messages });
		}
	});

	$effect(() => {
		context.updateState({ streaming, streamContent });
	});

	$effect(() => {
		context.updateState({ loading });
	});

	$effect(() => {
		context.setConnectionStatus(connectionStatus);
	});

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (autoScroll && context.state.messages.length > 0) {
			scrollToBottom();
		}
	});

	// Auto-scroll during streaming
	$effect(() => {
		if (autoScroll && context.state.streaming) {
			scrollToBottom();
		}
	});

	/**
	 * Scroll to the bottom of the messages container
	 */
	function scrollToBottom() {
		if (messagesEndRef) {
			messagesEndRef.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	}

	/**
	 * Handle keyboard shortcuts
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (!enableKeyboardShortcuts) return;

		// Escape to cancel streaming
		if (event.key === 'Escape' && context.state.streaming) {
			event.preventDefault();
			context.cancelStream();
		}

		// Ctrl/Cmd + Shift + Backspace to clear messages
		if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Backspace') {
			event.preventDefault();
			context.clearMessages();
		}
	}

	// Set up global keyboard listener
	onMount(() => {
		if (enableKeyboardShortcuts) {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (enableKeyboardShortcuts) {
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	// Compute container classes using $derived.by for complex logic
	const containerClass = $derived.by(() => {
		const classes = [
			'chat-container',
			effectiveFillHeight && 'chat-container--fill-height',
			context.state.streaming && 'chat-container--streaming',
			context.state.loading && 'chat-container--loading',
			context.state.error && 'chat-container--error',
			context.state.connectionStatus === 'connected' && 'chat-container--connected',
			context.state.connectionStatus === 'connecting' && 'chat-container--connecting',
			context.state.connectionStatus === 'error' && 'chat-container--connection-error',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});
</script>

<div
	bind:this={containerRef}
	class={containerClass}
	role="region"
	aria-label="Chat conversation"
	aria-live="polite"
>
	<div class="chat-container__inner">
		{#if children}
			{@render children()}
		{/if}

		<!-- Scroll anchor for auto-scroll -->
		<div bind:this={messagesEndRef} class="chat-container__scroll-anchor" aria-hidden="true"></div>
	</div>

	<!-- Connection status indicator -->
	{#if context.state.connectionStatus !== 'connected' && context.state.connectionStatus !== 'disconnected'}
		<div class="chat-container__status" role="status">
			{#if context.state.connectionStatus === 'connecting'}
				<span class="chat-container__status-indicator chat-container__status-indicator--connecting"
				></span>
				<span>Connecting...</span>
			{:else if context.state.connectionStatus === 'error'}
				<span class="chat-container__status-indicator chat-container__status-indicator--error"
				></span>
				<span>Connection error</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		background-color: var(--gr-semantic-background-primary);
		border-radius: var(--gr-radii-lg);
		overflow: hidden;
		position: relative;
	}

	/* Fill height variant - uses flex to fill available space */
	.chat-container--fill-height {
		flex: 1;
		height: auto;
		min-height: 100%;
	}

	.chat-container__inner {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		scroll-behavior: smooth;
	}

	.chat-container__scroll-anchor {
		height: 1px;
		flex-shrink: 0;
	}

	/* Connection status indicator */
	.chat-container__status {
		position: absolute;
		top: var(--gr-spacing-scale-2);
		right: var(--gr-spacing-scale-2);
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background-color: var(--gr-semantic-background-secondary);
		border-radius: var(--gr-radii-full);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-semantic-foreground-secondary);
		z-index: 10;
	}

	.chat-container__status-indicator {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: var(--gr-radii-full);
	}

	.chat-container__status-indicator--connecting {
		background-color: var(--gr-color-warning-500);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.chat-container__status-indicator--error {
		background-color: var(--gr-color-error-500);
	}

	/* Loading state */
	.chat-container--loading::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--gr-color-primary-500), transparent);
		animation: loading-bar 1.5s ease-in-out infinite;
	}

	/* Streaming state */
	.chat-container--streaming {
		/* Visual indicator that streaming is active */
	}

	/* Error state */
	.chat-container--error {
		border-color: var(--gr-color-error-300);
	}

	/* Animations */
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes loading-bar {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* Dark mode handled via semantic tokens - no explicit override needed */

	/* Mobile responsive */
	@media (max-width: 640px) {
		.chat-container {
			border-radius: 0;
		}

		.chat-container__status {
			top: var(--gr-spacing-scale-1);
			right: var(--gr-spacing-scale-1);
			padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
			font-size: var(--gr-typography-fontSize-xs);
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.chat-container__inner {
			scroll-behavior: auto;
		}

		.chat-container__status-indicator--connecting {
			animation: none;
		}

		.chat-container--loading::after {
			animation: none;
		}
	}
</style>
