<script lang="ts">
	import DemoPage from '$lib/components/DemoPage.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	import EventsTable from '$lib/components/EventsTable.svelte';
	import AccessibilityScorecard from '$lib/components/AccessibilityScorecard.svelte';
	import CodeExample from '$lib/components/CodeExample.svelte';

	const rootProps = [
		{
			name: 'handlers',
			type: 'SearchHandlers',
			required: true,
			description: 'Async hooks for onSearch / onRefine / onClear that power remote requests.',
		},
		{
			name: 'initialQuery',
			type: 'string',
			description: 'Optional query seeded into Search.Bar on mount.',
		},
		{
			name: 'initialState',
			type: 'Partial<SearchState>',
			description: 'Hydrates saved filters/result counts (used in server-driven pages).',
		},
	];

	const handlerEvents = [
		{
			name: 'onSearch',
			payload: 'SearchOptions',
			description: 'Triggered when users run a query via Search.Bar or filters.',
		},
		{
			name: 'onSemanticToggle',
			payload: 'boolean',
			description: 'Optional hook to persist semantic mode preference.',
		},
		{
			name: 'onFilterChange',
			payload: "{ type?: 'notes' | 'accounts' | 'tags'; following?: boolean }",
			description: 'Sync filter toggles without triggering a search.',
		},
	];

	const packages = [
		{
			name: '@equaltoai/greater-components-fediverse/Search',
			detail: 'Compound components (Root, Bar, Filters, Results) plus context helpers.',
		},
		{
			name: '@equaltoai/greater-components-primitives',
			detail: 'Button + Skeleton components used for loading states and CTA controls.',
		},
		{
			name: 'apps/playground/src/lib/stores/storage.ts',
			detail: 'Recent search persistence and recovery utilities.',
		},
	];

	const snippet = `<script lang="ts">
  import { Search } from '@equaltoai/greater-components-fediverse';
  import { loadPersistedState, persistState } from '$lib/stores/storage';
  import { runDemoSearch } from '$lib/data/fediverse';

  const recentsKey = 'search-demo-recents';
  let recentSearches = $state(loadPersistedState(recentsKey, []));

  const handlers: Search.SearchHandlers = {
    onSearch: async (options) => {
      const results = runDemoSearch(options);
      recentSearches = [options.query, ...recentSearches.filter((entry) => entry !== options.query)].slice(0, 6);
      persistState(recentsKey, recentSearches);
      return results;
    }
  };
</${'script'}>

<Search.Root {handlers} initialQuery="compose dock">
  <Search.Bar placeholder="Search posts, people, tags…" />
  <Search.Filters />
  <Search.Results />
</Search.Root>`;

	const accessibility = {
		wcagLevel: 'AA',
		keyboardNav: true,
		screenReader: true,
		colorContrast: true,
		focusManagement: true,
		ariaSupport: true,
		reducedMotion: true,
		notes: [
			'Results list uses aria-live="polite" so new batches announce themselves.',
			'Error messages render inside role="alert" to surface immediate feedback.',
			'Recent search buttons are rendered as <button> for keyboard activation.',
			'Search.Bar exposes `placeholder` and autofocus plus accessible semantics.',
		],
		axeScore: 100,
	};

	const performance = [
		'Handlers simulate network latency (420-620 ms) to keep skeleton states visible.',
		'SearchContext caches last successful payload so retries reuse the same filters.',
		'Recent search list is capped to six entries and stored via persistState.',
		'StatusCard rendering limited to first 5 demo hits to keep FPS high.',
	];

	const testing = [
		{
			label: 'packages/testing/tests/demo/search.spec.ts',
			detail: 'Playwright coverage for search success + error flows, including aria-live regions.',
		},
		{
			label: 'apps/playground/src/routes/search/+page.svelte',
			detail: 'Reference implementation for handlers and context bridging.',
		},
	];
</script>

<svelte:head>
	<title>Search Demo Documentation - Greater Components</title>
	<meta
		name="description"
		content="Usage notes for the Search compound component and recents persistence powering the /search demo route."
	/>
</svelte:head>

<DemoPage
	eyebrow="Demo Suite"
	title="Search application"
	description="Unified post/account/tag search built on @equaltoai/greater-components-fediverse/Search with semantic toggle support."
>
	<section>
		<h2>Packages</h2>
		<ul>
			{#each packages as pkg (pkg.name)}
				<li>
					<strong><code>{pkg.name}</code></strong> — {pkg.detail}
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Search.Root props</h2>
		<PropsTable props={rootProps} />
	</section>

	<section>
		<h2>Handler callbacks</h2>
		<EventsTable events={handlerEvents} />
	</section>

	<section>
		<h2>Usage snippet</h2>
		<CodeExample language="svelte" code={snippet} />
	</section>

	<section>
		<h2>Accessibility</h2>
		<AccessibilityScorecard {...accessibility} />
	</section>

	<section>
		<h2>Performance notes</h2>
		<ul>
			{#each performance as tip, index (`${index}-${tip}`)}
				<li>{tip}</li>
			{/each}
		</ul>
	</section>

	<section>
		<h2>Testing references</h2>
		<ul>
			{#each testing as link (link.label)}
				<li>
					<code>{link.label}</code> — {link.detail}
				</li>
			{/each}
		</ul>
	</section>
</DemoPage>
