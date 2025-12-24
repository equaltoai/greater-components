import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock fs-extra
const fsStore = new Map<string, string>();
const fsMock = {
	pathExists: vi.fn(async (p: string) => fsStore.has(p)),
	readFile: vi.fn(async (p: string) => {
		if (!fsStore.has(p)) throw new Error(`missing ${p}`);
		return fsStore.get(p) as string;
	}),
	writeFile: vi.fn(async (p: string, content: string) => {
		fsStore.set(p, content);
	}),
	appendFile: vi.fn(async (p: string, content: string) => {
		const existing = fsStore.get(p) || '';
		fsStore.set(p, existing + content);
	}),
	ensureDir: vi.fn(async () => {}),
	remove: vi.fn(async (p: string) => {
		fsStore.delete(p);
	}),
	stat: vi.fn(async () => ({ size: 1024 })),
	rename: vi.fn(async (from: string, to: string) => {
		const content = fsStore.get(from);
		if (content) {
			fsStore.set(to, content);
			fsStore.delete(from);
		}
	}),
};

vi.mock('fs-extra', () => ({
	default: fsMock,
	...fsMock,
}));

// Mock execa for git commands
const execaMock = vi.fn();
vi.mock('execa', () => ({
	execa: execaMock,
}));

describe('security utilities', () => {
	beforeEach(() => {
		fsStore.clear();
		vi.clearAllMocks();
	});

	describe('verifyGitTag', () => {
		it('returns valid status for GPG signed tag', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'gpg: Good signature from "Test User <test@example.com>"',
					stderr: 'using RSA key ABC123',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(true);
			expect(result.signatureStatus).toBe('valid');
			expect(result.signatureType).toBe('gpg');
			expect(result.signer).toContain('Test User');
		});

		it('returns invalid status for BAD signature', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'gpg: BAD signature from "Test User <test@example.com>"',
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('invalid');
			expect(result.errorMessage).toContain('Tag signature is invalid');
		});

		it('returns unknown_key status when public key is missing', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: "gpg: Can't check signature: No public key",
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('unknown_key');
			expect(result.errorMessage).toContain('Public key not found');
		});

		it('returns expired status for expired signature', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'gpg: signature made ... expired',
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('expired');
			expect(result.errorMessage).toContain('Tag signature has expired');
		});

		it('returns valid status for SSH signed tag', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'Good "git" signature with "ssh-ed25519" key',
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(true);
			expect(result.signatureStatus).toBe('valid');
			expect(result.signatureType).toBe('ssh');
			expect(result.signer).toBe('ssh-ed25519');
		});

		it('returns invalid status for failed SSH signature', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'ssh-something', // Triggers SSH path but not "Good 'git' signature"
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('invalid');
			expect(result.signatureType).toBe('ssh');
		});

		it('returns unsigned status for unsigned tag', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'error: no signature found',
					stderr: '',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('unsigned');
		});

		it('returns error status when git is not available', async () => {
			execaMock.mockRejectedValueOnce(new Error('git not found'));

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.verified).toBe(false);
			expect(result.signatureStatus).toBe('error');
			expect(result.errorMessage).toContain('Git is not installed');
		});

		it('extracts key ID from GPG output', async () => {
			execaMock
				.mockResolvedValueOnce({ stdout: 'git version 2.40.0', stderr: '' })
				.mockResolvedValueOnce({
					stdout: 'gpg: Good signature from "Test User <test@example.com>"',
					stderr: 'using RSA key ABC123DEF456',
				});

			const { verifyGitTag } = await import('../src/utils/security.js');
			const result = await verifyGitTag('v1.0.0');

			expect(result.keyId).toBe('ABC123DEF456');
		});
	});

	describe('verifyFileIntegrity', () => {
		it('verifies files with matching checksums', async () => {
			const { verifyFileIntegrity } = await import('../src/utils/security.js');
			const { computeChecksum } = await import('../src/utils/integrity.js');

			const content = Buffer.from('test content');
			const checksum = computeChecksum(content);

			const files = [{ path: 'test.ts', content, expectedChecksum: checksum }];

			const report = verifyFileIntegrity(files);

			expect(report.allVerified).toBe(true);
			expect(report.verifiedFiles).toBe(1);
			expect(report.failedFiles).toBe(0);
		});

		it('fails verification for mismatched checksums', async () => {
			const { verifyFileIntegrity } = await import('../src/utils/security.js');

			const files = [
				{
					path: 'test.ts',
					content: Buffer.from('test content'),
					expectedChecksum: 'sha256-wrongchecksum',
				},
			];

			const report = verifyFileIntegrity(files, undefined, { failFast: false });

			expect(report.allVerified).toBe(false);
			expect(report.failedFiles).toBe(1);
		});

		it('throws on failFast with mismatch', async () => {
			const { verifyFileIntegrity, ChecksumVerificationError } =
				await import('../src/utils/security.js');

			const files = [
				{
					path: 'test.ts',
					content: Buffer.from('test content'),
					expectedChecksum: 'sha256-wrongchecksum',
				},
			];

			expect(() => verifyFileIntegrity(files, undefined, { failFast: true })).toThrow(
				ChecksumVerificationError
			);
		});

		it('skips missing checksums when skipMissing is true', async () => {
			const { verifyFileIntegrity } = await import('../src/utils/security.js');
			const files = [
				{
					path: 'test.ts',
					content: Buffer.from('test content'),
					// No expectedChecksum
				},
			];

			const report = verifyFileIntegrity(files, undefined, { skipMissing: true });
			expect(report.skippedFiles).toBe(1);
			expect(report.failedFiles).toBe(0);
			expect(report.allVerified).toBe(false);
		});

		it('fails on missing checksums when skipMissing is false', async () => {
			const { verifyFileIntegrity } = await import('../src/utils/security.js');
			const files = [
				{
					path: 'test.ts',
					content: Buffer.from('test content'),
					// No expectedChecksum
				},
			];

			const report = verifyFileIntegrity(files, undefined, { skipMissing: false });
			expect(report.skippedFiles).toBe(0);
			expect(report.failedFiles).toBe(1);
			expect(report.allVerified).toBe(false);
		});
	});

	describe('audit logging', () => {
		it('writes and reads audit log entries', async () => {
			const { writeAuditLog, readAuditLog, clearAuditLog } =
				await import('../src/utils/security.js');

			const entry = {
				timestamp: new Date().toISOString(),
				action: 'install' as const,
				component: 'button',
				ref: 'v1.0.0',
				verified: true,
				success: true,
			};

			await writeAuditLog(entry);

			const entries = await readAuditLog();
			expect(entries.length).toBeGreaterThan(0);
			expect(entries[0].component).toBe('button');

			await clearAuditLog();
		});

		it('logs installation', async () => {
			const { logInstallation, readAuditLog, clearAuditLog } =
				await import('../src/utils/security.js');

			await logInstallation('button', 'v1.0.0', {}, true, 'valid');

			const entries = await readAuditLog();
			expect(entries[0].action).toBe('install');
			expect(entries[0].signatureStatus).toBe('valid');

			await clearAuditLog();
		});

		it('logs security warning', async () => {
			const { logSecurityWarning, readAuditLog, clearAuditLog } =
				await import('../src/utils/security.js');

			await logSecurityWarning({
				type: 'unsigned_tag',
				message: 'warning',
				severity: 'medium',
				timestamp: new Date(),
			});

			const entries = await readAuditLog();
			expect(entries[0].action).toBe('security_warning');

			await clearAuditLog();
		});

		it('filters audit log by action', async () => {
			const { writeAuditLog, readAuditLog, clearAuditLog } =
				await import('../src/utils/security.js');

			await writeAuditLog({
				timestamp: new Date().toISOString(),
				action: 'install',
				component: 'button',
				success: true,
			});

			await writeAuditLog({
				timestamp: new Date().toISOString(),
				action: 'security_warning',
				warnings: ['test warning'],
				success: true,
			});

			const installEntries = await readAuditLog({ action: 'install' });
			expect(installEntries.every((e) => e.action === 'install')).toBe(true);

			await clearAuditLog();
		});

		it('respects limit option', async () => {
			const { writeAuditLog, readAuditLog, clearAuditLog } =
				await import('../src/utils/security.js');

			for (let i = 0; i < 5; i++) {
				await writeAuditLog({
					timestamp: new Date().toISOString(),
					action: 'install',
					component: `component-${i}`,
					success: true,
				});
			}

			const entries = await readAuditLog({ limit: 2 });
			expect(entries.length).toBe(2);

			await clearAuditLog();
		});

		it('rotates logs when size exceeded', async () => {
			const { writeAuditLog, getAuditLogPath, SECURITY_CONFIG, clearAuditLog } =
				await import('../src/utils/security.js');

			// Mock size to trigger rotation
			vi.mocked(fsMock.stat).mockResolvedValueOnce({
				size: SECURITY_CONFIG.MAX_AUDIT_LOG_SIZE + 1,
			} as any);

			// Mock existence of old logs
			fsStore.set(getAuditLogPath(), 'old content');

			await writeAuditLog({
				timestamp: new Date().toISOString(),
				action: 'install',
				success: true,
			});

			expect(fsMock.rename).toHaveBeenCalled();
			await clearAuditLog();
		});
	});

	describe('security warnings', () => {
		it('emits force overwrite warning', async () => {
			const { warnForceOverwrite } = await import('../src/utils/security.js');

			const warning = warnForceOverwrite('/path/to/file.ts');

			expect(warning.type).toBe('force_overwrite');
			expect(warning.severity).toBe('medium');
		});

		it('emits skip verification warning', async () => {
			const { warnSkipVerification } = await import('../src/utils/security.js');

			const warning = warnSkipVerification();

			expect(warning.type).toBe('skip_verification');
			expect(warning.severity).toBe('high');
		});

		it('emits unsigned tag warning', async () => {
			const { warnUnsignedTag } = await import('../src/utils/security.js');

			const warning = warnUnsignedTag('v1.0.0');

			expect(warning.type).toBe('unsigned_tag');
			expect(warning.context?.ref).toBe('v1.0.0');
		});

		it('emits network error warning', async () => {
			const { warnNetworkError } = await import('../src/utils/security.js');

			const warning = warnNetworkError(new Error('fail'), 1, 3);
			expect(warning.type).toBe('network_error');
			expect(warning.severity).toBe('medium');

			const criticalWarning = warnNetworkError(new Error('fail'), 3, 3);
			expect(criticalWarning.severity).toBe('high');
		});
	});

	describe('shouldVerify', () => {
		it('returns true by default', async () => {
			const { shouldVerify } = await import('../src/utils/security.js');

			expect(shouldVerify({})).toBe(true);
		});

		it('returns false when skipVerification is true', async () => {
			const { shouldVerify } = await import('../src/utils/security.js');

			expect(shouldVerify({ skipVerification: true })).toBe(false);
		});
	});
});

describe('ChecksumVerificationError', () => {
	it('includes file path and checksums in error', async () => {
		const { ChecksumVerificationError } = await import('../src/utils/security.js');

		const error = new ChecksumVerificationError(
			'Checksum mismatch',
			'/path/to/file.ts',
			'sha256-expected',
			'sha256-actual'
		);

		expect(error.filePath).toBe('/path/to/file.ts');
		expect(error.expectedChecksum).toBe('sha256-expected');
		expect(error.actualChecksum).toBe('sha256-actual');
		expect(error.code).toBe('CHECKSUM_VERIFICATION_FAILED');
	});
});

describe('SignatureVerificationError', () => {
	it('includes ref and signature status in error', async () => {
		const { SignatureVerificationError } = await import('../src/utils/security.js');

		const error = new SignatureVerificationError('Signature invalid', 'v1.0.0', 'invalid');

		expect(error.ref).toBe('v1.0.0');
		expect(error.signatureStatus).toBe('invalid');
		expect(error.code).toBe('SIGNATURE_VERIFICATION_FAILED');
	});
});
