<!--
  Messages.Message - Individual Message Display
-->
<script lang="ts">
	import { formatMessageTime } from './utils.js';
	import type { DirectMessage } from './context.svelte.js';

	interface Props {
		message: DirectMessage;
		currentUserId?: string;
		class?: string;
	}

	let { message, currentUserId = 'me', class: className = '' }: Props = $props();

	const isOwnMessage = $derived(message.sender.id === currentUserId);
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
		{#if !isOwnMessage}
			<div class="message__sender">{message.sender.displayName}</div>
		{/if}
		<div class="message__content">{message.content}</div>
		<time class="message__time">{formatMessageTime(message.createdAt)}</time>
	</div>
</div>
