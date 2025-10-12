<script lang="ts">
	import { onMount } from 'svelte';
	import { getProfileContext } from '../../src/components/Profile/context.js';

	let { editMode = true } = $props<{ editMode?: boolean }>();

	const { updateState } = getProfileContext();

	onMount(() => {
		updateState({ editMode });
	});
</script>
