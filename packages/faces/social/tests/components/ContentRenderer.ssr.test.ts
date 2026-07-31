// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import ContentRenderer from '../../src/components/ContentRenderer.svelte';
import { CONTENT_CASES, MENTIONS, expectedBody } from './ContentRenderer.expected';

/**
 * Before #926 the status body was written by a Svelte action (`use:setHtml`).
 * Actions do not run during SSR, so the server emitted an empty container and
 * no status body ever server-rendered.
 */
describe('ContentRenderer SSR', () => {
	it('server-renders the status body (previously absent)', () => {
		const { body } = render(ContentRenderer, {
			props: { content: '<p>Hello <strong>world</strong></p>' },
		});

		expect(body).toContain('<p>Hello <strong>world</strong></p>');
	});

	it('does not escape sanitized markup into literal tags', () => {
		const { body } = render(ContentRenderer, {
			props: { content: '<p>Hello <strong>world</strong></p>' },
		});

		expect(body).not.toContain('&lt;p&gt;');
		expect(body).not.toContain('&lt;strong&gt;');
	});

	for (const testCase of CONTENT_CASES) {
		it(`server-renders ${testCase.name}`, () => {
			const { body } = render(ContentRenderer, {
				props: {
					content: testCase.content,
					mentions: testCase.mentions,
					tags: testCase.tags,
				},
			});

			for (const fragment of testCase.expected) {
				expect(body).toContain(fragment);
			}
			for (const fragment of testCase.forbidden) {
				expect(body).not.toContain(fragment);
			}
		});
	}

	it('renders the spoiler control and hides the body until expanded', () => {
		const { body } = render(ContentRenderer, {
			props: { content: '<p>Hidden</p>', spoilerText: 'CW: test' },
		});

		expect(body).toContain('CW: test');
		expect(body).toContain('Show more');
		expect(body).not.toContain('<p>Hidden</p>');
	});

	it('server-renders the body when a spoiler is present but not collapsed', () => {
		const { body } = render(ContentRenderer, {
			props: { content: '<p>Shown</p>', spoilerText: 'CW: test', collapsed: false },
		});

		expect(body).toContain('<p>Shown</p>');
	});

	it('neutralizes unsafe markup on the server', () => {
		const { body } = render(ContentRenderer, {
			props: {
				content:
					'<p onclick="alert(1)">hi</p><script>alert(2)</script><img src=x onerror=alert(3)>',
			},
		});

		expect(body).not.toContain('<script');
		expect(body).not.toContain('onerror');
		expect(body).not.toContain('onclick');
		expect(body).toContain('hi');
	});

	it('does not emit javascript: hrefs from unsafe mention URLs on the server', () => {
		const { body } = render(ContentRenderer, {
			props: {
				content: '<p>Hello @evil</p>',
				mentions: [
					{ id: 'm1', username: 'evil', acct: 'evil@example.com', url: 'javascript:alert(1)' },
				],
			},
		});

		expect(body).not.toContain('javascript:');
		expect(body).toContain('@evil');
	});

	// The DOM suite asserts the hydrated `.content` element against this same
	// `expectedBody()` output, so server and client provably emit one markup.
	for (const testCase of CONTENT_CASES) {
		it(`emits exactly the expected body markup for ${testCase.name}`, () => {
			const { body } = render(ContentRenderer, {
				props: {
					content: testCase.content,
					mentions: testCase.mentions,
					tags: testCase.tags,
				},
			});

			expect(body).toContain(
				expectedBody(testCase.content, {
					mentions: testCase.mentions,
					tags: testCase.tags,
				})
			);
		});
	}

	it('is deterministic across repeated server renders', () => {
		const props = {
			content: '<p>Hello <strong>world</strong> @alice</p>',
			mentions: MENTIONS,
		};

		expect(render(ContentRenderer, { props }).body).toBe(render(ContentRenderer, { props }).body);
	});
});
