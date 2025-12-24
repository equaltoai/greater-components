<!--
Profile.FollowRequests - Manage incoming follow requests

Displays pending follow requests with approve/reject actions.
Supports batch operations and request filtering.

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components/faces/social';
  
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

		processingIds = new Set(processingIds).add(requestId);
		try {
			await context.handlers.onApproveFollowRequest(requestId);
			const newSelected = new Set(selectedIds);
			newSelected.delete(requestId);
			selectedIds = newSelected;
		} catch (err) {
			console.error('Failed to approve follow request:', err);
		} finally {
			const newProcessing = new Set(processingIds);
			newProcessing.delete(requestId);
			processingIds = newProcessing;
		}
	}

	/**
	 * Handle reject request
	 */
	async function handleReject(requestId: string) {
		if (processingIds.has(requestId) || !context.handlers.onRejectFollowRequest) {
			return;
		}

		processingIds = new Set(processingIds).add(requestId);
		try {
			await context.handlers.onRejectFollowRequest(requestId);
			const newSelected = new Set(selectedIds);
			newSelected.delete(requestId);
			selectedIds = newSelected;
		} catch (err) {
			console.error('Failed to reject follow request:', err);
		} finally {
			const newProcessing = new Set(processingIds);
			newProcessing.delete(requestId);
			processingIds = newProcessing;
		}
	}

	/**
	 * Toggle selection for a request
	 */
	function toggleSelection(requestId: string) {
		const newSelected = new Set(selectedIds);
		if (newSelected.has(requestId)) {
			newSelected.delete(requestId);
		} else {
			newSelected.add(requestId);
		}
		selectedIds = newSelected;
	}

	/**
	 * Toggle all visible requests
	 */
	function toggleSelectAll() {
		const newSelected = new Set(selectedIds);
		if (allSelected) {
			// Deselect all
			filteredRequests.forEach((req) => newSelected.delete(req.id));
		} else {
			// Select all
			filteredRequests.forEach((req) => newSelected.add(req.id));
		}
		selectedIds = newSelected;
	}

	/**
	 * Approve all selected requests
	 */
	async function handleApproveSelected() {
		const ids = Array.from(selectedIds);
		for (const id of ids) {
			await handleApprove(id);
		}
		selectedIds = new Set();
	}

	/**
	 * Reject all selected requests
	 */
	async function handleRejectSelected() {
		const ids = Array.from(selectedIds);
		for (const id of ids) {
			await handleReject(id);
		}
		selectedIds = new Set();
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
