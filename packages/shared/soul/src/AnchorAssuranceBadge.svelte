<!--
  Soul.AnchorAssuranceBadge - Displays Lesser Host anchor assurance as trust metadata.
-->
<script lang="ts">
	import { Badge, Text } from '@equaltoai/greater-components-primitives';

	import type { SoulAnchorAssurance } from './types.js';
	import {
		formatAnchorAssuranceSummary,
		formatAnchorAssuranceTrustNotice,
		getAnchorAssuranceBadgeColor,
		getAnchorAssuranceStateLabel,
		getAnchorAssuranceSourceLabel,
		getAnchorEvidenceKindLabel,
	} from './utils.js';

	interface Props {
		assurance?: SoulAnchorAssurance | null;
		showDetails?: boolean;
		showTrustNotice?: boolean;
		title?: string;
		class?: string;
	}

	let {
		assurance = null,
		showDetails = false,
		showTrustNotice = true,
		title = 'Anchor assurance',
		class: className = '',
	}: Props = $props();

	const summary = $derived(formatAnchorAssuranceSummary(assurance));
	const trustNotice = $derived(formatAnchorAssuranceTrustNotice(assurance));
	const color = $derived(getAnchorAssuranceBadgeColor(assurance));
</script>

<div class={`soul-anchor-assurance ${className}`} role="group" aria-label={`${title}: ${summary}`}>
	<Badge
		variant="pill"
		size="sm"
		{color}
		label={assurance ? getAnchorAssuranceStateLabel(assurance.state) : 'No assurance'}
		description={assurance ? getAnchorAssuranceSourceLabel(assurance.source) : undefined}
	/>

	{#if showTrustNotice}
		<Text size="sm" color="secondary" class="soul-anchor-assurance__notice">{trustNotice}</Text>
	{/if}

	{#if showDetails && assurance}
		<ul class="soul-anchor-assurance__details" aria-label="Anchor assurance details">
			<li>Source: {getAnchorAssuranceSourceLabel(assurance.source)}</li>
			<li>Mutable: {assurance.mutable ? 'yes' : 'no'}</li>
			<li>Revocable: {assurance.revocable ? 'yes' : 'no'}</li>
			<li>Capability gate: no</li>
			{#if assurance.evidence?.length}
				{#each assurance.evidence as evidence, index (`${evidence.kind}-${evidence.tx_hash ?? evidence.operation_id ?? evidence.token_id ?? index}`)}
					<li>
						Evidence: {getAnchorEvidenceKindLabel(evidence.kind)}
						{#if evidence.tx_hash}
							· tx {evidence.tx_hash}{/if}
						{#if evidence.operation_id}
							· operation {evidence.operation_id}{/if}
						{#if evidence.token_id}
							· token {evidence.token_id}{/if}
						{#if evidence.chain_id}
							· chain {evidence.chain_id}{/if}
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.soul-anchor-assurance {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	:global(.soul-anchor-assurance__notice) {
		margin: 0;
	}

	.soul-anchor-assurance__details {
		flex-basis: 100%;
		margin: 0;
		padding-left: 1.25rem;
		color: var(--gr-color-text-muted, #4b5563);
		font-size: 0.875rem;
	}
</style>
