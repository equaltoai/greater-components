<!--
  Messages.Message - Individual Message Display
-->
<script lang="ts">
	import { Menu } from '@equaltoai/greater-components-primitives';
	import { MoreVerticalIcon, TrashIcon } from '@equaltoai/greater-components-icons';
	import { formatMessageTime, isParticipantId } from './utils.js';
	import { getMessagesContext } from './context.svelte.js';
	import type { DirectMessage, MessagesContext } from './context.svelte.js';
	import WorkflowThreadMoment from './WorkflowThreadMoment.svelte';

	interface Props {
		message: DirectMessage;
		currentUserId?: string;
		class?: string;
	}

	let { message, currentUserId = 'me', class: className = '' }: Props = $props();

	let sensitiveContentRevealed = $state(false);
	let lastMessageId = $state<string | null>(null);

	const isOwnMessage = $derived(isParticipantId(message.sender, currentUserId));
	const isSensitive = $derived(message.sensitive === true);
	const isContentVisible = $derived(!isSensitive || sensitiveContentRevealed);
	const messageContentId = $derived(`message-content-${message.id.replace(/[^\w-]/g, '-')}`);

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

	function toggleSensitiveContent() {
		sensitiveContentRevealed = !sensitiveContentRevealed;
	}

	$effect(() => {
		const currentMessageId = message.id;

		if (lastMessageId === null) {
			lastMessageId = currentMessageId;
			return;
		}

		if (currentMessageId !== lastMessageId) {
			lastMessageId = currentMessageId;
			sensitiveContentRevealed = false;
		}
	});
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

		{#if isSensitive}
			<div class="message__content-warning">
				<div class="message__content-warning-label">
					{message.spoilerText?.trim() || 'Sensitive message'}
				</div>
				<button
					type="button"
					class="message__content-warning-toggle"
					aria-expanded={isContentVisible}
					aria-controls={messageContentId}
					onclick={toggleSensitiveContent}
				>
					{isContentVisible ? 'Hide message' : 'Show message'}
				</button>
			</div>
		{/if}
		{#if isContentVisible}
			<div class="message__content" id={messageContentId}>{message.content}</div>
		{/if}
		{#if message.workflowMoments?.length}
			<div class="message__workflow">
				{#each message.workflowMoments as moment (moment.id)}
					<WorkflowThreadMoment {moment} />
				{/each}
			</div>
		{/if}
		<time class="message__time">{formatMessageTime(message.createdAt)}</time>
	</div>
</div>
