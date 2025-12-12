/**
 * Update Command Integration Tests
 * Tests for component updates with conflict handling
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	MockFileSystem,
	SVELTEKIT_PROJECT,
	createTestConfig,
	createInstalledComponent,
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
		stop: vi.fn(),
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({ resolution: 'overwrite' }),
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
			{ path: 'button.ts', content: 'export const button = { version: 2 };', type: 'component' },
		],
		ref: 'greater-v4.3.0',
	}),
}));

vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn().mockReturnValue({
		name: 'button',
		type: 'primitive',
		files: [{ path: 'button.ts', content: '', type: 'component' }],
		dependencies: [],
		devDependencies: [],
		registryDependencies: [],
		tags: [],
		version: '1.0.0',
	}),
	componentRegistry: {},
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

		it('has --force option', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			const options = updateCommand.options;
			const forceOption = options.find((opt) => opt.long === '--force');

			expect(forceOption).toBeDefined();
		});

		it('has --dry-run option', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			const options = updateCommand.options;
			const dryRunOption = options.find((opt) => opt.long === '--dry-run');

			expect(dryRunOption).toBeDefined();
		});

		it('has --ref option', async () => {
			const { updateCommand } = await import('../src/commands/update.js');

			const options = updateCommand.options;
			const refOption = options.find((opt) => opt.long === '--ref');

			expect(refOption).toBeDefined();
		});
	});

	describe('Local Modification Detection', () => {
		it('detects unmodified component', async () => {
			const config = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						modified: false,
						checksums: [{ path: 'button.ts', checksum: 'sha256-original' }],
					}),
				],
			});

			const installed = config.installed[0];
			expect(installed.modified).toBe(false);
		});

		it('detects modified component', async () => {
			const config = createTestConfig({
				installed: [
					createInstalledComponent('button', {
						modified: true,
					}),
				],
			});

			const installed = config.installed[0];
			expect(installed.modified).toBe(true);
		});
	});

	describe('Diff Generation', () => {
		it('computes diff between local and remote', async () => {
			const { computeDiff } = await import('../src/utils/diff.js');

			const local = 'line1\nline2\nline3';
			const remote = 'line1\nmodified\nline3';

			const diff = computeDiff(local, remote);

			expect(diff.identical).toBe(false);
			expect(diff.stats.additions).toBeGreaterThan(0);
			expect(diff.stats.deletions).toBeGreaterThan(0);
		});

		it('identifies identical content', async () => {
			const { computeDiff } = await import('../src/utils/diff.js');

			const content = 'line1\nline2\nline3';
			const diff = computeDiff(content, content);

			expect(diff.identical).toBe(true);
		});
	});

	describe('Conflict Resolution', () => {
		it('marks component as modified after local changes', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: false })],
			});

			const { markComponentModified } = await import('../src/utils/config.js');
			const updated = markComponentModified(config, 'button');

			expect(updated.installed[0].modified).toBe(true);
		});
	});

	describe('Command Execution', () => {
		let exitSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
		});

		afterEach(() => {
			exitSpy.mockRestore();
		});

		it('exits if not initialized', async () => {
			mockFs.clear();
			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('exits if no components specified and not --all', async () => {
			const config = createTestConfig();
			mockFs.set('/components.json', JSON.stringify(config));

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction([], { cwd: '/' });
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it('updates all installed components', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/components/ui/button/button.ts', 'old content');

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction([], { cwd: '/', all: true, yes: true });

			expect(exitSpy).not.toHaveBeenCalledWith(1);
			const { readFile } = await import('../src/utils/files.js');
			const content = await readFile('/src/lib/components/ui/button/button.ts');
			// fetchComponentFiles mock returns 'export const button = { version: 2 };'
			expect(content).toContain('version: 2');
		});

		it('updates specific component', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button')],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/components/ui/button/button.ts', 'old content');

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/', yes: true });

			expect(exitSpy).not.toHaveBeenCalledWith(1);
		});

		it('warns if component not installed', async () => {
			const config = createTestConfig({
				installed: [],
			});
			mockFs.set('/components.json', JSON.stringify(config));

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			// Logic says: if items.length > 0, filter installed.
			// if filtered length is 0, exits with 0 and message "No components to update"
			expect(exitSpy).toHaveBeenCalledWith(0);
		});

		it('handles conflicts with overwrite', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: true })],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/components/ui/button/button.ts', 'local modified content');

			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: true,
			});
			// Conflict resolution prompt
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				resolution: 'overwrite',
			});

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			const { readFile } = await import('../src/utils/files.js');
			const content = await readFile('/src/lib/components/ui/button/button.ts');
			expect(content).toContain('version: 2');
		});

		it('handles conflicts with keep', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { modified: true })],
			});
			mockFs.set('/components.json', JSON.stringify(config));
			mockFs.set('/src/lib/components/ui/button/button.ts', 'local modified content');

			const prompts = await import('prompts');
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				confirm: true,
			});
			// Conflict resolution prompt
			(prompts.default as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				resolution: 'keep',
			});

			const { updateAction } = await import('../src/commands/update.js');
			await updateAction(['button'], { cwd: '/' });

			const { readFile } = await import('../src/utils/files.js');
			const content = await readFile('/src/lib/components/ui/button/button.ts');
			expect(content).toBe('local modified content');
		});
	});
});
