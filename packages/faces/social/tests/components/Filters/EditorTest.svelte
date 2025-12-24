<script lang="ts">
	import Root from '../../../src/components/Filters/Root.svelte';
	import Editor from '../../../src/components/Filters/Editor.svelte';
	import type { FiltersHandlers, FiltersState } from '../../../src/components/Filters/context.js';

	interface Props {
		handlers?: FiltersHandlers;
		initialState?: Partial<FiltersState>;
	}

	let { handlers = {}, initialState = {} }: Props = $props();
</script>

<Root {handlers} {initialState} autoFetch={false}>
	<Editor />
</Root>
