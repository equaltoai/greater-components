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
	import { setContext } from 'svelte';
	import { TIMELINE_CONTEXT_KEY } from './context.js';
	import type {
		TimelineCompoundConfig,
		TimelineHandlers,
		TimelineCompoundState,
		TimelineContext
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

	// Create reactive state
	const internalState: TimelineCompoundState = $state({
		loading: initialState.loading ?? false,
		loadingMore: initialState.loadingMore ?? false,
		hasMore: initialState.hasMore ?? true,
		error: initialState.error ?? null,
		itemCount: items.length,
		scrollTop: initialState.scrollTop ?? 0
	});

	// Create context object
	const context: TimelineContext = {
		get items() { return items; },
		config: {
			mode: config.mode || 'feed',
			density: config.density || 'comfortable',
			virtualized: config.virtualized ?? true,
			infiniteScroll: config.infiniteScroll ?? true,
			realtime: config.realtime ?? false,
			showLoading: config.showLoading ?? true,
			estimatedItemHeight: config.estimatedItemHeight || 200,
			overscan: config.overscan || 5,
			class: config.class || ''
		},
		handlers,
		state: internalState,
		updateState: (partial: Partial<TimelineCompoundState>) => {
			Object.assign(internalState, partial);
		}
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

<style>
	.timeline-root {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		background: var(--timeline-bg, white);
		position: relative;
	}

	.timeline-root--virtualized {
		/* Will contain absolute positioned items */
		position: relative;
	}

	.timeline-root--loading {
		opacity: 0.7;
		pointer-events: none;
	}

	/* Mode variations */
	.timeline-root--feed {
		/* Standard feed view */
	}

	.timeline-root--thread {
		/* Thread view with nested replies */
	}

	.timeline-root--profile {
		/* Profile timeline view */
	}

	.timeline-root--search {
		/* Search results view */
	}

	/* Density variations */
	.timeline-root--compact {
		--timeline-item-spacing: 0.5rem;
	}

	.timeline-root--comfortable {
		--timeline-item-spacing: 1rem;
	}

	.timeline-root--spacious {
		--timeline-item-spacing: 1.5rem;
	}

	/* Scrollbar styling */
	.timeline-root::-webkit-scrollbar {
		width: 8px;
	}

	.timeline-root::-webkit-scrollbar-track {
		background: var(--timeline-scrollbar-track, transparent);
	}

	.timeline-root::-webkit-scrollbar-thumb {
		background: var(--timeline-scrollbar-thumb, #ccc);
		border-radius: 4px;
	}

	.timeline-root::-webkit-scrollbar-thumb:hover {
		background: var(--timeline-scrollbar-thumb-hover, #999);
	}
</style>
