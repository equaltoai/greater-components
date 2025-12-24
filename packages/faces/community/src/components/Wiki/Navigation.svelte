<!--
Wiki.Navigation - Title and action bar for a wiki page
-->

<script lang="ts">
	import { getWikiContext } from './context.js';

	const context = getWikiContext();

	function toggleEditing() {
		if (context.editing) {
			context.editing = false;
			context.draft = context.page.content;
			return;
		}
		context.editing = true;
		context.draft = context.page.content;
	}
</script>

<header class="gr-community-wiki__header">
	<div class="gr-community-wiki__heading">
		<h2 class="gr-community-wiki__title">{context.page.title}</h2>
		<p class="gr-community-wiki__meta">
			<span>{context.page.path}</span>
			<span aria-hidden="true">·</span>
			<span>{context.page.editPermission}</span>
			{#if context.page.isLocked}
				<span aria-hidden="true">·</span>
				<span>Locked</span>
			{/if}
		</p>
	</div>

	<div class="gr-community-wiki__actions" aria-label="Wiki actions">
		{#if context.handlers.onSave}
			<button
				type="button"
				class="gr-community-wiki__action"
				onclick={toggleEditing}
				disabled={context.loading}
			>
				{context.editing ? 'Cancel' : 'Edit'}
			</button>
		{/if}
	</div>
</header>

{#if context.error}
	<p class="gr-community-wiki__error" role="alert">{context.error}</p>
{/if}
