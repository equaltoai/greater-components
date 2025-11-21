<!--
ListItem component - A single item within a List component.
Automatically inherits icon and styling from parent List.

@component
@example
```svelte
<ListItem>Feature description</ListItem>
<ListItem icon={CustomIcon}>Overridden icon</ListItem>
```
-->
<script lang="ts">
	import { getContext, type Component, type Snippet } from 'svelte';

	interface Props {
		/**
		 * Icon to display for this item (overrides List icon).
		 */
		icon?: Component;

		/**
		 * Color of the icon (overrides List iconColor).
		 */
		iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'gray';

		/**
		 * Additional CSS classes.
		 */
		class?: string;

		/**
		 * Item content.
		 */
		children: Snippet;
	}

	let { icon, iconColor, class: className = '', children, ...restProps }: Props = $props();

	const listContext =
		getContext<{
			icon?: Component;
			iconColor?: string;
			iconSize?: number;
		}>('list-context') || {};

	const displayIcon = $derived(icon || listContext.icon);
	const displayColor = $derived(iconColor || listContext.iconColor || 'primary');
	const displaySize = $derived(listContext.iconSize || 20);

	const iconClass = $derived(`gr-list-item__icon gr-list-item__icon--${displayColor}`);
</script>

<li class="gr-list-item {className}" {...restProps}>
	{#if displayIcon}
		{@const Icon = displayIcon}
		<span class={iconClass} aria-hidden="true">
			<Icon size={displaySize} />
		</span>
	{/if}
	<div class="gr-list-item__content">
		{@render children()}
	</div>
</li>

<style>
	:global {
		.gr-list-item {
			display: flex;
			align-items: flex-start;
			gap: 0.75rem;
			line-height: 1.5;
		}

		.gr-list-item__icon {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 0.125rem; /* Optical alignment with text */
		}

		.gr-list-item__content {
			flex: 1;
			min-width: 0;
		}

		/* Colors */
		.gr-list-item__icon--primary {
			color: var(--gr-color-primary-600);
		}

		.gr-list-item__icon--success {
			color: var(--gr-color-success-600);
		}

		.gr-list-item__icon--warning {
			color: var(--gr-color-warning-600);
		}

		.gr-list-item__icon--error {
			color: var(--gr-color-error-600);
		}

		.gr-list-item__icon--gray {
			color: var(--gr-color-gray-500);
		}
	}
</style>
