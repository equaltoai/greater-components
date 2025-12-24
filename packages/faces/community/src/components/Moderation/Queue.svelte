<!--
Moderation.Queue - Render the moderation queue
-->

<script lang="ts">
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import type { CommentData, ModerationQueueItem, PostData } from '../../types.js';
	import { getModerationContext } from './context.js';

	interface Props {
		queue: ModerationQueueItem['queue'];
	}

	let { queue }: Props = $props();

	const context = getModerationContext();

	const items = $derived.by(() => context.queue.filter((item) => item.queue === queue));

	function formatTimestamp(value: Date | string): string {
		const date = typeof value === 'string' ? new Date(value) : value;
		return date.toLocaleString();
	}

	function getItemTitle(item: ModerationQueueItem): string {
		if (item.type === 'post') {
			return (item.content as PostData).title;
		}
		const comment = item.content as CommentData;
		return `Comment by ${comment.author.username}`;
	}

	function getItemPreview(item: ModerationQueueItem): string | null {
		if (item.type === 'post') return ((item.content as PostData).content ?? '').trim() || null;
		return ((item.content as CommentData).content ?? '').trim() || null;
	}

	function removeFromQueue(itemId: string) {
		const index = context.queue.findIndex((item) => item.id === itemId);
		if (index >= 0) context.queue.splice(index, 1);
	}

	async function approve(item: ModerationQueueItem) {
		removeFromQueue(item.id);
		try {
			await context.handlers.onApprove?.(item.id);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		}
	}

	async function markSpam(item: ModerationQueueItem) {
		removeFromQueue(item.id);
		try {
			await context.handlers.onSpam?.(item.id);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		}
	}

	async function remove(item: ModerationQueueItem) {
		removeFromQueue(item.id);
		try {
			await context.handlers.onRemove?.(item.id, 'Removed by moderator');
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		}
	}
</script>

{#if items.length === 0}
	<p class="gr-community-mod-panel__status">No items in this queue.</p>
{:else}
	<div class="gr-community-mod-queue" aria-label="Moderation queue items">
		{#each items as item (item.id)}
			<article class="gr-community-mod-queue-item" data-mod-queue-item-id={item.id}>
				<div class="gr-community-mod-queue-item__content">
					<div class="gr-community-mod-queue-item__title">{getItemTitle(item)}</div>
					<div class="gr-community-mod-queue-item__meta">
						<span>{item.type}</span>
						<span aria-hidden="true">·</span>
						<span>{formatTimestamp(item.queuedAt)}</span>
						<span aria-hidden="true">·</span>
						<span>{item.reports.length} report(s)</span>
					</div>

					{#if item.reports.length > 0}
						<ul class="gr-community-mod-queue-item__reports" aria-label="Reports">
							{#each item.reports as report (report.createdAt)}
								<li>
									{report.reason}
									{#if report.customText}
										<span class="gr-community-mod-queue-item__report-detail">
											— {report.customText}
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}

					{#if getItemPreview(item)}
						<div class="gr-community-mod-queue-item__preview">
							<MarkdownRenderer content={getItemPreview(item) ?? ''} />
						</div>
					{/if}
				</div>

				<div class="gr-community-mod-queue-item__actions" aria-label="Moderation actions">
					<button type="button" onclick={() => approve(item)}>Approve</button>
					<button type="button" onclick={() => remove(item)}>Remove</button>
					<button type="button" onclick={() => markSpam(item)}>Spam</button>
				</div>
			</article>
		{/each}
	</div>
{/if}
