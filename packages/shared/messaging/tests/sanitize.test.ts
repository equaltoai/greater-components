import { describe, expect, it } from 'vitest';
import {
	sanitizeMessageHtml,
	sanitizeMessagePreview,
	stripSerializedMarkup,
} from '../src/sanitize.js';

const WHATWG_PREPARSE_EXTERNAL_HREF_CASES = [
	{ name: 'leading space', predicateHref: ' //evil.test/messages' },
	{ name: 'leading tab', predicateHref: '\t//evil.test/messages' },
	{ name: 'leading line breaks', predicateHref: '\n\r//evil.test/messages' },
	{ name: 'leading C0 control', predicateHref: '\x01//evil.test/messages' },
	{ name: 'tab between slashes', predicateHref: '/\t/evil.test/messages' },
	{ name: 'line feed between slashes', predicateHref: '/\n/evil.test/messages' },
	{ name: 'tab before backslash separator', predicateHref: '/\t\\evil.test/messages' },
	{
		name: 'entity-encoded tab',
		predicateHref: '\t//evil.test/messages',
		authoredHref: '&#9;//evil.test/messages',
	},
] as const;

const WHATWG_PREPARSE_EXTERNAL_HREF_MATRIX = WHATWG_PREPARSE_EXTERNAL_HREF_CASES.flatMap(
	({ name, predicateHref, ...hrefCase }) =>
		(['named', '_blank'] as const).map(
			(target) =>
				[
					name,
					predicateHref,
					'authoredHref' in hrefCase ? hrefCase.authoredHref : predicateHref,
					target,
				] as const
		)
);

function expectOnlySafeAnchor(dirty: string): HTMLAnchorElement {
	const sanitized = sanitizeMessageHtml(dirty);
	const parsed = new DOMParser().parseFromString(sanitized, 'text/html');
	const elements = Array.from(parsed.body.querySelectorAll('*'));

	expect(elements.map((element) => element.localName)).toEqual(['a']);
	expect(parsed.body.querySelector('img, form, input')).toBeNull();
	for (const element of elements) {
		expect(Array.from(element.attributes).map((attribute) => attribute.name)).not.toContainEqual(
			expect.stringMatching(/^on/iu)
		);
	}

	const anchor = elements[0];
	expect(anchor).toBeInstanceOf(HTMLAnchorElement);
	const href = anchor.getAttribute('href');
	if (href !== null) {
		expect(['http:', 'https:']).toContain(new URL(href, 'https://messages.test').protocol);
	}

	return anchor as HTMLAnchorElement;
}

function expectHardenedAnchor(
	dirty: string,
	expected: {
		attributes: string[];
		text: string;
		title?: string;
		target?: string;
		authorRelTokens?: string[];
	}
): HTMLAnchorElement {
	const anchor = expectOnlySafeAnchor(dirty);

	expect(Array.from(anchor.attributes, (attribute) => attribute.name).sort()).toEqual(
		[...expected.attributes].sort()
	);
	expect(anchor.textContent).toBe(expected.text);
	expect(anchor.getAttribute('title')).toBe(expected.title ?? null);
	expect(anchor.getAttribute('target')).toBe(expected.target ?? null);

	const relTokens = anchor.getAttribute('rel')?.split(/\s+/u).filter(Boolean) ?? [];
	for (const token of expected.authorRelTokens ?? []) {
		expect(relTokens).toContain(token);
	}
	expect(relTokens.filter((token) => token.toLowerCase() === 'noopener')).toHaveLength(1);
	expect(relTokens.filter((token) => token.toLowerCase() === 'noreferrer')).toHaveLength(1);

	return anchor;
}

describe('messaging sanitization', () => {
	it.each([
		['null', null],
		['undefined', undefined],
		['number', 42],
	])('returns empty output for a %s runtime value', (_case, dirty) => {
		expect(sanitizeMessageHtml(dirty as unknown as string)).toBe('');
		expect(sanitizeMessagePreview(dirty as unknown as string)).toBe('');
	});

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

	it.each([
		['opener noopener noreferrer', ['noopener', 'noreferrer']],
		['OPENER', ['noopener', 'noreferrer']],
		['Me Opener', ['Me', 'noopener', 'noreferrer']],
	] as const)('drops authored rel=%s case-insensitively', (rel, expectedRel) => {
		const anchor = expectOnlySafeAnchor(
			`<a href="https://evil.test" target="named" rel="${rel}">x</a>`
		);

		expect(anchor.getAttribute('target')).toBe('named');
		expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(expectedRel);
	});

	it('treats https:evil.test as a non-authority href under the shared predicate', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="https:evil.test" target="named" rel="opener">x</a>'
		);

		expect(anchor.getAttribute('href')).toBe('https:evil.test');
		expect(anchor.getAttribute('target')).toBe('named');
		expect(anchor.getAttribute('rel')).toBe('opener');
	});

	it.each([
		[
			'named target',
			'<a title="x" href="https://evil.test" target="named">link</a>',
			'<a title="x" href="https://evil.test" target="named" rel="noopener noreferrer">link</a>',
		],
		[
			'no target',
			'<a href="https://evil.test">link</a>',
			'<a href="https://evil.test" rel="noopener noreferrer">link</a>',
		],
		[
			'self target',
			'<a href="https://evil.test" target="_self">link</a>',
			'<a href="https://evil.test" target="_self" rel="noopener noreferrer">link</a>',
		],
	])('hardens an external link with a %s without changing its target', (_case, dirty, expected) => {
		expect(sanitizeMessageHtml(dirty)).toBe(expected);
	});

	it('preserves internal self-target links without adding an external-link rel', () => {
		expect(sanitizeMessageHtml('<a href="/messages/next" target="_self">next</a>')).toBe(
			'<a href="/messages/next" target="_self">next</a>'
		);
	});

	it.each(['_blank', 'named'])(
		'hardens protocol-relative links with the authored %s target',
		(target) => {
			const anchor = expectOnlySafeAnchor(
				`<a href="//evil.test/messages" target="${target}">external</a>`
			);

			expect(anchor.getAttribute('href')).toBe('//evil.test/messages');
			expect(anchor.getAttribute('target')).toBe(target);
			expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		}
	);

	it.each([
		['backslash pair', String.raw`\\evil.test/messages`],
		['slash-backslash pair', String.raw`/\evil.test/messages`],
		['backslash-slash pair', String.raw`\/evil.test/messages`],
	])('hardens browser-normalized protocol-relative links using a %s', (_case, href) => {
		for (const target of ['named', '_blank']) {
			const anchor = expectOnlySafeAnchor(`<a href="${href}" target="${target}">external</a>`);

			expect(anchor.getAttribute('href')).toBe(href);
			expect(anchor.getAttribute('target')).toBe(target);
			expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		}
	});

	it.each(WHATWG_PREPARSE_EXTERNAL_HREF_MATRIX)(
		'hardens a %s external href %j authored as %j after WHATWG pre-parse normalization with target %s',
		(_case, predicateHref, authoredHref, target) => {
			const anchor = expectOnlySafeAnchor(
				`<a href="${authoredHref}" target="${target}">external</a>`
			);

			// Numeric entities are decoded by the HTML parser before the predicate sees href.
			if (authoredHref.startsWith('&#9;')) {
				expect(anchor.getAttribute('href')).toBe(predicateHref);
			}
			expect(new URL(anchor.getAttribute('href') ?? '', 'https://messages.test').origin).toBe(
				'https://evil.test'
			);
			expect(anchor.getAttribute('target')).toBe(target);
			expect(anchor.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);
		}
	);

	it.each([' /local/path', '\t#frag', ' ../up'])(
		'keeps the parser-normalized internal href %j unhardened',
		(href) => {
			const anchor = expectOnlySafeAnchor(`<a href="${href}" target="named">internal</a>`);

			// Contract: classify the parser-trimmed value, but preserve the authored href. Leading
			// whitespace that still resolves internally must not receive external-link hardening.
			expect(new URL(anchor.getAttribute('href') ?? '', 'https://messages.test/base/').origin).toBe(
				'https://messages.test'
			);
			expect(anchor.getAttribute('target')).toBe('named');
			expect(anchor.getAttribute('rel')).toBeNull();
		}
	);

	it('pins the browser authority boundary for backslashes in relative-looking links', () => {
		const authorityShape = String.raw`/\foo/bar`;
		const internalPath = String.raw`/foo\bar`;

		// For special schemes, WHATWG URL parsing turns the first shape into //foo/bar,
		// whose host is `foo`; it is not a same-origin path and must be hardened.
		expect(new URL(authorityShape, 'https://messages.test/base').origin).toBe('https://foo');
		expect(sanitizeMessageHtml(`<a href="${authorityShape}" target="named">authority</a>`)).toBe(
			`<a href="${authorityShape}" target="named" rel="noopener noreferrer">authority</a>`
		);

		// A backslash after a non-separator path segment remains on the current host.
		expect(new URL(internalPath, 'https://messages.test/base').origin).toBe(
			'https://messages.test'
		);
		expect(sanitizeMessageHtml(`<a href="${internalPath}" target="named">internal</a>`)).toBe(
			`<a href="${internalPath}" target="named">internal</a>`
		);
	});

	it('pins the sanitizer contract for an uppercase HTTP scheme', () => {
		const anchor = expectOnlySafeAnchor(
			'<a href="HTTPS://evil.test/messages" target="_blank">filtered scheme</a>'
		);

		// rehype-sanitize currently treats protocol allow-list entries case-sensitively,
		// so it removes this href before the case-insensitive tree hardener runs.
		expect(Array.from(anchor.attributes, (attribute) => attribute.name)).toEqual(['target']);
		expect(anchor.getAttribute('href')).toBeNull();
		expect(anchor.getAttribute('rel')).toBeNull();
		expect(anchor.getAttribute('target')).toBe('_blank');
	});

	it.each(['/messages/next', '../thread', '#reply'])(
		'leaves the relative or internal link %s untouched',
		(href) => {
			expect(sanitizeMessageHtml(`<a href="${href}" target="named">next</a>`)).toBe(
				`<a href="${href}" target="named">next</a>`
			);
		}
	);

	it.each([
		[
			'href-first',
			'<a href="https://evil.test" title="a > b" target="_blank">intact link text</a>',
			'<a href="https://evil.test" title="a > b" target="_blank" rel="noopener noreferrer">intact link text</a>',
		],
		[
			'title-first',
			'<a title="a > b" href="https://evil.test" target="_blank">intact link text</a>',
			'<a title="a > b" href="https://evil.test" target="_blank" rel="noopener noreferrer">intact link text</a>',
		],
	])(
		'secures %s blank-target links when a quoted attribute contains >',
		(_order, dirty, expected) => {
			expect(sanitizeMessageHtml(dirty)).toBe(expected);
		}
	);

	it.each([
		[
			'img event-handler title breakout',
			'<a href="https://x.test" title="q><img src=z onerror=alert(1)>">click</a>',
		],
		[
			'javascript protocol title breakout',
			'<a href="https://x.test" title="q><a href=javascript:alert(1)>">click</a>',
		],
		[
			'credential-form title breakout',
			'<a href="https://x.test" title="q><form><input type=password>">click</a>',
		],
		[
			'rel attribute breakout',
			'<a href="https://x.test" rel="q><img src=z onerror=alert(1)>">click</a>',
		],
		[
			'target attribute breakout',
			'<a href="https://x.test" target="q><img src=z onerror=alert(1)>">click</a>',
		],
	])('keeps the sanitized output structurally safe after an %s attempt', (_attack, dirty) => {
		expectOnlySafeAnchor(dirty);
	});

	it.each([
		[
			'NEW-20 quote-parity payload',
			'<a href="https://evil.test" title=" rel=" target="a><img src=x onerror=alert(1)>">click me</a>',
			{
				attributes: ['href', 'title', 'target', 'rel'],
				text: 'click me',
				title: ' rel=',
				target: 'a><img src=x onerror=alert(1)>',
			},
		],
		[
			'latent authored-rel payload',
			'<a href="https://evil.test" rel="a><img src=x onerror=alert(1)>" target="_blank">click me</a>',
			{
				attributes: ['href', 'rel', 'target'],
				text: 'click me',
				target: '_blank',
				authorRelTokens: ['a><img', 'src=x', 'onerror=alert(1)>'],
			},
		],
	])('keeps %s inside the parsed anchor attribute set', (_case, dirty, expected) => {
		expectHardenedAnchor(dirty, expected);
	});

	it.each([
		[
			'double-quoted delimiter permutations inside a single-quoted title',
			'<a href="https://evil.test" title=\'rel=" target=a> marker\' target="named">double</a>',
			{
				attributes: ['href', 'title', 'target', 'rel'],
				text: 'double',
				title: 'rel=" target=a> marker',
				target: 'named',
			},
		],
		[
			'equals, quote, and greater-than permutations inside rel',
			'<a href="https://evil.test" rel=\'author = " > marker\' target="_blank">rel</a>',
			{
				attributes: ['href', 'rel', 'target'],
				text: 'rel',
				target: '_blank',
				authorRelTokens: ['author', '=', '"', '>', 'marker'],
			},
		],
		[
			'equals, quote, and greater-than permutations inside target',
			'<a href="https://evil.test" target=\'named=>"\'>target</a>',
			{
				attributes: ['href', 'target', 'rel'],
				text: 'target',
				target: 'named=>"',
			},
		],
		[
			'single-quoted attributes',
			"<a href='https://evil.test' title='single' target='named'>single</a>",
			{
				attributes: ['href', 'title', 'target', 'rel'],
				text: 'single',
				title: 'single',
				target: 'named',
			},
		],
		[
			'unquoted attributes',
			'<a href=https://evil.test title=unquoted target=named>unquoted</a>',
			{
				attributes: ['href', 'title', 'target', 'rel'],
				text: 'unquoted',
				title: 'unquoted',
				target: 'named',
			},
		],
		[
			'mixed-case tag and attribute names',
			'<A HrEf="https://evil.test" ReL="author" TaRgEt="named" TiTlE="mixed">mixed</A>',
			{
				attributes: ['href', 'rel', 'target', 'title'],
				text: 'mixed',
				title: 'mixed',
				target: 'named',
				authorRelTokens: ['author'],
			},
		],
	])('keeps the quote-parity battery safe for %s', (_case, dirty, expected) => {
		expectHardenedAnchor(dirty, expected);
	});

	it('hardens a normal external link without forcing it into a new browsing context', () => {
		expect(sanitizeMessageHtml('<a href="https://example.test">link</a>')).toBe(
			'<a href="https://example.test" rel="noopener noreferrer">link</a>'
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

		expect(sanitized).not.toContain('target="_blank"');
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

		// A single pass leaves the residue `<''>`; the fixpoint must remove that second-pass tag.
		expect(stripSerializedMarkup(serialized)).toBe('');
	});
});
