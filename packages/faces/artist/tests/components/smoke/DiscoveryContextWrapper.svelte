<script lang="ts">
	import { createDiscoveryContext } from '../../../src/components/Discovery/context.js';
	import { createDiscoveryStore } from '../../../src/stores/discoveryStore.js';
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { Component, props = {} }: Props = $props();

	const store = createDiscoveryStore();
	createDiscoveryContext(store);
</script>

<Component {...props} />
