<script lang="ts">
	import type { MessagingWorkflowConversationSummary } from './types.js';

	interface Props {
		summary: MessagingWorkflowConversationSummary;
		compact?: boolean;
		class?: string;
	}

	let { summary, compact = false, class: className = '' }: Props = $props();

	function formatLabel(value: string): string {
		return value
			.split(/[_-]/g)
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join(' ');
	}
</script>

<div class={`conversation-workflow-summary ${compact ? 'conversation-workflow-summary--compact' : ''} ${className}`}>
	<div class="conversation-workflow-summary__header">
		<p class="conversation-workflow-summary__title">{summary.title}</p>
		<span class="conversation-workflow-summary__state">{formatLabel(summary.state)}</span>
	</div>

	{#if summary.summary}
		<p class="conversation-workflow-summary__copy">{summary.summary}</p>
	{/if}

	<div class="conversation-workflow-summary__meta">
		{#if summary.phase}
			<span>{formatLabel(summary.phase)}</span>
		{/if}
		{#if summary.dueLabel}
			<span>{summary.dueLabel}</span>
		{/if}
	</div>
</div>

<style>
	.conversation-workflow-summary {
		display: grid;
		gap: 0.35rem;
		padding: 0.7rem 0.8rem;
		border-radius: 0.85rem;
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.conversation-workflow-summary--compact {
		padding: 0.55rem 0.65rem;
	}

	.conversation-workflow-summary__header {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: center;
	}

	.conversation-workflow-summary__title,
	.conversation-workflow-summary__copy {
		margin: 0;
	}

	.conversation-workflow-summary__title {
		font-size: 0.85rem;
		font-weight: 700;
	}

	.conversation-workflow-summary__state,
	.conversation-workflow-summary__meta {
		font-size: 0.78rem;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.conversation-workflow-summary__state {
		padding: 0.18rem 0.45rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		font-weight: 700;
	}

	.conversation-workflow-summary__copy {
		font-size: 0.85rem;
		line-height: 1.35;
		color: var(--gr-semantic-foreground-secondary);
	}

	.conversation-workflow-summary__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}
</style>
