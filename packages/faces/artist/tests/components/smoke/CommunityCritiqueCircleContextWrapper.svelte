<script lang="ts">
	import { createCritiqueCircleContext } from '../../../src/components/Community/CritiqueCircle/context.js';
	import type { CritiqueCircleData } from '../../../src/types/community.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		circle: CritiqueCircleData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { circle, Component, props = {} }: Props = $props();

	createCritiqueCircleContext(untrack(() => circle));
</script>

<Component {...props} />
