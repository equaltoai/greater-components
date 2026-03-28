import type { ArticleData, ArticleHandlers } from './types.js';

export function normalizeArticleShareUrl(
	value: string | URL | null | undefined
): string | null {
	if (!value) {
		return null;
	}

	return value instanceof URL ? value.toString() : value;
}

export function resolveArticleShareUrl(
	article: ArticleData,
	handlers?: Pick<ArticleHandlers, 'resolveShareUrl'>
): string | null {
	return normalizeArticleShareUrl(handlers?.resolveShareUrl?.(article) ?? article.metadata.canonicalUrl);
}

export function buildArticleShareUrl(platform: string, url: string, title: string): string {
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	switch (platform) {
		case 'twitter':
			return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
		case 'facebook':
			return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		case 'linkedin':
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
		default:
			return '';
	}
}

export function createBrowserArticleShareHandlers(): Pick<
	ArticleHandlers,
	'resolveShareUrl' | 'onCopyLink' | 'onOpenShareLink'
> {
	return {
		resolveShareUrl() {
			if (typeof window === 'undefined') {
				return null;
			}

			return window.location.href;
		},
		async onCopyLink(_article, url) {
			if (typeof navigator !== 'undefined' && navigator.clipboard) {
				await navigator.clipboard.writeText(url);
			}
		},
		onOpenShareLink(_article, _platform, shareUrl) {
			if (typeof window !== 'undefined') {
				window.open(shareUrl, '_blank', 'width=600,height=400');
			}
		},
	};
}
