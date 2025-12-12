<script lang="ts">
	import { createSeveredRelationshipsContext } from '../src/SeveredRelationships/context.js';
	import RecoveryPanel from '../src/SeveredRelationships/RecoveryPanel.svelte';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

	let {
		adapter,
		severanceId,
		class: className,
	}: {
		adapter: LesserGraphQLAdapter;
		severanceId: string;
		class?: string;
	} = $props();

	import { untrack } from 'svelte';
	createSeveredRelationshipsContext(untrack(() => ({ adapter })));
</script>

<RecoveryPanel {severanceId} class={className} />
