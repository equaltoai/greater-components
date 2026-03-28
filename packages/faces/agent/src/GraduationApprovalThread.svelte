<script lang="ts">
	import {
		DeclarationPreviewCard,
		GraduationSummaryCard,
		SignatureCheckpointCard,
		formatAgentWorkflowLabel,
		type AgentSurfaceTone,
	} from '@equaltoai/greater-components-agent';
	import { ConversationWorkflowSummary, Message } from '@equaltoai/greater-components-messaging';
	import AgentFaceFrame from './internal/AgentFaceFrame.svelte';
	import type { GraduationApprovalThreadData } from './types.js';

	interface Props {
		data: GraduationApprovalThreadData;
		class?: string;
	}

	let { data, class: className = '' }: Props = $props();
	const approvedSignerCount = $derived(
		data.checkpoint.signers.filter((signer) => signer.status === 'approved').length
	);
	const pendingSignerCount = $derived(
		data.checkpoint.signers.filter((signer) => signer.status === 'pending').length
	);
	const rejectedSignerCount = $derived(
		data.checkpoint.signers.filter((signer) => signer.status === 'rejected').length
	);
	const threadSignals = $derived.by(() => {
		const readinessTone = (
			value: GraduationApprovalThreadData['graduation']['readiness']
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
				id: 'thread-state',
				label: 'Thread state',
				value: formatAgentWorkflowLabel(data.threadSummary.state),
				detail: data.threadSummary.dueLabel ?? 'Open for signer review',
				tone:
					data.threadSummary.state === 'approved'
						? ('success' as const)
						: data.threadSummary.state === 'rejected'
							? ('critical' as const)
							: ('warning' as const),
			},
			{
				id: 'signer-readiness',
				label: 'Signer readiness',
				value: `${approvedSignerCount}/${data.checkpoint.signers.length} approved`,
				detail: rejectedSignerCount
					? `${rejectedSignerCount} rejected, ${pendingSignerCount} pending`
					: `${pendingSignerCount} pending approval`,
				tone:
					rejectedSignerCount > 0
						? ('critical' as const)
						: pendingSignerCount > 0
							? ('warning' as const)
							: ('success' as const),
			},
			{
				id: 'launch-step',
				label: 'Launch step',
				value: formatAgentWorkflowLabel(data.graduation.readiness),
				detail:
					data.graduation.nextStep ??
					data.checkpoint.approvalMemo ??
					'Awaiting the next launch action',
				tone: readinessTone(data.graduation.readiness),
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
		<div class="graduation-thread">
			<section class="graduation-thread__panel graduation-thread__panel--signals">
				<header class="graduation-thread__panel-header">
					<p>Approval digest</p>
					<h2>Declaration and signing state</h2>
				</header>
				<div class="graduation-thread__signals">
					{#each threadSignals as signal (signal.id)}
						<article class={`graduation-thread__signal graduation-thread__signal--${signal.tone}`}>
							<p>{signal.label}</p>
							<h3>{signal.value}</h3>
							<small>{signal.detail}</small>
						</article>
					{/each}
				</div>
			</section>

			<section class="graduation-thread__panel">
				<header class="graduation-thread__panel-header">
					<p>Approval conversation</p>
					<h2>Signer thread</h2>
				</header>

				<ConversationWorkflowSummary summary={data.threadSummary} />

				<div class="graduation-thread__briefs">
					<article class="graduation-thread__brief">
						<p class="graduation-thread__brief-label">Declaration packet</p>
						<h3>{data.declaration.title}</h3>
						<p>{data.declaration.statement}</p>
						<div class="graduation-thread__chips">
							{#each data.declaration.declaredScope.slice(0, 4) as scope, scopeIndex (`${scope}-${scopeIndex}`)}
								<span>{scope}</span>
							{/each}
						</div>
					</article>

					<article class="graduation-thread__brief">
						<p class="graduation-thread__brief-label">Signer readiness</p>
						<h3>{approvedSignerCount}/{data.checkpoint.signers.length} approved</h3>
						<ul class="graduation-thread__signer-list">
							{#each data.checkpoint.signers as signer (signer.id)}
								<li>
									<strong>{signer.name}</strong>
									<span>{formatAgentWorkflowLabel(signer.status)} · {signer.role}</span>
								</li>
							{/each}
						</ul>
					</article>
				</div>

				<div class="graduation-thread__messages">
					{#each data.messages as message (message.id)}
						<Message {message} currentUserId={data.currentUserId ?? 'me'} />
					{/each}
				</div>
			</section>

			<section class="graduation-thread__panel">
				<header class="graduation-thread__panel-header">
					<p>Declaration packet</p>
					<h2>Signer checklist and approval memo</h2>
				</header>
				<div class="graduation-thread__artifacts">
					<DeclarationPreviewCard declaration={data.declaration} />
					<SignatureCheckpointCard checkpoint={data.checkpoint} />
				</div>
			</section>
		</div>
	{/snippet}

	{#snippet side()}
		<GraduationSummaryCard summary={data.graduation} />
		{#if data.callouts?.length}
			<section class="graduation-thread__panel">
				<header class="graduation-thread__panel-header">
					<p>Approval notes</p>
					<h2>Launch guidance</h2>
				</header>
				<div class="graduation-thread__callouts">
					{#each data.callouts as callout (callout.id)}
						<article
							class={`graduation-thread__callout graduation-thread__callout--${callout.tone ?? 'neutral'}`}
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
	.graduation-thread__panel,
	.graduation-thread__messages,
	.graduation-thread__callouts,
	.graduation-thread,
	.graduation-thread__signals,
	.graduation-thread__briefs,
	.graduation-thread__artifacts,
	.graduation-thread__signer-list {
		display: grid;
		gap: 1rem;
	}

	.graduation-thread__panel--signals {
		grid-column: 1 / -1;
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
	.graduation-thread__callout small,
	.graduation-thread__signal p,
	.graduation-thread__signal h3,
	.graduation-thread__signal small,
	.graduation-thread__brief p,
	.graduation-thread__brief h3,
	.graduation-thread__signer-list,
	.graduation-thread__signer-list li,
	.graduation-thread__signer-list strong,
	.graduation-thread__signer-list span {
		margin: 0;
	}

	.graduation-thread__panel-header p,
	.graduation-thread__callout small,
	.graduation-thread__signal p,
	.graduation-thread__brief-label {
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

	.graduation-thread__signals,
	.graduation-thread__briefs,
	.graduation-thread__artifacts {
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.graduation-thread__signal,
	.graduation-thread__brief {
		display: grid;
		gap: 0.45rem;
		padding: 1rem 1.05rem;
		border-radius: 1.15rem;
		background: color-mix(in srgb, var(--gr-semantic-background-secondary) 82%, white 18%);
		border: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 68%, white 32%);
	}

	.graduation-thread__signal h3,
	.graduation-thread__brief h3 {
		font-size: 1.1rem;
	}

	.graduation-thread__signal small,
	.graduation-thread__brief p:last-child,
	.graduation-thread__signer-list span {
		line-height: 1.5;
		color: var(--gr-semantic-foreground-secondary);
	}

	.graduation-thread__signal--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 65%, white 35%);
	}

	.graduation-thread__signal--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 65%, white 35%);
	}

	.graduation-thread__signal--critical {
		border-color: color-mix(in srgb, var(--gr-color-error-300) 65%, white 35%);
	}

	.graduation-thread__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.graduation-thread__chips span {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.82);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.graduation-thread__signer-list {
		padding: 0;
		list-style: none;
	}

	.graduation-thread__signer-list li {
		display: grid;
		gap: 0.15rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, var(--gr-semantic-border-subtle) 72%, white 28%);
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
