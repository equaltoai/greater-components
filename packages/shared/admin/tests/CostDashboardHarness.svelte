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

	const context = createCostContext({ adapter });
	if (period) {
		context.updateState({ period });
	}
</script>

<CostDashboard {period} class={className} />
