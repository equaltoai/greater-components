<!--
Button component - Accessible interactive element with loading states, variants, and full keyboard navigation.

@component
@example
```svelte
<Button variant="solid" size="md" onclick={handleClick}>
  Click me
</Button>

<Button variant="outline" loading disabled>
  {#snippet prefix()}
    <Icon name="plus" />
  {/snippet}
  Loading...
</Button>
```
-->

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Button component props interface.
	 *
	 * @public
	 */
	interface Props extends Omit<HTMLButtonAttributes, 'type'> {
		/**
		 * Visual variant of the button.
		 * - `solid`: Primary button with filled background (default)
		 * - `outline`: Secondary button with border
		 * - `ghost`: Tertiary button with no background/border
		 *
		 * @defaultValue 'solid'
		 * @public
		 */
		variant?: 'solid' | 'outline' | 'ghost';

		/**
		 * Size of the button affecting padding and font size.
		 * - `sm`: Small button (2rem height, 0.875rem font)
		 * - `md`: Medium button (2.5rem height, 1rem font) (default)
		 * - `lg`: Large button (3rem height, 1.125rem font)
		 *
		 * @defaultValue 'md'
		 * @public
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * HTML button type attribute.
		 *
		 * @defaultValue 'button'
		 * @public
		 */
		type?: 'button' | 'submit' | 'reset';

		/**
		 * Whether the button is disabled. Disabled buttons cannot be interacted with
		 * and have reduced opacity.
		 *
		 * @defaultValue false
		 * @public
		 */
		disabled?: boolean;

		/**
		 * Whether the button is in a loading state. Loading buttons show a spinner
		 * and are non-interactive.
		 *
		 * @defaultValue false
		 * @public
		 */
		loading?: boolean;

		/**
		 * Additional CSS classes to apply to the button.
		 *
		 * @public
		 */
		class?: string;

		/**
		 * Main button content snippet.
		 *
		 * @public
		 */
		children?: Snippet;

		/**
		 * Content to display before the main button text (e.g., icon).
		 *
		 * @public
		 */
		prefix?: Snippet;

		/**
		 * Content to display after the main button text (e.g., arrow icon).
		 *
		 * @public
		 */
		suffix?: Snippet;
	}

	let {
		variant = 'solid',
		size = 'md',
		type = 'button',
		disabled = false,
		loading = false,
		class: className = '',
		children,
		prefix,
		suffix,
		onclick,
		onkeydown,
		...restProps
	}: Props = $props();

	// Compute button classes
	const buttonClass = $derived(() => {
		const classes = [
			'gr-button',
			`gr-button--${variant}`,
			`gr-button--${size}`,
			loading && 'gr-button--loading',
			disabled && 'gr-button--disabled',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Handle keyboard activation
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!disabled && !loading && onclick) {
				onclick(event as MouseEvent);
			}
		}
		onkeydown?.(event);
	}

	function handleClick(event: MouseEvent) {
		if (disabled || loading) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		onclick?.(event);
	}
</script>

<button
	class={buttonClass()}
	{type}
	disabled={disabled || loading}
	aria-disabled={disabled || loading}
	aria-busy={loading}
	tabindex={disabled ? -1 : 0}
	onclick={handleClick}
	onkeydown={handleKeydown}
	{...restProps}
>
	{#if prefix}
		<span class="gr-button__prefix">
			{@render prefix()}
		</span>
	{/if}

	{#if loading}
		<span class="gr-button__spinner" aria-hidden="true">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12a9 9 0 11-6.219-8.56" />
			</svg>
		</span>
	{/if}

	<span class="gr-button__content" class:gr-button__content--loading={loading}>
		{#if children}
			{@render children()}
		{/if}
	</span>

	{#if suffix}
		<span class="gr-button__suffix">
			{@render suffix()}
		</span>
	{/if}
</button>

<style>
	:global {
		.gr-button {
			/* Base styles */
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--gr-spacing-scale-2);
			font-family: var(--gr-typography-fontFamily-sans);
			font-weight: var(--gr-typography-fontWeight-medium);
			line-height: var(--gr-typography-lineHeight-normal);
			border-radius: var(--gr-radii-md);
			border: 1px solid transparent;
			cursor: pointer;
			transition-property: color, background-color, border-color, box-shadow, transform;
			transition-duration: var(--gr-motion-duration-fast);
			transition-timing-function: var(--gr-motion-easing-out);
			text-decoration: none;
			white-space: nowrap;
			user-select: none;
			position: relative;
		}

		.gr-button:focus {
			outline: none;
		}

		.gr-button:focus-visible {
			box-shadow: 0 0 0 2px var(--gr-semantic-focus-ring);
		}

		/* Size variants */
		.gr-button--sm {
			padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
			font-size: var(--gr-typography-fontSize-sm);
			min-height: 2rem;
		}

		.gr-button--md {
			padding: var(--gr-spacing-scale-3) var(--gr-spacing-scale-4);
			font-size: var(--gr-typography-fontSize-base);
			min-height: 2.5rem;
		}

		.gr-button--lg {
			padding: var(--gr-spacing-scale-4) var(--gr-spacing-scale-6);
			font-size: var(--gr-typography-fontSize-lg);
			min-height: 3rem;
		}

		/* Variant styles */
		.gr-button--solid {
			background-color: var(--gr-semantic-action-primary-default);
			color: var(--gr-color-base-white);
		}

		.gr-button--solid:hover:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-action-primary-hover);
		}

		.gr-button--solid:active:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-action-primary-active);
			transform: translateY(1px);
		}

		.gr-button--outline {
			background-color: transparent;
			border-color: var(--gr-semantic-border-default);
			color: var(--gr-semantic-foreground-primary);
		}

		.gr-button--outline:hover:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-background-secondary);
			border-color: var(--gr-semantic-border-strong);
		}

		.gr-button--outline:active:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-background-tertiary);
			transform: translateY(1px);
		}

		.gr-button--ghost {
			background-color: transparent;
			color: var(--gr-semantic-foreground-primary);
		}

		.gr-button--ghost:hover:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-background-secondary);
		}

		.gr-button--ghost:active:not(:disabled):not(.gr-button--loading) {
			background-color: var(--gr-semantic-background-tertiary);
			transform: translateY(1px);
		}

		/* Disabled state */
		.gr-button--disabled {
			opacity: 0.6;
			cursor: not-allowed;
			pointer-events: none;
		}

		.gr-button--solid.gr-button--disabled {
			background-color: var(--gr-semantic-action-primary-disabled);
		}

		/* Loading state */
		.gr-button--loading {
			cursor: wait;
			pointer-events: none;
		}

		.gr-button__content--loading {
			opacity: 0.7;
		}

		.gr-button__spinner {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			animation: spin 1s linear infinite;
		}

		.gr-button__prefix,
		.gr-button__suffix {
			display: flex;
			align-items: center;
		}

		@keyframes spin {
			from {
				transform: translateX(-50%) rotate(0deg);
			}
			to {
				transform: translateX(-50%) rotate(360deg);
			}
		}

		/* Reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.gr-button {
				transition-duration: 0ms;
			}

			.gr-button__spinner {
				animation: none;
			}
		}
	}
</style>
