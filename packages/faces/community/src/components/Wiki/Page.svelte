<!--
Wiki.Page - Render wiki page content
-->

<script lang="ts">
	import { MarkdownRenderer } from '@equaltoai/greater-components-content';
	import { getWikiContext } from './context.js';

	const context = getWikiContext();
</script>

<article class="gr-community-wiki__content">
	<MarkdownRenderer content={context.page.content} />
</article>

