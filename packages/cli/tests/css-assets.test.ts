/**
 * CSS Asset Tests
 *
 * Registry-managed raw CSS files are copied directly into consumer projects.
 * They must be browser-valid CSS, not Svelte component style syntax.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CSS_SOURCE_PATHS } from '../src/utils/css-inject.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

const rawCssAssetPaths = [
	CSS_SOURCE_PATHS.primitives,
	...Object.values(CSS_SOURCE_PATHS.faces),
];

describe('registry-managed raw CSS assets', () => {
	it('do not contain Svelte-only :global selectors', async () => {
		const offenders: string[] = [];

		for (const sourcePath of rawCssAssetPaths) {
			const css = await readFile(path.join(repoRoot, sourcePath), 'utf8');
			if (css.includes(':global(')) {
				offenders.push(sourcePath);
			}
		}

		expect(offenders).toEqual([]);
	});
});
