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
