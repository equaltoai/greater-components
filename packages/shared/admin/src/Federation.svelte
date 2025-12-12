<!--
  Admin.Federation - Federated Instances Management
  
  Manage federation with other ActivityPub instances.
  Block, limit, or allow domains with detailed controls.
  
  @component
-->
<script lang="ts">
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { getAdminContext } from './context.svelte.js';
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
