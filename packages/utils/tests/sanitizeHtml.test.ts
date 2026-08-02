import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeForPreview, type SanitizeOptions } from '../src/sanitizeHtml';

function parseSanitized(input: string, options?: SanitizeOptions) {
	const output = sanitizeHtml(input, options);
	const parsed = new DOMParser().parseFromString(output, 'text/html');
	const elements = Array.from(parsed.body.querySelectorAll('*'));
	const eventHandlerAttributes = elements.flatMap((element) =>
		Array.from(element.attributes)
			.filter((attribute) => attribute.name.toLowerCase().startsWith('on'))
			.map((attribute) => `${attribute.name}=${attribute.value}`)
	);

	return {
		output,
		elements,
		eventHandlerAttributes,
		anchor: parsed.body.querySelector('a'),
	};
}

function expectOnlySafeAnchor(input: string, options?: SanitizeOptions): HTMLAnchorElement {
	const { elements, eventHandlerAttributes, anchor } = parseSanitized(input, options);

	expect(elements.map((element) => element.tagName.toLowerCase())).toEqual(['a']);
	expect(eventHandlerAttributes).toEqual([]);
	expect(anchor).not.toBeNull();

	return anchor as HTMLAnchorElement;
}

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

	it.each([
		['double-quoted attributes', '<a href="https://x.test" title="a > b">Link</a>'],
		['single-quoted attributes', "<a href='https://x.test' title='a > b'>Link</a>"],
		['unquoted attributes', '<a href=https://x.test title=a&#32;&#62;&#32;b>Link</a>'],
	])('hardens external links with %s containing > in the title', (_case, input) => {
		const anchor = expectOnlySafeAnchor(input);

		expect(anchor.getAttribute('title')).toBe('a > b');
		expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.textContent).toBe('Link');
	});

	it('stays structurally safe when class contains >', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="https://x.test" class="mention > remote">Classed link</a>',
			{ allowedAttributes: ['href', 'className', 'rel', 'target'] }
		);

		expect(anchor.getAttribute('class')).toBe('mention > remote');
		expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.textContent).toBe('Classed link');
	});

	it('preserves authored rel tokens while hardening an external link', () => {
		const input = '<a href="https://x.test" rel="author">Authored link</a>';
		const { output, anchor } = parseSanitized(input);

		expect(anchor?.getAttribute('rel')).toBe('author noopener noreferrer');
		expect(anchor?.getAttribute('target')).toBe('_blank');
		expect(output.match(/\srel=/gu)).toHaveLength(1);
		expect(output.match(/\starget=/gu)).toHaveLength(1);
	});

	it.each([
		['href-first', '<a href="https://evil.test" rel="opener">x</a>'],
		['rel-first', '<a rel="opener" href="https://evil.test">x</a>'],
	])('drops rel=opener when hardening an external link with %s attributes', (_order, input) => {
		const anchor = expectOnlySafeAnchor(input);
		const tokens = anchor.getAttribute('rel')?.split(/\s+/u) ?? [];

		expect(new Set(tokens)).toEqual(new Set(['noopener', 'noreferrer']));
		expect(tokens).not.toContain('opener');
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it('preserves the Fediverse rel=me token while hardening an external link', () => {
		const anchor = expectOnlySafeAnchor('<a href="https://evil.test" rel="me">x</a>');

		expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['me', 'noopener', 'noreferrer']);
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it('does not duplicate an existing rel=noopener token', () => {
		const anchor = expectOnlySafeAnchor('<a href="https://evil.test" rel="noopener">x</a>');
		const tokens = anchor.getAttribute('rel')?.split(/\s+/u) ?? [];

		expect(tokens).toEqual(['noopener', 'noreferrer']);
		expect(tokens.filter((token) => token === 'noopener')).toHaveLength(1);
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it.each([
		['protocol-relative', '<a href="//evil.test" target="_blank">x</a>'],
		['two leading backslashes', `<a href="${String.raw`\\evil.test`}" target="_blank">x</a>`],
	])('hardens an authored blank target for a %s href', (_case, input) => {
		const anchor = expectOnlySafeAnchor(input);
		const tokens = anchor.getAttribute('rel')?.split(/\s+/u) ?? [];

		expect(new Set(tokens)).toEqual(new Set(['noopener', 'noreferrer']));
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it.each([
		['protocol-relative', '//evil.test'],
		['two leading backslashes', String.raw`\\evil.test`],
		['slash-backslash', String.raw`/\evil.test`],
		['backslash-slash', String.raw`\/evil.test`],
		['leading space', ' //evil.test'],
		['leading tab', '\t//evil.test'],
	])('opens and hardens a normalized external %s href', (_case, href) => {
		const anchor = expectOnlySafeAnchor(`<a href="${href}">x</a>`);

		expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it('preserves an authored target on a same-origin single-backslash href without adding rel', () => {
		const anchor = expectOnlySafeAnchor(
			`<a href="${String.raw`\evil.test`}" target="_blank">x</a>`
		);

		expect(anchor.hasAttribute('rel')).toBe(false);
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it.each([
		['local path', '/local/path'],
		['relative path with an interior backslash', '/foo\\bar'],
		['fragment', '#fragment'],
		['mailto link', 'mailto:x@y.z'],
		['relative path', 'relative.html'],
	])('does not harden a %s', (_case, href) => {
		const anchor = expectOnlySafeAnchor(`<a href="${href}">x</a>`);

		expect(anchor.hasAttribute('rel')).toBe(false);
		expect(anchor.hasAttribute('target')).toBe(false);
	});

	it.each([
		['href-first', '<a href="https://x.test" title="a > b">intact link text</a>'],
		['title-first', '<a title="a > b" href="https://x.test">intact link text</a>'],
	])('preserves the effective DOM for %s attacker-controlled attribute order', (_order, input) => {
		const anchor = expectOnlySafeAnchor(input);

		expect(anchor.getAttribute('href')).toBe('https://x.test');
		expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.textContent).toBe('intact link text');
	});

	it('keeps an img event-handler breakout inside the sanitized anchor title', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="https://x.test" title="q><img src=z onerror=alert(1)>">click</a>'
		);

		expect(anchor.getAttribute('title')).toBe('q><img src=z onerror=alert(1)>');
		expect(anchor.textContent).toBe('click');
	});

	it('does not let an attribute breakout bypass the javascript protocol allow-list', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="https://x.test" title="q><a href=javascript:alert(1)>">click</a>'
		);

		expect(anchor.getAttribute('href')).toBe('https://x.test');
		expect(anchor.getAttribute('title')).toBe('q><a href=javascript:alert(1)>');
		expect(anchor.textContent).toBe('click');
	});

	it('neutralizes a direct javascript href through the protocol allow-list', () => {
		const anchor = expectOnlySafeAnchor('<a href="javascript:alert(1)">click</a>');

		expect(anchor.hasAttribute('href')).toBe(false);
		expect(anchor.hasAttribute('rel')).toBe(false);
		expect(anchor.hasAttribute('target')).toBe(false);
		expect(anchor.textContent).toBe('click');
	});

	it('keeps credential-form markup inside the sanitized anchor title', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="https://x.test" title="q><form><input type=password>">click</a>'
		);

		expect(anchor.getAttribute('title')).toBe('q><form><input type=password>');
		expect(anchor.textContent).toBe('click');
	});

	it.each([
		[
			'rel',
			'<a href="https://x.test" title="q><a rel=opener href=https://attacker.test>">click</a>',
		],
		[
			'target',
			'<a href="https://x.test" title="q><a target=attacker href=https://attacker.test>">click</a>',
		],
	])(
		'does not materialize attacker-chosen %s values from an attribute breakout',
		(_case, input) => {
			const anchor = expectOnlySafeAnchor(input);

			expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
			expect(anchor.getAttribute('target')).toBe('_blank');
			expect(anchor.getAttribute('href')).toBe('https://x.test');
		}
	);

	it.each([
		[
			'rel',
			'<a href="https://x.test" rel="q><img src=z onerror=alert(1)>">click</a>',
			'q><img src=z onerror=alert(1)> noopener noreferrer',
		],
		[
			'target',
			'<a href="https://x.test" target="q><img src=z onerror=alert(1)>">click</a>',
			'q><img src=z onerror=alert(1)>',
		],
	])('keeps authored %s breakout markup inside that attribute value', (attribute, input, value) => {
		const anchor = expectOnlySafeAnchor(input);

		expect(anchor.getAttribute(attribute)).toBe(value);
		expect(anchor.textContent).toBe('click');
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
