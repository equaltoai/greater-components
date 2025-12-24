<script lang="ts">
	import { createWIPContext } from '../../../src/components/CreativeTools/WorkInProgress/context.js';
	import type { WIPThreadData } from '../../../src/types/creative-tools.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		thread: WIPThreadData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { thread, Component, props = {} }: Props = $props();

	createWIPContext(untrack(() => thread));
</script>

<Component {...props} />
