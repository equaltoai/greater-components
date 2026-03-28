<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import type { DeclarationPreviewCardData } from './surfaces.js';

	interface Props {
		declaration: DeclarationPreviewCardData;
		class?: string;
	}

	let { declaration, class: className = '' }: Props = $props();
</script>

<article class={`declaration-preview-card ${className}`}>
	<div class="declaration-preview-card__header">
		<div>
			<p class="declaration-preview-card__eyebrow">Declaration preview</p>
			<h3>{declaration.title}</h3>
		</div>

		<AgentStateBadge label={declaration.confidence} tone="accent" />
	</div>

	<p class="declaration-preview-card__statement">{declaration.statement}</p>

	{#if declaration.owner}
		<p class="declaration-preview-card__owner">
			Prepared by {declaration.owner.name} · {declaration.owner.role}
		</p>
	{/if}

	<section class="declaration-preview-card__section">
		<h4>Declared scope</h4>
		<div class="declaration-preview-card__chips">
			{#each declaration.declaredScope as item}
				<span>{item}</span>
			{/each}
		</div>
	</section>

	{#if declaration.risks?.length}
		<section class="declaration-preview-card__section">
			<h4>Risks and caveats</h4>
			<ul>
				{#each declaration.risks as risk}
					<li>{risk}</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if declaration.supportingArtifacts?.length}
		<section class="declaration-preview-card__section">
			<h4>Supporting artifacts</h4>
			<div class="declaration-preview-card__artifact-grid">
				{#each declaration.supportingArtifacts as artifact}
					<div class="declaration-preview-card__artifact">
						<p>{artifact.title}</p>
						{#if artifact.description}
							<p class="declaration-preview-card__artifact-copy">{artifact.description}</p>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}
</article>

<style>
	.declaration-preview-card {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.declaration-preview-card__header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.declaration-preview-card__eyebrow,
	.declaration-preview-card__owner,
	.declaration-preview-card__artifact-copy {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.declaration-preview-card__eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.declaration-preview-card__header h3,
	.declaration-preview-card__statement {
		margin: 0;
	}

	.declaration-preview-card__statement {
		line-height: 1.6;
		font-size: 1rem;
	}

	.declaration-preview-card__section {
		display: grid;
		gap: 0.7rem;
	}

	.declaration-preview-card__section h4 {
		margin: 0;
		font-size: 0.95rem;
	}

	.declaration-preview-card__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.declaration-preview-card__chips span {
		padding: 0.4rem 0.7rem;
		border-radius: 999px;
		background: var(--gr-semantic-background-secondary);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.declaration-preview-card__section ul {
		margin: 0;
		padding-left: 1.15rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.declaration-preview-card__artifact-grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
	}

	.declaration-preview-card__artifact {
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
	}

	.declaration-preview-card__artifact p:first-child {
		margin: 0;
		font-weight: 700;
	}
</style>
