<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import type { AgentIdentityCardData } from './surfaces.js';

	interface Props {
		identity: AgentIdentityCardData;
		class?: string;
	}

	let { identity, class: className = '' }: Props = $props();
</script>

<article class={`agent-surface-card agent-surface-card--identity ${className}`}>
	<div class="agent-surface-card__header">
		<div>
			<p class="agent-surface-card__eyebrow">Agent identity</p>
			<h2 class="agent-surface-card__title">{identity.name}</h2>
			{#if identity.handle}
				<p class="agent-surface-card__subtle">{identity.handle}</p>
			{/if}
		</div>

		<AgentStateBadge phase={identity.currentPhase} state={identity.currentState} />
	</div>

	<p class="agent-surface-card__summary">{identity.summary}</p>

	{#if identity.steward}
		<div class="agent-surface-card__owner">
			<div class="agent-surface-card__avatar" aria-hidden="true">
				{identity.steward.avatarLabel ?? identity.steward.name.slice(0, 2).toUpperCase()}
			</div>
			<div>
				<p class="agent-surface-card__meta-label">Steward</p>
				<p class="agent-surface-card__meta-value">
					{identity.steward.name} · {identity.steward.role}
				</p>
				{#if identity.steward.handle}
					<p class="agent-surface-card__subtle">{identity.steward.handle}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if identity.tags?.length}
		<div class="agent-surface-card__tags" aria-label="Agent tags">
			{#each identity.tags as tag}
				<span class="agent-surface-card__tag">{tag}</span>
			{/each}
		</div>
	{/if}

	{#if identity.metrics?.length}
		<div class="agent-surface-card__metrics">
			{#each identity.metrics as metric}
				<div class="agent-surface-card__metric">
					<p class="agent-surface-card__metric-value">{metric.value}</p>
					<p class="agent-surface-card__metric-label">{metric.label}</p>
					{#if metric.detail}
						<p class="agent-surface-card__metric-detail">{metric.detail}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</article>

<style>
	.agent-surface-card {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		border-radius: 1.25rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--gr-color-primary-100) 22%, white 78%),
			white
		);
		border: 1px solid color-mix(in srgb, var(--gr-color-primary-200) 45%, white 55%);
		box-shadow: 0 18px 40px rgba(48, 20, 0, 0.08);
	}

	.agent-surface-card__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.agent-surface-card__eyebrow {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-color-primary-700);
	}

	.agent-surface-card__title {
		margin: 0;
		font-size: 1.55rem;
		line-height: 1.1;
	}

	.agent-surface-card__summary,
	.agent-surface-card__subtle,
	.agent-surface-card__meta-label,
	.agent-surface-card__meta-value,
	.agent-surface-card__metric-label,
	.agent-surface-card__metric-detail {
		margin: 0;
	}

	.agent-surface-card__summary {
		color: var(--gr-semantic-foreground-secondary);
		line-height: 1.55;
	}

	.agent-surface-card__subtle,
	.agent-surface-card__metric-detail,
	.agent-surface-card__meta-label {
		color: var(--gr-semantic-foreground-tertiary);
		font-size: 0.875rem;
	}

	.agent-surface-card__owner {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 84%, white 16%);
	}

	.agent-surface-card__avatar {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 999px;
		background: linear-gradient(135deg, var(--gr-color-primary-600), var(--gr-color-warning-500));
		color: white;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.agent-surface-card__meta-value {
		font-weight: 600;
	}

	.agent-surface-card__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.agent-surface-card__tag {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--gr-color-secondary-100) 72%, white 28%);
		color: var(--gr-color-secondary-700);
		font-size: 0.85rem;
		font-weight: 600;
	}

	.agent-surface-card__metrics {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: 0.75rem;
	}

	.agent-surface-card__metric {
		padding: 0.9rem 1rem;
		border-radius: 1rem;
		background: white;
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.agent-surface-card__metric-value {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
	}

	.agent-surface-card__metric-label {
		margin-top: 0.2rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	@media (max-width: 640px) {
		.agent-surface-card__header {
			flex-direction: column;
		}
	}
</style>
