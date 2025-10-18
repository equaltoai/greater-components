<!--
  Search.TagResult - Tag Search Result Item
-->
<script lang="ts">
	import { getSearchContext, formatCount } from './context.js';
	import type { SearchTag } from './context.js';

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

<style>
	.tag-result {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary, #f7f9fa);
		border: 1px solid var(--border-color, #e1e8ed);
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.tag-result:hover {
		background: var(--bg-hover, #eff3f4);
		border-color: var(--primary-color, #1d9bf0);
	}

	.tag-result--trending {
		background: rgba(29, 155, 240, 0.1);
		border-color: var(--primary-color, #1d9bf0);
	}

	.tag-result__content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.tag-result__name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--text-primary, #0f1419);
	}

	.tag-result__trending-icon {
		width: 1rem;
		height: 1rem;
		color: var(--primary-color, #1d9bf0);
	}

	.tag-result__count {
		font-size: 0.875rem;
		color: var(--text-secondary, #536471);
	}
</style>
