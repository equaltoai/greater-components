<!--
  Admin.Reports - Moderation Reports
-->
<script lang="ts">
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, fetchReports, handlers } = getAdminContext();

	onMount(() => {
		fetchReports('pending');
	});
</script>

<div class="admin-reports {className}">
	<h2 class="admin-reports__title">Reports</h2>

	{#if state.loading}
		<div class="admin-reports__loading">Loading reports...</div>
	{:else}
		<div class="admin-reports__list">
			{#each state.reports as report}
				<div class="admin-reports__card">
					<div class="admin-reports__header">
						<strong>@{report.reporter.username}</strong> reported
						<strong>@{report.target.username}</strong>
						<span class="admin-reports__badge admin-reports__badge--{report.status}"
							>{report.status}</span
						>
					</div>
					<div class="admin-reports__reason">{report.reason}</div>
					<div class="admin-reports__meta">{new Date(report.createdAt).toLocaleString()}</div>
					{#if report.status === 'pending'}
						<div class="admin-reports__actions">
							<button onclick={() => handlers.onResolveReport?.(report.id, 'suspend')}
								>Resolve</button
							>
							<button onclick={() => handlers.onDismissReport?.(report.id)}>Dismiss</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.admin-reports {
		padding: 1.5rem;
	}

	.admin-reports__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 800;
	}

	.admin-reports__list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.admin-reports__card {
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
	}

	.admin-reports__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.admin-reports__reason {
		margin: 0.5rem 0;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.25rem;
	}

	.admin-reports__meta {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.admin-reports__actions {
		margin-top: 0.75rem;
		display: flex;
		gap: 0.5rem;
	}

	.admin-reports__actions button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.25rem;
		background: transparent;
		cursor: pointer;
	}

	.admin-reports__badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.admin-reports__badge--pending {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.admin-reports__badge--resolved {
		background: rgba(0, 186, 124, 0.1);
		color: #00ba7c;
	}

	.admin-reports__badge--dismissed {
		background: rgba(107, 114, 128, 0.1);
		color: #6b7280;
	}

	.admin-reports__loading {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}
</style>
