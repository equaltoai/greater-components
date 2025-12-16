<!--
Navigation.ArchiveView - Month/year archive navigation
-->

<script lang="ts">
	import { getNavigationContext } from './context.js';
	import type { ArchiveEntry } from '../../types.js';

	const { archives } = getNavigationContext();

	const grouped = $derived.by(() => {
		const byYear = new Map<number, ArchiveEntry[]>();
		for (const entry of archives) {
			const list = byYear.get(entry.year) ?? [];
			list.push(entry);
			byYear.set(entry.year, list);
		}

		for (const list of byYear.values()) {
			list.sort((a, b) => (b.month ?? 0) - (a.month ?? 0));
		}

		return [...byYear.entries()].sort(([a], [b]) => b - a);
	});

	function formatMonth(month: number): string {
		return new Date(2000, month - 1, 1).toLocaleString(undefined, { month: 'long' });
	}
</script>

<section class="gr-blog-archive" aria-label="Archive">
	{#each grouped as [year, entries]}
		<div class="gr-blog-archive__year">{year}</div>
		{#each entries as entry (entry.url)}
			<div class="gr-blog-archive__month">
				{#if entry.month}
					<div class="gr-blog-archive__month-title">
						<a href={entry.url}>{formatMonth(entry.month)} ({entry.count})</a>
					</div>
				{:else}
					<div class="gr-blog-archive__month-title">
						<a href={entry.url}>{entry.count} posts</a>
					</div>
				{/if}
			</div>
		{/each}
	{/each}
</section>

