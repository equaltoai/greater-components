/**
 * Update Command Integration Tests
 * Tests for component updates with conflict handling
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SVELTEKIT_PROJECT, createTestConfig, createInstalledComponent } from './fixtures/index.js';

const { mockFs } = await vi.hoisted(async () => {
	const { MockFileSystem } = await import('./fixtures/index.js');
	return { mockFs: new MockFileSystem() };
});

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
		text: '',
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({ resolution: 'overwrite', confirm: true }),
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

vi.mock('../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn().mockResolvedValue({
		files: [
			{
				path: 'lib/primitives/button.ts',
				content: 'export const button = { version: 2 };',
				type: 'component',
			},
		],
		ref: 'greater-v4.3.0',
	}),
}));

vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn().mockReturnValue({
		name: 'button',
		type: 'primitive',
		files: [{ path: 'lib/primitives/button.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: [],
		version: '1.0.0',
	}),
	componentRegistry: {},
}));

vi.mock('../src/utils/transform.js', () => ({
	transformImports: vi.fn().mockImplementation((content) => ({ content })),
}));

// Mock diff to return predictable results
vi.mock('../src/utils/diff.js', () => ({
	computeDiff: vi.fn((local, remote) => ({
		identical: local === remote,
		stats: { additions: 1, deletions: 1 },
		unifiedDiff: 'diff',
	})),
	formatDiffStats: vi.fn(() => '+1 -1'),
}));

// Mock install-path to return predictable paths
vi.mock('../src/utils/install-path.js', () => ({
	getInstalledFilePath: vi.fn((path) => {
		// Simple mapping for test
		if (path.includes('button.ts')) return '/src/lib/primitives/button.ts';
		return `/src/${path}`;
	}),
}));

// We mock files.js to verify calls and simulate errors
vi.mock('../src/utils/files.js', () => ({
	readFile: vi.fn(async (p) => mockFs.createFsMock().readFile(p)),
	writeFile: vi.fn(async (p, c) => mockFs.createFsMock().writeFile(p, c)),
	fileExists: vi.fn(async (p) => mockFs.createFsMock().pathExists(p)),
}));

describe('Update Command', () => {
	beforeEach(() => {
		mockFs.clear();
		mockFs.setupProject(SVELTEKIT_PROJECT);
		vi.clearAllMocks();
	});

	describe('updateCommand options', () => {
		it('exports updateCommand', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			expect(updateCommand).toBeDefined();
			expect(updateCommand.name()).toBe('update');
		});

		it('accepts component names as arguments', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			expect(updateCommand.args).toBeDefined();
		});

		it('has --all option', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			const options = updateCommand.options;
			const allOption = options.find((opt) => opt.long === '--all');

			expect(allOption).toBeDefined();
		});
	});

	describe('Conflict Resolution & Update Logic', () => {
		it('skips identical files', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			// Local content matches "remote" content from mock
			mockFs.set('/src/lib/primitives/button.ts', 'export const button = { version: 2 };');

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/', yes: true });

			const { logger } = await import('../src/utils/logger.js');
			expect(JSON.stringify(vi.mocked(logger.info).mock.calls)).toContain('unchanged');
		});

		it('creates new files if they do not exist', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			// File does not exist locally

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/', yes: true });

			const { writeFile } = await import('../src/utils/files.js');
			expect(writeFile).toHaveBeenCalledWith(
				expect.stringContaining('button.ts'),
				expect.stringContaining('version: 2')
			);
		});

		it('handles user skipping conflict', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: true })],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/primitives/button.ts', 'local modified');

			const prompts = await import('prompts');
			// confirm update: yes
			// conflict resolution: skip
			(prompts.default as unknown as ReturnType<typeof vi.fn>)
				.mockResolvedValueOnce({ confirm: true })
				.mockResolvedValueOnce({ resolution: 'skip' });

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			const { readFile } = await import('../src/utils/files.js');
			// Should verify file content hasn't changed
			const content = await readFile('/src/lib/primitives/button.ts');
			expect(content).toBe('local modified');
		});

		it('handles user skipping entire component on conflict', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: true })],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/primitives/button.ts', 'local modified');

			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>)
				.mockResolvedValueOnce({ confirm: true })
				.mockResolvedValueOnce({ resolution: 'skip' }); // 'skip' value for component skip

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			const { logger } = await import('../src/utils/logger.js');
			expect(JSON.stringify(vi.mocked(logger.info).mock.calls)).toContain('skipped');
		});

		it('handles show-diff loop in conflict resolution', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: true })],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/primitives/button.ts', 'local modified');

			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>)
				.mockResolvedValueOnce({ confirm: true })
				.mockResolvedValueOnce({ resolution: 'show-diff' }) // First choice
				.mockResolvedValueOnce({ resolution: 'overwrite' }); // Second choice

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			const { writeFile } = await import('../src/utils/files.js');
			expect(writeFile).toHaveBeenCalledWith(
				expect.stringContaining('button.ts'),
				expect.stringContaining('version: 2')
			);
		});
	});

	describe('Error Handling', () => {
		let exitSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
				throw new Error('process.exit called');
			}) as any);
		});

		afterEach(() => {
			exitSpy.mockRestore();
		});

		it('handles fetch errors gracefully', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));

			const { fetchComponentFiles } = await import('../src/utils/fetch.js');
			vi.mocked(fetchComponentFiles).mockRejectedValueOnce(new Error('Network error'));

			const { updateAction } = await import('../src/commands/update.js');

			// It should log error and exit with 1 because of failure
			await expect(updateAction(['button'], { cwd: '/', yes: true })).rejects.toThrow(
				'process.exit called'
			);

			const { logger } = await import('../src/utils/logger.js');
			expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
				expect.stringContaining('Network error')
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('handles write errors gracefully', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));

			const { writeFile } = await import('../src/utils/files.js');
			vi.mocked(writeFile).mockRejectedValueOnce(new Error('Write permission denied'));

			const { updateAction } = await import('../src/commands/update.js');
			await expect(updateAction(['button'], { cwd: '/', yes: true })).rejects.toThrow(
				'process.exit called'
			);

			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe('Edge Cases', () => {
		let exitSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			// Don't throw on exit for these tests, just spy
			exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
		});

		afterEach(() => {
			exitSpy.mockRestore();
		});

		it('handles unknown component in registry', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('unknown-comp')],
			});
			mockFs.set('/components.json', JSON.stringify(config));

			const { getComponent } = await import('../src/registry/index.js');
			vi.mocked(getComponent).mockReturnValueOnce(null);

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['unknown-comp'], { cwd: '/', yes: true });

			const { logger } = await import('../src/utils/logger.js');
			expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
				expect.stringContaining('Component not found')
			);
		});

		it('dry run does not modify files', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/primitives/button.ts', 'old content');

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/', yes: true, dryRun: true });

			const { logger } = await import('../src/utils/logger.js');

			const { writeFile } = await import('../src/utils/files.js');
			expect(writeFile).not.toHaveBeenCalled();

			expect(vi.mocked(logger.info)).toHaveBeenCalledWith(expect.stringContaining('[DRY RUN]'));

			// Should NOT exit with error
			expect(exitSpy).not.toHaveBeenCalledWith(1);
		});
	});
});
