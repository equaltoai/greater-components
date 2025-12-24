<script lang="ts">
	import * as Menu from '../../src/components/Menu';
	import MockIcon from '../fixtures/MockIcon.svelte';

	interface Props {
		onSelect?: (value: string) => void;
	}

	let { onSelect }: Props = $props();
</script>

<Menu.Root>
	<Menu.Trigger data-testid="menu-trigger">Open Menu</Menu.Trigger>
	<Menu.Content data-testid="menu-content">
		{#snippet iconSnippet()}
			<MockIcon />
		{/snippet}
		<Menu.Item icon={iconSnippet} onclick={() => onSelect?.('icon-item')}>Item with Icon</Menu.Item>
		<Menu.Item label="Label Item" onclick={() => onSelect?.('label-item')} />
		<Menu.Item shortcut="⌘K" onclick={() => onSelect?.('shortcut-item')}
			>Item with Shortcut</Menu.Item
		>
		<Menu.Item disabled onclick={() => onSelect?.('disabled-item')}>Disabled Item</Menu.Item>
	</Menu.Content>
</Menu.Root>
