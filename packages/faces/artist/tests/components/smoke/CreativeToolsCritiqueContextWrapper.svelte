<script lang="ts">
	import { createCritiqueContext } from '../../../src/components/CreativeTools/CritiqueMode/context.js';
	import type { CritiqueSubmission } from '../../../src/types/community.js';
	import type { ArtworkData } from '../../../src/components/Artwork/context.js';
	import type { Component as SvelteComponent } from 'svelte';
	import { untrack } from 'svelte';

	interface Props {
		submission: CritiqueSubmission;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { submission, Component, props = {} }: Props = $props();

	createCritiqueContext(
		untrack(() => submission.artwork as unknown as ArtworkData),
		untrack(() => ({}))
	);
</script>

<Component {...props} />
