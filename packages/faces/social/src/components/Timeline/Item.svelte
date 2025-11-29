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
	import { formatDateTime } from '@equaltoai/greater-components-utils';

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
		 * Custom tombstone rendering
		 */
		tombstone?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { item, index, children, tombstone, class: className = '' }: Props = $props();

	const context = getTimelineContext();
	const deletedAt = $derived(
		(item?.metadata as { lesser?: { deletedAt?: string } } | undefined)?.lesser?.deletedAt ||
			(item as { status?: { deletedAt?: string } } | undefined)?.status?.deletedAt
	);
	const deletedLabel = $derived(() => {
		if (!deletedAt) return null;
		const parsed = formatDateTime(deletedAt);
		return parsed.relative;
	});
	const isTombstone = $derived(
		item?.type === 'tombstone' ||
			(item?.metadata as { lesser?: { isDeleted?: boolean } } | undefined)?.lesser?.isDeleted ===
				true ||
			(item as { status?: { isDeleted?: boolean } } | undefined)?.status?.isDeleted === true
	);

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

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			context.handlers.onItemClick?.(item, index);
		}
	}
</script>

<article
	class={`timeline-item ${className}`}
	data-index={index}
	data-status-id={item.id}
	aria-posinset={index + 1}
	aria-setsize={context.state.itemCount}
>
	{#if isTombstone}
		<div class="timeline-item__tombstone">
			{#if tombstone}
				{@render tombstone()}
			{:else}
				<div class="timeline-item__tombstone-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 16h-2v-2h2zm0-4h-2V7h2z"
						/>
					</svg>
				</div>
				<div>
					<p class="timeline-item__tombstone-title">This post has been deleted.</p>
					{#if deletedLabel}
						<p class="timeline-item__tombstone-meta">Deleted {deletedLabel}</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else if context.handlers.onItemClick}
		<div
			class="timeline-item__interactive"
			role="button"
			tabindex={0}
			onclick={handleClick}
			onkeydown={handleKeyDown}
		>
			{#if children}
				{@render children()}
			{/if}
		</div>
	{:else}
		<div class="timeline-item__interactive">
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</article>
