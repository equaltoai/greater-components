<!--
Timeline.ErrorState - Display error state

Shows error message with retry action.

@component
@example
```svelte
<Timeline.Root {items} {initialState}>
  {#if initialState.error}
    <Timeline.ErrorState
      error={initialState.error}
      onRetry={handleRetry}
    />
  {/if}
</Timeline.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createButton } from '@greater/headless/button';

	interface Props {
		/**
		 * Error object or message
		 */
		error: Error | string;

		/**
		 * Retry handler
		 */
		onRetry?: () => Promise<void> | void;

		/**
		 * Custom error icon
		 */
		icon?: Snippet;

		/**
		 * Custom content
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { error, onRetry, icon, children, class: className = '' }: Props = $props();

	const errorMessage = $derived(typeof error === 'string' ? error : error.message);

	const retryButton = createButton({
		onClick: async () => {
			if (!onRetry) return;

			retryButton.helpers.setLoading(true);
			try {
				await onRetry();
			} finally {
				retryButton.helpers.setLoading(false);
			}
		},
	});
</script>

<div class="timeline-error {className}" role="alert">
	{#if children}
		{@render children()}
	{:else}
		<div class="timeline-error__content">
			{#if icon}
				<div class="timeline-error__icon">
					{@render icon()}
				</div>
			{:else}
				<div class="timeline-error__icon">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="currentColor"
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						/>
					</svg>
				</div>
			{/if}

			<h3 class="timeline-error__title">Something went wrong</h3>

			<p class="timeline-error__message">{errorMessage}</p>

			{#if onRetry}
				<button use:retryButton.actions.button class="timeline-error__retry">
					{#if retryButton.state.loading}
						Retrying...
					{:else}
						Try again
					{/if}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.timeline-error {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		padding: var(--timeline-spacing-lg, 2rem);
		background: var(--timeline-error-bg, #fff5f5);
		border: 1px solid var(--timeline-error-border, #fee);
	}

	.timeline-error__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: 400px;
	}

	.timeline-error__icon {
		width: 64px;
		height: 64px;
		margin-bottom: 1rem;
		color: var(--timeline-error-color, #dc2626);
	}

	.timeline-error__icon svg {
		width: 100%;
		height: 100%;
	}

	.timeline-error__title {
		margin: 0 0 0.5rem 0;
		font-size: var(--timeline-font-size-xl, 1.25rem);
		font-weight: 700;
		color: var(--timeline-error-color, #dc2626);
	}

	.timeline-error__message {
		margin: 0 0 1.5rem 0;
		font-size: var(--timeline-font-size-base, 1rem);
		color: var(--timeline-text-secondary, #536471);
		line-height: 1.5;
	}

	.timeline-error__retry {
		padding: 0.75rem 2rem;
		background: var(--timeline-error-color, #dc2626);
		color: white;
		border: none;
		border-radius: var(--timeline-button-radius, 9999px);
		font-size: var(--timeline-font-size-base, 1rem);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.timeline-error__retry:hover {
		background: var(--timeline-error-hover-color, #b91c1c);
		transform: translateY(-1px);
	}

	.timeline-error__retry:active {
		transform: translateY(0);
	}

	.timeline-error__retry:disabled {
		opacity: 0.6;
		cursor: wait;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.timeline-error__retry {
			transition: none;
		}
	}
</style>
