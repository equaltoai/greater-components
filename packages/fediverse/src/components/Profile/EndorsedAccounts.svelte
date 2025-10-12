<!--
Profile.EndorsedAccounts - Featured accounts on profile

Displays accounts endorsed/featured on the profile.
Supports drag-and-drop reordering (for own profile).

@component
@example
```svelte
<script>
  import { Profile } from '@greater/fediverse';
  
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

<div class="endorsed-accounts {className}">
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
							aria-label="Remove {account.displayName} from featured accounts"
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

<style>
	.endorsed-accounts {
		width: 100%;
	}

	.endorsed-accounts__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.endorsed-accounts__title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #0f1419);
		margin: 0;
	}

	.endorsed-accounts__count {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary, #536471);
		padding: 0.25rem 0.625rem;
		background: var(--count-bg, #eff3f4);
		border-radius: 9999px;
	}

	.endorsed-accounts__empty {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		font-size: 0.9375rem;
	}

	.endorsed-accounts__empty p {
		margin: 0 0 0.5rem;
	}

	.endorsed-accounts__hint {
		font-size: 0.875rem;
		color: var(--text-tertiary, #8899a6);
	}

	.endorsed-accounts__list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.endorsed-accounts__item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--item-bg, #f7f9fa);
		border: 1px solid var(--border-color, #eff3f4);
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.endorsed-accounts__item:hover {
		background: var(--item-hover-bg, #eff3f4);
	}

	.endorsed-accounts__item--draggable {
		cursor: grab;
	}

	.endorsed-accounts__item--draggable:active {
		cursor: grabbing;
	}

	.endorsed-accounts__item--dragging {
		opacity: 0.5;
		cursor: grabbing;
	}

	.endorsed-accounts__item--drag-over {
		border-color: var(--primary-color, #1d9bf0);
		background: var(--drag-over-bg, #e8f5fe);
	}

	.endorsed-accounts__drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary, #8899a6);
		cursor: grab;
		flex-shrink: 0;
	}

	.endorsed-accounts__drag-handle:active {
		cursor: grabbing;
	}

	.endorsed-accounts__account {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		min-width: 0;
	}

	.endorsed-accounts__avatar,
	.endorsed-accounts__avatar-placeholder {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.endorsed-accounts__avatar {
		object-fit: cover;
	}

	.endorsed-accounts__avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--avatar-placeholder-bg, #cfd9de);
		color: var(--avatar-placeholder-text, #536471);
		font-weight: 600;
		font-size: 1rem;
	}

	.endorsed-accounts__info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.endorsed-accounts__display-name {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.endorsed-accounts__username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.endorsed-accounts__remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-tertiary, #8899a6);
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.endorsed-accounts__remove:hover:not(:disabled) {
		background: var(--remove-hover-bg, #fee);
		color: var(--error-color, #f44336);
	}

	.endorsed-accounts__remove:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.endorsed-accounts__show-more {
		margin-top: 0.75rem;
		text-align: center;
	}

	.endorsed-accounts__show-more-link {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
		transition: color 0.2s;
	}

	.endorsed-accounts__show-more-link:hover {
		color: var(--primary-hover, #1a8cd8);
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.endorsed-accounts__drag-handle {
			display: none;
		}

		.endorsed-accounts__item--draggable {
			cursor: default;
		}
	}
</style>
