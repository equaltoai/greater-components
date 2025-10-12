<script lang="ts">
	import { onMount } from 'svelte';
	import { getProfileContext } from '../../src/components/Profile/context.js';

	let { activeTab } = $props<{ activeTab: string }>();

	const { updateState } = getProfileContext();

	onMount(() => {
		updateState({ activeTab });
	});
</script>
