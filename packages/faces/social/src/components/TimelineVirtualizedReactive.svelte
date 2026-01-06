<script lang="ts">
	import StatusCard from './StatusCard.svelte';
	import type { Status } from '../types';
	import type { StatusActionHandlers } from './Status/context.js';
	import type { Snippet } from 'svelte';
	import type { TimelineIntegrationConfig } from '../lib/integration';
	import { createTimelineIntegration, createGraphQLTimelineIntegration } from '../lib/integration';
	import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';
	import type { GraphQLTimelineView } from '../lib/graphqlTimelineStore';

	interface Props {
		/**
		 * Array of status items to display (optional when using store integration)
		 */
		items?: Status[];
		/**
		 * Store integration configuration (enables real-time updates)
		 */
		integration?: TimelineIntegrationConfig;
		/**
		 * GraphQL adapter for data fetching (alternative to integration)
		 */
		adapter?: LesserGraphQLAdapter;
		/**
		 * View configuration for GraphQL adapter
		 */
		view?: GraphQLTimelineView;
		/**
		 * Estimated height of each item (for virtualization)
		 */
		estimateSize?: number;
		/**
		 * Overscan count for virtualization
		 */
		overscan?: number;
		/**
		 * Whether to show a loading indicator at the top
		 */
		loadingTop?: boolean;
		/**
		 * Whether to show a loading indicator at the bottom
		 */
		loadingBottom?: boolean;
		/**
		 * Whether we've reached the end of the feed
		 */
		endReached?: boolean;
		/**
		 * Callback when scrolling near the top
		 */
		onLoadMore?: () => void;
		/**
		 * Callback when scrolling near the bottom
		 */
		onLoadPrevious?: () => void;
		/**
		 * Callback when a status is clicked
		 */
		onStatusClick?: (status: Status) => void;
		/**
		 * Callback when a status is updated
		 */
		onStatusUpdate?: (status: Status) => void;
		/**
		 * Custom gap loader content
		 */
		gapLoader?: Snippet;
		/**
		 * Custom end of feed content
		 */
		endOfFeed?: Snippet;
		/**
		 * Custom real-time indicator content
		 */
		realtimeIndicator?: Snippet<
			[
				{
					connected: boolean;
					error: string | null;
					unreadCount: number;
					onSync: () => void;
				},
			]
		>;
		/**
		 * CSS class for the timeline
		 */
		class?: string;
		/**
		 * Density for status cards
		 */
		density?: 'compact' | 'comfortable';
		/**
		 * Auto-connect on mount
		 */
		autoConnect?: boolean;
		/**
		 * Show real-time status indicator
		 */
		showRealtimeIndicator?: boolean;
		/**
		 * Action handlers for timeline status cards
		 */
		actionHandlers?: StatusActionHandlers | ((status: Status) => StatusActionHandlers | undefined);
	}

	let {
		items: propItems = [],
		integration,
		loadingTop: propLoadingTop = false,
		loadingBottom: propLoadingBottom = false,
		endReached: propEndReached = false,
		onLoadMore,
		onLoadPrevious,
		onStatusClick,
		onStatusUpdate,
		gapLoader,
		endOfFeed,
		realtimeIndicator,
		class: className = '',
		density = 'comfortable',
		autoConnect = true,
		showRealtimeIndicator = true,
		actionHandlers,
		adapter,
		view,
	}: Props = $props();

	// Create integration instance if config is provided
	const timelineIntegration = $derived(
		integration
			? createTimelineIntegration(integration)
			: adapter && view
				? createGraphQLTimelineIntegration(adapter, view)
				: null
	);
	let mounted = false;

	// Use store data when integration is available, otherwise fall back to props
	const items = $derived(timelineIntegration ? timelineIntegration.items : propItems);
	const loadingTop = $derived(
		timelineIntegration ? timelineIntegration.state.loadingTop : propLoadingTop
	);
	const loadingBottom = $derived(
		timelineIntegration ? timelineIntegration.state.loadingBottom : propLoadingBottom
	);
	const endReached = $derived(
		timelineIntegration ? timelineIntegration.state.endReached : propEndReached
	);
	const connected = $derived(timelineIntegration ? timelineIntegration.state.connected : true);
	const error = $derived(timelineIntegration ? timelineIntegration.state.error : null);
	const unreadCount = $derived(timelineIntegration ? timelineIntegration.state.unreadCount : 0);

	let scrollElement = $state<HTMLDivElement>();
	let prevScrollTop = 0;
	let prevItemCount = 0;

	// Auto-connect on mount
	$effect(() => {
		if (!mounted && timelineIntegration && autoConnect) {
			mounted = true;
			timelineIntegration.connect().catch((err) => {
				console.error('Failed to connect timeline:', err);
			});

			return () => {
				timelineIntegration?.disconnect();
			};
		}
	});

	// Handle status updates
	$effect(() => {
		if (onStatusUpdate && timelineIntegration) {
			// Subscribe to status updates from the store
			// This would be implemented based on the specific update mechanism
		}
	});

	function handleScroll() {
		if (!scrollElement) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollElement;
		const scrollDirection = scrollTop > prevScrollTop ? 'down' : 'up';
		prevScrollTop = scrollTop;

		// Load more when scrolling near the bottom
		if (scrollDirection === 'down' && !loadingBottom && !endReached) {
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			if (distanceFromBottom < 500) {
				if (timelineIntegration) {
					timelineIntegration.loadOlder();
				} else {
					onLoadMore?.();
				}
			}
		}

		// Load previous when scrolling near the top
		if (scrollDirection === 'up' && !loadingTop) {
			if (scrollTop < 500) {
				if (timelineIntegration) {
					timelineIntegration.loadNewer();
				} else {
					onLoadPrevious?.();
				}
			}
		}
	}

	// Preserve scroll position when items are prepended
	$effect(() => {
		if (!scrollElement) return;

		const currentItemCount = items.length;

		if (currentItemCount > prevItemCount && prevItemCount > 0) {
			const prevScrollHeight = scrollElement.scrollHeight;
			// Capture scrollElement reference for closure
			const element = scrollElement;

			// Use requestAnimationFrame to wait for DOM updates
			requestAnimationFrame(() => {
				if (!element) return;
				const newScrollHeight = element.scrollHeight;
				const heightDiff = newScrollHeight - prevScrollHeight;

				// If items were likely added to the top (scroll position near top)
				if (heightDiff > 0 && element.scrollTop < 1000) {
					element.scrollTop += heightDiff;
				}
			});
		}

		prevItemCount = currentItemCount;
	});

	function handleStatusCardClick(status: Status) {
		onStatusClick?.(status);
	}

	function handleSyncClick() {
		if (timelineIntegration) {
			timelineIntegration.loadNewer();
		}
	}

	function handleRefresh() {
		if (timelineIntegration) {
			timelineIntegration.refresh();
		}
	}
</script>

<div
	class={`timeline-virtualized ${className}`}
	role="feed"
	aria-label="Timeline"
	aria-busy={loadingTop || loadingBottom}
>
	{#if showRealtimeIndicator && timelineIntegration}
		<div class="realtime-status" class:connected class:error={!!error}>
			{#if realtimeIndicator}
				{@render realtimeIndicator({ connected, error, unreadCount, onSync: handleSyncClick })}
			{:else}
				<div class="realtime-indicator">
					<div class="connection-status">
						{#if connected}
							<div class="status-dot connected" aria-label="Connected"></div>
							<span>Live</span>
						{:else if error}
							<div class="status-dot error" aria-label="Connection error"></div>
							<span>Error</span>
						{:else}
							<div class="status-dot reconnecting" aria-label="Reconnecting"></div>
							<span>Connecting...</span>
						{/if}
					</div>

					{#if unreadCount > 0}
						<button
							class="unread-indicator"
							onclick={handleSyncClick}
							aria-label={`Load ${unreadCount} new items`}
						>
							{unreadCount} new
						</button>
					{/if}

					{#if error}
						<button class="retry-button" onclick={handleRefresh} aria-label="Retry connection">
							Retry
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<div class="timeline-scroll" bind:this={scrollElement} onscroll={handleScroll}>
		{#if loadingTop}
			<div class="loading-indicator top">
				<div class="spinner" aria-label="Loading new items"></div>
			</div>
		{/if}

			{#each items as item (item.id)}
				{@const handlersForItem =
					typeof actionHandlers === 'function' ? actionHandlers(item) : actionHandlers}
				<StatusCard
					status={item}
					{density}
					showActions={true}
					actionHandlers={handlersForItem}
					onClick={() => handleStatusCardClick(item)}
				/>
			{/each}

		{#if loadingBottom && !endReached}
			<div class="loading-indicator bottom">
				{#if gapLoader}
					{@render gapLoader()}
				{:else}
					<div class="spinner" aria-label="Loading more items"></div>
				{/if}
			</div>
		{/if}

		{#if endReached}
			<div class="end-of-feed">
				{#if endOfFeed}
					{@render endOfFeed()}
				{:else}
					<p>You've reached the end</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
