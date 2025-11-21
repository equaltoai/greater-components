<!--
Text component - Paragraph and inline text component with size, weight, and color variants.

@component
@example
```svelte
<Text size="lg" color="secondary">Some text content</Text>
```
-->

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	/**
	 * Text component props interface.
	 *
	 * @public
	 */
	interface Props
		extends HTMLAttributes<
			HTMLParagraphElement | HTMLSpanElement | HTMLDivElement | HTMLLabelElement
		> {
		/**
		 * HTML element to render.
		 * - `p`: Paragraph (default)
		 * - `span`: Inline span
		 * - `div`: Block div
		 * - `label`: Label element
		 *
		 * @defaultValue 'p'
		 * @public
		 */
		as?: 'p' | 'span' | 'div' | 'label';

		/**
		 * Text size.
		 * - `xs`: 0.75rem
		 * - `sm`: 0.875rem
		 * - `base`: 1rem (default)
		 * - `lg`: 1.125rem
		 * - `xl`: 1.25rem
		 * - `2xl`: 1.5rem
		 *
		 * @defaultValue 'base'
		 * @public
		 */
		size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

		/**
		 * Font weight.
		 * - `normal`: 400 (default)
		 * - `medium`: 500
		 * - `semibold`: 600
		 * - `bold`: 700
		 *
		 * @defaultValue 'normal'
		 * @public
		 */
		weight?: 'normal' | 'medium' | 'semibold' | 'bold';

		/**
		 * Text color variant.
		 * - `primary`: Primary text color (default)
		 * - `secondary`: Muted text color
		 * - `tertiary`: Most muted text color
		 * - `success`: Success/positive color
		 * - `warning`: Warning color
		 * - `error`: Error/danger color
		 *
		 * @defaultValue 'primary'
		 * @public
		 */
		color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';

		/**
		 * Text alignment.
		 *
		 * @defaultValue 'left'
		 * @public
		 */
		align?: 'left' | 'center' | 'right' | 'justify';

		/**
		 * Whether text should truncate with ellipsis.
		 *
		 * @defaultValue false
		 * @public
		 */
		truncate?: boolean;

		/**
		 * Number of lines before truncating (requires truncate=true).
		 * If not set, single-line truncation is used.
		 *
		 * @public
		 */
		lines?: number;

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
		as = 'p',
		size = 'base',
		weight = 'normal',
		color = 'primary',
		align = 'left',
		truncate = false,
		lines,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Compute text classes
	const textClass = $derived(() => {
		const classes = [
			'gr-text',
			`gr-text--size-${size}`,
			`gr-text--weight-${weight}`,
			`gr-text--color-${color}`,
			`gr-text--align-${align}`,
			truncate && 'gr-text--truncate',
			truncate && lines && 'gr-text--clamp',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return classes;
	});

	// Compute styles for line clamping
	const textStyle = $derived(() => {
		if (truncate && lines) {
			return `--gr-text-clamp-lines: ${lines};`;
		}
		return '';
	});
</script>

<svelte:element this={as} class={textClass()} style={textStyle() || undefined} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>

<style>
	:global {
		.gr-text {
			margin: 0;
			font-family: var(--gr-typography-fontFamily-sans);
			line-height: var(--gr-typography-lineHeight-normal);
		}

		/* Sizes */
		.gr-text--size-xs {
			font-size: var(--gr-typography-fontSize-xs);
		}
		.gr-text--size-sm {
			font-size: var(--gr-typography-fontSize-sm);
		}
		.gr-text--size-base {
			font-size: var(--gr-typography-fontSize-base);
		}
		.gr-text--size-lg {
			font-size: var(--gr-typography-fontSize-lg);
		}
		.gr-text--size-xl {
			font-size: var(--gr-typography-fontSize-xl);
		}
		.gr-text--size-2xl {
			font-size: var(--gr-typography-fontSize-2xl);
		}

		/* Weights */
		.gr-text--weight-normal {
			font-weight: var(--gr-typography-fontWeight-normal);
		}
		.gr-text--weight-medium {
			font-weight: var(--gr-typography-fontWeight-medium);
		}
		.gr-text--weight-semibold {
			font-weight: var(--gr-typography-fontWeight-semibold);
		}
		.gr-text--weight-bold {
			font-weight: var(--gr-typography-fontWeight-bold);
		}

		/* Colors */
		.gr-text--color-primary {
			color: var(--gr-semantic-foreground-primary);
		}
		.gr-text--color-secondary {
			color: var(--gr-semantic-foreground-secondary);
		}
		.gr-text--color-tertiary {
			color: var(--gr-semantic-foreground-tertiary);
		}
		.gr-text--color-success {
			color: var(--gr-semantic-action-success-default);
		}
		.gr-text--color-warning {
			color: var(--gr-semantic-action-warning-default);
		}
		.gr-text--color-error {
			color: var(--gr-semantic-action-error-default);
		}

		/* Alignment */
		.gr-text--align-left {
			text-align: left;
		}
		.gr-text--align-center {
			text-align: center;
		}
		.gr-text--align-right {
			text-align: right;
		}
		.gr-text--align-justify {
			text-align: justify;
		}

		/* Truncation */
		.gr-text--truncate:not(.gr-text--clamp) {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.gr-text--clamp {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: var(--gr-text-clamp-lines, 1);
			overflow: hidden;
		}
	}
</style>
