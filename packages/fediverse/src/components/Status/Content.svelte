<!--
Status.Content - Display status content with content warnings

Handles HTML content rendering, mentions, hashtags, and content warnings.
Uses ContentRenderer for safe HTML display.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Content />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';
	import ContentRenderer from '../ContentRenderer.svelte';

	interface Props {
		/**
		 * Custom content rendering
		 */
		content?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	const context = getStatusContext();
	const { actualStatus } = context;
</script>

<div class={`status-content ${className}`}>
	{#if content}
		{@render content()}
	{:else}
		<ContentRenderer
			content={actualStatus.content}
			spoilerText={actualStatus.spoilerText}
			mentions={actualStatus.mentions}
			tags={actualStatus.tags}
		/>
	{/if}
</div>

<style>
	.status-content {
		margin: var(--status-spacing-sm, 0.5rem) 0;
		color: var(--status-text-primary, #0f1419);
		font-size: var(--status-font-size-base, 1rem);
		line-height: 1.5;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	/* Content links styling */
	.status-content :global(a) {
		color: var(--status-link-color, #1d9bf0);
		text-decoration: none;
	}

	.status-content :global(a:hover) {
		text-decoration: underline;
	}

	/* Mentions styling */
	.status-content :global(.mention) {
		color: var(--status-mention-color, #1d9bf0);
		font-weight: 500;
	}

	/* Hashtags styling */
	.status-content :global(.hashtag) {
		color: var(--status-hashtag-color, #1d9bf0);
		font-weight: 500;
	}

	/* Compact density adjustments */
	.status-root--compact .status-content {
		font-size: var(--status-font-size-sm, 0.875rem);
		margin: var(--status-spacing-xs, 0.25rem) 0;
	}
</style>
