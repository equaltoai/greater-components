<!--
  ChatMessageAction - Individual Message Action Button Component
  
  Provides a reusable action button for chat message actions like copy, retry, etc.
  
  @component
  @example
  ```svelte
  <ChatMessageAction 
    label="Copy"
    onclick={() => copyToClipboard(content)}
  >
    {#snippet icon()}
      <CopyIcon size={14} />
    {/snippet}
  </ChatMessageAction>
  ```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * ChatMessageAction component props
	 */
	interface Props {
		/**
		 * Accessible label for the action
		 */
		label: string;

		/**
		 * Click handler
		 */
		onclick?: () => void;

		/**
		 * Whether the action is disabled
		 * @default false
		 */
		disabled?: boolean;

		/**
		 * Icon snippet to render
		 */
		icon?: Snippet;

		/**
		 * Whether to show the label text (in addition to icon)
		 * @default false
		 */
		showLabel?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		label,
		onclick,
		disabled = false,
		icon,
		showLabel = false,
		class: className = '',
	}: Props = $props();

	const buttonClass = $derived.by(() => {
		const classes = ['chat-message-action', disabled && 'chat-message-action--disabled', className]
			.filter(Boolean)
			.join(' ');

		return classes;
	});
</script>

<button type="button" class={buttonClass} {disabled} {onclick} aria-label={label} title={label}>
	{#if icon}
		<span class="chat-message-action__icon">
			{@render icon()}
		</span>
	{/if}
	{#if showLabel}
		<span class="chat-message-action__label">{label}</span>
	{/if}
</button>

<style>
	.chat-message-action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1);
		border: none;
		border-radius: var(--gr-radii-md);
		background: transparent;
		color: var(--gr-semantic-foreground-tertiary);
		cursor: pointer;
		transition: all 0.15s ease-in-out;
		font-size: var(--gr-typography-fontSize-xs);
		font-family: var(--gr-typography-fontFamily-sans);
	}

	.chat-message-action:hover:not(:disabled) {
		background: var(--gr-semantic-background-secondary);
		color: var(--gr-semantic-foreground-primary);
	}

	.chat-message-action:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 1px;
	}

	.chat-message-action:active:not(:disabled) {
		transform: scale(0.95);
	}

	.chat-message-action--disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.chat-message-action__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
	}

	.chat-message-action__label {
		font-weight: var(--gr-typography-fontWeight-medium);
	}
</style>
