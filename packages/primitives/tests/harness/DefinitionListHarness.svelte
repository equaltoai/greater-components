<script lang="ts">
	import DefinitionList from '../../src/components/DefinitionList.svelte';
	import DefinitionItem from '../../src/components/DefinitionItem.svelte';
	import type { ComponentProps } from 'svelte';

	type DefinitionListProps = ComponentProps<typeof DefinitionList>;
	type DefinitionItemProps = ComponentProps<typeof DefinitionItem>;

	interface Item {
		label: string;
		value: string;
		actions?: boolean;
		monospace?: boolean;
		wrap?: boolean;
	}

	let {
		listProps = {},
		itemProps = {},
		items = [
			{ label: 'API URL', value: 'https://api.example.com', actions: true, monospace: true },
			{ label: 'Stage', value: 'staging', actions: false },
		],
	} = $props<{
		listProps?: Partial<DefinitionListProps>;
		itemProps?: Partial<DefinitionItemProps>;
		items?: Item[];
	}>();
</script>

<DefinitionList {...listProps}>
	{#each items as item, index (item.label)}
		<DefinitionItem
			label={item.label}
			monospace={item.monospace}
			wrap={item.wrap}
			{...itemProps}
		>
			{item.value}

			{#snippet actions()}
				{#if item.actions}
					<button type="button" data-testid={`action-${index}`}>
						Action
					</button>
				{/if}
			{/snippet}
		</DefinitionItem>
	{/each}
</DefinitionList>

