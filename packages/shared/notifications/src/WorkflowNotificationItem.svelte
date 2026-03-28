<script lang="ts">
	import type { WorkflowEventNotification } from './types.js';

	interface Props {
		notification: WorkflowEventNotification;
		class?: string;
	}

	let { notification, class: className = '' }: Props = $props();

	function formatLabel(value: string): string {
		return value
			.split(/[_-]/g)
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join(' ');
	}

	const tone = $derived.by(() => {
		switch (notification.workflowEvent.kind) {
			case 'request_submitted':
				return 'accent';
			case 'review_requested':
			case 'approval_requested':
				return 'warning';
			case 'finalize_ready':
			case 'graduated':
				return 'success';
			default:
				return 'neutral';
		}
	});
</script>

<div class={`workflow-notification workflow-notification--${tone} ${className}`}>
	<div class="workflow-notification__header">
		<p class="workflow-notification__eyebrow">Workflow event</p>
		{#if notification.workflowEvent.phase}
			<span class="workflow-notification__pill">
				{formatLabel(notification.workflowEvent.phase)}
			</span>
		{/if}
	</div>

	<h4 class="workflow-notification__title">{notification.workflowEvent.title}</h4>
	<p class="workflow-notification__summary">{notification.workflowEvent.summary}</p>

	<div class="workflow-notification__meta">
		{#if notification.workflowEvent.actorLabel}
			<p><strong>Actor:</strong> {notification.workflowEvent.actorLabel}</p>
		{/if}
		{#if notification.workflowEvent.targetLabel}
			<p><strong>Target:</strong> {notification.workflowEvent.targetLabel}</p>
		{/if}
		{#if notification.workflowEvent.actionLabel}
			<p class="workflow-notification__action">{notification.workflowEvent.actionLabel}</p>
		{/if}
	</div>
</div>

<style>
	.workflow-notification {
		display: grid;
		gap: 0.55rem;
		padding: 0.8rem 0.9rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.workflow-notification--accent {
		border-color: color-mix(in srgb, var(--gr-color-primary-300) 60%, white 40%);
	}

	.workflow-notification--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 60%, white 40%);
	}

	.workflow-notification--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 60%, white 40%);
	}

	.workflow-notification__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.workflow-notification__eyebrow,
	.workflow-notification__title,
	.workflow-notification__summary,
	.workflow-notification__meta p {
		margin: 0;
	}

	.workflow-notification__eyebrow {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.workflow-notification__title {
		font-size: 0.95rem;
		font-weight: 700;
	}

	.workflow-notification__summary,
	.workflow-notification__meta {
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--gr-semantic-foreground-secondary);
	}

	.workflow-notification__pill {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.workflow-notification__action {
		font-weight: 700;
		color: var(--gr-color-primary-600);
	}
</style>
