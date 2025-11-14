import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeForPreview } from '../src/sanitizeHtml';

describe('sanitizeHtml', () => {
	it('should allow safe HTML tags', () => {
		const input = '<p>Hello <strong>world</strong>!</p>';
		const output = sanitizeHtml(input);
		expect(output).toBe('<p>Hello <strong>world</strong>!</p>');
	});

	it('should remove dangerous tags', () => {
		const input = '<p>Hello</p><script>alert("XSS")</script>';
		const output = sanitizeHtml(input);
		expect(output).toBe('<p>Hello</p>');
	});

	it('should remove dangerous attributes', () => {
		const input = '<p onclick="alert(\'XSS\')">Hello</p>';
		const output = sanitizeHtml(input);
		expect(output).toBe('<p>Hello</p>');
	});

	it('should add rel and target to external links', () => {
		const input = '<a href="https://example.com">Link</a>';
		const output = sanitizeHtml(input);
		expect(output).toContain('rel="noopener noreferrer"');
		expect(output).toContain('target="_blank"');
	});

	it('should preserve internal links', () => {
		const input = '<a href="/internal">Internal</a>';
		const output = sanitizeHtml(input);
		expect(output).toBe('<a href="/internal">Internal</a>');
	});

	it('should handle custom allowed tags', () => {
		const input = '<div><span>Hello</span><custom>World</custom></div>';
		const output = sanitizeHtml(input, {
			allowedTags: ['div', 'span'],
		});
		expect(output).toBe('<div><span>Hello</span>World</div>');
	});

	it('should block data URIs by default', () => {
		const input = '<img src="data:text/html,<script>alert(\'XSS\')</script>">';
		const output = sanitizeHtml(input);
		expect(output).toBe('');
	});

	it('should handle empty input', () => {
		expect(sanitizeHtml('')).toBe('');
	});

	it('should handle null/undefined gracefully', () => {
		expect(sanitizeHtml(null as unknown as string)).toBe('');
		expect(sanitizeHtml(undefined as unknown as string)).toBe('');
	});
});

describe('sanitizeForPreview', () => {
	it('should strip all HTML tags', () => {
		const input = '<p>Hello <strong>world</strong>!</p>';
		const output = sanitizeForPreview(input);
		expect(output).toBe('Hello world!');
	});

	it('should truncate long text', () => {
		const input = 'a'.repeat(300);
		const output = sanitizeForPreview(input, 200);
		expect(output).toHaveLength(203); // 200 + '...'
		expect(output.endsWith('...')).toBe(true);
	});

	it('should not truncate short text', () => {
		const input = 'Hello world';
		const output = sanitizeForPreview(input);
		expect(output).toBe('Hello world');
	});

	it('should handle entities', () => {
		const input = '<p>Hello</p>';
		const output = sanitizeForPreview(input);
		expect(output).toBe('Hello');
	});
});
