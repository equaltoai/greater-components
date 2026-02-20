<!--
  Messages.Root - Messages Context Provider
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { untrack } from 'svelte';
	import { createMessagesContext } from './context.svelte.js';
	import type { MessagesHandlers } from './context.svelte.js';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		handlers?: MessagesHandlers;
		autoFetch?: boolean;
		children?: Snippet;
		class?: string;
	}

	let { handlers = {}, autoFetch = true, children, class: className = '' }: Props = $props();

	const context = createMessagesContext(untrack(() => handlers));

	$effect(() => {
		Object.assign(context.handlers, handlers);
	});

	onMount(() => {
		if (autoFetch) {
			context.fetchConversations().then(() => {
				context.fetchConversations('REQUESTS', { background: true }).catch(() => {
					/* ignore */
				});
			});
		}

		context.startRealtime();
	});

	onDestroy(() => {
		context.stopRealtime();
	});
</script>

<div class={`messages-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
