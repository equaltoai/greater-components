<!--
Status.LesserMetadata - Display Lesser-specific metadata

Shows cost estimates, trust scores, moderation signals, and quote information
for statuses from Lesser instances.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Header />
  <Status.Content />
  <Status.LesserMetadata />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';

	interface Props {
		/**
		 * Show estimated cost badge
		 */
		showCost?: boolean;

		/**
		 * Show trust score badge
		 */
		showTrust?: boolean;

		/**
		 * Show moderation warnings
		 */
		showModeration?: boolean;

		/**
		 * Show quote indicators
		 */
		showQuotes?: boolean;

		/**
		 * Custom metadata rendering
		 */
		metadata?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		showCost = true,
		showTrust = true,
		showModeration = true,
		showQuotes = true,
		metadata,
		class: className = '',
	}: Props = $props();

	import type { Status as FediverseStatus, Account as FediverseAccount } from '../../types.js';

	const context = getStatusContext();
	const { actualStatus, account } = context;

	// Cast to extended Status type from types.ts (populated by unified adapter layer)
	const status = actualStatus as unknown as FediverseStatus;
	const acct = account as unknown as FediverseAccount;

	const estimatedCost = $derived(status.estimatedCost);
	const trustScore = $derived(acct.trustScore);
	const moderationScore = $derived(status.moderationScore);
	const aiAnalysis = $derived(status.aiAnalysis);
	const quoteUrl = $derived(status.quoteUrl);
	const quoteCount = $derived(status.quoteCount);
	const quoteable = $derived(status.quoteable);

	// Computed flags
	const hasLesserData = $derived(
		estimatedCost !== undefined ||
			trustScore !== undefined ||
			moderationScore !== undefined ||
			quoteUrl !== undefined
	);

	const hasModerationWarning = $derived(
		aiAnalysis?.moderationAction && aiAnalysis.moderationAction !== 'NONE'
	);

	// Format cost in dollars
	const formattedCost = $derived(estimatedCost ? `$${(estimatedCost / 1000000).toFixed(4)}` : null);

	// Trust score color
	const trustColor = $derived(() => {
		if (!trustScore) return 'gray';
		if (trustScore >= 80) return 'green';
		if (trustScore >= 50) return 'yellow';
		return 'red';
	});
</script>

{#if hasLesserData}
	<div class={`status-lesser-metadata ${className}`}>
		{#if metadata}
			{@render metadata()}
		{:else}
			<div class="status-lesser-metadata__badges">
				<!-- Cost Badge -->
				{#if showCost && estimatedCost !== undefined}
					<span class="lesser-badge lesser-badge--cost" title="Estimated processing cost">
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
							/>
						</svg>
						{formattedCost}
					</span>
				{/if}

				<!-- Trust Score Badge -->
				{#if showTrust && trustScore !== undefined}
					<span
						class={`lesser-badge lesser-badge--trust lesser-badge--trust-${trustColor()}`}
						title={`Account trust score: ${trustScore}/100`}
					>
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
							/>
						</svg>
						{trustScore}
					</span>
				{/if}

				<!-- Moderation Warning -->
				{#if showModeration && hasModerationWarning}
					<span
						class="lesser-badge lesser-badge--moderation"
						title={`AI moderation: ${aiAnalysis?.moderationAction}`}
					>
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
						</svg>
						Flagged
					</span>
				{/if}

				<!-- Quote Indicator -->
				{#if showQuotes && quoteUrl}
					<span class="lesser-badge lesser-badge--quote" title="This is a quote post">
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
						</svg>
						Quote
					</span>
				{/if}

				<!-- Quote Count -->
				{#if showQuotes && quoteCount !== undefined && quoteCount > 0}
					<span class="lesser-badge lesser-badge--quote-count" title={`${quoteCount} quotes`}>
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path fill="currentColor" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
						</svg>
						{quoteCount}
					</span>
				{/if}

				<!-- Not Quoteable Indicator -->
				{#if showQuotes && quoteable === false}
					<span class="lesser-badge lesser-badge--not-quoteable" title="Cannot be quoted">
						<svg class="lesser-badge__icon" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="currentColor"
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
							/>
						</svg>
						No quotes
					</span>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.status-lesser-metadata {
		margin-top: var(--status-spacing-xs, 0.25rem);
	}

	.status-lesser-metadata__badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--status-spacing-xs, 0.25rem);
		align-items: center;
	}

	.lesser-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		background: var(--status-bg-secondary, #f7f9fa);
		border: 1px solid var(--status-border-color, #e1e8ed);
		border-radius: var(--status-radius-sm, 4px);
		font-size: var(--status-font-size-xs, 0.75rem);
		font-weight: 500;
		line-height: 1.4;
		color: var(--status-text-secondary, #536471);
		white-space: nowrap;
	}

	.lesser-badge__icon {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	.lesser-badge--cost {
		color: var(--lesser-cost-color, #10b981);
		border-color: var(--lesser-cost-border, #a7f3d0);
		background: var(--lesser-cost-bg, #d1fae5);
	}

	.lesser-badge--trust-green {
		color: var(--lesser-trust-good-color, #10b981);
		border-color: var(--lesser-trust-good-border, #a7f3d0);
		background: var(--lesser-trust-good-bg, #d1fae5);
	}

	.lesser-badge--trust-yellow {
		color: var(--lesser-trust-medium-color, #f59e0b);
		border-color: var(--lesser-trust-medium-border, #fde68a);
		background: var(--lesser-trust-medium-bg, #fef3c7);
	}

	.lesser-badge--trust-red {
		color: var(--lesser-trust-low-color, #ef4444);
		border-color: var(--lesser-trust-low-border, #fecaca);
		background: var(--lesser-trust-low-bg, #fee2e2);
	}

	.lesser-badge--moderation {
		color: var(--lesser-moderation-color, #ef4444);
		border-color: var(--lesser-moderation-border, #fecaca);
		background: var(--lesser-moderation-bg, #fee2e2);
	}

	.lesser-badge--quote,
	.lesser-badge--quote-count {
		color: var(--lesser-quote-color, #3b82f6);
		border-color: var(--lesser-quote-border, #bfdbfe);
		background: var(--lesser-quote-bg, #dbeafe);
	}

	.lesser-badge--not-quoteable {
		color: var(--lesser-no-quote-color, #6b7280);
		border-color: var(--lesser-no-quote-border, #d1d5db);
		background: var(--lesser-no-quote-bg, #f3f4f6);
	}
</style>
