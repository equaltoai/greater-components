import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { diffCommand } from '../src/commands/diff.js';
import { logger } from '../src/utils/logger.js';
import {
	readConfig,
	configExists,
	getInstalledComponent,
	getInstalledComponentNames,
	resolveAlias,
} from '../src/utils/config.js';
import { getComponent } from '../src/registry/index.js';
import { fetchComponentFiles } from '../src/utils/fetch.js';
import { readFile, fileExists } from '../src/utils/files.js';
import { computeDiff } from '../src/utils/diff.js';

// Mock dependencies
vi.mock('../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		note: vi.fn(),
	},
}));

vi.mock('../src/utils/config.js', () => ({
	readConfig: vi.fn(),
	configExists: vi.fn(),
	getInstalledComponent: vi.fn(),
	getInstalledComponentNames: vi.fn(),
	resolveAlias: vi.fn(),
}));

vi.mock('../src/registry/index.js', () => ({
	getComponent: vi.fn(),
}));

vi.mock('../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn(),
}));

vi.mock('../src/utils/files.js', () => ({
	readFile: vi.fn(),
	fileExists: vi.fn(),
}));

vi.mock('../src/utils/diff.js', () => ({
	computeDiff: vi.fn(),
	formatDiffStats: vi.fn(
		(stats) => `${stats?.additions || 0} additions, ${stats?.deletions || 0} deletions`
	),
}));

// Mock process.exit
const _mockExit = vi.spyOn(process, 'exit').mockImplementation((code) => {
	throw new Error(`process.exit(${code})`);
});

// Mock process.cwd
const originalCwd = process.cwd;
const mockCwd = '/test/cwd';

describe('Diff Command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
		(resolveAlias as any).mockReturnValue('/test/cwd/src/lib/components/ui');
	});

	afterEach(() => {
		vi.spyOn(process, 'cwd').mockImplementation(originalCwd);
	});

	it('fails if not initialized', async () => {
		(configExists as any).mockResolvedValue(false);

		await expect(diffCommand.parseAsync(['node', 'test'])).rejects.toThrow('process.exit(1)');

		expect(logger.error).toHaveBeenCalledWith(
			expect.stringContaining('Greater Components is not initialized')
		);
	});

	it('fails if config read fails', async () => {
		(configExists as any).mockResolvedValue(true);
		(readConfig as any).mockResolvedValue(null);

		await expect(diffCommand.parseAsync(['node', 'test'])).rejects.toThrow('process.exit(1)');

		expect(logger.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to read configuration')
		);
	});

	it('fails if invalid component specified', async () => {
		(configExists as any).mockResolvedValue(true);
		(readConfig as any).mockResolvedValue({ ref: 'v1' });
		(getComponent as any).mockReturnValue(null);

		await expect(diffCommand.parseAsync(['node', 'test', 'unknown-component'])).rejects.toThrow(
			'process.exit(1)'
		);

		expect(logger.error).toHaveBeenCalledWith(
			expect.stringContaining('Unknown components: unknown-component')
		);
	});

	it('handles no installed components', async () => {
		(configExists as any).mockResolvedValue(true);
		(readConfig as any).mockResolvedValue({ ref: 'v1' });
		(getInstalledComponentNames as any).mockReturnValue([]);

		await expect(diffCommand.parseAsync(['node', 'test'])).rejects.toThrow('process.exit(0)');

		expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('No components installed'));
	});

	describe('when components exist', () => {
		const mockConfig = { ref: 'v1.0.0', aliases: { ui: '$lib/components/ui' } };
		const mockComponent = {
			name: 'button',
			files: [{ path: 'button.svelte' }],
		};

		beforeEach(() => {
			(configExists as any).mockResolvedValue(true);
			(readConfig as any).mockResolvedValue(mockConfig);
			(getInstalledComponentNames as any).mockReturnValue(['button']);
			(getComponent as any).mockReturnValue(mockComponent);
			(getInstalledComponent as any).mockReturnValue({ name: 'button', version: 'v1.0.0' });
			(fetchComponentFiles as any).mockResolvedValue({
				files: [{ path: 'button.svelte', content: '<button>remote</button>' }],
				ref: 'v1.0.0',
			});
		});

		it('shows up to date when no changes', async () => {
			(fileExists as any).mockResolvedValue(true);
			(readFile as any).mockResolvedValue('<button>remote</button>');
			(computeDiff as any).mockReturnValue({ identical: true, stats: {} });

			await diffCommand.parseAsync(['node', 'test', 'button']);

			expect(computeDiff).toHaveBeenCalled();
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('up to date'));
		});

		it('shows diff when changes exist', async () => {
			(fileExists as any).mockResolvedValue(true);
			(readFile as any).mockResolvedValue('<button>local</button>');
			(computeDiff as any).mockReturnValue({
				identical: false,
				stats: { additions: 1, deletions: 1 },
				unifiedDiff:
					'--- remote\n+++ local\n@@ -1 +1 @@\n-<button>remote</button>\n+<button>local</button>',
			});

			await expect(diffCommand.parseAsync(['node', 'test', 'button'])).rejects.toThrow(
				'process.exit(1)'
			);

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('button'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('1 additions, 1 deletions'));
		});

		it('handles missing local file', async () => {
			(fileExists as any).mockResolvedValue(false);
			(computeDiff as any).mockReturnValue({
				identical: false,
				stats: { additions: 1, deletions: 0 },
			});

			await expect(diffCommand.parseAsync(['node', 'test', 'button'])).rejects.toThrow(
				'process.exit(1)'
			);

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('(new file)'));
		});

		it('handles fetch error', async () => {
			(fetchComponentFiles as any).mockRejectedValue(new Error('Network error'));

			await diffCommand.parseAsync(['node', 'test', 'button']);

			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Network error'));
		});

		it('handles read local file error', async () => {
			(fileExists as any).mockResolvedValue(true);
			(readFile as any).mockRejectedValue(new Error('Permission denied'));

			await diffCommand.parseAsync(['node', 'test', 'button']);

			expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Permission denied'));
		});

		it('shows summary only with --summary', async () => {
			(fileExists as any).mockResolvedValue(true);
			(readFile as any).mockResolvedValue('<button>local</button>');
			(computeDiff as any).mockReturnValue({
				identical: false,
				stats: { additions: 1, deletions: 1 },
				hasChanges: true,
			});

			await expect(diffCommand.parseAsync(['node', 'test', 'button', '--summary'])).rejects.toThrow(
				'process.exit(1)'
			);

			expect(logger.info).not.toHaveBeenCalledWith(
				expect.stringContaining('additions, 1 deletions')
			);
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Summary'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('With upstream changes: 1'));
		});

		it('detects local modifications', async () => {
			(fileExists as any).mockResolvedValue(true);
			(readFile as any).mockResolvedValue('<button>local</button>');
			(getInstalledComponent as any).mockReturnValue({ name: 'button' }); // installed
			(computeDiff as any).mockReturnValue({
				identical: false,
				stats: {},
			});

			await expect(diffCommand.parseAsync(['node', 'test', 'button'])).rejects.toThrow(
				'process.exit(1)'
			);

			expect(logger.info).toHaveBeenCalledWith(
				expect.stringContaining('Local modifications detected')
			);
		});
	});
});
