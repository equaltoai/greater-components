<!--
Admin.Cost.Dashboard - Cost Breakdown Display

Shows cost breakdown by service and operation.

@component
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getCostContext } from './context.js';

	interface Props {
		period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
		class?: string;
	}

	let { period, class: className = '' }: Props = $props();

	const context = getCostContext();
	let breakdown = $state<Record<string, unknown> | null>(null);
	let loading = $state(false);

	async function load() {
		loading = true;
		try {
			breakdown = await context.config.adapter.getCostBreakdown(period || context.state.period);
		} finally {
			loading = false;
		}
	}

	onMount(load);
	$effect(() => {
		if (period) {
			void load();
		}
	});

	function fmt(cost: number): string {
		return `$${(cost / 1000000).toFixed(4)}`;
	}
</script>

<div class={`cost-dashboard ${className}`}>
	<h4>Cost Dashboard</h4>
	{#if loading}
		<p>Loading...</p>
	{:else if breakdown}
		{@const data = breakdown as {
			totalCost: number;
			breakdown: Array;
		}}
		<div>Total: {fmt(data.totalCost)}</div>
		<ul>
			{#each data.breakdown as item (item.operation)}
				<li>{item.operation}: {fmt(item.cost)} ({item.count} calls)</li>
			{/each}
		</ul>
	{/if}
</div>
