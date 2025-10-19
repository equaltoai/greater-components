<!--
  Admin.Moderation - Moderation Tools & Actions
  
  Quick moderation actions and tools for administrators.
  Provides user lookup, bulk actions, and moderation history.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAdminContext } from './context.js';
	import type { AdminUser } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { handlers } = getAdminContext();

	let searchQuery = $state('');
	let searchResults = $state<AdminUser[]>([]);
	let selectedUser = $state<AdminUser | null>(null);
	let selectedAction = $state<'suspend' | 'unsuspend' | 'delete' | null>(null);
	let actionReason = $state('');
	let loading = $state(false);

	const searchButton = createButton({
		onClick: () => handleSearch(),
	});

	async function handleSearch() {
		if (!searchQuery.trim()) return;

		loading = true;
		try {
			const results = await handlers.onSearchUsers?.(searchQuery);
			searchResults = results || [];
		} catch (error) {
			console.error('Search failed:', error);
			searchResults = [];
		} finally {
			loading = false;
		}
	}

	function selectUser(user: AdminUser) {
		selectedUser = user;
		selectedAction = null;
		actionReason = '';
	}

	async function handleModerateUser() {
		if (!selectedUser || !selectedAction) return;

		loading = true;
		try {
			switch (selectedAction) {
				case 'suspend':
					if (!actionReason.trim()) {
						alert('Please provide a reason for suspension');
						return;
					}
					await handlers.onSuspendUser?.(selectedUser.id, actionReason);
					break;
				case 'unsuspend':
					await handlers.onUnsuspendUser?.(selectedUser.id);
					break;
			}
			// Clear form after successful action
			selectedUser = null;
			selectedAction = null;
			actionReason = '';
			// Refresh search results
			if (searchQuery.trim()) {
				await handleSearch();
			}
		} catch (error) {
			console.error('Moderation action failed:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class={`admin-moderation ${className}`}>
	<h2 class="admin-moderation__title">Moderation Tools</h2>

	<!-- Quick Search -->
	<div class="admin-moderation__section">
		<h3 class="admin-moderation__subtitle">Quick User Lookup</h3>
		<div class="admin-moderation__search">
			<input
				type="text"
				class="admin-moderation__input"
				bind:value={searchQuery}
				placeholder="Search by username or email..."
				disabled={loading}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
			/>
			<button use:searchButton.actions.button class="admin-moderation__button" disabled={loading}>
				{loading ? 'Searching...' : 'Search'}
			</button>
		</div>

		{#if searchResults.length > 0}
			<div class="admin-moderation__results">
				{#each searchResults as result (result.id)}
					<div class="admin-moderation__result-card">
						<div class="admin-moderation__result-info">
							<strong>@{result.username}</strong>
							<span>{result.email}</span>
							<span class="admin-moderation__result-meta">
								{result.role} • {result.status}
							</span>
						</div>
						<button
							class="admin-moderation__button admin-moderation__button--small"
							onclick={() => selectUser(result)}
						>
							Select
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Selected User & Actions -->
	{#if selectedUser}
		<div class="admin-moderation__section">
			<h3 class="admin-moderation__subtitle">Moderation Action</h3>
			<div class="admin-moderation__selected">
				<div class="admin-moderation__selected-info">
					<strong>@{selectedUser.username}</strong>
					<span>{selectedUser.email}</span>
					<div class="admin-moderation__selected-meta">
						<span class={`admin-moderation__badge admin-moderation__badge--${selectedUser.role}`}>
							{selectedUser.role}
						</span>
						<span class={`admin-moderation__badge admin-moderation__badge--${selectedUser.status}`}>
							{selectedUser.status}
						</span>
					</div>
				</div>
				<button
					class="admin-moderation__button admin-moderation__button--secondary"
					onclick={() => {
						selectedUser = null;
						selectedAction = null;
						actionReason = '';
					}}
				>
					Clear
				</button>
			</div>

			<div class="admin-moderation__actions-grid">
				{#if selectedUser.status === 'active'}
					<button
						class="admin-moderation__action-card"
						class:admin-moderation__action-card--selected={selectedAction === 'suspend'}
						onclick={() => (selectedAction = 'suspend')}
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
							/>
						</svg>
						<span>Suspend User</span>
					</button>
				{:else if selectedUser.status === 'suspended'}
					<button
						class="admin-moderation__action-card"
						class:admin-moderation__action-card--selected={selectedAction === 'unsuspend'}
						onclick={() => (selectedAction = 'unsuspend')}
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
							/>
						</svg>
						<span>Unsuspend User</span>
					</button>
				{/if}

				<button
					class="admin-moderation__action-card admin-moderation__action-card--danger"
					class:admin-moderation__action-card--selected={selectedAction === 'delete'}
					onclick={() => (selectedAction = 'delete')}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
						/>
					</svg>
					<span>Delete Content</span>
				</button>
			</div>

			{#if selectedAction}
				<div class="admin-moderation__form">
					<h4 class="admin-moderation__form-title">
						{selectedAction === 'suspend'
							? 'Suspend User'
							: selectedAction === 'unsuspend'
								? 'Unsuspend User'
								: 'Delete Content'}
					</h4>

					{#if selectedAction === 'suspend'}
						<div class="admin-moderation__field">
							<label for="reason" class="admin-moderation__label">Reason (Required)</label>
							<textarea
								id="reason"
								class="admin-moderation__textarea"
								bind:value={actionReason}
								placeholder="Enter reason for suspension..."
								rows="3"
								required
							></textarea>
						</div>
					{:else if selectedAction === 'unsuspend'}
						<p class="admin-moderation__form-text">
							This will restore access for <strong>@{selectedUser.username}</strong>.
						</p>
					{:else if selectedAction === 'delete'}
						<p class="admin-moderation__form-text">
							This will delete recent content from <strong>@{selectedUser.username}</strong>. This
							action cannot be undone.
						</p>
					{/if}

					<div class="admin-moderation__form-actions">
						<button
							class="admin-moderation__button admin-moderation__button--secondary"
							onclick={() => {
								selectedAction = null;
								actionReason = '';
							}}
						>
							Cancel
						</button>
						<button
							class="admin-moderation__button admin-moderation__button--danger"
							onclick={handleModerateUser}
							disabled={loading || (selectedAction === 'suspend' && !actionReason.trim())}
						>
							{loading
								? 'Processing...'
								: selectedAction === 'suspend'
									? 'Suspend'
									: selectedAction === 'unsuspend'
										? 'Unsuspend'
										: 'Delete'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Action Cards for General Info -->
		<div class="admin-moderation__section">
			<h3 class="admin-moderation__subtitle">Available Actions</h3>
			<p class="admin-moderation__help">Search for a user above to perform moderation actions.</p>
			<div class="admin-moderation__actions-grid">
				<div class="admin-moderation__action-card admin-moderation__action-card--disabled">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
						/>
					</svg>
					<span>Suspend User</span>
					<small>Temporarily block user access</small>
				</div>

				<div class="admin-moderation__action-card admin-moderation__action-card--disabled">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
						/>
					</svg>
					<span>Unsuspend User</span>
					<small>Restore user access</small>
				</div>

				<div class="admin-moderation__action-card admin-moderation__action-card--disabled">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
						/>
					</svg>
					<span>Delete Content</span>
					<small>Remove user's posts</small>
				</div>

				<div class="admin-moderation__action-card admin-moderation__action-card--disabled">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"
						/>
					</svg>
					<span>View Reports</span>
					<small>See user-related reports</small>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-moderation {
		padding: 1.5rem;
	}

	.admin-moderation__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-moderation__subtitle {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__help {
		margin: 0 0 1rem 0;
		color: var(--text-secondary, #536471);
	}

	.admin-moderation__search {
		display: flex;
		gap: 0.75rem;
	}

	.admin-moderation__input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		transition: border-color 0.2s;
	}

	.admin-moderation__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-moderation__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		background: var(--primary-color, #1d9bf0);
		font-size: 0.9375rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
		white-space: nowrap;
	}

	.admin-moderation__button:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.admin-moderation__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.admin-moderation__button--small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.admin-moderation__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__button--secondary:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-moderation__button--danger {
		background: #f4211e;
	}

	.admin-moderation__button--danger:hover:not(:disabled) {
		background: #d41d1a;
	}

	.admin-moderation__results {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.admin-moderation__result-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.admin-moderation__result-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.admin-moderation__result-info span {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.admin-moderation__result-meta {
		font-size: 0.75rem !important;
	}

	.admin-moderation__selected {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin-bottom: 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 2px solid var(--primary-color, #1d9bf0);
		border-radius: 0.5rem;
	}

	.admin-moderation__selected-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.admin-moderation__selected-info strong {
		font-size: 1.125rem;
	}

	.admin-moderation__selected-info span {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.admin-moderation__selected-meta {
		display: flex;
		gap: 0.5rem;
	}

	.admin-moderation__badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.admin-moderation__badge--admin {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-moderation__badge--moderator {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.admin-moderation__badge--user {
		background: rgba(29, 155, 240, 0.1);
		color: #1d9bf0;
	}

	.admin-moderation__badge--active {
		background: rgba(0, 186, 124, 0.1);
		color: #00ba7c;
	}

	.admin-moderation__badge--suspended {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-moderation__actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: 1rem;
	}

	.admin-moderation__action-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.5rem 1rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		background: var(--bg-primary, #ffffff);
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-moderation__action-card:hover:not(.admin-moderation__action-card--disabled) {
		background: var(--bg-hover, #eff3f4);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.admin-moderation__action-card--selected {
		border-color: var(--primary-color, #1d9bf0);
		background: rgba(29, 155, 240, 0.05);
	}

	.admin-moderation__action-card--danger {
		border-color: rgba(244, 33, 46, 0.3);
		color: #f4211e;
	}

	.admin-moderation__action-card--disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.admin-moderation__action-card svg {
		width: 2rem;
		height: 2rem;
	}

	.admin-moderation__action-card span {
		font-size: 0.875rem;
		font-weight: 600;
		text-align: center;
	}

	.admin-moderation__action-card small {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		text-align: center;
	}

	.admin-moderation__form {
		margin-top: 1.5rem;
		padding: 1.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.admin-moderation__form-title {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__form-text {
		margin: 0 0 1rem 0;
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__field {
		margin-bottom: 1rem;
	}

	.admin-moderation__label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-moderation__textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		resize: vertical;
		transition: border-color 0.2s;
	}

	.admin-moderation__textarea:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-moderation__form-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>
