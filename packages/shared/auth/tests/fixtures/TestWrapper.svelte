<script lang="ts">
	import Root from '../../src/Root.svelte';
	
	let { component: Component, handlers = {}, initialState = {}, ...props } = $props();
</script>

<Root {handlers} {initialState}>
	<Component {...props} />
</Root>
