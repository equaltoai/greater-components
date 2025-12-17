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
		config?: Record<string, unknown>;
		handlers?: ProfileHandlers;
		Component: SvelteComponent<Record<string, unknown>>;
		props?: Record<string, unknown>;
	}

	let {
		artist,
		isOwnProfile = false,
		config = {},
		handlers = {},
		Component,
		props = {},
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	createArtistProfileContext(
		() => artist,
		() => isOwnProfile,
		config,
		() => handlers
	);
</script>

<Component {...props} />
