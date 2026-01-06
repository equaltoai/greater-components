<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import SearchContextBridge from '$lib/components/SearchContextBridge.svelte';
	import { Button, Skeleton } from '@equaltoai/greater-components-primitives';
	import { Search, StatusCard } from '@equaltoai/greater-components-social';
	import type { DemoPageData } from '$lib/types/demo';
	import type { Status } from '$lib/types/fediverse';
	import { runDemoSearch } from '$lib/data/fediverse';
	import { loadPersistedState, persistState } from '$lib/stores/storage';

	let { data }: { data: DemoPageData } = $props();

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	const recentsKey = 'search-demo-recents';
	const statusSkeletons = Array.from({ length: 3 }, (_, index) => index);

	let searchContext = $state<Search.SearchContext | null>(null);
	let searchLoading = $state(false);
	let searchError = $state<string | null>(null);
	let lastQuery = $state('');
	let lastResults = $state<Search.SearchResults | null>(null);
	let statusResults = $state<Status[]>([]);
	let recentSearches = $state<string[]>(loadPersistedState(recentsKey, []));

	function persistRecents(list: string[]) {
		persistState(recentsKey, list);
	}

	function updateRecents(query: string) {
		const trimmed = query.trim();
		if (!trimmed) return;
		recentSearches = [trimmed, ...recentSearches.filter((entry) => entry !== trimmed)].slice(0, 6);
		persistRecents(recentSearches);
	}

	function clearRecents() {
		recentSearches = [];
		persistRecents([]);
		searchContext?.updateState({ recentSearches: [] });
	}

	function restoreRecent(query: string) {
		if (!searchContext) return;
		searchContext.updateState({ query });
		searchContext.search(query);
	}

	async function retryLast() {
		if (!searchContext || !lastQuery) return;
		searchContext.search(lastQuery);
	}

	function noteToStatus(note: Search.SearchNote): Status {
		return {
			id: `search-note-${note.id}`,
			uri: `https://equalto.social/@${note.author.username}/${note.id}`,
			url: `https://equalto.social/@${note.author.username}/${note.id}`,
			account: {
				id: note.author.id,
				username: note.author.username,
				acct: `${note.author.username}@equalto.social`,
				displayName: note.author.displayName,
				avatar: note.author.avatar ?? 'https://placehold.co/64x64/0f172a/ffffff?text=AP',
				url: `https://equalto.social/@${note.author.username}`,
				note: note.author.bio ? `<p>${note.author.bio}</p>` : undefined,
				followersCount: note.likesCount ?? 0,
				followingCount: note.repliesCount ?? 0,
				statusesCount: note.reblogsCount ?? 0,
				verified: false,
				locked: false,
				bot: false,
				createdAt: note.createdAt,
			},
			content: note.content,
			createdAt: note.createdAt,
			visibility: 'public',
			repliesCount: note.repliesCount ?? 0,
			reblogsCount: note.reblogsCount ?? 0,
			favouritesCount: note.likesCount ?? 0,
			mediaAttachments: [],
			mentions: [],
			tags: [],
		} satisfies Status;
	}

	const handlers: Search.SearchHandlers = {
		onSearch: async (options) => {
			searchLoading = true;
			searchError = null;
			lastQuery = options.query;
			try {
				await wait(options.semantic ? 620 : 420);
				if (options.query.toLowerCase().includes('error')) {
					throw new Error('Lesser API temporarily unavailable. Please retry.');
				}
				const results = runDemoSearch({
					query: options.query,
					semantic: options.semantic,
					following: options.following,
					type: options.type,
				});
				lastResults = results;
				statusResults = results.notes.map(noteToStatus);
				updateRecents(options.query);
				return results;
			} catch (error) {
				searchError = error instanceof Error ? error.message : 'Search failed';
				throw error;
			} finally {
				searchLoading = false;
			}
		},
	};
</script>

<Search.Root {handlers} initialQuery="compose dock">
	<SearchContextBridge bind:context={searchContext} />
	<DemoPage eyebrow="Search" title={data.metadata.title} description={data.metadata.description}>
		<section class="search-section">
			<header>
				<p class="section-eyebrow">Unified search</p>
				<h2>Posts, accounts, hashtags</h2>
				<p class="muted">
					Semantic mode flips the Lesser API flag; filter chips scope results without refetching
					clients.
				</p>
			</header>
			<div class="search-surface">
				<Search.Bar placeholder="Search posts, people, tags…" autofocus />
				<Button
					size="sm"
					variant="outline"
					onclick={() => searchContext?.search()}
					disabled={searchLoading}
				>
					{searchLoading ? 'Searching…' : 'Run search'}
				</Button>
			</div>
			<Search.Filters />
			{#if searchError}
				<div class="state-card" role="alert">
					<p>{searchError}</p>
					<Button size="sm" onclick={retryLast}>Retry search</Button>
				</div>
			{/if}
		</section>

		<section class="search-section search-layout">
			<div class="results-column" aria-live="polite">
				<header class="results-header">
					<h3>Posts</h3>
					<p class="muted">StatusCard renders note results with optimistic counts.</p>
				</header>
				{#if searchLoading && statusResults.length === 0}
					<div class="status-skeletons">
						{#each statusSkeletons as placeholder (placeholder)}
							<Skeleton variant="rounded" data-index={placeholder} />
						{/each}
					</div>
				{:else if !searchLoading && statusResults.length === 0}
					<div class="state-card">
						<p>No posts match this query yet.</p>
					</div>
				{:else}
					<div class="status-stack">
						{#each statusResults as status (status.id)}
							<StatusCard {status} density="comfortable" />
						{/each}
					</div>
				{/if}
			</div>
			<section class="side-column" aria-label="Search sidebar">
				<section class="side-card">
					<header>
						<h3>Recent searches</h3>
						<Button
							size="sm"
							variant="ghost"
							onclick={clearRecents}
							disabled={recentSearches.length === 0}
						>
							Clear recents
						</Button>
					</header>
					{#if recentSearches.length === 0}
						<p class="muted">Search to build this list. It stores locally only.</p>
					{:else}
						<ul>
							{#each recentSearches as query (query)}
								<li>
									<button onclick={() => restoreRecent(query)}>{query}</button>
								</li>
							{/each}
						</ul>
					{/if}
				</section>

				<section class="side-card">
					<h3>People</h3>
					{#if searchLoading && !lastResults}
						<Skeleton variant="rounded" height="xl" />
					{:else if lastResults?.actors.length}
						<ul class="actor-list">
							{#each lastResults.actors as actor (actor.id)}
								<li>
									<div>
										<strong>{actor.displayName}</strong>
										<p class="muted">@{actor.username}</p>
									</div>
									<Button size="sm" variant={actor.isFollowing ? 'outline' : 'solid'}>
										{actor.isFollowing ? 'Following' : 'Follow'}
									</Button>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="muted">Run a search to populate accounts.</p>
					{/if}
				</section>

				<section class="side-card">
					<h3>Hashtags</h3>
					{#if searchLoading && !lastResults}
						<Skeleton variant="rounded" height="lg" />
					{:else if lastResults?.tags.length}
						<div class="tag-grid">
							{#each lastResults.tags as tag (tag.name)}
								<span class:trending={tag.trending}>#{tag.name}</span>
							{/each}
						</div>
					{:else}
						<p class="muted">No tags yet.</p>
					{/if}
				</section>
			</section>
		</section>
	</DemoPage>
</Search.Root>

<style>
	.search-section {
		border: 1px solid var(--gr-semantic-border-default);
		border-radius: var(--gr-radii-2xl);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--gr-semantic-background-primary);
	}

	.search-surface {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.search-section :global(.search-bar) {
		flex: 1;
	}

	.search-layout {
		gap: 1.5rem;
	}

	.search-layout {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
	}

	.results-column,
	.side-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.status-skeletons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.side-card {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--gr-semantic-background-secondary);
	}

	.side-card header,
	.side-card ul {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.side-card ul {
		flex-direction: column;
		gap: 0.5rem;
		align-items: stretch;
	}

	.side-card li {
		list-style: none;
	}

	.side-card button {
		width: 100%;
		text-align: left;
		border: 1px dashed var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-lg);
		padding: 0.5rem 0.75rem;
		background: transparent;
		cursor: pointer;
	}

	.actor-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.actor-list li {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.tag-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag-grid span {
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		background: var(--gr-semantic-background-primary);
		border: 1px solid var(--gr-semantic-border-subtle);
		font-size: var(--gr-typography-fontSize-sm);
	}

	.tag-grid span.trending {
		border-color: var(--gr-semantic-action-primary-default);
		color: var(--gr-semantic-action-primary-default);
	}

	.state-card {
		border: 1px solid var(--gr-semantic-border-subtle);
		border-radius: var(--gr-radii-xl);
		padding: 1rem;
		background: var(--gr-semantic-background-secondary);
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		align-items: center;
	}

	.muted {
		color: var(--gr-semantic-foreground-tertiary);
		margin: 0;
	}

	.section-eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.18em;
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-semantic-foreground-tertiary);
		margin: 0;
	}

	@media (max-width: 960px) {
		.search-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.search-section {
			padding: 1.25rem;
		}
	}
</style>
