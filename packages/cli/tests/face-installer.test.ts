/**
 * Face Installer Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	getFaceItemsForResolution,
	resolveFaceDependencies,
	injectFaceCss,
} from '../src/utils/face-installer.js';
import type { FaceManifest, ComponentDomain } from '../src/registry/index.js';
import type { ComponentConfig } from '../src/utils/config.js';
import * as faces from '../src/registry/faces.js';
import * as itemParser from '../src/utils/item-parser.js';
import * as depResolver from '../src/utils/dependency-resolver.js';
import * as files from '../src/utils/files.js';
import * as cssInject from '../src/utils/css-inject.js';

// Mock dependencies
vi.mock('../src/registry/faces.js', () => ({
	getFaceManifest: vi.fn(),
}));

vi.mock('../src/utils/item-parser.js', () => ({
	parseItemName: vi.fn(),
}));

vi.mock('../src/utils/dependency-resolver.js', () => ({
	resolveDependencies: vi.fn(),
}));

vi.mock('../src/utils/files.js', () => ({
	detectProjectDetails: vi.fn(),
}));

vi.mock('../src/utils/css-inject.js', () => ({
	injectCssImports: vi.fn(),
	copyCssFiles: vi.fn().mockResolvedValue({
		success: true,
		copiedFiles: [],
		skippedFiles: [],
		targetDir: '/project/src/lib/styles/greater',
	}),
}));

vi.mock('../src/utils/config.js', async (importOriginal) => {
	const original = await importOriginal<typeof import('../src/utils/config.js')>();
	return {
		...original,
		writeConfig: vi.fn().mockResolvedValue(undefined),
	};
});

const mockManifest: FaceManifest = {
	name: 'social',
	type: 'face' as const,
	description: 'Social Face',
	version: '1.0.0',
	domain: 'social' as ComponentDomain,
	includes: {
		primitives: ['button'],
		shared: ['auth'],
		patterns: ['feed'],
		components: ['post'],
	},
	styles: { main: '@equaltoai/greater-components/faces/social/style.css', tokens: '' },
	files: [],
	dependencies: [],
	devDependencies: [],
	registryDependencies: [],
	tags: [],
	recommendedShared: ['notifications'],
};

// Helper to create a valid mock config
function createMockConfig(overrides: Partial<ComponentConfig> = {}): ComponentConfig {
	return {
		version: '1.0.0',
		ref: 'greater-v0.1.1',
		style: 'default' as const,
		rsc: false,
		tsx: false,
		aliases: {
			components: '$lib/components',
			utils: '$lib/utils',
			ui: '$lib/components/ui',
			lib: '$lib',
			hooks: '$lib/primitives',
		},
		css: {
			tokens: true,
			primitives: true,
			face: null,
			source: 'npm',
			localDir: 'styles/greater',
		},
		installed: [],
		...overrides,
	};
}

describe('Face Installer', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getFaceItemsForResolution', () => {
		it('collects all items from manifest', () => {
			// Mock parseItemName to return simple objects based on input
			vi.mocked(itemParser.parseItemName).mockImplementation((name) => ({
				input: name,
				name: name.split('/').pop() || '',
				type: 'primitive' as const,
				found: true,
				metadata: null,
			}));

			const items = getFaceItemsForResolution(mockManifest);

			expect(items).toHaveLength(4);
			expect(items.map((i) => i.name)).toEqual(['button', 'auth', 'feed', 'post']);
		});

		it('filters out not found items', () => {
			vi.mocked(itemParser.parseItemName).mockReturnValue({
				input: 'test',
				found: false,
				name: '',
				type: 'primitive' as const,
				metadata: null,
			});
			const items = getFaceItemsForResolution(mockManifest);
			expect(items).toHaveLength(0);
		});
	});

	describe('resolveFaceDependencies', () => {
		it('resolves dependencies for face items', () => {
			vi.mocked(faces.getFaceManifest).mockReturnValue(mockManifest);
			vi.mocked(itemParser.parseItemName).mockReturnValue({
				input: 'foo',
				found: true,
				name: 'foo',
				type: 'primitive' as const,
				metadata: null,
			});

			resolveFaceDependencies('social');

			expect(faces.getFaceManifest).toHaveBeenCalledWith('social');
			expect(depResolver.resolveDependencies).toHaveBeenCalled();
		});

		it('returns null if manifest not found', () => {
			vi.mocked(faces.getFaceManifest).mockReturnValue(null);
			const result = resolveFaceDependencies('unknown');
			expect(result).toBeNull();
		});

		it('includes recommended shared modules if not skipped', () => {
			vi.mocked(faces.getFaceManifest).mockReturnValue(mockManifest);
			vi.mocked(itemParser.parseItemName).mockImplementation((name) => ({
				input: name,
				found: true,
				name,
				type: 'primitive' as const,
				metadata: null,
			}));

			resolveFaceDependencies('social', { skipOptional: false });

			// Check that 'shared/notifications' was parsed/included
			expect(itemParser.parseItemName).toHaveBeenCalledWith('shared/notifications');
		});
	});

	describe('updateConfigWithFace', () => {
		it('updates config with face selection', async () => {
			const { updateConfigWithFace } = await import('../src/utils/face-installer.js');

			const config = createMockConfig();

			const result = await updateConfigWithFace(config, 'social', '/project');

			expect(result.css?.face).toBe('social');
		});

		it('preserves existing css config', async () => {
			const { updateConfigWithFace } = await import('../src/utils/face-installer.js');

			const config = createMockConfig({
				css: {
					tokens: true,
					primitives: false,
					face: null,
				},
			});

			const result = await updateConfigWithFace(config, 'blog', '/project');

			expect(result.css?.face).toBe('blog');
			expect(result.css?.tokens).toBe(true);
			expect(result.css?.primitives).toBe(false);
		});
	});

	describe('displayFaceInstallSummary', () => {
		it('displays installation summary without errors', async () => {
			const { displayFaceInstallSummary } = await import('../src/utils/face-installer.js');

			const result = {
				face: 'social',
				manifest: mockManifest,
				resolution: {
					resolved: [],
					circular: [],
					missing: [],
					npmDependencies: [],
					npmDevDependencies: [],
					success: true,
				},
				cssInjected: true,
				configUpdated: true,
			};

			// Should not throw
			expect(() => displayFaceInstallSummary(result)).not.toThrow();
		});

		it('displays summary when css not injected', async () => {
			const { displayFaceInstallSummary } = await import('../src/utils/face-installer.js');

			const blogManifest: FaceManifest = {
				...mockManifest,
				name: 'blog',
				domain: 'blog' as ComponentDomain,
			};

			const result = {
				face: 'blog',
				manifest: blogManifest,
				resolution: {
					resolved: [],
					circular: [],
					missing: [],
					npmDependencies: [],
					npmDevDependencies: [],
					success: true,
				},
				cssInjected: false,
				configUpdated: false,
			};

			// Should not throw
			expect(() => displayFaceInstallSummary(result)).not.toThrow();
		});
	});
	describe('injectFaceCss', () => {
		it('warns and returns false if no CSS entry points found', async () => {
			vi.mocked(files.detectProjectDetails).mockResolvedValue({
				type: 'sveltekit',
				hasTypeScript: true,
				cssEntryPoints: [],
				svelteConfigPath: null,
				viteConfigPath: null,
			});

			const config = createMockConfig();
			const result = await injectFaceCss('social', config, '/project');

			expect(result).toBe(false);
		});

		it('injects CSS successfully', async () => {
			vi.mocked(files.detectProjectDetails).mockResolvedValue({
				type: 'sveltekit',
				hasTypeScript: true,
				cssEntryPoints: [{ path: '/project/src/app.css', type: 'global' }],
				svelteConfigPath: null,
				viteConfigPath: null,
			});

			vi.mocked(cssInject.injectCssImports).mockResolvedValue({
				success: true,
				filePath: '/project/src/app.css',
				addedImports: ["import '@equaltoai/greater-components/faces/social/style.css';"],
			});

			const config = createMockConfig();
			const result = await injectFaceCss('social', config, '/project');

			expect(result).toBe(true);
			expect(cssInject.injectCssImports).toHaveBeenCalled();
		});

		it('skips local injection when CSS copy fails in local mode', async () => {
			vi.mocked(files.detectProjectDetails).mockResolvedValue({
				type: 'sveltekit',
				hasTypeScript: true,
				cssEntryPoints: [{ path: '/project/src/app.css', type: 'global' }],
				svelteConfigPath: null,
				viteConfigPath: null,
			});

			vi.mocked(cssInject.copyCssFiles).mockResolvedValueOnce({
				success: false,
				copiedFiles: [],
				skippedFiles: [],
				targetDir: '/project/src/lib/styles/greater',
				error: 'missing theme.css',
			});

			const config = createMockConfig({
				css: {
					tokens: true,
					primitives: true,
					face: null,
					source: 'local',
					localDir: 'styles/greater',
				},
			});

			const result = await injectFaceCss('social', config, '/project');

			expect(result).toBe(false);
			expect(cssInject.copyCssFiles).toHaveBeenCalled();
			expect(cssInject.injectCssImports).not.toHaveBeenCalled();
		});

		it('handles injection failure', async () => {
			vi.mocked(files.detectProjectDetails).mockResolvedValue({
				type: 'sveltekit',
				hasTypeScript: true,
				cssEntryPoints: [{ path: '/project/src/app.css', type: 'global' }],
				svelteConfigPath: null,
				viteConfigPath: null,
			});

			vi.mocked(cssInject.injectCssImports).mockResolvedValue({
				success: false,
				error: 'Failed to read file',
				filePath: '/project/src/app.css',
				addedImports: [],
			});

			const config = createMockConfig();
			const result = await injectFaceCss('social', config, '/project');

			expect(result).toBe(false);
		});

		it('handles error during injection process', async () => {
			vi.mocked(files.detectProjectDetails).mockResolvedValue({
				type: 'sveltekit',
				hasTypeScript: true,
				cssEntryPoints: [{ path: '/project/src/app.css', type: 'global' }],
				svelteConfigPath: null,
				viteConfigPath: null,
			});

			vi.mocked(cssInject.injectCssImports).mockRejectedValue(new Error('Write error'));

			const config = createMockConfig();
			const result = await injectFaceCss('social', config, '/project');

			expect(result).toBe(false);
		});
	});
});
