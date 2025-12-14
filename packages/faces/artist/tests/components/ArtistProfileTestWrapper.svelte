<script lang="ts">
	import { setContext } from 'svelte';
	import {
		ARTIST_PROFILE_CONTEXT_KEY,
		DEFAULT_PROFILE_CONFIG,
		type ArtistData,
	} from '../../src/components/ArtistProfile/context.js';
	import type { Snippet } from 'svelte';

	interface Props {
		artist: ArtistData;
		isOwnProfile?: boolean;
		isEditing?: boolean;
		children: Snippet;
	}

	let { artist, isOwnProfile = false, isEditing = false, children }: Props = $props();

	// Manual context creation for testing to support isEditing override
	setContext(ARTIST_PROFILE_CONTEXT_KEY, {
		artist,
		isOwnProfile,
		config: DEFAULT_PROFILE_CONFIG,
		handlers: {},
		layout: 'gallery',
		isEditing,
		isFollowing: false,
		professionalMode: false,
	});
</script>

<div class="test-wrapper">
	{@render children()}
</div>
