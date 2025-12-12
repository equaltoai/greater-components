<script lang="ts">
	import Menu, { type MenuItemData } from '../../src/components/Menu.svelte';
	import type MenuComponent from '../../src/components/Menu.svelte';
	import type { ComponentProps } from 'svelte';

	let { props = {} as ComponentProps<typeof MenuComponent> } = $props<{
		props?: ComponentProps<typeof MenuComponent>;
	}>();

	const defaultItems: MenuItemData[] = [
		{ id: 'profile', label: 'Profile' },
		{ id: 'admin', label: 'Admin', disabled: true },
		{ id: 'settings', label: 'Settings' },
	];

	const items = $derived(props.items ?? defaultItems);
	const triggerSnippet = $derived(props.trigger ?? Trigger);
	const finalProps = $derived({
		...props,
		items,
		trigger: triggerSnippet,
	});
</script>

{#snippet Trigger({ open, toggle })}
	<button data-testid="menu-trigger" aria-expanded={open} onclick={toggle} type="button">
		{open ? 'Close menu' : 'Open menu'}
	</button>
{/snippet}

<Menu {...finalProps} />
