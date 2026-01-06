<!--
  Admin.Analytics - Analytics Dashboard
  
  Visualize instance activity and growth over time.
  Shows user growth, post activity, and federation metrics.
  
  @component
-->
<script lang="ts">
	import { getAdminContext } from './context.svelte.js';
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
							<svg
								class="admin-analytics__bar-svg"
								viewBox="0 0 10 100"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<title>{`${dataPoint.count} users`}</title>
								<rect
									class="admin-analytics__bar-rect admin-analytics__bar-rect--primary"
									x="0"
									y={100 - height}
									width="10"
									{height}
									rx="2"
								/>
							</svg>
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
							<svg
								class="admin-analytics__bar-svg"
								viewBox="0 0 10 100"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<title>{`${dataPoint.count} posts`}</title>
								<rect
									class="admin-analytics__bar-rect admin-analytics__bar-rect--success"
									x="0"
									y={100 - height}
									width="10"
									{height}
									rx="2"
								/>
							</svg>
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
							<svg
								class="admin-analytics__bar-svg"
								viewBox="0 0 10 100"
								preserveAspectRatio="none"
								aria-hidden="true"
							>
								<title>{`${dataPoint.count} activities`}</title>
								<rect
									class="admin-analytics__bar-rect admin-analytics__bar-rect--warning"
									x="0"
									y={100 - height}
									width="10"
									{height}
									rx="2"
								/>
							</svg>
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
