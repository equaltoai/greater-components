<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import Stats from '../../../src/components/ArtistProfile/Stats.svelte';
	import { ARTIST_PROFILE_CONTEXT_KEY } from '../../../src/components/ArtistProfile/context.js';
	import type { ArtistProfileContext } from '../../../src/components/ArtistProfile/context.js';

	interface Props {
		context: ArtistProfileContext;
		componentProps?: Record<string, unknown>;
	}

	let props: Props = $props();

	setContext(
		ARTIST_PROFILE_CONTEXT_KEY,
		untrack(() => props.context)
	);
</script>

<Stats {...props.componentProps} />
