<script lang="ts">
	import { setContext } from 'svelte';
	import Name from '../../../src/components/ArtistProfile/Name.svelte';
	import { ARTIST_PROFILE_CONTEXT_KEY } from '../../../src/components/ArtistProfile/context.js';
	import type { ArtistProfileContext } from '../../../src/components/ArtistProfile/context.js';

	interface Props {
		context: ArtistProfileContext;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentProps?: any;
	}

	let { context, componentProps = {} }: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	setContext(ARTIST_PROFILE_CONTEXT_KEY, context);
</script>

<Name {...componentProps} />
