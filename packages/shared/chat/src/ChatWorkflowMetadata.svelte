<script lang="ts">
	import type { ChatMessageWorkflowMetadata } from './types.js';

	interface Props {
		metadata: ChatMessageWorkflowMetadata;
		class?: string;
	}

	let { metadata, class: className = '' }: Props = $props();

	function formatLabel(value: string): string {
		return value
			.split(/[_-]/g)
			.filter(Boolean)
			.map((part) => part[0].toUpperCase() + part.slice(1))
			.join(' ');
	}
</script>

<section class={`chat-workflow-metadata ${className}`}>
	{#if metadata.kind === 'declaration'}
		<p class="chat-workflow-metadata__eyebrow">Declaration metadata</p>
		<p class="chat-workflow-metadata__primary">{metadata.statement}</p>
		<p class="chat-workflow-metadata__secondary">
			Confidence: <strong>{metadata.confidence}</strong>
		</p>
		{#if metadata.scope?.length}
			<div class="chat-workflow-metadata__chips">
				{#each metadata.scope as scopeItem}
					<span>{scopeItem}</span>
				{/each}
			</div>
		{/if}
	{:else if metadata.kind === 'approval'}
		<p class="chat-workflow-metadata__eyebrow">Approval metadata</p>
		<p class="chat-workflow-metadata__primary">
			{metadata.reviewer} · {formatLabel(metadata.outcome)}
		</p>
		{#if metadata.note}
			<p class="chat-workflow-metadata__secondary">{metadata.note}</p>
		{/if}
	{:else}
		<p class="chat-workflow-metadata__eyebrow">Finalize output</p>
		<p class="chat-workflow-metadata__primary">
			Readiness: <strong>{formatLabel(metadata.readiness)}</strong>
		</p>
		<p class="chat-workflow-metadata__secondary">{metadata.nextStep}</p>
		{#if metadata.outputs?.length}
			<ul class="chat-workflow-metadata__list">
				{#each metadata.outputs as output}
					<li>{output}</li>
				{/each}
			</ul>
		{/if}
	{/if}
</section>

<style>
	.chat-workflow-metadata {
		display: grid;
		gap: 0.45rem;
		padding: 0.85rem 0.95rem;
		border-radius: 0.95rem;
		background: rgba(255, 255, 255, 0.78);
		border: 1px dashed var(--gr-semantic-border-default);
	}

	.chat-workflow-metadata__eyebrow,
	.chat-workflow-metadata__primary,
	.chat-workflow-metadata__secondary,
	.chat-workflow-metadata__list {
		margin: 0;
	}

	.chat-workflow-metadata__eyebrow {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.chat-workflow-metadata__primary {
		font-size: 0.92rem;
		font-weight: 700;
	}

	.chat-workflow-metadata__secondary,
	.chat-workflow-metadata__list {
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--gr-semantic-foreground-secondary);
	}

	.chat-workflow-metadata__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chat-workflow-metadata__chips span {
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		background: var(--gr-semantic-background-secondary);
		font-size: 0.78rem;
		font-weight: 600;
	}

	.chat-workflow-metadata__list {
		padding-left: 1.1rem;
	}
</style>
