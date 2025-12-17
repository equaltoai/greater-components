<script lang="ts">
	import { setContext } from 'svelte';
	import {
		ARTIST_PROFILE_CONTEXT_KEY,
		DEFAULT_PROFILE_CONFIG,
		type ArtistData,
		type ProfileHandlers,
	} from '../../src/components/ArtistProfile/context.js';
	import type { Snippet } from 'svelte';

	interface Props {
		artist: ArtistData;
		isOwnProfile?: boolean;
		isEditing?: boolean;
		handlers?: ProfileHandlers;
		children: Snippet;
	}

	let {
		artist,
		isOwnProfile = false,
		isEditing = false,
		handlers = {},
		children,
	}: Props = $props();

	// Manual context creation for testing to support isEditing override
	setContext(ARTIST_PROFILE_CONTEXT_KEY, {
		get artist() {
			return artist;
		},
		get isOwnProfile() {
			return isOwnProfile;
		},
		config: DEFAULT_PROFILE_CONFIG,
		get handlers() {
			return handlers;
		},
		layout: 'gallery',
		get isEditing() {
			return isEditing;
		},
		set isEditing(value) {
			isEditing = value;
		},
		isFollowing: false,
		professionalMode: false,
	});
</script>

<div class="test-wrapper">
	{@render children()}
</div>
