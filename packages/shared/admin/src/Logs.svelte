<!--
  Admin.Logs - System Logs Viewer
  
  View and filter system logs for debugging and monitoring.
  Supports filtering by level, category, and search.
  
  @component
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchLogs } = getAdminContext();

	let filterLevel = $state<string | undefined>(undefined);
	let filterCategory = $state<string | undefined>(undefined);
	let searchQuery = $state('');
	let autoRefresh = $state(false);
	let refreshInterval: ReturnType<typeof setInterval> | null = null;

	const refreshButton = createButton({
		onClick: () => handleRefresh(),
	});

	onMount(() => {
		fetchLogs({ limit: 100 });

		return () => {
			if (refreshInterval) clearInterval(refreshInterval);
		};
	});

	$effect(() => {
		if (autoRefresh) {
			refreshInterval = setInterval(handleRefresh, 5000);
		} else {
			if (refreshInterval) {
				clearInterval(refreshInterval);
				refreshInterval = null;
			}
		}
	});

	const filteredLogs = $derived(
		adminState.logs.filter((log) => {
			if (filterLevel && log.level !== filterLevel) return false;
			if (filterCategory && log.category !== filterCategory) return false;
			if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}
			return true;
		})
	);

	const categories = $derived(Array.from(new Set(adminState.logs.map((log) => log.category))));

	async function handleRefresh() {
		await fetchLogs({ level: filterLevel, category: filterCategory, limit: 100 });
	}

	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleString();
	}
</script>

<div class={`admin-logs ${className}`}>
	<div class="admin-logs__header">
		<h2 class="admin-logs__title">System Logs</h2>
		<div class="admin-logs__controls">
			<label class="admin-logs__auto-refresh">
				<input type="checkbox" bind:checked={autoRefresh} />
				<span>Auto-refresh (5s)</span>
			</label>
			<button use:refreshButton.actions.button class="admin-logs__button"> Refresh </button>
		</div>
	</div>

	<!-- Filters -->
	<div class="admin-logs__filters">
		<div class="admin-logs__filter-group">
			<label class="admin-logs__filter-label" for="logs-level">Level:</label>
			<select id="logs-level" class="admin-logs__select" bind:value={filterLevel}>
				<option value={undefined}>All</option>
				<option value="info">Info</option>
				<option value="warn">Warning</option>
				<option value="error">Error</option>
			</select>
		</div>

		<div class="admin-logs__filter-group">
			<label class="admin-logs__filter-label" for="logs-category">Category:</label>
			<select id="logs-category" class="admin-logs__select" bind:value={filterCategory}>
				<option value={undefined}>All</option>
				{#each categories as category (category)}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<div class="admin-logs__filter-group admin-logs__filter-group--grow">
			<label class="admin-logs__filter-label" for="logs-search">Search:</label>
			<input
				id="logs-search"
				type="text"
				class="admin-logs__input"
				bind:value={searchQuery}
				placeholder="Search logs..."
			/>
		</div>
	</div>

	<!-- Logs -->
	{#if adminState.loading}
		<div class="admin-logs__loading">Loading logs...</div>
	{:else}
		<div class="admin-logs__list">
			{#if filteredLogs.length === 0}
				<div class="admin-logs__empty">
					<p>No logs found matching your filters</p>
				</div>
			{:else}
				{#each filteredLogs as log (log.id)}
					<div class={`admin-logs__entry admin-logs__entry--${log.level}`}>
						<div class="admin-logs__entry-header">
							<span class={`admin-logs__badge admin-logs__badge--${log.level}`}>
								{log.level}
							</span>
							<span class="admin-logs__category">{log.category}</span>
							<time class="admin-logs__timestamp">{formatTimestamp(log.timestamp)}</time>
						</div>
						<div class="admin-logs__message">{log.message}</div>
						{#if log.metadata}
							<details class="admin-logs__metadata">
								<summary>Metadata</summary>
								<pre>{JSON.stringify(log.metadata, null, 2)}</pre>
							</details>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
