<script lang="ts">
	import Root from '../../../src/components/Lists/Root.svelte';
	import Editor from '../../../src/components/Lists/Editor.svelte';
	import type { ListsHandlers, ListsState } from '../../../src/components/Lists/context.js';

	interface Props {
		handlers?: ListsHandlers;
		initialState?: Partial<ListsState>;
	}

	let { handlers = {}, initialState = {} }: Props = $props();
</script>

<Root {handlers} {initialState} autoFetch={false}>
	<Editor />
</Root>
