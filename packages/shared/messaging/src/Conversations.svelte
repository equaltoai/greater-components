<!--
  Messages.Conversations - Conversations List
-->
<script lang="ts">
	import { sanitizeForPreview } from '@equaltoai/greater-components-utils';
	import { untrack, type Snippet } from 'svelte';
	import { getMessagesContext } from './context.svelte.js';
	import { getConversationName, formatMessageTime } from './utils.js';
	import type { Conversation, ConversationFolder } from './context.svelte.js';
	import ConversationWorkflowSummary from './ConversationWorkflowSummary.svelte';

	interface Props {
		currentUserId?: string;
		folder?: ConversationFolder;
		actions?: Snippet<[conversation: Conversation]>;
		class?: string;
	}

	let {
		currentUserId = 'me',
		folder = $bindable(),
		actions,
		class: className = '',
	}: Props = $props();

	const {
		state: messagesState,
		selectConversation,
		handlers,
		fetchConversations,
		startRealtime,
	} = getMessagesContext();
	let lastControlledFolder: ConversationFolder | undefined;

	const activeFolder = $derived(folder ?? messagesState.folder);

	function requestFolder(nextFolder: ConversationFolder) {
		void fetchConversations(nextFolder);
	}

	$effect(() => {
		const nextFolder = folder;
		if (nextFolder === lastControlledFolder) {
			return;
		}
		lastControlledFolder = nextFolder;

		if (nextFolder !== undefined && nextFolder !== untrack(() => messagesState.folder)) {
			requestFolder(nextFolder);
		}
	});

	function handleConversationClick(conversation: Conversation) {
		selectConversation(conversation);
		handlers.onConversationClick?.(conversation);
	}

	function handleFolderClick(nextFolder: ConversationFolder) {
		if (folder !== undefined) {
			lastControlledFolder = nextFolder;
			folder = nextFolder;
		}
		requestFolder(nextFolder);
	}

	function getMessagePreview(conversation: Conversation): string {
		const message = conversation.lastMessage;
		if (!message) return '';
		if (message.sensitive) {
			return message.spoilerText?.trim() || 'Sensitive message';
		}
		return sanitizeForPreview(message.content, 200);
	}
</script>

{#snippet conversationContent(conversation: Conversation)}
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
		{#if conversation.workflowSummary}
			<ConversationWorkflowSummary summary={conversation.workflowSummary} compact />
		{/if}
		{#if conversation.lastMessage}
			<div class="messages-conversations__preview">
				{getMessagePreview(conversation)}
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
{/snippet}

<div class={`messages-conversations ${className}`}>
	<div class="messages-conversations__header">
		<h2 class="messages-conversations__title">Messages</h2>
		<div class="messages-conversations__tabs" role="tablist" aria-label="Message folders">
			<button
				class="messages-conversations__tab"
				class:messages-conversations__tab--active={activeFolder === 'INBOX'}
				type="button"
				role="tab"
				aria-selected={activeFolder === 'INBOX'}
				onclick={() => handleFolderClick('INBOX')}
			>
				Inbox
			</button>
			<button
				class="messages-conversations__tab"
				class:messages-conversations__tab--active={activeFolder === 'REQUESTS'}
				type="button"
				role="tab"
				aria-selected={activeFolder === 'REQUESTS'}
				onclick={() => handleFolderClick('REQUESTS')}
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
			<p>{activeFolder === 'REQUESTS' ? 'No message requests' : 'No messages yet'}</p>
		</div>
	{:else}
		<div class="messages-conversations__list">
			{#each messagesState.conversations as conversation (conversation.id)}
				{#if actions}
					<div
						class="messages-conversations__item messages-conversations__item--with-actions"
						class:messages-conversations__item--selected={messagesState.selectedConversation?.id ===
							conversation.id}
						class:messages-conversations__item--unread={conversation.unreadCount > 0}
						style="grid-template-columns: minmax(0, 1fr) auto;"
					>
						<button
							type="button"
							class="messages-conversations__item-main"
							style="display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: inherit; min-width: 0; padding: 0; border: 0; background: transparent; color: inherit; font: inherit; text-align: inherit; cursor: pointer;"
							onclick={() => handleConversationClick(conversation)}
						>
							{@render conversationContent(conversation)}
						</button>
						<div
							class="messages-conversations__actions"
							style="display: flex; align-items: center;"
						>
							{@render actions(conversation)}
						</div>
					</div>
				{:else}
					<button
						class="messages-conversations__item"
						class:messages-conversations__item--selected={messagesState.selectedConversation?.id ===
							conversation.id}
						class:messages-conversations__item--unread={conversation.unreadCount > 0}
						onclick={() => handleConversationClick(conversation)}
					>
						{@render conversationContent(conversation)}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
