<script lang="ts">
	import {
		AgentIdentityCard,
		ContinuityPanel,
		DeclarationPreviewCard,
		SoulLifecycleRail,
	} from '@equaltoai/greater-components-agent';
	import { BestWayToContact, ChannelsDisplay } from '@equaltoai/greater-components-soul';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { IdentityNexusData } from './types.js';

	interface Props {
		data: IdentityNexusData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();
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
			<AgentIdentityCard identity={data.identity} />
			<DeclarationPreviewCard declaration={data.declaration} />
			<ChannelsDisplay channels={data.channels} title="Reachability ledger" />
			<BestWayToContact channels={data.channels} preferences={data.preferences} />

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
						<article class={`identity-nexus__artifact identity-nexus__artifact--${callout.tone ?? 'neutral'}`}>
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
	.identity-nexus__evidence {
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
	.identity-nexus__artifact small {
		margin: 0;
	}

	.identity-nexus__panel-header p,
	.identity-nexus__artifact small {
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
</style>
