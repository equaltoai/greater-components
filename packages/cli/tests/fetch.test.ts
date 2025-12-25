/**
 * Fetch Utility Tests
 * Tests for component file fetching with integrity verification
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../src/utils/git-fetch.js', () => ({
	fetchFromGitTag: vi.fn(),
	resolveGitRefToCommit: vi.fn().mockResolvedValue(null),
	NetworkError: class NetworkError extends Error {
		constructor(
			message: string,
			public statusCode?: number,
			public url?: string
		) {
			super(message);
			this.name = 'NetworkError';
		}
	},
}));

vi.mock('../src/utils/registry-index.js', () => ({
	fetchRegistryIndex: vi.fn(),
	resolveRef: vi.fn().mockImplementation(async (explicitRef?: string) => ({
		ref: explicitRef || 'main',
		source: explicitRef ? 'explicit' : 'fallback',
	})),
}));

vi.mock('../src/utils/security.js', () => ({
	shouldVerify: vi.fn(),
	verifyGitTag: vi.fn(),
	verifyFileIntegrity: vi.fn(),
	warnUnsignedTag: vi.fn(),
	ChecksumVerificationError: class ChecksumVerificationError extends Error {
		constructor(
			message: string,
			public filePath?: string,
			public expected?: string,
			public actual?: string
		) {
			super(message);
			this.name = 'ChecksumVerificationError';
		}
	},
}));

describe('fetch utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('fetchComponentFiles', () => {
		it('should fetch all files for a component', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify } = await import('../src/utils/security.js');

			vi.mocked(shouldVerify).mockReturnValue(false);
			vi.mocked(fetchFromGitTag).mockResolvedValue(Buffer.from('file content'));

			const { fetchComponentFiles } = await import('../src/utils/fetch.js');

			const component = {
				name: 'test-component',
				type: 'primitive' as const,
				description: 'Test component',
				version: '1.0.0',
				files: [{ path: 'components/Test.svelte', content: '', type: 'component' as const }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
			};

			const result = await fetchComponentFiles(component, { ref: 'v1.0.0' });

			expect(result.files).toHaveLength(1);
			expect(result.ref).toBe('v1.0.0');
		});

		it('should use default ref when not specified', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify } = await import('../src/utils/security.js');

			vi.mocked(shouldVerify).mockReturnValue(false);
			vi.mocked(fetchFromGitTag).mockResolvedValue(Buffer.from('content'));

			const { fetchComponentFiles } = await import('../src/utils/fetch.js');

			const component = {
				name: 'button',
				type: 'primitive' as const,
				description: 'Button',
				version: '1.0.0',
				files: [{ path: 'Button.svelte', content: '', type: 'component' as const }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
			};

			const result = await fetchComponentFiles(component);

			expect(result.ref).toBeDefined();
		});

		it('should handle verification when enabled', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify, verifyFileIntegrity } = await import('../src/utils/security.js');
			const { fetchRegistryIndex } = await import('../src/utils/registry-index.js');

			vi.mocked(shouldVerify).mockReturnValue(true);
			vi.mocked(fetchFromGitTag).mockResolvedValue(Buffer.from('content'));
			vi.mocked(fetchRegistryIndex).mockResolvedValue({
				version: '1.0.0',
				ref: 'v1.0.0',
				generatedAt: new Date().toISOString(),
				components: {},
				checksums: {},
			});
			vi.mocked(verifyFileIntegrity).mockReturnValue({
				allVerified: true,
				totalFiles: 1,
				verifiedFiles: 1,
				failedFiles: 0,
				skippedFiles: 0,
				results: [
					{
						filePath: 'Test.svelte',
						verified: true,
						expectedChecksum: 'abc123',
						actualChecksum: 'abc123',
					},
				],
			});

			const { fetchComponentFiles } = await import('../src/utils/fetch.js');

			const component = {
				name: 'test',
				type: 'primitive' as const,
				description: 'Test',
				version: '1.0.0',
				files: [{ path: 'Test.svelte', content: '', type: 'component' as const }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
			};

			const result = await fetchComponentFiles(component, { skipVerification: false });

			expect(result.verified).toBe(true);
		});

		it('should throw on fetch error', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify } = await import('../src/utils/security.js');

			vi.mocked(shouldVerify).mockReturnValue(false);
			vi.mocked(fetchFromGitTag).mockRejectedValue(new Error('Network error'));

			const { fetchComponentFiles } = await import('../src/utils/fetch.js');

			const component = {
				name: 'failing',
				type: 'primitive' as const,
				description: 'Failing',
				version: '1.0.0',
				files: [{ path: 'Fail.svelte', content: '', type: 'component' as const }],
				dependencies: [],
				devDependencies: [],
				registryDependencies: [],
				tags: [],
			};

			await expect(fetchComponentFiles(component)).rejects.toThrow('Failed to fetch file');
		});
	});

	describe('fetchComponents', () => {
		it('should fetch multiple components', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify } = await import('../src/utils/security.js');

			vi.mocked(shouldVerify).mockReturnValue(false);
			vi.mocked(fetchFromGitTag).mockResolvedValue(Buffer.from('content'));

			const { fetchComponents } = await import('../src/utils/fetch.js');

			const registry = {
				button: {
					name: 'button',
					type: 'primitive' as const,
					description: 'Button',
					version: '1.0.0',
					files: [{ path: 'Button.svelte', content: '', type: 'component' as const }],
					dependencies: [],
					devDependencies: [],
					registryDependencies: [],
					tags: [],
				},
				modal: {
					name: 'modal',
					type: 'primitive' as const,
					description: 'Modal',
					version: '1.0.0',
					files: [{ path: 'Modal.svelte', content: '', type: 'component' as const }],
					dependencies: [],
					devDependencies: [],
					registryDependencies: [],
					tags: [],
				},
			};

			const result = await fetchComponents(['button', 'modal'], registry);

			expect(result.size).toBe(2);
			expect(result.has('button')).toBe(true);
			expect(result.has('modal')).toBe(true);
		});

		it('should throw when component not found in registry', async () => {
			const { fetchComponents } = await import('../src/utils/fetch.js');

			const registry = {};

			await expect(fetchComponents(['unknown'], registry)).rejects.toThrow('not found in registry');
		});
	});

	describe('fetchComponentsWithReport', () => {
		it('should return detailed report including verification status', async () => {
			const { fetchFromGitTag } = await import('../src/utils/git-fetch.js');
			const { shouldVerify } = await import('../src/utils/security.js');

			vi.mocked(shouldVerify).mockReturnValue(false);
			vi.mocked(fetchFromGitTag).mockResolvedValue(Buffer.from('content'));

			const { fetchComponentsWithReport } = await import('../src/utils/fetch.js');

			const registry = {
				button: {
					name: 'button',
					type: 'primitive' as const,
					description: 'Button',
					version: '1.0.0',
					files: [{ path: 'Button.svelte', content: '', type: 'component' as const }],
					dependencies: [],
					devDependencies: [],
					registryDependencies: [],
					tags: [],
				},
			};

			const result = await fetchComponentsWithReport(['button'], registry);

			expect(result.components.size).toBe(1);
			expect(typeof result.allVerified).toBe('boolean');
			expect(result.ref).toBeDefined();
		});

		it('should throw when component not found', async () => {
			const { fetchComponentsWithReport } = await import('../src/utils/fetch.js');

			await expect(fetchComponentsWithReport(['unknown'], {})).rejects.toThrow(
				'not found in registry'
			);
		});
	});

	describe('error exports', () => {
		it('should export error types', async () => {
			const { NetworkError, IntegrityError, ChecksumVerificationError } =
				await import('../src/utils/fetch.js');

			expect(NetworkError).toBeDefined();
			expect(IntegrityError).toBeDefined();
			expect(ChecksumVerificationError).toBeDefined();
		});
	});
});
