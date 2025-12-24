import { describe, it, expect } from 'vitest';

// Mimic logic from Article/ShareBar.svelte
function getShareUrl(platform: string, url: string, title: string) {
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

describe('Pattern: Share URL Generation', () => {
	const url = 'https://example.com/post/1';
	const title = 'Test Post Title';

	it('generates Twitter share URL', () => {
		const shareUrl = getShareUrl('twitter', url, title);
		expect(shareUrl).toContain('twitter.com/intent/tweet');
		expect(shareUrl).toContain(`url=${encodeURIComponent(url)}`);
		expect(shareUrl).toContain(`text=${encodeURIComponent(title)}`);
	});

	it('generates Facebook share URL', () => {
		const shareUrl = getShareUrl('facebook', url, title);
		expect(shareUrl).toContain('facebook.com/sharer/sharer.php');
		expect(shareUrl).toContain(`u=${encodeURIComponent(url)}`);
	});

	it('generates LinkedIn share URL', () => {
		const shareUrl = getShareUrl('linkedin', url, title);
		expect(shareUrl).toContain('linkedin.com/sharing/share-offsite');
		expect(shareUrl).toContain(`url=${encodeURIComponent(url)}`);
	});

	it('returns empty string for unknown platform', () => {
		expect(getShareUrl('unknown', url, title)).toBe('');
	});
});
