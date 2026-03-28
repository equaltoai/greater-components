<script lang="ts">
	import type { MessagingWorkflowThreadMoment } from './types.js';

	interface Props {
		moment: MessagingWorkflowThreadMoment;
		class?: string;
	}

	let { moment, class: className = '' }: Props = $props();

	function formatLabel(value: string): string {
		return value
			.split(/[_-]/g)
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join(' ');
	}

	const tone = $derived.by(() => {
		if (moment.kind === 'decision') {
			if (moment.decision === 'approved') return 'success';
			if (moment.decision === 'rejected') return 'critical';
			return 'warning';
		}
		return moment.kind === 'approval_request' ? 'warning' : 'accent';
	});
</script>

<div class={`workflow-thread-moment workflow-thread-moment--${tone} ${className}`}>
	<div class="workflow-thread-moment__header">
		<p class="workflow-thread-moment__eyebrow">{formatLabel(moment.kind)}</p>
		{#if moment.phase}
			<span class="workflow-thread-moment__pill">{formatLabel(moment.phase)}</span>
		{/if}
	</div>

	<p class="workflow-thread-moment__title">{moment.title}</p>
	<p class="workflow-thread-moment__summary">{moment.summary}</p>

	<div class="workflow-thread-moment__meta">
		{#if moment.requestedBy}
			<p><strong>Requested by:</strong> {moment.requestedBy}</p>
		{/if}
		{#if moment.targetLabel}
			<p><strong>Target:</strong> {moment.targetLabel}</p>
		{/if}
		{#if moment.actionLabel}
			<p class="workflow-thread-moment__action">{moment.actionLabel}</p>
		{/if}
		{#if moment.decision}
			<p><strong>Decision:</strong> {formatLabel(moment.decision)}</p>
		{/if}
	</div>
</div>

<style>
	.workflow-thread-moment {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.75rem;
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.workflow-thread-moment--accent {
		border-color: color-mix(in srgb, var(--gr-color-primary-300) 60%, white 40%);
	}

	.workflow-thread-moment--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 60%, white 40%);
	}

	.workflow-thread-moment--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 60%, white 40%);
	}

	.workflow-thread-moment--critical {
		border-color: color-mix(in srgb, var(--gr-color-error-300) 60%, white 40%);
	}

	.workflow-thread-moment__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.workflow-thread-moment__eyebrow,
	.workflow-thread-moment__title,
	.workflow-thread-moment__summary,
	.workflow-thread-moment__meta p {
		margin: 0;
	}

	.workflow-thread-moment__eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.workflow-thread-moment__title {
		font-weight: 700;
	}

	.workflow-thread-moment__summary,
	.workflow-thread-moment__meta {
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--gr-semantic-foreground-secondary);
	}

	.workflow-thread-moment__pill {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.workflow-thread-moment__action {
		font-weight: 700;
		color: var(--gr-color-primary-600);
	}
</style>
