<script lang="ts">
	import { Search, type SearchContext } from '@equaltoai/greater-components-social';

	let { context = $bindable<SearchContext | null>(null) } = $props();

	$effect(() => {
		context = Search.getSearchContext();
	});
</script>
