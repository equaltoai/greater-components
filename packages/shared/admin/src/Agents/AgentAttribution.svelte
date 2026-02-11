<script lang="ts">
	import { DefinitionItem, DefinitionList } from '@equaltoai/greater-components-primitives';

	type AgentPostAttributionLike = {
		triggerType?: string | null;
		triggerDetails?: string | null;
		memoryCitations?: string[] | null;
		delegatedBy?: string | null;
		scopes?: string[] | null;
		constraints?: string[] | null;
		modelVersion?: string | null;
	};

	interface Props {
		attribution?: AgentPostAttributionLike | null;
		class?: string;
	}

	let { attribution = null, class: className = '' }: Props = $props();

	const scopes = $derived(attribution?.scopes?.filter(Boolean).join(', ') ?? null);
	const constraints = $derived(attribution?.constraints?.filter(Boolean).join(', ') ?? null);
	const citations = $derived(attribution?.memoryCitations?.filter(Boolean).join(', ') ?? null);
</script>

{#if attribution}
	<div class={['admin-agent-attribution', className].filter(Boolean).join(' ')}>
		<DefinitionList density="sm" dividers={false}>
			{#if attribution.triggerType}
				<DefinitionItem label="Trigger">{attribution.triggerType}</DefinitionItem>
			{/if}
			{#if attribution.delegatedBy}
				<DefinitionItem label="Delegated By">{attribution.delegatedBy}</DefinitionItem>
			{/if}
			{#if attribution.modelVersion}
				<DefinitionItem label="Model">{attribution.modelVersion}</DefinitionItem>
			{/if}
			{#if scopes}
				<DefinitionItem label="Scopes">{scopes}</DefinitionItem>
			{/if}
			{#if constraints}
				<DefinitionItem label="Constraints">{constraints}</DefinitionItem>
			{/if}
			{#if citations}
				<DefinitionItem label="Citations">{citations}</DefinitionItem>
			{/if}
			{#if attribution.triggerDetails}
				<DefinitionItem label="Details">{attribution.triggerDetails}</DefinitionItem>
			{/if}
		</DefinitionList>
	</div>
{/if}
