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

	const { state: adminState, fetchReports, handlers } = getAdminContext();

	onMount(() => {
		fetchReports('pending');
	});
</script>

<div class={`admin-reports ${className}`}>
	<h2 class="admin-reports__title">Reports</h2>

	{#if adminState.loading}
		<div class="admin-reports__loading">Loading reports...</div>
	{:else}
		<div class="admin-reports__list">
			{#each adminState.reports as report (report.id)}
				<div class="admin-reports__card">
					<div class="admin-reports__header">
						<strong>@{report.reporter.username}</strong> reported
						<strong>@{report.target.username}</strong>
						<span class={`admin-reports__badge admin-reports__badge--${report.status}`}
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
