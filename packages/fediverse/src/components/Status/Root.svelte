<!--
Status.Root - Container component for Status compound components

Provides context for child components and handles root-level interactions.

@component
@example
```svelte
<Status.Root status={post} config={{ density: 'comfortable' }}>
  <Status.Header />
  <Status.Content />
  <Status.Media />
  <Status.Actions />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { GenericStatus } from '../../generics/index.js';
	import { createStatusContext } from './context.js';
	import type { StatusConfig, StatusActionHandlers } from './context.js';

	interface Props {
		/**
		 * Status data to display
		 */
		status: GenericStatus;

		/**
		 * Configuration options
		 */
		config?: StatusConfig;

		/**
		 * Action handlers
		 */
		handlers?: StatusActionHandlers;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { status, config = {}, handlers = {}, children }: Props = $props();

	// Create context for child components
	const context = $derived(createStatusContext(status, config, handlers));

	/**
	 * Handle root element click
	 */
	function handleClick(event: MouseEvent) {
		if (!context.config.clickable) return;

		// Don't trigger if clicking on links or buttons
		const target = event.target as HTMLElement;
		if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
			return;
		}

		context.handlers.onClick?.(status);
	}

	/**
	 * Handle keyboard activation
	 */
	function handleKeyPress(event: KeyboardEvent) {
		if (!context.config.clickable) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			context.handlers.onClick?.(status);
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
	class="status-root {context.config.class}"
	class:status-root--compact={context.config.density === 'compact'}
	class:status-root--comfortable={context.config.density === 'comfortable'}
	class:status-root--clickable={context.config.clickable}
	role={context.config.clickable ? 'button' : undefined}
	tabindex={context.config.clickable ? 0 : undefined}
	onclick={context.config.clickable ? handleClick : undefined}
	onkeypress={context.config.clickable ? handleKeyPress : undefined}
	aria-label={context.config.clickable
		? `Status by ${context.account.displayName || context.account.username}`
		: undefined}
>
	{#if children}
		{@render children()}
	{/if}
</article>

<style>
	.status-root {
		padding: var(--status-padding, 1rem);
		border-bottom: 1px solid var(--status-border-color, #e1e8ed);
		background: var(--status-bg, white);
		transition: background-color 0.2s;
	}

	.status-root--compact {
		padding: var(--status-padding-compact, 0.75rem);
	}

	.status-root--comfortable {
		padding: var(--status-padding-comfortable, 1rem);
	}

	.status-root--clickable {
		cursor: pointer;
	}

	.status-root--clickable:hover {
		background: var(--status-bg-hover, #f7f9fa);
	}

	.status-root--clickable:focus {
		outline: 2px solid var(--status-focus-ring, #3b82f6);
		outline-offset: -2px;
	}

	/* Allow customization via CSS custom properties */
	:global(.status-root) {
		--status-spacing-xs: 0.25rem;
		--status-spacing-sm: 0.5rem;
		--status-spacing-md: 1rem;
		--status-spacing-lg: 1.5rem;
	}
</style>
