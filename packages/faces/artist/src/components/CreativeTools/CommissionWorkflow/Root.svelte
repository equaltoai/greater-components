<!--
CommissionWorkflow.Root - Container for commission workflow

@component
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCommissionContext, getStepOrder, type CommissionRole } from './context.js';
	import type { CommissionData, CommissionHandlers } from '../../../types/creative-tools.js';

	interface Props {
		commission: CommissionData;
		role: CommissionRole;
		handlers?: CommissionHandlers;
		class?: string;
		children: Snippet;
	}

	let { commission, role, handlers = {}, class: className = '', children }: Props = $props();

	const ctx = createCommissionContext(
		() => commission,
		() => role,
		() => handlers
	);
	const steps = getStepOrder();

	// Step labels
	const stepLabels: Record<string, string> = {
		request: 'Request',
		quote: 'Quote',
		contract: 'Contract',
		progress: 'Progress',
		delivery: 'Delivery',
		payment: 'Payment',
	};
</script>

<div class={`commission-workflow ${className}`} data-role={role} data-status={commission.status}>
	<!-- Step navigation -->
	<nav class="commission-workflow__nav" aria-label="Commission steps">
		<ol class="commission-workflow__steps">
			{#each steps as step, index (step)}
				{@const isCurrent = ctx.currentStep === step}
				{@const isComplete = steps.indexOf(ctx.currentStep) > index}
				<li
					class="commission-workflow__step"
					class:current={isCurrent}
					class:complete={isComplete}
					aria-current={isCurrent ? 'step' : undefined}
				>
					<span class="commission-workflow__step-number">{index + 1}</span>
					<span class="commission-workflow__step-label">{stepLabels[step]}</span>
				</li>
			{/each}
		</ol>
	</nav>

	<!-- Content -->
	<div class="commission-workflow__content">
		{@render children()}
	</div>
</div>

<style>
	.commission-workflow {
		background: var(--gr-color-gray-900);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.commission-workflow__nav {
		padding: var(--gr-spacing-scale-4);
		background: var(--gr-color-gray-800);
		border-bottom: 1px solid var(--gr-color-gray-700);
	}

	.commission-workflow__steps {
		display: flex;
		justify-content: space-between;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.commission-workflow__step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		flex: 1;
		position: relative;
	}

	.commission-workflow__step::after {
		content: '';
		position: absolute;
		top: 14px;
		left: 50%;
		width: 100%;
		height: 2px;
		background: var(--gr-color-gray-700);
	}

	.commission-workflow__step:last-child::after {
		display: none;
	}

	.commission-workflow__step.complete::after {
		background: var(--gr-color-success-500);
	}

	.commission-workflow__step-number {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gr-color-gray-700);
		border-radius: var(--gr-radius-full);
		font-size: var(--gr-font-size-sm);
		font-weight: var(--gr-font-weight-semibold);
		color: var(--gr-color-gray-300);
		position: relative;
		z-index: 1;
	}

	.commission-workflow__step.current .commission-workflow__step-number {
		background: var(--gr-color-primary-500);
		color: white;
	}

	.commission-workflow__step.complete .commission-workflow__step-number {
		background: var(--gr-color-success-500);
		color: white;
	}

	.commission-workflow__step-label {
		font-size: var(--gr-font-size-xs);
		color: var(--gr-color-gray-400);
	}

	.commission-workflow__step.current .commission-workflow__step-label {
		color: var(--gr-color-gray-100);
		font-weight: var(--gr-font-weight-medium);
	}

	.commission-workflow__content {
		padding: var(--gr-spacing-scale-6);
	}
</style>
