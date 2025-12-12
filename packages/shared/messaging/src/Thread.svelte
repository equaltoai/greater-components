<!--
  Messages.Thread - Message Thread Display
-->
<script lang="ts">
	import { getMessagesContext } from './context.svelte.js';
	import Message from './Message.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: messagesState } = getMessagesContext();
</script>

{#if messagesState.selectedConversation}
	<div class={`messages-thread ${className}`}>
		{#if messagesState.loadingMessages}
			<div class="messages-thread__loading">
				<div class="messages-thread__spinner"></div>
			</div>
		{:else if messagesState.messages.length === 0}
			<div class="messages-thread__empty">
				<p>No messages yet. Start the conversation!</p>
			</div>
		{:else}
			<div class="messages-thread__list">
				{#each messagesState.messages as message (message.id)}
					<Message {message} />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="messages-thread__no-selection">
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
		</svg>
		<p>Select a conversation to start messaging</p>
	</div>
{/if}
