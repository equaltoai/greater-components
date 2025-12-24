<!--
Artwork.AIDisclosure - AI usage transparency component

REQ-PHIL-005: Transparency about AI usage.
Badge variant for compact display.
Expandable for detailed breakdown.
Consistent iconography.

@component
@example
```svelte
<Artwork.Root artwork={artworkData}>
  <Artwork.AIDisclosure variant="badge" expandable />
</Artwork.Root>
```
-->

<script lang="ts">
	import { getArtworkContext } from './context.js';

	interface Props {
		/**
		 * Display variant
		 */
		variant?: 'badge' | 'detailed' | 'inline';

		/**
		 * Allow expansion to show details
		 */
		expandable?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { variant = 'badge', expandable = true, class: className = '' }: Props = $props();

	const context = getArtworkContext();
	const { artwork, config } = context;
	const { aiUsage } = artwork;

	// Expanded state
	let isExpanded = $state(false);

	// Toggle expanded state
	function toggleExpanded() {
		if (expandable) {
			isExpanded = !isExpanded;
		}
	}

	// Compute CSS classes
	const disclosureClass = $derived(
		[
			'gr-artist-artwork-ai-disclosure',
			`gr-artist-artwork-ai-disclosure--${variant}`,
			isExpanded && 'gr-artist-artwork-ai-disclosure--expanded',
			className,
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if aiUsage?.hasAI && config.showAIDisclosure}
	<div class={disclosureClass}>
		{#if variant === 'badge'}
			<button
				class="gr-artist-artwork-ai-badge"
				onclick={toggleExpanded}
				aria-expanded={expandable ? isExpanded : undefined}
				aria-label="AI-assisted artwork"
				disabled={!expandable}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
				<span>AI</span>
			</button>
		{:else if variant === 'inline'}
			<span class="gr-artist-artwork-ai-inline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
				AI-assisted
			</span>
		{/if}

		{#if (variant === 'detailed' || isExpanded) && aiUsage}
			<div class="gr-artist-artwork-ai-details" role="region" aria-label="AI usage details">
				{#if aiUsage.tools?.length}
					<div class="gr-artist-artwork-ai-detail">
						<span class="gr-artist-artwork-ai-detail-label">Tools used:</span>
						<span class="gr-artist-artwork-ai-detail-value">
							{aiUsage.tools.join(', ')}
						</span>
					</div>
				{/if}

				{#if aiUsage.percentage !== undefined}
					<div class="gr-artist-artwork-ai-detail">
						<span class="gr-artist-artwork-ai-detail-label">AI contribution:</span>
						<span class="gr-artist-artwork-ai-detail-value">
							{aiUsage.percentage}%
						</span>
					</div>
				{/if}

				{#if aiUsage.description}
					<div class="gr-artist-artwork-ai-detail">
						<span class="gr-artist-artwork-ai-detail-label">Description:</span>
						<span class="gr-artist-artwork-ai-detail-value">
							{aiUsage.description}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.gr-artist-artwork-ai-disclosure {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
	}

	.gr-artist-artwork-ai-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-artist-bg-elevated, var(--gr-color-gray-850));
		border: 1px solid var(--gr-color-gray-700);
		border-radius: var(--gr-radii-sm);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
		font-size: var(--gr-typography-fontSize-xs);
		cursor: pointer;
		transition:
			color var(--gr-artist-transition-hover, 200ms ease-out),
			border-color var(--gr-artist-transition-hover, 200ms ease-out);
	}

	.gr-artist-artwork-ai-badge:hover:not(:disabled),
	.gr-artist-artwork-ai-badge:focus:not(:disabled) {
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
		border-color: var(--gr-color-gray-500);
	}

	.gr-artist-artwork-ai-badge:focus-visible {
		outline: 2px solid var(--gr-color-primary-500);
		outline-offset: 2px;
	}

	.gr-artist-artwork-ai-badge:disabled {
		cursor: default;
	}

	.gr-artist-artwork-ai-badge svg {
		width: 12px;
		height: 12px;
	}

	.gr-artist-artwork-ai-inline {
		display: inline-flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	.gr-artist-artwork-ai-inline svg {
		width: 12px;
		height: 12px;
	}

	.gr-artist-artwork-ai-details {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-artist-bg-elevated, var(--gr-color-gray-850));
		border-radius: var(--gr-radii-sm);
	}

	.gr-artist-artwork-ai-detail {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.gr-artist-artwork-ai-detail-label {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-artist-adaptive-muted, var(--gr-color-gray-500));
	}

	.gr-artist-artwork-ai-detail-value {
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-artist-adaptive-text, var(--gr-color-gray-100));
	}

	/* REQ-A11Y-007: Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.gr-artist-artwork-ai-badge {
			transition: none;
		}
	}
</style>
