<script lang="ts">
	import { createCollaborationContext } from '../../../src/components/Community/Collaboration/context.js';
	import type { CollaborationData } from '../../../src/types/community.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		collaboration: CollaborationData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { collaboration, Component, props = {} }: Props = $props();

	createCollaborationContext(untrack(() => collaboration));
</script>

<Component {...props} />
