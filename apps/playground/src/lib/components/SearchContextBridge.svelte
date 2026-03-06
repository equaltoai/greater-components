<script lang="ts">
	import { Search, type SearchContext } from '@equaltoai/greater-components-social';

	let { context = $bindable<SearchContext | null>(Search.getSearchContext()) } = $props();
	void context;
</script>
