<!--
CritiqueCircle.History - Past critiques archive

@component
-->

<script lang="ts">
	import { getCritiqueCircleContext } from './context.js';
	import type { CritiqueSubmission } from '../../../types/community.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueCircleContext();
	const { circle, config } = ctx;

	// Filter state
	let searchQuery = $state('');
	let filterType = $state<'all' | 'received' | 'given'>('all');

	// Filtered history
	const filteredHistory = $derived(() => {
		let items = circle.history;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			items = items.filter(
				(item) =>
					item.artwork.title.toLowerCase().includes(query) ||
					item.artwork.artist.name.toLowerCase().includes(query) ||
					item.feedbackRequested?.toLowerCase().includes(query)
			);
		}

		// Filter by type (would need current user ID in real implementation)
		// For now, show all
		return items;
	});

	// Handle item selection
	function handleSelectItem(item: CritiqueSubmission) {
		ctx.selectedHistoryItem = ctx.selectedHistoryItem?.id === item.id ? null : item;
	}
</script>

{#if config.showHistory}
	<div class={`critique-history ${className}`}>
		<h3 class="critique-history__title">Critique History</h3>

		<!-- Filters -->
		<div class="critique-history__filters">
			<input
				type="search"
				placeholder="Search critiques..."
				bind:value={searchQuery}
				class="critique-history__search"
			/>
			<div class="critique-history__filter-buttons" role="tablist">
				<button
					type="button"
					role="tab"
					class="critique-history__filter-btn"
					class:active={filterType === 'all'}
					aria-selected={filterType === 'all'}
					onclick={() => (filterType = 'all')}
				>
					All
				</button>
				<button
					type="button"
					role="tab"
					class="critique-history__filter-btn"
					class:active={filterType === 'received'}
					aria-selected={filterType === 'received'}
					onclick={() => (filterType = 'received')}
				>
					Received
				</button>
				<button
					type="button"
					role="tab"
					class="critique-history__filter-btn"
					class:active={filterType === 'given'}
					aria-selected={filterType === 'given'}
					onclick={() => (filterType = 'given')}
				>
					Given
				</button>
			</div>
		</div>

		<!-- History list -->
		<div class="critique-history__list" role="list">
			{#if filteredHistory().length === 0}
				<p class="critique-history__empty">No critique history found.</p>
			{:else}
				{#each filteredHistory() as item (item.id)}
					<div role="listitem">
						<button
							type="button"
							class="critique-history__item"
							class:selected={ctx.selectedHistoryItem?.id === item.id}
							onclick={() => handleSelectItem(item)}
						>
							<img
								src={item.artwork.images.thumbnail}
								alt={item.artwork.altText}
								class="critique-history__thumbnail"
							/>
							<div class="critique-history__item-info">
								<span class="critique-history__item-title">{item.artwork.title}</span>
								<span class="critique-history__item-artist">
									by {item.artwork.artist.name}
								</span>
								<span class="critique-history__item-meta">
									{item.critiques.length} critique{item.critiques.length !== 1 ? 's' : ''} •
									{new Date(item.submittedAt).toLocaleDateString()}
								</span>
							</div>
							{#if item.isComplete}
								<span class="critique-history__complete-badge">Complete</span>
							{/if}
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Selected item detail -->
		{#if ctx.selectedHistoryItem}
			<div class="critique-history__detail">
				<h4>{ctx.selectedHistoryItem.artwork.title}</h4>
				{#if ctx.selectedHistoryItem.feedbackRequested}
					<div class="critique-history__feedback-requested">
						<strong>Feedback Requested:</strong>
						<p>{ctx.selectedHistoryItem.feedbackRequested}</p>
					</div>
				{/if}
				<div class="critique-history__critiques">
					{#each ctx.selectedHistoryItem.critiques as critique (critique.createdAt)}
						<div class="critique-history__critique">
							<div class="critique-history__critique-header">
								<span>{critique.authorName}</span>
								<time>{new Date(critique.createdAt).toLocaleDateString()}</time>
							</div>
							<p>{critique.summary}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.critique-history {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.critique-history__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0 0 var(--gr-spacing-scale-4) 0;
	}

	.critique-history__filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-3);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.critique-history__search {
		flex: 1;
		min-width: 200px;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
	}

	.critique-history__filter-buttons {
		display: flex;
		gap: var(--gr-spacing-scale-1);
	}

	.critique-history__filter-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: none;
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-300);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.critique-history__filter-btn:hover {
		background: var(--gr-color-gray-600);
	}

	.critique-history__filter-btn.active {
		background: var(--gr-color-primary-600);
		color: white;
	}

	.critique-history__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
		max-height: 400px;
		overflow-y: auto;
	}

	.critique-history__empty {
		text-align: center;
		color: var(--gr-color-gray-400);
		padding: var(--gr-spacing-scale-6);
	}

	.critique-history__item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 2px solid transparent;
		border-radius: var(--gr-radius-md);
		cursor: pointer;
		text-align: left;
		width: 100%;
		transition: border-color 0.2s;
	}

	.critique-history__item:hover {
		border-color: var(--gr-color-gray-500);
	}

	.critique-history__item.selected {
		border-color: var(--gr-color-primary-500);
	}

	.critique-history__thumbnail {
		width: 48px;
		height: 48px;
		object-fit: cover;
		border-radius: var(--gr-radius-sm);
	}

	.critique-history__item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.critique-history__item-title {
		font-weight: var(--gr-font-weight-medium);
	}

	.critique-history__item-artist {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.critique-history__item-meta {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
	}

	.critique-history__complete-badge {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-success-900);
		color: var(--gr-color-success-300);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
	}

	.critique-history__detail {
		margin-top: var(--gr-spacing-scale-4);
		padding-top: var(--gr-spacing-scale-4);
		border-top: 1px solid var(--gr-color-gray-700);
	}

	.critique-history__detail h4 {
		margin: 0 0 var(--gr-spacing-scale-3) 0;
	}

	.critique-history__feedback-requested {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
		margin-bottom: var(--gr-spacing-scale-3);
	}

	.critique-history__feedback-requested p {
		margin: var(--gr-spacing-scale-2) 0 0 0;
	}

	.critique-history__critiques {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.critique-history__critique {
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.critique-history__critique-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--gr-spacing-scale-2);
		font-size: var(--gr-font-size-sm);
	}

	.critique-history__critique-header time {
		color: var(--gr-color-gray-400);
	}

	.critique-history__critique p {
		margin: 0;
		line-height: 1.6;
	}

	@media (prefers-reduced-motion: reduce) {
		.critique-history__filter-btn,
		.critique-history__item {
			transition: none;
		}
	}
</style>
