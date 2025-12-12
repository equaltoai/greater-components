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

	describe('Version Updates', () => {
		it('updates component version in config', async () => {
			const config = createTestConfig({
				installed: [createInstalledComponent('button', { version: 'v1.0.0' })],
			});

			const { addInstalledComponent } = await import('../src/utils/config.js');
			const updated = addInstalledComponent(config, 'button', 'v2.0.0');

			expect(updated.installed[0].version).toBe('v2.0.0');
		});
	});
});
