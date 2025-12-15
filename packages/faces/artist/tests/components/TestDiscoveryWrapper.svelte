<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import {
		DISCOVERY_CONTEXT_KEY,
		DEFAULT_DISCOVERY_CONFIG,
		type DiscoveryContext,
		type DiscoveryHandlers,
	} from '../../src/components/Discovery/context.js';
	import type { Snippet } from 'svelte';
	import { writable } from 'svelte/store';

	interface Props {
		initialState?: Record<string, unknown>;
		handlers?: DiscoveryHandlers;
		children: Snippet;
	}

	let { initialState = {}, handlers = {}, children }: Props = $props();

	// Mock store
	const storeState = {
		query: '',
		filters: {},
		results: [],
		suggestions: [],
		loading: false,
		error: null,
		hasMore: false,
		total: 0,
		page: 1,
		...untrack(() => initialState),
	};

	const { subscribe, set, update } = writable(storeState);

	const mockStore = {
		subscribe,
		set,
		update,
		get: () => storeState,
		search: () => {},
		loadMore: () => {},
		loadSuggestions: () => {},
		setFilters: () => {},
		updateFilters: () => {},
		clearFilters: () => {},
		reset: () => {},
	};

	// Manual context creation for testing
	const context: DiscoveryContext = {
		store: mockStore as unknown as DiscoveryContext['store'],
		config: DEFAULT_DISCOVERY_CONFIG,
		get handlers() {
			return handlers;
		},
		searchMode: 'text',
		sortBy: 'relevance',
		filtersExpanded: false,
		visualSearchResult: null,
		activeFilterCount: 0,
	};

	setContext(DISCOVERY_CONTEXT_KEY, context);
</script>

<div class="test-discovery-wrapper">
	{@render children()}
</div>
