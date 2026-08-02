import { describe, expect, it } from 'vitest';
import {
	sanitizeMessageHtml,
	sanitizeMessagePreview,
	stripSerializedMarkup,
} from '../src/sanitize.js';

describe('messaging sanitization', () => {
	it('extracts decoded plain text without rendering markup', () => {
		expect(sanitizeMessagePreview('<p>Tom &amp; <strong>Jerry</strong></p>')).toBe('Tom & Jerry');
		expect(sanitizeMessagePreview('<p>if a &lt; b then ship</p>')).toBe('if a < b then ship');
	});

	it('does not leave partial-tag residue when an attribute contains a greater-than sign', () => {
		expect(sanitizeMessagePreview('<p title="a > b">Visible message</p>')).toBe('Visible message');
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

	it('secures blank-target links when an earlier quoted attribute contains >', () => {
		const dirty = '<a title="a > b" href="https://evil.test" target="_blank">intact link text</a>';

		expect(sanitizeMessageHtml(dirty)).toBe(
			'<a title="a > b" href="https://evil.test" target="_blank" rel="noopener noreferrer">intact link text</a>'
		);
	});

	it('keeps normal external-link hardening byte-identical', () => {
		expect(sanitizeMessageHtml('<a href="https://example.test">link</a>')).toBe(
			'<a href="https://example.test" rel="noopener noreferrer" target="_blank">link</a>'
		);
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
		['textarea', '<textarea>LEAK_<img src=x onerror=alert(1)></textarea><p>Visible</p>'],
		['title', '<title>LEAK_<img src=x onerror=alert(1)></title><p>Visible</p>'],
		['iframe', '<iframe>LEAK_<img src=x onerror=alert(1)></iframe><p>Visible</p>'],
		['noembed', '<noembed>LEAK_<img src=x onerror=alert(1)></noembed><p>Visible</p>'],
		['noframes', '<noframes>LEAK_<img src=x onerror=alert(1)></noframes><p>Visible</p>'],
		['xmp', '<xmp>LEAK_<img src=x onerror=alert(1)></xmp><p>Visible</p>'],
	])('drops %s raw text and markup from message bodies and previews', (element, dirty) => {
		const body = sanitizeMessageHtml(dirty);
		const preview = sanitizeMessagePreview(dirty);

		expect(body).toBe('<p>Visible</p>');
		expect(preview).toBe('Visible');
		expect(body).not.toContain(`<${element}`);
		expect(body).not.toContain('LEAK_');
		expect(body).not.toContain('onerror');
		expect(preview).not.toContain('LEAK_');
		expect(preview).not.toContain('<img');
	});

	it('drops plaintext and everything it consumes from message bodies and previews', () => {
		const dirty = '<p>Visible</p><plaintext>LEAK_<img src=x onerror=alert(1)>';
		const body = sanitizeMessageHtml(dirty);
		const preview = sanitizeMessagePreview(dirty);

		expect(body).toBe('<p>Visible</p>');
		expect(preview).toBe('Visible');
		expect(body).not.toContain('<plaintext');
		expect(body).not.toContain('LEAK_');
		expect(body).not.toContain('onerror');
		expect(preview).not.toContain('LEAK_');
		expect(preview).not.toContain('<img');
	});

	it('continues to drop script and style contents from previews', () => {
		const preview = sanitizeMessagePreview(
			'<script>SECRET_SCRIPT</script><style>SECRET_STYLE</style><p>Visible</p>'
		);

		expect(preview).toBe('Visible');
		expect(preview).not.toContain('SECRET_SCRIPT');
		expect(preview).not.toContain('SECRET_STYLE');
	});

	it('iterates serialized markup stripping until a second-pass tag is gone', () => {
		const serialized = `<'<"'">'>`;

		expect(serialized.replace(/<(?:(?:"[^"]*")|(?:'[^']*')|[^'">])*>/gu, '')).toBe(`<''>`);
		expect(stripSerializedMarkup(serialized)).toBe('');
	});
});
