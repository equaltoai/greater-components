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
