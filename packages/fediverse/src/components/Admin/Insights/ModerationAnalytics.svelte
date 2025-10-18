<!--
Admin.Insights.ModerationAnalytics - Moderation Statistics

Shows moderation statistics, AI detection rates, and content analysis metrics.

@component
@example
```svelte
<Insights.Root {adapter}>
  <Insights.ModerationAnalytics period="DAY" />
</Insights.Root>
```
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getInsightsContext } from './context.js';

	interface AIStats {
		period: string;
		totalAnalyses: number;
		toxicContent: number;
		spamDetected: number;
		aiGenerated: number;
		nsfwContent: number;
		piiDetected: number;
		toxicityRate: number;
		spamRate: number;
		aiContentRate: number;
		nsfwRate: number;
		moderationActions: {
			flag: number;
			hide: number;
			remove: number;
			review: number;
			shadowBan: number;
		};
	}

	interface Props {
		/**
		 * Time period for stats
		 */
		period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { period, class: className = '' }: Props = $props();

	const context = getInsightsContext();
	let stats = $state<AIStats | null>(null);
	let loading = $state(false);
	let error = $state<Error | null>(null);

	const selectedPeriod = $derived(period || context.state.period);

	async function loadStats() {
		loading = true;
		error = null;
		try {
			const result = await context.config.adapter.getAIStats(selectedPeriod);
			stats = result;
		} catch (err) {
			error = err instanceof Error ? err : new Error('Failed to load moderation stats');
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadStats();
	});

	// Reload when period changes
	$effect(() => {
		void selectedPeriod;
		void loadStats();
	});

	function formatPercent(value: number): string {
		return `${(value * 100).toFixed(1)}%`;
	}

	function formatNumber(value: number): string {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toString();
	}
</script>

<div class={`moderation-analytics ${className}`}>
	<div class="moderation-analytics__header">
		<h3 class="moderation-analytics__title">Moderation Analytics</h3>
		<select
			class="moderation-analytics__period-select"
			value={selectedPeriod}
			onchange={(e) =>
				context.updateState({
					period: e.currentTarget.value as 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR',
				})}
		>
			<option value="HOUR">Last Hour</option>
			<option value="DAY">Last Day</option>
			<option value="WEEK">Last Week</option>
			<option value="MONTH">Last Month</option>
			<option value="YEAR">Last Year</option>
		</select>
	</div>

	{#if loading}
		<div class="moderation-analytics__loading">
			<p>Loading statistics...</p>
		</div>
	{:else if error}
		<div class="moderation-analytics__error">
			<p>Error: {error.message}</p>
			<button onclick={loadStats} type="button">Retry</button>
		</div>
	{:else if stats}
		<div class="moderation-analytics__content">
			<!-- Summary Cards -->
			<div class="moderation-analytics__cards">
				<div class="moderation-analytics__card">
					<div class="moderation-analytics__card-value">{formatNumber(stats.totalAnalyses)}</div>
					<div class="moderation-analytics__card-label">Total Analyses</div>
				</div>

				<div class="moderation-analytics__card moderation-analytics__card--warning">
					<div class="moderation-analytics__card-value">{formatNumber(stats.toxicContent)}</div>
					<div class="moderation-analytics__card-label">Toxic Content</div>
					<div class="moderation-analytics__card-rate">{formatPercent(stats.toxicityRate)}</div>
				</div>

				<div class="moderation-analytics__card moderation-analytics__card--danger">
					<div class="moderation-analytics__card-value">{formatNumber(stats.spamDetected)}</div>
					<div class="moderation-analytics__card-label">Spam Detected</div>
					<div class="moderation-analytics__card-rate">{formatPercent(stats.spamRate)}</div>
				</div>

				<div class="moderation-analytics__card">
					<div class="moderation-analytics__card-value">{formatNumber(stats.aiGenerated)}</div>
					<div class="moderation-analytics__card-label">AI Generated</div>
					<div class="moderation-analytics__card-rate">{formatPercent(stats.aiContentRate)}</div>
				</div>
			</div>

			<!-- Moderation Actions -->
			<div class="moderation-analytics__section">
				<h4 class="moderation-analytics__section-title">Moderation Actions Taken</h4>
				<div class="moderation-analytics__actions">
					<div class="moderation-analytics__action-item">
						<span class="moderation-analytics__action-label">Flagged</span>
						<span class="moderation-analytics__action-value">{stats.moderationActions.flag}</span>
					</div>
					<div class="moderation-analytics__action-item">
						<span class="moderation-analytics__action-label">Hidden</span>
						<span class="moderation-analytics__action-value">{stats.moderationActions.hide}</span>
					</div>
					<div class="moderation-analytics__action-item">
						<span class="moderation-analytics__action-label">Removed</span>
						<span class="moderation-analytics__action-value">{stats.moderationActions.remove}</span>
					</div>
					<div class="moderation-analytics__action-item">
						<span class="moderation-analytics__action-label">Under Review</span>
						<span class="moderation-analytics__action-value">{stats.moderationActions.review}</span>
					</div>
					<div class="moderation-analytics__action-item">
						<span class="moderation-analytics__action-label">Shadow Banned</span>
						<span class="moderation-analytics__action-value"
							>{stats.moderationActions.shadowBan}</span
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.moderation-analytics {
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.moderation-analytics__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.moderation-analytics__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.moderation-analytics__period-select {
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.375rem;
		font-size: 0.875rem;
	}

	.moderation-analytics__cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.moderation-analytics__card {
		padding: 1.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
		text-align: center;
	}

	.moderation-analytics__card--warning {
		background: rgba(255, 152, 0, 0.1);
	}

	.moderation-analytics__card--danger {
		background: rgba(244, 33, 46, 0.1);
	}

	.moderation-analytics__card-value {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.moderation-analytics__card-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.moderation-analytics__card-rate {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		margin-top: 0.25rem;
	}

	.moderation-analytics__section {
		margin-bottom: 1.5rem;
	}

	.moderation-analytics__section-title {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}

	.moderation-analytics__actions {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.moderation-analytics__action-item {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.375rem;
	}

	.moderation-analytics__action-label {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.moderation-analytics__action-value {
		font-weight: 600;
		font-size: 1rem;
	}

	.moderation-analytics__loading,
	.moderation-analytics__error {
		padding: 2rem;
		text-align: center;
	}

	.moderation-analytics__error {
		color: var(--danger-color, #f4211e);
	}
</style>
