<!--
  Search.Results - Search Results Container
  
  Displays search results with loading and empty states.
  
  @component
-->
<script lang="ts">
	import { getSearchContext } from './context.js';
	import ActorResult from './ActorResult.svelte';
	import NoteResult from './NoteResult.svelte';
	import TagResult from './TagResult.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state } = getSearchContext();

	const hasResults = $derived(state.results.total > 0);
	const showActors = $derived(state.type === 'all' || state.type === 'actors');
	const showNotes = $derived(state.type === 'all' || state.type === 'notes');
	const showTags = $derived(state.type === 'all' || state.type === 'tags');
</script>

<div class="search-results {className}">
	{#if state.loading}
		<div class="search-results__loading">
			<div class="search-results__spinner"></div>
			<p>Searching{state.semantic ? ' with AI' : ''}...</p>
		</div>
	{:else if state.error}
		<div class="search-results__error">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
				/>
			</svg>
			<p>{state.error}</p>
		</div>
	{:else if !hasResults && state.query}
		<div class="search-results__empty">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
				/>
			</svg>
			<h3>No results found</h3>
			<p>Try different keywords or check your spelling</p>
		</div>
	{:else if hasResults}
		{#if showActors && state.results.actors.length > 0}
			<section class="search-results__section">
				<h3 class="search-results__heading">People</h3>
				<div class="search-results__list">
					{#each state.results.actors as actor}
						<ActorResult {actor} />
					{/each}
				</div>
			</section>
		{/if}

		{#if showNotes && state.results.notes.length > 0}
			<section class="search-results__section">
				<h3 class="search-results__heading">Posts</h3>
				<div class="search-results__list">
					{#each state.results.notes as note}
						<NoteResult {note} />
					{/each}
				</div>
			</section>
		{/if}

		{#if showTags && state.results.tags.length > 0}
			<section class="search-results__section">
				<h3 class="search-results__heading">Tags</h3>
				<div class="search-results__tags">
					{#each state.results.tags as tag}
						<TagResult {tag} />
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>

<style>
	.search-results {
		width: 100%;
	}

	.search-results__loading,
	.search-results__error,
	.search-results__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
	}

	.search-results__loading svg,
	.search-results__error svg,
	.search-results__empty svg {
		width: 3rem;
		height: 3rem;
		color: var(--text-secondary, #536471);
	}

	.search-results__spinner {
		width: 3rem;
		height: 3rem;
		border: 3px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.search-results__loading p,
	.search-results__error p {
		margin: 0;
		color: var(--text-secondary, #536471);
	}

	.search-results__empty h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.search-results__empty p {
		margin: 0;
		color: var(--text-secondary, #536471);
	}

	.search-results__section {
		padding: 1.5rem 0;
		border-top: 1px solid var(--border-color, #e1e8ed);
	}

	.search-results__section:first-child {
		border-top: none;
	}

	.search-results__heading {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.search-results__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.search-results__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
</style>
