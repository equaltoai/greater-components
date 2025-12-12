<!--
Article.ShareBar - Social sharing buttons

@component
-->

<script lang="ts">
	import { getArticleContext } from './context.js';
	import { Button } from '@equaltoai/greater-components-primitives';

	interface Props {
		/**
		 * Platforms to show share buttons for
		 */
		platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'copy'>;
	}

	let { platforms = ['twitter', 'linkedin', 'copy'] }: Props = $props();

	const context = getArticleContext();
	const article = $derived(context.article);

	function getShareUrl(platform: string): string {
		const url = encodeURIComponent(window.location.href);
		const title = encodeURIComponent(article.metadata.title);

		switch (platform) {
			case 'twitter':
				return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
			case 'facebook':
				return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
			case 'linkedin':
				return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
			default:
				return '';
		}
	}

	async function handleShare(platform: string) {
		if (platform === 'copy') {
			await navigator.clipboard.writeText(window.location.href);
		} else {
			window.open(getShareUrl(platform), '_blank', 'width=600,height=400');
		}
		context.handlers.onShare?.(article, platform);
	}
</script>

<div class="gr-blog-share-bar">
	{#each platforms as platform (platform)}
		<Button variant="outline" size="sm" onclick={() => handleShare(platform)}>
			{platform === 'copy' ? 'Copy Link' : platform.charAt(0).toUpperCase() + platform.slice(1)}
		</Button>
	{/each}
</div>
