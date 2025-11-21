<!--
Section component - Semantic section wrapper with consistent vertical spacing.

@component
@example
```svelte
<Section spacing="lg" padding="md" centered>
  <h2>Section Title</h2>
  <p>Section content...</p>
</Section>
```
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Section component props interface.
	 *
	 * @public
	 */
	interface Props extends HTMLAttributes<HTMLElement> {
		/**
		 * Vertical spacing (margin-top and margin-bottom).
		 * - `none`: No spacing
		 * - `sm`: 2rem
		 * - `md`: 4rem (default)
		 * - `lg`: 6rem
		 * - `xl`: 8rem
		 *
		 * @defaultValue 'md'
		 * @public
		 */
		spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

		/**
		 * Horizontal padding.
		 * - `false`: No padding
		 * - `true`: Default padding (1rem)
		 * - `sm`: 0.75rem
		 * - `md`: 1rem
		 * - `lg`: 1.5rem
		 *
		 * @defaultValue false
		 * @public
		 */
		padding?: boolean | 'sm' | 'md' | 'lg';

		/**
		 * Center content horizontally.
		 *
		 * @defaultValue false
		 * @public
		 */
		centered?: boolean;

		/**
		 * Additional CSS classes.
		 *
		 * @public
		 */
		class?: string;

		/**
		 * Content snippet.
		 *
		 * @public
		 */
		children?: Snippet;
	}

	let {
		spacing = 'md',
		padding = false,
		centered = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Compute section classes
	const sectionClass = $derived(() => {
		let paddingClass = '';
		if (typeof padding === 'string') {
			paddingClass = `gr-section--padded-${padding}`;
		} else if (padding === true) {
			paddingClass = 'gr-section--padded-md';
		}

		const classes = [
			'gr-section',
			`gr-section--spacing-${spacing}`,
			paddingClass,
			centered && 'gr-section--centered',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});
</script>

<section class={sectionClass()} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</section>
