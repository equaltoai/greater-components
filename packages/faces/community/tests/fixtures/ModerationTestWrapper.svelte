<script lang="ts">
	import type { Component as ComponentType, Snippet } from 'svelte';
	import { Moderation } from '../../src/components/Moderation/index.js';
	import type {
		ModerationHandlers,
		ModerationQueueItem,
		ModerationLogEntry,
	} from '../../src/types.js';

	interface Props {
		handlers?: ModerationHandlers;
		queue?: ModerationQueueItem[];
		log?: ModerationLogEntry[];
		component?: ComponentType<Record<string, unknown>>;
		componentProps?: Record<string, unknown>;
		children?: Snippet;
	}

	let {
		handlers = {},
		queue = [],
		log = [],
		component: Component,
		componentProps = {},
		children,
	}: Props = $props();
</script>

<Moderation.Root {handlers} {queue} {log}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		{@render children?.()}
	{/if}
</Moderation.Root>
