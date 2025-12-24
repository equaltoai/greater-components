<script lang="ts">
	import CommissionWorkflowRoot from '../../../src/components/CreativeTools/CommissionWorkflow/Root.svelte';
	import type { CommissionData, CommissionHandlers } from '../../../src/types/creative-tools';
	import type { CommissionRole } from '../../../src/components/CreativeTools/CommissionWorkflow/context';

	interface Props {
		commission: CommissionData;
		role: CommissionRole;
		handlers?: CommissionHandlers;
	}

	let { commission, role, handlers }: Props = $props();
</script>

<CommissionWorkflowRoot {commission} {role} {handlers}>
	<div data-testid="commission-content">Commission Content</div>
</CommissionWorkflowRoot>
