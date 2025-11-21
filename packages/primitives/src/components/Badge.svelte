<!--
Badge component - A versatile badge component for status indicators, labels, and counts.

@component
@example
```svelte
<Badge variant="pill" label="New" color="primary">
  Feature available
</Badge>

<Badge variant="dot" color="success" label="Online" />
```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Visual variant of the badge.
		 * - `pill`: Rounded pill with optional description (default)
		 * - `dot`: Small dot indicator with text
		 * - `outlined`: Border-only badge
		 * - `filled`: Solid background badge
		 */
		variant?: 'pill' | 'dot' | 'outlined' | 'filled';

		/**
		 * Color theme of the badge.
		 */
		color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';

		/**
		 * Size of the badge.
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * Main label text.
		 */
		label?: string;

		/**
		 * Secondary description text (primarily for pill variant).
		 */
		description?: string;

		/**
		 * Additional CSS classes.
		 */
		class?: string;

		/**
		 * Custom label content snippet.
		 */
		labelSnippet?: Snippet;

		/**
		 * Description/Content snippet.
		 */
		children?: Snippet;
	}

	let {
		variant = 'pill',
		color = 'primary',
		size = 'md',
		label = '',
		description = '',
		class: className = '',
		labelSnippet,
		children,
		...restProps
	}: Props = $props();

	const badgeClass = $derived(
		['gr-badge', `gr-badge--${variant}`, `gr-badge--${color}`, `gr-badge--${size}`, className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={badgeClass} {...restProps}>
	{#if variant === 'dot'}
		<span class="gr-badge__dot" aria-hidden="true"></span>
	{/if}

	{#if label || labelSnippet}
		<span class="gr-badge__label">
			{#if labelSnippet}
				{@render labelSnippet()}
			{:else}
				{label}
			{/if}
		</span>
	{/if}

	{#if (description || children) && variant === 'pill'}
		<span class="gr-badge__description">
			{#if children}
				{@render children()}
			{:else}
				{description}
			{/if}
		</span>
	{:else if children}
		<!-- Allow children for other variants if needed, though typically they just have a label -->
		<span class="gr-badge__content">
			{@render children()}
		</span>
	{/if}
</div>

<style>
	:global {
		.gr-badge {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-family: var(--gr-typography-fontFamily-sans);
			font-weight: var(--gr-typography-fontWeight-medium);
			line-height: 1;
			white-space: nowrap;
			transition: all 0.2s ease;
		}

		/* Sizes */
		.gr-badge--sm {
			font-size: var(--gr-typography-fontSize-xs);
			height: 1.25rem;
			padding: 0 0.5rem;
			gap: 0.25rem;
		}

		.gr-badge--md {
			font-size: var(--gr-typography-fontSize-sm);
			height: 1.5rem;
			padding: 0 0.75rem;
			gap: 0.375rem;
		}

		.gr-badge--lg {
			font-size: var(--gr-typography-fontSize-base);
			height: 2rem;
			padding: 0 1rem;
			gap: 0.5rem;
		}

		/* Variants */
		/* Pill */
		.gr-badge--pill {
			border-radius: var(--gr-radii-full);
			padding: 0.25rem 0.75rem 0.25rem 0.25rem; /* asymmetric padding for label pill inside */
			gap: 0.5rem;
			height: auto;
		}

		.gr-badge--pill.gr-badge--sm {
			padding: 0.125rem 0.5rem 0.125rem 0.125rem;
		}
		.gr-badge--pill.gr-badge--md {
			padding: 0.25rem 0.75rem 0.25rem 0.25rem;
		}
		.gr-badge--pill.gr-badge--lg {
			padding: 0.375rem 1rem 0.375rem 0.375rem;
		}

		.gr-badge--pill .gr-badge__label {
			border-radius: var(--gr-radii-full);
			padding: 0.125rem 0.5rem;
			font-weight: var(--gr-typography-fontWeight-bold);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}

		.gr-badge--pill.gr-badge--sm .gr-badge__label {
			padding: 0.125rem 0.375rem;
			font-size: 0.7rem;
		}
		.gr-badge--pill.gr-badge--md .gr-badge__label {
			padding: 0.125rem 0.5rem;
		}
		.gr-badge--pill.gr-badge--lg .gr-badge__label {
			padding: 0.25rem 0.75rem;
		}

		/* Dot */
		.gr-badge--dot {
			background: transparent;
			color: var(--gr-color-gray-700); /* Default text color */
			padding: 0;
			height: auto;
			gap: 0.375rem;
		}

		.gr-badge__dot {
			width: 0.5rem;
			height: 0.5rem;
			border-radius: var(--gr-radii-full);
			flex-shrink: 0;
		}

		.gr-badge--sm .gr-badge__dot {
			width: 0.375rem;
			height: 0.375rem;
		}
		.gr-badge--lg .gr-badge__dot {
			width: 0.625rem;
			height: 0.625rem;
		}

		/* Outlined */
		.gr-badge--outlined {
			background: transparent;
			border: 1px solid currentColor;
			border-radius: var(--gr-radii-md);
		}

		/* Filled */
		.gr-badge--filled {
			border-radius: var(--gr-radii-md);
			color: white;
		}

		/* Colors */
		/* Primary */
		.gr-badge--primary.gr-badge--pill {
			background-color: var(--gr-color-primary-50);
			color: var(--gr-color-primary-900);
		}
		.gr-badge--primary.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-primary-600);
			color: white;
		}
		.gr-badge--primary.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-primary-600);
		}
		.gr-badge--primary.gr-badge--outlined {
			color: var(--gr-color-primary-600);
			border-color: var(--gr-color-primary-600);
			background-color: var(--gr-color-primary-50);
		}
		.gr-badge--primary.gr-badge--filled {
			background-color: var(--gr-color-primary-600);
			color: white;
		}

		/* Success */
		.gr-badge--success.gr-badge--pill {
			background-color: var(--gr-color-success-50);
			color: var(--gr-color-success-900);
		}
		.gr-badge--success.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-success-600);
			color: white;
		}
		.gr-badge--success.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-success-600);
		}
		.gr-badge--success.gr-badge--outlined {
			color: var(--gr-color-success-600);
			border-color: var(--gr-color-success-600);
			background-color: var(--gr-color-success-50);
		}
		.gr-badge--success.gr-badge--filled {
			background-color: var(--gr-color-success-600);
			color: white;
		}

		/* Warning */
		.gr-badge--warning.gr-badge--pill {
			background-color: var(--gr-color-warning-50);
			color: var(--gr-color-warning-900);
		}
		.gr-badge--warning.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-warning-600);
			color: white;
		}
		.gr-badge--warning.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-warning-600);
		}
		.gr-badge--warning.gr-badge--outlined {
			color: var(--gr-color-warning-600);
			border-color: var(--gr-color-warning-600);
			background-color: var(--gr-color-warning-50);
		}
		.gr-badge--warning.gr-badge--filled {
			background-color: var(--gr-color-warning-600);
			color: white;
		}

		/* Error */
		.gr-badge--error.gr-badge--pill {
			background-color: var(--gr-color-error-50);
			color: var(--gr-color-error-900);
		}
		.gr-badge--error.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-error-600);
			color: white;
		}
		.gr-badge--error.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-error-600);
		}
		.gr-badge--error.gr-badge--outlined {
			color: var(--gr-color-error-600);
			border-color: var(--gr-color-error-600);
			background-color: var(--gr-color-error-50);
		}
		.gr-badge--error.gr-badge--filled {
			background-color: var(--gr-color-error-600);
			color: white;
		}

		/* Info */
		.gr-badge--info.gr-badge--pill {
			background-color: var(--gr-color-info-50);
			color: var(--gr-color-info-900);
		}
		.gr-badge--info.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-info-600);
			color: white;
		}
		.gr-badge--info.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-info-600);
		}
		.gr-badge--info.gr-badge--outlined {
			color: var(--gr-color-info-600);
			border-color: var(--gr-color-info-600);
			background-color: var(--gr-color-info-50);
		}
		.gr-badge--info.gr-badge--filled {
			background-color: var(--gr-color-info-600);
			color: white;
		}

		/* Gray */
		.gr-badge--gray.gr-badge--pill {
			background-color: var(--gr-color-gray-100);
			color: var(--gr-color-gray-900);
		}
		.gr-badge--gray.gr-badge--pill .gr-badge__label {
			background-color: var(--gr-color-gray-600);
			color: white;
		}
		.gr-badge--gray.gr-badge--dot .gr-badge__dot {
			background-color: var(--gr-color-gray-600);
		}
		.gr-badge--gray.gr-badge--outlined {
			color: var(--gr-color-gray-600);
			border-color: var(--gr-color-gray-600);
			background-color: var(--gr-color-gray-50);
		}
		.gr-badge--gray.gr-badge--filled {
			background-color: var(--gr-color-gray-600);
			color: white;
		}
	}
</style>
