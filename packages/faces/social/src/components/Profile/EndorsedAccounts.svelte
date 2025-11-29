<!--
Profile.EndorsedAccounts - Featured accounts on profile

Displays accounts endorsed/featured on the profile.
Supports drag-and-drop reordering (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@equaltoai/greater-components-fediverse';
  
  const endorsed = [
    { id: '1', username: 'alice', displayName: 'Alice Wonder', avatar: '...' }
  ];
</script>

<Profile.EndorsedAccounts {endorsed} isOwnProfile={true} />
```
-->

<script lang="ts">
	import type { ProfileData } from './context.js';
	import { getProfileContext } from './context.js';

	interface Props {
		/**
		 * List of endorsed accounts
		 */
		endorsed?: ProfileData[];

		/**
		 * Whether this is the current user's profile
		 */
		isOwnProfile?: boolean;

		/**
		 * Enable drag-and-drop reordering
		 */
		enableReordering?: boolean;

		/**
		 * Maximum accounts to display (0 = all)
		 */
		maxAccounts?: number;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		endorsed = [],
		isOwnProfile = false,
		enableReordering = true,
		maxAccounts = 0,
		class: className = '',
	}: Props = $props();

	const context = getProfileContext();

	let draggingIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);
	let removingIds = $state<Set<string>>(new Set());

	// Local copy for reordering
	let localEndorsed = $state<ProfileData[]>([...endorsed]);

	// Update local copy when prop changes
	$effect(() => {
		localEndorsed = [...endorsed];
	});

	/**
	 * Display accounts (limited if maxAccounts is set)
	 */
	const displayEndorsed = $derived<ProfileData[]>(
		maxAccounts > 0 ? localEndorsed.slice(0, maxAccounts) : localEndorsed
	);

	/**
	 * Handle drag start
	 */
	function handleDragStart(index: number) {
		if (!isOwnProfile || !enableReordering) return;
		draggingIndex = index;
	}

	/**
	 * Handle drag over
	 */
	function handleDragOver(event: DragEvent, index: number) {
		if (!isOwnProfile || !enableReordering || draggingIndex === null) return;
		event.preventDefault();
		dragOverIndex = index;
	}

	/**
	 * Handle drop
	 */
	async function handleDrop(event: DragEvent, targetIndex: number) {
		if (!isOwnProfile || !enableReordering || draggingIndex === null) return;
		event.preventDefault();

		// Reorder array
		const newEndorsed = [...localEndorsed];
		const [removed] = newEndorsed.splice(draggingIndex, 1);
		newEndorsed.splice(targetIndex, 0, removed);

		localEndorsed = newEndorsed;
		draggingIndex = null;
		dragOverIndex = null;

		// Notify parent
		if (context.handlers.onReorderEndorsements) {
			const userIds = newEndorsed.map((acc) => acc.id);
			await context.handlers.onReorderEndorsements(userIds);
		}
	}

	/**
	 * Handle drag end
	 */
	function handleDragEnd() {
		draggingIndex = null;
		dragOverIndex = null;
	}

	/**
	 * Remove endorsement
	 */
	async function handleRemoveEndorsement(userId: string, displayName: string) {
		if (removingIds.has(userId) || !context.handlers.onUnendorseAccount) {
			return;
		}

		if (!confirm(`Remove ${displayName} from featured accounts?`)) {
			return;
		}

		removingIds.add(userId);
		try {
			await context.handlers.onUnendorseAccount(userId);
			// Remove from local copy
			localEndorsed = localEndorsed.filter((acc) => acc.id !== userId);
		} catch (err) {
			console.error('Failed to remove endorsement:', err);
		} finally {
			removingIds.delete(userId);
		}
	}
</script>

<div class={`endorsed-accounts ${className}`}>
	<div class="endorsed-accounts__header">
		<h3 class="endorsed-accounts__title">Featured Accounts</h3>
		{#if endorsed.length > 0}
			<span class="endorsed-accounts__count">{endorsed.length}</span>
		{/if}
	</div>

	{#if displayEndorsed.length === 0}
		<div class="endorsed-accounts__empty">
			{#if isOwnProfile}
				<p>You haven't featured any accounts yet</p>
				<p class="endorsed-accounts__hint">Feature accounts to showcase them on your profile</p>
			{:else}
				<p>No featured accounts</p>
			{/if}
		</div>
	{:else}
		<div class="endorsed-accounts__list">
			{#each displayEndorsed as account, index (account.id)}
				{@const isDragging = draggingIndex === index}
				{@const isDragOver = dragOverIndex === index}
				{@const isRemoving = removingIds.has(account.id)}

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div
					class="endorsed-accounts__item"
					class:endorsed-accounts__item--dragging={isDragging}
					class:endorsed-accounts__item--drag-over={isDragOver}
					class:endorsed-accounts__item--draggable={isOwnProfile && enableReordering}
					draggable={isOwnProfile && enableReordering}
					ondragstart={() => handleDragStart(index)}
					ondragover={(e) => handleDragOver(e, index)}
					ondrop={(e) => handleDrop(e, index)}
					ondragend={handleDragEnd}
					role={isOwnProfile && enableReordering ? 'button' : undefined}
					tabindex={isOwnProfile && enableReordering ? 0 : undefined}
				>
					{#if isOwnProfile && enableReordering}
						<div class="endorsed-accounts__drag-handle" aria-label="Drag to reorder">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="4" y1="8" x2="20" y2="8" />
								<line x1="4" y1="16" x2="20" y2="16" />
							</svg>
						</div>
					{/if}

					<div class="endorsed-accounts__account">
						{#if account.avatar}
							<img src={account.avatar} alt="" class="endorsed-accounts__avatar" loading="lazy" />
						{:else}
							<div class="endorsed-accounts__avatar-placeholder" aria-hidden="true">
								{account.displayName[0]?.toUpperCase() || '?'}
							</div>
						{/if}

						<div class="endorsed-accounts__info">
							<span class="endorsed-accounts__display-name">
								{account.displayName}
							</span>
							<span class="endorsed-accounts__username">
								@{account.username}
							</span>
						</div>
					</div>

					{#if isOwnProfile}
						<button
							class="endorsed-accounts__remove"
							onclick={() => handleRemoveEndorsement(account.id, account.displayName)}
							disabled={isRemoving}
							type="button"
							aria-label={`Remove ${account.displayName} from featured accounts`}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					{/if}
				</div>
			{/each}
		</div>

		{#if maxAccounts > 0 && endorsed.length > maxAccounts}
			<div class="endorsed-accounts__show-more">
				<!-- svelte-ignore a11y_invalid_attribute -->
				<a href="#" class="endorsed-accounts__show-more-link">
					Show all {endorsed.length} accounts
				</a>
			</div>
		{/if}
	{/if}
</div>
