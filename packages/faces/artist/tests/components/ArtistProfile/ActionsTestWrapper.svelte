<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import Actions from '../../../src/components/ArtistProfile/Actions.svelte';
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

<Actions {...props.componentProps} />
