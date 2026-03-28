<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import type { AgentWorkflowPhase } from './workflow.js';
	import { AGENT_WORKFLOW_PHASE_DEFINITIONS } from './workflow.js';
	import { getAgentPhaseTitle, type AgentLifecycleStep } from './surfaces.js';

	interface Props {
		steps?: readonly AgentLifecycleStep[];
		currentPhase?: AgentWorkflowPhase;
		orientation?: 'vertical' | 'horizontal';
		class?: string;
	}

	let {
		steps = AGENT_WORKFLOW_PHASE_DEFINITIONS.map((definition, index) => ({
			phase: definition.phase,
			title: definition.title,
			summary: definition.summary,
			status: index === 0 ? 'active' : 'upcoming',
		})),
		currentPhase,
		orientation = 'vertical',
		class: className = '',
	}: Props = $props();

	const resolvedSteps = $derived.by(() =>
		steps.map((step) => ({
			...step,
			title: step.title ?? getAgentPhaseTitle(step.phase),
			status: step.status ?? (step.phase === currentPhase ? 'active' : 'upcoming'),
		}))
	);
</script>

<ol
	class={`soul-lifecycle-rail soul-lifecycle-rail--${orientation} ${className}`}
	aria-label="Soul lifecycle"
>
	{#each resolvedSteps as step, index (step.phase)}
		<li class={`soul-lifecycle-rail__step soul-lifecycle-rail__step--${step.status}`}>
			<div class="soul-lifecycle-rail__marker">
				<span class="soul-lifecycle-rail__dot" aria-hidden="true">{index + 1}</span>
				{#if index < resolvedSteps.length - 1}
					<span class="soul-lifecycle-rail__line" aria-hidden="true"></span>
				{/if}
			</div>

			<div class="soul-lifecycle-rail__content">
				<div class="soul-lifecycle-rail__heading">
					<h4>{step.title}</h4>
					<AgentStateBadge label={step.status} phase={step.phase} state={step.state} />
				</div>
				{#if step.summary}
					<p>{step.summary}</p>
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.soul-lifecycle-rail {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
	}

	.soul-lifecycle-rail--horizontal {
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.soul-lifecycle-rail__step {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.9rem;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.soul-lifecycle-rail__step--active {
		border-color: color-mix(in srgb, var(--gr-color-primary-400) 70%, white 30%);
		box-shadow: 0 16px 32px rgba(148, 74, 0, 0.08);
	}

	.soul-lifecycle-rail__step--blocked {
		border-color: color-mix(in srgb, var(--gr-color-error-400) 70%, white 30%);
	}

	.soul-lifecycle-rail__marker {
		display: grid;
		grid-template-rows: auto 1fr;
		justify-items: center;
	}

	.soul-lifecycle-rail__dot {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: var(--gr-color-primary-600);
		color: white;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.soul-lifecycle-rail__line {
		width: 2px;
		min-height: 2.25rem;
		background: color-mix(in srgb, var(--gr-semantic-border-default) 78%, white 22%);
	}

	.soul-lifecycle-rail__heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem;
		margin-bottom: 0.4rem;
	}

	.soul-lifecycle-rail__heading h4,
	.soul-lifecycle-rail__content p {
		margin: 0;
	}

	.soul-lifecycle-rail__content p {
		color: var(--gr-semantic-foreground-secondary);
		line-height: 1.5;
	}

	@media (max-width: 640px) {
		.soul-lifecycle-rail--horizontal {
			grid-template-columns: 1fr;
		}
	}
</style>
