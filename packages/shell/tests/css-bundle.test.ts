/**
 * CSS-bundle regression tests.
 *
 * Arch flagged on PR #668 that the shell `createLiveRegion()` integration
 * (used by CommandPalette and any future shell component) depends on the
 * shared `.gr-sr-only` utility class to keep its `aria-live` announcement
 * elements visually-hidden. Without that class shipped by shell.css,
 * shell-only consumers see visible announcement text appended to
 * `document.body`. This file pins the contract.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distBundlePath = join(__dirname, '..', 'dist', 'shell.css');
const baseCssPath = join(__dirname, '..', 'src', 'styles', 'base.css');

describe('shell CSS bundle', () => {
	it('source base.css ships the `.gr-sr-only` visually-hidden utility', () => {
		const baseCss = readFileSync(baseCssPath, 'utf8');
		expect(baseCss).toMatch(/\.gr-sr-only\s*\{/);
		// The rule must include the standard sr-only properties so any
		// element with class="gr-sr-only" is truly hidden visually but
		// still announceable to assistive technology.
		const ruleMatch = baseCss.match(/\.gr-sr-only\s*\{[^}]*\}/);
		expect(ruleMatch).toBeTruthy();
		const rule = ruleMatch![0];
		expect(rule).toContain('position');
		expect(rule).toContain('width');
		expect(rule).toContain('height');
		expect(rule).toContain('clip');
		// Width must be 1px (the standard sr-only pattern) so AT can read it.
		expect(rule).toMatch(/width:\s*1px/);
	});

	it('built shell.css bundle includes `.gr-sr-only` (regression for PR #668 Arch review #2)', () => {
		// This test pins the contract that the shell.css bundle —
		// the canonical stylesheet shell-only consumers import via
		// `@equaltoai/greater-components-shell/shell.css` — defines
		// `.gr-sr-only`. The headless `createLiveRegion()` utility appends
		// announcement elements with this class to `document.body`.
		let bundle: string;
		try {
			bundle = readFileSync(distBundlePath, 'utf8');
		} catch (err) {
			// If the bundle hasn't been built yet (e.g. running tests in
			// isolation before a build step), surface a clear hint rather
			// than failing on the file read.
			throw new Error(
				`Could not read built shell.css bundle at ${distBundlePath}. ` +
					`Run \`pnpm --filter @equaltoai/greater-components-shell build\` first.`,
				{ cause: err }
			);
		}
		expect(bundle).toMatch(/\.gr-sr-only\s*\{/);
	});
});
