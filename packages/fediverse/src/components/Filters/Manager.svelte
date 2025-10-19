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
				{filtersState.stats.totalFilters} active filter{filtersState.stats.totalFilters === 1 ? '' : 's'}
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

<style>
	.filters-manager {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.filters-manager__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.filters-manager__title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 0.25rem 0;
	}

	.filters-manager__subtitle {
		margin: 0;
		color: var(--text-secondary, #536471);
		font-size: 0.875rem;
	}

	.filters-manager__new-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		color: white;
		font-weight: 700;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.filters-manager__new-button:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.filters-manager__new-button svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.filters-manager__error {
		padding: 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
	}

	.filters-manager__loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 3rem 1rem;
	}

	.filters-manager__spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.filters-manager__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 3rem 1rem;
		text-align: center;
	}

	.filters-manager__empty-icon {
		width: 4rem;
		height: 4rem;
		color: var(--text-tertiary, #8899a6);
	}

	.filters-manager__empty h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.filters-manager__empty p {
		margin: 0;
		color: var(--text-secondary, #536471);
		max-width: 400px;
	}

	.filters-manager__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filters-manager__item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		transition: border-color 0.2s;
	}

	.filters-manager__item:hover {
		border-color: var(--primary-color, #1d9bf0);
	}

	.filters-manager__item-content {
		flex: 1;
		min-width: 0;
	}

	.filters-manager__item-phrase {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.filters-manager__badge {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.filters-manager__item-details {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.filters-manager__detail {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.filters-manager__icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.filters-manager__item-actions {
		display: flex;
		gap: 0.5rem;
	}

	.filters-manager__action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
		transition: all 0.2s;
	}

	.filters-manager__action-button:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.filters-manager__action-button--danger:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.filters-manager__action-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.filters-manager__stats {
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.875rem;
	}

	/* Modal Styles */
	.filters-manager__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.filters-manager__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 0.75rem;
		width: 90%;
		max-width: 500px;
		overflow: hidden;
	}

	.filters-manager__modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.filters-manager__modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.filters-manager__modal-close {
		padding: 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
	}

	.filters-manager__modal-body {
		padding: 1.5rem;
	}

	.filters-manager__modal-body p {
		margin: 0 0 0.5rem 0;
	}

	.filters-manager__modal-hint {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.filters-manager__modal-footer {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		justify-content: flex-end;
	}

	.filters-manager__modal-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filters-manager__modal-button--secondary {
		background: var(--bg-secondary, #f7f9fa);
		color: var(--text-primary, #0f1419);
	}

	.filters-manager__modal-button--danger {
		background: #f4211e;
		color: white;
	}

	.filters-manager__modal-button:hover:not(:disabled) {
		opacity: 0.9;
	}

	.filters-manager__modal-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
