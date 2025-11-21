<!--
Heading component - Semantic heading with consistent typography.

@component
@example
```svelte
<Heading level={1} align="center">Page Title</Heading>
```
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Heading component props interface.
	 *
	 * @public
	 */
	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		/**
		 * Semantic heading level (required for accessibility).
		 * Maps to <h1> through <h6> elements.
		 *
		 * @required
		 * @public
		 */
		level: 1 | 2 | 3 | 4 | 5 | 6;

		/**
		 * Visual size (can differ from semantic level).
		 * - `xs`: 0.75rem
		 * - `sm`: 0.875rem
		 * - `base`: 1rem
		 * - `lg`: 1.125rem
		 * - `xl`: 1.25rem
		 * - `2xl`: 1.5rem
		 * - `3xl`: 1.875rem
		 * - `4xl`: 2.25rem
		 * - `5xl`: 3rem
		 *
		 * @defaultValue Maps to level (h1=5xl, h2=4xl, h3=3xl, h4=2xl, h5=xl, h6=lg)
		 * @public
		 */
		size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

		/**
		 * Font weight.
		 * - `normal`: 400
		 * - `medium`: 500
		 * - `semibold`: 600
		 * - `bold`: 700 (default for headings)
		 *
		 * @defaultValue 'bold'
		 * @public
		 */
		weight?: 'normal' | 'medium' | 'semibold' | 'bold';

		/**
		 * Text alignment.
		 *
		 * @defaultValue 'left'
		 * @public
		 */
		align?: 'left' | 'center' | 'right';

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
		level,
		size,
		weight = 'bold',
		align = 'left',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Determine actual size to use
	const actualSize = $derived.by(() => {
		if (size) return size;
		switch (level) {
			case 1:
				return '5xl';
			case 2:
				return '4xl';
			case 3:
				return '3xl';
			case 4:
				return '2xl';
			case 5:
				return 'xl';
			case 6:
				return 'lg';
			default:
				return 'base';
		}
	});

	// Compute heading classes
	const headingClass = $derived(() => {
		return [
			'gr-heading',
			`gr-heading--size-${actualSize}`,
			`gr-heading--weight-${weight}`,
			`gr-heading--align-${align}`,
			className,
		]
			.filter(Boolean)
			.join(' ');
	});
</script>

<svelte:element this={`h${level}`} class={headingClass()} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
