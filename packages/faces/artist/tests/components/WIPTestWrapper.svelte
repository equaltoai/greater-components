<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import {
		WIP_CONTEXT_KEY,
		DEFAULT_WIP_CONFIG,
		type ComparisonState,
	} from '../../src/components/CreativeTools/WorkInProgress/context.js';
	import type { WIPThreadData } from '../../src/types/creative-tools.js';
	import type { Snippet } from 'svelte';
	import type { WIPHandlers } from '../../src/types/creative-tools.js';

	interface Props {
		thread: WIPThreadData;
		isOwner?: boolean;
		handlers?: WIPHandlers;
		initialState?: {
			comparison?: Partial<ComparisonState>;
			currentVersionIndex?: number;
		};
		children: Snippet;
	}

	let { thread, isOwner = false, handlers = {}, initialState = {}, children }: Props = $props();

	// Create reactive state for comparison
	const comparison = $state<ComparisonState>({
		isActive: false,
		mode: 'side-by-side',
		versionA: 0,

		versionB: untrack(() => thread.updates.length - 1),
		sliderPosition: 50,
		overlayOpacity: 0.5,

		...untrack(() => initialState.comparison),
	});

	// Manual context creation for testing
	setContext(WIP_CONTEXT_KEY, {
		get thread() {
			return thread;
		},
		config: DEFAULT_WIP_CONFIG,
		get handlers() {
			return handlers;
		},

		currentVersionIndex:
			untrack(() => initialState.currentVersionIndex) ?? untrack(() => thread.updates.length - 1),
		comparison,
		isFollowing: false,
		get isOwner() {
			return isOwner;
		},
		selectedUpdate: null,
	});
</script>

<div class="wip-test-wrapper">
	{@render children()}
</div>
