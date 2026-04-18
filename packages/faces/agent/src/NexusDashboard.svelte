<script lang="ts">
	import {
		AgentIdentityCard,
		ContinuityPanel,
		GraduationSummaryCard,
		SoulLifecycleRail,
		formatAgentWorkflowLabel,
		type ContinuityFollowUp,
		type AgentSurfaceTone,
	} from '@equaltoai/greater-components-agent';
	import { WorkflowNotificationItem } from '@equaltoai/greater-components-notifications';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { AgentFaceTimelineMoment, NexusDashboardData } from './types.js';

	interface Props {
		data: NexusDashboardData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();
	const mapFollowUpToTimelineMoment = (followUp: ContinuityFollowUp): AgentFaceTimelineMoment => ({
		id: followUp.id,
		title: followUp.title,
		summary: followUp.summary,
		meta: followUp.cadence ? `${followUp.owner.name} · ${followUp.cadence}` : followUp.owner.name,
		tone: 'accent',
	});
	const continuityMoments = $derived.by(() =>
		data.continuityMoments?.length
			? data.continuityMoments
			: (data.continuity.followUps ?? []).map(mapFollowUpToTimelineMoment)
	);
	const dashboardSignals = $derived.by(() => {
		const readinessTone = (
			value: NexusDashboardData['graduation']['readiness']
		): AgentSurfaceTone => {
			switch (value) {
				case 'ready':
					return 'success';
				case 'hold':
					return 'critical';
				case 'watch':
				default:
					return 'warning';
			}
		};

		return [
			{
				id: 'graduation-readiness',
				label: 'Graduation readiness',
				value: formatAgentWorkflowLabel(data.graduation.readiness),
				detail:
					data.graduation.nextStep ??
					`${data.graduation.completedMilestones?.length ?? 0} milestones complete`,
				tone: readinessTone(data.graduation.readiness),
			},
			{
				id: 'continuity-loops',
				label: 'Continuity loops',
				value: String(data.continuity.followUps?.length ?? 0),
				detail: data.continuity.feedbackLoop,
				tone: 'accent' as const,
			},
			{
				id: 'workflow-activity',
				label: 'Workflow activity',
				value: String(data.workflowNotifications?.length ?? 0),
				detail: `${continuityMoments.length} continuity moment${
					continuityMoments.length === 1 ? '' : 's'
				} tracked`,
				tone: data.workflowNotifications?.length ? ('warning' as const) : ('neutral' as const),
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
		<div class="nexus-dashboard">
			<section class="nexus-dashboard__panel nexus-dashboard__panel--signals">
				<header class="nexus-dashboard__panel-header">
					<p>Operational digest</p>
					<h2>Graduation and continuity status</h2>
				</header>
				<div class="nexus-dashboard__signals">
					{#each dashboardSignals as signal (signal.id)}
						<article class={`nexus-dashboard__signal nexus-dashboard__signal--${signal.tone}`}>
							<p>{signal.label}</p>
							<h3>{signal.value}</h3>
							<small>{signal.detail}</small>
						</article>
					{/each}
				</div>
			</section>

			<section class="nexus-dashboard__panel">
				<header class="nexus-dashboard__panel-header">
					<p>Graduation readiness</p>
					<h2>Deployment board</h2>
				</header>
				<GraduationSummaryCard summary={data.graduation} />
			</section>

			{#if data.roster?.length}
				<section class="nexus-dashboard__panel">
					<header class="nexus-dashboard__panel-header">
						<p>Agent roster</p>
						<h2>Active roster</h2>
					</header>
					<div class="nexus-dashboard__roster">
						{#each data.roster as agent (agent.id)}
							<article class="nexus-dashboard__roster-card">
								<div class="nexus-dashboard__roster-header">
									<div>
										<h3>{agent.name}</h3>
										{#if agent.handle}
											<p>{agent.handle}</p>
										{/if}
									</div>
									<span class="nexus-dashboard__phase-pill">
										{formatAgentWorkflowLabel(agent.currentPhase)}
									</span>
								</div>
								<p class="nexus-dashboard__roster-summary">{agent.summary}</p>
								{#if agent.metrics?.length}
									<div class="nexus-dashboard__roster-metrics">
										{#each agent.metrics.slice(0, 2) as metric, metricIndex (`${agent.id}-${metric.label}-${metricIndex}`)}
											<div>
												<strong>{metric.value}</strong>
												<span>{metric.label}</span>
											</div>
										{/each}
									</div>
								{/if}
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if continuityMoments.length}
				<section class="nexus-dashboard__panel">
					<header class="nexus-dashboard__panel-header">
						<p>Continuity timeline</p>
						<h2>Post-graduation follow-through</h2>
					</header>
					<div class="nexus-dashboard__timeline">
						{#each continuityMoments as moment (moment.id)}
							<article
								class={`nexus-dashboard__timeline-card nexus-dashboard__timeline-card--${moment.tone ?? 'neutral'}`}
							>
								<div class="nexus-dashboard__timeline-header">
									<h3>{moment.title}</h3>
									{#if moment.phase}
										<span class="nexus-dashboard__phase-pill">
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

			{#if data.callouts?.length}
				<section class="nexus-dashboard__panel">
					<header class="nexus-dashboard__panel-header">
						<p>Operational snapshot</p>
						<h2>Priority highlights</h2>
					</header>
					<div class="nexus-dashboard__callouts">
						{#each data.callouts as callout (callout.id)}
							<article
								class={`nexus-dashboard__callout nexus-dashboard__callout--${callout.tone ?? 'neutral'}`}
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

			{#if data.workflowNotifications?.length}
				<section class="nexus-dashboard__panel">
					<header class="nexus-dashboard__panel-header">
						<p>Workflow activity</p>
						<h2>Recent launches and follow-through</h2>
					</header>
					<div class="nexus-dashboard__callouts">
						{#each data.workflowNotifications as notification (notification.id)}
							<WorkflowNotificationItem {notification} />
						{/each}
					</div>
				</section>
			{/if}
		</div>
	{/snippet}

	{#snippet side()}
		<AgentIdentityCard identity={data.identity} />
		<ContinuityPanel panel={data.continuity} />
		{#if data.lifecycle?.length}
			<SoulLifecycleRail steps={data.lifecycle} currentPhase={data.identity.currentPhase} />
		{/if}
	{/snippet}
</AgentFaceFrame>

<style>
	.nexus-dashboard,
	.nexus-dashboard__callouts,
	.nexus-dashboard__signals,
	.nexus-dashboard__roster,
	.nexus-dashboard__timeline {
		display: grid;
		gap: 1rem;
	}

	.nexus-dashboard__panel--signals {
		grid-column: 1 / -1;
	}

	.nexus-dashboard__panel {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.nexus-dashboard__panel-header p,
	.nexus-dashboard__panel-header h2,
	.nexus-dashboard__callout h3,
	.nexus-dashboard__callout p,
	.nexus-dashboard__callout small,
	.nexus-dashboard__signal p,
	.nexus-dashboard__signal h3,
	.nexus-dashboard__signal small,
	.nexus-dashboard__roster-card h3,
	.nexus-dashboard__roster-card p,
	.nexus-dashboard__timeline-card h3,
	.nexus-dashboard__timeline-card p,
	.nexus-dashboard__timeline-card small {
		margin: 0;
	}

	.nexus-dashboard__panel-header p,
	.nexus-dashboard__callout small,
	.nexus-dashboard__signal p,
	.nexus-dashboard__timeline-card small,
	.nexus-dashboard__roster-card p:last-child {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.nexus-dashboard__panel-header h2 {
		margin-top: 0.25rem;
		font-size: 1.1rem;
	}

	.nexus-dashboard__callouts {
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.nexus-dashboard__signals,
	.nexus-dashboard__roster,
	.nexus-dashboard__timeline {
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.nexus-dashboard__signal,
	.nexus-dashboard__roster-card,
	.nexus-dashboard__timeline-card {
		display: grid;
		gap: 0.45rem;
		padding: 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.nexus-dashboard__signal small,
	.nexus-dashboard__roster-summary,
	.nexus-dashboard__timeline-card p,
	.nexus-dashboard__timeline-card small {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}

	.nexus-dashboard__signal--accent,
	.nexus-dashboard__timeline-card--accent {
		border-color: color-mix(in srgb, var(--gr-color-primary-300) 65%, white 35%);
	}

	.nexus-dashboard__signal--warning,
	.nexus-dashboard__timeline-card--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.nexus-dashboard__signal--success,
	.nexus-dashboard__timeline-card--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 65%, white 35%);
	}

	.nexus-dashboard__signal--critical,
	.nexus-dashboard__timeline-card--critical {
		border-color: color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	.nexus-dashboard__roster-header,
	.nexus-dashboard__timeline-header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: flex-start;
	}

	.nexus-dashboard__phase-pill {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.82);
		font-size: 0.74rem;
		font-weight: 700;
	}

	.nexus-dashboard__roster-metrics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.nexus-dashboard__roster-metrics div {
		display: grid;
		gap: 0.15rem;
	}

	.nexus-dashboard__roster-metrics strong {
		font-size: 1.1rem;
	}

	.nexus-dashboard__roster-metrics span {
		font-size: 0.82rem;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.nexus-dashboard__callout {
		display: grid;
		gap: 0.35rem;
		padding: 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.nexus-dashboard__callout p {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}

	.nexus-dashboard__callout--success {
		border: 1px solid color-mix(in srgb, var(--gr-color-success-300) 65%, white 35%);
	}

	.nexus-dashboard__callout--warning {
		border: 1px solid color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}
</style>
