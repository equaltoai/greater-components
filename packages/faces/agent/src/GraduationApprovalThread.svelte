<script lang="ts">
	import {
		DeclarationPreviewCard,
		GraduationSummaryCard,
		SignatureCheckpointCard,
	} from '@equaltoai/greater-components-agent';
	import { ConversationWorkflowSummary, Message } from '@equaltoai/greater-components-messaging';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { GraduationApprovalThreadData } from './types.js';

	interface Props {
		data: GraduationApprovalThreadData;
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
		<section class="graduation-thread__panel">
			<header class="graduation-thread__panel-header">
				<p>Approval conversation</p>
				<h2>Signer thread</h2>
			</header>

			<ConversationWorkflowSummary summary={data.threadSummary} />

			<div class="graduation-thread__messages">
				{#each data.messages as message (message.id)}
					<Message {message} currentUserId={data.currentUserId ?? 'me'} />
				{/each}
			</div>
		</section>
	{/snippet}

	{#snippet side()}
		<DeclarationPreviewCard declaration={data.declaration} />
		<SignatureCheckpointCard checkpoint={data.checkpoint} />
		<GraduationSummaryCard summary={data.graduation} />
		{#if data.callouts?.length}
			<section class="graduation-thread__panel">
				<header class="graduation-thread__panel-header">
					<p>Approval notes</p>
					<h2>Launch guidance</h2>
				</header>
				<div class="graduation-thread__callouts">
					{#each data.callouts as callout (callout.id)}
						<article class={`graduation-thread__callout graduation-thread__callout--${callout.tone ?? 'neutral'}`}>
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
	.graduation-thread__panel,
	.graduation-thread__messages,
	.graduation-thread__callouts {
		display: grid;
		gap: 1rem;
	}

	.graduation-thread__panel {
		padding: 1.25rem;
		border-radius: 1.5rem;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.graduation-thread__panel-header p,
	.graduation-thread__panel-header h2,
	.graduation-thread__callout h3,
	.graduation-thread__callout p,
	.graduation-thread__callout small {
		margin: 0;
	}

	.graduation-thread__panel-header p,
	.graduation-thread__callout small {
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.graduation-thread__panel-header h2 {
		margin-top: 0.25rem;
		font-size: 1.1rem;
	}

	.graduation-thread__messages {
		align-content: start;
	}

	.graduation-thread__callout {
		display: grid;
		gap: 0.35rem;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
	}

	.graduation-thread__callout p {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}
</style>
