<!--
  Messages.Message - Individual Message Display
-->
<script lang="ts">
	import { Menu } from '@equaltoai/greater-components-primitives';
	import { MoreVerticalIcon, TrashIcon } from '@equaltoai/greater-components-icons';
	import { formatMessageTime } from './utils.js';
	import { getMessagesContext } from './context.svelte.js';
	import type { DirectMessage, MessagesContext } from './context.svelte.js';

	interface Props {
		message: DirectMessage;
		currentUserId?: string;
		class?: string;
	}

	let { message, currentUserId = 'me', class: className = '' }: Props = $props();

	const isOwnMessage = $derived(message.sender.id === currentUserId);

	const context = (() => {
		try {
			return getMessagesContext();
		} catch {
			return null;
		}
	})() as MessagesContext | null;

	async function handleDeleteMessage() {
		if (!context?.handlers.onDeleteMessage) return;
		if (context.state.loading) return;

		if (!confirm('Delete this message for you?')) {
			return;
		}

		try {
			await context.deleteMessage(message.id);
		} catch {
			// Error handled by context
		}
	}
</script>

<div class={`message ${className}`} class:message--own={isOwnMessage}>
	{#if !isOwnMessage}
		<div class="message__avatar">
			{#if message.sender.avatar}
				<img src={message.sender.avatar} alt={message.sender.displayName} />
			{:else}
				<div class="message__avatar-placeholder">
					{message.sender.displayName[0]?.toUpperCase()}
				</div>
			{/if}
		</div>
	{/if}

	<div class="message__bubble">
		<div class="message__header">
			{#if !isOwnMessage}
				<div class="message__sender">{message.sender.displayName}</div>
			{/if}

			{#if context?.handlers.onDeleteMessage}
				<Menu.Root class="message__menu">
					<Menu.Trigger class="message__menu-trigger" aria-label="Message actions">
						<MoreVerticalIcon size={16} aria-hidden="true" />
					</Menu.Trigger>

					<Menu.Content class="message__menu-content">
						<Menu.Item destructive label="Delete message" onclick={handleDeleteMessage}>
							{#snippet icon()}
								<TrashIcon size={16} aria-hidden="true" />
							{/snippet}
						</Menu.Item>
					</Menu.Content>
				</Menu.Root>
			{/if}
		</div>

		<div class="message__content">{message.content}</div>
		<time class="message__time">{formatMessageTime(message.createdAt)}</time>
	</div>
</div>
