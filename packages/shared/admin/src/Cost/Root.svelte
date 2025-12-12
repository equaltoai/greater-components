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
	import { untrack } from 'svelte';
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
	createCostContext(
		untrack(() => ({
			adapter,
			...config,
		}))
	);
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
