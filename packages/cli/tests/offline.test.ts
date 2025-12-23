/**
 * Offline Mode Utilities Tests
 * Tests for connectivity checking and offline fallback support
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
	isNetworkAvailable,
	isOfflineMode,
	enableOfflineMode,
	disableOfflineMode,
	getCacheStatus,
	getCachedRefs,
	canServeFromCache,
	getMissingFromCache,
	determineFetchStrategy,
	printOfflineModeWarning,
} from '../src/utils/offline.js';

// Mock dependencies
vi.mock('fs-extra', () => ({
	default: {
		pathExists: vi.fn(),
		readdir: vi.fn(),
	},
}));

vi.mock('../src/utils/git-fetch.js', () => ({
	getCacheDir: vi.fn((ref: string) => `/home/user/.greater-components/cache/${ref}`),
	isCached: vi.fn(),
}));

vi.mock('../src/utils/logger.js', () => ({
	logger: {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		newline: vi.fn(),
	},
}));

import fs from 'fs-extra';
import { getCacheDir, isCached } from '../src/utils/git-fetch.js';
import { logger } from '../src/utils/logger.js';

const mockFs = vi.mocked(fs);
const mockIsCached = vi.mocked(isCached);
const mockGetCacheDir = vi.mocked(getCacheDir);
const mockLogger = vi.mocked(logger);

describe('offline mode state', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disableOfflineMode();
	});

	afterEach(() => {
		disableOfflineMode();
	});

	it('isOfflineMode returns false by default', () => {
		expect(isOfflineMode()).toBe(false);
	});

	it('enableOfflineMode sets offline mode to true', () => {
		enableOfflineMode();
		expect(isOfflineMode()).toBe(true);
	});

	it('disableOfflineMode sets offline mode to false', () => {
		enableOfflineMode();
		expect(isOfflineMode()).toBe(true);

		disableOfflineMode();
		expect(isOfflineMode()).toBe(false);
	});

	it('enableOfflineMode logs info message', () => {
		enableOfflineMode();
		expect(mockLogger.info).toHaveBeenCalled();
	});
});

describe('isNetworkAvailable', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disableOfflineMode();
		// Reset the global fetch mock
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		disableOfflineMode();
	});

	it('returns true when network is available', async () => {
		const mockFetch = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal('fetch', mockFetch);

		const result = await isNetworkAvailable(true);

		expect(result).toBe(true);
		expect(mockFetch).toHaveBeenCalled();
	});

	it('returns false when network request fails', async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
		vi.stubGlobal('fetch', mockFetch);

		const result = await isNetworkAvailable(true);

		expect(result).toBe(false);
	});

	it('returns false when response is not ok', async () => {
		const mockFetch = vi.fn().mockResolvedValue({ ok: false });
		vi.stubGlobal('fetch', mockFetch);

		const result = await isNetworkAvailable(true);

		expect(result).toBe(false);
	});

	it('uses cached result when not forcing check', async () => {
		// First call with force to set cache
		const mockFetch = vi.fn().mockResolvedValue({ ok: true });
		vi.stubGlobal('fetch', mockFetch);

		await isNetworkAvailable(true);
		expect(mockFetch).toHaveBeenCalledTimes(1);

		// Second call should use cache (within interval)
		await isNetworkAvailable(false);
		// Should not have made another call
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});
});

describe('getCacheStatus', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetCacheDir.mockImplementation((ref) => `/home/user/.greater-components/cache/${ref}`);
	});

	it('returns cache status for existing cache', async () => {
		mockFs.pathExists.mockResolvedValue(true as never);
		mockFs.readdir.mockResolvedValue([
			{ name: 'file1.ts', isDirectory: () => false },
			{ name: 'file2.ts', isDirectory: () => false },
		] as never);

		const status = await getCacheStatus('v4.2.0');

		expect(status.ref).toBe('v4.2.0');
		expect(status.cacheDir).toContain('v4.2.0');
	});

	it('returns empty cached files for non-existent cache', async () => {
		mockFs.pathExists.mockResolvedValue(false as never);

		const status = await getCacheStatus('v4.2.0');

		expect(status.cachedFiles).toEqual([]);
	});

	it('includes hasRegistryIndex boolean', async () => {
		mockFs.pathExists.mockImplementation((path) => {
			if (typeof path === 'string' && path.includes('registry')) {
				return Promise.resolve(true) as never;
			}
			return Promise.resolve(false) as never;
		});

		const status = await getCacheStatus('v4.2.0');

		expect(typeof status.hasRegistryIndex).toBe('boolean');
	});
});

describe('getCachedRefs', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty array when cache directory does not exist', async () => {
		mockFs.pathExists.mockResolvedValue(false as never);

		const refs = await getCachedRefs();

		expect(refs).toEqual([]);
	});

	it('returns array of cached refs when cache exists', async () => {
		mockFs.pathExists.mockResolvedValue(true as never);
		mockFs.readdir.mockResolvedValue([
			{ name: 'v4.1.0', isDirectory: () => true },
			{ name: 'v4.2.0', isDirectory: () => true },
			{ name: 'some-file.txt', isDirectory: () => false },
		] as never);

		const refs = await getCachedRefs();

		expect(refs).toContain('v4.1.0');
		expect(refs).toContain('v4.2.0');
		expect(refs).not.toContain('some-file.txt');
	});
});

describe('canServeFromCache', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns true when all files are cached', async () => {
		mockIsCached.mockResolvedValue(true);

		const result = await canServeFromCache('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(result).toBe(true);
	});

	it('returns false when any file is not cached', async () => {
		mockIsCached.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

		const result = await canServeFromCache('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(result).toBe(false);
	});

	it('returns true for empty file list', async () => {
		const result = await canServeFromCache('v4.2.0', []);

		expect(result).toBe(true);
	});
});

describe('getMissingFromCache', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns empty array when all files are cached', async () => {
		mockIsCached.mockResolvedValue(true);

		const missing = await getMissingFromCache('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(missing).toEqual([]);
	});

	it('returns missing files when some are not cached', async () => {
		mockIsCached.mockImplementation((ref, path) => {
			return Promise.resolve(path === 'file1.ts');
		});

		const missing = await getMissingFromCache('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(missing).toEqual(['file2.ts']);
	});

	it('returns all files when none are cached', async () => {
		mockIsCached.mockResolvedValue(false);

		const missing = await getMissingFromCache('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(missing).toEqual(['file1.ts', 'file2.ts']);
	});
});

describe('determineFetchStrategy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disableOfflineMode();
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		disableOfflineMode();
	});

	it('returns network strategy when online and nothing cached', async () => {
		mockIsCached.mockResolvedValue(false);

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(result.strategy).toBe('network');
		expect(result.isOffline).toBe(false);
	});

	it('returns cache strategy when preferCache and all cached', async () => {
		mockIsCached.mockResolvedValue(true);

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts', 'file2.ts'], {
			preferCache: true,
		});

		expect(result.strategy).toBe('cache');
		expect(result.cachedFiles).toEqual(['file1.ts', 'file2.ts']);
	});

	it('returns unavailable strategy when offline and nothing cached', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
		mockIsCached.mockResolvedValue(false);

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts'], {});

		expect(result.strategy).toBe('unavailable');
		expect(result.isOffline).toBe(true);
	});

	it('returns cache strategy when offline but files are cached', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
		mockIsCached.mockResolvedValue(true);

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts']);

		expect(result.strategy).toBe('cache');
		expect(result.isOffline).toBe(true);
	});

	it('returns mixed strategy when some files cached', async () => {
		mockIsCached.mockImplementation((ref, path) => {
			return Promise.resolve(path === 'file1.ts');
		});

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts', 'file2.ts']);

		expect(result.strategy).toBe('mixed');
		expect(result.cachedFiles).toEqual(['file1.ts']);
		expect(result.uncachedFiles).toEqual(['file2.ts']);
	});

	it('includes correct cached and uncached file lists', async () => {
		mockIsCached.mockImplementation((ref, path) => {
			return Promise.resolve(path !== 'file3.ts');
		});

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts', 'file2.ts', 'file3.ts']);

		expect(result.cachedFiles).toContain('file1.ts');
		expect(result.cachedFiles).toContain('file2.ts');
		expect(result.uncachedFiles).toContain('file3.ts');
	});

	it('handles allowMissing option when offline', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
		mockIsCached.mockImplementation((ref, path) => {
			return Promise.resolve(path === 'file1.ts');
		});

		const result = await determineFetchStrategy('v4.2.0', ['file1.ts', 'file2.ts'], {
			allowMissing: true,
		});

		expect(result.strategy).toBe('cache');
	});
});

describe('printOfflineModeWarning', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disableOfflineMode();
	});

	afterEach(() => {
		disableOfflineMode();
	});

	it('does not log when offline mode is disabled', () => {
		disableOfflineMode();
		printOfflineModeWarning();

		// Should not have logged the warning
		expect(mockLogger.info).not.toHaveBeenCalledWith(
			expect.stringContaining('Operating in offline mode')
		);
	});

	it('logs warning when offline mode is enabled', () => {
		enableOfflineMode();
		// Clear the mock after enableOfflineMode logs
		mockLogger.info.mockClear();

		printOfflineModeWarning();

		expect(mockLogger.info).toHaveBeenCalled();
	});
});

describe('edge cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		disableOfflineMode();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		disableOfflineMode();
	});

	it('handles empty file paths array', async () => {
		const result = await determineFetchStrategy('v4.2.0', []);

		expect(result.cachedFiles).toEqual([]);
		expect(result.uncachedFiles).toEqual([]);
	});

	it('handles refs with special characters', async () => {
		mockFs.pathExists.mockResolvedValue(false as never);

		const status = await getCacheStatus('v4.2.0-beta.1');

		expect(status.ref).toBe('v4.2.0-beta.1');
	});
});
