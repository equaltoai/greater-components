<!--
  Search.Filters - Search Type Filters
  
  Filter tabs for switching between actors, notes, tags, and all results.
  
  @component
-->
<script lang="ts">
	import { getSearchContext } from './context.js';
	import type { SearchResultType } from './context.js';

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

<style>
	.search-filters {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		overflow-x: auto;
	}

	.search-filters__tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		background: transparent;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-secondary, #536471);
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s;
	}

	.search-filters__tab:hover {
		background: var(--bg-hover, #eff3f4);
		color: var(--text-primary, #0f1419);
	}

	.search-filters__tab--active {
		background: var(
			--primary-color,
			var(--gr-semantic-action-primary-default, #2563eb)
		);
		border-color: var(
			--primary-color,
			var(--gr-semantic-action-primary-default, #2563eb)
		);
		color: var(--gr-semantic-background-primary, #ffffff);
	}

	.search-filters__count {
		padding: 0.125rem 0.5rem;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 9999px;
		font-size: 0.75rem;
	}
</style>
