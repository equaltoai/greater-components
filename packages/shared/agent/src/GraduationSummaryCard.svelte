<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import type { GraduationSummaryCardData } from './surfaces.js';

	interface Props {
		summary: GraduationSummaryCardData;
		class?: string;
	}

	let { summary, class: className = '' }: Props = $props();
</script>

<article class={`graduation-summary-card ${className}`}>
	<div class="graduation-summary-card__header">
		<div>
			<p class="graduation-summary-card__eyebrow">Graduation summary</p>
			<h3>{summary.title}</h3>
			{#if summary.launchOwner}
				<p class="graduation-summary-card__owner">
					{summary.launchOwner.name} · {summary.launchOwner.role}
				</p>
			{/if}
		</div>

		<AgentStateBadge
			label={summary.readiness}
			tone={summary.readiness === 'ready' ? 'success' : summary.readiness === 'watch' ? 'warning' : 'critical'}
		/>
	</div>

	<p class="graduation-summary-card__summary">{summary.summary}</p>

	{#if summary.metrics?.length}
		<div class="graduation-summary-card__metrics">
			{#each summary.metrics as metric}
				<div class="graduation-summary-card__metric">
					<p class="graduation-summary-card__metric-value">{metric.value}</p>
					<p class="graduation-summary-card__metric-label">{metric.label}</p>
					{#if metric.detail}
						<p class="graduation-summary-card__metric-detail">{metric.detail}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="graduation-summary-card__columns">
		{#if summary.completedMilestones?.length}
			<section>
				<h4>Completed milestones</h4>
				<ul>
					{#each summary.completedMilestones as milestone}
						<li>{milestone}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if summary.exitCriteria?.length}
			<section>
				<h4>Exit criteria</h4>
				<ul>
					{#each summary.exitCriteria as criterion}
						<li>{criterion}</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>

	{#if summary.nextStep}
		<div class="graduation-summary-card__next-step">
			<p class="graduation-summary-card__next-step-label">Next step</p>
			<p>{summary.nextStep}</p>
		</div>
	{/if}
</article>

<style>
	.graduation-summary-card {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: linear-gradient(180deg, color-mix(in srgb, var(--gr-color-success-100) 30%, white 70%), white);
		border: 1px solid color-mix(in srgb, var(--gr-color-success-300) 54%, white 46%);
	}

	.graduation-summary-card__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.graduation-summary-card__eyebrow,
	.graduation-summary-card__owner,
	.graduation-summary-card__metric-detail,
	.graduation-summary-card__next-step-label {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.graduation-summary-card__eyebrow,
	.graduation-summary-card__next-step-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.graduation-summary-card__header h3,
	.graduation-summary-card__summary,
	.graduation-summary-card__metric-value,
	.graduation-summary-card__metric-label,
	.graduation-summary-card__next-step p:last-child {
		margin: 0;
	}

	.graduation-summary-card__summary {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.graduation-summary-card__metrics,
	.graduation-summary-card__columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 0.75rem;
	}

	.graduation-summary-card__metric,
	.graduation-summary-card__columns section,
	.graduation-summary-card__next-step {
		padding: 0.9rem 1rem;
		border-radius: 0.95rem;
		background: rgba(255, 255, 255, 0.72);
	}

	.graduation-summary-card__metric-value {
		font-size: 1.3rem;
		font-weight: 700;
	}

	.graduation-summary-card__metric-label {
		font-weight: 700;
	}

	.graduation-summary-card__columns h4,
	.graduation-summary-card__columns ul {
		margin: 0;
	}

	.graduation-summary-card__columns ul {
		padding-left: 1.1rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	@media (max-width: 640px) {
		.graduation-summary-card__header {
			flex-direction: column;
		}
	}
</style>
