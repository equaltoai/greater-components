<!--
Article.TableOfContents - Auto-generated navigation from article headings

@component
-->

<script lang="ts">
	import { getArticleContext } from './context.js';

	interface Props {
		/**
		 * Position of the TOC
		 */
		position?: 'left' | 'right';
	}

	let { position = 'left' }: Props = $props();

	const context = getArticleContext();
	const headings = $derived(context.headings);
	const activeHeadingId = $derived(context.activeHeadingId);

	function scrollToHeading(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			context.handlers.onHeadingClick?.(id);
		}
	}
</script>

{#if headings.length > 0}
	<nav class="gr-blog-toc" class:gr-blog-toc--right={position === 'right'}>
		<div class="gr-blog-toc__title">Contents</div>
		<ul class="gr-blog-toc__list">
			{#each headings as heading (heading.id)}
				<li class="gr-blog-toc__item">
					<button
						type="button"
						class="gr-blog-toc__link gr-blog-toc__link--h{heading.level}"
						class:gr-blog-toc__link--active={activeHeadingId === heading.id}
						onclick={() => scrollToHeading(heading.id)}
					>
						{heading.text}
					</button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
