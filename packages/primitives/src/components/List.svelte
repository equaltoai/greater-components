<script lang="ts">
	import { setContext, type Component, type Snippet } from 'svelte';

	interface Props {
		icon?: Component;
		iconColor?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
		iconSize?: number;
		spacing?: 'sm' | 'md' | 'lg';
		maxWidth?: string | number;
		ordered?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		icon,
		iconColor = 'primary',
		iconSize = 20,
		spacing = 'md',
		maxWidth,
		ordered = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	setContext('list-context', {
		icon,
		iconColor,
		iconSize,
	});

	const listClass = $derived(
		['gr-list', `gr-list--spacing-${spacing}`, className].filter(Boolean).join(' ')
	);

	const style = $derived(
		maxWidth ? `max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth};` : ''
	);
</script>

{#if ordered}
	<ol class={listClass} {style} {...restProps}>
		{@render children()}
	</ol>
{:else}
	<ul class={listClass} {style} {...restProps}>
		{@render children()}
	</ul>
{/if}

<style>
	:global {
		.gr-list {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
		}

		.gr-list--spacing-sm {
			gap: 0.5rem;
		}

		.gr-list--spacing-md {
			gap: 1rem;
		}

		.gr-list--spacing-lg {
			gap: 1.5rem;
		}

		.gr-list > :global(li) {
			display: flex;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}
</style>
