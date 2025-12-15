<script lang="ts">
	import WIPTestWrapper from '../WIPTestWrapper.svelte';
	import Compare from '../../../src/components/CreativeTools/WorkInProgress/Compare.svelte';
	import VersionCard from '../../../src/components/CreativeTools/WorkInProgress/VersionCard.svelte';
	import type { WIPThreadData, WIPHandlers } from '../../../src/types/creative-tools.js';

	interface Props {
		thread: WIPThreadData;
		handlers?: WIPHandlers;
		component: 'Compare' | 'VersionCard';
	}

	let { thread, handlers = {}, component }: Props = $props();
</script>

<WIPTestWrapper
	{thread}
	{handlers}
	initialState={{ comparison: { isActive: true, mode: 'side-by-side', versionA: 0, versionB: 1 } }}
>
	{#if component === 'Compare'}
		<Compare />
	{:else if component === 'VersionCard'}
		<VersionCard />
	{/if}
</WIPTestWrapper>
