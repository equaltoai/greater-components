<!--
  ChatMessages - Scrollable Message List Container
  
  Provides a scrollable container for the message list with auto-scroll behavior,
  scroll-to-bottom button, and empty state handling.
  
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
	import { onMount } from 'svelte';
	import { getChatContext } from './context.svelte.js';
	import { ArrowDownIcon } from '@equaltoai/greater-components-icons';
	import { Button } from '@equaltoai/greater-components-primitives';
	import ChatMessage from './ChatMessage.svelte';

	/**
	 * ChatMessages component props
	 */
	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Custom content to render (overrides default message rendering)
		 */
		children?: Snippet;

		/**
		 * Custom empty state content
		 */
		emptyState?: Snippet;

		/**
		 * Welcome title for empty state
		 * @default "Welcome!"
		 */
		welcomeTitle?: string;

		/**
		 * Welcome message for empty state
		 * @default "How can I help you today?"
		 */
		welcomeMessage?: string;

		/**
		 * Suggestion prompts for empty state
		 */
		suggestions?: string[];

		/**
		 * Called when a suggestion is clicked
		 */
		onSuggestionClick?: (suggestion: string) => void;

		/**
		 * Whether to show avatars in messages
		 * @default true
		 */
		showAvatars?: boolean;

		/**
		 * Custom avatar URL for assistant messages
		 */
		assistantAvatar?: string;

		/**
		 * Custom avatar URL for user messages
		 */
		userAvatar?: string;

		/**
		 * Scroll threshold in pixels to consider "at bottom"
		 * @default 100
		 */
		scrollThreshold?: number;
	}

	let {
		class: className = '',
		children,
		emptyState,
		welcomeTitle = 'Welcome!',
		welcomeMessage = 'How can I help you today?',
		suggestions = [],
		onSuggestionClick,
		showAvatars = true,
		assistantAvatar,
		userAvatar,
		scrollThreshold = 100,
	}: Props = $props();

	// Get chat context
	const context = getChatContext();

	// Container element reference
	let containerRef: HTMLDivElement | undefined = $state();
	let messagesEndRef: HTMLDivElement | undefined = $state();

	// Scroll state
	let isAtBottom = $state(true);
	let showScrollButton = $state(false);
	let previousMessageCount = $state(0);

	// Derived state
	const messages = $derived(context.state.messages);
	const loading = $derived(context.state.loading);
	const streaming = $derived(context.state.streaming);
	const hasMessages = $derived(messages.length > 0);
	const isInitialLoading = $derived(loading && messages.length === 0);

	/**
	 * Check if scroll position is at bottom
	 */
	function checkIsAtBottom(): boolean {
		if (!containerRef) return true;
		const { scrollTop, scrollHeight, clientHeight } = containerRef;
		return scrollHeight - scrollTop - clientHeight <= scrollThreshold;
	}

	/**
	 * Scroll to bottom of container
	 */
	function scrollToBottom(smooth = true) {
		if (messagesEndRef) {
			messagesEndRef.scrollIntoView({
				behavior: smooth ? 'smooth' : 'instant',
				block: 'end',
			});
		}
	}

	/**
	 * Handle scroll events
	 */
	function handleScroll() {
		const atBottom = checkIsAtBottom();
		isAtBottom = atBottom;
		showScrollButton = !atBottom && hasMessages;
	}

	/**
	 * Handle scroll-to-bottom button click
	 */
	function handleScrollToBottomClick() {
		scrollToBottom(true);
		showScrollButton = false;
	}

	// Auto-scroll when new messages arrive (only if at bottom)
	$effect(() => {
		const currentCount = messages.length;
		if (currentCount > previousMessageCount) {
			// New message arrived
			if (isAtBottom) {
				// Use requestAnimationFrame to ensure DOM is updated
				requestAnimationFrame(() => {
					scrollToBottom(true);
				});
			}
		}
		previousMessageCount = currentCount;
	});

	// Auto-scroll during streaming (only if at bottom)
	$effect(() => {
		if (streaming && isAtBottom) {
			requestAnimationFrame(() => {
				scrollToBottom(false);
			});
		}
	});

	// Initial scroll to bottom on mount
	onMount(() => {
		if (hasMessages) {
			scrollToBottom(false);
		}
	});

	// Compute container classes
	const containerClass = $derived.by(() => {
		const classes = [
			'chat-messages',
			loading && 'chat-messages--loading',
			streaming && 'chat-messages--streaming',
			!hasMessages && 'chat-messages--empty',
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
	role="log"
	aria-label="Chat messages"
	aria-live="polite"
	aria-relevant="additions"
	onscroll={handleScroll}
>
	{#if isInitialLoading}
		<!-- Loading skeleton state -->
		<div class="chat-messages__loading">
			<div class="chat-messages__skeleton">
				<div class="chat-messages__skeleton-avatar"></div>
				<div class="chat-messages__skeleton-content">
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--short"></div>
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--medium"></div>
				</div>
			</div>
			<div class="chat-messages__skeleton chat-messages__skeleton--right">
				<div class="chat-messages__skeleton-content">
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--medium"></div>
				</div>
				<div class="chat-messages__skeleton-avatar"></div>
			</div>
			<div class="chat-messages__skeleton">
				<div class="chat-messages__skeleton-avatar"></div>
				<div class="chat-messages__skeleton-content">
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--long"></div>
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--short"></div>
					<div class="chat-messages__skeleton-line chat-messages__skeleton-line--medium"></div>
				</div>
			</div>
		</div>
	{:else if !hasMessages}
		<!-- Empty state -->
		{#if emptyState}
			{@render emptyState()}
		{:else}
			<div class="chat-messages__empty-state">
				<div class="chat-messages__empty-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
					</svg>
				</div>
				<h3 class="chat-messages__empty-title">{welcomeTitle}</h3>
				<p class="chat-messages__empty-message">{welcomeMessage}</p>

				{#if suggestions.length > 0}
					<div class="chat-messages__suggestions">
						{#each suggestions as suggestion (suggestion)}
							<button
								type="button"
								class="chat-messages__suggestion"
								onclick={() => onSuggestionClick?.(suggestion)}
							>
								{suggestion}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{:else}
		<!-- Message list -->
		<div class="chat-messages__list">
			{#if children}
				{@render children()}
			{:else}
				{#each messages as message (message.id)}
					<ChatMessage
						role={message.role}
						content={message.content}
						timestamp={message.timestamp}
						streaming={message.status === 'streaming'}
						avatar={message.role === 'assistant' ? assistantAvatar : userAvatar}
						showAvatar={showAvatars}
					/>
				{/each}
			{/if}
		</div>

		<!-- Scroll anchor -->
		<div bind:this={messagesEndRef} class="chat-messages__scroll-anchor" aria-hidden="true"></div>
	{/if}

	<!-- Scroll to bottom button -->
	{#if showScrollButton}
		<div class="chat-messages__scroll-button-wrapper">
			<Button
				variant="solid"
				size="sm"
				class="chat-messages__scroll-button"
				onclick={handleScrollToBottomClick}
				aria-label="Scroll to bottom"
			>
				<ArrowDownIcon size={16} />
			</Button>
		</div>
	{/if}
</div>

<style>
	/* Container styles */
	.chat-messages {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		padding: var(--gr-spacing-scale-4, 1rem);
		scroll-behavior: smooth;
	}

	/* Custom scrollbar */
	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: var(--gr-semantic-background-secondary, #f3f4f6);
		border-radius: var(--gr-radii-full, 9999px);
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--gr-color-neutral-300, #d1d5db);
		border-radius: var(--gr-radii-full, 9999px);
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: var(--gr-color-neutral-400, #9ca3af);
	}

	/* Firefox scrollbar */
	.chat-messages {
		scrollbar-width: thin;
		scrollbar-color: var(--gr-color-neutral-300, #d1d5db)
			var(--gr-semantic-background-secondary, #f3f4f6);
	}

	/* Message list */
	.chat-messages__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2, 0.5rem);
	}

	/* Scroll anchor */
	.chat-messages__scroll-anchor {
		height: 1px;
		flex-shrink: 0;
	}

	/* Loading skeleton styles */
	.chat-messages__loading {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-4, 1rem);
		padding: var(--gr-spacing-scale-4, 1rem);
	}

	.chat-messages__skeleton {
		display: flex;
		gap: var(--gr-spacing-scale-3, 0.75rem);
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	.chat-messages__skeleton--right {
		justify-content: flex-end;
	}

	.chat-messages__skeleton-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: var(--gr-radii-full, 9999px);
		background: var(--gr-color-neutral-200, #e5e7eb);
		flex-shrink: 0;
	}

	.chat-messages__skeleton-content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2, 0.5rem);
		max-width: 60%;
	}

	.chat-messages__skeleton-line {
		height: 1rem;
		border-radius: var(--gr-radii-md, 0.375rem);
		background: var(--gr-color-neutral-200, #e5e7eb);
	}

	.chat-messages__skeleton-line--short {
		width: 4rem;
	}

	.chat-messages__skeleton-line--medium {
		width: 10rem;
	}

	.chat-messages__skeleton-line--long {
		width: 16rem;
	}

	@keyframes skeleton-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Empty state styles */
	.chat-messages__empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: var(--gr-spacing-scale-8, 2rem);
		text-align: center;
	}

	.chat-messages__empty-icon {
		width: 4rem;
		height: 4rem;
		margin-bottom: var(--gr-spacing-scale-4, 1rem);
		color: var(--gr-color-neutral-400, #9ca3af);
	}

	.chat-messages__empty-icon svg {
		width: 100%;
		height: 100%;
	}

	.chat-messages__empty-title {
		margin: 0 0 var(--gr-spacing-scale-2, 0.5rem);
		font-size: var(--gr-typography-fontSize-xl, 1.25rem);
		font-weight: var(--gr-typography-fontWeight-semibold, 600);
		color: var(--gr-semantic-foreground-primary, #111827);
	}

	.chat-messages__empty-message {
		margin: 0 0 var(--gr-spacing-scale-6, 1.5rem);
		font-size: var(--gr-typography-fontSize-base, 1rem);
		color: var(--gr-semantic-foreground-secondary, #6b7280);
	}

	/* Suggestions */
	.chat-messages__suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2, 0.5rem);
		justify-content: center;
		max-width: 32rem;
	}

	.chat-messages__suggestion {
		padding: var(--gr-spacing-scale-2, 0.5rem) var(--gr-spacing-scale-4, 1rem);
		font-size: var(--gr-typography-fontSize-sm, 0.875rem);
		color: var(--gr-color-primary-600, #2563eb);
		background: var(--gr-color-primary-50, #eff6ff);
		border: 1px solid var(--gr-color-primary-200, #bfdbfe);
		border-radius: var(--gr-radii-full, 9999px);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.chat-messages__suggestion:hover {
		background: var(--gr-color-primary-100, #dbeafe);
		border-color: var(--gr-color-primary-300, #93c5fd);
	}

	.chat-messages__suggestion:focus-visible {
		outline: 2px solid var(--gr-color-primary-500, #3b82f6);
		outline-offset: 2px;
	}

	/* Scroll to bottom button */
	.chat-messages__scroll-button-wrapper {
		position: absolute;
		bottom: var(--gr-spacing-scale-4, 1rem);
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		animation: fade-in 0.2s ease-out;
	}

	.chat-messages__scroll-button-wrapper :global(.chat-messages__scroll-button) {
		border-radius: var(--gr-radii-full, 9999px);
		box-shadow: var(
			--gr-shadow-lg,
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1)
		);
		padding: var(--gr-spacing-scale-2, 0.5rem);
		min-width: auto;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	/* Dark mode support */
	:global(.dark) .chat-messages::-webkit-scrollbar-track {
		background: var(--gr-semantic-background-secondary, #1f2937);
	}

	:global(.dark) .chat-messages::-webkit-scrollbar-thumb {
		background: var(--gr-color-neutral-600, #4b5563);
	}

	:global(.dark) .chat-messages::-webkit-scrollbar-thumb:hover {
		background: var(--gr-color-neutral-500, #6b7280);
	}

	:global(.dark) .chat-messages {
		scrollbar-color: var(--gr-color-neutral-600, #4b5563)
			var(--gr-semantic-background-secondary, #1f2937);
	}

	:global(.dark) .chat-messages__skeleton-avatar,
	:global(.dark) .chat-messages__skeleton-line {
		background: var(--gr-color-neutral-700, #374151);
	}

	:global(.dark) .chat-messages__empty-icon {
		color: var(--gr-color-neutral-500, #6b7280);
	}

	:global(.dark) .chat-messages__empty-title {
		color: var(--gr-semantic-foreground-primary, #f9fafb);
	}

	:global(.dark) .chat-messages__empty-message {
		color: var(--gr-semantic-foreground-secondary, #9ca3af);
	}

	:global(.dark) .chat-messages__suggestion {
		color: var(--gr-color-primary-400, #60a5fa);
		background: var(--gr-color-primary-900, #1e3a5f);
		border-color: var(--gr-color-primary-700, #1d4ed8);
	}

	:global(.dark) .chat-messages__suggestion:hover {
		background: var(--gr-color-primary-800, #1e40af);
		border-color: var(--gr-color-primary-600, #2563eb);
	}
</style>
