<!--
  Lists.Timeline - List Timeline Display
  
  Displays the timeline of posts from list members.
  Shows members list with ability to add/remove.
  
  @component
-->
<script lang="ts">
	import { getListsContext } from './context.js';

	interface Props {
		/**
		 * Show members section
		 * @default true
		 */
		showMembers?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { showMembers = true, class: className = '' }: Props = $props();

	const { state: listsState, removeMember } = getListsContext();

	function handleRemoveMember(memberId: string) {
		removeMember(memberId);
	}
</script>

{#if listsState.selectedList}
	<div class={`lists-timeline ${className}`}>
		<div class="lists-timeline__header">
			<div>
				<h2 class="lists-timeline__title">{listsState.selectedList.title}</h2>
				{#if listsState.selectedList.description}
					<p class="lists-timeline__description">{listsState.selectedList.description}</p>
				{/if}
			</div>
			<div class="lists-timeline__meta">
				<span class="lists-timeline__visibility">
					<svg viewBox="0 0 24 24" fill="currentColor">
						{#if listsState.selectedList.visibility === 'public'}
							<path
								d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
							/>
						{:else}
							<path
								d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
							/>
						{/if}
					</svg>
					{listsState.selectedList.visibility === 'public' ? 'Public' : 'Private'}
				</span>
				<span class="lists-timeline__count">
					{listsState.selectedList.membersCount}
					{listsState.selectedList.membersCount === 1 ? 'member' : 'members'}
				</span>
			</div>
		</div>

		{#if showMembers && listsState.members.length > 0}
			<div class="lists-timeline__members">
				<h3 class="lists-timeline__members-title">Members</h3>
				<div class="lists-timeline__members-list">
					{#each listsState.members as member (member.id)}
						<div class="lists-timeline__member">
							<div class="lists-timeline__member-avatar">
								{#if member.actor.avatar}
									<img src={member.actor.avatar} alt={member.actor.displayName} />
								{:else}
									<div class="lists-timeline__member-avatar-placeholder">
										{member.actor.displayName[0]?.toUpperCase()}
									</div>
								{/if}
							</div>
							<div class="lists-timeline__member-info">
								<span class="lists-timeline__member-name">{member.actor.displayName}</span>
								<span class="lists-timeline__member-username">@{member.actor.username}</span>
							</div>
						<button
							class="lists-timeline__member-remove"
							onclick={() => handleRemoveMember(member.id)}
							title="Remove from list"
							aria-label="Remove member from list"
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
			</div>
		{/if}

		<div class="lists-timeline__content">
			<slot>
				<div class="lists-timeline__empty">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
						/>
					</svg>
					<h3>No posts yet</h3>
					<p>Posts from list members will appear here</p>
				</div>
			</slot>
		</div>
	</div>
{:else}
	<div class="lists-timeline__no-selection">
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
			/>
		</svg>
		<h3>Select a list</h3>
		<p>Choose a list from the sidebar to view its timeline</p>
	</div>
{/if}

<style>
	.lists-timeline {
		width: 100%;
	}

	.lists-timeline__header {
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-primary, #ffffff);
	}

	.lists-timeline__title {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.lists-timeline__description {
		margin: 0 0 0.75rem 0;
		font-size: 0.9375rem;
		color: var(--text-secondary, #536471);
		line-height: 1.4;
	}

	.lists-timeline__meta {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.lists-timeline__visibility,
	.lists-timeline__count {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.lists-timeline__visibility svg {
		width: 1rem;
		height: 1rem;
	}

	.lists-timeline__members {
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-secondary, #f7f9fa);
	}

	.lists-timeline__members-title {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.lists-timeline__members-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.lists-timeline__member {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	.lists-timeline__member-avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		flex-shrink: 0;
	}

	.lists-timeline__member-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lists-timeline__member-avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.lists-timeline__member-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.lists-timeline__member-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lists-timeline__member-username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lists-timeline__member-remove {
		padding: 0.375rem;
		border: none;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.lists-timeline__member-remove:hover {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.lists-timeline__member-remove svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.lists-timeline__content {
		min-height: 20rem;
	}

	.lists-timeline__empty,
	.lists-timeline__no-selection {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
	}

	.lists-timeline__empty svg,
	.lists-timeline__no-selection svg {
		width: 3rem;
		height: 3rem;
		color: var(--text-secondary, #536471);
	}

	.lists-timeline__empty h3,
	.lists-timeline__no-selection h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.lists-timeline__empty p,
	.lists-timeline__no-selection p {
		margin: 0;
		color: var(--text-secondary, #536471);
	}
</style>
