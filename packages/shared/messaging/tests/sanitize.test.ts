import { describe, expect, it } from 'vitest';
import { sanitizeMessageHtml, sanitizeMessagePreview } from '../src/sanitize.js';

describe('messaging sanitization', () => {
	it('extracts decoded plain text without rendering markup', () => {
		expect(sanitizeMessagePreview('<p>Tom &amp; <strong>Jerry</strong></p>')).toBe('Tom & Jerry');
		expect(sanitizeMessagePreview('<p>if a &lt; b then ship</p>')).toBe('if a < b then ship');
	});

	it('drops style elements together with their CSS text from both surfaces', () => {
		const dirty = '<style>body{display:none}</style><p>Visible message</p>';

		expect(sanitizeMessageHtml(dirty)).toBe('<p>Visible message</p>');
		expect(sanitizeMessagePreview(dirty)).toBe('Visible message');
		expect(sanitizeMessageHtml('<style>body{display:none}')).toBe('');
	});

	it('preserves rel tokens and adds whole-token blank-target protections', () => {
		const sanitized = sanitizeMessageHtml(
			'<a href="https://example.test" rel="nofollow" target="_blank">link</a>'
		);

		expect(sanitized).toContain('rel="nofollow noopener noreferrer"');
		expect(sanitized).toContain('target="_blank"');
	});

	it.each([
		['xnoopener ynoreferrer', 'xnoopener ynoreferrer noopener noreferrer'],
		['xnoopener', 'xnoopener noopener noreferrer'],
	])('does not treat substring-decoy rel tokens %s as protections', (rel, expectedRel) => {
		const sanitized = sanitizeMessageHtml(
			`<a href="https://example.test" rel="${rel}" target="_blank">link</a>`
		);

		expect(sanitized).toContain(`rel="${expectedRel}"`);
	});

	it('does not mistake other attribute values for rel or target attributes', () => {
		const sanitized = sanitizeMessageHtml(
			'<a href="https://example.test" title="rel= target=">link</a>'
		);

		expect(sanitized).toContain('target="_blank"');
		expect(sanitized).toContain('rel="noopener noreferrer"');
	});

	it('truncates by Unicode code point rather than splitting surrogate pairs', () => {
		const preview = sanitizeMessagePreview(`${'a'.repeat(199)}😀tail`, 200);

		expect(preview).toBe(`${'a'.repeat(199)}😀...`);
		expect(preview).not.toContain('\uFFFD');
	});

	it.each([
		['textarea', '<textarea><img src=x onerror=alert(1)></textarea><p>a</p>', '<img'],
		['title', '<title>SECRET</title><p>a</p>', 'SECRET'],
	])('drops %s raw text from message previews', (_element, dirty, leakedText) => {
		const preview = sanitizeMessagePreview(dirty);

		expect(preview).toBe('a');
		expect(preview).not.toContain(leakedText);
	});

	it('continues to drop script and style contents from previews', () => {
		const preview = sanitizeMessagePreview(
			'<script>SECRET_SCRIPT</script><style>SECRET_STYLE</style><p>Visible</p>'
		);

		expect(preview).toBe('Visible');
		expect(preview).not.toContain('SECRET_SCRIPT');
		expect(preview).not.toContain('SECRET_STYLE');
	});
});
