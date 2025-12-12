<script lang="ts">
	import * as Menu from '../../src/components/Menu';
	
	interface Props {
		onSelect?: (value: string) => void;
	}

	let { onSelect }: Props = $props();
</script>

<Menu.Root>
	<Menu.Trigger data-testid="menu-trigger">
		Open Menu
	</Menu.Trigger>
	<Menu.Content data-testid="menu-content">
		<Menu.Item onclick={() => onSelect?.('profile')}>Profile</Menu.Item>
		<Menu.Item onclick={() => onSelect?.('settings')}>Settings</Menu.Item>
		<Menu.Separator />
		<Menu.Item disabled onclick={() => onSelect?.('disabled')}>Disabled</Menu.Item>
	</Menu.Content>
</Menu.Root>
