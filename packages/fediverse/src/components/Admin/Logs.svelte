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

<style>
	.admin-logs {
		padding: 1.5rem;
	}

	.admin-logs__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.admin-logs__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-logs__controls {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.admin-logs__auto-refresh {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.admin-logs__button {
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: 9999px;
		background: var(--primary-color, #1d9bf0);
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.admin-logs__button:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.admin-logs__filters {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-logs__filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.admin-logs__filter-group--grow {
		flex: 1;
	}

	.admin-logs__filter-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
	}

	.admin-logs__select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
		background: white;
		cursor: pointer;
	}

	.admin-logs__input {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: var(--text-primary, #0f1419);
	}

	.admin-logs__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.admin-logs__loading {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.admin-logs__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.admin-logs__empty {
		padding: 4rem 2rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.admin-logs__entry {
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border-left: 4px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.admin-logs__entry--info {
		border-left-color: #1d9bf0;
	}

	.admin-logs__entry--warn {
		border-left-color: #f59e0b;
	}

	.admin-logs__entry--error {
		border-left-color: #f4211e;
	}

	.admin-logs__entry-header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.admin-logs__badge {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.admin-logs__badge--info {
		background: rgba(29, 155, 240, 0.1);
		color: #1d9bf0;
	}

	.admin-logs__badge--warn {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}

	.admin-logs__badge--error {
		background: rgba(244, 33, 46, 0.1);
		color: #f4211e;
	}

	.admin-logs__category {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
	}

	.admin-logs__timestamp {
		margin-left: auto;
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.admin-logs__message {
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
	}

	.admin-logs__metadata {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.375rem;
	}

	.admin-logs__metadata summary {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		cursor: pointer;
	}

	.admin-logs__metadata pre {
		margin: 0.5rem 0 0 0;
		font-size: 0.75rem;
		font-family: 'Courier New', monospace;
		overflow-x: auto;
	}
</style>
