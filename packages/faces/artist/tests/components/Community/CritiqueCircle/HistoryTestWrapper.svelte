<script lang="ts">
	import { setContext } from 'svelte';
	import History from '../../../../src/components/Community/CritiqueCircle/History.svelte';
	import { CRITIQUE_CIRCLE_CONTEXT_KEY } from '../../../../src/components/Community/CritiqueCircle/context.js';
	import type { CritiqueCircleContext } from '../../../../src/components/Community/CritiqueCircle/context.js';

	interface Props {
		context: CritiqueCircleContext;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentProps?: any;
	}

	let { context, componentProps = {} }: Props = $props();

	// eslint-disable-next-line svelte/valid-compile
	setContext(CRITIQUE_CIRCLE_CONTEXT_KEY, context);
</script>

<History {...componentProps} />
