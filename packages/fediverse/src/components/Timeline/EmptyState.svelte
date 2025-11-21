<!--
Timeline.EmptyState - Display when timeline has no items

Shows a message and optional action when timeline is empty.

@component
@example
```svelte
<Timeline.Root {items}>
  {#if items.length === 0}
    <Timeline.EmptyState
      title="No posts yet"
      description="Follow some accounts to see posts here"
    />
  {:else}
    ...items...
  {/if}
</Timeline.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Main title text
		 */
		title?: string;

		/**
		 * Description text
		 */
		description?: string;

		/**
		 * Icon to display
		 */
		icon?: Snippet;

		/**
		 * Action button/content
		 */
		action?: Snippet;

		/**
		 * Custom content
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		title = 'No posts',
		description = 'There are no posts to display',
		icon,
		action,
		children,
		class: className = '',
	}: Props = $props();
</script>

<div class={`timeline-empty ${className}`} role="status">
	{#if children}
		{@render children()}
	{:else}
		<div class="timeline-empty__content">
			{#if icon}
				<div class="timeline-empty__icon">
					{@render icon()}
				</div>
			{:else}
				<div class="timeline-empty__icon">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2zm15-13H2v18l4-4h16V2zm-2 14H5.17L4 17.17V4h18v12z"
						/>
					</svg>
				</div>
			{/if}

			<h3 class="timeline-empty__title">{title}</h3>

			<p class="timeline-empty__description">{description}</p>

			{#if action}
				<div class="timeline-empty__action">
					{@render action()}
				</div>
			{/if}
		</div>
	{/if}
</div>
