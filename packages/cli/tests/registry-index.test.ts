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
} from '../src/utils/registry-index.js';
import * as gitFetch from '../src/utils/git-fetch.js';
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
	faces: {},
	shared: {},
	checksums: {},
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
	});

	describe('Cache management', () => {
		it('clearAllRegistryCache removes cache dir', async () => {
			vi.mocked(fs.pathExists).mockResolvedValue(true);
			await clearAllRegistryCache();
			expect(fs.remove).toHaveBeenCalled();
		});
	});
});
