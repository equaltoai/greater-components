<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import type { ReviewDecisionCardData } from './surfaces.js';

	interface Props {
		decision: ReviewDecisionCardData;
		class?: string;
	}

	let { decision, class: className = '' }: Props = $props();
</script>

<article class={`review-decision-card ${className}`}>
	<div class="review-decision-card__header">
		<div>
			<p class="review-decision-card__eyebrow">Review decision</p>
			<h3>{decision.title}</h3>
			<p class="review-decision-card__reviewer">
				{decision.reviewer.name} · {decision.reviewer.role}
			</p>
		</div>

		<AgentStateBadge
			label={decision.decision}
			tone={decision.decision === 'approved'
				? 'success'
				: decision.decision === 'blocked'
					? 'critical'
					: decision.decision === 'changes_requested'
						? 'warning'
						: 'neutral'}
		/>
	</div>

	<p class="review-decision-card__summary">{decision.decisionSummary}</p>

	{#if decision.findings?.length}
		<section class="review-decision-card__section">
			<h4>Key findings</h4>
			<ul class="review-decision-card__findings">
				{#each decision.findings as finding (finding.id)}
					<li>
						<p class="review-decision-card__finding-title">{finding.title}</p>
						<p class="review-decision-card__finding-detail">{finding.detail}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if decision.evidence?.length}
		<section class="review-decision-card__section">
			<h4>Evidence</h4>
			<div class="review-decision-card__evidence-grid">
				{#each decision.evidence as artifact (artifact.id)}
					<div class="review-decision-card__evidence">
						<p>{artifact.title}</p>
						{#if artifact.description}
							<p class="review-decision-card__finding-detail">{artifact.description}</p>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.review-decision-card {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.review-decision-card__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.review-decision-card__eyebrow,
	.review-decision-card__reviewer,
	.review-decision-card__finding-detail {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.review-decision-card__eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.review-decision-card__header h3,
	.review-decision-card__summary,
	.review-decision-card__finding-title {
		margin: 0;
	}

	.review-decision-card__summary {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.review-decision-card__section {
		display: grid;
		gap: 0.7rem;
	}

	.review-decision-card__section h4 {
		margin: 0;
		font-size: 0.95rem;
	}

	.review-decision-card__findings {
		display: grid;
		gap: 0.75rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.review-decision-card__findings li,
	.review-decision-card__evidence {
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
	}

	.review-decision-card__finding-title,
	.review-decision-card__evidence p:first-child {
		font-weight: 700;
	}

	.review-decision-card__evidence-grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
	}

	@media (max-width: 640px) {
		.review-decision-card__header {
			flex-direction: column;
		}
	}
</style>
