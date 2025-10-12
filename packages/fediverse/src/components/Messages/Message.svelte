<!--
  Messages.Message - Individual Message Display
-->
<script lang="ts">
	import { formatMessageTime } from './context.js';
	import type { DirectMessage } from './context.js';

	interface Props {
		message: DirectMessage;
		currentUserId?: string;
		class?: string;
	}

	let { message, currentUserId = 'me', class: className = '' }: Props = $props();

	const isOwnMessage = $derived(message.sender.id === currentUserId);
</script>

<div class="message {className}" class:message--own={isOwnMessage}>
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
		{#if !isOwnMessage}
			<div class="message__sender">{message.sender.displayName}</div>
		{/if}
		<div class="message__content">{message.content}</div>
		<time class="message__time">{formatMessageTime(message.createdAt)}</time>
	</div>
</div>

<style>
	.message {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}

	.message--own {
		flex-direction: row-reverse;
	}

	.message__avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		flex-shrink: 0;
	}

	.message__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.message__avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.message__bubble {
		max-width: 70%;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border-radius: 1rem;
	}

	.message--own .message__bubble {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.message__sender {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
		margin-bottom: 0.25rem;
	}

	.message__content {
		font-size: 0.9375rem;
		line-height: 1.4;
		word-break: break-word;
	}

	.message__time {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.message--own .message__time {
		color: white;
	}
</style>
