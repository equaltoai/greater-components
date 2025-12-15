<script lang="ts">
	import { createDiscoveryContext } from '../../../src/components/Discovery/context';
	import type { DiscoveryStore } from '../../../src/stores/types';
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		store: DiscoveryStore;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { store, Component, props = {} }: Props = $props();

	createDiscoveryContext(() => store);
</script>

<Component {...props} />
