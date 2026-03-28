<script lang="ts">
	import AgentStateBadge from './AgentStateBadge.svelte';
	import { formatAgentSurfaceDate, type SignatureCheckpointCardData } from './surfaces.js';

	interface Props {
		checkpoint: SignatureCheckpointCardData;
		class?: string;
	}

	let { checkpoint, class: className = '' }: Props = $props();
</script>

<article class={`signature-checkpoint-card ${className}`}>
	<div class="signature-checkpoint-card__header">
		<div>
			<p class="signature-checkpoint-card__eyebrow">Signature checkpoint</p>
			<h3>{checkpoint.title}</h3>
			{#if checkpoint.dueAt}
				<p class="signature-checkpoint-card__meta">
					Due {formatAgentSurfaceDate(checkpoint.dueAt)}
				</p>
			{/if}
		</div>

		<AgentStateBadge label={checkpoint.readinessLabel} tone="warning" />
	</div>

	{#if checkpoint.approvalMemo}
		<p class="signature-checkpoint-card__memo">{checkpoint.approvalMemo}</p>
	{/if}

	<div class="signature-checkpoint-card__signers">
		{#each checkpoint.signers as signer}
			<div class="signature-checkpoint-card__signer">
				<div>
					<p class="signature-checkpoint-card__signer-name">{signer.name}</p>
					<p class="signature-checkpoint-card__meta">{signer.role}</p>
					{#if signer.note}
						<p class="signature-checkpoint-card__note">{signer.note}</p>
					{/if}
				</div>

				<AgentStateBadge
					label={signer.status}
					tone={signer.status === 'approved'
						? 'success'
						: signer.status === 'rejected'
							? 'critical'
							: 'neutral'}
				/>
			</div>
		{/each}
	</div>
</article>

<style>
	.signature-checkpoint-card {
		display: grid;
		gap: 1rem;
		padding: 1.35rem;
		border-radius: 1.2rem;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-default);
	}

	.signature-checkpoint-card__header,
	.signature-checkpoint-card__signer {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: flex-start;
	}

	.signature-checkpoint-card__eyebrow,
	.signature-checkpoint-card__meta,
	.signature-checkpoint-card__note {
		margin: 0;
		color: var(--gr-semantic-foreground-tertiary);
	}

	.signature-checkpoint-card__eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.signature-checkpoint-card__header h3,
	.signature-checkpoint-card__memo,
	.signature-checkpoint-card__signer-name {
		margin: 0;
	}

	.signature-checkpoint-card__memo {
		line-height: 1.55;
		color: var(--gr-semantic-foreground-secondary);
	}

	.signature-checkpoint-card__signers {
		display: grid;
		gap: 0.75rem;
	}

	.signature-checkpoint-card__signer {
		padding: 0.9rem 1rem;
		border-radius: 0.95rem;
		background: var(--gr-semantic-background-secondary);
	}

	.signature-checkpoint-card__signer-name {
		font-weight: 700;
	}

	@media (max-width: 640px) {
		.signature-checkpoint-card__header,
		.signature-checkpoint-card__signer {
			flex-direction: column;
		}
	}
</style>
