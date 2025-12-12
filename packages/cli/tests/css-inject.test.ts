/**
 * CSS Injection Utilities Tests
 * Tests for CSS import generation, detection, and injection
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
	generateCssImports,
	detectExistingCssImports,
	injectCssImports,
	getRecommendedEntryPoint,
	type CssImportConfig,
} from '../src/utils/css-inject.js';
import type { CssEntryPoint, ProjectType } from '../src/utils/files.js';

// Mock the files module
vi.mock('../src/utils/files.js', () => ({
	readFile: vi.fn(),
	writeFile: vi.fn(),
	fileExists: vi.fn(),
}));

import { readFile, writeFile, fileExists } from '../src/utils/files.js';

const mockReadFile = vi.mocked(readFile);
const mockWriteFile = vi.mocked(writeFile);
const mockFileExists = vi.mocked(fileExists);

describe('generateCssImports', () => {
	it('generates tokens import when tokens is true', () => {
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(1);
		expect(imports[0]).toContain('@equaltoai/greater-components/tokens/theme.css');
	});

	it('generates primitives import when primitives is true', () => {
		const config: CssImportConfig = { tokens: false, primitives: true, face: null };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(1);
		expect(imports[0]).toContain('@equaltoai/greater-components/primitives/style.css');
	});

	it('generates face import for valid face names', () => {
		const config: CssImportConfig = { tokens: false, primitives: false, face: 'social' };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(1);
		expect(imports[0]).toContain('@equaltoai/greater-components/faces/social/style.css');
	});

	it('generates blog face import', () => {
		const config: CssImportConfig = { tokens: false, primitives: false, face: 'blog' };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(1);
		expect(imports[0]).toContain('@equaltoai/greater-components/faces/blog/style.css');
	});

	it('generates community face import', () => {
		const config: CssImportConfig = { tokens: false, primitives: false, face: 'community' };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(1);
		expect(imports[0]).toContain('@equaltoai/greater-components/faces/community/style.css');
	});

	it('ignores invalid face names', () => {
		const config: CssImportConfig = { tokens: false, primitives: false, face: 'invalid-face' };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(0);
	});

	it('generates all imports in correct order', () => {
		const config: CssImportConfig = { tokens: true, primitives: true, face: 'social' };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(3);
		expect(imports[0]).toContain('tokens');
		expect(imports[1]).toContain('primitives');
		expect(imports[2]).toContain('faces/social');
	});

	it('returns empty array when all options are false/null', () => {
		const config: CssImportConfig = { tokens: false, primitives: false, face: null };
		const imports = generateCssImports(config);

		expect(imports).toHaveLength(0);
	});
});

describe('detectExistingCssImports', () => {
	it('detects tokens import with standard path', () => {
		const content = `import '@equaltoai/greater-components/tokens/theme.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(true);
		expect(result.hasPrimitives).toBe(false);
		expect(result.hasFace).toBeNull();
	});

	it('detects primitives import with standard path', () => {
		const content = `import '@equaltoai/greater-components/primitives/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(false);
		expect(result.hasPrimitives).toBe(true);
		expect(result.hasFace).toBeNull();
	});

	it('detects social face import', () => {
		const content = `import '@equaltoai/greater-components/faces/social/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasFace).toBe('social');
	});

	it('detects blog face import', () => {
		const content = `import '@equaltoai/greater-components/faces/blog/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasFace).toBe('blog');
	});

	it('detects community face import', () => {
		const content = `import '@equaltoai/greater-components/faces/community/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasFace).toBe('community');
	});

	it('detects legacy tokens package format', () => {
		const content = `import '@equaltoai/greater-components-tokens/theme.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(true);
	});

	it('detects legacy primitives package format', () => {
		const content = `import '@equaltoai/greater-components-primitives/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasPrimitives).toBe(true);
	});

	it('detects primitives theme.css variant', () => {
		const content = `import '@equaltoai/greater-components-primitives/theme.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasPrimitives).toBe(true);
	});

	it('detects legacy social package format', () => {
		const content = `import '@equaltoai/greater-components-social/style.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasFace).toBe('social');
	});

	it('detects fuzzy tokens match', () => {
		const content = `import 'greater-components/src/tokens/my-theme.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(true);
	});

	it('detects fuzzy primitives match', () => {
		const content = `import 'greater-components/dist/primitives/custom.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasPrimitives).toBe(true);
	});

	it('detects all imports in one file', () => {
		const content = `
			import '@equaltoai/greater-components/tokens/theme.css';
			import '@equaltoai/greater-components/primitives/style.css';
			import '@equaltoai/greater-components/faces/social/style.css';
		`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(true);
		expect(result.hasPrimitives).toBe(true);
		expect(result.hasFace).toBe('social');
	});

	it('returns false for content without Greater imports', () => {
		const content = `import 'normalize.css';\nimport './app.css';`;
		const result = detectExistingCssImports(content);

		expect(result.hasTokens).toBe(false);
		expect(result.hasPrimitives).toBe(false);
		expect(result.hasFace).toBeNull();
	});

	it('handles empty content', () => {
		const result = detectExistingCssImports('');

		expect(result.hasTokens).toBe(false);
		expect(result.hasPrimitives).toBe(false);
		expect(result.hasFace).toBeNull();
	});
});

describe('injectCssImports', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns error when file does not exist', async () => {
		mockFileExists.mockResolvedValue(false);

		const entryPoint: CssEntryPoint = { path: '/nonexistent.ts', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(false);
		expect(result.error).toContain('File not found');
	});

	it('returns unsupported file type error for unknown extensions', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue('some content');

		const entryPoint: CssEntryPoint = { path: '/file.unknown', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(false);
		expect(result.error).toContain('Unsupported file type');
	});

	it('injects into TypeScript files', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`import { something } from 'svelte';\n\nconsole.log('hello');`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = { path: '/main.ts', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		expect(result.addedImports.length).toBeGreaterThan(0);
		expect(mockWriteFile).toHaveBeenCalled();
	});

	it('injects into JavaScript files', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`const x = 1;`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = { path: '/main.js', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		expect(mockWriteFile).toHaveBeenCalled();
	});

	it('injects into MJS files', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`export const x = 1;`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = { path: '/main.mjs', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
	});

	it('injects into Svelte files with existing script tag', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(
			`<script lang="ts">\n\tlet x = 1;\n</script>\n\n<div>Hello</div>`
		);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = {
			path: '/Component.svelte',
			type: 'root-layout',
			priority: 0,
		};
		const config: CssImportConfig = { tokens: true, primitives: true, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		expect(mockWriteFile).toHaveBeenCalled();
	});

	it('injects into Svelte files without script tag', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`<div>Hello world</div>`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = {
			path: '/Component.svelte',
			type: 'root-layout',
			priority: 0,
		};
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		const writtenContent = mockWriteFile.mock.calls[0]?.[1] as string;
		expect(writtenContent).toContain('<script lang="ts">');
	});

	it('injects into CSS files using @import', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`.button { color: red; }`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = { path: '/app.css', type: 'app-css', priority: 2 };
		const config: CssImportConfig = { tokens: true, primitives: true, face: 'social' };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		const writtenContent = mockWriteFile.mock.calls[0]?.[1] as string;
		expect(writtenContent).toContain('@import');
	});

	it('skips already existing imports', async () => {
		mockFileExists.mockResolvedValue(true);
		mockReadFile.mockResolvedValue(`import '@equaltoai/greater-components/tokens/theme.css';`);
		mockWriteFile.mockResolvedValue(undefined);

		const entryPoint: CssEntryPoint = { path: '/main.ts', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		const result = await injectCssImports(entryPoint, config);

		expect(result.success).toBe(true);
		expect(result.existingImports.length).toBeGreaterThan(0);
		expect(result.addedImports).toHaveLength(0);
		expect(mockWriteFile).not.toHaveBeenCalled();
	});

	it('handles file read errors', async () => {
		mockFileExists.mockResolvedValue(true);
		// First read for detectExistingCssImports throws
		mockReadFile.mockRejectedValueOnce(new Error('Read error'));

		const entryPoint: CssEntryPoint = { path: '/main.ts', type: 'main', priority: 1 };
		const config: CssImportConfig = { tokens: true, primitives: false, face: null };

		// The function throws if the first readFile fails (outside try-catch)
		await expect(injectCssImports(entryPoint, config)).rejects.toThrow('Read error');
	});
});

describe('getRecommendedEntryPoint', () => {
	it('returns null for empty entry points array', () => {
		const result = getRecommendedEntryPoint([], 'sveltekit');
		expect(result).toBeNull();
	});

	it('prefers root-layout for SvelteKit projects', () => {
		const entryPoints: CssEntryPoint[] = [
			{ path: '/src/main.ts', type: 'main', priority: 1 },
			{ path: '/src/routes/+layout.svelte', type: 'root-layout', priority: 0 },
			{ path: '/src/app.css', type: 'app-css', priority: 2 },
		];

		const result = getRecommendedEntryPoint(entryPoints, 'sveltekit');

		expect(result).not.toBeNull();
		if (result) {
			expect(result.type).toBe('root-layout');
		}
	});

	it('prefers main for Vite + Svelte projects', () => {
		const entryPoints: CssEntryPoint[] = [
			{ path: '/src/routes/+layout.svelte', type: 'root-layout', priority: 0 },
			{ path: '/src/main.ts', type: 'main', priority: 1 },
			{ path: '/src/app.css', type: 'app-css', priority: 2 },
		];

		const result = getRecommendedEntryPoint(entryPoints, 'vite-svelte');

		expect(result).not.toBeNull();
		if (result) {
			expect(result.type).toBe('main');
		}
	});

	it('falls back to first entry point when preferred not found', () => {
		const entryPoints: CssEntryPoint[] = [{ path: '/src/app.css', type: 'app-css', priority: 2 }];

		const result = getRecommendedEntryPoint(entryPoints, 'sveltekit');

		expect(result).not.toBeNull();
		if (result) {
			expect(result.path).toBe('/src/app.css');
		}
	});

	it('handles svelte project type', () => {
		const entryPoints: CssEntryPoint[] = [{ path: '/src/App.svelte', type: 'layout', priority: 1 }];

		const result = getRecommendedEntryPoint(entryPoints, 'svelte');

		expect(result).not.toBeNull();
		if (result) {
			expect(result.path).toBe('/src/App.svelte');
		}
	});

	it('handles unknown project type', () => {
		const entryPoints: CssEntryPoint[] = [{ path: '/index.js', type: 'main', priority: 1 }];

		const result = getRecommendedEntryPoint(entryPoints, 'unknown' as ProjectType);

		expect(result).not.toBeNull();
		if (result) {
			expect(result.path).toBe('/index.js');
		}
	});
});
