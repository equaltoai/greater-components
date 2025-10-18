<!--
  Lists.Manager - Lists Overview & Management
  
  Displays all lists with creation, editing, and deletion controls.
  Shows list cards with member counts and actions.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { createModal } from '@greater/headless/modal';
	import { getListsContext } from './context.js';
	import type { ListData } from './context.js';

	interface Props {
		/**
		 * Show create button
		 * @default true
		 */
		showCreate?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showCreate = true, class: className = '' }: Props = $props();

	const { state: listsState, selectList, openEditor, deleteList, handlers } = getListsContext();

	let deleteConfirmList = $state<ListData | null>(null);

	const newListButton = createButton({
		onClick: () => openEditor(),
	});

	const isModalOpen = $derived(deleteConfirmList !== null);

	const deleteModal = createModal({
		onClose: () => (deleteConfirmList = null),
	});

	$effect(() => {
		if (isModalOpen) {
			deleteModal.helpers.open();
		} else {
			deleteModal.helpers.close();
		}
	});

	function handleListClick(list: ListData) {
		selectList(list);
		handlers.onListClick?.(list);
	}

	function handleEdit(list: ListData, event: Event) {
		event.stopPropagation();
		openEditor(list);
	}

	function handleDeleteConfirm(list: ListData, event: Event) {
		event.stopPropagation();
		deleteConfirmList = list;
	}

	function handleListKeydown(event: KeyboardEvent, list: ListData) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleListClick(list);
		}
	}

	async function handleDelete() {
		if (!deleteConfirmList) return;

		try {
			await deleteList(deleteConfirmList.id);
			deleteConfirmList = null;
	} catch (_error) {
		// Error handled by context
	}
}
</script>

<div class={`lists-manager ${className}`}>
	<div class="lists-manager__header">
		<h2 class="lists-manager__title">Lists</h2>
		{#if showCreate}
			<button use:newListButton.actions.button class="lists-manager__create">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
				</svg>
				New List
			</button>
		{/if}
	</div>

	{#if listsState.error}
		<div class="lists-manager__error" role="alert">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			{listsState.error}
		</div>
	{/if}

	{#if listsState.loading && listsState.lists.length === 0}
		<div class="lists-manager__loading">
			<div class="lists-manager__spinner"></div>
			<p>Loading lists...</p>
		</div>
	{:else if listsState.lists.length === 0}
		<div class="lists-manager__empty">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
				/>
			</svg>
			<h3>No lists yet</h3>
			<p>Create a list to organize accounts you follow</p>
		</div>
	{:else}
		<div class="lists-manager__grid">
			{#each listsState.lists as list (list.id)}
				<article
					class="lists-manager__card"
					class:lists-manager__card--selected={listsState.selectedList?.id === list.id}
					onclick={() => handleListClick(list)}
					role="button"
					tabindex="0"
					onkeydown={(event) => handleListKeydown(event, list)}
				>
					<div class="lists-manager__card-header">
						<h3 class="lists-manager__card-title">{list.title}</h3>
						<div class="lists-manager__card-actions">
						<button
							class="lists-manager__action"
							onclick={(e) => handleEdit(list, e)}
							title="Edit list"
							aria-label={`Edit ${list.title}`}
						>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
									/>
								</svg>
							</button>
						<button
							class="lists-manager__action lists-manager__action--danger"
							onclick={(e) => handleDeleteConfirm(list, e)}
							title="Delete list"
							aria-label={`Delete ${list.title}`}
						>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
									/>
								</svg>
							</button>
						</div>
					</div>

					{#if list.description}
						<p class="lists-manager__card-description">{list.description}</p>
					{/if}

					<div class="lists-manager__card-meta">
						<span class="lists-manager__card-visibility">
							<svg viewBox="0 0 24 24" fill="currentColor">
								{#if list.visibility === 'public'}
									<path
										d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
									/>
								{:else}
									<path
										d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
									/>
								{/if}
							</svg>
							{list.visibility === 'public' ? 'Public' : 'Private'}
						</span>
						<span class="lists-manager__card-members">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
								/>
							</svg>
							{list.membersCount}
						</span>
					</div>
				</article>
			{/each}
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
	{#if deleteConfirmList}
		<div class="lists-manager__modal-backdrop" use:deleteModal.actions.backdrop>
			<div class="lists-manager__modal" use:deleteModal.actions.content>
				<h3 class="lists-manager__modal-title">Delete "{deleteConfirmList.title}"?</h3>
				<p class="lists-manager__modal-text">
					This action cannot be undone. All members will be removed from this list.
				</p>
				<div class="lists-manager__modal-actions">
					<button class="lists-manager__modal-button" onclick={() => (deleteConfirmList = null)}>
						Cancel
					</button>
					<button
						class="lists-manager__modal-button lists-manager__modal-button--danger"
						onclick={handleDelete}
						disabled={listsState.loading}
					>
						{listsState.loading ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.lists-manager {
		width: 100%;
	}

	.lists-manager__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.lists-manager__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.lists-manager__create {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.lists-manager__create:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.lists-manager__create svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.lists-manager__error,
	.lists-manager__loading,
	.lists-manager__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 2rem;
		text-align: center;
	}

	.lists-manager__error svg,
	.lists-manager__empty svg {
		width: 3rem;
		height: 3rem;
		color: var(--text-secondary, #536471);
	}

	.lists-manager__error {
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid rgba(244, 33, 46, 0.3);
		border-radius: 0.75rem;
		color: #f4211e;
	}

	.lists-manager__spinner {
		width: 3rem;
		height: 3rem;
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

	.lists-manager__empty h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.lists-manager__empty p {
		margin: 0;
		color: var(--text-secondary, #536471);
	}

	.lists-manager__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 1rem;
	}

	.lists-manager__card {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.lists-manager__card:hover {
		background: var(--bg-hover, #eff3f4);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.lists-manager__card--selected {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.05);
	}

	.lists-manager__card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}

	.lists-manager__card-title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		word-break: break-word;
	}

	.lists-manager__card-actions {
		display: flex;
		gap: 0.25rem;
	}

	.lists-manager__action {
		padding: 0.25rem;
		border: none;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.lists-manager__action:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.lists-manager__action--danger:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.lists-manager__action svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.lists-manager__card-description {
		margin: 0 0 0.75rem 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.lists-manager__card-meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.lists-manager__card-visibility,
	.lists-manager__card-members {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.lists-manager__card-visibility svg,
	.lists-manager__card-members svg {
		width: 1rem;
		height: 1rem;
	}

	/* Modal */
	.lists-manager__modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.lists-manager__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 28rem;
		width: 90%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.lists-manager__modal-title {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.lists-manager__modal-text {
		margin: 0 0 1.5rem 0;
		color: var(--text-secondary, #536471);
	}

	.lists-manager__modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.lists-manager__modal-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.lists-manager__modal-button:first-child {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.lists-manager__modal-button:first-child:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.lists-manager__modal-button--danger {
		background: #f4211e;
		color: white;
	}

	.lists-manager__modal-button--danger:hover:not(:disabled) {
		background: #d41d1a;
	}

	.lists-manager__modal-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
