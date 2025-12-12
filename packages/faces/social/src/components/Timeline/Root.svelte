<!--
Timeline.Root - Container component for Timeline compound components

Provides context for child components and handles virtualization/infinite scroll.

@component
@example
```svelte
<Timeline.Root items={posts} config={{ virtualized: true }}>
  {#each items as item}
    <Timeline.Item status={item} />
  {/each}
  <Timeline.LoadMore />
</Timeline.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { GenericTimelineItem } from '../../generics/index.js';
	import { setContext, untrack } from 'svelte';
	import { TIMELINE_CONTEXT_KEY } from './context.js';
	import type {
		TimelineCompoundConfig,
		TimelineHandlers,
		TimelineCompoundState,
		TimelineContext,
	} from './context.js';

	interface Props {
		/**
		 * Timeline items
		 */
		items: GenericTimelineItem[];

		/**
		 * Configuration options
		 */
		config?: TimelineCompoundConfig;

		/**
		 * Action handlers
		 */
		handlers?: TimelineHandlers;

		/**
		 * Initial state
		 */
		initialState?: Partial<TimelineCompoundState>;

		/**
		 * Child components
		 */
		children?: Snippet;
	}

	let { items, config = {}, handlers = {}, initialState = {}, children }: Props = $props();

	// Capture initial values for state initialization
	const initialLoading = untrack(() => initialState.loading);
	const initialLoadingMore = untrack(() => initialState.loadingMore);
	const initialHasMore = untrack(() => initialState.hasMore);
	const initialError = untrack(() => initialState.error);
	const initialScrollTop = untrack(() => initialState.scrollTop);

	// Create reactive state
	const internalState: TimelineCompoundState = $state({
		loading: initialLoading ?? false,
		loadingMore: initialLoadingMore ?? false,
		hasMore: initialHasMore ?? true,
		error: initialError ?? null,
		get itemCount() {
			return items.length;
		},
		scrollTop: initialScrollTop ?? 0,
	});

	// Create context object
	const context: TimelineContext = {
		get items() {
			return items;
		},
		get config() {
			return {
				mode: config.mode || 'feed',
				density: config.density || 'comfortable',
				virtualized: config.virtualized ?? true,
				infiniteScroll: config.infiniteScroll ?? true,
				realtime: config.realtime ?? false,
				showLoading: config.showLoading ?? true,
				estimatedItemHeight: config.estimatedItemHeight || 200,
				overscan: config.overscan || 5,
				class: config.class || '',
			};
		},
		get handlers() {
			return handlers;
		},
		state: internalState,
		updateState: (partial: Partial<TimelineCompoundState>) => {
			Object.assign(internalState, partial);
		},
	};

	// Set context once during initialization
	setContext(TIMELINE_CONTEXT_KEY, context);

	/**
	 * Handle scroll events
	 */
	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		context.updateState({ scrollTop: target.scrollTop });
		context.handlers.onScroll?.(target.scrollTop);

		// Trigger load more when near bottom
		if (context.config.infiniteScroll) {
			const scrollHeight = target.scrollHeight;
			const scrollTop = target.scrollTop;
			const clientHeight = target.clientHeight;
			const scrollBottom = scrollHeight - scrollTop - clientHeight;

			// Load more when within 400px of bottom
			if (scrollBottom < 400 && context.state.hasMore && !context.state.loadingMore) {
				handleLoadMore();
			}
		}
	}

	/**
	 * Handle load more request
	 */
	async function handleLoadMore() {
		if (!context.handlers.onLoadMore || context.state.loadingMore) return;

		context.updateState({ loadingMore: true });

		try {
			await context.handlers.onLoadMore();
		} catch (error) {
			context.updateState({ error: error as Error });
		} finally {
			context.updateState({ loadingMore: false });
		}
	}
</script>

<div
	class="timeline-root timeline-root--{context.config.mode} timeline-root--{context.config
		.density} {context.config.class}"
	class:timeline-root--virtualized={context.config.virtualized}
	class:timeline-root--loading={context.state.loading}
	onscroll={handleScroll}
	role="feed"
	aria-busy={context.state.loading}
>
	{#if children}
		{@render children()}
	{/if}
</div>
