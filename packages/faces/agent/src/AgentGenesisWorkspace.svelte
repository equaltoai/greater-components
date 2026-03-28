<script lang="ts">
	import { AgentIdentityCard, ReviewDecisionCard, SoulLifecycleRail, SoulRequestCard } from '@equaltoai/greater-components-agent';
	import { Message } from '@equaltoai/greater-components-chat';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { AgentGenesisWorkspaceData } from './types.js';

	interface Props {
		data: AgentGenesisWorkspaceData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();

	const activeRequest = $derived(data.activeRequest ?? data.requestQueue[0]);
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
		<div class="agent-genesis">
			<section class="agent-genesis__panel">
				<header class="agent-genesis__panel-header">
					<p>Genesis conversation</p>
					<h2>Request intake and operator alignment</h2>
				</header>

				{#if data.conversation?.length}
					<div class="agent-genesis__conversation">
						{#each data.conversation as entry (entry.id)}
							<div class="agent-genesis__message">
								<p class="agent-genesis__speaker">{entry.label}</p>
								<Message
									role={entry.role}
									content={entry.content}
									showAvatar={false}
									timestamp={entry.createdAt
										? typeof entry.createdAt === 'string'
											? new Date(entry.createdAt)
											: entry.createdAt
										: undefined}
									workflowMoments={entry.workflowMoments}
									workflowMetadata={entry.workflowMetadata}
								/>
							</div>
						{/each}
					</div>
				{:else}
					<p class="agent-genesis__empty">No conversation timeline provided yet.</p>
				{/if}
			</section>

			<div class="agent-genesis__stack">
				{#if activeRequest}
					<section class="agent-genesis__panel">
						<header class="agent-genesis__panel-header">
							<p>Active request</p>
							<h2>Current review target</h2>
						</header>
						<SoulRequestCard request={activeRequest} />
					</section>
				{/if}

				{#if data.reviewDecision}
					<section class="agent-genesis__panel">
						<header class="agent-genesis__panel-header">
							<p>Review surface</p>
							<h2>Decision context</h2>
						</header>
						<ReviewDecisionCard decision={data.reviewDecision} />
					</section>
				{/if}

				{#if data.requestQueue.length}
					<section class="agent-genesis__panel">
						<header class="agent-genesis__panel-header">
							<p>Queued requests</p>
							<h2>Intake rail</h2>
						</header>
						<div class="agent-genesis__queue">
							{#each data.requestQueue as request (request.id)}
								<SoulRequestCard {request} />
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet side()}
		<AgentIdentityCard identity={data.identity} />
		{#if data.lifecycle?.length}
			<SoulLifecycleRail steps={data.lifecycle} currentPhase={data.identity.currentPhase} />
		{/if}
		{#if data.focusNotes?.length}
			<section class="agent-genesis__panel agent-genesis__panel--notes">
				<header class="agent-genesis__panel-header">
					<p>Operator notes</p>
					<h2>Focus cues</h2>
				</header>
				<div class="agent-genesis__notes">
					{#each data.focusNotes as note (note.id)}
						<article class={`agent-genesis__note agent-genesis__note--${note.tone ?? 'neutral'}`}>
							<h3>{note.title}</h3>
							<p>{note.summary}</p>
							{#if note.meta}
								<small>{note.meta}</small>
							{/if}
						</article>
					{/each}
				</div>
			</section>
		{/if}
	{/snippet}
</AgentFaceFrame>

<style>
	.agent-genesis,
	.agent-genesis__stack,
	.agent-genesis__conversation,
	.agent-genesis__queue,
	.agent-genesis__notes {
		display: grid;
		gap: 1rem;
	}

	.agent-genesis {
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		align-items: start;
	}

	.agent-genesis__panel {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.agent-genesis__panel-header p,
	.agent-genesis__panel-header h2,
	.agent-genesis__speaker,
	.agent-genesis__empty,
	.agent-genesis__note h3,
	.agent-genesis__note p,
	.agent-genesis__note small {
		margin: 0;
	}

	.agent-genesis__panel-header p,
	.agent-genesis__speaker,
	.agent-genesis__note small {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.agent-genesis__panel-header h2 {
		margin-top: 0.25rem;
		font-size: 1.1rem;
	}

	.agent-genesis__speaker {
		font-weight: 700;
		margin-bottom: 0.35rem;
	}

	.agent-genesis__empty {
		color: var(--gr-semantic-foreground-secondary);
	}

	.agent-genesis__note {
		display: grid;
		gap: 0.35rem;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.agent-genesis__note p {
		color: var(--gr-semantic-foreground-secondary);
		line-height: 1.5;
	}

	.agent-genesis__note--accent {
		border: 1px solid color-mix(in srgb, var(--gr-color-primary-300) 65%, white 35%);
	}

	.agent-genesis__note--warning {
		border: 1px solid color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.agent-genesis__note--critical {
		border: 1px solid color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	@media (max-width: 880px) {
		.agent-genesis {
			grid-template-columns: 1fr;
		}
	}
</style>
