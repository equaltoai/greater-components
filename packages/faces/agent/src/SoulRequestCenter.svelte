<script lang="ts">
	import { ReviewDecisionCard, SoulRequestCard } from '@equaltoai/greater-components-agent';
	import { WorkflowNotificationItem } from '@equaltoai/greater-components-notifications';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { SoulRequestCenterData } from './types.js';

	interface Props {
		data: SoulRequestCenterData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();

	const focusRequest = $derived(data.focusRequest ?? data.requestQueue[0]);
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
		<div class="soul-request-center">
			{#if data.filters?.length}
				<div class="soul-request-center__filters">
					{#each data.filters as filter (filter.id)}
						<button
							class:soul-request-center__filter--active={filter.active}
							class="soul-request-center__filter"
							type="button"
						>
							<span>{filter.label}</span>
							{#if typeof filter.count === 'number'}
								<small>{filter.count}</small>
							{/if}
						</button>
					{/each}
				</div>
			{/if}

			<div class="soul-request-center__grid">
				<section class="soul-request-center__panel">
					<header class="soul-request-center__panel-header">
						<p>Workflow notifications</p>
						<h2>Notification center</h2>
					</header>
					<div class="soul-request-center__list">
						{#each data.notifications as notification (notification.id)}
							<WorkflowNotificationItem {notification} />
						{/each}
					</div>
				</section>

				<section class="soul-request-center__panel">
					<header class="soul-request-center__panel-header">
						<p>Request queue</p>
						<h2>Review routing</h2>
					</header>
					<div class="soul-request-center__list">
						{#each data.requestQueue as request (request.id)}
							<SoulRequestCard {request} />
						{/each}
					</div>
				</section>
			</div>
		</div>
	{/snippet}

	{#snippet side()}
		{#if focusRequest}
			<section class="soul-request-center__panel">
				<header class="soul-request-center__panel-header">
					<p>Selected request</p>
					<h2>Triage focus</h2>
				</header>
				<SoulRequestCard request={focusRequest} />
			</section>
		{/if}
		{#if data.reviewDecision}
			<section class="soul-request-center__panel">
				<header class="soul-request-center__panel-header">
					<p>Review snapshot</p>
					<h2>Latest decision</h2>
				</header>
				<ReviewDecisionCard decision={data.reviewDecision} />
			</section>
		{/if}
		{#if data.callouts?.length}
			<section class="soul-request-center__panel">
				<header class="soul-request-center__panel-header">
					<p>Routing context</p>
					<h2>Queue notes</h2>
				</header>
				<div class="soul-request-center__callouts">
					{#each data.callouts as callout (callout.id)}
						<article class={`soul-request-center__callout soul-request-center__callout--${callout.tone ?? 'neutral'}`}>
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
	.soul-request-center,
	.soul-request-center__grid,
	.soul-request-center__list,
	.soul-request-center__callouts {
		display: grid;
		gap: 1rem;
	}

	.soul-request-center__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.soul-request-center__filter {
		display: inline-flex;
		gap: 0.55rem;
		align-items: center;
		padding: 0.7rem 0.85rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
		background: rgba(255, 255, 255, 0.7);
		font: inherit;
		cursor: pointer;
	}

	.soul-request-center__filter--active {
		background: color-mix(in srgb, var(--gr-color-secondary-100) 62%, white 38%);
		color: var(--gr-color-secondary-800);
		font-weight: 700;
	}

	.soul-request-center__filter small {
		font-size: 0.75rem;
		opacity: 0.8;
	}

	.soul-request-center__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}

	.soul-request-center__panel {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.soul-request-center__panel-header p,
	.soul-request-center__panel-header h2,
	.soul-request-center__callout h3,
	.soul-request-center__callout p,
	.soul-request-center__callout small {
		margin: 0;
	}

	.soul-request-center__panel-header p,
	.soul-request-center__callout small {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.soul-request-center__panel-header h2 {
		margin-top: 0.25rem;
		font-size: 1.1rem;
	}

	.soul-request-center__callout {
		display: grid;
		gap: 0.35rem;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.soul-request-center__callout p {
		color: var(--gr-semantic-foreground-secondary);
		line-height: 1.5;
	}

	.soul-request-center__callout--warning {
		border: 1px solid color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.soul-request-center__callout--critical {
		border: 1px solid color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	@media (max-width: 880px) {
		.soul-request-center__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
