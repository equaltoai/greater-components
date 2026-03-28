<script lang="ts">
	import type { ContinuityPanelData } from './surfaces.js';

	interface Props {
		panel: ContinuityPanelData;
		class?: string;
	}

	let { panel, class: className = '' }: Props = $props();
</script>

<article class={`continuity-panel ${className}`}>
	<div class="continuity-panel__header">
		<div>
			<p class="continuity-panel__eyebrow">Continuity</p>
			<h3>{panel.title}</h3>
			<p class="continuity-panel__owner">
				{panel.owner.name} · {panel.owner.role}
			</p>
		</div>
	</div>

	<p class="continuity-panel__objective">{panel.objective}</p>

	<div class="continuity-panel__feedback">
		<p class="continuity-panel__feedback-label">Feedback loop</p>
		<p>{panel.feedbackLoop}</p>
	</div>

	{#if panel.metrics?.length}
		<div class="continuity-panel__metrics">
			{#each panel.metrics as metric}
				<div class="continuity-panel__metric">
					<p class="continuity-panel__metric-value">{metric.value}</p>
					<p class="continuity-panel__metric-label">{metric.label}</p>
					{#if metric.detail}
						<p class="continuity-panel__metric-detail">{metric.detail}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if panel.followUps?.length}
		<section class="continuity-panel__followups">
			<h4>Follow-up loops</h4>
			<div class="continuity-panel__followup-grid">
				{#each panel.followUps as followUp}
					<div class="continuity-panel__followup">
						<p class="continuity-panel__followup-title">{followUp.title}</p>
						<p class="continuity-panel__followup-summary">{followUp.summary}</p>
						<p class="continuity-panel__followup-owner">
							{followUp.owner.name}
							{#if followUp.cadence}
								· {followUp.cadence}
							{/if}
						</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.continuity-panel {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.continuity-panel__eyebrow,
	.continuity-panel__owner,
	.continuity-panel__feedback-label,
	.continuity-panel__metric-detail,
	.continuity-panel__followup-owner,
	.continuity-panel__followup-summary {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.continuity-panel__eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.continuity-panel__header h3,
	.continuity-panel__objective,
	.continuity-panel__feedback p:last-child,
	.continuity-panel__metric-value,
	.continuity-panel__metric-label,
	.continuity-panel__followup-title {
		margin: 0;
	}

	.continuity-panel__objective {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.continuity-panel__feedback {
		padding: 1rem;
		border-radius: 1rem;
		background: var(--gr-semantic-background-secondary);
	}

	.continuity-panel__feedback-label {
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.continuity-panel__metrics,
	.continuity-panel__followup-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 0.75rem;
	}

	.continuity-panel__metric,
	.continuity-panel__followup {
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 88%, white 12%);
	}

	.continuity-panel__metric-value {
		font-size: 1.3rem;
		font-weight: 700;
	}

	.continuity-panel__metric-label,
	.continuity-panel__followup-title {
		font-weight: 700;
	}

	.continuity-panel__followups {
		display: grid;
		gap: 0.75rem;
	}

	.continuity-panel__followups h4 {
		margin: 0;
		font-size: 0.95rem;
	}
</style>
