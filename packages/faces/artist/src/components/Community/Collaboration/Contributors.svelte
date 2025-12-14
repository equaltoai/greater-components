<!--
Collaboration.Contributors - Artist attribution chain

@component
-->

<script lang="ts">
	import { getCollaborationContext, canInviteMembers } from './context.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCollaborationContext();
	const { collaboration, config, handlers } = ctx;

	// Invite state
	let showInviteForm = $state(false);
	let inviteArtistId = $state('');
	let isInviting = $state(false);

	// Permission check
	const userCanInvite = $derived(canInviteMembers(ctx));

	// Handle invite
	async function handleInvite(event: Event) {
		event.preventDefault();
		if (!inviteArtistId.trim() || isInviting) return;

		isInviting = true;
		try {
			await handlers.onInvite?.(collaboration, inviteArtistId);
			inviteArtistId = '';
			showInviteForm = false;
		} finally {
			isInviting = false;
		}
	}
</script>

{#if config.showContributors}
	<div class={`collab-contributors ${className}`}>
		<div class="collab-contributors__header">
			<h3 class="collab-contributors__title">Contributors</h3>
			{#if userCanInvite}
				<button
					type="button"
					class="collab-contributors__invite-btn"
					onclick={() => (showInviteForm = !showInviteForm)}
				>
					{showInviteForm ? 'Cancel' : 'Add Contributor'}
				</button>
			{/if}
		</div>

		<!-- Invite form -->
		{#if showInviteForm && userCanInvite}
			<form class="collab-contributors__invite-form" onsubmit={handleInvite}>
				<input
					type="text"
					placeholder="Artist username or ID..."
					bind:value={inviteArtistId}
					class="collab-contributors__invite-input"
				/>
				<button
					type="submit"
					class="collab-contributors__invite-submit"
					disabled={!inviteArtistId.trim() || isInviting}
				>
					{isInviting ? 'Inviting...' : 'Send Invite'}
				</button>
			</form>
		{/if}

		<!-- Attribution chain -->
		<div class="collab-contributors__chain">
			{#each collaboration.members as member, index (member.artist.id)}
				<div class="collab-contributors__member">
					<img src={member.artist.avatar || ''} alt="" class="collab-contributors__avatar" />
					<div class="collab-contributors__info">
						<span class="collab-contributors__name">{member.artist.displayName}</span>
						<span class="collab-contributors__role">{member.role}</span>
						{#if member.contribution}
							<span class="collab-contributors__contribution">{member.contribution}</span>
						{/if}
					</div>
					<time class="collab-contributors__joined">
						Joined {new Date(member.joinedAt).toLocaleDateString()}
					</time>
				</div>
				{#if index < collaboration.members.length - 1}
					<div class="collab-contributors__connector">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style>
	.collab-contributors {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.collab-contributors__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-contributors__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.collab-contributors__invite-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.collab-contributors__invite-form {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.collab-contributors__invite-input {
		flex: 1;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
	}

	.collab-contributors__invite-submit {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-success-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		cursor: pointer;
	}

	.collab-contributors__invite-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.collab-contributors__chain {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.collab-contributors__member {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		width: 100%;
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.collab-contributors__avatar {
		width: 48px;
		height: 48px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
		background: var(--gr-color-gray-600);
	}

	.collab-contributors__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.collab-contributors__name {
		font-weight: var(--gr-font-weight-medium);
	}

	.collab-contributors__role {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-primary-400);
	}

	.collab-contributors__contribution {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.collab-contributors__joined {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
	}

	.collab-contributors__connector {
		width: 24px;
		height: 24px;
		color: var(--gr-color-gray-500);
	}

	.collab-contributors__connector svg {
		width: 100%;
		height: 100%;
	}
</style>
