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
	import { createButton } from '@equaltoai/greater-components-headless/button';

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

<div class={`timeline-error ${className}`} role="alert">
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
