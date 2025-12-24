<script lang="ts">
	import Alerts from '../src/Cost/Alerts.svelte';
	import { createCostContext } from '../src/Cost/context.js';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
	import { untrack } from 'svelte';

	let {
		adapter,
		class: className,
		alerts,
	}: {
		adapter: LesserGraphQLAdapter;
		class?: string;
		alerts?: Array<Record<string, unknown>>;
	} = $props();

	createCostContext({
		adapter: untrack(() => adapter),
	});
</script>

<Alerts class={className} {alerts} />
