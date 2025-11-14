<!--
  Admin.Users - User Management
  
  Comprehensive user management with modals, search, filters, and bulk actions.
-->
<script lang="ts">
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';
	import type { AdminUser } from './context.js';

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

<style>
	.admin-users {
		padding: 1.5rem;
	}

	.admin-users__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.admin-users__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-users__stats {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	/* Filters */
	.admin-users__filters {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-users__filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 10rem;
	}

	.admin-users__filter-group--grow {
		flex: 1;
	}

	.admin-users__filter-group label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
	}

	.admin-users__select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: white;
		cursor: pointer;
	}

	.admin-users__search {
		position: relative;
		display: flex;
	}

	.admin-users__input {
		flex: 1;
		padding: 0.5rem 2.5rem 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.admin-users__search-btn {
		position: absolute;
		right: 0.25rem;
		top: 50%;
		transform: translateY(-50%);
		padding: 0.375rem;
		border: none;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s;
	}

	.admin-users__search-btn:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--primary-color, #1d9bf0);
	}

	.admin-users__search-btn svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	/* Table */
	.admin-users__table {
		overflow-x: auto;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-users__table table {
		width: 100%;
		border-collapse: collapse;
	}

	.admin-users__table th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		border-bottom: 2px solid var(--border-color, #e1e8ed);
		background: var(--bg-secondary, #f7f9fa);
		text-transform: uppercase;
	}

	.admin-users__table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		font-size: 0.9375rem;
	}

	.admin-users__user {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.admin-users__user-display {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.admin-users__badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.admin-users__badge--admin {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-users__badge--moderator {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.admin-users__badge--user {
		background: rgba(29, 155, 240, 0.1);
		color: #1d9bf0;
	}

	.admin-users__badge--active {
		background: rgba(0, 186, 124, 0.1);
		color: #00ba7c;
	}

	.admin-users__badge--suspended {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-users__badge--deleted {
		background: rgba(107, 114, 128, 0.1);
		color: #6b7280;
	}

	.admin-users__actions {
		display: flex;
		gap: 0.5rem;
	}

	.admin-users__action {
		padding: 0.375rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		background: transparent;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-users__action:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
		color: var(--primary-color, #1d9bf0);
	}

	.admin-users__action--danger {
		color: #f4211e;
		border-color: rgba(244, 33, 46, 0.3);
	}

	.admin-users__action--danger:hover {
		background: rgba(244, 33, 46, 0.1);
		border-color: #f4211e;
	}

	.admin-users__action--success {
		color: #00ba7c;
		border-color: rgba(0, 186, 124, 0.3);
	}

	.admin-users__action--success:hover {
		background: rgba(0, 186, 124, 0.1);
		border-color: #00ba7c;
	}

	.admin-users__action svg {
		width: 1rem;
		height: 1rem;
		display: block;
	}

	/* Loading & Empty States */
	.admin-users__loading,
	.admin-users__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 4rem 2rem;
		color: var(--text-secondary, #536471);
	}

	.admin-users__spinner {
		width: 3rem;
		height: 3rem;
		border: 3px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Modal */
	.admin-users__modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.admin-users__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 32rem;
		width: 100%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.admin-users__modal-title {
		margin: 0 0 0.75rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-users__modal-text {
		margin: 0 0 1.5rem 0;
		color: var(--text-secondary, #536471);
	}

	.admin-users__field {
		margin-bottom: 1.5rem;
	}

	.admin-users__label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-users__textarea {
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

	.admin-users__textarea:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-users__help {
		display: block;
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.admin-users__role-descriptions {
		margin-top: 1rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}

	.admin-users__role-desc {
		font-size: 0.8125rem;
		color: var(--text-primary, #0f1419);
		margin: 0.25rem 0;
	}

	.admin-users__modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.admin-users__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-users__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.admin-users__button--secondary:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-users__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.admin-users__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.admin-users__button--danger {
		background: #f4211e;
		color: white;
	}

	.admin-users__button--danger:hover:not(:disabled) {
		background: #d41d1a;
	}

	.admin-users__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
