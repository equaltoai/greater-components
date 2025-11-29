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

	const { state: adminState, fetchStats } = getAdminContext();

	onMount(() => {
		fetchStats();
	});
</script>

<div class={`admin-overview ${className}`}>
	<h2 class="admin-overview__title">Dashboard Overview</h2>

	{#if adminState.loading && !adminState.stats}
		<div class="admin-overview__loading">Loading stats...</div>
	{:else if adminState.stats}
		<div class="admin-overview__grid">
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Total Users</div>
				<div class="admin-overview__card-value">{formatNumber(adminState.stats.totalUsers)}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Active Users</div>
				<div class="admin-overview__card-value">{formatNumber(adminState.stats.activeUsers)}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Total Posts</div>
				<div class="admin-overview__card-value">{formatNumber(adminState.stats.totalPosts)}</div>
			</div>
			<div class="admin-overview__card admin-overview__card--warning">
				<div class="admin-overview__card-label">Pending Reports</div>
				<div class="admin-overview__card-value">{adminState.stats.pendingReports}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Blocked Domains</div>
				<div class="admin-overview__card-value">{adminState.stats.blockedDomains}</div>
			</div>
			<div class="admin-overview__card">
				<div class="admin-overview__card-label">Storage Used</div>
				<div class="admin-overview__card-value">{adminState.stats.storageUsed}</div>
			</div>
		</div>
	{/if}
</div>
