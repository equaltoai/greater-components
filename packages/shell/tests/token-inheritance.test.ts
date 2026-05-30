/**
 * Regression coverage for GC-14.
 *
 * Shell layout tokens must remain inheritable: declaring defaults directly on
 * component root classes shadows consumer theme wrappers, so this test injects
 * the bundled base + Panel / StatCard CSS and asserts the computed custom
 * properties come from the nearest ancestor override. Standalone components
 * should still inherit the package defaults from `:where(:root)` rather than
 * resolving the shared tokens to an empty value.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');

const shellCss = [
	readFileSync(join(packageRoot, 'src', 'styles', 'base.css'), 'utf8'),
	readFileSync(join(packageRoot, 'src', 'components', 'Panel.css'), 'utf8'),
	readFileSync(join(packageRoot, 'src', 'components', 'StatCard.css'), 'utf8'),
].join('\n\n');

const mountedNodes: Array<HTMLElement | HTMLStyleElement> = [];

afterEach(() => {
	for (const node of mountedNodes.splice(0)) {
		node.remove();
	}
});

function mountFixture(markup: string, extraCss = ''): HTMLElement {
	const style = document.createElement('style');
	style.textContent = `${shellCss}\n\n${extraCss}`;
	document.head.append(style);

	const host = document.createElement('div');
	host.innerHTML = markup;
	document.body.append(host);
	mountedNodes.push(style, host);
	return host;
}

function mustQuery(host: HTMLElement, selector: string): Element {
	const element = host.querySelector(selector);
	expect(element).toBeTruthy();
	return element as Element;
}

function tokenValue(element: Element, tokenName: string): string {
	return getComputedStyle(element).getPropertyValue(tokenName).trim();
}

describe('shell layout token inheritance', () => {
	it('lets ancestor gutter and gap overrides reach nested Panel and StatCard roots', () => {
		const host = mountFixture(
			`
				<div class="my-theme">
					<div class="gr-shell">
						<section class="gr-shell-panel gr-shell-panel--padding-md">
							<div class="gr-shell-panel__body">Panel body</div>
						</section>
					</div>
				</div>
				<div class="gr-shell shell-override">
					<div class="gr-shell-statcard">Stat</div>
				</div>
			`,
			`
				.my-theme {
					--gr-shell-gutter: 3rem;
					--gr-shell-gap-md: 2rem;
				}

				.shell-override {
					--gr-shell-gutter: 4rem;
					--gr-shell-gap-md: 2.5rem;
				}
			`
		);

		const panel = mustQuery(host, '.my-theme .gr-shell-panel');
		const statcard = mustQuery(host, '.shell-override .gr-shell-statcard');

		expect(tokenValue(panel, '--gr-shell-gutter')).toBe('3rem');
		expect(tokenValue(panel, '--gr-shell-gap-md')).toBe('2rem');
		expect(tokenValue(statcard, '--gr-shell-gutter')).toBe('4rem');
		expect(tokenValue(statcard, '--gr-shell-gap-md')).toBe('2.5rem');
	});

	it('keeps standalone Panel and StatCard roots on inherited package defaults', () => {
		const host = mountFixture(`
			<section class="gr-shell-panel gr-shell-panel--padding-md">
				<div class="gr-shell-panel__body">Standalone panel</div>
			</section>
			<div class="gr-shell-statcard">Standalone stat</div>
		`);

		const panel = mustQuery(host, '.gr-shell-panel');
		const statcard = mustQuery(host, '.gr-shell-statcard');

		expect(tokenValue(panel, '--gr-shell-gutter')).toBe('1.5rem');
		expect(tokenValue(panel, '--gr-shell-gap-md')).toBe('1rem');
		expect(tokenValue(statcard, '--gr-shell-gutter')).toBe('1.5rem');
		expect(tokenValue(statcard, '--gr-shell-gap-md')).toBe('1rem');
	});
});
