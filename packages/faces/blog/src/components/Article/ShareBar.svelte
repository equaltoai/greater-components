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
	const shareTargetUrl = $derived(resolveShareTargetUrl());
	const canUseClipboard = $derived(
		!!shareTargetUrl && typeof navigator !== 'undefined' && !!navigator.clipboard
	);

	function resolveShareTargetUrl(): string | null {
		if (article.metadata.canonicalUrl) {
			return article.metadata.canonicalUrl;
		}

		if (typeof window !== 'undefined') {
			return window.location.href;
		}

		return null;
	}

	function getShareUrl(platform: string, targetUrl: string): string {
		const url = encodeURIComponent(targetUrl);
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
		if (!shareTargetUrl) {
			context.handlers.onShare?.(article, platform);
			return;
		}

		if (platform === 'copy') {
			if (typeof navigator !== 'undefined' && navigator.clipboard) {
				await navigator.clipboard.writeText(shareTargetUrl);
			}
		} else if (typeof window !== 'undefined') {
			window.open(getShareUrl(platform, shareTargetUrl), '_blank', 'width=600,height=400');
		}

		context.handlers.onShare?.(article, platform);
	}
</script>

<div class="gr-blog-share-bar">
	{#each platforms as platform (platform)}
		<Button
			variant="outline"
			size="sm"
			disabled={platform === 'copy' ? !canUseClipboard : !shareTargetUrl}
			onclick={() => handleShare(platform)}
		>
			{platform === 'copy' ? 'Copy Link' : platform.charAt(0).toUpperCase() + platform.slice(1)}
		</Button>
	{/each}
</div>
