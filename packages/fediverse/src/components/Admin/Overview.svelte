<!--
  Admin.Overview - Dashboard Overview
-->
<script lang="ts">
	import { getAdminContext, formatNumber } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state, fetchStats } = getAdminContext();

	onMount(() => {
		fetchStats();
	});
</script>

<div class="admin-overview {className}">
	<h2 class="admin-overview__title">Dashboard Overview</h2>

	{#if state.loading && !state.stats}
		<div class="admin-overview__loading">Loading stats...</div>
	{:else if state.stats}
		<div class="admin-overview__grid">
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Total Users</div>
				<div class="admin-overview__card-value">{formatNumber(state.stats.totalUsers)}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Active Users</div>
				<div class="admin-overview__card-value">{formatNumber(state.stats.activeUsers)}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Total Posts</div>
				<div class="admin-overview__card-value">{formatNumber(state.stats.totalPosts)}</div>
			</div>
			<div class="admin-overview__card admin-overview__card--warning">
				<div class="admin-overview__card-label">Pending Reports</div>
				<div class="admin-overview__card-value">{state.stats.pendingReports}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Blocked Domains</div>
				<div class="admin-overview__card-value">{state.stats.blockedDomains}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Storage Used</div>
				<div class="admin-overview__card-value">{state.stats.storageUsed}</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-overview {
		padding: 1.5rem;
	}

	.admin-overview__title {
		margin: 0 0 1.5rem 0;
		font-size: 1.5rem;
		font-weight: 800;
	}

	.admin-overview__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 1rem;
	}

	.admin-overview__card {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-overview__card--warning {
		border-color: #f59e0b;
		background: rgba(245, 158, 11, 0.05);
	}

	.admin-overview__card-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		margin-bottom: 0.5rem;
	}

	.admin-overview__card-value {
		font-size: 2rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-overview__loading {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}
</style>
