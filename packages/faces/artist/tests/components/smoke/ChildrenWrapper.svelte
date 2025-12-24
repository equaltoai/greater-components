<script lang="ts">
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { Component, props = {} }: Props = $props();
</script>

<Component {...props}>
	<div data-testid="child"></div>
</Component>
