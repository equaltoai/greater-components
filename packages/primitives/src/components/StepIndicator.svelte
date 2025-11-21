<!--
StepIndicator component - Numbered badge for tutorials and multi-step workflows.

@component
@example
```svelte
<StepIndicator number={1} state="active" label="Step 1" />
<StepIndicator number={2} state="pending" />
<StepIndicator number={3} state="completed" />
```
-->
<script lang="ts">
	import { CheckIcon, XIcon } from '@equaltoai/greater-components-icons';
	import type { Component } from 'svelte';

	interface Props {
		/**
		 * Step number or character.
		 */
		number: number | string;

		/**
		 * Optional label displayed below the indicator.
		 */
		label?: string;

		/**
		 * Visual style variant.
		 */
		variant?: 'filled' | 'outlined' | 'ghost';

		/**
		 * Size of the indicator.
		 */
		size?: 'sm' | 'md' | 'lg';

		/**
		 * Current state of the step.
		 */
		state?: 'pending' | 'active' | 'completed' | 'error';

		/**
		 * Color theme (overridden by state in some cases).
		 */
		color?: 'primary' | 'success' | 'warning' | 'error';

		/**
		 * Custom icon to display instead of number.
		 */
		icon?: Component;

		/**
		 * Additional CSS classes.
		 */
		class?: string;
	}

	let {
		number,
		label,
		variant = 'filled',
		size = 'md',
		state = 'active',
		color = 'primary',
		icon,
		class: className = '',
		...restProps
	}: Props = $props();

	// Icons based on state
	const displayIcon = $derived.by(() => {
		if (icon) return icon;
		if (state === 'completed') return CheckIcon;
		if (state === 'error') return XIcon;
		return null;
	});

	// Color based on state
	const colorClass = $derived.by(() => {
		if (state === 'pending') return 'gray';
		if (state === 'completed') return 'success';
		if (state === 'error') return 'error';
		return color;
	});

	const badgeClass = $derived(
		[
			'gr-step-badge',
			`gr-step-badge--${variant}`,
			`gr-step-badge--${size}`,
			`gr-step-badge--${colorClass}`,
		]
			.filter(Boolean)
			.join(' ')
	);

	const iconSizeMap = { sm: 16, md: 20, lg: 24 };
	const iconSize = $derived(iconSizeMap[size]);
</script>

<div class="gr-step-indicator {className}" {...restProps}>
	<div class={badgeClass} role="img" aria-label={`Step ${number}${label ? ': ' + label : ''}`}>
		{#if displayIcon}
			{@const Icon = displayIcon}
			<Icon size={iconSize} />
		{:else}
			<span class="gr-step-number">{number}</span>
		{/if}
	</div>

	{#if label}
		<span class="gr-step-label">{label}</span>
	{/if}
</div>

<style>
	:global {
		.gr-step-indicator {
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			font-family: var(--gr-typography-fontFamily-sans);
		}

		.gr-step-badge {
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: var(--gr-typography-fontWeight-bold);
			border-radius: var(--gr-radii-full);
			transition: all 0.2s ease;
			border: 1px solid transparent;
		}

		/* Sizes */
		.gr-step-badge--sm {
			width: 2rem; /* 32px */
			height: 2rem;
			font-size: var(--gr-typography-fontSize-sm);
		}

		.gr-step-badge--md {
			width: 2.5rem; /* 40px */
			height: 2.5rem;
			font-size: var(--gr-typography-fontSize-base);
		}

		.gr-step-badge--lg {
			width: 3rem; /* 48px */
			height: 3rem;
			font-size: var(--gr-typography-fontSize-lg);
		}

		/* Variants & Colors */
		/* Filled */
		.gr-step-badge--filled.gr-step-badge--primary {
			background-color: var(--gr-color-primary-600);
			color: white;
		}
		.gr-step-badge--filled.gr-step-badge--success {
			background-color: var(--gr-color-success-600);
			color: white;
		}
		.gr-step-badge--filled.gr-step-badge--warning {
			background-color: var(--gr-color-warning-600);
			color: white;
		}
		.gr-step-badge--filled.gr-step-badge--error {
			background-color: var(--gr-color-error-600);
			color: white;
		}
		.gr-step-badge--filled.gr-step-badge--gray {
			background-color: var(--gr-color-gray-200);
			color: var(--gr-color-gray-600);
		}

		/* Outlined */
		.gr-step-badge--outlined {
			background-color: transparent;
		}
		.gr-step-badge--outlined.gr-step-badge--primary {
			border-color: var(--gr-color-primary-600);
			color: var(--gr-color-primary-600);
		}
		.gr-step-badge--outlined.gr-step-badge--success {
			border-color: var(--gr-color-success-600);
			color: var(--gr-color-success-600);
		}
		.gr-step-badge--outlined.gr-step-badge--warning {
			border-color: var(--gr-color-warning-600);
			color: var(--gr-color-warning-600);
		}
		.gr-step-badge--outlined.gr-step-badge--error {
			border-color: var(--gr-color-error-600);
			color: var(--gr-color-error-600);
		}
		.gr-step-badge--outlined.gr-step-badge--gray {
			border-color: var(--gr-color-gray-300);
			color: var(--gr-color-gray-500);
		}

		/* Ghost */
		.gr-step-badge--ghost {
			background-color: transparent;
		}
		.gr-step-badge--ghost.gr-step-badge--primary {
			color: var(--gr-color-primary-600);
		}
		/* ... styles for ghost colors if needed ... */
		.gr-step-badge--ghost.gr-step-badge--gray {
			color: var(--gr-color-gray-500);
		}

		.gr-step-label {
			font-size: var(--gr-typography-fontSize-sm);
			font-weight: var(--gr-typography-fontWeight-medium);
			color: var(--gr-color-gray-700);
			text-align: center;
		}
	}
</style>
