<!--
  Messages.Conversations - Conversations List
-->
<script lang="ts">
	import { getMessagesContext } from './context.svelte.js';
	import { getConversationName, formatMessageTime } from './utils.js';
	import type { Conversation } from './context.svelte.js';

	interface Props {
		currentUserId?: string;
		class?: string;
	}

	let { currentUserId = 'me', class: className = '' }: Props = $props();

	const {
		state: messagesState,
		selectConversation,
		handlers,
		fetchConversations,
		startRealtime,
	} = getMessagesContext();

	function handleConversationClick(conversation: Conversation) {
		selectConversation(conversation);
		handlers.onConversationClick?.(conversation);
	}
</script>

<div class={`messages-conversations ${className}`}>
	<div class="messages-conversations__header">
		<h2 class="messages-conversations__title">Messages</h2>
		<div class="messages-conversations__tabs" role="tablist" aria-label="Message folders">
			<button
				class="messages-conversations__tab"
				class:messages-conversations__tab--active={messagesState.folder === 'INBOX'}
				type="button"
				role="tab"
				aria-selected={messagesState.folder === 'INBOX'}
				onclick={() => fetchConversations('INBOX')}
			>
				Inbox
			</button>
			<button
				class="messages-conversations__tab"
				class:messages-conversations__tab--active={messagesState.folder === 'REQUESTS'}
				type="button"
				role="tab"
				aria-selected={messagesState.folder === 'REQUESTS'}
				onclick={() => fetchConversations('REQUESTS')}
			>
				Requests
				{#if messagesState.requestCount > 0}
					<span class="messages-conversations__tab-badge">{messagesState.requestCount}</span>
				{/if}
			</button>
		</div>
		{#if messagesState.realtimeStatus !== 'connected' && messagesState.realtimeStatusMessage}
			<div
				class={`messages-conversations__status messages-conversations__status--${messagesState.realtimeStatus}`}
				role="status"
				aria-live="polite"
			>
				<span>{messagesState.realtimeStatusMessage}</span>
				{#if messagesState.realtimeStatus !== 'connecting'}
					<button
						type="button"
						class="messages-conversations__status-retry"
						onclick={() => startRealtime()}
					>
						Retry now
					</button>
				{/if}
			</div>
		{/if}
	</div>

	{#if messagesState.loadingConversations}
		<div class="messages-conversations__loading">
			<div class="messages-conversations__spinner"></div>
		</div>
	{:else if messagesState.conversations.length === 0}
		<div class="messages-conversations__empty">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
			</svg>
			<p>{messagesState.folder === 'REQUESTS' ? 'No message requests' : 'No messages yet'}</p>
		</div>
	{:else}
		<div class="messages-conversations__list">
			{#each messagesState.conversations as conversation (conversation.id)}
				<button
					class="messages-conversations__item"
					class:messages-conversations__item--selected={messagesState.selectedConversation?.id ===
						conversation.id}
					class:messages-conversations__item--unread={conversation.unreadCount > 0}
					onclick={() => handleConversationClick(conversation)}
				>
					<div class="messages-conversations__avatar">
						{#if conversation.participants[0]?.avatar}
							<img src={conversation.participants[0].avatar} alt="" />
						{:else}
							<div class="messages-conversations__avatar-placeholder">
								{conversation.participants[0]?.displayName[0]?.toUpperCase()}
							</div>
						{/if}
					</div>

					<div class="messages-conversations__content">
						<div class="messages-conversations__name">
							{getConversationName(conversation, currentUserId)}
						</div>
						{#if conversation.lastMessage}
							<div class="messages-conversations__preview">
								{conversation.lastMessage.content}
							</div>
						{/if}
					</div>

					<div class="messages-conversations__meta">
						{#if conversation.lastMessage}
							<time class="messages-conversations__time">
								{formatMessageTime(conversation.lastMessage.createdAt)}
							</time>
						{/if}
						{#if conversation.unreadCount > 0}
							<span class="messages-conversations__badge">{conversation.unreadCount}</span>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
