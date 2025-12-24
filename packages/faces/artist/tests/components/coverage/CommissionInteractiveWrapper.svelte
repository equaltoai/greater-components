<script lang="ts">
	import CommissionWorkflowRoot from '../../../src/components/CreativeTools/CommissionWorkflow/Root.svelte';
	import type { CommissionData, CommissionHandlers } from '../../../src/types/creative-tools';
	import type { CommissionRole } from '../../../src/components/CreativeTools/CommissionWorkflow/context';
	import { getCommissionContext, navigateToStep, getStepOrder, isStepComplete } from '../../../src/components/CreativeTools/CommissionWorkflow/context';

	interface Props {
		commission: CommissionData;
		role: CommissionRole;
		handlers?: CommissionHandlers;
	}

	let { commission, role, handlers }: Props = $props();

    // Context Consumer Component
    import { Component } from 'svelte';
    
    // We can't define a component inline easily in a .svelte file without snippets or module context.
    // But we can use a snippet for the children prop of Root.
</script>

<!-- We need a separate component file to consume context if we can't use snippets in 
     a way that allows us to write the script logic that calls `getCommissionContext`.
     Svelte 5 snippets run in the parent scope. 
     So to get the context provided by Root, we MUST be in a child component.
     
     So we will assume there is a 'CommissionContextConsumer.svelte' that we import.
-->
<CommissionWorkflowRoot {commission} {role} {handlers}>
    <ContextConsumer />
</CommissionWorkflowRoot>

<!-- Since we cannot easily create a file in the same write command, 
     we will create CommissionContextConsumer.svelte next. 
     This file expects it to exist. 
-->
<script module>
    import ContextConsumer from './CommissionContextConsumer.svelte';
</script>
