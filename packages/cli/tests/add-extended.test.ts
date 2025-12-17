/**
 * Add Command Extended Integration Tests
 * Tests for complex scenarios, error handling, and faces
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	createTestConfig,
	MOCK_BUTTON_COMPONENT,
	MOCK_SOCIAL_FACE,
} from './fixtures/index.js';
import * as faceInstaller from '../src/utils/face-installer.js';
import * as registryFaces from '../src/registry/faces.js';
import * as packages from '../src/utils/packages.js';
import * as fetchUtils from '../src/utils/fetch.js';
import * as files from '../src/utils/files.js';

const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn(),
		fail: vi.fn(),
		warn: vi.fn(),
		stop: vi.fn(),
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({ confirm: true }),
}));

vi.mock('../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		note: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		newline: vi.fn(),
	},
}));

vi.mock('../src/utils/face-installer.js', () => ({
	resolveFaceDependencies: vi.fn(),
	updateConfigWithFace: vi.fn(),
	injectFaceCss: vi.fn(),
	displayFaceInstallSummary: vi.fn(),
}));

vi.mock('../src/registry/faces.js', () => ({
	getFaceManifest: vi.fn().mockReturnValue({
		name: 'social',
		type: 'face',
		description: 'Twitter/Mastodon-style social media UI',
		files: [],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: ['face', 'social', 'activitypub'],
		version: '1.0.0',
		domain: 'social',
		includes: {
			primitives: ['button', 'modal', 'menu'],
			shared: ['auth', 'compose'],
			patterns: ['thread-view'],
			components: ['timeline', 'post-card'],
		},
		styles: {
			main: 'faces/social/style.css',
			tokens: 'tokens/theme.css',
		},
		recommendedShared: ['notifications'],
	}),
	getAllFaceNames: vi.fn().mockReturnValue(['social']),
}));

vi.mock('../src/registry/shared.js', () => ({
	getSharedModule: vi.fn().mockImplementation((name) => {
		if (name === 'auth')
			return {
				name: 'auth',
				type: 'shared',
				version: '1.0.0',
				description: '',
				files: [],
				dependencies: [],
			};
		return null;
	}),
	getAllSharedModuleNames: vi.fn().mockReturnValue(['auth']),
}));

vi.mock('../src/registry/patterns.js', () => ({
	getPattern: vi.fn().mockImplementation((name) => {
		if (name === 'thread-view')
			return {
				name: 'thread-view',
				type: 'pattern',
				version: '1.0.0',
				description: '',
				files: [],
				dependencies: [],
			};
		return null;
	}),
	getAllPatternNames: vi.fn().mockReturnValue(['thread-view']),
}));

vi.mock('../src/utils/packages.js', () => ({
	getMissingDependencies: vi.fn().mockResolvedValue([]),
	detectPackageManager: vi.fn().mockResolvedValue('pnpm'),
	installDependencies: vi.fn(),
}));

vi.mock('../src/utils/fetch.js', () => ({
	fetchComponents: vi.fn(),
}));

vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn(),
	componentRegistry: {},
	getAllComponentNames: vi.fn().mockReturnValue(['button']),
	ComponentMetadata: {},
}));

vi.mock('../src/utils/files.js', () => ({
	writeComponentFilesWithTransform: vi.fn(),
	fileExists: vi.fn().mockResolvedValue(false),
}));

describe('Add Command Extended', () => {
	beforeEach(() => {
		mockFs.clear();
		mockFs.setupProject(SVELTEKIT_PROJECT);
		vi.clearAllMocks();

		// Default config setup
		mockFs.set('/components.json', JSON.stringify(createTestConfig()));

		// Default mocks
		vi.mocked(files.writeComponentFilesWithTransform).mockResolvedValue({
			writtenFiles: ['path/to/file'],
			transformResults: [],
		});
		vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(new Map());
		vi.mocked(packages.installDependencies).mockResolvedValue(undefined);
	});

	describe('Face Installation', () => {
		it('installs a face successfully', async () => {
			const { addAction } = await import('../src/commands/add.js');

			vi.mocked(registryFaces.getFaceManifest).mockReturnValue(MOCK_SOCIAL_FACE);
			vi.mocked(faceInstaller.resolveFaceDependencies).mockReturnValue({
				success: true,
				resolved: [{ name: 'button', type: 'primitive', metadata: MOCK_BUTTON_COMPONENT }],
				npmDependencies: [],
				npmDevDependencies: [],
				missing: [],
				circular: [],
			});
			vi.mocked(faceInstaller.injectFaceCss).mockResolvedValue(true);
			vi.mocked(faceInstaller.updateConfigWithFace).mockResolvedValue(
				createTestConfig({ css: { face: 'social' } })
			);
			vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(new Map([['button', []]]));

			await addAction(['faces/social'], { cwd: '/' });

			expect(faceInstaller.resolveFaceDependencies).toHaveBeenCalledWith(
				'social',
				expect.any(Object)
			);
			expect(faceInstaller.displayFaceInstallSummary).toHaveBeenCalled();
		});

		it('fails if face not found', async () => {
			const { addAction } = await import('../src/commands/add.js');

			vi.mocked(faceInstaller.resolveFaceDependencies).mockReturnValue(null);
			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			await expect(addAction(['faces/missing'], { cwd: '/' })).rejects.toThrow('exit');
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('handles --css-only flag for faces', async () => {
			const { addAction } = await import('../src/commands/add.js');

			vi.mocked(faceInstaller.resolveFaceDependencies).mockReturnValue({
				success: true,
				resolved: [{ name: 'button', type: 'primitive', metadata: MOCK_BUTTON_COMPONENT }],
				npmDependencies: [],
				npmDevDependencies: [],
				missing: [],
				circular: [],
			});
			vi.mocked(faceInstaller.injectFaceCss).mockResolvedValue(true);
			vi.mocked(faceInstaller.updateConfigWithFace).mockResolvedValue(createTestConfig());

			// Should exit 0 after injecting CSS
			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['faces/social'], { cwd: '/', cssOnly: true });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(0);
			expect(faceInstaller.injectFaceCss).toHaveBeenCalled();
			expect(fetchUtils.fetchComponents).toHaveBeenCalled(); // Fetch is called before css-only check in current impl?
			// Checking implementation: yes, fetch happens, then cssOnly check.
		});

		it('fails if CSS injection fails during --css-only', async () => {
			const { addAction } = await import('../src/commands/add.js');

			vi.mocked(faceInstaller.resolveFaceDependencies).mockReturnValue({
				success: true,
				resolved: [{ name: 'button', type: 'primitive', metadata: MOCK_BUTTON_COMPONENT }],
				npmDependencies: [],
				npmDevDependencies: [],
				missing: [],
				circular: [],
			});
			vi.mocked(faceInstaller.injectFaceCss).mockRejectedValue(new Error('CSS Error'));

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['faces/social'], { cwd: '/', cssOnly: true });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe('Error Handling', () => {
		it('handles fetch failure gracefully', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const { getComponent } = await import('../src/registry/index.js');

			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);
			vi.mocked(fetchUtils.fetchComponents).mockRejectedValue(new Error('Network Error'));

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['button'], { cwd: '/' });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('handles write failure gracefully', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const { getComponent } = await import('../src/registry/index.js');

			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);
			vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(
				new Map([['button', [{ path: 'p', content: 'c', type: 'component' }]]])
			);
			vi.mocked(files.writeComponentFilesWithTransform).mockRejectedValue(new Error('Write Error'));

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['button'], { cwd: '/' });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('handles dependency install failure', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const { getComponent } = await import('../src/registry/index.js');

			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);
			vi.mocked(packages.getMissingDependencies).mockResolvedValue([
				{ name: 'foo', version: '1.0.0' },
			]);
			vi.mocked(packages.installDependencies).mockRejectedValue(new Error('Install Error'));

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['button'], { cwd: '/' });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe('Dependencies', () => {
		it('installs missing dependencies', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const { getComponent } = await import('../src/registry/index.js');

			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);
			vi.mocked(packages.getMissingDependencies).mockResolvedValue([
				{ name: 'foo', version: '1.0.0' },
			]);
			vi.mocked(packages.installDependencies).mockResolvedValue(undefined);

			await addAction(['button'], { cwd: '/' });

			expect(packages.installDependencies).toHaveBeenCalled();
		});

		it('adds greater-components package if needed', async () => {
			const { addAction } = await import('../src/commands/add.js');

			// Hybrid mode should ensure the umbrella package is present.
			mockFs.set('/components.json', JSON.stringify(createTestConfig({ installMode: 'hybrid' })));

			vi.mocked(faceInstaller.resolveFaceDependencies).mockReturnValue({
				success: true,
				resolved: [{ name: 'timeline', type: 'compound', metadata: {} as any }], // compound requires umbrella
				npmDependencies: [],
				npmDevDependencies: [],
				missing: [],
				circular: [],
			});
			// Need to mock fetch for timeline
			vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(new Map([['timeline', []]]));

			await addAction(['faces/social'], { cwd: '/' });

			// It should be added to npmDependencies in resolution
			// But since we mocked resolveFaceDependencies, we control the output.
			// Wait, the logic is inside addAction:
			// if (requiresGreaterComponents && !resolution.npmDependencies.some(...)) { resolution.npmDependencies.push(...) }

			// So even if our mock returns empty npmDependencies, addAction should add it.
			// But we need to verify it.
			// How? The resolution object is modified in place.
			// We can spy on packages.getMissingDependencies call to see if it includes greater-components?
			// Or check installDependencies?

			// But wait, addAction modifies `resolution.npmDependencies`.
			// Then `getMissingDependencies` is called with it.

			expect(packages.getMissingDependencies).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ name: '@equaltoai/greater-components' }),
				]),
				expect.any(String)
			);
		});
		it('skips verification if requested', async () => {
			const { addAction } = await import('../src/commands/add.js');

			vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(new Map());
			// Mock resolveDependencies to return something
			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			await addAction(['button'], { cwd: '/', skipVerify: true });

			expect(fetchUtils.fetchComponents).toHaveBeenCalledWith(
				expect.any(Array),
				expect.any(Object),
				expect.objectContaining({ skipVerification: true })
			);
		});

		it('cancels if user denies confirmation', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const prompts = await import('prompts');

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			// First prompt (items) skipped if items provided
			// Second prompt (confirm) -> false
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: false,
			});

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['button'], { cwd: '/' });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(0);
		});

		it('handles overwrite existing files prompt', async () => {
			const { addAction } = await import('../src/commands/add.js');
			const prompts = await import('prompts');

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			vi.mocked(files.fileExists).mockResolvedValue(true);
			vi.mocked(fetchUtils.fetchComponents).mockResolvedValue(
				new Map([['button', MOCK_BUTTON_COMPONENT.files]])
			);

			// Confirm install: true
			// Overwrite: true
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: true,
			});
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				overwrite: true,
			});

			await addAction(['button'], { cwd: '/' });

			expect(files.writeComponentFilesWithTransform).toHaveBeenCalled();
		});
		it('exits if nothing to install', async () => {
			const { addAction } = await import('../src/commands/add.js');

			const installedConfig = createTestConfig({
				installed: [
					{
						name: 'button',
						version: '1.0.0',
						installedAt: new Date().toISOString(),
						checksums: [],
					},
				],
			});
			mockFs.set('/components.json', JSON.stringify(installedConfig));

			const { getComponent } = await import('../src/registry/index.js');
			(getComponent as any).mockReturnValue(MOCK_BUTTON_COMPONENT);

			const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('exit');
			}) as any);

			try {
				await addAction(['button'], { cwd: '/' });
			} catch (e) {
				expect(e.message).toBe('exit');
			}

			expect(exitSpy).toHaveBeenCalledWith(0);
		});
	});
});
