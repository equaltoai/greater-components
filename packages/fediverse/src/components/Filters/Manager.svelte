<!--
  Filters.Manager - Filter List and Management
  
  Displays all content filters with actions to create, edit, and delete.
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getFiltersContext, formatExpiration, type ContentFilter } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: filtersState, deleteFilter, openEditor } = getFiltersContext();

	let deleteConfirmFilter = $state<ContentFilter | null>(null);
	let isDeleteModalOpen = $derived(deleteConfirmFilter !== null);

	const deleteModal = createModal();

	$effect(() => {
		if (isDeleteModalOpen) {
			deleteModal.helpers.open();
		} else {
			deleteModal.helpers.close();
		}
	});

	const newFilterButton = createButton({
		onClick: () => openEditor(),
	});

	function confirmDelete(filter: ContentFilter) {
		deleteConfirmFilter = filter;
	}

	async function handleDelete() {
		if (!deleteConfirmFilter) return;

		try {
			await deleteFilter(deleteConfirmFilter.id);
			deleteConfirmFilter = null;
		} catch {
			// Error handled by context
		}
	}

	const cancelDeleteButton = createButton({
		onClick: () => {
			deleteConfirmFilter = null;
		},
	});

	const confirmDeleteButton = createButton({
		onClick: () => handleDelete(),
	});

	function formatContexts(contexts: string[]): string {
		return contexts.join(', ');
	}
</script>

<div class={`filters-manager ${className}`}>
	<div class="filters-manager__header">
		<div>
			<h2 class="filters-manager__title">Content Filters</h2>
			<p class="filters-manager__subtitle">Hide posts containing specific words or phrases</p>
		</div>
		<button use:newFilterButton.actions.button class="filters-manager__new-button">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
			</svg>
			New Filter
		</button>
	</div>

	{#if filtersState.error}
		<div class="filters-manager__error" role="alert">
			{filtersState.error}
		</div>
	{/if}

	{#if filtersState.loading}
		<div class="filters-manager__loading">
			<div class="filters-manager__spinner"></div>
			<p>Loading filters...</p>
		</div>
	{:else if filtersState.filters.length === 0}
		<div class="filters-manager__empty">
			<svg class="filters-manager__empty-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
				/>
			</svg>
			<h3>No filters yet</h3>
			<p>Create a filter to hide posts containing specific words or phrases</p>
		</div>
	{:else}
		<div class="filters-manager__list">
			{#each filtersState.filters as filter (filter.id)}
				<div class="filters-manager__item">
					<div class="filters-manager__item-content">
						<div class="filters-manager__item-phrase">
							<strong>{filter.phrase}</strong>
							{#if filter.wholeWord}
								<span class="filters-manager__badge">Whole word</span>
							{/if}
						</div>

						<div class="filters-manager__item-details">
							<span class="filters-manager__detail">
								<svg class="filters-manager__icon" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
									/>
								</svg>
								{formatContexts(filter.context)}
							</span>

							{#if filter.expiresAt}
								<span class="filters-manager__detail">
									<svg class="filters-manager__icon" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
										/>
										<path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
									</svg>
									Expires in {formatExpiration(filter.expiresAt)}
								</span>
							{/if}

							<span class="filters-manager__detail">
								<svg class="filters-manager__icon" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
									/>
								</svg>
								{filter.irreversible ? 'Hide completely' : 'Show with warning'}
							</span>
						</div>
					</div>

					<div class="filters-manager__item-actions">
						<button
							class="filters-manager__action-button"
							onclick={() => openEditor(filter)}
							title="Edit filter"
							aria-label={`Edit filter ${filter.phrase}`}
						>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
								/>
							</svg>
						</button>

						<button
							class="filters-manager__action-button filters-manager__action-button--danger"
							onclick={() => confirmDelete(filter)}
							title="Delete filter"
							aria-label={`Delete filter ${filter.phrase}`}
						>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>

		<div class="filters-manager__stats">
			<p>
				{filtersState.stats.totalFilters} active filter{filtersState.stats.totalFilters === 1
					? ''
					: 's'}
			</p>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	{#if deleteConfirmFilter}
		<div use:deleteModal.actions.backdrop class="filters-manager__backdrop">
			<div use:deleteModal.actions.content class="filters-manager__modal">
				<div class="filters-manager__modal-header">
					<h3 class="filters-manager__modal-title">Delete Filter</h3>
					<button
						use:deleteModal.actions.close
						class="filters-manager__modal-close"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<div class="filters-manager__modal-body">
					<p>Are you sure you want to delete the filter for "{deleteConfirmFilter.phrase}"?</p>
					<p class="filters-manager__modal-hint">This action cannot be undone.</p>
				</div>

				<div class="filters-manager__modal-footer">
					<button
						use:cancelDeleteButton.actions.button
						class="filters-manager__modal-button filters-manager__modal-button--secondary"
					>
						Cancel
					</button>
					<button
						use:confirmDeleteButton.actions.button
						class="filters-manager__modal-button filters-manager__modal-button--danger"
						disabled={filtersState.saving}
					>
						{filtersState.saving ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
