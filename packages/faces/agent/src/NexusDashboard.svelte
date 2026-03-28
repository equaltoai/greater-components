<script lang="ts">
	import {
		AgentIdentityCard,
		ContinuityPanel,
		GraduationSummaryCard,
		SoulLifecycleRail,
	} from '@equaltoai/greater-components-agent';
	import { WorkflowNotificationItem } from '@equaltoai/greater-components-notifications';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { NexusDashboardData } from './types.js';

	interface Props {
		data: NexusDashboardData;
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
		<div class="nexus-dashboard">
			<section class="nexus-dashboard__panel">
				<header class="nexus-dashboard__panel-header">
					<p>Graduation readiness</p>
					<h2>Deployment board</h2>
				</header>
				<GraduationSummaryCard summary={data.graduation} />
			</section>

			{#if data.callouts?.length}
				<section class="nexus-dashboard__panel">
					<header class="nexus-dashboard__panel-header">
						<p>Operational snapshot</p>
						<h2>Priority highlights</h2>
					</header>
					<div class="nexus-dashboard__callouts">
						{#each data.callouts as callout (callout.id)}
							<article class={`nexus-dashboard__callout nexus-dashboard__callout--${callout.tone ?? 'neutral'}`}>
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
	.nexus-dashboard__callouts {
		display: grid;
		gap: 1rem;
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
	.nexus-dashboard__callout small {
		margin: 0;
	}

	.nexus-dashboard__panel-header p,
	.nexus-dashboard__callout small {
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
