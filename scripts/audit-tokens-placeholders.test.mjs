import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
			{ file: 'e3a.css', line: 2, property: '--gr-color-gray-1000' },
		]);
	} finally {
		fs.rmSync(fixtureRoot, { recursive: true, force: true });
	}
});
