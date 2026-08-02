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
});
