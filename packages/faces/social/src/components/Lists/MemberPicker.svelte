<!--
  Lists.MemberPicker - Add/Remove List Members
  
  Interface for managing list membership by adding and removing accounts.
-->
<script lang="ts">
	import { getListsContext, type ListMember } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: listsState, handlers } = getListsContext();

	let searchQuery = $state('');
	let searchResults = $state<ListMember[]>([]);
	let searching = $state(false);

	const currentList = $derived(listsState.selectedList);
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
		const query = searchQuery.trim();

		if (searchTimeout) {
			clearTimeout(searchTimeout);
			searchTimeout = null;
		}

		if (query.length > 0) {
			searchTimeout = setTimeout(() => {
				void handleSearch();
			}, 300);
		} else {
			searchResults = [];
		}

		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
				searchTimeout = null;
			}
		};
	});
</script>

{#if currentList}
	<div class={`member-picker ${className}`}>
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
							aria-label={`Remove ${member.displayName} from list`}
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
