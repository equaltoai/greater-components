<script lang="ts">
	import ListComponent from '../../src/components/List.svelte';
	import ListItem from '../../src/components/ListItem.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		listProps = {},
		itemProps = {},
		items = ['Item 1'],
	} = $props<{
		listProps?: Partial<ComponentProps<typeof ListComponent>>;
		itemProps?: Partial<ComponentProps<typeof ListItem>>;
		items?: string[];
	}>();
</script>

<ListComponent {...listProps}>
	{#each items as item (item)}
		<ListItem {...itemProps}>{item}</ListItem>
	{/each}
</ListComponent>
