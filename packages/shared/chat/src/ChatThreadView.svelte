<!--
  ChatThreadView - Display threaded conversation branches

  Shows a conversation thread with branching support for AI chat contexts.
  Differentiates from messaging (DMs) by supporting threaded/branching conversations.

  @component
  @example
  ```svelte
  <Chat.ThreadView
    thread={conversationThread}
    onBranchSelect={(branchId) => selectBranch(branchId)}
  />
  ```
-->

<script lang="ts">
	import { Button, Avatar } from '@equaltoai/greater-components-primitives';
	import { GitBranchIcon, ChevronRightIcon } from '@equaltoai/greater-components-icons';
	import type { ChatMessage } from './types.js';
	import { formatMessageTime } from './context.svelte.js';

	interface ThreadBranch {
		id: string;
		parentMessageId: string;
		messages: ChatMessage[];
		createdAt: Date;
		label?: string;
	}

	interface ConversationThread {
		id: string;
		rootMessages: ChatMessage[];
		branches: ThreadBranch[];
		activeBranchId?: string;
	}

	interface Props {
		/**
		 * The conversation thread to display
		 */
		thread: ConversationThread;

		/**
		 * Called when a branch is selected
		 */
		onBranchSelect?: (branchId: string) => void;

		/**
		 * Called when creating a new branch from a message
		 */
		onCreateBranch?: (fromMessageId: string) => void;

		/**
		 * Whether to show branch indicators
		 */
		showBranches?: boolean;

		/**
		 * Custom CSS class
		 */
		class?: string;
	}

	let {
		thread,
		onBranchSelect,
		onCreateBranch,
		showBranches = true,
		class: className = '',
	}: Props = $props();

	// Get messages for the active branch or root
	let activeMessages = $derived(() => {
		if (thread.activeBranchId) {
			const branch = thread.branches.find((b) => b.id === thread.activeBranchId);
			if (branch) {
				// Find parent message and include messages up to it, then branch messages
				const parentIndex = thread.rootMessages.findIndex((m) => m.id === branch.parentMessageId);
				if (parentIndex >= 0) {
					return [...thread.rootMessages.slice(0, parentIndex + 1), ...branch.messages];
				}
			}
		}
		return thread.rootMessages;
	});

	// Get branches that fork from a specific message
	function getBranchesFromMessage(messageId: string): ThreadBranch[] {
		return thread.branches.filter((b) => b.parentMessageId === messageId);
	}

	function selectBranch(branchId: string) {
		onBranchSelect?.(branchId);
	}

	function createBranch(messageId: string) {
		onCreateBranch?.(messageId);
	}

	function returnToMain() {
		onBranchSelect?.('');
	}
</script>

<div class="chat-thread-view {className}" role="log" aria-label="Conversation thread">
	{#if thread.activeBranchId}
		<div class="chat-thread-view__branch-indicator">
			<GitBranchIcon size={14} />
			<span>
				Viewing branch: {thread.branches.find((b) => b.id === thread.activeBranchId)?.label ||
					'Unnamed branch'}
			</span>
			<Button variant="ghost" size="sm" onclick={returnToMain}>Return to main</Button>
		</div>
	{/if}

	<div class="chat-thread-view__messages">
		{#each activeMessages() as message (message.id)}
			<div
				class="chat-thread-view__message chat-thread-view__message--{message.role}"
				class:chat-thread-view__message--has-branches={showBranches &&
					getBranchesFromMessage(message.id).length > 0}
			>
				<div class="chat-thread-view__message-content">
					{#if message.role === 'assistant'}
						<Avatar size="sm" alt="Assistant" />
					{/if}

					<div class="chat-thread-view__message-body">
						<div class="chat-thread-view__message-text">
							{message.content}
						</div>
						<div class="chat-thread-view__message-meta">
							<span class="chat-thread-view__message-time">
								{formatMessageTime(message.timestamp)}
							</span>
							{#if showBranches && message.role === 'assistant'}
								<button
									class="chat-thread-view__branch-button"
									onclick={() => createBranch(message.id)}
									aria-label="Create branch from this message"
								>
									<GitBranchIcon size={12} />
									Branch
								</button>
							{/if}
						</div>
					</div>

					{#if message.role === 'user'}
						<Avatar size="sm" alt="You" />
					{/if}
				</div>

				{#if showBranches}
					{@const branches = getBranchesFromMessage(message.id)}
					{#if branches.length > 0}
						<div class="chat-thread-view__branches" role="list" aria-label="Conversation branches">
							{#each branches as branch (branch.id)}
								<div role="listitem" class="chat-thread-view__branch-item">
									<button
										class="chat-thread-view__branch-link"
										class:chat-thread-view__branch-link--active={branch.id ===
											thread.activeBranchId}
										onclick={() => selectBranch(branch.id)}
									>
										<GitBranchIcon size={12} />
										<span>
											{branch.label || `Branch (${branch.messages.length} messages)`}
										</span>
										<ChevronRightIcon size={12} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.chat-thread-view {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.chat-thread-view__branch-indicator {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		background: var(--gr-color-warning-100);
		border-radius: var(--gr-radii-md);
		font-size: var(--gr-typography-fontSize-sm);
		color: var(--gr-color-warning-700);
	}

	.chat-thread-view__messages {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-3);
	}

	.chat-thread-view__message {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-2);
	}

	.chat-thread-view__message-content {
		display: flex;
		gap: var(--gr-spacing-scale-2);
		align-items: flex-start;
	}

	.chat-thread-view__message--user .chat-thread-view__message-content {
		flex-direction: row-reverse;
	}

	.chat-thread-view__message-body {
		flex: 1;
		max-width: 80%;
	}

	.chat-thread-view__message--user .chat-thread-view__message-body {
		text-align: right;
	}

	.chat-thread-view__message-text {
		padding: var(--gr-spacing-scale-2) var(--gr-spacing-scale-3);
		border-radius: var(--gr-radii-lg);
		font-size: var(--gr-typography-fontSize-sm);
		line-height: 1.5;
	}

	.chat-thread-view__message--user .chat-thread-view__message-text {
		background: var(--gr-color-primary-500);
		color: white;
		border-bottom-right-radius: var(--gr-radii-sm);
	}

	.chat-thread-view__message--assistant .chat-thread-view__message-text {
		background: var(--gr-color-surface-secondary);
		color: var(--gr-color-text-primary);
		border-bottom-left-radius: var(--gr-radii-sm);
	}

	.chat-thread-view__message--system .chat-thread-view__message-text {
		background: var(--gr-color-surface-tertiary);
		color: var(--gr-color-text-muted);
		text-align: center;
		font-style: italic;
	}

	.chat-thread-view__message-meta {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-2);
		margin-top: var(--gr-spacing-scale-1);
	}

	.chat-thread-view__message--user .chat-thread-view__message-meta {
		justify-content: flex-end;
	}

	.chat-thread-view__message-time {
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-muted);
	}

	.chat-thread-view__branch-button {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: transparent;
		border: 1px solid var(--gr-color-border-subtle);
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-muted);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.chat-thread-view__branch-button:hover {
		background: var(--gr-color-surface-hover);
		color: var(--gr-color-text-primary);
	}

	.chat-thread-view__branch-item {
		display: contents;
	}

	.chat-thread-view__branches {
		display: flex;
		flex-direction: column;
		gap: var(--gr-spacing-scale-1);
		margin-left: calc(32px + var(--gr-spacing-scale-2));
		padding-left: var(--gr-spacing-scale-3);
		border-left: 2px solid var(--gr-color-border-subtle);
	}

	.chat-thread-view__branch-link {
		display: flex;
		align-items: center;
		gap: var(--gr-spacing-scale-1);
		padding: var(--gr-spacing-scale-1) var(--gr-spacing-scale-2);
		background: var(--gr-color-surface-secondary);
		border: none;
		border-radius: var(--gr-radii-sm);
		font-size: var(--gr-typography-fontSize-xs);
		color: var(--gr-color-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.chat-thread-view__branch-link:hover {
		background: var(--gr-color-surface-hover);
		color: var(--gr-color-text-primary);
	}

	.chat-thread-view__branch-link--active {
		background: var(--gr-color-primary-100);
		color: var(--gr-color-primary-700);
	}
</style>
