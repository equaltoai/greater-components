<script lang="ts">
	import {
		AgentIdentityCard,
		DeclarationPreviewCard,
		ReviewDecisionCard,
		SignatureCheckpointCard,
		SoulLifecycleRail,
		SoulRequestCard,
		formatAgentWorkflowLabel,
		type AgentSurfaceTone,
	} from '@equaltoai/greater-components-agent';
	import { Message } from '@equaltoai/greater-components-chat';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { AgentGenesisWorkspaceData } from './types.js';

	interface Props {
		data: AgentGenesisWorkspaceData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();

	const activeRequest = $derived(data.activeRequest ?? data.requestQueue[0]);
	const reviewFindings = $derived(data.reviewDecision?.findings ?? []);
	const reviewEvidence = $derived(data.reviewDecision?.evidence ?? []);
	const prioritySignals = $derived.by(() => {
		const decisionTone = (
			decision?: AgentGenesisWorkspaceData['reviewDecision']
		): AgentSurfaceTone => {
			if (!decision) {
				return 'neutral';
			}

			switch (decision.decision) {
				case 'approved':
					return 'success';
				case 'blocked':
					return 'critical';
				case 'changes_requested':
				case 'queued':
					return 'warning';
				default:
					return 'neutral';
			}
		};

		return [
			{
				id: 'queue-depth',
				label: 'Queue depth',
				value: String(data.requestQueue.length),
				detail: `${data.requestQueue.length} request${
					data.requestQueue.length === 1 ? '' : 's'
				} awaiting review`,
				tone: 'accent' as const,
			},
			{
				id: 'active-state',
				label: 'Active state',
				value: activeRequest
					? formatAgentWorkflowLabel(
							activeRequest.currentState ?? activeRequest.routeDecision ?? 'request.submitted'
						)
					: 'Unassigned',
				detail: activeRequest?.routeDecision
					? `Route ${formatAgentWorkflowLabel(activeRequest.routeDecision)}`
					: 'Waiting for routing',
				tone: activeRequest ? ('warning' as const) : ('neutral' as const),
			},
			{
				id: 'review-decision',
				label: 'Current decision',
				value: data.reviewDecision
					? formatAgentWorkflowLabel(data.reviewDecision.decision)
					: 'Pending review',
				detail: data.reviewDecision
					? `${reviewFindings.length} finding${
							reviewFindings.length === 1 ? '' : 's'
						} across ${reviewEvidence.length} evidence item${
							reviewEvidence.length === 1 ? '' : 's'
						}`
					: 'No reviewer feedback yet',
				tone: decisionTone(data.reviewDecision),
			},
		];
	});
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
			<section class="agent-genesis__panel agent-genesis__panel--signals">
				<header class="agent-genesis__panel-header">
					<p>Workflow digest</p>
					<h2>Genesis command surface</h2>
				</header>
				<div class="agent-genesis__signals">
					{#each prioritySignals as signal (signal.id)}
						<article class={`agent-genesis__signal agent-genesis__signal--${signal.tone}`}>
							<p>{signal.label}</p>
							<h3>{signal.value}</h3>
							<small>{signal.detail}</small>
						</article>
					{/each}
				</div>
			</section>

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
						<div class="agent-genesis__meta">
							{#if activeRequest.currentState}
								<span class="agent-genesis__pill">
									{formatAgentWorkflowLabel(activeRequest.currentState)}
								</span>
							{/if}
							{#if activeRequest.routeDecision}
								<span class="agent-genesis__pill">
									Route {formatAgentWorkflowLabel(activeRequest.routeDecision)}
								</span>
							{/if}
							<span class="agent-genesis__pill">
								{activeRequest.artifacts?.length ?? 0} artifact{activeRequest.artifacts?.length ===
								1
									? ''
									: 's'}
							</span>
						</div>
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
						{#if reviewFindings.length || reviewEvidence.length}
							<div class="agent-genesis__review-grid">
								{#if reviewFindings.length}
									<article class="agent-genesis__summary-card">
										<p class="agent-genesis__summary-label">Review findings</p>
										<h3>{reviewFindings.length} finding{reviewFindings.length === 1 ? '' : 's'}</h3>
										<ul class="agent-genesis__summary-list">
											{#each reviewFindings.slice(0, 3) as finding (finding.id)}
												<li>
													<strong>{finding.title}</strong>
													<span>{finding.detail}</span>
												</li>
											{/each}
										</ul>
									</article>
								{/if}

								{#if reviewEvidence.length}
									<article class="agent-genesis__summary-card">
										<p class="agent-genesis__summary-label">Decision evidence</p>
										<h3>
											{reviewEvidence.length} reference{reviewEvidence.length === 1 ? '' : 's'}
										</h3>
										<ul class="agent-genesis__summary-list">
											{#each reviewEvidence.slice(0, 3) as artifact (artifact.id)}
												<li>
													<strong>{artifact.title}</strong>
													<span
														>{artifact.description ??
															'Supporting context attached to the decision.'}</span
													>
												</li>
											{/each}
										</ul>
									</article>
								{/if}
							</div>
						{/if}
					</section>
				{/if}

				{#if data.declaration || data.checkpoint}
					<section class="agent-genesis__panel">
						<header class="agent-genesis__panel-header">
							<p>Declaration lane</p>
							<h2>Issuance packet and signer checkpoint</h2>
						</header>
						<div class="agent-genesis__artifacts">
							{#if data.declaration}
								<DeclarationPreviewCard declaration={data.declaration} />
							{/if}
							{#if data.checkpoint}
								<SignatureCheckpointCard checkpoint={data.checkpoint} />
							{/if}
						</div>
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
	.agent-genesis__notes,
	.agent-genesis__signals,
	.agent-genesis__review-grid,
	.agent-genesis__summary-list,
	.agent-genesis__meta,
	.agent-genesis__artifacts {
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

	.agent-genesis__panel--signals {
		grid-column: 1 / -1;
	}

	.agent-genesis__panel-header p,
	.agent-genesis__panel-header h2,
	.agent-genesis__speaker,
	.agent-genesis__empty,
	.agent-genesis__note h3,
	.agent-genesis__note p,
	.agent-genesis__note small,
	.agent-genesis__signal p,
	.agent-genesis__signal h3,
	.agent-genesis__signal small,
	.agent-genesis__summary-card p,
	.agent-genesis__summary-card h3,
	.agent-genesis__summary-list,
	.agent-genesis__summary-list li,
	.agent-genesis__summary-list strong,
	.agent-genesis__summary-list span {
		margin: 0;
	}

	.agent-genesis__panel-header p,
	.agent-genesis__speaker,
	.agent-genesis__note small,
	.agent-genesis__signal p,
	.agent-genesis__summary-label {
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

	.agent-genesis__signals,
	.agent-genesis__review-grid,
	.agent-genesis__artifacts {
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.agent-genesis__signal,
	.agent-genesis__summary-card {
		display: grid;
		gap: 0.45rem;
		padding: 1rem 1.05rem;
		border-radius: 1.15rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.agent-genesis__signal h3,
	.agent-genesis__summary-card h3 {
		font-size: 1.25rem;
	}

	.agent-genesis__signal small,
	.agent-genesis__summary-list span {
		color: var(--gr-semantic-foreground-secondary);
		line-height: 1.5;
	}

	.agent-genesis__signal--accent {
		border: 1px solid color-mix(in srgb, var(--gr-color-primary-300) 65%, white 35%);
	}

	.agent-genesis__signal--warning {
		border: 1px solid color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.agent-genesis__signal--success {
		border: 1px solid color-mix(in srgb, var(--gr-color-success-300) 65%, white 35%);
	}

	.agent-genesis__signal--critical {
		border: 1px solid color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	.agent-genesis__meta {
		grid-template-columns: repeat(auto-fit, minmax(10rem, max-content));
		gap: 0.75rem;
	}

	.agent-genesis__pill {
		display: inline-flex;
		align-items: center;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.82);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 72%, white 28%);
		font-size: 0.78rem;
		font-weight: 700;
	}

	.agent-genesis__summary-list {
		padding: 0;
		list-style: none;
	}

	.agent-genesis__summary-list li {
		display: grid;
		gap: 0.15rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 72%, white 28%);
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
