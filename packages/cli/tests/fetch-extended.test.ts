/**
 * Fetch Utilities Extended Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	fetchComponentFiles,
	fetchComponents,
	fetchComponentsWithReport,
	ChecksumVerificationError,
} from '../src/utils/fetch.js';
import * as gitFetch from '../src/utils/git-fetch.js';
import * as registryIndex from '../src/utils/registry-index.js';
import * as security from '../src/utils/security.js';

vi.mock('../src/utils/git-fetch.js', () => ({
	fetchFromGitTag: vi.fn(),
	NetworkError: class NetworkError extends Error {},
}));

vi.mock('../src/utils/registry-index.js', () => ({
	fetchRegistryIndex: vi.fn(),
	resolveRef: vi.fn(),
}));

vi.mock('../src/utils/security.js', () => ({
	shouldVerify: vi.fn(),
	verifyGitTag: vi.fn(),
	verifyFileIntegrity: vi.fn(),
	warnUnsignedTag: vi.fn(),
	ChecksumVerificationError: class ChecksumVerificationError extends Error {},
}));

vi.mock('../src/utils/logger.js', () => ({
	logger: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	},
}));

const mockComponent = {
	name: 'button',
	type: 'primitive',
	description: 'Button',
	files: [{ path: 'lib/primitives/button.ts', content: '', type: 'component' as const }],
	version: '1.0.0',
	dependencies: [],
	devDependencies: [],
	registryDependencies: [],
};

const mockIndex = {
	schemaVersion: '1.0.0',
	version: '1.0.0',
	ref: 'v1.0.0',
	generatedAt: '',
	components: {},
	checksums: {
		'packages/headless/src/primitives/button.ts': 'sha256-abc',
	},
};

describe('Fetch Utils', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(registryIndex.resolveRef).mockResolvedValue({ ref: 'v1.0.0', source: 'explicit' });
		vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue(mockIndex as any);
		vi.mocked(security.shouldVerify).mockReturnValue(true);
		vi.mocked(security.verifyFileIntegrity).mockReturnValue({ allVerified: true, results: [] });
		vi.mocked(gitFetch.fetchFromGitTag).mockResolvedValue(Buffer.from('content'));
	});

	describe('Path Resolution', () => {
		it('resolves primitive path correctly', async () => {
			await fetchComponentFiles(mockComponent);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/headless/src/primitives/button.ts', // From candidates
				expect.any(Object)
			);
		});

		it('resolves shared module path', async () => {
			const sharedComponent = {
				...mockComponent,
				files: [{ path: 'shared/auth/index.ts', content: '', type: 'component' as const }],
			};
			await fetchComponentFiles(sharedComponent);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/shared/auth/src/index.ts',
				expect.any(Object)
			);
		});

		it('resolves adapter path', async () => {
			const adapterComponent = {
				...mockComponent,
				files: [{ path: 'lib/adapters/svelte.ts', content: '', type: 'component' as const }],
			};
			await fetchComponentFiles(adapterComponent);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/adapters/src/svelte.ts',
				expect.any(Object)
			);
		});

		it('resolves types path', async () => {
			const typesComponent = {
				...mockComponent,
				files: [{ path: 'lib/types/index.ts', content: '', type: 'component' as const }],
			};
			await fetchComponentFiles(typesComponent);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/headless/src/types/index.ts',
				expect.any(Object)
			);
		});

		it('resolves utils path', async () => {
			const utilsComponent = {
				...mockComponent,
				files: [{ path: 'lib/utils/index.ts', content: '', type: 'component' as const }],
			};
			await fetchComponentFiles(utilsComponent);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/headless/src/utils/index.ts',
				expect.any(Object)
			);
		});

		it('resolves face components path', async () => {
			// Needs heuristic match or known candidate
			// The heuristic checks FACE_CANDIDATES
			const faceComponent = {
				...mockComponent,
				files: [
					{ path: 'lib/components/Timeline/Root.svelte', content: '', type: 'component' as const },
				],
			};

			// We need to force a candidate match by setting up gitFetch to only succeed for the correct one?
			// Or better, set up checksums for one candidate.
			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {
					'packages/faces/social/src/components/Timeline/Root.svelte': 'sha256-123',
				},
			} as any);

			await fetchComponentFiles(faceComponent);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				'v1.0.0',
				'packages/faces/social/src/components/Timeline/Root.svelte',
				expect.any(Object)
			);
		});

		it('tries fallback candidates if no checksum match', async () => {
			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {},
			} as any);

			// Mock failure for first candidates, success for last
			vi.mocked(gitFetch.fetchFromGitTag)
				.mockRejectedValueOnce(new Error('404'))
				.mockRejectedValueOnce(new Error('404'))
				.mockResolvedValue(Buffer.from('content'));

			const result = await fetchComponentFiles(mockComponent);
			expect(result.files.length).toBe(1);
			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledTimes(3);
		});

		it('throws if all candidates fail', async () => {
			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {},
			} as any);
			vi.mocked(gitFetch.fetchFromGitTag).mockRejectedValue(new Error('404'));

			await expect(fetchComponentFiles(mockComponent)).rejects.toThrow(
				'Failed to resolve source path'
			);
		});
	});

	describe('Verification', () => {
		it('verifies git signature if requested', async () => {
			vi.mocked(security.verifyGitTag).mockResolvedValue({
				verified: true,
				signer: 'Me',
				signatureStatus: 'good',
			});

			await fetchComponentFiles(mockComponent, { verifySignature: true, verbose: true });

			expect(security.verifyGitTag).toHaveBeenCalledWith('v1.0.0');
		});

		it('warns on unsigned tag', async () => {
			vi.mocked(security.verifyGitTag).mockResolvedValue({
				verified: false,
				signatureStatus: 'unsigned',
			});

			await fetchComponentFiles(mockComponent, { verifySignature: true, verbose: true });

			expect(security.warnUnsignedTag).toHaveBeenCalled();
		});

		it('verifies integrity of fetched files', async () => {
			await fetchComponentFiles(mockComponent);

			expect(security.verifyFileIntegrity).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({ path: 'packages/headless/src/primitives/button.ts' }),
				]),
				mockIndex.checksums,
				expect.any(Object)
			);
		});

		it('skips verification if registry index missing', async () => {
			vi.mocked(registryIndex.fetchRegistryIndex).mockRejectedValue(new Error('Network'));

			const result = await fetchComponentFiles(mockComponent, { verbose: true });

			expect(result.verified).toBe(false);
		});

		it('fails fast on integrity failure', async () => {
			vi.mocked(security.verifyFileIntegrity).mockReturnValue({
				allVerified: false,
				results: [
					{ filePath: 'file', verified: false, expectedChecksum: 'a', actualChecksum: 'b' },
				],
			});

			await expect(fetchComponentFiles(mockComponent)).rejects.toThrow(ChecksumVerificationError);
		});

		it('does not fail fast if failFast is false', async () => {
			vi.mocked(security.verifyFileIntegrity).mockReturnValue({
				allVerified: false,
				results: [
					{ filePath: 'file', verified: false, expectedChecksum: 'a', actualChecksum: 'b' },
				],
			});

			const result = await fetchComponentFiles(mockComponent, { failFast: false });
			expect(result.verified).toBe(false);
		});

		it('logs errors in verbose mode when verification fails', async () => {
			vi.mocked(security.verifyFileIntegrity).mockReturnValue({
				allVerified: false,
				results: [
					{ filePath: 'file', verified: false, expectedChecksum: 'a', actualChecksum: 'b' },
				],
			});

			await fetchComponentFiles(mockComponent, { failFast: false, verbose: true });
			// The logger mock should record the error
			// I need to import logger from mock to check?
			// I mocked it at top level.
			const { logger } = await import('../src/utils/logger.js');
			expect(logger.error).toHaveBeenCalled();
		});
	});

	describe('Path Resolution Extended', () => {
		it('resolves patterns path', async () => {
			const patternComponent = {
				...mockComponent,
				files: [
					{ path: 'patterns/thread-view/index.svelte', content: '', type: 'component' as const },
				],
			};

			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {
					'packages/faces/social/src/patterns/thread-view/index.svelte': 'sha256-123',
				},
			} as any);

			await fetchComponentFiles(patternComponent);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				expect.any(String),
				'packages/faces/social/src/patterns/thread-view/index.svelte',
				expect.any(Object)
			);
		});

		it('resolves lib/patterns path', async () => {
			const patternComponent = {
				...mockComponent,
				files: [
					{
						path: 'lib/patterns/thread-view/index.svelte',
						content: '',
						type: 'component' as const,
					},
				],
			};

			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {
					'packages/faces/social/src/patterns/thread-view/index.svelte': 'sha256-123',
				},
			} as any);

			await fetchComponentFiles(patternComponent);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				expect.any(String),
				'packages/faces/social/src/patterns/thread-view/index.svelte',
				expect.any(Object)
			);
		});

		it('uses suffix based resolution for components', async () => {
			const component = {
				...mockComponent,
				files: [
					{ path: 'lib/components/Timeline/Root.svelte', content: '', type: 'component' as const },
				],
			};

			// Checksum doesn't match exact candidate generation logic (e.g. face name)
			// But matches suffix /src/components/Timeline/Root.svelte
			vi.mocked(registryIndex.fetchRegistryIndex).mockResolvedValue({
				...mockIndex,
				checksums: {
					'some/weird/path/src/components/Timeline/Root.svelte': 'sha256-123',
				},
			} as any);

			await fetchComponentFiles(component);

			expect(gitFetch.fetchFromGitTag).toHaveBeenCalledWith(
				expect.any(String),
				'some/weird/path/src/components/Timeline/Root.svelte',
				expect.any(Object)
			);
		});
	});

	describe('Bulk Fetch', () => {
		it('fetchComponents fetches multiple components', async () => {
			const registry = { button: mockComponent };
			const result = await fetchComponents(['button'], registry, { verbose: true });

			expect(result.has('button')).toBe(true);
		});

		it('fetchComponents throws if component missing', async () => {
			await expect(fetchComponents(['missing'], {})).rejects.toThrow('not found');
		});

		it('fetchComponentsWithReport returns detailed report', async () => {
			const registry = { button: mockComponent };
			const result = await fetchComponentsWithReport(['button'], registry);

			expect(result.allVerified).toBe(true);
			expect(result.components.get('button')?.verified).toBe(true);
		});
	});
});
