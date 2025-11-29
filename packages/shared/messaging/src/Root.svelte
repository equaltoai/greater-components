<!--
  Messages.Root - Messages Context Provider
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createMessagesContext } from './context.js';
	import type { MessagesHandlers } from './context.js';
	import { onMount } from 'svelte';

	interface Props {
		handlers?: MessagesHandlers;
		autoFetch?: boolean;
		children?: Snippet;
		class?: string;
	}

	let { handlers = {}, autoFetch = true, children, class: className = '' }: Props = $props();

	const context = createMessagesContext(handlers);

	onMount(() => {
		if (autoFetch) {
			context.fetchConversations();
		}
	});
</script>

<div class={`messages-root ${className}`}>
	{#if children}
		{@render children()}
	{/if}
</div>
