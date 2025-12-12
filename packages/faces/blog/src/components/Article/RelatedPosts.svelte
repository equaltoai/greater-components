<!--
Article.RelatedPosts - Related content suggestions

@component
-->

<script lang="ts">
	import type { ArticleData } from '../../types.js';
	import { Card, Heading, Text } from '@equaltoai/greater-components-primitives';

	interface Props {
		/**
		 * Related posts to display
		 */
		posts?: ArticleData[];
		/**
		 * Maximum number of posts to show
		 */
		limit?: number;
	}

	let { posts = [], limit = 3 }: Props = $props();

	const displayPosts = $derived(posts.slice(0, limit));
</script>

{#if displayPosts.length > 0}
	<section class="gr-blog-related-posts">
		<Heading level={2} size="xl">Related Posts</Heading>
		<div class="gr-blog-related-posts__grid">
			{#each displayPosts as post (post.slug)}
				<Card href={`/posts/${post.slug}`}>
					{#if post.metadata.featuredImage}
						<img
							src={post.metadata.featuredImage}
							alt={post.metadata.title}
							class="gr-blog-related-posts__image"
						/>
					{/if}
					<Heading level={3} size="lg">{post.metadata.title}</Heading>
					<Text size="sm" color="secondary">{post.metadata.description}</Text>
				</Card>
			{/each}
		</div>
	</section>
{/if}
