<script lang="ts">
	import { createCommissionContext } from '../../../src/components/CreativeTools/CommissionWorkflow/context.js';
	import { CommissionWorkflow } from '../../../src/components/CreativeTools/index.js';
	import type {
		CommissionData,
		CommissionStatus,
		CommissionHandlers,
	} from '../../../src/types/creative-tools.js';

	import { untrack } from 'svelte';

	interface Props {
		initialCommission: CommissionData;
		onStatusChange?: (status: CommissionStatus) => void;
	}

	let { initialCommission, onStatusChange }: Props = $props();

	let commission = $state(untrack(() => initialCommission));

	const handlers = {
		onStatusChange: (status: CommissionStatus) => {
			commission = { ...commission, status };
			onStatusChange?.(status);
		},
		// Other handlers if needed
	};

	createCommissionContext(() => commission, 'client', handlers as unknown as CommissionHandlers);
</script>

<CommissionWorkflow.Root {commission} role="client">
	<!-- Render all steps or switch based on current step -->
	<!-- Assuming Root handles routing based on step, or we render specific components -->
	<!-- CommissionWorkflow usually uses subcomponents inside Root -->
	<!-- Let's render common ones -->
	<!-- Wait, Root usually expects children. -->
	<div>
		{#if commission.status === 'inquiry'}
			<button onclick={() => handlers.onStatusChange('quoted')}>Request Quote</button>
		{/if}
		{#if commission.status === 'quoted'}
			<button onclick={() => handlers.onStatusChange('accepted')}>Accept Quote</button>
		{/if}
		Status: {commission.status}
	</div>
</CommissionWorkflow.Root>
