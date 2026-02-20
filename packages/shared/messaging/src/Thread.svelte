<!--
  Messages.Thread - Message Thread Display
-->
<script lang="ts">
	import { Menu } from '@equaltoai/greater-components-primitives';
	import { MoreVerticalIcon, TrashIcon } from '@equaltoai/greater-components-icons';
	import { getMessagesContext } from './context.svelte.js';
	import Message from './Message.svelte';
	import { getConversationName } from './utils.js';

	interface Props {
		currentUserId?: string;
		class?: string;
	}

	let { currentUserId = 'me', class: className = '' }: Props = $props();

	const {
		state: messagesState,
		handlers,
		acceptMessageRequest,
		declineMessageRequest,
		deleteConversation,
	} = getMessagesContext();

	const isPendingRequest = $derived(messagesState.selectedConversation?.requestState === 'PENDING');
	const conversationName = $derived.by(() => {
		const conversation = messagesState.selectedConversation;
		if (!conversation) return '';
		return getConversationName(conversation, currentUserId);
	});

	async function handleAccept() {
		const conversationId = messagesState.selectedConversation?.id;
		if (!conversationId || messagesState.loading) return;

		try {
			await acceptMessageRequest(conversationId);
		} catch {
			// Error handled by context
		}
	}

	async function handleDecline() {
		const conversationId = messagesState.selectedConversation?.id;
		if (!conversationId || messagesState.loading) return;

		try {
			await declineMessageRequest(conversationId);
		} catch {
			// Error handled by context
		}
	}

	async function handleDeleteConversation() {
		const conversationId = messagesState.selectedConversation?.id;
		if (!conversationId || messagesState.loading) return;

		if (!handlers.onDeleteConversation) {
			return;
		}

		if (!confirm('Delete this conversation for you?')) {
			return;
		}

		try {
			await deleteConversation(conversationId);
		} catch {
			// Error handled by context
		}
	}
</script>

{#if messagesState.selectedConversation}
	<div class={`messages-thread ${className}`}>
		<div class="messages-thread__header">
			<h3 class="messages-thread__title">{conversationName}</h3>

			{#if handlers.onDeleteConversation}
				<Menu.Root class="messages-thread__menu">
					<Menu.Trigger class="messages-thread__menu-trigger" aria-label="Conversation actions">
						<MoreVerticalIcon size={18} aria-hidden="true" />
					</Menu.Trigger>

					<Menu.Content class="messages-thread__menu-content">
						<Menu.Item destructive label="Delete conversation" onclick={handleDeleteConversation}>
							{#snippet icon()}
								<TrashIcon size={16} aria-hidden="true" />
							{/snippet}
						</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			{/if}
		</div>

		{#if isPendingRequest}
			<div class="messages-thread__request-banner" role="status" aria-live="polite">
				<div class="messages-thread__request-text">Message request — accept to reply.</div>
				<div class="messages-thread__request-actions">
					<button
						class="messages-thread__request-button messages-thread__request-button--secondary"
						type="button"
						disabled={messagesState.loading}
						onclick={handleDecline}
					>
						Decline
					</button>
					<button
						class="messages-thread__request-button messages-thread__request-button--primary"
						type="button"
						disabled={messagesState.loading}
						onclick={handleAccept}
					>
						Accept
					</button>
				</div>
			</div>
		{/if}

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
					<Message {message} {currentUserId} />
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
