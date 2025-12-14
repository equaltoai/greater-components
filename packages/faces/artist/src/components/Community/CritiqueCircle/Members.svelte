<!--
CritiqueCircle.Members - Circle membership management

@component
-->

<script lang="ts">
	import {
		getCritiqueCircleContext,
		canInvite,
		canRemoveMember,
		getMemberBadge,
	} from './context.js';
	import type { CritiqueCircleMember } from '../../../types/community.js';

	interface Props {
		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const ctx = getCritiqueCircleContext();
	const { circle, config, handlers } = ctx;

	// Invite state
	let showInviteForm = $state(false);
	let inviteArtistId = $state('');
	let isInviting = $state(false);

	// Permission checks
	const userCanInvite = $derived(canInvite(ctx));
	const userCanRemove = $derived(canRemoveMember(ctx));

	// Sort members by role
	const sortedMembers = $derived(() => {
		const roleOrder = { admin: 0, moderator: 1, member: 2 };
		return [...circle.members].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
	});

	// Handle invite
	async function handleInvite(event: Event) {
		event.preventDefault();
		if (!inviteArtistId.trim() || isInviting) return;

		isInviting = true;
		try {
			await handlers.onInvite?.(circle, inviteArtistId);
			inviteArtistId = '';
			showInviteForm = false;
		} finally {
			isInviting = false;
		}
	}

	// Handle role change
	async function handleRoleChange(member: CritiqueCircleMember, newRole: 'moderator' | 'member') {
		await handlers.onChangeRole?.(circle, member.artist.id, newRole);
	}
</script>

{#if config.showMembers}
	<div class={`critique-members ${className}`}>
		<div class="critique-members__header">
			<h3 class="critique-members__title">
				Members ({circle.members.length}{circle.maxMembers ? `/${circle.maxMembers}` : ''})
			</h3>
			{#if userCanInvite}
				<button
					type="button"
					class="critique-members__invite-btn"
					onclick={() => (showInviteForm = !showInviteForm)}
				>
					{showInviteForm ? 'Cancel' : 'Invite'}
				</button>
			{/if}
		</div>

		<!-- Invite form -->
		{#if showInviteForm && userCanInvite}
			<form class="critique-members__invite-form" onsubmit={handleInvite}>
				<input
					type="text"
					placeholder="Artist username or ID..."
					bind:value={inviteArtistId}
					class="critique-members__invite-input"
				/>
				<button
					type="submit"
					class="critique-members__invite-submit"
					disabled={!inviteArtistId.trim() || isInviting}
				>
					{isInviting ? 'Inviting...' : 'Send Invite'}
				</button>
			</form>
		{/if}

		<!-- Members list -->
		<div class="critique-members__list" role="list">
			{#each sortedMembers() as member (member.artist.id)}
				{@const badge = getMemberBadge(member.role)}
				<div class="critique-members__item" role="listitem">
					<img src={member.artist.avatar || ''} alt="" class="critique-members__avatar" />
					<div class="critique-members__info">
						<div class="critique-members__name-row">
							<span class="critique-members__name">{member.artist.displayName}</span>
							<span class="critique-members__badge" style="background: {badge.color}">
								{badge.label}
							</span>
						</div>
						<span class="critique-members__username">@{member.artist.username}</span>
						<div class="critique-members__stats">
							<span>Given: {member.critiquesGiven}</span>
							<span>Received: {member.critiquesReceived}</span>
						</div>
					</div>

					<!-- Actions for admins -->
					{#if userCanRemove && member.role !== 'admin'}
						<div class="critique-members__actions">
							<select
								value={member.role}
								onchange={(e) =>
									handleRoleChange(
										member,
										(e.target as HTMLSelectElement).value as 'moderator' | 'member'
									)}
								class="critique-members__role-select"
							>
								<option value="member">Member</option>
								<option value="moderator">Moderator</option>
							</select>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.critique-members {
		background: var(--gr-color-gray-800);
		border-radius: var(--gr-radius-lg);
		padding: var(--gr-spacing-scale-5);
	}

	.critique-members__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.critique-members__title {
		font-size: var(--gr-font-size-lg);
		font-weight: var(--gr-font-weight-semibold);
		margin: 0;
	}

	.critique-members__invite-btn {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-primary-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		font-weight: var(--gr-font-weight-medium);
		cursor: pointer;
	}

	.critique-members__invite-form {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		margin-bottom: var(--gr-spacing-scale-4);
	}

	.critique-members__invite-input {
		flex: 1;
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border: 1px solid var(--gr-color-gray-600);
		border-radius: var(--gr-radius-md);
		color: var(--gr-color-gray-100);
	}

	.critique-members__invite-submit {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-4);
		background: var(--gr-color-success-600);
		border: none;
		border-radius: var(--gr-radius-md);
		color: white;
		cursor: pointer;
	}

	.critique-members__invite-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.critique-members__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
		max-height: 400px;
		overflow-y: auto;
	}

	.critique-members__item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-3);
		padding: var(--gr-spacing-scale-3);
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-md);
	}

	.critique-members__avatar {
		width: 48px;
		height: 48px;
		border-radius: var(--gr-radius-full);
		object-fit: cover;
		background: var(--gr-color-gray-600);
	}

	.critique-members__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.critique-members__name-row {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
	}

	.critique-members__name {
		font-weight: var(--gr-font-weight-medium);
	}

	.critique-members__badge {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		border-radius: var(--gr-radius-sm);
		font-size: var(--gr-font-size-xs);
		color: white;
	}

	.critique-members__username {
		font-size: var(--gr-font-size-sm);
		color: var(--gr-color-gray-400);
	}

	.critique-members__stats {
		display: flex;
		gap: var(--gr-spacing-scale-3);
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-500);
	}

	.critique-members__actions {
		display: flex;
		gap: var(--gr-spacing-scale-2);
	}

	.critique-members__role-select {
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-gray-600);
		border: 1px solid var(--gr-color-gray-500);
		border-radius: var(--gr-radius-sm);
		color: var(--gr-color-gray-100);
		font-size: var(--gr-font-size-sm);
	}
</style>
