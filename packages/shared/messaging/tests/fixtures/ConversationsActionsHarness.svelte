<script lang="ts">
	import Conversations from '../../src/Conversations.svelte';
	import type { Conversation, ConversationFolder } from '../../src/context.svelte.js';

	interface Props {
		folder?: ConversationFolder;
	}

	let { folder = $bindable() }: Props = $props();

	function stopSelection(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

<Conversations bind:folder>
	{#snippet actions(conversation: Conversation)}
		<button
			type="button"
			class="request-action"
			data-conversation-id={conversation.id}
			onclick={stopSelection}
		>
			Accept
		</button>
	{/snippet}
</Conversations>
