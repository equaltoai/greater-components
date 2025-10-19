<!--
  Filters.FilteredContent - Display for Filtered Items
  
  Shows content that has been filtered with option to reveal.
  Displays as a warning banner or completely hidden based on filter settings.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getFiltersContext, type ContentFilter, type FilterContext } from './context.js';

	interface Props {
		/**
		 * Content to check for filters
		 */
		content: string;

		/**
		 * Context where this content is shown
		 */
		context: FilterContext;

		/**
		 * Child content to show if not filtered or when revealed
		 */
		children?: Snippet;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Callback when content is revealed
		 */
		onReveal?: (matchedFilters: ContentFilter[]) => void;
	}

	let { content, context, children, class: className = '', onReveal }: Props = $props();

	const filtersContext = getFiltersContext();

	let revealed = $state(false);

	const matchedFilters = $derived(filtersContext.checkFilters(content, context));
	const isFiltered = $derived(matchedFilters.length > 0);
	const isIrreversible = $derived(matchedFilters.some((f) => f.irreversible));

	// If any filter is irreversible (hide completely), don't show content at all
	const shouldHideCompletely = $derived(isIrreversible && !revealed);
	const shouldShowWarning = $derived(isFiltered && !isIrreversible && !revealed);

	const revealButton = createButton({
		onClick: () => {
			revealed = true;
			onReveal?.(matchedFilters);
		},
	});

	function formatFilteredBy(filters: ContentFilter[]): string {
		if (filters.length === 0) return '';
		if (filters.length === 1) return `"${filters[0]?.phrase}"`;
		const phrases = filters.slice(0, 2).map((f) => f.phrase);
		const remaining = filters.length - 2;
		if (remaining > 0) {
			return `"${phrases.join('", "')}" and ${remaining} more`;
		}
		return `"${phrases.join('", "')}"`;
	}

	let previousContent = '';
	let previousFilterSignature = '';

	// Reset revealed state when content or matching filters change
	$effect(() => {
		const currentContent = content;
		const currentSignature = matchedFilters.map((filter) => filter.id).join(',');

		if (currentContent !== previousContent || currentSignature !== previousFilterSignature) {
			previousContent = currentContent;
			previousFilterSignature = currentSignature;
			revealed = false;
		}
	});
</script>

{#if shouldHideCompletely}
	<!-- Content is completely hidden (irreversible filter) -->
	<div class={`filtered-content__hidden ${className}`}>
		<svg class="filtered-content__hidden-icon" viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
			/>
		</svg>
		<p class="filtered-content__hidden-text">
			Filtered: {formatFilteredBy(matchedFilters)}
		</p>
	</div>
{:else if shouldShowWarning}
	<!-- Content is hidden with warning (can be revealed) -->
	<div class={`filtered-content__warning ${className}`}>
		<div class="filtered-content__warning-content">
			<svg class="filtered-content__warning-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			<div class="filtered-content__warning-text">
				<strong>Content filtered</strong>
				<p>Filtered by {formatFilteredBy(matchedFilters)}</p>
			</div>
		</div>
		<button use:revealButton.actions.button class="filtered-content__reveal-button">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
				/>
			</svg>
			Show anyway
		</button>
	</div>
{:else}
	<!-- Content is not filtered or has been revealed -->
	{#if children}
		{@render children()}
	{/if}
{/if}

<style>
	.filtered-content__hidden {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		color: var(--text-secondary, #536471);
	}

	.filtered-content__hidden-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.filtered-content__hidden-text {
		margin: 0;
		font-size: 0.875rem;
	}

	.filtered-content__warning {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 152, 0, 0.1);
		border: 1px solid rgba(255, 152, 0, 0.3);
		border-radius: 0.5rem;
	}

	.filtered-content__warning-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.filtered-content__warning-icon {
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		color: #ff9800;
	}

	.filtered-content__warning-text {
		flex: 1;
		min-width: 0;
	}

	.filtered-content__warning-text strong {
		display: block;
		font-size: 0.9375rem;
		margin-bottom: 0.25rem;
	}

	.filtered-content__warning-text p {
		margin: 0;
		font-size: 0.8125rem;
		color: var(--text-secondary, #536471);
	}

	.filtered-content__reveal-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: white;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.filtered-content__reveal-button:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.filtered-content__reveal-button svg {
		width: 1rem;
		height: 1rem;
	}
</style>
