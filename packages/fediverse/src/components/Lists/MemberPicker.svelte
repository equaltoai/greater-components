<!--
  Lists.MemberPicker - Add/Remove List Members
  
  Interface for managing list membership by adding and removing accounts.
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { getListsContext, type ListMember } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, handlers } = getListsContext();

	let searchQuery = $state('');
	let searchResults = $state<ListMember[]>([]);
	let searching = $state(false);

	const currentList = $derived(state.selectedList);
	const currentMembers = $derived(currentList?.members || []);

	async function handleSearch() {
		if (!searchQuery.trim() || !currentList || searching) return;

		searching = true;

		try {
			// Search for accounts
			const results = await handlers.onSearchAccounts?.(searchQuery.trim());
			if (results) {
				searchResults = results;
			}
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			searching = false;
		}
	}

	async function handleAddMember(member: ListMember) {
		if (!currentList) return;

		try {
			await handlers.onAddListMember?.(currentList.id, member.id);
			// Refresh list to get updated members
			await handlers.onFetchList?.(currentList.id);
		} catch (error) {
			console.error('Failed to add member:', error);
		}
	}

	async function handleRemoveMember(memberId: string) {
		if (!currentList) return;

		try {
			await handlers.onRemoveListMember?.(currentList.id, memberId);
			// Refresh list to get updated members
			await handlers.onFetchList?.(currentList.id);
		} catch (error) {
			console.error('Failed to remove member:', error);
		}
	}

	function isMember(accountId: string): boolean {
		return currentMembers.some((m) => m.id === accountId);
	}

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		searchQuery;
		if (searchTimeout) clearTimeout(searchTimeout);
		if (searchQuery.trim().length > 0) {
			searchTimeout = setTimeout(() => handleSearch(), 300);
		} else {
			searchResults = [];
		}
		return () => {
			if (searchTimeout) clearTimeout(searchTimeout);
		};
	});
</script>

{#if currentList}
	<div class="member-picker {className}">
		<div class="member-picker__header">
			<h3 class="member-picker__title">Manage Members</h3>
			<p class="member-picker__subtitle">
				{currentList.members.length} member{currentList.members.length === 1 ? '' : 's'}
			</p>
		</div>

		<!-- Search -->
		<div class="member-picker__search">
			<svg class="member-picker__search-icon" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
				/>
			</svg>
			<input
				type="text"
				class="member-picker__input"
				bind:value={searchQuery}
				placeholder="Search people to add..."
			/>
			{#if searching}
				<div class="member-picker__spinner"></div>
			{/if}
		</div>

		<!-- Search Results -->
		{#if searchResults.length > 0}
			<div class="member-picker__results">
				<div class="member-picker__results-header">Search Results</div>
				{#each searchResults as result (result.id)}
					<div class="member-picker__result">
						{#if result.avatar}
							<img src={result.avatar} alt={result.displayName} class="member-picker__avatar" />
						{:else}
							<div class="member-picker__avatar-placeholder">
								{result.displayName.charAt(0).toUpperCase()}
							</div>
						{/if}

						<div class="member-picker__info">
							<div class="member-picker__name">{result.displayName}</div>
							<div class="member-picker__username">@{result.username}</div>
						</div>

						{#if isMember(result.id)}
							<button
								class="member-picker__action member-picker__action--remove"
								onclick={() => handleRemoveMember(result.id)}
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 13H5v-2h14v2z" />
								</svg>
								Remove
							</button>
						{:else}
							<button
								class="member-picker__action member-picker__action--add"
								onclick={() => handleAddMember(result)}
							>
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
								</svg>
								Add
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{:else if searchQuery.trim().length > 0 && !searching}
			<div class="member-picker__empty">
				<p>No users found matching "{searchQuery}"</p>
			</div>
		{/if}

		<!-- Current Members -->
		{#if currentMembers.length > 0}
			<div class="member-picker__members">
				<div class="member-picker__members-header">Current Members</div>
				{#each currentMembers as member (member.id)}
					<div class="member-picker__member">
						{#if member.avatar}
							<img src={member.avatar} alt={member.displayName} class="member-picker__avatar" />
						{:else}
							<div class="member-picker__avatar-placeholder">
								{member.displayName.charAt(0).toUpperCase()}
							</div>
						{/if}

						<div class="member-picker__info">
							<div class="member-picker__name">{member.displayName}</div>
							<div class="member-picker__username">@{member.username}</div>
						</div>

						<button
							class="member-picker__remove-button"
							onclick={() => handleRemoveMember(member.id)}
							title="Remove from list"
						>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<div class="member-picker__empty">
				<svg class="member-picker__empty-icon" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
					/>
				</svg>
				<p>No members yet</p>
				<p class="member-picker__empty-hint">Search to add people to this list</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="member-picker__no-list">
		<p>Select a list to manage members</p>
	</div>
{/if}

<style>
	.member-picker {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
	}

	.member-picker__header {
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		padding-bottom: 1rem;
	}

	.member-picker__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.25rem 0;
	}

	.member-picker__subtitle {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.member-picker__search {
		position: relative;
		display: flex;
		align-items: center;
	}

	.member-picker__search-icon {
		position: absolute;
		left: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.member-picker__input {
		width: 100%;
		padding: 0.75rem 2.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		background: var(--bg-secondary, #f7f9fa);
	}

	.member-picker__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		background: var(--bg-primary, #ffffff);
	}

	.member-picker__spinner {
		position: absolute;
		right: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.member-picker__results,
	.member-picker__members {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.member-picker__results-header,
	.member-picker__members-header {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.member-picker__result,
	.member-picker__member {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		transition: border-color 0.2s;
	}

	.member-picker__result:hover {
		border-color: var(--primary-color, #1d9bf0);
	}

	.member-picker__avatar,
	.member-picker__avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.member-picker__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 700;
	}

	.member-picker__info {
		flex: 1;
		min-width: 0;
	}

	.member-picker__name {
		font-weight: 600;
		margin-bottom: 0.125rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.member-picker__username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.member-picker__action {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.member-picker__action svg {
		width: 1rem;
		height: 1rem;
	}

	.member-picker__action--add {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.member-picker__action--add:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.member-picker__action--remove {
		background: transparent;
		color: #f4211e;
		border: 1px solid #f4211e;
	}

	.member-picker__action--remove:hover {
		background: rgba(244, 33, 46, 0.1);
	}

	.member-picker__remove-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.member-picker__remove-button:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.member-picker__remove-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.member-picker__empty,
	.member-picker__no-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.member-picker__empty-icon {
		width: 3rem;
		height: 3rem;
		color: var(--text-tertiary, #8899a6);
	}

	.member-picker__empty p,
	.member-picker__no-list p {
		margin: 0;
	}

	.member-picker__empty-hint {
		font-size: 0.875rem;
	}
</style>
