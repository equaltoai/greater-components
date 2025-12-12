<script lang="ts">
	import * as Menu from '../../src/components/Menu';
</script>

<Menu.Root open={true}>
	<Menu.Trigger>Open</Menu.Trigger>
	<Menu.Content>
		<Menu.Header class="custom-header">My Header</Menu.Header>
		<Menu.Item>Item</Menu.Item>
	</Menu.Content>
</Menu.Root>
