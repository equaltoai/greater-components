import { describe, it, expect } from 'vitest';
import {
	linkifyMentions,
	extractMentions,
	extractHashtags,
	extractUrls,
	hasMentions,
	hasHashtags,
	hasUrls,
} from '../src/linkifyMentions';

describe('linkifyMentions', () => {
	it('should linkify mentions', () => {
		const text = 'Hello @user and @other@mastodon.social';
		const result = linkifyMentions(text);
		expect(result).toContain('<a href="/users/user"');
		expect(result).toContain('<a href="/users/other@mastodon.social"');
		expect(result).toContain('class="mention"');
	});

	it('should linkify hashtags', () => {
		const text = 'Check out #javascript and #typescript';
		const result = linkifyMentions(text);
		expect(result).toContain('<a href="/tags/javascript"');
		expect(result).toContain('<a href="/tags/typescript"');
		expect(result).toContain('class="hashtag"');
	});

	it('should linkify URLs', () => {
		const text = 'Visit https://example.com and example.org';
		const result = linkifyMentions(text);
		expect(result).toContain('<a href="https://example.com"');
		expect(result).toContain('<a href="https://example.org"');
		expect(result).toContain('class="url"');
	});

	it('should add rel and target attributes to URLs', () => {
		const text = 'Visit https://example.com';
		const result = linkifyMentions(text);
		expect(result).toContain('rel="noopener noreferrer nofollow"');
		expect(result).toContain('target="_blank"');
	});

	it('should truncate long URLs', () => {
		const text = 'Visit https://example.com/very/long/path/that/should/be/truncated';
		const result = linkifyMentions(text, { maxUrlLength: 20 });
		expect(result).toContain('example.com/very/...');
	});

	it('should handle custom base URLs', () => {
		const text = '@user #hashtag';
		const result = linkifyMentions(text, {
			mentionBaseUrl: 'https://mastodon.social/@',
			hashtagBaseUrl: 'https://mastodon.social/tags/',
		});
		expect(result).toContain('href="https://mastodon.social/@user"');
		expect(result).toContain('href="https://mastodon.social/tags/hashtag"');
	});

	it('should handle Unicode hashtags', () => {
		const text = '#日本語 #中文 #한글';
		const result = linkifyMentions(text);
		expect(result).toContain('#日本語</a>');
		expect(result).toContain('#中文</a>');
		expect(result).toContain('#한글</a>');
	});

	it('should escape HTML in text', () => {
		const text = '<script>alert("XSS")</script> @user';
		const result = linkifyMentions(text);
		expect(result).not.toContain('<script>');
		expect(result).toContain('&lt;script&gt;');
	});

	it('should handle mixed content', () => {
		const text = 'Hey @alice, check out #webdev at https://dev.to';
		const result = linkifyMentions(text);
		expect(result).toContain('@alice</a>');
		expect(result).toContain('#webdev</a>');
		expect(result).toContain('https://dev.to</a>');
	});
});

describe('extractMentions', () => {
	it('should extract mentions from text', () => {
		const text = 'Hello @user and @other@mastodon.social';
		const mentions = extractMentions(text);
		expect(mentions).toEqual(['user', 'other@mastodon.social']);
	});

	it('should remove duplicate mentions', () => {
		const text = '@user mentioned @user again';
		const mentions = extractMentions(text);
		expect(mentions).toEqual(['user']);
	});

	it('should handle text without mentions', () => {
		const text = 'No mentions here';
		const mentions = extractMentions(text);
		expect(mentions).toEqual([]);
	});
});

describe('extractHashtags', () => {
	it('should extract hashtags from text', () => {
		const text = 'Topics: #javascript #typescript #webdev';
		const hashtags = extractHashtags(text);
		expect(hashtags).toEqual(['javascript', 'typescript', 'webdev']);
	});

	it('should remove duplicate hashtags', () => {
		const text = '#js is the same as #js';
		const hashtags = extractHashtags(text);
		expect(hashtags).toEqual(['js']);
	});

	it('should handle Unicode hashtags', () => {
		const text = '#日本語 #中文';
		const hashtags = extractHashtags(text);
		expect(hashtags).toEqual(['日本語', '中文']);
	});
});

describe('extractUrls', () => {
	it('should extract URLs from text', () => {
		const text = 'Visit https://example.com and http://test.org';
		const urls = extractUrls(text);
		expect(urls).toEqual(['https://example.com', 'http://test.org']);
	});

	it('should add https to URLs without protocol', () => {
		const text = 'Visit example.com';
		const urls = extractUrls(text);
		expect(urls).toEqual(['https://example.com']);
	});

	it('should remove duplicate URLs', () => {
		const text = 'example.com and example.com again';
		const urls = extractUrls(text);
		expect(urls).toEqual(['https://example.com']);
	});

	it('should skip invalid URLs', () => {
		const text = 'Not a URL: http://';
		const urls = extractUrls(text);
		expect(urls).toEqual([]);
	});
});

describe('has* functions', () => {
	it('should detect mentions', () => {
		expect(hasMentions('@user hello')).toBe(true);
		expect(hasMentions('no mentions')).toBe(false);
	});

	it('should detect hashtags', () => {
		expect(hasHashtags('#topic here')).toBe(true);
		expect(hasHashtags('no hashtags')).toBe(false);
	});

	it('should detect URLs', () => {
		expect(hasUrls('Visit https://example.com')).toBe(true);
		expect(hasUrls('no urls here')).toBe(false);
	});
});
