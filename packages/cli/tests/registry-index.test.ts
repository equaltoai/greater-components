/**
 * Registry Index Utility Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	fetchRegistryIndex,
	getComponentChecksums,
	getComponentFilePaths,
	RegistryIndexError,
	clearAllRegistryCache,
	resolveRef,
	fetchLatestRef,
	getAllComponentNames,
	getAllFaceNames,
	getAllSharedNames,
	hasComponent,
	hasFace,
	hasShared,
	getFace,
	getShared,
	getFaceChecksums,
	getSharedChecksums,
	clearRegistryCache,
} from '../src/utils/registry-index.js';
import * as gitFetch from '../src/utils/git-fetch.js';
import { FALLBACK_REF } from '../src/utils/config.js';
import fs from 'fs-extra';

vi.mock('fs-extra', () => ({
	default: {
		pathExists: vi.fn(),
		readFile: vi.fn(),
		writeFile: vi.fn(),
		ensureDir: vi.fn(),
		remove: vi.fn(),
	},
}));

vi.mock('../src/utils/git-fetch.js', () => ({
	fetchFromGitTag: vi.fn(),
	NetworkError: class NetworkError extends Error {},
}));

const mockIndex = {
	schemaVersion: '1.0.0',
	version: '1.0.0',
	ref: 'greater-v1.0.0',
	generatedAt: '2023-01-01T00:00:00.000Z',
	components: {
		button: {
			name: 'button',
			version: '1.0.0',
			tags: [],
			dependencies: [],
			peerDependencies: [],
			files: [{ path: 'button.svelte', checksum: 'sha256-abc=' }],
		},
	},
	faces: {
		blog: {
			name: 'blog',
			version: '1.0.0',
			files: [{ path: 'blog-layout.svelte', checksum: 'sha256-def=' }],
			dependencies: [],
			peerDependencies: [],
		},
	},
	shared: {
		utils: {
			name: 'utils',
			version: '1.0.0',
			files: [{ path: 'utils.ts', checksum: 'sha256-ghi=' }],
			dependencies: [],
			peerDependencies: [],
			exports: [],
			types: [],
		},
	},
	checksums: {},
};

const mockLatestRef = {
	ref: 'greater-v2.0.0',
	version: '2.0.0',
	updatedAt: '2023-02-01T00:00:00.000Z',
};

describe('Registry Index', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(fs.pathExists).mockResolvedValue(false);
	});

	describe('fetchRegistryIndex', () => {
		it('fetches from network when cache is missing', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from(JSON.stringify(mockIndex)));

			const result = await fetchRegistryIndex('v1.0.0');

			expect(result).toEqual(mockIndex);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'registry/index.json',
				expect.any(Object)
			);
		});

		it('returns cached value if valid', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					return JSON.stringify({
						ref: 'v1.0.0',
						fetchedAt: Date.now(),
						ttlMs: 3600000,
					});
				}
				return JSON.stringify(mockIndex);
			});

			const result = await fetchRegistryIndex('v1.0.0');

			expect(result).toEqual(mockIndex);
			expect(gitFetch.fetchFromGitTag).not.toHaveBeenCalled();
		});

		it('fetches from network if cache expired', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					return JSON.stringify({
						ref: 'v1.0.0',
						fetchedAt: Date.now() - 4000000, // Expired
						ttlMs: 3600000,
					});
				}
				return JSON.stringify(mockIndex);
			});
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from(JSON.stringify(mockIndex)));

			await fetchRegistryIndex('v1.0.0');

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalled();
		});

		it('throws RegistryIndexError on json parse failure', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from('invalid json'));

			await expect(fetchRegistryIndex('v1.0.0')).rejects.toThrow(RegistryIndexError);
		});

		it('throws RegistryIndexError on schema validation failure', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from('{"invalid": "schema"}'));

			await expect(fetchRegistryIndex('v1.0.0')).rejects.toThrow(RegistryIndexError);
		});

		it('throws RegistryIndexError on network error', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockRejectedValue(new gitFetch.NetworkError('Failed'));
			await expect(fetchRegistryIndex('v1.0.0')).rejects.toThrow(RegistryIndexError);
		});

		it('does not throw if cache write fails', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from(JSON.stringify(mockIndex)));
			vi.mocked(fs.writeFile).mockRejectedValue(new Error('Write failed'));

			const result = await fetchRegistryIndex('v1.0.0');
			expect(result).toEqual(mockIndex);
		});

		it('fetches from network if cache metadata is corrupt', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					return 'invalid json';
				}
				return JSON.stringify(mockIndex);
			});
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from(JSON.stringify(mockIndex)));

			await fetchRegistryIndex('v1.0.0');

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalled();
		});

		it('fetches from network if cache content is invalid json', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					return JSON.stringify({
						ref: 'v1.0.0',
						fetchedAt: Date.now(),
						ttlMs: 3600000,
					});
				}
				return 'invalid json';
			});
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from(JSON.stringify(mockIndex)));

			await fetchRegistryIndex('v1.0.0');
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalled();
		});
	});

	describe('fetchLatestRef', () => {
		it('fetches from network when cache is missing', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(
				Buffer.from(JSON.stringify(mockLatestRef))
			);

			const result = await fetchLatestRef();

			expect(result).toEqual(mockLatestRef);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'main',
				'registry/latest.json',
				expect.any(Object)
			);
		});

		it('returns cached value if valid', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					return JSON.stringify({ fetchedAt: Date.now() });
				}
				return JSON.stringify(mockLatestRef);
			});

			const result = await fetchLatestRef();
			expect(result).toEqual(mockLatestRef);
			expect(gitFetch.fetchFromGitTag).not.toHaveBeenCalled();
		});

		it('fetches from network if cache expired', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			vi.mocked(fs.readFile).mockImplementation(async (path: any) => {
				if (path.endsWith('.meta.json')) {
					// Expired (5 minutes TTL)
					return JSON.stringify({ fetchedAt: Date.now() - 10 * 60 * 1000 });
				}
				return JSON.stringify(mockLatestRef);
			});
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(
				Buffer.from(JSON.stringify(mockLatestRef))
			);

			await fetchLatestRef();
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalled();
		});

		it('returns null on network error', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockRejectedValue(new Error('Failed'));
			const result = await fetchLatestRef();
			expect(result).toBeNull();
		});

		it('does not crash if cache write fails', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(
				Buffer.from(JSON.stringify(mockLatestRef))
			);
			vi.mocked(fs.writeFile).mockRejectedValue(new Error('Write failed'));

			const result = await fetchLatestRef();
			expect(result).toEqual(mockLatestRef);
		});
	});

	describe('resolveRef', () => {
		it('uses explicit ref if provided', async () => {
			const result = await resolveRef('v1.0.0');
			expect(result).toEqual({ ref: 'v1.0.0', source: 'explicit' });
		});

		it('uses config ref if explicit ref is missing', async () => {
			const result = await resolveRef(undefined, 'v1.0.0');
			expect(result).toEqual({ ref: 'v1.0.0', source: 'config' });
		});

		it('skips config ref if it is "latest"', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(
				Buffer.from(JSON.stringify(mockLatestRef))
			);
			const result = await resolveRef(undefined, 'latest');
			// Should fall through to latest resolution
			expect(result.source).toBe('latest');
		});

		it('fetches latest ref if other sources missing', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(
				Buffer.from(JSON.stringify(mockLatestRef))
			);
			const result = await resolveRef();
			expect(result).toEqual({ ref: mockLatestRef.ref, source: 'latest' });
		});

		it('uses fallback if everything else fails', async () => {
			vi.mocked(gitFetch.fetchFromGitTag).mockRejectedValue(new Error('Failed'));
			const result = await resolveRef();
			expect(result).toEqual({ ref: FALLBACK_REF, source: 'fallback' });
		});
	});

	describe('Helper functions', () => {
		it('getComponentChecksums returns checksums', () => {
			const checksums = getComponentChecksums(mockIndex as any, 'button');
			expect(checksums).toEqual({ 'button.svelte': 'sha256-abc=' });
		});

		it('getComponentChecksums returns null for missing component', () => {
			const checksums = getComponentChecksums(mockIndex as any, 'missing');
			expect(checksums).toBeNull();
		});

		it('getComponentFilePaths returns paths', () => {
			const paths = getComponentFilePaths(mockIndex as any, 'button');
			expect(paths).toEqual(['button.svelte']);
		});

		it('getComponentFilePaths returns null for missing component', () => {
			const paths = getComponentFilePaths(mockIndex as any, 'missing');
			expect(paths).toBeNull();
		});

		it('getAllComponentNames returns keys', () => {
			expect(getAllComponentNames(mockIndex as any)).toEqual(['button']);
		});

		it('getAllFaceNames returns keys', () => {
			expect(getAllFaceNames(mockIndex as any)).toEqual(['blog']);
		});

		it('getAllSharedNames returns keys', () => {
			expect(getAllSharedNames(mockIndex as any)).toEqual(['utils']);
		});

		it('hasComponent returns true if exists', () => {
			expect(hasComponent(mockIndex as any, 'button')).toBe(true);
		});

		it('hasComponent returns false if not exists', () => {
			expect(hasComponent(mockIndex as any, 'missing')).toBe(false);
		});

		it('hasFace returns true if exists', () => {
			expect(hasFace(mockIndex as any, 'blog')).toBe(true);
		});

		it('hasShared returns true if exists', () => {
			expect(hasShared(mockIndex as any, 'utils')).toBe(true);
		});

		it('getFace returns face', () => {
			expect(getFace(mockIndex as any, 'blog')).toEqual(mockIndex.faces.blog);
		});

		it('getFace returns null if missing', () => {
			expect(getFace(mockIndex as any, 'missing')).toBeNull();
		});

		it('getShared returns shared', () => {
			expect(getShared(mockIndex as any, 'utils')).toEqual(mockIndex.shared.utils);
		});

		it('getShared returns null if missing', () => {
			expect(getShared(mockIndex as any, 'missing')).toBeNull();
		});

		it('getFaceChecksums returns checksums', () => {
			const checksums = getFaceChecksums(mockIndex as any, 'blog');
			expect(checksums).toEqual({ 'blog-layout.svelte': 'sha256-def=' });
		});

		it('getFaceChecksums returns null if missing', () => {
			expect(getFaceChecksums(mockIndex as any, 'missing')).toBeNull();
		});

		it('getSharedChecksums returns checksums', () => {
			const checksums = getSharedChecksums(mockIndex as any, 'utils');
			expect(checksums).toEqual({ 'utils.ts': 'sha256-ghi=' });
		});

		it('getSharedChecksums returns null if missing', () => {
			expect(getSharedChecksums(mockIndex as any, 'missing')).toBeNull();
		});
	});

	describe('Cache management', () => {
		it('clearAllRegistryCache removes cache dir', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			await clearAllRegistryCache();
			expect(fs.remove).toHaveBeenCalled();
		});

		it('clearRegistryCache removes specific cache files', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			await clearRegistryCache('v1.0.0');
			expect(fs.remove).toHaveBeenCalledTimes(2); // json and meta.json
		});
	});
});
