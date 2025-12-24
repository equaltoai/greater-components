<!--
  Search.TagResult - Tag Search Result Item
-->
<script lang="ts">
	import { getSearchContext, formatCount } from './context.svelte.js';
	import type { SearchTag } from './context.svelte.js';

	interface Props {
		tag: SearchTag;
		class?: string;
	}

	let { tag, class: className = '' }: Props = $props();

	const { handlers } = getSearchContext();

	function handleClick() {
		handlers.onTagClick?.(tag);
	}
</script>

<button
	class={`tag-result ${className}`}
	class:tag-result--trending={tag.trending}
	onclick={handleClick}
>
	<div class="tag-result__content">
		<div class="tag-result__name">
			#{tag.name}
			{#if tag.trending}
				<svg class="tag-result__trending-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
				</svg>
			{/if}
		</div>
		<div class="tag-result__count">{formatCount(tag.count)} posts</div>
	</div>
</button>
