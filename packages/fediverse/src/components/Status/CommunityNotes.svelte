<!--
Status.CommunityNotes - Display community notes attached to a status

Shows user-contributed context and fact-checking notes from the Lesser platform.

@component
@example
```svelte
<Status.Root status={post}>
  <Status.Content />
  <Status.CommunityNotes />
</Status.Root>
```
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getStatusContext } from './context.js';
	import type { CommunityNote } from '../../types.js';

	interface Props {
		/**
		 * Maximum number of notes to show initially
		 */
		maxInitialNotes?: number;

		/**
		 * Custom note rendering
		 */
		note?: Snippet<[CommunityNote]>;

		/**
		 * Vote handler for community notes
		 */
		onVote?: (noteId: string, helpful: boolean) => Promise<void> | void;

		/**
		 * Whether voting is enabled
		 */
		enableVoting?: boolean;

		/**
		 * Additional CSS class
		 */
		class?: string;
	}

	let {
		maxInitialNotes = 3,
		note,
		onVote,
		enableVoting = true,
		class: className = '',
	}: Props = $props();

	import type { Status as FediverseStatus } from '../../types.js';

	const context = getStatusContext();
	const { actualStatus } = context;

	// Cast to extended Status type from types.ts (populated by unified adapter layer)
	const status = actualStatus as unknown as FediverseStatus;
	const communityNotes = $derived((status.communityNotes || []) as CommunityNote[]);
	const hasNotes = $derived(communityNotes.length > 0);

	let showAll = $state(false);
	const visibleNotes = $derived(
		showAll ? communityNotes : communityNotes.slice(0, maxInitialNotes)
	);
	const hasMoreNotes = $derived(communityNotes.length > maxInitialNotes);

	function toggleShowAll() {
		showAll = !showAll;
	}

	function formatDate(date: string | Date): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
		}).format(d);
	}

	// Voting state
	let votingNotes = $state<Set<string>>(new Set());

	async function handleVote(noteId: string, helpful: boolean) {
		if (!onVote || !enableVoting || votingNotes.has(noteId)) return;

		votingNotes.add(noteId);
		try {
			await onVote(noteId, helpful);
		} catch (error) {
			console.error('Failed to vote on community note:', error);
		} finally {
			votingNotes.delete(noteId);
			// Trigger reactivity
			votingNotes = new Set(votingNotes);
		}
	}
</script>

{#if hasNotes}
	<div
		class={`status-community-notes ${className}`}
		role="complementary"
		aria-label="Community Notes"
	>
		<div class="community-notes__header">
			<svg class="community-notes__icon" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="currentColor"
					d="M21 11.5c0-.28-.11-.53-.29-.71l-9-9a.996.996 0 0 0-1.41 0l-9 9c-.18.18-.29.43-.29.71V21c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-5h4v5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-9.5zM12 7c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1v-4c0-.55.45-1 1-1z"
				/>
			</svg>
			<h3 class="community-notes__title">Community Notes</h3>
			<span class="community-notes__count">{communityNotes.length}</span>
		</div>

		<div class="community-notes__list">
			{#each visibleNotes as communityNote (communityNote.id)}
				<div class="community-note">
					{#if note}
						{@render note(communityNote)}
					{:else}
						<div class="community-note__header">
							<div class="community-note__author">
								{communityNote.author.displayName || communityNote.author.username}
							</div>
							<div class="community-note__meta">
								<time
									class="community-note__time"
									datetime={typeof communityNote.createdAt === 'string'
										? communityNote.createdAt
										: communityNote.createdAt.toISOString()}
								>
									{formatDate(communityNote.createdAt)}
								</time>
							</div>
						</div>

						<div class="community-note__content">
							{communityNote.content}
						</div>

						<div class="community-note__feedback">
							<button
								class="community-note__feedback-btn community-note__feedback-btn--helpful"
								title="Helpful"
								disabled={!enableVoting || votingNotes.has(communityNote.id)}
								onclick={() => handleVote(communityNote.id, true)}
								type="button"
							>
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill="currentColor"
										d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
									/>
								</svg>
								<span>{communityNote.helpful}</span>
							</button>

							<button
								class="community-note__feedback-btn community-note__feedback-btn--not-helpful"
								title="Not helpful"
								disabled={!enableVoting || votingNotes.has(communityNote.id)}
								onclick={() => handleVote(communityNote.id, false)}
								type="button"
							>
								<svg viewBox="0 0 24 24" aria-hidden="true">
									<path
										fill="currentColor"
										d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
									/>
								</svg>
								<span>{communityNote.notHelpful}</span>
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if hasMoreNotes}
			<button class="community-notes__toggle" onclick={toggleShowAll} type="button">
				{showAll
					? 'Show fewer notes'
					: `Show ${communityNotes.length - maxInitialNotes} more notes`}
			</button>
		{/if}
	</div>
{/if}
