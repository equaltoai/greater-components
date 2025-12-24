<script lang="ts">
	import { getCommissionContext, navigateToStep, getStepOrder, isStepComplete } from '../../../src/components/CreativeTools/CommissionWorkflow/context';

	const ctx = getCommissionContext();
    const steps = getStepOrder();
</script>

<div data-testid="commission-context">
    <span data-testid="current-step">{ctx.currentStep}</span>
    <span data-testid="role">{ctx.role}</span>
    
    <button onclick={() => navigateToStep(ctx, 'contract')}>Go to Contract</button>
    
    <div data-testid="steps-status">
        {#each steps as step}
            <span data-step={step} data-complete={isStepComplete(ctx.commission, step)}>
                {step}: {isStepComplete(ctx.commission, step)}
            </span>
        {/each}
    </div>
</div>
