/**
 * Timeline Compound Component
 * 
 * A flexible, composable timeline component for displaying ActivityPub/Fediverse posts.
 * Built using compound component pattern with virtualization, infinite scroll, and real-time updates.
 * 
 * @example Basic usage
 * ```svelte
 * <script>
 *   import { Timeline } from '@equaltoai/greater-components-fediverse';
 *   
 *   const posts = [...]; // Status[] from API
 * </script>
 * 
 * <Timeline.Root items={posts} handlers={{ onLoadMore }}>
 *   {#each posts as status, index}
 *     <Timeline.Item {status} {index}>
 *       <StatusCompound.Root {status}>
 *         <StatusCompound.Header />
 *         <StatusCompound.Content />
 *         <StatusCompound.Actions />
 *       </StatusCompound.Root>
 *     </Timeline.Item>
 *   {/each}
 *   <Timeline.LoadMore />
 * </Timeline.Root>
 * ```
 * 
 * @example With empty and error states
 * ```svelte
 * <Timeline.Root {items} {initialState} {handlers}>
 *   {#if initialState.error}
 *     <Timeline.ErrorState error={initialState.error} onRetry={handleRetry} />
 *   {:else if items.length === 0}
 *     <Timeline.EmptyState title="No posts" />
 *   {:else}
 *     {#each items as status, index}
 *       <Timeline.Item {status} {index}>
 *         ...
 *       </Timeline.Item>
 *     {/each}
 *     <Timeline.LoadMore />
 *   {/if}
 * </Timeline.Root>
 * ```
 * 
 * @module @equaltoai/greater-components-fediverse/Timeline
 */

import TimelineRoot from './Root.svelte';
import TimelineItem from './Item.svelte';
import TimelineLoadMore from './LoadMore.svelte';
import TimelineEmptyState from './EmptyState.svelte';
import TimelineErrorState from './ErrorState.svelte';

export {
	TimelineRoot as Root,
	TimelineItem as Item,
	TimelineLoadMore as LoadMore,
	TimelineEmptyState as EmptyState,
	TimelineErrorState as ErrorState
};

// Export types
export type {
	TimelineContext,
	TimelineCompoundConfig,
	TimelineHandlers,
	TimelineCompoundState,
	TimelineMode,
	TimelineDensity
} from './context.js';

/**
 * Timeline compound component
 * 
 * Provides a flexible, composable API for building timelines with:
 * - Virtual scrolling for performance
 * - Infinite scroll support
 * - Real-time updates
 * - Empty and error states
 * - Customizable layouts
 */
export const Timeline = {
	/**
	 * Root container that provides context and handles scrolling
	 */
	Root: TimelineRoot,

	/**
	 * Individual timeline item wrapper
	 */
	Item: TimelineItem,

	/**
	 * Load more trigger for pagination
	 */
	LoadMore: TimelineLoadMore,

	/**
	 * Empty state when no items
	 */
	EmptyState: TimelineEmptyState,

	/**
	 * Error state with retry
	 */
	ErrorState: TimelineErrorState
};

export default Timeline;

