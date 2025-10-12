<!--
  Messages.Thread - Message Thread Display
-->
<script lang="ts">
	import { getMessagesContext } from './context.js';
	import Message from './Message.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state } = getMessagesContext();
</script>

{#if state.selectedConversation}
	<div class="messages-thread {className}">
		{#if state.loadingMessages}
			<div class="messages-thread__loading">
				<div class="messages-thread__spinner"></div>
			</div>
		{:else if state.messages.length === 0}
			<div class="messages-thread__empty">
				<p>No messages yet. Start the conversation!</p>
			</div>
		{:else}
			<div class="messages-thread__list">
				{#each state.messages as message}
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

<style>
	.messages-thread {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--bg-primary, #ffffff);
		overflow: hidden;
	}

	.messages-thread__loading,
	.messages-thread__empty,
	.messages-thread__no-selection {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
	}

	.messages-thread__spinner {
		width: 2rem;
		height: 2rem;
		border: 2px solid var(--border-color, #e1e8ed);
		border-top-color: var(--primary-color, #1d9bf0);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.messages-thread__no-selection svg {
		width: 3rem;
		height: 3rem;
		color: var(--text-secondary, #536471);
	}

	.messages-thread__list {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
