<!--
Moderation.Log - Display moderation log entries
-->

<script lang="ts">
	import type { AuthorData, CommentData, ModerationLogEntry, PostData } from '../../types.js';
	import { getModerationContext } from './context.js';

	const context = getModerationContext();

	function formatTimestamp(value: Date | string): string {
		const date = typeof value === 'string' ? new Date(value) : value;
		return date.toLocaleString();
	}

	function describeTarget(target: ModerationLogEntry['target']): string {
		const candidate = target as Partial<PostData & CommentData & AuthorData>;
		if (candidate.title) return `Post: ${candidate.title}`;
		if (candidate.username && candidate.id) return `User: ${candidate.username}`;
		if (candidate.content) return 'Comment';
		return 'Target';
	}
</script>

{#if context.log.length === 0}
	<p class="gr-community-mod-panel__status">No log entries.</p>
{:else}
	<ul class="gr-community-mod-log" aria-label="Moderation log">
		{#each context.log as entry (entry.id)}
			<li class="gr-community-mod-log__entry">
				<div class="gr-community-mod-log__summary">
					<span class="gr-community-mod-log__action">{entry.action}</span>
					<span aria-hidden="true">·</span>
					<span class="gr-community-mod-log__moderator">{entry.moderator.username}</span>
					<span aria-hidden="true">·</span>
					<span class="gr-community-mod-log__target">{describeTarget(entry.target)}</span>
				</div>
				<div class="gr-community-mod-log__meta">
					<span>{formatTimestamp(entry.createdAt)}</span>
					{#if entry.details}
						<span aria-hidden="true">·</span>
						<span>{entry.details}</span>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}

