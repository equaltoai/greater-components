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

<style>
	.timeline-empty {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		padding: var(--timeline-spacing-lg, 2rem);
		background: var(--timeline-empty-bg, white);
	}

	.timeline-empty__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 400px;
	}

	.timeline-empty__icon {
		width: 64px;
		height: 64px;
		margin-bottom: 1rem;
		color: var(--timeline-text-secondary, #536471);
		opacity: 0.5;
	}

	.timeline-empty__icon svg {
		width: 100%;
		height: 100%;
	}

	.timeline-empty__title {
		margin: 0 0 0.5rem 0;
		font-size: var(--timeline-font-size-xl, 1.25rem);
		font-weight: 700;
		color: var(--timeline-text-primary, #0f1419);
	}

	.timeline-empty__description {
		margin: 0 0 1.5rem 0;
		font-size: var(--timeline-font-size-base, 1rem);
		color: var(--timeline-text-secondary, #536471);
		line-height: 1.5;
	}

	.timeline-empty__action {
		margin-top: 0.5rem;
	}
</style>
