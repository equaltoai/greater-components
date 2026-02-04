/**
 * Cache Command Tests
 * Tests for the greater cache ls|clear|prefetch commands
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';

// Mock dependencies
const mockFs = {
	pathExists: vi.fn(),
	readdir: vi.fn(),
	remove: vi.fn(),
	readFile: vi.fn(),
	writeFile: vi.fn(),
	ensureDir: vi.fn(),
};

vi.mock('fs-extra', () => ({
	default: mockFs,
	...mockFs,
}));

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn().mockReturnThis(),
		fail: vi.fn().mockReturnThis(),
		warn: vi.fn().mockReturnThis(),
		info: vi.fn().mockReturnThis(),
		stop: vi.fn().mockReturnThis(),
		text: '',
	})),
}));

const mockLogger = {
	info: vi.fn(),
	debug: vi.fn(),
	success: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	newline: vi.fn(),
};

vi.mock('../src/utils/logger.js', () => ({
	logger: mockLogger,
}));

const mockCacheDir = '/home/user/.greater-components/cache';
const mockGetCacheDir = vi.fn((ref: string) => `${mockCacheDir}/${ref}`);
const mockClearCache = vi.fn();
const mockClearAllCache = vi.fn();
const mockFetchFromGitTag = vi.fn();

vi.mock('../src/utils/git-fetch.js', () => ({
	getCacheDir: mockGetCacheDir,
	clearCache: mockClearCache,
	clearAllCache: mockClearAllCache,
	fetchFromGitTag: mockFetchFromGitTag,
	resolveGitRefToCommit: vi.fn().mockResolvedValue(null),
	isCached: vi.fn(),
}));

const mockGetCacheStatus = vi.fn();
const mockGetCachedRefs = vi.fn();

vi.mock('../src/utils/offline.js', () => ({
	getCacheStatus: mockGetCacheStatus,
	getCachedRefs: mockGetCachedRefs,
}));

const mockFetchRegistryIndex = vi.fn();
const mockResolveRef = vi.fn();
const mockGetAllFaceNames = vi.fn();
const mockGetAllSharedNames = vi.fn();
const mockGetAllComponentNames = vi.fn();
const mockGetFaceChecksums = vi.fn();
const mockGetSharedChecksums = vi.fn();
const mockGetComponentChecksums = vi.fn();

vi.mock('../src/utils/registry-index.js', () => ({
	fetchRegistryIndex: mockFetchRegistryIndex,
	resolveRef: mockResolveRef,
	clearRegistryCache: vi.fn(),
	clearAllRegistryCache: vi.fn(),
	getAllFaceNames: mockGetAllFaceNames,
	getAllSharedNames: mockGetAllSharedNames,
	getAllComponentNames: mockGetAllComponentNames,
	getFaceChecksums: mockGetFaceChecksums,
	getSharedChecksums: mockGetSharedChecksums,
	getComponentChecksums: mockGetComponentChecksums,
}));

vi.mock('../src/utils/config.js', () => ({
	DEFAULT_REF: 'main',
	FALLBACK_REF: 'greater-v0.1.1',
}));

describe('Cache Command', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('cache ls', () => {
		it('lists cached refs', async () => {
			mockGetCachedRefs.mockResolvedValue(['greater-v0.1.0', 'greater-v0.1.1']);
			mockGetCacheStatus.mockImplementation(async (ref: string) => ({
				ref,
				hasRegistryIndex: ref === 'greater-v0.1.1',
				cachedFiles: ['file1.ts', 'file2.ts'],
				cacheDir: `${mockCacheDir}/${ref}`,
			}));

			const { cacheCommand } = await import('../src/commands/cache.js');

			// Execute the ls command
			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'ls']);

			expect(mockGetCachedRefs).toHaveBeenCalled();
			expect(mockGetCacheStatus).toHaveBeenCalledWith('greater-v0.1.0');
			expect(mockGetCacheStatus).toHaveBeenCalledWith('greater-v0.1.1');
		});

		it('handles empty cache', async () => {
			mockGetCachedRefs.mockResolvedValue([]);

			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'ls']);

			expect(mockGetCachedRefs).toHaveBeenCalled();
		});
	});

	describe('cache clear', () => {
		it('clears specific ref cache', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'clear', 'greater-v0.1.0']);

			expect(mockClearCache).toHaveBeenCalledWith('greater-v0.1.0');
		});

		it('clears all cache with --all flag', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'clear', '--all']);

			expect(mockClearAllCache).toHaveBeenCalled();
		});

		it('shows warning without --all or ref', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'clear']);

			// Should not clear without confirmation
			expect(mockClearCache).not.toHaveBeenCalled();
			expect(mockClearAllCache).not.toHaveBeenCalled();
			expect(mockLogger.warn).toHaveBeenCalled();
		});
	});

	describe('cache prefetch', () => {
		beforeEach(() => {
			mockResolveRef.mockResolvedValue({
				ref: 'greater-v0.1.1',
				source: 'explicit',
			});

			mockFetchRegistryIndex.mockResolvedValue({
				version: '0.1.1',
				ref: 'greater-v0.1.1',
				generatedAt: new Date().toISOString(),
				components: {
					button: { name: 'button', files: [{ path: 'button.svelte' }] },
				},
				faces: {
					social: { name: 'social', checksums: { 'social.ts': 'sha256-abc' } },
				},
				shared: {
					auth: { name: 'auth', checksums: { 'auth.ts': 'sha256-def' } },
				},
				checksums: {},
			});

			mockGetAllFaceNames.mockReturnValue(['social']);
			mockGetAllSharedNames.mockReturnValue(['auth']);
			mockGetAllComponentNames.mockReturnValue(['button']);

			mockGetFaceChecksums.mockReturnValue({ 'packages/faces/social/src/index.ts': 'sha256-abc' });
			mockGetSharedChecksums.mockReturnValue({ 'packages/shared/auth/src/index.ts': 'sha256-def' });
			mockGetComponentChecksums.mockReturnValue({
				'packages/primitives/src/button.svelte': 'sha256-ghi',
			});

			mockFetchFromGitTag.mockResolvedValue(Buffer.from('content'));
		});

		it('prefetches specified items', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'prefetch', 'greater-v0.1.1', 'button']);

			expect(mockResolveRef).toHaveBeenCalled();
			expect(mockFetchRegistryIndex).toHaveBeenCalled();
			expect(mockFetchFromGitTag).toHaveBeenCalled();
		});

		it('prefetches all items with --all flag', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync(['node', 'test', 'cache', 'prefetch', 'greater-v0.1.1', '--all']);

			expect(mockResolveRef).toHaveBeenCalled();
			expect(mockFetchRegistryIndex).toHaveBeenCalled();
			// Should fetch all face, shared, and component files
			expect(mockGetAllFaceNames).toHaveBeenCalled();
			expect(mockGetAllSharedNames).toHaveBeenCalled();
			expect(mockGetAllComponentNames).toHaveBeenCalled();
		});

		it('handles fetch errors gracefully', async () => {
			mockFetchFromGitTag.mockRejectedValue(new Error('Network error'));

			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);

			// Should not throw
			await program.parseAsync(['node', 'test', 'cache', 'prefetch', 'greater-v0.1.1', 'button']);

			// Should have attempted the fetch
			expect(mockFetchFromGitTag).toHaveBeenCalled();
		});

		it('resolves face items with faces/ prefix', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync([
				'node',
				'test',
				'cache',
				'prefetch',
				'greater-v0.1.1',
				'faces/social',
			]);

			expect(mockGetFaceChecksums).toHaveBeenCalledWith(expect.anything(), 'social');
		});

		it('resolves shared items with shared/ prefix', async () => {
			const { cacheCommand } = await import('../src/commands/cache.js');

			const program = new Command();
			program.addCommand(cacheCommand);
			await program.parseAsync([
				'node',
				'test',
				'cache',
				'prefetch',
				'greater-v0.1.1',
				'shared/auth',
			]);

			expect(mockGetSharedChecksums).toHaveBeenCalledWith(expect.anything(), 'auth');
		});
	});
});

describe('Cache Status', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns correct cache status structure', async () => {
		mockGetCacheStatus.mockResolvedValue({
			ref: 'greater-v0.1.1',
			hasRegistryIndex: true,
			cachedFiles: ['file1.ts', 'file2.ts', 'file3.ts'],
			cacheDir: `${mockCacheDir}/greater-v0.1.1`,
		});

		const status = await mockGetCacheStatus('greater-v0.1.1');

		expect(status.ref).toBe('greater-v0.1.1');
		expect(status.hasRegistryIndex).toBe(true);
		expect(status.cachedFiles).toHaveLength(3);
		expect(status.cacheDir).toContain('greater-v0.1.1');
	});
});
