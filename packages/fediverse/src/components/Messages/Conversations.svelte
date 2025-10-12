<!--
  Messages.Conversations - Conversations List
-->
<script lang="ts">
	import { getMessagesContext, getConversationName, formatMessageTime } from './context.js';
	import type { Conversation } from './context.js';

	interface Props {
		currentUserId?: string;
		class?: string;
	}

	let { currentUserId = 'me', class: className = '' }: Props = $props();

	const { state, selectConversation, handlers } = getMessagesContext();

	function handleConversationClick(conversation: Conversation) {
		selectConversation(conversation);
		handlers.onConversationClick?.(conversation);
	}
</script>

<div class="messages-conversations {className}">
	<div class="messages-conversations__header">
		<h2 class="messages-conversations__title">Messages</h2>
	</div>

	{#if state.loadingConversations}
		<div class="messages-conversations__loading">
			<div class="messages-conversations__spinner"></div>
		</div>
	{:else if state.conversations.length === 0}
		<div class="messages-conversations__empty">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
			</svg>
			<p>No messages yet</p>
		</div>
	{:else}
		<div class="messages-conversations__list">
			{#each state.conversations as conversation}
				<button
					class="messages-conversations__item"
					class:messages-conversations__item--selected={state.selectedConversation?.id ===
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

<style>
	.messages-conversations {
		width: 20rem;
		border-right: 1px solid var(--border-color, #e1e8ed);
		background: var(--bg-primary, #ffffff);
		display: flex;
		flex-direction: column;
	}

	.messages-conversations__header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.messages-conversations__title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--text-primary, #0f1419);
	}

	.messages-conversations__loading,
	.messages-conversations__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 1rem;
		text-align: center;
	}

	.messages-conversations__spinner {
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

	.messages-conversations__empty svg {
		width: 2rem;
		height: 2rem;
		color: var(--text-secondary, #536471);
	}

	.messages-conversations__empty p {
		margin: 0;
		color: var(--text-secondary, #536471);
	}

	.messages-conversations__list {
		flex: 1;
		overflow-y: auto;
	}

	.messages-conversations__item {
		display: flex;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
		background: transparent;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.messages-conversations__item:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.messages-conversations__item--selected {
		background: var(--bg-hover, #eff3f4);
	}

	.messages-conversations__avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		flex-shrink: 0;
	}

	.messages-conversations__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.messages-conversations__avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.messages-conversations__content {
		flex: 1;
		min-width: 0;
	}

	.messages-conversations__name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 0.25rem;
	}

	.messages-conversations__item--unread .messages-conversations__name {
		font-weight: 800;
	}

	.messages-conversations__preview {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.messages-conversations__item--unread .messages-conversations__preview {
		font-weight: 600;
		color: var(--text-primary, #0f1419);
	}

	.messages-conversations__meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
	}

	.messages-conversations__time {
		font-size: 0.75rem;
		color: var(--text-secondary, #536471);
	}

	.messages-conversations__badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		background: var(--primary-color, #1d9bf0);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
	}
</style>
