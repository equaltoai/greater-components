<script lang="ts">
	import FilteredContent from '../../../src/components/Filters/FilteredContent.svelte';
	import type { FilterContext } from '../../../src/components/Filters/context';

	let { content, context }: { content: string; context: FilterContext } = $props();
</script>

<FilteredContent {content} {context}>
	<p>{content}</p>
</FilteredContent>
