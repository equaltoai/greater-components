<!--
Timeline.Item - Individual timeline item wrapper

Wraps status content with timeline-specific behavior and styling.
Can be used with Status compound component or custom content.

@component
@example
```svelte
<Timeline.Root {items}>
  {#each items as status, index}
    <Timeline.Item {status} {index}>
      <Status.Root {status}>
        <Status.Header />
        <Status.Content />
        <Status.Actions />
      </Status.Root>
    </Timeline.Item>
  {/each}
</Timeline.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { GenericTimelineItem } from '../../generics/index.js';
	import { getTimelineContext } from './context.js';

	interface Props {
		/**
		 * Timeline item data
		 */
		item: GenericTimelineItem;

		/**
		 * Index in the timeline
		 */
		index: number;

		/**
		 * Custom content rendering
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { item, index, children, class: className = '' }: Props = $props();

	const context = getTimelineContext();

	/**
	 * Handle item click
	 */
	function handleClick(event: MouseEvent) {
		// Don't trigger if clicking on interactive elements
		const target = event.target as HTMLElement;
		if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
			return;
		}

		context.handlers.onItemClick?.(item, index);
	}
</script>

<article
	class={`timeline-item ${className}`}
	data-index={index}
	data-status-id={status.id}
	onclick={context.handlers.onItemClick ? handleClick : undefined}
	role="article"
	aria-posinset={index + 1}
	aria-setsize={context.state.itemCount}
>
	{#if children}
		{@render children()}
	{/if}
</article>

<style>
	.timeline-item {
		width: 100%;
		border-bottom: 1px solid var(--timeline-border, #e1e8ed);
		background: var(--timeline-item-bg, white);
		transition: background-color 0.2s;
	}

	.timeline-item:hover {
		background: var(--timeline-item-hover-bg, #f7f9fa);
	}

	.timeline-item:focus-within {
		outline: 2px solid var(--timeline-focus-ring, #3b82f6);
		outline-offset: -2px;
	}

	/* Remove border from last item */
	.timeline-item:last-child {
		border-bottom: none;
	}
</style>
