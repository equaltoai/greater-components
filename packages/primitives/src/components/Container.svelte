<!--
Container component - Max-width wrapper for content centering.

@component
@example
```svelte
<Container maxWidth="lg" padding="md" centered>
  <h1>Page Title</h1>
  <p>Page content...</p>
</Container>
```
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Container component props interface.
	 *
	 * @public
	 */
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/**
		 * Maximum width constraint.
		 * - `sm`: 640px
		 * - `md`: 768px
		 * - `lg`: 1024px (default)
		 * - `xl`: 1280px
		 * - `2xl`: 1536px
		 * - `full`: 100% (no constraint)
		 *
		 * @defaultValue 'lg'
		 * @public
		 */
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

		/**
		 * Horizontal padding.
		 * - `false`: No padding
		 * - `true`: Default padding (1rem)
		 * - `sm`: 0.75rem
		 * - `md`: 1rem
		 * - `lg`: 1.5rem
		 *
		 * @defaultValue true
		 * @public
		 */
		padding?: boolean | 'sm' | 'md' | 'lg';

		/**
		 * Center content horizontally.
		 *
		 * @defaultValue true
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
		maxWidth = 'lg',
		padding = true,
		centered = true,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Compute container classes
	const containerClass = $derived(() => {
		let paddingClass = '';
		if (typeof padding === 'string') {
			paddingClass = `gr-container--padded-${padding}`;
		} else if (padding === true) {
			paddingClass = 'gr-container--padded-md';
		}

		const classes = [
			'gr-container',
			`gr-container--max-${maxWidth}`,
			paddingClass,
			centered && 'gr-container--centered',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});
</script>

<div class={containerClass()} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	:global {
		.gr-container {
			width: 100%;
			box-sizing: border-box;
		}

		/* Centering */
		.gr-container--centered {
			margin-left: auto;
			margin-right: auto;
		}

		/* Max-width variants */
		.gr-container--max-sm {
			max-width: 640px;
		}

		.gr-container--max-md {
			max-width: 768px;
		}

		.gr-container--max-lg {
			max-width: 1024px;
		}

		.gr-container--max-xl {
			max-width: 1280px;
		}

		.gr-container--max-2xl {
			max-width: 1536px;
		}

		.gr-container--max-full {
			max-width: 100%;
		}

		/* Padding variants */
		.gr-container--padded-sm {
			padding-left: var(--gr-spacing-scale-3);
			padding-right: var(--gr-spacing-scale-3);
		}

		.gr-container--padded-md {
			padding-left: var(--gr-spacing-scale-4);
			padding-right: var(--gr-spacing-scale-4);
		}

		.gr-container--padded-lg {
			padding-left: var(--gr-spacing-scale-6);
			padding-right: var(--gr-spacing-scale-6);
		}
	}
</style>
