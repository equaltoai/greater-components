<!--
  ChatSuggestions - Quick Prompt Suggestions Component
  
  Displays clickable prompt suggestions in empty state or after responses.
  Supports pills (default) and cards variants with full keyboard navigation.
  
  @component
  @example
  ```svelte
  <Chat.Container {handlers}>
    <Chat.Messages />
    <Chat.Suggestions
      suggestions={["What is PAI?", "How do I create a scope?"]}
      onSelect={(suggestion) => handleSelect(suggestion)}
    />
    <Chat.Input />
  </Chat.Container>
  ```
-->
<script lang="ts">
	import { hasChatContext, getChatContext } from './context.svelte.js';

	/**
	 * Suggestion item with optional description for cards variant
	 */
	interface SuggestionItem {
		/** Display text */
		text: string;
		/** Optional description (only shown in cards variant) */
		description?: string;
	}

	/**
	 * Suggestion placement options
	 */
	type SuggestionPlacement = 'empty-only' | 'inline' | 'bottom';

	/**
	 * ChatSuggestions component props
	 */
	interface Props {
		/**
		 * Array of suggestion texts or objects with text and description
		 */
		suggestions: (string | SuggestionItem)[];

		/**
		 * Callback when a suggestion is clicked
		 */
		onSelect: (suggestion: string) => void;

		/**
		 * Visual variant
		 * - `pills`: Horizontal row of pill-shaped buttons (default)
		 * - `cards`: Larger cards in grid layout
		 * @default 'pills'
		 */
		variant?: 'pills' | 'cards';

		/**
		 * Placement behavior
		 * - `empty-only`: Only show when no messages (default)
		 * - `inline`: Can be rendered within message flow
		 * - `bottom`: Always visible at bottom of chat
		 * @default 'empty-only'
		 */
		placement?: SuggestionPlacement;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { 
		suggestions, 
		onSelect, 
		variant = 'pills', 
		placement = 'empty-only',
		class: className = '' 
	}: Props = $props();

	// Get chat context if available for message count
	const hasContext = hasChatContext();
	const context = hasContext ? getChatContext() : null;
	
	// Determine if suggestions should be visible based on placement
	const messageCount = $derived(context?.state.messages.length ?? 0);
	const shouldShow = $derived.by(() => {
		switch (placement) {
			case 'empty-only':
				return messageCount === 0;
			case 'inline':
			case 'bottom':
				return true;
			default:
				return messageCount === 0;
		}
	});

	/**
	 * Normalize suggestion to object format
	 */
	function normalizeSuggestion(suggestion: string | SuggestionItem): SuggestionItem {
		if (typeof suggestion === 'string') {
			return { text: suggestion };
		}
		return suggestion;
	}

	/**
	 * Handle suggestion click
	 */
	function handleClick(suggestion: SuggestionItem) {
		onSelect(suggestion.text);
	}

	/**
	 * Handle keyboard navigation
	 */
	function handleKeyDown(event: KeyboardEvent, suggestion: SuggestionItem) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(suggestion.text);
		}
	}

	// Compute container classes
	const containerClass = $derived.by(() => {
		const classes = [
			'chat-suggestions', 
			`chat-suggestions--${variant}`,
			`chat-suggestions--${placement}`,
			className
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});
</script>

{#if shouldShow}
<div class={containerClass} role="group" aria-label="Suggested prompts">
	{#each suggestions as suggestion (typeof suggestion === 'string' ? suggestion : suggestion.text)}
		{@const item = normalizeSuggestion(suggestion)}
		<button
			type="button"
			class="chat-suggestions__item"
			onclick={() => handleClick(item)}
			onkeydown={(e) => handleKeyDown(e, item)}
			tabindex={0}
			aria-label={`Suggestion: ${item.text}`}
		>
			<span class="chat-suggestions__text">{item.text}</span>
			{#if variant === 'cards' && item.description}
				<span class="chat-suggestions__description">{item.description}</span>
			{/if}
		</button>
	{/each}
</div>
{/if}

<style>
	/* Base container styles */
	.chat-suggestions {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
	}

	/* Pills variant - horizontal row with wrapping */
	.chat-suggestions--pills {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	/* Pills variant mobile - horizontal scroll */
	@media (max-width: 640px) {
		.chat-suggestions--pills {
			flex-wrap: nowrap;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* IE/Edge */
			padding-bottom: var(--gr-spacing-scale-2);
		}

		.chat-suggestions--pills::-webkit-scrollbar {
			display: none; /* Chrome/Safari */
		}
	}

	/* Cards variant - grid layout */
	.chat-suggestions--cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--gr-spacing-scale-3);
	}

	@media (max-width: 640px) {
		.chat-suggestions--cards {
			grid-template-columns: 1fr;
		}
	}

	/* Base item styles */
	.chat-suggestions__item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border: none;
		cursor: pointer;
		font-family: var(--gr-typography-fontFamily-sans);
		font-size: var(--gr-typography-fontSize-sm);
		line-height: 1.5;
		text-align: left;
		transition: all 0.15s ease-in-out;
		background-color: var(--gr-semantic-background-secondary);
		color: var(--gr-semantic-foreground-primary);
	}

	.chat-suggestions__item:focus {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.chat-suggestions__item:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	/* Pills variant item styles */
	.chat-suggestions--pills .chat-suggestions__item {
		flex-direction: row;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radii-full);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.chat-suggestions--pills .chat-suggestions__item:hover {
		background-color: var(--gr-color-primary-50);
		color: var(--gr-color-primary-700);
	}

	.chat-suggestions--pills .chat-suggestions__item:active {
		background-color: var(--gr-color-primary-100);
		transform: scale(0.98);
	}

	/* Cards variant item styles */
	.chat-suggestions--cards .chat-suggestions__item {
		padding: var(--gr-spacing-scale-4);
		border-radius: var(--gr-radii-lg);
		border: 1px solid var(--gr-semantic-border-default);
		gap: var(--gr-spacing-scale-1);
	}

	.chat-suggestions--cards .chat-suggestions__item:hover {
		background-color: var(--gr-color-primary-50);
		border-color: var(--gr-color-primary-300);
		box-shadow: var(--gr-shadows-sm);
		transform: translateY(-1px);
	}

	.chat-suggestions--cards .chat-suggestions__item:active {
		background-color: var(--gr-color-primary-100);
		transform: translateY(0);
	}

	/* Text styles */
	.chat-suggestions__text {
		font-weight: 500;
	}

	.chat-suggestions__description {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		font-weight: 400;
	}

	/* Placement variants */
	.chat-suggestions--bottom {
		position: sticky;
		bottom: 0;
		background-color: var(--gr-semantic-background-primary);
		border-top: 1px solid var(--gr-semantic-border-subtle);
		padding-top: var(--gr-spacing-scale-3);
		padding-bottom: var(--gr-spacing-scale-3);
	}

	.chat-suggestions--inline {
		margin: var(--gr-spacing-scale-2) 0;
	}

	/* Dark mode handled via semantic tokens - no explicit override needed */
</style>
