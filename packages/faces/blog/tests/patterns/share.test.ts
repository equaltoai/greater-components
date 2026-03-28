import { describe, it, expect } from 'vitest';
import { buildArticleShareUrl } from '../../src/share.js';

describe('Pattern: Share URL Generation', () => {
	const url = 'https://example.com/post/1';
	const title = 'Test Post Title';

	it('generates Twitter share URL', () => {
		const shareUrl = buildArticleShareUrl('twitter', url, title);
		expect(shareUrl).toContain('twitter.com/intent/tweet');
		expect(shareUrl).toContain(`url=${encodeURIComponent(url)}`);
		expect(shareUrl).toContain(`text=${encodeURIComponent(title)}`);
	});

	it('generates Facebook share URL', () => {
		const shareUrl = buildArticleShareUrl('facebook', url, title);
		expect(shareUrl).toContain('facebook.com/sharer/sharer.php');
		expect(shareUrl).toContain(`u=${encodeURIComponent(url)}`);
	});

	it('generates LinkedIn share URL', () => {
		const shareUrl = buildArticleShareUrl('linkedin', url, title);
		expect(shareUrl).toContain('linkedin.com/sharing/share-offsite');
		expect(shareUrl).toContain(`url=${encodeURIComponent(url)}`);
	});

	it('returns empty string for unknown platform', () => {
		expect(buildArticleShareUrl('unknown', url, title)).toBe('');
	});
});
