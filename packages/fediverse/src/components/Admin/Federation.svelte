<!--
  Admin.Federation - Federated Instances Management
  
  Manage federation with other ActivityPub instances.
  Block, limit, or allow domains with detailed controls.
  
  @component
-->
<script lang="ts">
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchInstances, handlers } = getAdminContext();

	let blockModalOpen = $state(false);
	let selectedDomain = $state<string | null>(null);
	let blockReason = $state('');
	let filterStatus = $state<'all' | 'allowed' | 'limited' | 'blocked'>('all');

	const blockModal = createModal({
		onClose: () => {
			blockModalOpen = false;
			blockReason = '';
			selectedDomain = null;
		},
	});

	$effect(() => {
		if (blockModalOpen) {
			blockModal.helpers.open();
		} else {
			blockModal.helpers.close();
		}
	});

	onMount(() => {
		fetchInstances();
	});

	const filteredInstances = $derived(
		filterStatus === 'all'
			? adminState.instances
			: adminState.instances.filter((i) => i.status === filterStatus)
	);

	function openBlockModal(domain: string) {
		selectedDomain = domain;
		blockModalOpen = true;
	}

	async function handleBlock() {
		if (!selectedDomain || !blockReason.trim()) return;

		await handlers.onBlockInstance?.(selectedDomain, blockReason);
		blockModalOpen = false;
		blockReason = '';
		selectedDomain = null;
		fetchInstances();
	}

	async function handleUnblock(domain: string) {
		await handlers.onUnblockInstance?.(domain);
		fetchInstances();
	}
</script>

<div class={`admin-federation ${className}`}>
	<div class="admin-federation__header">
		<h2 class="admin-federation__title">Federation Management</h2>
		<div class="admin-federation__filters">
			<button
				class="admin-federation__filter"
				class:admin-federation__filter--active={filterStatus === 'all'}
				onclick={() => (filterStatus = 'all')}
			>
				All
			</button>
			<button
				class="admin-federation__filter"
				class:admin-federation__filter--active={filterStatus === 'allowed'}
				onclick={() => (filterStatus = 'allowed')}
			>
				Allowed
			</button>
			<button
				class="admin-federation__filter"
				class:admin-federation__filter--active={filterStatus === 'limited'}
				onclick={() => (filterStatus = 'limited')}
			>
				Limited
			</button>
			<button
				class="admin-federation__filter"
				class:admin-federation__filter--active={filterStatus === 'blocked'}
				onclick={() => (filterStatus = 'blocked')}
			>
				Blocked
			</button>
		</div>
	</div>

	{#if adminState.loading}
		<div class="admin-federation__loading">
			<div class="admin-federation__spinner"></div>
			<p>Loading instances...</p>
		</div>
	{:else}
		<div class="admin-federation__table">
			<table>
				<thead>
					<tr>
						<th>Domain</th>
						<th>Software</th>
						<th>Users</th>
						<th>Status</th>
						<th>Last Seen</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredInstances as instance (instance.domain)}
						<tr>
							<td class="admin-federation__domain">{instance.domain}</td>
							<td>
								{#if instance.softwareName}
									{instance.softwareName}
									{#if instance.softwareVersion}
										<span class="admin-federation__version">v{instance.softwareVersion}</span>
									{/if}
								{:else}
									<span class="admin-federation__unknown">Unknown</span>
								{/if}
							</td>
							<td>{instance.usersCount || '-'}</td>
							<td>
								<span class={`admin-federation__badge admin-federation__badge--${instance.status}`}>
									{instance.status}
								</span>
							</td>
							<td>
								{#if instance.lastSeen}
									{new Date(instance.lastSeen).toLocaleDateString()}
								{:else}
									<span class="admin-federation__unknown">Never</span>
								{/if}
							</td>
							<td>
								<div class="admin-federation__actions">
									{#if instance.status === 'blocked'}
										<button
											class="admin-federation__action admin-federation__action--success"
											onclick={() => handleUnblock(instance.domain)}
										>
											Unblock
										</button>
									{:else}
										<button
											class="admin-federation__action admin-federation__action--danger"
											onclick={() => openBlockModal(instance.domain)}
										>
											Block
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

	<!-- Block Modal -->
	{#if blockModalOpen}
		<div class="admin-federation__modal-backdrop" use:blockModal.actions.backdrop>
			<div class="admin-federation__modal" use:blockModal.actions.content>
				<h3 class="admin-federation__modal-title">Block Instance</h3>
				<p class="admin-federation__modal-text">
					Blocking <strong>{selectedDomain}</strong> will prevent all communication with this instance.
				</p>

				<div class="admin-federation__field">
					<label for="block-reason" class="admin-federation__label">Reason</label>
					<textarea
						id="block-reason"
						class="admin-federation__textarea"
						bind:value={blockReason}
						placeholder="Enter reason for blocking this instance..."
						rows="3"
					></textarea>
				</div>

				<div class="admin-federation__modal-actions">
					<button
						class="admin-federation__button admin-federation__button--secondary"
						onclick={() => (blockModalOpen = false)}
					>
						Cancel
					</button>
					<button
						class="admin-federation__button admin-federation__button--danger"
						onclick={handleBlock}
						disabled={!blockReason.trim()}
					>
						Block Instance
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-federation {
		padding: 1.5rem;
	}

	.admin-federation__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.admin-federation__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-federation__filters {
		display: flex;
		gap: 0.5rem;
	}

	.admin-federation__filter {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		background: transparent;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-federation__filter:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-federation__filter--active {
		background: var(--primary-color, #1d9bf0);
		border-color: var(--primary-color, #1d9bf0);
		color: white;
	}

	.admin-federation__loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 4rem 2rem;
	}

	.admin-federation__spinner {
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

	.admin-federation__table {
		overflow-x: auto;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-federation__table table {
		width: 100%;
		border-collapse: collapse;
	}

	.admin-federation__table th {
		padding: 1rem;
		text-align: left;
		font-weight: 700;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		border-bottom: 2px solid var(--border-color, #e1e8ed);
		background: var(--bg-secondary, #f7f9fa);
	}

	.admin-federation__table td {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		font-size: 0.9375rem;
	}

	.admin-federation__domain {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.admin-federation__version {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		margin-left: 0.5rem;
	}

	.admin-federation__unknown {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		font-style: italic;
	}

	.admin-federation__badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.admin-federation__badge--allowed {
		background: rgba(0, 186, 124, 0.1);
		color: #00ba7c;
	}

	.admin-federation__badge--limited {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.admin-federation__badge--blocked {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-federation__actions {
		display: flex;
		gap: 0.5rem;
	}

	.admin-federation__action {
		padding: 0.375rem 0.875rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		background: transparent;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-federation__action--danger {
		border-color: #f4211e;
		color: #f4211e;
	}

	.admin-federation__action--danger:hover {
		background: rgba(244, 33, 46, 0.1);
	}

	.admin-federation__action--success {
		border-color: #00ba7c;
		color: #00ba7c;
	}

	.admin-federation__action--success:hover {
		background: rgba(0, 186, 124, 0.1);
	}

	/* Modal */
	.admin-federation__modal-backdrop {
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
	}

	.admin-federation__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 32rem;
		width: 90%;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}

	.admin-federation__modal-title {
		margin: 0 0 0.75rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-federation__modal-text {
		margin: 0 0 1.5rem 0;
		color: var(--text-secondary, #536471);
	}

	.admin-federation__field {
		margin-bottom: 1.5rem;
	}

	.admin-federation__label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-federation__textarea {
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

	.admin-federation__textarea:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-federation__modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.admin-federation__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-federation__button--secondary {
		background: transparent;
		border: 1px solid var(--border-color, #e1e8ed);
		color: var(--text-primary, #0f1419);
	}

	.admin-federation__button--secondary:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.admin-federation__button--danger {
		background: #f4211e;
		color: white;
	}

	.admin-federation__button--danger:hover:not(:disabled) {
		background: #d41d1a;
	}

	.admin-federation__button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
