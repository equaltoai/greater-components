<!--
Admin.Cost.BudgetControls - Budget Management

Set and manage instance budgets and cost limits.

@component
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getCostContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getCostContext();
	let budgets = $state<Array<Record<string, unknown>>>([]);
	let loading = $state(false);
	let domain = $state('');
	let monthlyUSD = $state(100);
	let autoLimit = $state(false);

	async function load() {
		loading = true;
		try {
			budgets = await context.config.adapter.getInstanceBudgets();
		} finally {
			loading = false;
		}
	}

	async function saveBudget() {
		if (!domain) return;
		await context.config.adapter.setInstanceBudget(domain, monthlyUSD, autoLimit);
		await load();
		domain = '';
		monthlyUSD = 100;
		autoLimit = false;
	}

	onMount(load);
</script>

<div class={`budget-controls ${className}`}>
	<h4>Budget Controls</h4>
	<div class="budget-controls__form">
		<input bind:value={domain} placeholder="Instance domain" />
		<input type="number" bind:value={monthlyUSD} placeholder="Monthly budget (USD)" />
		<label><input type="checkbox" bind:checked={autoLimit} /> Auto-limit</label>
		<button onclick={saveBudget} disabled={!domain}>Save Budget</button>
	</div>
	{#if loading}
		<p>Loading...</p>
	{:else}
		<ul>
			{#each budgets as budget (budget.domain)}
				<li>{budget.domain}: ${budget.monthlyBudgetUSD} (Current: ${budget.currentSpendUSD})</li>
			{/each}
		</ul>
	{/if}
</div>
