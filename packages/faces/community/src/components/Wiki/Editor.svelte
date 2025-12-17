<!--
Wiki.Editor - Simple markdown editor for wiki pages
-->

<script lang="ts">
	import { getWikiContext } from './context.js';

	const context = getWikiContext();
	let reason = $state('');

	async function save() {
		if (!context.handlers.onSave) return;
		context.loading = true;
		context.error = null;

		try {
			await context.handlers.onSave(context.page.path, context.draft, reason || undefined);
			context.page.content = context.draft;
			context.page.revision = (context.page.revision ?? 0) + 1;
			context.page.lastEditedAt = new Date().toISOString();
			context.editing = false;
			reason = '';
		} catch (error) {
			context.error = error instanceof Error ? error.message : String(error);
		} finally {
			context.loading = false;
		}
	}
</script>

<div class="gr-community-wiki__editor" aria-label="Wiki editor">
	<label class="gr-community-wiki__field">
		<span class="gr-community-wiki__field-label">Content (Markdown)</span>
		<textarea
			class="gr-community-wiki__textarea"
			rows="12"
			bind:value={context.draft}
			disabled={context.loading}
		></textarea>
	</label>

	<label class="gr-community-wiki__field">
		<span class="gr-community-wiki__field-label">Edit reason (optional)</span>
		<input
			class="gr-community-wiki__input"
			type="text"
			bind:value={reason}
			disabled={context.loading}
		/>
	</label>

	<div class="gr-community-wiki__editor-actions">
		<button
			type="button"
			class="gr-community-wiki__action"
			onclick={save}
			disabled={context.loading}
		>
			Save
		</button>
	</div>
</div>
