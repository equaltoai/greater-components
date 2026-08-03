import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { auditTokenReferences } from './audit-tokens-placeholders.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('token audit distinguishes CSS strings from block comments', () => {
	const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'greater-token-comments-'));
	try {
		fs.writeFileSync(
			path.join(fixtureRoot, 'e3a.css'),
			[
				'.e3-open::after { content: "/*"; }',
				'.e3-victim { color: var(--gr-color-gray-1000); }',
				'.e3-close::after { content: "*/"; }',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'comment-only.css'),
			'/* .comment-only { color: var(--gr-comment-only-audit-token); } */\n'
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'unterminated.css'),
			'/* .unterminated { color: var(--gr-unterminated-audit-token); }\n'
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'markdown-glob.md'),
			[
				'Install every component from `$lib/greater/*`.',
				'.markdown-victim { color: var(--gr-markdown-glob-audit-token); }',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'typescript-glob.ts'),
			[
				'// Generated files live under packages/faces/*/src/lib/*',
				"const face = 'community'; // Also matches packages/faces/*/src/lib/*",
				'const style = `color: var(--gr-typescript-glob-audit-token)`;',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'typescript-template-glob.ts'),
			[
				'const glob = `packages/faces/*/src/lib/*`;',
				'const style = `color: var(--gr-typescript-template-glob-audit-token)`;',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'typescript-block-comment-url.ts'),
			[
				'/* see https://example.com/docs */',
				'const style = `color: var(--gr-typescript-block-comment-url-audit-token)`;',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'typescript-regex.ts'),
			['const re = /[/*]/;', 'const style = `color: var(--gr-typescript-regex-audit-token)`;'].join(
				'\n'
			)
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'url-token.css'),
			['.a{background:url(http://e/x/*y);}', '.b{color:var(--gr-url-token-audit-token);}'].join(
				'\n'
			)
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'component-script-style.svelte'),
			[
				'<script>',
				'\tconst fakeStyle = "<style>";',
				'\tconst glob = `packages/faces/*/src/lib/*`;',
				'</script>',
				'<style>',
				'.victim { color: var(--gr-component-script-style-audit-token); }',
				'</style>',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'document.html'),
			[
				'<style>',
				'/* .commented { color: var(--gr-html-comment-only-audit-token); } */',
				'.real { color: var(--gr-html-style-audit-token); }',
				'</style>',
			].join('\n')
		);
		fs.writeFileSync(
			path.join(fixtureRoot, 'icon.svg'),
			[
				'<svg>',
				'<style>',
				'/* .commented { color: var(--gr-svg-comment-only-audit-token); } */',
				'.real { color: var(--gr-svg-style-audit-token); }',
				'</style>',
				'</svg>',
			].join('\n')
		);

		const result = auditTokenReferences({
			rootDirectory: fixtureRoot,
			emittedThemePath: path.join(rootDir, 'packages/tokens/dist/theme.css'),
			palettesPath: path.join(rootDir, 'packages/tokens/src/palettes.json'),
			sourceRoots: [fixtureRoot],
		});

		assert.deepEqual(result.paletteErrors, [
			{ file: 'e3a.css', line: 2, property: '--gr-color-gray-1000' },
		]);
		assert.deepEqual(result.referenceErrors, [
			{
				file: 'component-script-style.svelte',
				line: 6,
				property: '--gr-component-script-style-audit-token',
			},
			{ file: 'document.html', line: 3, property: '--gr-html-style-audit-token' },
			{ file: 'e3a.css', line: 2, property: '--gr-color-gray-1000' },
			{ file: 'icon.svg', line: 4, property: '--gr-svg-style-audit-token' },
			{
				file: 'markdown-glob.md',
				line: 2,
				property: '--gr-markdown-glob-audit-token',
			},
			{
				file: 'typescript-block-comment-url.ts',
				line: 2,
				property: '--gr-typescript-block-comment-url-audit-token',
			},
			{
				file: 'typescript-glob.ts',
				line: 3,
				property: '--gr-typescript-glob-audit-token',
			},
			{
				file: 'typescript-regex.ts',
				line: 2,
				property: '--gr-typescript-regex-audit-token',
			},
			{
				file: 'typescript-template-glob.ts',
				line: 2,
				property: '--gr-typescript-template-glob-audit-token',
			},
			{ file: 'url-token.css', line: 2, property: '--gr-url-token-audit-token' },
		]);
	} finally {
		fs.rmSync(fixtureRoot, { recursive: true, force: true });
	}
});

test('token audit main guard runs through a symlinked invocation', () => {
	const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'greater-token-symlink-'));
	try {
		const symlinkPath = path.join(fixtureRoot, 'audit-tokens-placeholders.mjs');
		fs.symlinkSync(path.join(rootDir, 'scripts/audit-tokens-placeholders.mjs'), symlinkPath);
		const output = execFileSync(process.execPath, [symlinkPath], {
			cwd: rootDir,
			encoding: 'utf8',
		});
		assert.match(output, /Tokens placeholders audit PASSED/);
		assert.match(output, /undefined no-fallback custom properties audit PASSED/);
	} finally {
		fs.rmSync(fixtureRoot, { recursive: true, force: true });
	}
});
