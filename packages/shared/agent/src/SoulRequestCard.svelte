<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import {
		formatAgentSurfaceDate,
		formatAgentWorkflowLabel,
		type SoulRequestCardData,
	} from './surfaces.js';

	interface Props {
		request: SoulRequestCardData;
		class?: string;
	}

	let { request, class: className = '' }: Props = $props();
</script>

<article class={`agent-request-card ${className}`}>
	<div class="agent-request-card__header">
		<div>
			<p class="agent-request-card__eyebrow">Soul request</p>
			<h3 class="agent-request-card__title">{request.title}</h3>
		</div>

		{#if request.currentState}
			<AgentStateBadge state={request.currentState} />
		{/if}
	</div>

	<p class="agent-request-card__summary">{request.summary}</p>

	<div class="agent-request-card__meta-grid">
		<div>
			<p class="agent-request-card__meta-label">Requested by</p>
			<p class="agent-request-card__meta-value">
				{request.requestedBy.name} · {request.requestedBy.role}
			</p>
		</div>
		<div>
			<p class="agent-request-card__meta-label">Submitted</p>
			<p class="agent-request-card__meta-value">{formatAgentSurfaceDate(request.submittedAt)}</p>
		</div>
		{#if request.routeDecision}
			<div>
				<p class="agent-request-card__meta-label">Route decision</p>
				<p class="agent-request-card__meta-value">
					{formatAgentWorkflowLabel(request.routeDecision)}
				</p>
			</div>
		{/if}
	</div>

	{#if request.constraints?.length}
		<section class="agent-request-card__section">
			<h4>Constraints</h4>
			<ul>
				{#each request.constraints as constraint, constraintIndex (`${constraint}-${constraintIndex}`)}
					<li>{constraint}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if request.artifacts?.length}
		<section class="agent-request-card__section">
			<h4>Attached artifacts</h4>
			<div class="agent-request-card__artifacts">
				{#each request.artifacts as artifact (artifact.id)}
					<div class="agent-request-card__artifact">
						<p class="agent-request-card__artifact-title">{artifact.title}</p>
						{#if artifact.description}
							<p class="agent-request-card__artifact-copy">{artifact.description}</p>
						{/if}
						{#if artifact.href}
							<a href={artifact.href} target="_blank" rel="noreferrer">Open artifact</a>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.agent-request-card {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.agent-request-card__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.agent-request-card__eyebrow,
	.agent-request-card__meta-label,
	.agent-request-card__artifact-copy {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.agent-request-card__eyebrow,
	.agent-request-card__meta-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.agent-request-card__title,
	.agent-request-card__summary,
	.agent-request-card__meta-value,
	.agent-request-card__artifact-title,
	.agent-request-card__artifact-copy {
		margin: 0;
	}

	.agent-request-card__summary {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.agent-request-card__meta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 0.85rem;
		padding: 1rem;
		border-radius: 1rem;
		background: var(--gr-semantic-background-secondary);
	}

	.agent-request-card__meta-value {
		font-weight: 600;
	}

	.agent-request-card__section {
		display: grid;
		gap: 0.75rem;
	}

	.agent-request-card__section h4 {
		margin: 0;
		font-size: 0.95rem;
	}

	.agent-request-card__section ul {
		margin: 0;
		padding-left: 1.15rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.agent-request-card__artifacts {
		display: grid;
		gap: 0.75rem;
	}

	.agent-request-card__artifact {
		display: grid;
		gap: 0.35rem;
		padding: 0.9rem 1rem;
		border-radius: 0.95rem;
		background: white;
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.agent-request-card__artifact-title {
		font-weight: 700;
	}

	.agent-request-card__artifact a {
		width: fit-content;
		color: var(--gr-color-primary-600);
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.agent-request-card__header {
			flex-direction: column;
		}
	}
</style>
