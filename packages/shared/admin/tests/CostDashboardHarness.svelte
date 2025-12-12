<script lang="ts">
	import { createCostContext } from '../src/Cost/context.js';
	import CostDashboard from '../src/Cost/Dashboard.svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		period,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		period?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	const context = createCostContext(untrack(() => ({ adapter })));
	if (untrack(() => period)) {
		context.updateState({ period: untrack(() => period) });
	}
</script>

<CostDashboard {period} class={className} />
