/**
 * Init Command Integration Tests
 * Tests for project initialization with different configurations
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	VITE_SVELTE_PROJECT,
	BARE_PROJECT,
	createTestConfig,
} from './fixtures/index.js';

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
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn(),
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

vi.mock('../src/utils/registry-index.js', () => ({
	resolveRef: vi.fn().mockResolvedValue({ ref: 'greater-v4.2.0', source: 'fallback' }),
}));

describe('Init Command', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	describe('Project Detection', () => {
		it('detects SvelteKit project', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { detectProjectDetails } = await import('../src/utils/files.js');
			const details = await detectProjectDetails('/');

			expect(details.type).toBe('sveltekit');
			expect(details.svelteConfigPath).toBeDefined();
		});

		it('detects Vite + Svelte project', async () => {
			mockFs.setupProject(VITE_SVELTE_PROJECT);

			const { detectProjectDetails } = await import('../src/utils/files.js');
			const details = await detectProjectDetails('/');

			expect(details.type).toBe('vite-svelte');
		});

		it('detects bare project', async () => {
			mockFs.setupProject(BARE_PROJECT);

			const { detectProjectDetails } = await import('../src/utils/files.js');
			const details = await detectProjectDetails('/');

			expect(details.type).toBe('unknown');
		});

		it('detects TypeScript support', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			mockFs.set('/tsconfig.json', '{}');

			const { detectProjectDetails } = await import('../src/utils/files.js');
			const details = await detectProjectDetails('/');

			expect(details.hasTypeScript).toBe(true);
		});

		it('finds CSS entry points', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { detectProjectDetails } = await import('../src/utils/files.js');
			const details = await detectProjectDetails('/');

			expect(details.cssEntryPoints.length).toBeGreaterThan(0);
		});
	});

	describe('Config Creation', () => {
		it('creates default config', async () => {
			const { createDefaultConfig } = await import('../src/utils/config.js');
			const config = createDefaultConfig();

			expect(config.$schema).toBeDefined();
			expect(config.version).toBeDefined();
			expect(config.ref).toBeDefined();
			expect(config.aliases).toBeDefined();
			expect(config.css).toBeDefined();
			expect(config.installed).toEqual([]);
		});

		/* Test removed as createDefaultConfig no longer supports custom aliases in options */

		it('creates config with face selection', async () => {
			const { createDefaultConfig } = await import('../src/utils/config.js');
			const config = createDefaultConfig({
				face: 'social',
			});

			expect(config.css.face).toBe('social');
		});
	});

	describe('Validation', () => {
		it('validates project has package.json', async () => {
			mockFs.clear();

			const { isValidProject } = await import('../src/utils/files.js');
			const valid = await isValidProject('/');

			expect(valid).toBe(false);
		});

		it('validates project with package.json', async () => {
			mockFs.set('/package.json', '{}');

			const { isValidProject } = await import('../src/utils/files.js');
			const valid = await isValidProject('/');

			expect(valid).toBe(true);
		});

		it('detects existing config', async () => {
			mockFs.set('/package.json', '{}');
			mockFs.set('/components.json', JSON.stringify(createTestConfig()));

			const { configExists } = await import('../src/utils/config.js');
			const exists = await configExists('/');

			expect(exists).toBe(true);
		});
	});

	describe('Svelte Version Validation', () => {
		it('validates Svelte 5 version', async () => {
			mockFs.set(
				'/package.json',
				JSON.stringify({
					dependencies: { svelte: '^5.0.0' },
				})
			);

			const { validateSvelteVersion } = await import('../src/utils/files.js');
			const result = await validateSvelteVersion('/');

			expect(result.valid).toBe(true);
			expect(result.version?.raw).toMatch(/^[\^~]?5/);
		});

		it('warns on Svelte 4 version', async () => {
			mockFs.set(
				'/package.json',
				JSON.stringify({
					dependencies: { svelte: '^4.0.0' },
				})
			);

			const { validateSvelteVersion } = await import('../src/utils/files.js');
			const result = await validateSvelteVersion('/');

			expect(result.valid).toBe(false);
			expect(result.upgradeInstructions).toBeDefined();
		});

		it('handles missing Svelte dependency', async () => {
			mockFs.set(
				'/package.json',
				JSON.stringify({
					dependencies: {},
				})
			);

			const { validateSvelteVersion } = await import('../src/utils/files.js');
			const result = await validateSvelteVersion('/');

			expect(result.valid).toBe(false);
		});
	});

	describe('initCommand options', () => {
		it('exports initCommand', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			expect(initCommand).toBeDefined();
			expect(initCommand.name()).toBe('init');
		});

		it('has --yes option', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			const options = initCommand.options;
			const yesOption = options.find((opt) => opt.short === '-y' || opt.long === '--yes');

			expect(yesOption).toBeDefined();
		});

		it('has --cwd option', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			const options = initCommand.options;
			const cwdOption = options.find((opt) => opt.long === '--cwd');

			expect(cwdOption).toBeDefined();
		});

		it('has --ref option', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			const options = initCommand.options;
			const refOption = options.find((opt) => opt.long === '--ref');

			expect(refOption).toBeDefined();
		});

		it('has --skip-css option', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			const options = initCommand.options;
			const skipCssOption = options.find((opt) => opt.long === '--skip-css');

			expect(skipCssOption).toBeDefined();
		});

		it('has --face option', async () => {
			const { initCommand } = await import('../src/commands/init.js');

			const options = initCommand.options;
			const faceOption = options.find((opt) => opt.long === '--face');

			expect(faceOption).toBeDefined();
		});
	});

	describe('Command Execution', () => {
		let exitSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('process.exit called');
			}) as any);
		});

		afterEach(() => {
			exitSpy.mockRestore();
		});

		it('exits if not a valid project', async () => {
			mockFs.clear(); // Empty directory
			const { initAction } = await import('../src/commands/init.js');
			await expect(initAction({ cwd: '/' })).rejects.toThrow('process.exit called');
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('exits if Svelte version is invalid', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			mockFs.set(
				'/package.json',
				JSON.stringify({
					dependencies: { svelte: '^3.0.0' },
				})
			);

			const { initAction } = await import('../src/commands/init.js');
			await expect(initAction({ cwd: '/' })).rejects.toThrow('process.exit called');
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('exits if invalid face option provided', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { initAction } = await import('../src/commands/init.js');
			await expect(initAction({ cwd: '/', face: 'invalid-face' })).rejects.toThrow(
				'process.exit called'
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('creates config with defaults when --yes is used', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { initAction } = await import('../src/commands/init.js');
			await initAction({ cwd: '/', yes: true });

			const { configExists } = await import('../src/utils/config.js');
			expect(await configExists('/')).toBe(true);
			expect(exitSpy).not.toHaveBeenCalled();
		});

		it('prompts for configuration and creates config', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				style: 'default',
				componentsPath: '$lib/components/ui',
				utilsPath: '$lib/utils',
				hooksPath: '$lib/hooks',
				face: null,
			});
			// Mock confirm prompt
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: true,
			});
			// Mock CSS injection prompt (if any)
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				entryPoint: null, // Skip CSS injection
			});

			const { initAction } = await import('../src/commands/init.js');
			await initAction({ cwd: '/' });

			const { configExists } = await import('../src/utils/config.js');
			expect(await configExists('/')).toBe(true);
		});

		it('cancels if style selection is missing', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				// No style
			});

			const { initAction } = await import('../src/commands/init.js');
			await expect(initAction({ cwd: '/' })).rejects.toThrow('process.exit called');

			expect(exitSpy).toHaveBeenCalledWith(0);
			const { configExists } = await import('../src/utils/config.js');
			expect(await configExists('/')).toBe(false);
		});

		it('cancels if confirmation is rejected', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);
			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				style: 'default',
				componentsPath: '$lib/components/ui',
				utilsPath: '$lib/utils',
				hooksPath: '$lib/hooks',
				face: null,
			});
			// Mock confirm prompt rejection
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: false,
			});

			const { initAction } = await import('../src/commands/init.js');
			await expect(initAction({ cwd: '/' })).rejects.toThrow('process.exit called');

			expect(exitSpy).toHaveBeenCalledWith(0);
			const { configExists } = await import('../src/utils/config.js');
			expect(await configExists('/')).toBe(false);
		});
	});
});
