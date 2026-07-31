import { afterEach, describe, expect, it, vi } from 'vitest';
import { hydrate, unmount } from 'svelte';
import ContentRenderer from '../../src/components/ContentRenderer.svelte';
import { CONTENT_CASES, SSR_BODIES, expectedBody } from './ContentRenderer.expected';

/**
 * Genuine SSR -> hydrate coverage: each container is seeded with the real server
 * output (`SSR_BODIES`, asserted against `render()` in the SSR suite) and then
 * hydrated. Svelte reports hydration mismatches through the console, so these
 * assert a clean console as well as the resulting DOM.
 */
describe('ContentRenderer hydration', () => {
	const mounted: ReturnType<typeof hydrate>[] = [];

	afterEach(() => {
		for (const component of mounted.splice(0)) {
			try {
				unmount(component);
			} catch {
				// Teardown noise is not the subject of these assertions.
			}
		}
		vi.restoreAllMocks();
		document.body.innerHTML = '';
	});

	for (const testCase of CONTENT_CASES) {
		it(`hydrates server output for ${testCase.name} without mismatch`, () => {
			const ssr = SSR_BODIES[testCase.name];
			expect(ssr, `missing SSR fixture for ${testCase.name}`).toBeTruthy();

			const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const target = document.createElement('div');
			target.innerHTML = ssr as string;
			document.body.appendChild(target);

			const content = target.querySelector('.content');
			expect(content).not.toBeNull();
			// The server-rendered node, captured before hydration runs.
			const serverNode = content as HTMLElement;

			mounted.push(
				hydrate(ContentRenderer, {
					target,
					props: {
						content: testCase.content,
						mentions: testCase.mentions,
						tags: testCase.tags,
					},
				})
			);

			const hydrated = target.querySelector('.content') as HTMLElement | null;
			expect(hydrated).not.toBeNull();

			// Hydration adopted the server DOM rather than replacing it.
			expect(hydrated).toBe(serverNode);

			const expected = expectedBody(testCase.content, {
				mentions: testCase.mentions,
				tags: testCase.tags,
			});
			expect((hydrated as HTMLElement).innerHTML).toContain(expected);

			for (const fragment of testCase.forbidden) {
				expect((hydrated as HTMLElement).innerHTML).not.toContain(fragment);
			}

			expect(errorSpy).not.toHaveBeenCalled();
			expect(warnSpy).not.toHaveBeenCalled();
		});
	}

	it('keeps the hydrated body interactive', () => {
		const name = 'mention-bearing content with known mentions';
		const testCase = CONTENT_CASES.find((c) => c.name === name);
		expect(testCase).toBeDefined();

		const target = document.createElement('div');
		target.innerHTML = SSR_BODIES[name] as string;
		document.body.appendChild(target);

		mounted.push(
			hydrate(ContentRenderer, {
				target,
				props: {
					content: testCase?.content,
					mentions: testCase?.mentions,
				},
			})
		);

		const mention = target.querySelector('a.mention') as HTMLAnchorElement | null;
		expect(mention?.getAttribute('href')).toBe('https://example.com/@alice');
		expect(mention?.textContent).toBe('@alice');
	});
});
