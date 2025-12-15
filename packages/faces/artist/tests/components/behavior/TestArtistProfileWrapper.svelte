<script lang="ts">
	import {
		createArtistProfileContext,
		type ArtistData,
		type ProfileHandlers,
	} from '../../../src/components/ArtistProfile/context.js';
	import type { Component as SvelteComponent } from 'svelte';

	interface Props {
		artist: ArtistData;
		isOwnProfile?: boolean;
		handlers?: ProfileHandlers;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let { artist, isOwnProfile = false, handlers = {}, Component, props = {} }: Props = $props();

	createArtistProfileContext(
		() => artist,
		() => isOwnProfile,
		{},
		() => handlers
	);
</script>

<Component {...props} />
