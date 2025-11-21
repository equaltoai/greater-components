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
