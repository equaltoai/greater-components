<!--
Wiki.History - Revision history viewer
-->

<script lang="ts">
	import { getWikiContext } from './context.js';

	const context = getWikiContext();
	let open = $state(false);
	let loadingHistory = $state(false);

	function formatTimestamp(value: Date | string | undefined): string {
		if (!value) return '';
		const date = typeof value === 'string' ? new Date(value) : value;
		return date.toLocaleString();
	}

	async function loadHistory() {
		if (!context.handlers.onFetchHistory) return;
		loadingHistory = true;
		context.error = null;
		try {
			const revisions = await context.handlers.onFetchHistory(context.page.path);
			context.history.splice(0, context.history.length, ...revisions);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		} finally {
			loadingHistory = false;
		}
	}

	async function toggle() {
		open = !open;
		if (open && context.history.length === 0) {
			await loadHistory();
		}
	}

	async function revert(revisionId: string) {
		if (!context.handlers.onRevert) return;
		context.loading = true;
		context.error = null;
		try {
			await context.handlers.onRevert(context.page.path, revisionId);
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		} finally {
			context.loading = false;
		}
	}
</script>

{#if context.handlers.onFetchHistory}
	<section class="gr-community-wiki-history" aria-label="Wiki history">
		<button
			type="button"
			class="gr-community-wiki__action"
			onclick={toggle}
			disabled={context.loading}
		>
			{open ? 'Hide history' : 'Show history'}
		</button>

		{#if open}
			{#if loadingHistory}
				<p class="gr-community-wiki__status" aria-live="polite">Loading history…</p>
			{:else if context.history.length === 0}
				<p class="gr-community-wiki__status">No history available.</p>
			{:else}
				<ul class="gr-community-wiki-history__list">
					{#each context.history as revision (revision.id)}
						<li class="gr-community-wiki-history__item">
							<div>
								<span class="gr-community-wiki-history__rev">r{revision.revision}</span>
								<span aria-hidden="true">·</span>
								<span>{revision.editor.username}</span>
								<span aria-hidden="true">·</span>
								<span>{formatTimestamp(revision.editedAt)}</span>
							</div>
							{#if revision.reason}
								<div class="gr-community-wiki-history__reason">{revision.reason}</div>
							{/if}
							{#if context.handlers.onRevert}
								<button
									type="button"
									class="gr-community-wiki__action"
									onclick={() => revert(revision.id)}
								>
									Revert
								</button>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</section>
{/if}
