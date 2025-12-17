<!--
Moderation.Root - Container component for moderation tools

Provides context for Moderation compound components.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import type { ModerationHandlers, ModerationLogEntry, ModerationQueueItem } from '../../types.js';
	import { createModerationContext } from './context.js';
	import Panel from './Panel.svelte';

	interface Props {
		handlers?: ModerationHandlers;
		queue?: ModerationQueueItem[];
		log?: ModerationLogEntry[];
		children?: Snippet;
	}

	let { handlers = {}, queue = [], log = [], children }: Props = $props();

	const initialHandlers = untrack(() => handlers);
	const queueState = $state<ModerationQueueItem[]>(untrack(() => queue));
	const logState = $state<ModerationLogEntry[]>(untrack(() => log));
	let loadingState = $state(false);
	let errorState = $state<string | null>(null);

	const context = createModerationContext({
		handlers: initialHandlers,
		queue: queueState,
		log: logState,
		get loading() {
			return loadingState;
		},
		set loading(value) {
			loadingState = value;
		},
		get error() {
			return errorState;
		},
		set error(value) {
			errorState = value;
		},
	});

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});
</script>

<div class="gr-community-moderation">
	{#if children}
		{@render children?.()}
	{:else}
		<Panel />
	{/if}
</div>
