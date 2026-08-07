<!--
  Messages.Composer - Message Input
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getMessagesContext, type Conversation } from './context.svelte.js';

	interface Props {
		/** Explicit conversation target. Defaults to the context's selected conversation. */
		conversation?: Conversation | null;
		class?: string;
	}

	let { conversation, class: className = '' }: Props = $props();

	const { state: messagesState, sendMessage } = getMessagesContext();

	let content = $state('');

	const activeConversation = $derived(
		conversation === undefined ? messagesState.selectedConversation : conversation
	);
	const isPendingRequest = $derived(activeConversation?.requestState === 'PENDING');

	const sendButton = createButton({
		onClick: () => handleSend(),
	});

	async function handleSend() {
		if (!content.trim() || messagesState.loading || isPendingRequest) return;

		try {
			await sendMessage(content.trim(), undefined, activeConversation ?? undefined);
			content = '';
		} catch {
			// Error handled by context
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	}
</script>

{#if activeConversation}
	<div class={`messages-composer ${className}`}>
		<textarea
			class="messages-composer__input"
			bind:value={content}
			onkeydown={handleKeyDown}
			placeholder={isPendingRequest ? 'Accept the request to reply…' : 'Write a message...'}
			disabled={messagesState.loading || isPendingRequest}
			rows="3"
		></textarea>
		<button
			use:sendButton.actions.button
			class="messages-composer__send"
			disabled={messagesState.loading || isPendingRequest || !content.trim()}
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
			</svg>
			{messagesState.loading ? 'Sending...' : 'Send'}
		</button>
	</div>
{/if}
