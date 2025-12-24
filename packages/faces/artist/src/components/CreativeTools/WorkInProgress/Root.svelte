<!--
WorkInProgress.Root - Container compound component for WIP threads

Implements REQ-FR-006: Creative Tools for Artistic Process
- Work-in-progress documentation
- Version control and comparison
- Community engagement

@component
@example
```svelte
<WorkInProgress.Root {thread} {handlers}>
  <WorkInProgress.Header />
  <WorkInProgress.VersionList />
  <WorkInProgress.Timeline />
  <WorkInProgress.Comments />
</WorkInProgress.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createWIPContext } from './context.js';
	import type { WIPThreadData, WIPHandlers } from '../../../types/creative-tools.js';

	interface Props {
		/**
		 * WIP thread data
		 */
		thread: WIPThreadData;

		/**
		 * Event handlers
		 */
		handlers?: WIPHandlers;

		/**
		 * Whether current user owns this thread
		 */
		isOwner?: boolean;

		/**
		 * Show version timeline
		 */
		showTimeline?: boolean;

		/**
		 * Show comments section
		 */
		showComments?: boolean;

		/**
		 * Enable version comparison
		 */
		enableComparison?: boolean;

		/**
		 * Show progress indicator
		 */
		showProgress?: boolean;

		/**
		 * Allow posting updates (for owner)
		 */
		allowUpdates?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Child content
		 */
		children: Snippet;
	}

	let {
		thread,
		handlers = {},
		isOwner = false,
		showTimeline = true,
		showComments = true,
		enableComparison = true,
		showProgress = true,
		allowUpdates = false,
		class: className = '',
		children,
	}: Props = $props();

	// Create and set context for child components
	// Create and set context for child components
	const config = $derived({
		showTimeline,
		showComments,
		enableComparison,
		showProgress,
		allowUpdates,
	});

	createWIPContext(
		() => thread,
		() => config,
		() => handlers,
		() => isOwner
	);

	// Computed status
	const status = $derived.by(() => {
		if (thread.isComplete) return 'completed';
		if (thread.currentProgress === 0 && thread.updates.length === 0) return 'abandoned';
		return 'in-progress';
	});

	// Computed classes
	const rootClasses = $derived(
		['wip-thread', `wip-thread--${status}`, className].filter(Boolean).join(' ')
	);
</script>

<article class={rootClasses} aria-label={`Work in progress: ${thread.title}`} data-status={status}>
	<div class="wip-thread__content">
		{@render children()}
	</div>
</article>

<style>
	.wip-thread {
		position: relative;
		width: 100%;
		background: var(--gr-color-gray-900);
		color: var(--gr-color-gray-100);
		border-radius: var(--gr-radius-lg);
		overflow: hidden;
	}

	.wip-thread__content {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-6);
	}

	.wip-thread--completed {
		border: 2px solid var(--gr-color-success-500);
	}

	.wip-thread--abandoned {
		opacity: 0.7;
	}
</style>
