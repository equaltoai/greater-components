<script lang="ts">
	import { Search, type SearchContext } from '@equaltoai/greater-components-social';

	let { context = $bindable<SearchContext | null>(null) } = $props();

	if (context === null) {
		context = Search.getSearchContext();
	}

	void context;
</script>
