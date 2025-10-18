<!--
  Admin.Analytics - Analytics Dashboard
  
  Visualize instance activity and growth over time.
  Shows user growth, post activity, and federation metrics.
  
  @component
-->
<script lang="ts">
	import { getAdminContext } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: adminState, fetchAnalytics } = getAdminContext();

	let period = $state<'day' | 'week' | 'month'>('week');

	onMount(() => {
		fetchAnalytics(period);
	});

	$effect(() => {
		fetchAnalytics(period);
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	}

	function getMaxValue(data: { count: number }[]): number {
		return Math.max(...data.map((d) => d.count), 1);
	}

	function getChartHeight(value: number, max: number): number {
		return (value / max) * 100;
	}
</script>

<div class={`admin-analytics ${className}`}>
	<div class="admin-analytics__header">
		<h2 class="admin-analytics__title">Analytics</h2>
		<div class="admin-analytics__period-selector">
			<button
				class="admin-analytics__period-button"
				class:admin-analytics__period-button--active={period === 'day'}
				onclick={() => (period = 'day')}
			>
				24 Hours
			</button>
			<button
				class="admin-analytics__period-button"
				class:admin-analytics__period-button--active={period === 'week'}
				onclick={() => (period = 'week')}
			>
				7 Days
			</button>
			<button
				class="admin-analytics__period-button"
				class:admin-analytics__period-button--active={period === 'month'}
				onclick={() => (period = 'month')}
			>
				30 Days
			</button>
		</div>
	</div>

	{#if adminState.loading && !adminState.analytics}
		<div class="admin-analytics__loading">
			<div class="admin-analytics__spinner"></div>
			<p>Loading analytics...</p>
		</div>
	{:else if adminState.analytics}
		<div class="admin-analytics__charts">
			<!-- User Growth -->
			<div class="admin-analytics__chart-card">
				<h3 class="admin-analytics__chart-title">User Growth</h3>
				<div class="admin-analytics__chart">
					{#each adminState.analytics.userGrowth as dataPoint (dataPoint.date)}
						{@const max = getMaxValue(adminState.analytics.userGrowth)}
						{@const height = getChartHeight(dataPoint.count, max)}
						<div class="admin-analytics__bar-container">
							<div
								class="admin-analytics__bar admin-analytics__bar--primary"
								style={`height: ${height}%`}
								title={`${dataPoint.count} users`}
							></div>
							<span class="admin-analytics__bar-label">{formatDate(dataPoint.date)}</span>
						</div>
					{/each}
				</div>
				<div class="admin-analytics__chart-summary">
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Total</span>
						<span class="admin-analytics__summary-value">
							{adminState.analytics.userGrowth.reduce((sum, d) => sum + d.count, 0)}
						</span>
					</div>
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Average</span>
						<span class="admin-analytics__summary-value">
							{Math.round(
								adminState.analytics.userGrowth.reduce((sum, d) => sum + d.count, 0) /
									adminState.analytics.userGrowth.length
							)}
						</span>
					</div>
				</div>
			</div>

			<!-- Post Activity -->
			<div class="admin-analytics__chart-card">
				<h3 class="admin-analytics__chart-title">Post Activity</h3>
				<div class="admin-analytics__chart">
					{#each adminState.analytics.postActivity as dataPoint (dataPoint.date)}
						{@const max = getMaxValue(adminState.analytics.postActivity)}
						{@const height = getChartHeight(dataPoint.count, max)}
						<div class="admin-analytics__bar-container">
							<div
								class="admin-analytics__bar admin-analytics__bar--success"
								style={`height: ${height}%`}
								title={`${dataPoint.count} posts`}
							></div>
							<span class="admin-analytics__bar-label">{formatDate(dataPoint.date)}</span>
						</div>
					{/each}
				</div>
				<div class="admin-analytics__chart-summary">
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Total</span>
						<span class="admin-analytics__summary-value">
							{adminState.analytics.postActivity.reduce((sum, d) => sum + d.count, 0)}
						</span>
					</div>
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Average</span>
						<span class="admin-analytics__summary-value">
							{Math.round(
								adminState.analytics.postActivity.reduce((sum, d) => sum + d.count, 0) /
									adminState.analytics.postActivity.length
							)}
						</span>
					</div>
				</div>
			</div>

			<!-- Federation Activity -->
			<div class="admin-analytics__chart-card">
				<h3 class="admin-analytics__chart-title">Federation Activity</h3>
				<div class="admin-analytics__chart">
					{#each adminState.analytics.federationActivity as dataPoint (dataPoint.date)}
						{@const max = getMaxValue(adminState.analytics.federationActivity)}
						{@const height = getChartHeight(dataPoint.count, max)}
						<div class="admin-analytics__bar-container">
							<div
								class="admin-analytics__bar admin-analytics__bar--warning"
								style={`height: ${height}%`}
								title={`${dataPoint.count} activities`}
							></div>
							<span class="admin-analytics__bar-label">{formatDate(dataPoint.date)}</span>
						</div>
					{/each}
				</div>
				<div class="admin-analytics__chart-summary">
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Total</span>
						<span class="admin-analytics__summary-value">
							{adminState.analytics.federationActivity.reduce((sum, d) => sum + d.count, 0)}
						</span>
					</div>
					<div class="admin-analytics__summary-item">
						<span class="admin-analytics__summary-label">Average</span>
						<span class="admin-analytics__summary-value">
							{Math.round(
								adminState.analytics.federationActivity.reduce((sum, d) => sum + d.count, 0) /
									adminState.analytics.federationActivity.length
							)}
						</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-analytics {
		padding: 1.5rem;
	}

	.admin-analytics__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.admin-analytics__title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.admin-analytics__period-selector {
		display: flex;
		gap: 0.5rem;
		padding: 0.25rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 9999px;
	}

	.admin-analytics__period-button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 9999px;
		background: transparent;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		cursor: pointer;
		transition: all 0.2s;
	}

	.admin-analytics__period-button:hover {
		color: var(--text-primary, #0f1419);
	}

	.admin-analytics__period-button--active {
		background: white;
		color: var(--text-primary, #0f1419);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.admin-analytics__loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 4rem 2rem;
	}

	.admin-analytics__spinner {
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

	.admin-analytics__charts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		gap: 1.5rem;
	}

	.admin-analytics__chart-card {
		padding: 1.5rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
	}

	.admin-analytics__chart-title {
		margin: 0 0 1.5rem 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.admin-analytics__chart {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		height: 12rem;
		margin-bottom: 1.5rem;
	}

	.admin-analytics__bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		height: 100%;
	}

	.admin-analytics__bar {
		width: 100%;
		min-height: 2px;
		border-radius: 0.25rem 0.25rem 0 0;
		margin-top: auto;
		transition: all 0.3s;
	}

	.admin-analytics__bar:hover {
		opacity: 0.8;
	}

	.admin-analytics__bar--primary {
		background: var(--primary-color, #1d9bf0);
	}

	.admin-analytics__bar--success {
		background: #00ba7c;
	}

	.admin-analytics__bar--warning {
		background: #f59e0b;
	}

	.admin-analytics__bar-label {
		margin-top: 0.5rem;
		font-size: 0.625rem;
		color: var(--text-secondary, #536471);
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	.admin-analytics__chart-summary {
		display: flex;
		gap: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.admin-analytics__summary-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.admin-analytics__summary-label {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
		text-transform: uppercase;
		font-weight: 600;
	}

	.admin-analytics__summary-value {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}
</style>
