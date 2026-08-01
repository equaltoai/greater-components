import { test, expect } from '@playwright/test';

/**
 * `linkifyHtml` validates a possibly-relative href by resolving it against a
 * sentinel origin and rejecting anything that leaves that origin. This spec pins
 * the browser half of that policy: it asks Chromium what it actually does with
 * each shape, so the Node-side assertions in
 * `packages/utils/tests/linkifyHtml.test.ts` rest on real resolution rather than
 * on the URL spec as we read it. Keep the two lists in step.
 */

/** Shapes `linkifyHtml` rejects. Chromium must resolve every one off-origin. */
const OFF_ORIGIN_SHAPES = [
	'//evil.example/p',
	'\\\\evil.example\\p',
	'/\\evil.example/p',
	'\\/evil.example/p',
	'/\n/evil.example/p',
];

/** Shapes `linkifyHtml` accepts as relative. Chromium must keep them on-origin. */
const SAME_ORIGIN_SHAPES = ['/users/a', 'users/a', './users/a', '?user=a', '#a'];

/** Shapes `linkifyHtml` accepts as explicit absolute targets. */
const EXPLICIT_ABSOLUTE_SHAPES = ['https://example.com/@a', 'http://example.com/@a'];

/** Resolve each string the way a rendered anchor would, in the page itself. */
function resolveInPage(values: string[]): string[] {
	return values.map((value) => {
		const anchor = document.createElement('a');
		anchor.setAttribute('href', value);
		document.body.append(anchor);
		const resolved = anchor.href;
		anchor.remove();
		return resolved;
	});
}

test.describe('generated href URL policy (Chromium resolution)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('body[data-playground-hydrated="true"]');
	});

	test('rejected shapes really do resolve to another origin', async ({ page }) => {
		const pageOrigin = new URL(page.url()).origin;
		const resolved = await page.evaluate(resolveInPage, OFF_ORIGIN_SHAPES);

		expect(resolved).toHaveLength(OFF_ORIGIN_SHAPES.length);
		for (const [index, href] of resolved.entries()) {
			// Each shape reads as relative but addresses evil.example once parsed,
			// which is why returning the caller's string unresolved was a bypass.
			const label = JSON.stringify(OFF_ORIGIN_SHAPES[index]);
			expect(new URL(href).origin, `${label} must leave the page origin`).not.toBe(pageOrigin);
			expect(new URL(href).hostname, `${label} must address evil.example`).toBe('evil.example');
		}
	});

	test('accepted relative shapes stay on the page origin', async ({ page }) => {
		const pageOrigin = new URL(page.url()).origin;
		const resolved = await page.evaluate(resolveInPage, SAME_ORIGIN_SHAPES);

		expect(resolved).toHaveLength(SAME_ORIGIN_SHAPES.length);
		for (const [index, href] of resolved.entries()) {
			const label = JSON.stringify(SAME_ORIGIN_SHAPES[index]);
			expect(new URL(href).origin, `${label} must stay on the page origin`).toBe(pageOrigin);
		}
	});

	test('accepted absolute shapes keep their declared scheme and host', async ({ page }) => {
		const resolved = await page.evaluate(resolveInPage, EXPLICIT_ABSOLUTE_SHAPES);

		expect(resolved).toHaveLength(EXPLICIT_ABSOLUTE_SHAPES.length);
		for (const [index, href] of resolved.entries()) {
			const declared = new URL(EXPLICIT_ABSOLUTE_SHAPES[index] as string);
			expect(new URL(href).protocol).toBe(declared.protocol);
			expect(new URL(href).hostname).toBe(declared.hostname);
		}
	});

	test('every href the demo status body renders uses an allow-listed scheme', async ({ page }) => {
		// `/status` is the route whose demo body carries a linkified mention, so it
		// is where the policy can be checked against real rendered output.
		await page.goto('/status');
		await page.waitForSelector('body[data-playground-hydrated="true"]');

		const anchors = await page.$$eval('.content a[href], .status-content a[href]', (elements) =>
			elements.map((element) => ({
				protocol: (element as HTMLAnchorElement).protocol,
				origin: (element as HTMLAnchorElement).origin,
				attribute: element.getAttribute('href') ?? '',
			}))
		);

		expect(anchors.length).toBeGreaterThan(0);
		const pageOrigin = new URL(page.url()).origin;

		for (const anchor of anchors) {
			expect(['http:', 'https:', 'mailto:']).toContain(anchor.protocol);
			// A relative href must not have acquired another origin on the way out.
			if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(anchor.attribute)) {
				expect(anchor.origin, `${anchor.attribute} must stay on the page origin`).toBe(pageOrigin);
			}
		}
	});
});
