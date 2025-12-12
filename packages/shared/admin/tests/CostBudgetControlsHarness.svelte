<script lang="ts">
	import { createCostContext } from '../src/Cost/context.js';
	import BudgetControls from '../src/Cost/BudgetControls.svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	createCostContext(untrack(() => ({ adapter })));
</script>

<BudgetControls class={className} />
