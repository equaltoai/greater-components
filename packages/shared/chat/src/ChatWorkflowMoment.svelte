<script lang="ts">
	import type { ChatMessageMoment } from './types.js';

	interface Props {
		moment: ChatMessageMoment;
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
		if (moment.tone) return moment.tone;
		if (moment.kind === 'checkpoint') {
			if (moment.status === 'approved' || moment.status === 'ready') return 'success';
			if (moment.status === 'blocked') return 'critical';
			return 'warning';
		}
		if (moment.kind === 'artifact') {
			return 'accent';
		}
		return 'neutral';
	});

	const eyebrow = $derived.by(() => {
		if (moment.kind === 'artifact') return moment.artifactLabel ?? 'Artifact';
		if (moment.kind === 'checkpoint') return 'Checkpoint';
		return 'Action request';
	});
</script>

<article class={`chat-workflow-moment chat-workflow-moment--${tone} ${className}`}>
	<div class="chat-workflow-moment__header">
		<p class="chat-workflow-moment__eyebrow">{eyebrow}</p>
		{#if moment.kind === 'checkpoint'}
			<span class="chat-workflow-moment__pill">{formatLabel(moment.status)}</span>
		{:else if moment.phase}
			<span class="chat-workflow-moment__pill">{formatLabel(moment.phase)}</span>
		{/if}
	</div>

	<h4 class="chat-workflow-moment__title">{moment.title}</h4>

	{#if moment.summary}
		<p class="chat-workflow-moment__summary">{moment.summary}</p>
	{/if}

	{#if moment.kind === 'artifact'}
		{#if moment.facts?.length}
			<ul class="chat-workflow-moment__list">
				{#each moment.facts as fact, factIndex (`${fact}-${factIndex}`)}
					<li>{fact}</li>
				{/each}
			</ul>
		{/if}
		{#if moment.href}
			<a class="chat-workflow-moment__link" href={moment.href} target="_blank" rel="noreferrer">
				Open attachment
			</a>
		{/if}
	{:else if moment.kind === 'checkpoint'}
		{#if moment.detail}
			<p class="chat-workflow-moment__detail">{moment.detail}</p>
		{/if}
	{:else}
		<div class="chat-workflow-moment__request-meta">
			{#if moment.assignee}
				<p><strong>Assignee:</strong> {moment.assignee}</p>
			{/if}
			{#if moment.dueLabel}
				<p><strong>Due:</strong> {moment.dueLabel}</p>
			{/if}
			<p class="chat-workflow-moment__action">{moment.actionLabel}</p>
		</div>
	{/if}
</article>

<style>
	.chat-workflow-moment {
		display: grid;
		gap: 0.65rem;
		padding: 0.9rem 1rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
		border: 1px solid var(--gr-semantic-border-subtle);
	}

	.chat-workflow-moment--accent {
		border-color: color-mix(in srgb, var(--gr-color-primary-300) 62%, white 38%);
	}

	.chat-workflow-moment--success {
		border-color: color-mix(in srgb, var(--gr-color-success-300) 62%, white 38%);
	}

	.chat-workflow-moment--warning {
		border-color: color-mix(in srgb, var(--gr-color-warning-300) 62%, white 38%);
	}

	.chat-workflow-moment--critical {
		border-color: color-mix(in srgb, var(--gr-color-error-300) 62%, white 38%);
	}

	.chat-workflow-moment__header {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.chat-workflow-moment__eyebrow,
	.chat-workflow-moment__title,
	.chat-workflow-moment__summary,
	.chat-workflow-moment__detail,
	.chat-workflow-moment__request-meta p {
		margin: 0;
	}

	.chat-workflow-moment__eyebrow {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.chat-workflow-moment__title {
		font-size: 0.95rem;
		font-weight: 700;
	}

	.chat-workflow-moment__summary,
	.chat-workflow-moment__detail,
	.chat-workflow-moment__request-meta {
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--gr-semantic-foreground-secondary);
	}

	.chat-workflow-moment__pill {
		padding: 0.22rem 0.55rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.chat-workflow-moment__list {
		margin: 0;
		padding-left: 1.1rem;
		font-size: 0.92rem;
		color: var(--gr-semantic-foreground-secondary);
	}

	.chat-workflow-moment__link,
	.chat-workflow-moment__action {
		font-weight: 700;
		color: var(--gr-color-primary-600);
	}

	.chat-workflow-moment__link {
		width: fit-content;
	}
</style>
