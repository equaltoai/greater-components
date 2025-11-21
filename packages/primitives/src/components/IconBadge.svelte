<!--
IconBadge component - A container for icons with consistent shapes, sizes, and colors.

@component
@example
```svelte
<IconBadge icon={TargetIcon} size="lg" color="primary" />
<IconBadge icon={SettingsIcon} variant="outlined" shape="square" />
```
-->
<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	interface Props {
		/**
		 * Icon component to display.
		 */
		icon?: Component;

		/**
		 * Override icon size. Defaults based on badge size.
		 */
		iconSize?: number;

		/**
		 * Size of the badge.
		 */
		size?: 'sm' | 'md' | 'lg' | 'xl';

		/**
		 * Color theme.
		 */
		color?: 'primary' | 'success' | 'warning' | 'error' | 'gray';

		/**
		 * Visual variant.
		 */
		variant?: 'filled' | 'outlined' | 'ghost';

		/**
		 * Shape of the badge.
		 */
		shape?: 'circle' | 'rounded' | 'square';

		/**
		 * Additional CSS classes.
		 */
		class?: string;

		/**
		 * Snippet for icon content (alternative to icon prop).
		 */
		children?: Snippet;
	}

	let {
		icon,
		iconSize,
		size = 'md',
		color = 'primary',
		variant = 'filled',
		shape = 'circle',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const sizeMap = { sm: 40, md: 56, lg: 72, xl: 96 };
	const defaultIconSizeMap = { sm: 20, md: 28, lg: 36, xl: 48 };

	const badgeSize = $derived(sizeMap[size]);
	const finalIconSize = $derived(iconSize || defaultIconSizeMap[size]);

	const badgeClass = $derived(
		[
			'gr-icon-badge',
			`gr-icon-badge--${variant}`,
			`gr-icon-badge--${color}`,
			`gr-icon-badge--${shape}`,
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div class={badgeClass} style:width="{badgeSize}px" style:height="{badgeSize}px" {...restProps}>
	{#if icon}
		{@const Icon = icon}
		<Icon size={finalIconSize} />
	{:else if children}
		{@render children()}
	{/if}
</div>

<style>
	:global {
		.gr-icon-badge {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			transition: all 0.2s ease;
		}

		/* Shapes */
		.gr-icon-badge--circle {
			border-radius: var(--gr-radii-full);
		}

		.gr-icon-badge--rounded {
			border-radius: var(--gr-radii-lg);
		}

		.gr-icon-badge--square {
			border-radius: var(--gr-radii-md);
		}

		/* Variants & Colors */
		/* Filled */
		.gr-icon-badge--filled.gr-icon-badge--primary {
			background-color: var(--gr-color-primary-50);
			color: var(--gr-color-primary-600);
		}
		.gr-icon-badge--filled.gr-icon-badge--success {
			background-color: var(--gr-color-success-50);
			color: var(--gr-color-success-600);
		}
		.gr-icon-badge--filled.gr-icon-badge--warning {
			background-color: var(--gr-color-warning-50);
			color: var(--gr-color-warning-600);
		}
		.gr-icon-badge--filled.gr-icon-badge--error {
			background-color: var(--gr-color-error-50);
			color: var(--gr-color-error-600);
		}
		.gr-icon-badge--filled.gr-icon-badge--gray {
			background-color: var(--gr-color-gray-100);
			color: var(--gr-color-gray-600);
		}

		/* Outlined */
		.gr-icon-badge--outlined {
			background-color: transparent;
			border: 1px solid currentColor;
		}
		.gr-icon-badge--outlined.gr-icon-badge--primary {
			color: var(--gr-color-primary-600);
			border-color: var(--gr-color-primary-200);
		}
		.gr-icon-badge--outlined.gr-icon-badge--success {
			color: var(--gr-color-success-600);
			border-color: var(--gr-color-success-200);
		}
		.gr-icon-badge--outlined.gr-icon-badge--warning {
			color: var(--gr-color-warning-600);
			border-color: var(--gr-color-warning-200);
		}
		.gr-icon-badge--outlined.gr-icon-badge--error {
			color: var(--gr-color-error-600);
			border-color: var(--gr-color-error-200);
		}
		.gr-icon-badge--outlined.gr-icon-badge--gray {
			color: var(--gr-color-gray-600);
			border-color: var(--gr-color-gray-200);
		}

		/* Ghost */
		.gr-icon-badge--ghost {
			background-color: transparent;
		}
		.gr-icon-badge--ghost.gr-icon-badge--primary {
			color: var(--gr-color-primary-600);
		}
		.gr-icon-badge--ghost.gr-icon-badge--success {
			color: var(--gr-color-success-600);
		}
		.gr-icon-badge--ghost.gr-icon-badge--warning {
			color: var(--gr-color-warning-600);
		}
		.gr-icon-badge--ghost.gr-icon-badge--error {
			color: var(--gr-color-error-600);
		}
		.gr-icon-badge--ghost.gr-icon-badge--gray {
			color: var(--gr-color-gray-600);
		}
	}
</style>
