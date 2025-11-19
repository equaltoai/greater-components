<!--
Card component - Content container with elevation, borders, and semantic sections.

@component
@example
```svelte
<Card variant="elevated" padding="md" clickable>
  <p>Card content</p>
  
  {#snippet footer()}
    <Button>Action</Button>
  {/snippet}
</Card>
```
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Card component props interface.
	 *
	 * @public
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Visual variant of the card.
		 * - `elevated`: Card with shadow (default)
		 * - `outlined`: Card with border
		 * - `filled`: Card with background fill
		 *
		 * @defaultValue 'elevated'
		 * @public
		 */
		variant?: 'elevated' | 'outlined' | 'filled';

		/**
		 * Internal padding amount.
		 * - `none`: No padding
		 * - `sm`: 0.75rem padding
		 * - `md`: 1rem padding (default)
		 * - `lg`: 1.5rem padding
		 *
		 * @defaultValue 'md'
		 * @public
		 */
		padding?: 'none' | 'sm' | 'md' | 'lg';

		/**
		 * Whether the card is clickable/interactive.
		 * When true, renders as button with hover states.
		 *
		 * @defaultValue false
		 * @public
		 */
		clickable?: boolean;

		/**
		 * Whether to show hover effects.
		 *
		 * @defaultValue false
		 * @public
		 */
		hoverable?: boolean;

		/**
		 * Additional CSS classes.
		 *
		 * @public
		 */
		class?: string;

		/**
		 * Header content snippet.
		 *
		 * @public
		 */
		header?: Snippet;

		/**
		 * Footer content snippet.
		 *
		 * @public
		 */
		footer?: Snippet;

		/**
		 * Main content snippet.
		 *
		 * @public
		 */
		children?: Snippet;
	}

	let {
		variant = 'elevated',
		padding = 'md',
		clickable = false,
		hoverable = false,
		class: className = '',
		header,
		footer,
		children,
		onclick,
		onkeydown,
		role,
		tabindex,
		...restProps
	}: Props = $props();

	// Compute card classes
	const cardClass = $derived(() => {
		const classes = [
			'gr-card',
			`gr-card--${variant}`,
			`gr-card--padding-${padding}`,
			clickable && 'gr-card--clickable',
			(hoverable || clickable) && 'gr-card--hoverable',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Handle keyboard activation
	function handleKeydown(event: KeyboardEvent) {
		if (clickable && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			if (onclick) {
				onclick(event as unknown as MouseEvent);
			}
		}
		onkeydown?.(event);
	}

	function handleClick(event: MouseEvent) {
		if (clickable && onclick) {
			onclick(event);
		}
	}
</script>

{#if clickable}
	<button
		class={cardClass()}
		onclick={handleClick}
		onkeydown={handleKeydown}
		role={role || 'button'}
		tabindex={tabindex ?? 0}
		{...restProps}
	>
		{#if header}
			<div class="gr-card__header">
				{@render header()}
			</div>
		{/if}

		<div class="gr-card__content">
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if footer}
			<div class="gr-card__footer">
				{@render footer()}
			</div>
		{/if}
	</button>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class={cardClass()}
		role={role}
		tabindex={tabindex}
		{...restProps}
	>
		{#if header}
			<div class="gr-card__header">
				{@render header()}
			</div>
		{/if}

		<div class="gr-card__content">
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if footer}
			<div class="gr-card__footer">
				{@render footer()}
			</div>
		{/if}
	</div>
{/if}

<style>
	:global {
		.gr-card {
			display: flex;
			flex-direction: column;
			background-color: var(--gr-semantic-background-primary);
			border-radius: var(--gr-radii-lg);
			border: 1px solid transparent;
			overflow: hidden;
			transition-property: box-shadow, border-color, background-color, transform;
			transition-duration: var(--gr-motion-duration-fast);
			transition-timing-function: var(--gr-motion-easing-out);
			font-family: var(--gr-typography-fontFamily-sans);
			text-align: left;
			width: 100%;
		}

		/* Variants */
		.gr-card--elevated {
			box-shadow: var(--gr-shadows-md);
			border-color: transparent;
		}

		.gr-card--outlined {
			border-color: var(--gr-semantic-border-default);
			box-shadow: none;
		}

		.gr-card--filled {
			background-color: var(--gr-semantic-background-secondary);
			border-color: transparent;
			box-shadow: none;
		}

		/* Padding variants */
		.gr-card--padding-none .gr-card__content,
		.gr-card--padding-none .gr-card__header,
		.gr-card--padding-none .gr-card__footer {
			padding: 0;
		}

		.gr-card--padding-sm .gr-card__content,
		.gr-card--padding-sm .gr-card__header,
		.gr-card--padding-sm .gr-card__footer {
			padding: var(--gr-spacing-scale-3);
		}

		.gr-card--padding-md .gr-card__content,
		.gr-card--padding-md .gr-card__header,
		.gr-card--padding-md .gr-card__footer {
			padding: var(--gr-spacing-scale-4);
		}

		.gr-card--padding-lg .gr-card__content,
		.gr-card--padding-lg .gr-card__header,
		.gr-card--padding-lg .gr-card__footer {
			padding: var(--gr-spacing-scale-6);
		}

		/* Section styles */
		.gr-card__header {
			border-bottom: 1px solid var(--gr-semantic-border-default);
			font-weight: var(--gr-typography-fontWeight-semibold);
		}

		.gr-card__content {
			flex: 1;
		}

		.gr-card__footer {
			border-top: 1px solid var(--gr-semantic-border-default);
			background-color: var(--gr-semantic-background-tertiary); /* Optional contrast */
		}

		/* Interactive states */
		.gr-card--clickable {
			cursor: pointer;
			user-select: none;
			appearance: none;
			padding: 0; /* Reset button padding */
		}

		.gr-card--hoverable:hover {
			transform: translateY(-2px);
		}
		
		.gr-card--elevated.gr-card--hoverable:hover {
			box-shadow: var(--gr-shadows-lg);
		}

		.gr-card--outlined.gr-card--hoverable:hover {
			border-color: var(--gr-semantic-border-strong);
		}

		.gr-card--clickable:focus-visible {
			outline: 2px solid var(--gr-semantic-focus-ring);
			outline-offset: 2px;
		}

		/* Reduced motion */
		@media (prefers-reduced-motion: reduce) {
			.gr-card {
				transition-duration: 0ms;
			}
			
			.gr-card--hoverable:hover {
				transform: none;
			}
		}
	}
</style>
