<!--
  Search.NoteResult - Note/Post Search Result Item
-->
<script lang="ts">
	import { sanitizeHtml } from '@equaltoai/greater-components-utils';
	import { getSearchContext, formatCount, highlightQuery } from './context.js';
	import type { SearchNote } from './context.js';

	interface Props {
		note: SearchNote;
		class?: string;
	}

	let { note, class: className = '' }: Props = $props();

	const { state: searchState, handlers } = getSearchContext();

	function handleClick() {
		handlers.onNoteClick?.(note);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}

	function formatDate(date: string): string {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 7) return d.toLocaleDateString();
		if (days > 0) return `${days}d`;
		if (hours > 0) return `${hours}h`;
		if (minutes > 0) return `${minutes}m`;
		return `${seconds}s`;
	}

	const highlightedContent = $derived(() =>
		sanitizeHtml(highlightQuery(note.content, searchState.query), {
			allowedTags: ['mark', 'span', 'em', 'strong', 'b', 'i', 'u', 'br', 'p', 'a'],
			allowedAttributes: ['class', 'href', 'rel', 'target', 'title'],
		})
	);

	function setHtml(node: HTMLElement, html: string) {
		node.innerHTML = html;
		return {
			update(newHtml: string) {
				node.innerHTML = newHtml;
			},
		};
	}
</script>

<article class={`note-result ${className}`}>
	<div
		class="note-result__interactive"
		role="button"
		tabindex="0"
		onclick={handleClick}
		onkeydown={handleKeyDown}
	>
		<div class="note-result__avatar">
			{#if note.author.avatar}
				<img src={note.author.avatar} alt={note.author.displayName} />
			{:else}
				<div class="note-result__avatar-placeholder">
					{note.author.displayName[0]?.toUpperCase()}
				</div>
			{/if}
		</div>

		<div class="note-result__content">
			<div class="note-result__header">
				<span class="note-result__author">{note.author.displayName}</span>
				<span class="note-result__username">@{note.author.username}</span>
				<span class="note-result__separator">·</span>
				<time class="note-result__time">{formatDate(note.createdAt)}</time>
			</div>

			<div class="note-result__text" use:setHtml={highlightedContent}></div>

			<div class="note-result__stats">
				{#if note.repliesCount !== undefined}
					<span>💬 {formatCount(note.repliesCount || 0)}</span>
				{/if}
				{#if note.reblogsCount !== undefined}
					<span>🔁 {formatCount(note.reblogsCount || 0)}</span>
				{/if}
				{#if note.likesCount !== undefined}
					<span>❤️ {formatCount(note.likesCount || 0)}</span>
				{/if}
			</div>
		</div>
	</div>
</article>

<style>
	.note-result {
		padding: 1rem;
		background: var(--bg-primary, #ffffff);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 0.75rem;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.note-result:hover {
		background: var(--bg-hover, #eff3f4);
	}

	.note-result__interactive {
		display: flex;
		gap: 1rem;
		width: 100%;
		align-items: flex-start;
		cursor: pointer;
		outline: none;
	}

	.note-result__interactive:focus-visible {
		box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.35);
		border-radius: 0.5rem;
	}

	.note-result__avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		overflow: hidden;
		background: var(--bg-secondary, #f7f9fa);
		flex-shrink: 0;
	}

	.note-result__avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.note-result__avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-secondary, #536471);
	}

	.note-result__content {
		flex: 1;
		min-width: 0;
	}

	.note-result__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.note-result__author {
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.note-result__username,
	.note-result__separator,
	.note-result__time {
		color: var(--text-secondary, #536471);
	}

	.note-result__text {
		margin-bottom: 0.75rem;
		font-size: 0.9375rem;
		color: var(--text-primary, #0f1419);
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.note-result__text :global(mark) {
		background: rgba(29, 155, 240, 0.2);
		color: var(--text-primary, #0f1419);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}

	.note-result__text :global(a) {
		color: var(--primary-color, #1d9bf0);
		text-decoration: none;
	}

	.note-result__text :global(a:hover) {
		text-decoration: underline;
	}

	.note-result__stats {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}
</style>
