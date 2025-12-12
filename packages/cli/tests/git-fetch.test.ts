/**
 * Git Fetch Tests
 * Tests for Git-based file fetching utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fs-extra
const fsStore = new Map<string, Buffer>();
const fsMock = {
	pathExists: vi.fn(async (p: string) => fsStore.has(p)),
	readFile: vi.fn(async (p: string) => {
		if (!fsStore.has(p)) throw new Error(`File not found: ${p}`);
		return fsStore.get(p);
	}),
	writeFile: vi.fn(async (p: string, content: Buffer) => {
		fsStore.set(p, content);
	}),
	ensureDir: vi.fn(async () => {}),
	remove: vi.fn(async (p: string) => {
		// Remove entries that start with this path
		for (const key of fsStore.keys()) {
			if (key.startsWith(p)) {
				fsStore.delete(key);
			}
		}
	}),
};

vi.mock('fs-extra', () => ({
	default: fsMock,
	...fsMock,
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('git-fetch utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('NetworkError', () => {
		it('should create an error with statusCode and url', async () => {
			const { NetworkError } = await import('../src/utils/git-fetch.js');

			const error = new NetworkError('Test error', 404, 'https://example.com');

			expect(error.message).toBe('Test error');
			expect(error.statusCode).toBe(404);
			expect(error.url).toBe('https://example.com');
			expect(error.name).toBe('NetworkError');
		});

		it('should create an error without statusCode', async () => {
			const { NetworkError } = await import('../src/utils/git-fetch.js');

			const error = new NetworkError('Test error');

			expect(error.message).toBe('Test error');
			expect(error.statusCode).toBeUndefined();
		});
	});

	describe('CacheError', () => {
		it('should create an error with cachePath', async () => {
			const { CacheError } = await import('../src/utils/git-fetch.js');

			const error = new CacheError('Cache miss', '/path/to/cache');

			expect(error.message).toBe('Cache miss');
			expect(error.cachePath).toBe('/path/to/cache');
			expect(error.name).toBe('CacheError');
		});
	});

	describe('getCacheDir', () => {
		it('should return cache directory path for a ref', async () => {
			const { getCacheDir } = await import('../src/utils/git-fetch.js');

			const cacheDir = getCacheDir('v1.0.0');

			expect(cacheDir).toContain('.greater-components');
			expect(cacheDir).toContain('cache');
			expect(cacheDir).toContain('v1.0.0');
		});
	});

	describe('getCachedFilePath', () => {
		it('should return cached file path for ref and file', async () => {
			const { getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const cachedPath = getCachedFilePath('v1.0.0', 'path/to/file.ts');

			expect(cachedPath).toContain('v1.0.0');
			expect(cachedPath).toContain('path/to/file.ts');
		});
	});

	describe('isCached', () => {
		it('should return true when file exists in cache', async () => {
			const { isCached, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			fsStore.set(cachePath, Buffer.from('cached content'));

			const result = await isCached('v1.0.0', 'test.ts');

			expect(result).toBe(true);
		});

		it('should return false when file does not exist in cache', async () => {
			const { isCached } = await import('../src/utils/git-fetch.js');

			const result = await isCached('v1.0.0', 'nonexistent.ts');

			expect(result).toBe(false);
		});
	});

	describe('readFromCache', () => {
		it('should return cached content', async () => {
			const { readFromCache, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			const content = Buffer.from('cached content');
			fsStore.set(cachePath, content);

			const result = await readFromCache('v1.0.0', 'test.ts');

			expect(result).toEqual(content);
		});

		it('should throw CacheError when file not in cache', async () => {
			const { readFromCache, CacheError } = await import('../src/utils/git-fetch.js');

			await expect(readFromCache('v1.0.0', 'nonexistent.ts')).rejects.toThrow(CacheError);
		});
	});

	describe('writeToCache', () => {
		it('should write content to cache', async () => {
			const { writeToCache, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const content = Buffer.from('new content');
			await writeToCache('v1.0.0', 'test.ts', content);

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			expect(fsStore.get(cachePath)).toEqual(content);
		});

		it('should ensure directory exists before writing', async () => {
			const { writeToCache } = await import('../src/utils/git-fetch.js');

			await writeToCache('v1.0.0', 'nested/path/test.ts', Buffer.from('content'));

			expect(fsMock.ensureDir).toHaveBeenCalled();
		});
	});

	describe('clearCache', () => {
		it('should remove cache directory for a ref', async () => {
			const { clearCache, getCacheDir } = await import('../src/utils/git-fetch.js');

			const cacheDir = getCacheDir('v1.0.0');
			// Mock that the cache directory exists
			fsStore.set(cacheDir, Buffer.from(''));

			await clearCache('v1.0.0');

			expect(fsMock.remove).toHaveBeenCalledWith(cacheDir);
		});

		it('should not throw if cache does not exist', async () => {
			const { clearCache } = await import('../src/utils/git-fetch.js');

			// Should not throw
			await expect(clearCache('nonexistent-ref')).resolves.toBeUndefined();
		});
	});

	describe('clearAllCache', () => {
		it('should remove entire cache directory', async () => {
			const { clearAllCache } = await import('../src/utils/git-fetch.js');

			// Simulate cache exists
			fsMock.pathExists.mockResolvedValueOnce(true);

			await clearAllCache();

			expect(fsMock.remove).toHaveBeenCalled();
		});
	});

	describe('fetchFromGitTag', () => {
		it('should return cached content when available', async () => {
			const { fetchFromGitTag, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			const cachedContent = Buffer.from('cached content');
			fsStore.set(cachePath, cachedContent);

			const result = await fetchFromGitTag('v1.0.0', 'test.ts');

			expect(result).toEqual(cachedContent);
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it('should fetch from network when not cached', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');

			const networkContent = 'network content';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode(networkContent).buffer,
			});

			const result = await fetchFromGitTag('v1.0.0', 'test.ts');

			expect(result.toString()).toBe(networkContent);
			expect(mockFetch).toHaveBeenCalled();
		});

		it('should bypass cache with skipCache option', async () => {
			const { fetchFromGitTag, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			fsStore.set(cachePath, Buffer.from('cached'));

			const networkContent = 'fresh content';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode(networkContent).buffer,
			});

			const result = await fetchFromGitTag('v1.0.0', 'test.ts', { skipCache: true });

			expect(result.toString()).toBe(networkContent);
			expect(mockFetch).toHaveBeenCalled();
		});

		it('should throw NetworkError on 404', async () => {
			const { fetchFromGitTag, NetworkError } = await import('../src/utils/git-fetch.js');

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			});

			await expect(fetchFromGitTag('v1.0.0', 'nonexistent.ts')).rejects.toThrow(NetworkError);
		});

		it('should throw NetworkError on 403', async () => {
			const { fetchFromGitTag, NetworkError } = await import('../src/utils/git-fetch.js');

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: 'Forbidden',
			});

			await expect(fetchFromGitTag('v1.0.0', 'forbidden.ts')).rejects.toThrow(NetworkError);
		});

		it('should retry on 5xx errors', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');

			// First call fails with 500
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			});

			// Second call succeeds
			const networkContent = 'success after retry';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode(networkContent).buffer,
			});

			const result = await fetchFromGitTag('v1.0.0', 'test.ts');

			expect(result.toString()).toBe(networkContent);
			expect(mockFetch).toHaveBeenCalledTimes(2);
		});

		it('should retry on 429 rate limiting', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');

			// First call rate limited
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
			});

			// Second call succeeds
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode('content').buffer,
			});

			const result = await fetchFromGitTag('v1.0.0', 'test.ts');

			expect(result.toString()).toBe('content');
			expect(mockFetch).toHaveBeenCalledTimes(2);
		});

		it('should cache fetched content by default', async () => {
			const { fetchFromGitTag, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			const networkContent = 'new content';
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode(networkContent).buffer,
			});

			await fetchFromGitTag('v1.0.0', 'test.ts');

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			expect(fsStore.has(cachePath)).toBe(true);
		});

		it('should not cache when skipCache is true', async () => {
			const { fetchFromGitTag, getCachedFilePath } = await import('../src/utils/git-fetch.js');

			// Clear the store to ensure we start fresh
			fsStore.clear();

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				arrayBuffer: async () => new TextEncoder().encode('content').buffer,
			});

			await fetchFromGitTag('v1.0.0', 'test.ts', { skipCache: true });

			const cachePath = getCachedFilePath('v1.0.0', 'test.ts');
			expect(fsStore.has(cachePath)).toBe(false);
		});
	});

	describe('fetchMultipleFromGitTag', () => {
		it('should fetch multiple files', async () => {
			const { fetchMultipleFromGitTag } = await import('../src/utils/git-fetch.js');

			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					arrayBuffer: async () => new TextEncoder().encode('content1').buffer,
				})
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					arrayBuffer: async () => new TextEncoder().encode('content2').buffer,
				});

			const result = await fetchMultipleFromGitTag('v1.0.0', ['file1.ts', 'file2.ts']);

			expect(result.size).toBe(2);
			expect(result.get('file1.ts')?.toString()).toBe('content1');
			expect(result.get('file2.ts')?.toString()).toBe('content2');
		});

		it('should stop on first error by default', async () => {
			const { fetchMultipleFromGitTag } = await import('../src/utils/git-fetch.js');

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found',
			});

			await expect(fetchMultipleFromGitTag('v1.0.0', ['missing.ts', 'file2.ts'])).rejects.toThrow();
		});

		it('should continue on error with continueOnError option', async () => {
			const { fetchMultipleFromGitTag } = await import('../src/utils/git-fetch.js');

			mockFetch
				.mockResolvedValueOnce({
					ok: false,
					status: 404,
					statusText: 'Not Found',
				})
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					arrayBuffer: async () => new TextEncoder().encode('content2').buffer,
				});

			const result = await fetchMultipleFromGitTag('v1.0.0', ['missing.ts', 'file2.ts'], {
				continueOnError: true,
			});

			expect(result.size).toBe(1);
			expect(result.has('missing.ts')).toBe(false);
			expect(result.get('file2.ts')?.toString()).toBe('content2');
		});
	});
});
