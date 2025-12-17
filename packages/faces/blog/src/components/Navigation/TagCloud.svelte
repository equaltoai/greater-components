<!--
Navigation.TagCloud - Tag cloud navigation
-->

<script lang="ts">
	import { getNavigationContext } from './context.js';

	const { tags } = getNavigationContext();

	const maxCount = $derived(Math.max(1, ...tags.map((t) => t.count)));

	function getSizeClass(count: number): string {
		const ratio = count / maxCount;
		if (ratio >= 0.66) return 'gr-blog-tag-cloud__tag--size-xl';
		if (ratio >= 0.33) return 'gr-blog-tag-cloud__tag--size-lg';
		return '';
	}
</script>

<div class="gr-blog-tag-cloud" aria-label="Tags">
	{#each tags as tag (tag.id)}
		<a class={`gr-blog-tag-cloud__tag ${getSizeClass(tag.count)}`} href={`/tags/${tag.slug}`}>
			{tag.name}
		</a>
	{/each}
</div>
