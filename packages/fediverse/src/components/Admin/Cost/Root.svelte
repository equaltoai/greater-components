<!--
Admin.Cost.Root - Cost Management Container

Root component for cost tracking, budgets, and alerts.

@component
@example
```svelte
<Cost.Root {adapter}>
  <Cost.Dashboard />
  <Cost.Alerts />
  <Cost.BudgetControls />
</Cost.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCostContext, type CostConfig } from './context.js';

	interface Props {
		/**
		 * GraphQL adapter
		 */
		adapter: CostConfig['adapter'];

		/**
		 * Configuration options
		 */
		config?: Partial<Omit<CostConfig, 'adapter'>>;

		/**
		 * Children content
		 */
		children?: Snippet;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let { adapter, config = {}, children, class: className = '' }: Props = $props();

	// Create context
	createCostContext({
		adapter,
		...config,
	});
</script>

<div class={`cost-root ${className}`}>
	{#if children}
		{@render children()}
	{:else}
		<div class="cost-root__empty">
			<p>No cost components configured. Add Cost.Dashboard, Cost.Alerts, or Cost.BudgetControls.</p>
		</div>
	{/if}
</div>

<style>
	.cost-root {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	.cost-root__empty {
		padding: 3rem;
		text-align: center;
		color: var(--text-secondary, #536471);
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 0.5rem;
	}
</style>
