<!--
Article.ShareBar - Social sharing buttons

@component
-->

<script lang="ts">
	import { getArticleContext } from './context.js';
	import { Button } from '@equaltoai/greater-components-primitives';
	import { buildArticleShareUrl, resolveArticleShareUrl } from '../../share.js';

	interface Props {
		/**
		 * Platforms to show share buttons for
		 */
		platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'copy'>;
	}

	let { platforms = ['twitter', 'linkedin', 'copy'] }: Props = $props();

	const context = getArticleContext();
	const article = $derived(context.article);
	const shareTargetUrl = $derived(resolveArticleShareUrl(article, context.handlers));
	const canCopyLink = $derived(!!shareTargetUrl && !!context.handlers.onCopyLink);
	const canOpenShareLink = $derived(!!shareTargetUrl && !!context.handlers.onOpenShareLink);

	async function handleShare(platform: string) {
		if (!shareTargetUrl) {
			context.handlers.onShare?.(article, platform);
			return;
		}

		if (platform === 'copy') {
			await context.handlers.onCopyLink?.(article, shareTargetUrl);
		} else {
			const shareUrl = buildArticleShareUrl(platform, shareTargetUrl, article.metadata.title);
			await context.handlers.onOpenShareLink?.(article, platform, shareUrl);
		}

		context.handlers.onShare?.(article, platform);
	}
</script>

<div class="gr-blog-share-bar">
	{#each platforms as platform (platform)}
		<Button
			variant="outline"
			size="sm"
			disabled={platform === 'copy' ? !canCopyLink : !canOpenShareLink}
			onclick={() => handleShare(platform)}
		>
			{platform === 'copy' ? 'Copy Link' : platform.charAt(0).toUpperCase() + platform.slice(1)}
		</Button>
	{/each}
</div>
