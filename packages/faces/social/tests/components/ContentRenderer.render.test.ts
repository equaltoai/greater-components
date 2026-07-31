import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ContentRenderer from '../../src/components/ContentRenderer.svelte';
import { CONTENT_CASES, MENTIONS, expectedBody } from './ContentRenderer.expected';

function contentHtml(container: HTMLElement): string {
	const node = container.querySelector('.content');
	expect(node).not.toBeNull();
	return (node as HTMLElement).innerHTML;
}

describe('ContentRenderer client rendering', () => {
	it('renders sanitized markup instead of escaped literal tags (issue #926)', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>Hello <strong>world</strong></p>',
		});

		expect(container.querySelector('.content strong')?.textContent).toBe('world');
		expect(contentHtml(container)).not.toContain('&lt;p&gt;');
		expect(container.textContent).not.toContain('<p>');
	});

	/**
	 * The SSR suite asserts the server body contains exactly this markup, so
	 * matching it here means SSR output and hydrated DOM are the same bytes.
	 */
	for (const testCase of CONTENT_CASES) {
		it(`matches the server-rendered body for ${testCase.name}`, () => {
			const { container } = render(ContentRenderer, {
				content: testCase.content,
				mentions: testCase.mentions,
				tags: testCase.tags,
			});

			const expected = expectedBody(testCase.content, {
				mentions: testCase.mentions,
				tags: testCase.tags,
			});

			expect(contentHtml(container)).toBe(expected);

			for (const fragment of testCase.forbidden) {
				expect(contentHtml(container)).not.toContain(fragment);
			}
		});
	}

	it('linkifies a mention while preserving surrounding markup', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>Hello <strong>world</strong> @alice</p>',
			mentions: MENTIONS,
		});

		const mention = container.querySelector('a.mention') as HTMLAnchorElement | null;

		expect(container.querySelector('.content strong')?.textContent).toBe('world');
		expect(mention?.getAttribute('href')).toBe('https://example.com/@alice');
		expect(mention?.textContent).toBe('@alice');
	});

	it('does not linkify inside code blocks', () => {
		const { container } = render(ContentRenderer, {
			content: '<pre><code>@alice #svelte</code></pre>',
		});

		expect(container.querySelector('code a')).toBeNull();
		expect(container.querySelector('code')?.textContent).toBe('@alice #svelte');
	});

	it('does not nest a link inside an existing anchor', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>See <a href="https://example.com/@alice">@alice</a></p>',
		});

		expect(container.querySelectorAll('.content a')).toHaveLength(1);
		expect(container.querySelector('.content a a')).toBeNull();
	});

	it('updates rendered output when content changes', async () => {
		const { container, rerender } = render(ContentRenderer, {
			content: '<p>First <em>body</em></p>',
		});

		expect(container.querySelector('.content em')?.textContent).toBe('body');

		await rerender({ content: '<p>Second <strong>body</strong></p>' });

		expect(container.querySelector('.content strong')?.textContent).toBe('body');
		expect(container.querySelector('.content em')).toBeNull();
	});
});

describe('ContentRenderer XSS regressions', () => {
	it('strips script tags and event handlers from raw unsanitized input', () => {
		const { container } = render(ContentRenderer, {
			content: '<p onclick="alert(1)">hi</p><script>alert(2)</script><img src=x onerror=alert(3)>',
		});

		const html = contentHtml(container);

		expect(container.querySelector('script')).toBeNull();
		expect(container.querySelector('img')).toBeNull();
		expect(html).not.toContain('onerror');
		expect(html).not.toContain('onclick');
		expect(container.querySelector('.content p')?.textContent).toBe('hi');
	});

	it('drops javascript: hrefs present in the source markup', () => {
		const { container } = render(ContentRenderer, {
			content: '<p><a href="javascript:alert(1)">click</a></p>',
		});

		// The sanitizer strips the unsafe href outright, leaving inert link text.
		expect(contentHtml(container)).not.toContain('javascript:');
		expect(container.querySelector('.content a')?.getAttribute('href') ?? '').not.toMatch(
			/^javascript:/i
		);
		expect(container.textContent).toContain('click');
	});

	it('does not linkify mentions or tags whose URL uses an unsafe scheme', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>Hello @evil #bad</p>',
			mentions: [
				{ id: 'm1', username: 'evil', acct: 'evil@example.com', url: 'javascript:alert(1)' },
			],
			tags: [{ name: 'bad', url: 'javascript:alert(1)' }],
		});

		expect(container.querySelector('.content a')).toBeNull();
		expect(contentHtml(container)).not.toContain('javascript:');
		expect(container.textContent).toContain('@evil');
	});

	it('escapes quotes in generated hrefs so attributes cannot break out', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>Hello @a</p>',
			mentions: [
				{
					id: 'm1',
					username: 'a',
					acct: 'a@example.com',
					url: 'https://example.com/"onmouseover="alert(1)',
				},
			],
		});

		const anchors = container.querySelectorAll('.content a');

		// Exactly one anchor: the injected quote did not open a second element.
		expect(anchors).toHaveLength(1);
		expect(anchors[0]?.getAttribute('onmouseover')).toBeNull();
		expect(anchors[0]?.getAttribute('href')).toBe('https://example.com/"onmouseover="alert(1)');
	});

	it('keeps text that resembles markup inert', () => {
		const { container } = render(ContentRenderer, {
			content: '<p>a &lt;script&gt;alert(1)&lt;/script&gt; @alice</p>',
		});

		expect(container.querySelector('script')).toBeNull();
		expect(container.querySelector('.content p')?.textContent).toContain('<script>alert(1)');
	});
});
