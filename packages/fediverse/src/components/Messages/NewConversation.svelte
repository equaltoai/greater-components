<!--
  Messages.NewConversation - Start New Direct Message
  
  Interface for creating a new direct message conversation with one or more recipients.
-->
<script lang="ts">
	import { createButton } from '@greater/headless/button';
	import { createModal } from '@greater/headless/modal';
	import { getMessagesContext, type MessageParticipant } from './context.js';

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
	let selectedParticipants = $state<MessageParticipant[]>([...initialParticipants]);
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

<style>
	.new-conversation__trigger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--primary-color, #1d9bf0);
		border: none;
		border-radius: 9999px;
		color: white;
		font-weight: 700;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.new-conversation__trigger:hover {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.new-conversation__trigger svg {
		width: 1.125rem;
		height: 1.125rem;
	}

	.new-conversation__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 1rem;
	}

	.new-conversation__modal {
		background: var(--bg-primary, #ffffff);
		border-radius: 0.75rem;
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.new-conversation__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color, #e1e8ed);
	}

	.new-conversation__title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
	}

	.new-conversation__close {
		padding: 0.5rem;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #536471);
	}

	.new-conversation__body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.new-conversation__error {
		padding: 1rem;
		background: rgba(244, 33, 46, 0.1);
		border: 1px solid #f4211e;
		border-radius: 0.5rem;
		color: #f4211e;
		margin-bottom: 1rem;
	}

	.new-conversation__selected {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.new-conversation__label {
		font-weight: 600;
		padding-top: 0.5rem;
	}

	.new-conversation__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 1;
	}

	.new-conversation__chip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.375rem 0.375rem 0.5rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.875rem;
	}

	.new-conversation__chip-avatar {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
	}

	.new-conversation__chip-name {
		font-weight: 600;
	}

	.new-conversation__chip-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		padding: 0;
		background: var(--text-secondary, #536471);
		border: none;
		border-radius: 50%;
		color: white;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.new-conversation__chip-remove:hover {
		background: var(--text-primary, #0f1419);
	}

	.new-conversation__search {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.new-conversation__search-icon {
		position: absolute;
		left: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary, #536471);
	}

	.new-conversation__input {
		width: 100%;
		padding: 0.75rem 2.5rem;
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		font-size: 0.9375rem;
		font-family: inherit;
		color: var(--text-primary, #0f1419);
		background: var(--bg-secondary, #f7f9fa);
	}

	.new-conversation__input:focus {
		outline: none;
		border-color: var(--primary-color, #1d9bf0);
		background: var(--bg-primary, #ffffff);
	}

	.new-conversation__spinner {
		position: absolute;
		right: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
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

	.new-conversation__results {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 300px;
		overflow-y: auto;
	}

	.new-conversation__result {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.2s;
		width: 100%;
	}

	.new-conversation__result:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.new-conversation__result:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.new-conversation__result-avatar,
	.new-conversation__result-avatar-placeholder {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.new-conversation__result-avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-color, #1d9bf0);
		color: white;
		font-weight: 700;
	}

	.new-conversation__result-info {
		flex: 1;
		min-width: 0;
	}

	.new-conversation__result-name {
		font-weight: 600;
		margin-bottom: 0.125rem;
	}

	.new-conversation__result-username {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}

	.new-conversation__result-check {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--primary-color, #1d9bf0);
	}

	.new-conversation__empty {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--text-secondary, #536471);
	}

	.new-conversation__footer {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem;
		border-top: 1px solid var(--border-color, #e1e8ed);
		justify-content: flex-end;
	}

	.new-conversation__button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.new-conversation__button--secondary {
		background: transparent;
		color: var(--text-primary, #0f1419);
		border: 1px solid var(--border-color, #e1e8ed);
	}

	.new-conversation__button--secondary:hover:not(:disabled) {
		background: var(--bg-hover, #eff3f4);
	}

	.new-conversation__button--primary {
		background: var(--primary-color, #1d9bf0);
		color: white;
	}

	.new-conversation__button--primary:hover:not(:disabled) {
		background: var(--primary-color-dark, #1a8cd8);
	}

	.new-conversation__button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
