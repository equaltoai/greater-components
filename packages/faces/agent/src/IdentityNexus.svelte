<script lang="ts">
	import {
		AgentIdentityCard,
		ContinuityPanel,
		DeclarationPreviewCard,
		SoulLifecycleRail,
		formatAgentWorkflowLabel,
	} from '@equaltoai/greater-components-agent';
	import { BestWayToContact, ChannelsDisplay } from '@equaltoai/greater-components-soul';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { IdentityNexusData } from './types.js';

	interface Props {
		data: IdentityNexusData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();
	const continuityTimeline = $derived.by(() =>
		data.timeline?.length
			? data.timeline
			: (data.continuity?.followUps ?? []).map((followUp) => ({
					id: followUp.id,
					title: followUp.title,
					summary: followUp.summary,
					meta: followUp.cadence
						? `${followUp.owner.name} · ${followUp.cadence}`
						: followUp.owner.name,
					tone: 'accent' as const,
				}))
	);
</script>

<AgentFaceFrame
	hero={data.hero}
	brand={data.brand}
	navItems={data.navItems}
	actions={data.actions}
	statusChips={data.statusChips}
	metrics={data.metrics}
	class={className}
>
	{#snippet children()}
		<div class="identity-nexus">
			<div class="identity-nexus__hero-grid">
				<AgentIdentityCard identity={data.identity} />
				<DeclarationPreviewCard declaration={data.declaration} />
			</div>
			<ChannelsDisplay channels={data.channels} title="Reachability ledger" />
			<BestWayToContact channels={data.channels} preferences={data.preferences} />

			{#if data.attributions?.length}
				<section class="identity-nexus__panel">
					<header class="identity-nexus__panel-header">
						<p>Attribution ledger</p>
						<h2>Identity and ownership changes</h2>
					</header>
					<div class="identity-nexus__ledger">
						{#each data.attributions as attribution (attribution.id)}
							<article
								class={`identity-nexus__ledger-card identity-nexus__ledger-card--${attribution.tone ?? 'neutral'}`}
							>
								<div class="identity-nexus__ledger-header">
									<h3>{attribution.title}</h3>
									{#if attribution.timestampLabel}
										<small>{attribution.timestampLabel}</small>
									{/if}
								</div>
								<p>{attribution.summary}</p>
								<div class="identity-nexus__ledger-meta">
									{#if attribution.sourceLabel}
										<span>From {attribution.sourceLabel}</span>
									{/if}
									{#if attribution.targetLabel}
										<span>To {attribution.targetLabel}</span>
									{/if}
								</div>
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if continuityTimeline.length}
				<section class="identity-nexus__panel">
					<header class="identity-nexus__panel-header">
						<p>Continuity moments</p>
						<h2>Post-graduation timeline</h2>
					</header>
					<div class="identity-nexus__timeline">
						{#each continuityTimeline as moment (moment.id)}
							<article
								class={`identity-nexus__timeline-card identity-nexus__timeline-card--${moment.tone ?? 'neutral'}`}
							>
								<div class="identity-nexus__timeline-header">
									<h3>{moment.title}</h3>
									{#if moment.phase}
										<span class="identity-nexus__phase-pill">
											{formatAgentWorkflowLabel(moment.phase)}
										</span>
									{/if}
								</div>
								<p>{moment.summary}</p>
								{#if moment.meta}
									<small>{moment.meta}</small>
								{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.evidence?.length}
				<section class="identity-nexus__panel">
					<header class="identity-nexus__panel-header">
						<p>Identity evidence</p>
						<h2>Declaration references</h2>
					</header>
					<div class="identity-nexus__evidence">
						{#each data.evidence as artifact (artifact.id)}
							<article class="identity-nexus__artifact">
								<h3>{artifact.title}</h3>
								{#if artifact.description}
									<p>{artifact.description}</p>
								{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}
		</div>
	{/snippet}

	{#snippet side()}
		{#if data.lifecycle?.length}
			<SoulLifecycleRail steps={data.lifecycle} currentPhase={data.identity.currentPhase} />
		{/if}
		{#if data.continuity}
			<ContinuityPanel panel={data.continuity} />
		{/if}
		{#if data.callouts?.length}
			<section class="identity-nexus__panel">
				<header class="identity-nexus__panel-header">
					<p>Profile notes</p>
					<h2>Continuity context</h2>
				</header>
				<div class="identity-nexus__evidence">
					{#each data.callouts as callout (callout.id)}
						<article
							class={`identity-nexus__artifact identity-nexus__artifact--${callout.tone ?? 'neutral'}`}
						>
							<h3>{callout.title}</h3>
							<p>{callout.summary}</p>
							{#if callout.meta}
								<small>{callout.meta}</small>
							{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}
	{/snippet}
</AgentFaceFrame>

<style>
	.identity-nexus,
	.identity-nexus__evidence,
	.identity-nexus__hero-grid,
	.identity-nexus__ledger,
	.identity-nexus__timeline {
		display: grid;
		gap: 1rem;
	}

	.identity-nexus__panel {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.identity-nexus__panel-header p,
	.identity-nexus__panel-header h2,
	.identity-nexus__artifact h3,
	.identity-nexus__artifact p,
	.identity-nexus__artifact small,
	.identity-nexus__ledger-card h3,
	.identity-nexus__ledger-card p,
	.identity-nexus__ledger-card small,
	.identity-nexus__timeline-card h3,
	.identity-nexus__timeline-card p,
	.identity-nexus__timeline-card small {
		margin: 0;
	}

	.identity-nexus__panel-header p,
	.identity-nexus__artifact small,
	.identity-nexus__ledger-card small,
	.identity-nexus__timeline-card small {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.identity-nexus__panel-header h2 {
		margin-top: 0.25rem;
		font-size: 1.1rem;
	}

	.identity-nexus__evidence {
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.identity-nexus__hero-grid,
	.identity-nexus__ledger,
	.identity-nexus__timeline {
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.identity-nexus__artifact {
		display: grid;
		gap: 0.35rem;
		padding: 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.identity-nexus__artifact p {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}

	.identity-nexus__ledger-card,
	.identity-nexus__timeline-card {
		display: grid;
		gap: 0.45rem;
		padding: 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.identity-nexus__ledger-card p,
	.identity-nexus__timeline-card p,
	.identity-nexus__ledger-meta {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}

	.identity-nexus__ledger-card--accent,
	.identity-nexus__timeline-card--accent {
		border-color: color-mix(in srgb, var(--gr-color-primary-300) 65%, white 35%);
	}

	.identity-nexus__ledger-card--success,
	.identity-nexus__timeline-card--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 65%, white 35%);
	}

	.identity-nexus__ledger-card--warning,
	.identity-nexus__timeline-card--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.identity-nexus__ledger-card--critical,
	.identity-nexus__timeline-card--critical {
		border-color: color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	.identity-nexus__ledger-header,
	.identity-nexus__timeline-header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.identity-nexus__ledger-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.identity-nexus__phase-pill {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.82);
		font-size: 0.74rem;
		font-weight: 700;
	}
</style>
