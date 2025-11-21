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
	<div class={cardClass()} {role} {tabindex} {...restProps}>
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
