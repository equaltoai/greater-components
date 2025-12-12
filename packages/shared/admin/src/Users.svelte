<!--
  Admin.Users - User Management
  
  Comprehensive user management with modals, search, filters, and bulk actions.
-->
<script lang="ts">
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getAdminContext } from './context.svelte.js';
	        import { onMount } from 'svelte';
	        import type { AdminUser } from './context.svelte.js';
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchUsers, handlers } = getAdminContext();

	// Filters
	let roleFilter = $state<string | undefined>(undefined);
	let statusFilter = $state<string | undefined>(undefined);
	let searchQuery = $state('');

	// Modals
	let suspendModalOpen = $state(false);
	let roleModalOpen = $state(false);
	let selectedUser = $state<AdminUser | null>(null);

	// Suspend form
	let suspendReason = $state('');

	// Role change form
	let newRole = $state<'admin' | 'moderator' | 'user'>('user');

	const suspendModal = createModal({
		onClose: () => {
			suspendModalOpen = false;
			selectedUser = null;
			suspendReason = '';
		},
	});

	const roleModal = createModal({
		onClose: () => {
			roleModalOpen = false;
			selectedUser = null;
			newRole = 'user';
		},
	});

	$effect(() => {
		if (suspendModalOpen) {
			suspendModal.helpers.open();
		} else {
			suspendModal.helpers.close();
		}
	});

	$effect(() => {
		if (roleModalOpen) {
			roleModal.helpers.open();
		} else {
			roleModal.helpers.close();
		}
	});

	onMount(() => {
		loadUsers();
	});

	function loadUsers() {
		fetchUsers({ role: roleFilter, status: statusFilter, search: searchQuery || undefined });
	}

	function openSuspendModal(user: AdminUser) {
		selectedUser = user;
		suspendModalOpen = true;
	}

	function openRoleModal(user: AdminUser) {
		selectedUser = user;
		newRole = user.role;
		roleModalOpen = true;
	}

	async function handleSuspend() {
		if (!selectedUser || !suspendReason.trim()) return;

		try {
			await handlers.onSuspendUser?.(selectedUser.id, suspendReason);
			suspendModalOpen = false;
			suspendReason = '';
			selectedUser = null;
			loadUsers();
		} catch (error) {
			console.error('Failed to suspend user:', error);
		}
	}

	async function handleUnsuspend(userId: string) {
		try {
			await handlers.onUnsuspendUser?.(userId);
			loadUsers();
		} catch (error) {
			console.error('Failed to unsuspend user:', error);
		}
	}

	async function handleRoleChange() {
		if (!selectedUser) return;

		try {
			await handlers.onChangeUserRole?.(selectedUser.id, newRole);
			roleModalOpen = false;
			selectedUser = null;
			newRole = 'user';
			loadUsers();
		} catch (error) {
			console.error('Failed to change role:', error);
		}
	}

	function handleFilterChange() {
		loadUsers();
	}

	function handleSearch() {
		loadUsers();
	}
</script>

<div class={`admin-users ${className}`}>
	<div class="admin-users__header">
		<h2 class="admin-users__title">User Management</h2>
		<div class="admin-users__stats">
			<span>{adminState.users.length} users</span>
		</div>
	</div>

	<!-- Filters & Search -->
	<div class="admin-users__filters">
		<div class="admin-users__filter-group">
			<label for="role-filter">Role</label>
			<select
				id="role-filter"
				class="admin-users__select"
				bind:value={roleFilter}
				onchange={handleFilterChange}
			>
				<option value={undefined}>All Roles</option>
				<option value="admin">Admin</option>
				<option value="moderator">Moderator</option>
				<option value="user">User</option>
			</select>
		</div>

		<div class="admin-users__filter-group">
			<label for="status-filter">Status</label>
			<select
				id="status-filter"
				class="admin-users__select"
				bind:value={statusFilter}
				onchange={handleFilterChange}
			>
				<option value={undefined}>All Statuses</option>
				<option value="active">Active</option>
				<option value="suspended">Suspended</option>
				<option value="deleted">Deleted</option>
			</select>
		</div>

		<div class="admin-users__filter-group admin-users__filter-group--grow">
			<label for="search">Search</label>
			<div class="admin-users__search">
				<input
					id="search"
					type="text"
					class="admin-users__input"
					bind:value={searchQuery}
					placeholder="Search by username or email..."
					onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<button class="admin-users__search-btn" onclick={handleSearch} aria-label="Search users">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Users Table -->
	{#if adminState.loading}
		<div class="admin-users__loading">
			<div class="admin-users__spinner"></div>
			<p>Loading users...</p>
		</div>
	{:else if adminState.users.length === 0}
		<div class="admin-users__empty">
			<p>No users found matching your filters</p>
		</div>
	{:else}
		<div class="admin-users__table">
			<table>
				<thead>
					<tr>
						<th>Username</th>
						<th>Email</th>
						<th>Role</th>
						<th>Status</th>
						<th>Posts</th>
						<th>Followers</th>
						<th>Created</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each adminState.users as user (user.id)}
						<tr>
							<td>
								<div class="admin-users__user">
									<strong>{user.username}</strong>
									{#if user.displayName}
										<span class="admin-users__user-display">{user.displayName}</span>
									{/if}
								</div>
							</td>
							<td>{user.email}</td>
							<td>
								<span class={`admin-users__badge admin-users__badge--${user.role}`}
									>{user.role}</span
								>
							</td>
							<td>
								<span class={`admin-users__badge admin-users__badge--${user.status}`}
									>{user.status}</span
								>
							</td>
							<td>{user.postsCount}</td>
							<td>{user.followersCount}</td>
							<td>{new Date(user.createdAt).toLocaleDateString()}</td>
							<td>
								<div class="admin-users__actions">
									<button
										class="admin-users__action"
										onclick={() => openRoleModal(user)}
										title="Change role"
										aria-label={`Change role for ${user.username}`}
									>
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
											/>
										</svg>
									</button>
									{#if user.status === 'active'}
										<button
											class="admin-users__action admin-users__action--danger"
											onclick={() => openSuspendModal(user)}
											title="Suspend user"
											aria-label={`Suspend ${user.username}`}
										>
											<svg viewBox="0 0 24 24" fill="currentColor">
												<path
													d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
												/>
											</svg>
										</button>
									{:else if user.status === 'suspended'}
										<button
											class="admin-users__action admin-users__action--success"
											onclick={() => handleUnsuspend(user.id)}
											title="Unsuspend user"
											aria-label={`Unsuspend ${user.username}`}
										>
											<svg viewBox="0 0 24 24" fill="currentColor">
												<path
													d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
												/>
											</svg>
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Suspend Modal -->
	{#if suspendModalOpen && selectedUser}
		<div class="admin-users__modal-backdrop" use:suspendModal.actions.backdrop>
			<div class="admin-users__modal" use:suspendModal.actions.content>
				<h3 class="admin-users__modal-title">Suspend User</h3>
				<p class="admin-users__modal-text">
					You are about to suspend <strong>@{selectedUser.username}</strong>. This will prevent them
					from logging in and accessing your instance.
				</p>

				<div class="admin-users__field">
					<label for="suspend-reason" class="admin-users__label">Reason</label>
					<textarea
						id="suspend-reason"
						class="admin-users__textarea"
						bind:value={suspendReason}
						placeholder="Enter the reason for suspension..."
						rows="4"
						required
					></textarea>
					<span class="admin-users__help"
						>This reason will be shown to the user and logged for moderation records.</span
					>
				</div>

				<div class="admin-users__modal-actions">
					<button
						class="admin-users__button admin-users__button--secondary"
						onclick={() => (suspendModalOpen = false)}
					>
						Cancel
					</button>
					<button
						class="admin-users__button admin-users__button--danger"
						onclick={handleSuspend}
						disabled={!suspendReason.trim()}
					>
						Suspend User
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Role Change Modal -->
	{#if roleModalOpen && selectedUser}
		<div class="admin-users__modal-backdrop" use:roleModal.actions.backdrop>
			<div class="admin-users__modal" use:roleModal.actions.content>
				<h3 class="admin-users__modal-title">Change User Role</h3>
				<p class="admin-users__modal-text">
					Change the role for <strong>@{selectedUser.username}</strong>
				</p>

				<div class="admin-users__field">
					<label for="new-role" class="admin-users__label">New Role</label>
					<select id="new-role" class="admin-users__select" bind:value={newRole}>
						<option value="user">User</option>
						<option value="moderator">Moderator</option>
						<option value="admin">Admin</option>
					</select>

					<div class="admin-users__role-descriptions">
						<div class="admin-users__role-desc">
							<strong>User:</strong> Regular user with basic permissions
						</div>
						<div class="admin-users__role-desc">
							<strong>Moderator:</strong> Can review reports and moderate content
						</div>
						<div class="admin-users__role-desc">
							<strong>Admin:</strong> Full access to all administrative functions
						</div>
					</div>
				</div>

				<div class="admin-users__modal-actions">
					<button
						class="admin-users__button admin-users__button--secondary"
						onclick={() => (roleModalOpen = false)}
					>
						Cancel
					</button>
					<button
						class="admin-users__button admin-users__button--primary"
						onclick={handleRoleChange}
					>
						Change Role
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
