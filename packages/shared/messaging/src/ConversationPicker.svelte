<!--
  ConversationPicker - Select or create conversations

  Provides a searchable interface for selecting existing conversations
  or starting new ones with participant search.

  @component
  @example
  ```svelte
  <Messages.ConversationPicker
    onSelect={(conversation) => selectConversation(conversation)}
    onCreateNew={(participants) => createConversation(participants)}
  />
  ```
-->

<script lang="ts">
	import { TextField, Button, Avatar, Spinner } from '@equaltoai/greater-components-primitives';
	import { SearchIcon, PlusIcon, MessageCircleIcon } from '@equaltoai/greater-components-icons';
	import { getMessagesContext } from './context.js';
	import type { Conversation, MessageParticipant } from './context.js';

	interface Props {
		/**
		 * Called when a conversation is selected
		 */
		onSelect?: (conversation: Conversation) => void;

		/**
		 * Called when creating a new conversation
		 */
		onCreateNew?: (participants: MessageParticipant[]) => void;

		/**
		 * Placeholder text for search
		 */
		placeholder?: string;

		/**
		 * Whether to show the create new option
		 */
		showCreateNew?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		onSelect,
		onCreateNew,
		placeholder = 'Search conversations or people...',
		showCreateNew = true,
		class: className = '',
	}: Props = $props();

	const context = getMessagesContext();

	let searchQuery = $state('');
	let isSearching = $state(false);
	let searchResults: MessageParticipant[] = $state([]);
	let selectedParticipants: MessageParticipant[] = $state([]);
	let mode: 'browse' | 'search' | 'create' = $state('browse');

	// Filter conversations based on search query
	let filteredConversations = $derived(() => {
		if (!searchQuery) return context.state.conversations;

		const query = searchQuery.toLowerCase();
		return context.state.conversations.filter((conv) =>
			conv.participants.some(
				(p) =>
					p.displayName.toLowerCase().includes(query) || p.username.toLowerCase().includes(query)
			)
		);
	});

	async function handleSearch() {
		if (!searchQuery || !context.handlers.onSearchParticipants) return;

		isSearching = true;
		try {
			searchResults = await context.handlers.onSearchParticipants(searchQuery);
			mode = 'search';
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			isSearching = false;
		}
	}

	function selectConversation(conversation: Conversation) {
		onSelect?.(conversation);
	}

	function toggleParticipant(participant: MessageParticipant) {
		const index = selectedParticipants.findIndex((p) => p.id === participant.id);
		if (index >= 0) {
			selectedParticipants = selectedParticipants.filter((p) => p.id !== participant.id);
		} else {
			selectedParticipants = [...selectedParticipants, participant];
		}
		mode = 'create';
	}

	function createNewConversation() {
		if (selectedParticipants.length > 0) {
			onCreateNew?.(selectedParticipants);
			selectedParticipants = [];
			mode = 'browse';
		}
	}

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		clearTimeout(searchTimeout);
		if (searchQuery.length >= 2) {
			searchTimeout = setTimeout(handleSearch, 300);
		} else if (searchQuery.length === 0) {
			mode = 'browse';
			searchResults = [];
		}
	});
</script>

<div class="conversation-picker {className}" role="dialog" aria-label="Select conversation">
	<div class="conversation-picker__search">
		<TextField bind:value={searchQuery} {placeholder}>
			{#snippet prefix()}
				<SearchIcon size={16} />
			{/snippet}
			{#snippet suffix()}
				{#if isSearching}
					<Spinner size="xs" />
				{/if}
			{/snippet}
		</TextField>
	</div>

	{#if selectedParticipants.length > 0}
		<div class="conversation-picker__selected" role="list" aria-label="Selected participants">
			{#each selectedParticipants as participant (participant.id)}
				<button
					class="conversation-picker__chip"
					onclick={() => toggleParticipant(participant)}
					aria-label="Remove {participant.displayName}"
				>
					<Avatar src={participant.avatar} alt="" size="xs" />
					<span>{participant.displayName}</span>
					<span class="conversation-picker__chip-remove">×</span>
				</button>
			{/each}
			<Button variant="solid" size="sm" onclick={createNewConversation}>
				<PlusIcon size={14} />
				Start conversation
			</Button>
		</div>
	{/if}

	<div class="conversation-picker__content">
		{#if mode === 'search' && searchResults.length > 0}
			<div class="conversation-picker__section">
				<h3 class="conversation-picker__section-title">People</h3>
				<div class="conversation-picker__list" role="listbox" aria-label="Search results">
					{#each searchResults as participant (participant.id)}
						<button
							class="conversation-picker__item"
							class:conversation-picker__item--selected={selectedParticipants.some(
								(p) => p.id === participant.id
							)}
							onclick={() => toggleParticipant(participant)}
							role="option"
							aria-selected={selectedParticipants.some((p) => p.id === participant.id)}
						>
							<Avatar src={participant.avatar} alt="" size="sm" />
							<div class="conversation-picker__item-info">
								<span class="conversation-picker__item-name">{participant.displayName}</span>
								<span class="conversation-picker__item-username">@{participant.username}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<div class="conversation-picker__section">
			<h3 class="conversation-picker__section-title">
				{mode === 'browse' ? 'Recent conversations' : 'Matching conversations'}
			</h3>
			<div class="conversation-picker__list" role="listbox" aria-label="Conversations">
				{#each filteredConversations() as conversation (conversation.id)}
					<button
						class="conversation-picker__item"
						onclick={() => selectConversation(conversation)}
						role="option"
						aria-selected="false"
					>
						<div class="conversation-picker__avatars">
							{#each conversation.participants.slice(0, 3) as participant, i (participant.id)}
								<Avatar
									src={participant.avatar}
									alt=""
									size="sm"
									style="margin-left: {i > 0 ? '-8px' : '0'}"
								/>
							{/each}
						</div>
						<div class="conversation-picker__item-info">
							<span class="conversation-picker__item-name">
								{conversation.participants.map((p) => p.displayName).join(', ')}
							</span>
							{#if conversation.lastMessage}
								<span class="conversation-picker__item-preview">
									{conversation.lastMessage.content.slice(0, 50)}
									{conversation.lastMessage.content.length > 50 ? '...' : ''}
								</span>
							{/if}
						</div>
						{#if conversation.unreadCount > 0}
							<span class="conversation-picker__unread">{conversation.unreadCount}</span>
						{/if}
					</button>
				{:else}
					<div class="conversation-picker__empty">
						<MessageCircleIcon size={24} />
						<span>No conversations found</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	{#if showCreateNew && mode === 'browse'}
		<div class="conversation-picker__footer">
			<Button variant="ghost" size="sm" onclick={() => (mode = 'search')}>
				<PlusIcon size={14} />
				New conversation
			</Button>
		</div>
	{/if}
</div>

<style>
	.conversation-picker {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
		max-height: 400px;
	}

	.conversation-picker__search {
		padding: 0 var(--gr-spacing-scale-3);
	}

	.conversation-picker__selected {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-surface-secondary);
	}

	.conversation-picker__chip {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-surface-primary);
		border: 1px solid var(--gr-color-border-default);
		border-radius: var(--gr-radii-full);
		font-size: var(--gr-typography-fontSize-sm);
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.conversation-picker__chip:hover {
		background: var(--gr-color-surface-hover);
	}

	.conversation-picker__chip-remove {
		color: var(--gr-color-text-muted);
	}

	.conversation-picker__content {
		flex: 1;
		overflow-y: auto;
	}

	.conversation-picker__section {
		padding: 0 var(--gr-spacing-scale-3);
	}

	.conversation-picker__section-title {
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--gr-spacing-scale-2);
	}

	.conversation-picker__list {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
	}

	.conversation-picker__item {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2);
		background: transparent;
		border: none;
		border-radius: var(--gr-radii-md);
		cursor: pointer;
		text-align: left;
		width: 100%;
		transition: background 0.2s ease;
	}

	.conversation-picker__item:hover {
		background: var(--gr-color-surface-hover);
	}

	.conversation-picker__item--selected {
		background: var(--gr-color-primary-100);
	}

	.conversation-picker__avatars {
		display: flex;
	}

	.conversation-picker__item-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.conversation-picker__item-name {
		font-size: var(--gr-typography-fontSize-sm);
		font-weight: var(--gr-typography-fontWeight-medium);
		color: var(--gr-color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.conversation-picker__item-username,
	.conversation-picker__item-preview {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.conversation-picker__unread {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 var(--gr-spacing-scale-1);
		background: var(--gr-color-primary-500);
		color: white;
		font-size: var(--gr-typography-fontSize-xs);
		font-weight: var(--gr-typography-fontWeight-bold);
		border-radius: var(--gr-radii-full);
	}

	.conversation-picker__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-4);
		color: var(--gr-color-text-muted);
	}

	.conversation-picker__footer {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		border-top: 1px solid var(--gr-color-border-subtle);
	}
</style>
