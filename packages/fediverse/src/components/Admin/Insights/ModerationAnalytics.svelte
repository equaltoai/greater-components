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
