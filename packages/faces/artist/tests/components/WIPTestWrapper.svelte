<script lang="ts">
	import { setContext } from 'svelte';
	import {
		WIP_CONTEXT_KEY,
		DEFAULT_WIP_CONFIG,
		type WIPThreadData,
		type ComparisonState,
	} from '../../src/components/CreativeTools/WorkInProgress/context.js';
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
		versionB: thread.updates.length - 1,
		sliderPosition: 50,
		overlayOpacity: 0.5,
		...initialState.comparison,
	});

	// Manual context creation for testing
	setContext(WIP_CONTEXT_KEY, {
		thread,
		config: DEFAULT_WIP_CONFIG,
		handlers,
		currentVersionIndex: initialState.currentVersionIndex ?? thread.updates.length - 1,
		comparison,
		isFollowing: false,
		isOwner,
		selectedUpdate: null,
	});
</script>

<div class="wip-test-wrapper">
	{@render children()}
</div>
