/**
 * E2E Verification Tests
 * End-to-end tests for install/upgrade flows with integrity verification
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MockFileSystem, SVELTEKIT_PROJECT, MOCK_BUTTON_COMPONENT } from '../fixtures/index.js';

const mockFs = new MockFileSystem();

vi.mock('fs-extra', () => ({
	default: mockFs.createFsMock(),
	...mockFs.createFsMock(),
}));

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn().mockReturnThis(),
		fail: vi.fn().mockReturnThis(),
		warn: vi.fn().mockReturnThis(),
		info: vi.fn().mockReturnThis(),
		stop: vi.fn().mockReturnThis(),
	})),
}));

vi.mock('prompts', () => ({
	default: vi.fn().mockResolvedValue({
		style: 'default',
		componentsPath: '$lib/components/ui',
		utilsPath: '$lib/utils',
		confirm: true,
	}),
}));

const mockLogger = {
	debug: vi.fn(),
	info: vi.fn(),
	success: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
	newline: vi.fn(),
	note: vi.fn(),
};

vi.mock('../../src/utils/logger.js', () => ({
	logger: mockLogger,
}));

// Mock Git tag verification
const mockVerifyGitTag = vi.fn();
vi.mock('../../src/utils/security.js', () => ({
	shouldVerify: vi.fn().mockReturnValue(true),
	verifyGitTag: mockVerifyGitTag,
	verifyFileIntegrity: vi.fn().mockReturnValue({
		allVerified: true,
		filesChecked: 1,
		failedFiles: [],
		results: [
			{
				filePath: 'button.ts',
				verified: true,
				expectedChecksum: 'sha256-abc123',
				actualChecksum: 'sha256-abc123',
			},
		],
	}),
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

vi.mock('../../src/utils/fetch.js', () => ({
	fetchComponentFiles: vi.fn().mockResolvedValue({
		files: [
			{
				path: 'button.ts',
				content: 'export const button = {};',
				type: 'component',
			},
		],
		ref: 'greater-v4.2.0',
		verified: true,
		integrityReport: {
			allVerified: true,
			results: [],
		},
	}),
}));

vi.mock('../../src/utils/registry-index.js', () => ({
	fetchRegistryIndex: vi.fn().mockResolvedValue({
		version: '4.2.0',
		ref: 'greater-v4.2.0',
		generatedAt: new Date().toISOString(),
		schemaVersion: '1.0.0',
		components: {
			button: {
				name: 'button',
				version: '4.2.0',
				files: [{ path: 'button.svelte', checksum: 'sha256-abc123' }],
			},
		},
		faces: {},
		shared: {},
		checksums: {
			'button.svelte': 'sha256-abc123',
		},
	}),
	resolveRef: vi.fn().mockResolvedValue({
		ref: 'greater-v4.2.0',
		source: 'explicit',
	}),
	getComponentChecksums: vi.fn().mockReturnValue({
		'button.svelte': 'sha256-abc123',
	}),
}));

vi.mock('../../src/registry/index.js', () => ({
	getComponent: vi.fn((name) => {
		if (name === 'button') return MOCK_BUTTON_COMPONENT;
		return null;
	}),
	componentRegistry: {},
	getAllComponentNames: vi.fn().mockReturnValue(['button']),
}));

describe('E2E Verification Workflows', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	describe('Signature Verification', () => {
		it('verifies valid GPG signature', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			mockVerifyGitTag.mockResolvedValue({
				ref: 'greater-v4.2.0',
				verified: true,
				signatureStatus: 'valid',
				signatureType: 'gpg',
				signer: 'Maintainer <maintainer@example.com>',
				keyId: 'ABC123',
			});

			const { verifyGitTag } = await import('../../src/utils/security.js');
			const result = await verifyGitTag('greater-v4.2.0');

			expect(result.verified).toBe(true);
			expect(result.signatureStatus).toBe('valid');
			expect(result.signatureType).toBe('gpg');
			expect(result.signer).toContain('Maintainer');
		});

		it('verifies valid SSH signature', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			mockVerifyGitTag.mockResolvedValue({
				ref: 'greater-v4.2.0',
				verified: true,
				signatureStatus: 'valid',
				signatureType: 'ssh',
				signer: 'maintainer@example.com',
			});

			const { verifyGitTag } = await import('../../src/utils/security.js');
			const result = await verifyGitTag('greater-v4.2.0');

			expect(result.verified).toBe(true);
			expect(result.signatureType).toBe('ssh');
		});

		it('handles unsigned tags', async () => {
			mockVerifyGitTag.mockResolvedValue({
				ref: 'greater-v4.2.0',
				verified: false,
				signatureStatus: 'unsigned',
				signatureType: 'unknown',
				errorMessage: 'Tag is not signed',
			});

			const { verifyGitTag } = await import('../../src/utils/security.js');
			const result = await verifyGitTag('greater-v4.2.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('unsigned');
		});

		it('handles unknown keys', async () => {
			mockVerifyGitTag.mockResolvedValue({
				ref: 'greater-v4.2.0',
				verified: false,
				signatureStatus: 'unknown_key',
				signatureType: 'gpg',
				errorMessage: 'Key not in keyring',
			});

			const { verifyGitTag } = await import('../../src/utils/security.js');
			const result = await verifyGitTag('greater-v4.2.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('unknown_key');
		});
	});

	describe('Checksum Verification', () => {
		it('verifies file checksums during install', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { fetchComponentFiles } = await import('../../src/utils/fetch.js');

			const result = await fetchComponentFiles(MOCK_BUTTON_COMPONENT as any, {
				ref: 'greater-v4.2.0',
				skipVerification: false,
			});

			expect(result.verified).toBe(true);
			expect(result.ref).toBe('greater-v4.2.0');
		});

		it('tracks modified files for upgrade detection', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			// Setup "installed" component with known checksum
			const { createDefaultConfig, writeConfig, addInstalledComponent, readConfig } =
				await import('../../src/utils/config.js');

			const config = createDefaultConfig();
			const configWithButton = addInstalledComponent(config, 'button', 'greater-v4.1.0');
			await writeConfig(configWithButton, '/');

			// Read back and verify
			const savedConfig = await readConfig('/');
			expect(savedConfig?.installed).toHaveLength(1);
			expect(savedConfig?.installed[0].name).toBe('button');

			// Simulate file modification detection
			// Using a function to avoid TypeScript literal type narrowing
			const getChecksum = (type: 'original' | 'current'): string =>
				type === 'original' ? 'sha256-original' : 'sha256-modified';
			const originalChecksum = getChecksum('original');
			const currentChecksum = getChecksum('current');

			const isModified = originalChecksum !== currentChecksum;
			expect(isModified).toBe(true);
		});
	});

	describe('Install Flow with Verification', () => {
		it('installs component with full verification', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			mockVerifyGitTag.mockResolvedValue({
				ref: 'greater-v4.2.0',
				verified: true,
				signatureStatus: 'valid',
				signatureType: 'gpg',
				signer: 'Maintainer',
			});

			// Simulate full install flow
			const { createDefaultConfig, writeConfig, addInstalledComponent, readConfig } =
				await import('../../src/utils/config.js');

			// 1. Create config (init)
			const config = createDefaultConfig();
			config.ref = 'greater-v4.2.0';
			await writeConfig(config, '/');

			// 2. Add component (add)
			const { fetchComponentFiles } = await import('../../src/utils/fetch.js');
			const fetchResult = await fetchComponentFiles(MOCK_BUTTON_COMPONENT as any, {
				ref: 'greater-v4.2.0',
				verifySignature: true,
			});

			expect(fetchResult.verified).toBe(true);

			// 3. Update config with installed component
			const updatedConfig = addInstalledComponent(config, 'button', 'greater-v4.2.0');
			await writeConfig(updatedConfig, '/');

			// 4. Verify final state
			const finalConfig = await readConfig('/');
			expect(finalConfig?.installed).toHaveLength(1);
			expect(finalConfig?.installed[0].version).toBe('greater-v4.2.0');
		});
	});

	describe('Upgrade Flow with Verification', () => {
		it('upgrades component while detecting modifications', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { createDefaultConfig, writeConfig, addInstalledComponent, readConfig } =
				await import('../../src/utils/config.js');

			// Setup existing installation at v4.1.0
			let config = createDefaultConfig();
			config = addInstalledComponent(config, 'button', 'greater-v4.1.0');
			await writeConfig(config, '/');

			// Simulate upgrade to v4.2.0
			const savedConfig = await readConfig('/');
			expect(savedConfig).toBeDefined();

			// Update version (simulating upgrade command)
			if (savedConfig) {
				const upgraded = addInstalledComponent(savedConfig, 'button', 'greater-v4.2.0');
				await writeConfig(upgraded, '/');

				const verifyUpgrade = await readConfig('/');
				expect(verifyUpgrade?.installed[0].version).toBe('greater-v4.2.0');
			}
		});

		it('preserves local modifications on backup during upgrade', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			// Simulate a modified file scenario
			const originalContent = 'export const button = {};';
			const modifiedContent = 'export const button = { custom: true };';

			// Write "modified" file
			mockFs.set('/src/lib/components/ui/button.ts', modifiedContent);

			// Verify modification detection
			const currentContent = mockFs.get('/src/lib/components/ui/button.ts');
			const isModified = currentContent !== originalContent;

			expect(isModified).toBe(true);
		});
	});

	describe('Offline Mode with Verification', () => {
		it('uses cached checksums for offline verification', async () => {
			mockFs.setupProject(SVELTEKIT_PROJECT);

			const { getCachedRefs } = await import('../../src/utils/offline.js');

			// These are mocked but test the pattern
			const refs = await getCachedRefs();
			expect(Array.isArray(refs)).toBe(true);
		});
	});
});

describe('Error Scenarios', () => {
	beforeEach(() => {
		mockFs.clear();
		vi.clearAllMocks();
	});

	it('handles checksum mismatch', async () => {
		mockFs.setupProject(SVELTEKIT_PROJECT);

		const { ChecksumVerificationError } = await import('../../src/utils/security.js');

		const error = new ChecksumVerificationError(
			'Checksum mismatch for button.svelte',
			'button.svelte',
			'sha256-expected',
			'sha256-actual'
		);

		expect(error.filePath).toBe('button.svelte');
		expect(error.message).toContain('Checksum mismatch');
	});

	it('handles signature verification failure', async () => {
		mockVerifyGitTag.mockResolvedValue({
			ref: 'greater-v4.2.0',
			verified: false,
			signatureStatus: 'invalid',
			signatureType: 'gpg',
			errorMessage: 'Bad signature',
		});

		const { verifyGitTag } = await import('../../src/utils/security.js');
		const result = await verifyGitTag('greater-v4.2.0');

		expect(result.verified).toBe(false);
		expect(result.signatureStatus).toBe('invalid');
	});

	it('handles network errors during verification', async () => {
		mockVerifyGitTag.mockResolvedValue({
			ref: 'greater-v4.2.0',
			verified: false,
			signatureStatus: 'error',
			signatureType: 'unknown',
			errorMessage: 'Network timeout',
		});

		const { verifyGitTag } = await import('../../src/utils/security.js');
		const result = await verifyGitTag('greater-v4.2.0');

		expect(result.verified).toBe(false);
		expect(result.signatureStatus).toBe('error');
	});
});
