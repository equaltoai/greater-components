<script lang="ts">
	import SimpleMenu, { type MenuItem } from '../../src/components/SimpleMenu.svelte';
	import Button from '../../src/components/Button.svelte';

	let { items, onSelect, open = false } = $props();

	function handleSelect(item: MenuItem) {
		onSelect?.(item);
	}
</script>

<SimpleMenu {items} onItemSelect={handleSelect} {open}>
	{#snippet trigger({ open, toggle })}
		<Button onclick={toggle} data-testid="simple-menu-trigger">
			{open ? 'Close' : 'Open'}
		</Button>
	{/snippet}
</SimpleMenu>
