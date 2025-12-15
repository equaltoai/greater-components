<script lang="ts">
	import { createCommissionContext } from '../../../src/components/CreativeTools/CommissionWorkflow/context.js';
	import type { CommissionData, CommissionHandlers } from '../../../src/types/creative-tools.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		commission: CommissionData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { commission, Component, props = {} }: Props = $props();

	createCommissionContext(
		untrack(() => commission),
		'client',
		{} as CommissionHandlers
	);
</script>

<Component {...props} />
