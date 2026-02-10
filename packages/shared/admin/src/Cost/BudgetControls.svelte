<!--
Admin.Cost.BudgetControls - Budget Management

Set and manage instance budgets and cost limits.

@component
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getCostContext } from './context.js';

	interface InstanceBudget {
		domain: string;
		monthlyBudgetUSD: number;
		currentSpendUSD: number;
	}

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const context = getCostContext();
	let budgets = $state<InstanceBudget[]>([]);
	let loading = $state(false);
	let domain = $state('');
	let monthlyUSD = $state(100);
	let autoLimit = $state(false);

	async function load() {
		loading = true;
		try {
			const result = await context.config.adapter.getInstanceBudgets();
			budgets = result.map((budget) => ({
				domain: budget.domain,
				monthlyBudgetUSD: budget.monthlyBudgetUSD,
				currentSpendUSD: budget.currentSpendUSD,
			}));
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
