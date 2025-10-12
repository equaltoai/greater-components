<script lang="ts">
	import { onMount } from 'svelte';
	import { getProfileContext } from '../../src/components/Profile/context.js';
	import type { ProfileTab } from '../../src/components/Profile/context.js';

	let { tabs = [] } = $props<{ tabs?: ProfileTab[] }>();

	const { updateState } = getProfileContext();

	onMount(() => {
		updateState({ tabs });
	});
</script>
