<script lang="ts">
	import * as Menu from '../../src/components/Menu/index.js';
	let { disabled = false, showNested = false, ...props } = $props();
</script>

<Menu.Root>
	<Menu.Trigger {disabled} {...props}>
		{#if showNested}
			<div data-testid="nested">
				<button>Nested Button</button>
			</div>
		{:else}
			<span data-testid="trigger-text">Open Menu</span>
		{/if}
	</Menu.Trigger>
	<Menu.Content>
		<Menu.Item onclick={() => {}}>Item 1</Menu.Item>
		<Menu.Item disabled>Item 2</Menu.Item>
	</Menu.Content>
</Menu.Root>
