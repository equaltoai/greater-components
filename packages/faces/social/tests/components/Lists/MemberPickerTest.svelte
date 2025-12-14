<script lang="ts">
	import Root from '../../../src/components/Lists/Root.svelte';
	import MemberPicker from '../../../src/components/Lists/MemberPicker.svelte';
	import type {
		ListsHandlers,
		ListData,
		ListMember,
	} from '../../../src/components/Lists/context.js';

	interface Props {
		handlers?: ListsHandlers;
		selectedList?: (ListData & { members?: ListMember[] }) | null;
	}

	let { handlers = {}, selectedList = null }: Props = $props();

	// Construct initial state
	let initialState = $derived({
		selectedList: selectedList as unknown as ListData,
		members: selectedList?.members || [],
	});
</script>

<Root {handlers} {initialState} autoFetch={false}>
	<MemberPicker />
</Root>
