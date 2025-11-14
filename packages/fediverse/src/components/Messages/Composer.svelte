<!--
  Messages.Composer - Message Input
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { getMessagesContext } from './context.js';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	const { state: messagesState, sendMessage } = getMessagesContext();

	let content = $state('');

	const sendButton = createButton({
		onClick: () => handleSend(),
	});

	async function handleSend() {
		if (!content.trim() || messagesState.loading) return;

		try {
			await sendMessage(content.trim());
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

{#if messagesState.selectedConversation}
	<div class={`messages-composer ${className}`}>
		<textarea
			class="messages-composer__input"
			bind:value={content}
			onkeydown={handleKeyDown}
			placeholder="Write a message..."
			disabled={messagesState.loading}
			rows="3"
		></textarea>
		<button
			use:sendButton.actions.button
			class="messages-composer__send"
			disabled={messagesState.loading || !content.trim()}
		>
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
			</svg>
			{messagesState.loading ? 'Sending...' : 'Send'}
		</button>
	</div>
{/if}

<style>
	.messages-composer {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-primary, #ffffff);
	}

	.messages-composer__input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.5rem;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		background: var(--bg-primary, #ffffff);
		resize: vertical;
		transition: border-color 0.2s;
	}

	.messages-composer__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
	}

	.messages-composer__input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.messages-composer__send {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-weight: 700;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
		white-space: nowrap;
		align-self: flex-end;
	}

	.messages-composer__send:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.messages-composer__send:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.messages-composer__send svg {
		width: 1.125rem;
		height: 1.125rem;
	}
</style>
