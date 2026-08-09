<!--
  Messages.NewConversation - Start New Direct Message
  
  Interface for creating a new direct message conversation with one or more recipients.
-->
<script lang="ts">
	import { createButton } from '@equaltoai/greater-components-headless/button';
	import { createModal } from '@equaltoai/greater-components-headless/modal';
	import { untrack } from 'svelte';
	import { getMessagesContext, type MessageParticipant } from './context.svelte.js';

	interface Props {
		/**
		 * Pre-selected participants
		 */
		initialParticipants?: MessageParticipant[];

		/**
		 * Custom CSS class
		 */
		class?: string;

		/**
		 * Callback when conversation is created
		 */
		onConversationCreated?: (conversationId: string) => void;
	}

	let { initialParticipants = [], class: className = '', onConversationCreated }: Props = $props();

	const { handlers, selectConversation } = getMessagesContext();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let selectedParticipants = $state<MessageParticipant[]>(untrack(() => [...initialParticipants]));
	let searchResults = $state<MessageParticipant[]>([]);
	let searching = $state(false);
	let creating = $state(false);
	let error = $state<string | null>(null);

	const modal = createModal();

	$effect(() => {
		if (isOpen) {
			modal.helpers.open();
		} else {
			modal.helpers.close();
		}
	});

	const openButton = createButton({
		onClick: () => {
			isOpen = true;
			error = null;
		},
	});

	const closeButton = createButton({
		onClick: () => {
			isOpen = false;
			searchQuery = '';
			selectedParticipants = [...initialParticipants];
			searchResults = [];
			error = null;
		},
	});

	const startButton = createButton({
		onClick: () => handleCreate(),
	});

	async function handleSearch() {
		if (!searchQuery.trim() || searching) return;

		searching = true;
		error = null;

		try {
			// Use search handler if available, otherwise use fetch actors handler
			if (handlers.onSearchParticipants) {
				searchResults = await handlers.onSearchParticipants(searchQuery.trim());
			} else {
				// Fallback: empty results if no search handler
				searchResults = [];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to search users';
		} finally {
			searching = false;
		}
	}

	function selectParticipant(participant: MessageParticipant) {
		if (!selectedParticipants.some((p) => p.id === participant.id)) {
			selectedParticipants = [...selectedParticipants, participant];
		}
		searchQuery = '';
		searchResults = [];
	}

	function removeParticipant(participantId: string) {
		selectedParticipants = selectedParticipants.filter((p) => p.id !== participantId);
	}

	async function handleCreate() {
		if (selectedParticipants.length === 0 || creating) return;

		creating = true;
		error = null;

		try {
			const participantIds = selectedParticipants.map((p) => p.id);
			const conversation = await handlers.onCreateConversation?.(participantIds);

			if (conversation) {
				// Close modal and reset
				isOpen = false;
				searchQuery = '';
				selectedParticipants = [...initialParticipants];
				searchResults = [];

				// Select the new conversation
				await selectConversation(conversation);

				// Notify parent
				onConversationCreated?.(conversation.id);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create conversation';
		} finally {
			creating = false;
		}
	}

	// Debounced search
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		const query = searchQuery.trim();
		if (searchTimeout) {
			clearTimeout(searchTimeout);
			searchTimeout = null;
		}
		if (query.length > 0) {
			searchTimeout = setTimeout(() => {
				void handleSearch();
			}, 300);
		} else {
			searchResults = [];
		}
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
				searchTimeout = null;
			}
		};
	});
</script>

<div class={`new-conversation ${className}`}>
	<button use:openButton.actions.button class="new-conversation__trigger">
		<svg viewBox="0 0 24 24" fill="currentColor">
			<path
				d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM13 11h-2V9h2v2zm0-4h-2V5h2v2z"
			/>
			<path d="M19 13h-6v-2h6v2zm0-4h-6V7h6v2z" />
		</svg>
		New Message
	</button>

	{#if isOpen}
		<div use:modal.actions.backdrop class="new-conversation__backdrop">
			<div use:modal.actions.content class="new-conversation__modal">
				<div class="new-conversation__header">
					<h3 class="new-conversation__title">New Message</h3>
					<button use:modal.actions.close class="new-conversation__close" aria-label="Close">
						×
					</button>
				</div>

				<div class="new-conversation__body">
					{#if error}
						<div class="new-conversation__error" role="alert">
							{error}
						</div>
					{/if}

					<!-- Selected Participants -->
					{#if selectedParticipants.length > 0}
						<div class="new-conversation__selected">
							<span class="new-conversation__label">To:</span>
							<div class="new-conversation__chips">
								{#each selectedParticipants as participant (participant.id)}
									<div class="new-conversation__chip">
										{#if participant.avatar}
											<img
												src={participant.avatar}
												alt={participant.displayName}
												class="new-conversation__chip-avatar"
											/>
										{/if}
										<span class="new-conversation__chip-name">
											{participant.displayName}
										</span>
										<button
											class="new-conversation__chip-remove"
											onclick={() => removeParticipant(participant.id)}
											aria-label={`Remove ${participant.displayName}`}
										>
											×
										</button>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Search Input -->
					<div class="new-conversation__search">
						<svg class="new-conversation__search-icon" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
							/>
						</svg>
						<input
							type="text"
							class="new-conversation__input"
							bind:value={searchQuery}
							placeholder="Search people..."
							disabled={creating}
						/>
						{#if searching}
							<div class="new-conversation__spinner"></div>
						{/if}
					</div>

					<!-- Search Results -->
					{#if searchResults.length > 0}
						<div class="new-conversation__results">
							{#each searchResults as result (result.id)}
								<button
									class="new-conversation__result"
									onclick={() => selectParticipant(result)}
									disabled={selectedParticipants.some((p) => p.id === result.id)}
								>
									{#if result.avatar}
										<img
											src={result.avatar}
											alt={result.displayName}
											class="new-conversation__result-avatar"
										/>
									{:else}
										<div class="new-conversation__result-avatar-placeholder">
											{result.displayName.charAt(0).toUpperCase()}
										</div>
									{/if}
									<div class="new-conversation__result-info">
										<div class="new-conversation__result-name">{result.displayName}</div>
										<div class="new-conversation__result-username">@{result.username}</div>
									</div>
									{#if selectedParticipants.some((p) => p.id === result.id)}
										<svg
											class="new-conversation__result-check"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
											/>
										</svg>
									{/if}
								</button>
							{/each}
						</div>
					{:else if searchQuery.trim().length > 0 && !searching}
						<div class="new-conversation__empty">
							<p>No users found matching "{searchQuery}"</p>
						</div>
					{/if}
				</div>

				<div class="new-conversation__footer">
					<button
						use:closeButton.actions.button
						class="new-conversation__button new-conversation__button--secondary"
						disabled={creating}
					>
						Cancel
					</button>
					<button
						use:startButton.actions.button
						class="new-conversation__button new-conversation__button--primary"
						disabled={creating || selectedParticipants.length === 0}
					>
						{creating ? 'Creating...' : 'Start Conversation'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
