<!--
Profile.FollowRequests - Manage incoming follow requests

Displays pending follow requests with approve/reject actions.
Supports batch operations and request filtering.

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
  const requests = [
    { id: '1', account: { id: 'user1', username: 'john', displayName: 'John Doe' }, createdAt: '2024-01-15' }
  ];
  
  function handleApprove(id) {
    console.log('Approved:', id);
  }
  
  function handleReject(id) {
    console.log('Rejected:', id);
  }
</script>

<Profile.FollowRequests {requests} onApprove={handleApprove} onReject={handleReject} />
```
-->

<script lang="ts">
	import type { FollowRequest } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * List of pending follow requests
		 */
		requests?: FollowRequest[];

		/**
		 * Show batch action controls
		 */
		showBatchActions?: boolean;

		/**
		 * Enable request filtering
		 */
		enableFiltering?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		requests = [],
		showBatchActions = true,
		enableFiltering = false,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let processingIds = $state<Set<string>>(new Set());
	let selectedIds = $state<Set<string>>(new Set());
	let filterQuery = $state('');

	/**
	 * Filter requests based on search query
	 */
	const filteredRequests = $derived(
		filterQuery.trim() === ''
			? requests
			: requests.filter((req) => {
					const query = filterQuery.toLowerCase();
					return (
						req.account.username.toLowerCase().includes(query) ||
						req.account.displayName.toLowerCase().includes(query)
					);
				})
	);

	/**
	 * Check if all visible requests are selected
	 */
	const allSelected = $derived(
		filteredRequests.length > 0 && filteredRequests.every((req) => selectedIds.has(req.id))
	);

	/**
	 * Check if any requests are selected
	 */
	const hasSelection = $derived(selectedIds.size > 0);

	/**
	 * Format relative time
	 */
	function formatRelativeTime(dateString: string): string {
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffSeconds = Math.floor(diffMs / 1000);
			const diffMinutes = Math.floor(diffSeconds / 60);
			const diffHours = Math.floor(diffMinutes / 60);
			const diffDays = Math.floor(diffHours / 24);

			if (diffDays > 7) {
				return date.toLocaleDateString();
			}
			if (diffDays > 0) {
				return `${diffDays}d ago`;
			}
			if (diffHours > 0) {
				return `${diffHours}h ago`;
			}
			if (diffMinutes > 0) {
				return `${diffMinutes}m ago`;
			}
			return 'just now';
		} catch {
			return dateString;
		}
	}

	/**
	 * Handle approve request
	 */
	async function handleApprove(requestId: string) {
		if (processingIds.has(requestId) || !context.handlers.onApproveFollowRequest) {
			return;
		}

		processingIds.add(requestId);
		try {
			await context.handlers.onApproveFollowRequest(requestId);
			selectedIds.delete(requestId);
		} catch (err) {
			console.error('Failed to approve follow request:', err);
		} finally {
			processingIds.delete(requestId);
		}
	}

	/**
	 * Handle reject request
	 */
	async function handleReject(requestId: string) {
		if (processingIds.has(requestId) || !context.handlers.onRejectFollowRequest) {
			return;
		}

		processingIds.add(requestId);
		try {
			await context.handlers.onRejectFollowRequest(requestId);
			selectedIds.delete(requestId);
		} catch (err) {
			console.error('Failed to reject follow request:', err);
		} finally {
			processingIds.delete(requestId);
		}
	}

	/**
	 * Toggle selection for a request
	 */
	function toggleSelection(requestId: string) {
		if (selectedIds.has(requestId)) {
			selectedIds.delete(requestId);
		} else {
			selectedIds.add(requestId);
		}
	}

	/**
	 * Toggle all visible requests
	 */
	function toggleSelectAll() {
		if (allSelected) {
			// Deselect all
			filteredRequests.forEach((req) => selectedIds.delete(req.id));
		} else {
			// Select all
			filteredRequests.forEach((req) => selectedIds.add(req.id));
		}
	}

	/**
	 * Approve all selected requests
	 */
	async function handleApproveSelected() {
		const ids = Array.from(selectedIds);
		for (const id of ids) {
			await handleApprove(id);
		}
		selectedIds.clear();
	}

	/**
	 * Reject all selected requests
	 */
	async function handleRejectSelected() {
		const ids = Array.from(selectedIds);
		for (const id of ids) {
			await handleReject(id);
		}
		selectedIds.clear();
	}
</script>

<div class={`follow-requests ${className}`}>
	<div class="follow-requests__header">
		<h2 class="follow-requests__title">
			Follow Requests
			{#if requests.length > 0}
				<span class="follow-requests__count">({requests.length})</span>
			{/if}
		</h2>

		{#if enableFiltering && requests.length > 0}
			<input
				type="search"
				class="follow-requests__search"
				placeholder="Search requests..."
				bind:value={filterQuery}
			/>
		{/if}
	</div>

	{#if showBatchActions && filteredRequests.length > 0}
		<div class="follow-requests__batch-actions">
			<label class="follow-requests__select-all">
				<input
					type="checkbox"
					checked={allSelected}
					onchange={toggleSelectAll}
					aria-label="Select all requests"
				/>
				<span>Select all</span>
			</label>

			{#if hasSelection}
				<div class="follow-requests__batch-buttons">
					<button
						class="follow-requests__batch-button follow-requests__batch-button--approve"
						onclick={handleApproveSelected}
						type="button"
					>
						Approve Selected ({selectedIds.size})
					</button>
					<button
						class="follow-requests__batch-button follow-requests__batch-button--reject"
						onclick={handleRejectSelected}
						type="button"
					>
						Reject Selected ({selectedIds.size})
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<div class="follow-requests__list">
		{#if filteredRequests.length === 0}
			<div class="follow-requests__empty">
				{#if requests.length === 0}
					<p>No pending follow requests</p>
				{:else}
					<p>No requests match your search</p>
				{/if}
			</div>
		{:else}
			{#each filteredRequests as request (request.id)}
				{@const isProcessing = processingIds.has(request.id)}
				{@const isSelected = selectedIds.has(request.id)}

				<div class="follow-requests__item" class:follow-requests__item--selected={isSelected}>
					{#if showBatchActions}
						<input
							type="checkbox"
							class="follow-requests__checkbox"
							checked={isSelected}
							onchange={() => toggleSelection(request.id)}
							disabled={isProcessing}
							aria-label={`Select request from ${request.account.displayName}`}
						/>
					{/if}

					<div class="follow-requests__account">
						{#if request.account.avatar}
							<img
								src={request.account.avatar}
								alt=""
								class="follow-requests__avatar"
								loading="lazy"
							/>
						{:else}
							<div class="follow-requests__avatar-placeholder" aria-hidden="true">
								{request.account.displayName[0]?.toUpperCase() || '?'}
							</div>
						{/if}

						<div class="follow-requests__info">
							<div class="follow-requests__names">
								<span class="follow-requests__display-name">
									{request.account.displayName}
								</span>
								<span class="follow-requests__username">
									@{request.account.username}
								</span>
							</div>
							<div class="follow-requests__meta">
								<span class="follow-requests__time">
									{formatRelativeTime(request.createdAt)}
								</span>
							</div>
						</div>
					</div>

					<div class="follow-requests__actions">
						<button
							class="follow-requests__button follow-requests__button--approve"
							onclick={() => handleApprove(request.id)}
							disabled={isProcessing}
							type="button"
							aria-label={`Approve follow request from ${request.account.displayName}`}
						>
							{isProcessing ? '...' : 'Approve'}
						</button>
						<button
							class="follow-requests__button follow-requests__button--reject"
							onclick={() => handleReject(request.id)}
							disabled={isProcessing}
							type="button"
							aria-label={`Reject follow request from ${request.account.displayName}`}
						>
							{isProcessing ? '...' : 'Reject'}
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.follow-requests {
		width: 100%;
	}

	.follow-requests__header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.follow-requests__title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		margin: 0;
	}

	.follow-requests__count {
		font-weight: 400;
		color: var(--text-secondary, #536471);
	}

	.follow-requests__search {
		padding: 0.625rem 1rem;
		font-size: 0.9375rem;
		border: 1px solid var(--border-color, #cfd9de);
		border-radius: 9999px;
		background: var(--input-bg, #f7f9fa);
		color: var(--text-primary, #0f1419);
		outline: none;
		transition: all 0.2s;
	}

	.follow-requests__search:focus {
		border-color: var(--primary-color, #1d9bf0);
		background: white;
	}

	.follow-requests__batch-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		background: var(--batch-bg, #f7f9fa);
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	.follow-requests__select-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
	}

	.follow-requests__select-all input {
		cursor: pointer;
		accent-color: var(--primary-color, #1d9bf0);
	}

	.follow-requests__batch-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.follow-requests__batch-button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.follow-requests__batch-button--approve {
		background: var(--success-color, #4caf50);
		color: white;
	}

	.follow-requests__batch-button--approve:hover {
		background: var(--success-hover, #45a049);
	}

	.follow-requests__batch-button--reject {
		background: var(--error-color, #f44336);
		color: white;
	}

	.follow-requests__batch-button--reject:hover {
		background: var(--error-hover, #da190b);
	}

	.follow-requests__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.follow-requests__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--item-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.follow-requests__item--selected {
		background: var(--selected-bg, #e8f5fe);
		border-color: var(--primary-color, #1d9bf0);
	}

	.follow-requests__checkbox {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: var(--primary-color, #1d9bf0);
		flex-shrink: 0;
	}

	.follow-requests__checkbox:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.follow-requests__account {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.follow-requests__avatar,
	.follow-requests__avatar-placeholder {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.follow-requests__avatar {
		object-fit: cover;
	}

	.follow-requests__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--avatar-placeholder-bg, #cfd9de);
		color: var(--avatar-placeholder-text, #536471);
		font-weight: 600;
		font-size: 1.25rem;
	}

	.follow-requests__info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.follow-requests__names {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.follow-requests__display-name {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.follow-requests__username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.follow-requests__meta {
		font-size: 0.8125rem;
		color: var(--text-tertiary, #8899a6);
	}

	.follow-requests__actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.follow-requests__button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.follow-requests__button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.follow-requests__button--approve {
		background: var(--success-color, #4caf50);
		color: white;
	}

	.follow-requests__button--approve:hover:not(:disabled) {
		background: var(--success-hover, #45a049);
	}

	.follow-requests__button--reject {
		background: transparent;
		color: var(--error-color, #f44336);
		border: 1px solid var(--error-color, #f44336);
	}

	.follow-requests__button--reject:hover:not(:disabled) {
		background: var(--error-color, #f44336);
		color: white;
	}

	.follow-requests__empty {
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.follow-requests__empty p {
		margin: 0;
	}

	@media (max-width: 640px) {
		.follow-requests__item {
			flex-wrap: wrap;
		}

		.follow-requests__actions {
			width: 100%;
			justify-content: stretch;
		}

		.follow-requests__button {
			flex: 1;
		}

		.follow-requests__batch-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.follow-requests__batch-buttons {
			flex-direction: column;
		}

		.follow-requests__batch-button {
			width: 100%;
		}
	}
</style>
