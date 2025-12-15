<script lang="ts">
	import { untrack } from 'svelte';
	import {
		createArtistProfileContext,
		type ArtistData,
	} from '../../../src/components/ArtistProfile/context.js';
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		artist: ArtistData;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { artist, Component, props = {} }: Props = $props();

	createArtistProfileContext(untrack(() => artist));
</script>

<Component {...props} />
