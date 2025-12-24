<script lang="ts">
	import { setContext } from 'svelte';
	import Contributors from '../../../../src/components/Community/Collaboration/Contributors.svelte';
	import { COLLABORATION_CONTEXT_KEY } from '../../../../src/components/Community/Collaboration/context.js';
	import type { CollaborationContext } from '../../../../src/components/Community/Collaboration/context.js';

	interface Props {
		context: CollaborationContext;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentProps?: any;
	}

	let { context, componentProps = {} }: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	setContext(COLLABORATION_CONTEXT_KEY, context);
</script>

<Contributors {...componentProps} />
