<!--
  Search.Filters - Search Type Filters
  
  Filter tabs for switching between actors, notes, tags, and all results.
  
  @component
-->
<script lang="ts">
	import { getSearchContext } from './context.svelte.js';
	import type { SearchResultType } from './context.svelte.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: searchState, setType } = getSearchContext();

	const filters: Array<{ id: SearchResultType; label: string; getCount: () => number }> = [
		{ id: 'all', label: 'All', getCount: () => searchState.results.total },
		{ id: 'actors', label: 'People', getCount: () => searchState.results.actors.length },
		{ id: 'notes', label: 'Posts', getCount: () => searchState.results.notes.length },
		{ id: 'tags', label: 'Tags', getCount: () => searchState.results.tags.length },
	];
</script>

<div class={`search-filters ${className}`}>
	{#each filters as filter (filter.id)}
		<button
			class="search-filters__tab"
			class:search-filters__tab--active={searchState.type === filter.id}
			onclick={() => setType(filter.id)}
		>
			<span>{filter.label}</span>
			{#if filter.getCount() > 0}
				<span class="search-filters__count">{filter.getCount()}</span>
			{/if}
		</button>
	{/each}
</div>
