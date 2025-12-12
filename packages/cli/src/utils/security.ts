/**
 * Security utilities for Greater Components CLI
 * Provides Git tag verification, file integrity checking, security warnings, and audit logging
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { z } from 'zod';
import { logger } from './logger.js';
import { computeChecksum, type ChecksumMap } from './integrity.js';

/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
	/** Default to requiring verification */
	VERIFY_BY_DEFAULT: true,
	/** Audit log location */
	AUDIT_LOG_DIR: path.join(os.homedir(), '.greater-components'),
	AUDIT_LOG_FILE: 'audit.log',
	/** Maximum audit log size before rotation (5MB) */
	MAX_AUDIT_LOG_SIZE: 5 * 1024 * 1024,
	/** Number of rotated logs to keep */
	AUDIT_LOG_RETENTION: 3,
} as const;

/**
 * Signature verification status
 */
export type SignatureStatus =
	| 'valid'
	| 'invalid'
	| 'unsigned'
	| 'unknown_key'
	| 'expired'
	| 'error';

/**
 * Signature type (GPG or SSH)
 */
export type SignatureType = 'gpg' | 'ssh' | 'unknown';

/**
 * Git tag verification result
 */
export interface GitTagVerificationResult {
	ref: string;
	verified: boolean;
	signatureStatus: SignatureStatus;
	signatureType: SignatureType;
	signer?: string;
	keyId?: string;
	timestamp?: Date;
	errorMessage?: string;
}

/**
 * File integrity verification result
 */
export interface FileIntegrityResult {
	filePath: string;
	verified: boolean;
	expectedChecksum: string;
	actualChecksum: string;
	size?: number;
}

/**
 * Integrity report for multiple files
 */
export interface IntegrityReport {
	totalFiles: number;
	verifiedFiles: number;
	failedFiles: number;
	skippedFiles: number;
	results: FileIntegrityResult[];
	allVerified: boolean;
}

/**
 * Fetched file with content and metadata
 */
export interface FetchedFile {
	path: string;
	content: Buffer;
	expectedChecksum?: string;
}

/**
 * Security warning types
 */
export type SecurityWarningType =
	| 'force_overwrite'
	| 'skip_verification'
	| 'unsigned_tag'
	| 'network_error'
	| 'checksum_mismatch'
	| 'unknown_source';

/**
 * Security warning
 */
export interface SecurityWarning {
	type: SecurityWarningType;
	message: string;
	severity: 'low' | 'medium' | 'high' | 'critical';
	timestamp: Date;
	context?: Record<string, unknown>;
}

/**
 * Audit log entry action types
 */
export type AuditAction =
	| 'install'
	| 'update'
	| 'remove'
	| 'verify'
	| 'fetch'
	| 'config_change'
	| 'security_warning';

/**
 * Audit log entry schema
 */
export const auditLogEntrySchema = z.object({
	timestamp: z.string().datetime(),
	action: z.enum([
		'install',
		'update',
		'remove',
		'verify',
		'fetch',
		'config_change',
		'security_warning',
	]),
	component: z.string().optional(),
	ref: z.string().optional(),
	checksums: z.record(z.string(), z.string()).optional(),
	verified: z.boolean().optional(),
	signatureStatus: z.string().optional(),
	warnings: z.array(z.string()).optional(),
	details: z.record(z.string(), z.unknown()).optional(),
	success: z.boolean(),
	errorMessage: z.string().optional(),
});

export type AuditLogEntry = z.infer<typeof auditLogEntrySchema>;

/**
 * Custom error class for security-related failures
 */
export class SecurityError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly details?: Record<string, unknown>
	) {
		super(message);
		this.name = 'SecurityError';
	}
}

/**
 * Custom error class for signature verification failures
 */
export class SignatureVerificationError extends SecurityError {
	constructor(
		message: string,
		public readonly ref: string,
		public readonly signatureStatus: SignatureStatus,
		details?: Record<string, unknown>
	) {
		super(message, 'SIGNATURE_VERIFICATION_FAILED', { ref, signatureStatus, ...details });
		this.name = 'SignatureVerificationError';
	}
}

/**
 * Custom error class for checksum verification failures
 */
export class ChecksumVerificationError extends SecurityError {
	constructor(
		message: string,
		public readonly filePath: string,
		public readonly expectedChecksum: string,
		public readonly actualChecksum: string
	) {
		super(message, 'CHECKSUM_VERIFICATION_FAILED', { filePath, expectedChecksum, actualChecksum });
		this.name = 'ChecksumVerificationError';
	}
}

/**
 * Verify a Git tag signature (GPG or SSH)
 *
 * @param ref Git tag reference to verify
 * @returns Verification result with signature details
 */
export async function verifyGitTag(ref: string): Promise<GitTagVerificationResult> {
	const result: GitTagVerificationResult = {
		ref,
		verified: false,
		signatureStatus: 'unsigned',
		signatureType: 'unknown',
	};

	try {
		// Check if git is available
		await execa('git', ['--version']);
	} catch {
		result.signatureStatus = 'error';
		result.errorMessage = 'Git is not installed or not in PATH';
		return result;
	}

	try {
		// Try to verify the tag signature
		const { stdout, stderr } = await execa('git', ['tag', '-v', ref], {
			reject: false,
		});

		const output = stdout + stderr;

		// Check for GPG signature
		if (output.includes('gpg:') || output.includes('Good signature')) {
			result.signatureType = 'gpg';

			if (output.includes('Good signature')) {
				result.verified = true;
				result.signatureStatus = 'valid';

				// Extract signer information
				const signerMatch = output.match(/Good signature from "([^"]+)"/);
				if (signerMatch) {
					result.signer = signerMatch[1];
				}

				// Extract key ID
				const keyIdMatch = output.match(/using \w+ key ([A-F0-9]+)/i);
				if (keyIdMatch) {
					result.keyId = keyIdMatch[1];
				}
			} else if (output.includes('BAD signature')) {
				result.signatureStatus = 'invalid';
				result.errorMessage = 'Tag signature is invalid';
			} else if (output.includes("Can't check signature: No public key")) {
				result.signatureStatus = 'unknown_key';
				result.errorMessage = 'Public key not found in keyring';
			} else if (output.includes('expired')) {
				result.signatureStatus = 'expired';
				result.errorMessage = 'Tag signature has expired';
			}
		}
		// Check for SSH signature
		else if (output.includes('ssh-') || output.includes('Good "git" signature')) {
			result.signatureType = 'ssh';

			if (output.includes('Good "git" signature')) {
				result.verified = true;
				result.signatureStatus = 'valid';

				// Extract signer information for SSH
				const sshSignerMatch = output.match(/with "([^"]+)" key/);
				if (sshSignerMatch) {
					result.signer = sshSignerMatch[1];
				}
			} else {
				result.signatureStatus = 'invalid';
				result.errorMessage = 'SSH signature verification failed';
			}
		}
		// No signature found
		else if (
			output.includes('error: no signature found') ||
			(output.includes('object') && !output.includes('signature'))
		) {
			result.signatureStatus = 'unsigned';
			result.errorMessage = 'Tag is not signed';
		}
	} catch (error) {
		result.signatureStatus = 'error';
		result.errorMessage =
			error instanceof Error ? error.message : 'Unknown error during verification';
	}

	return result;
}

/**
 * Verify integrity of multiple fetched files against expected checksums
 *
 * @param files Array of fetched files with content
 * @param checksums Map of file paths to expected checksums
 * @param options Verification options
 * @returns Integrity report with detailed results
 */
export function verifyFileIntegrity(
	files: FetchedFile[],
	checksums?: ChecksumMap,
	options: {
		/** Throw on first failure */
		failFast?: boolean;
		/** Skip files without checksums */
		skipMissing?: boolean;
	} = {}
): IntegrityReport {
	const { failFast = false, skipMissing = false } = options;
	const results: FileIntegrityResult[] = [];
	let verifiedFiles = 0;
	let failedFiles = 0;
	let skippedFiles = 0;

	for (const file of files) {
		const expectedChecksum = file.expectedChecksum || checksums?.[file.path];

		if (!expectedChecksum) {
			if (skipMissing) {
				skippedFiles++;
				continue;
			}
			// No checksum available - mark as failed
			const actualChecksum = computeChecksum(file.content);
			results.push({
				filePath: file.path,
				verified: false,
				expectedChecksum: '',
				actualChecksum,
				size: file.content.length,
			});
			failedFiles++;
			continue;
		}

		const actualChecksum = computeChecksum(file.content);
		const verified = actualChecksum === expectedChecksum;

		results.push({
			filePath: file.path,
			verified,
			expectedChecksum,
			actualChecksum,
			size: file.content.length,
		});

		if (verified) {
			verifiedFiles++;
		} else {
			failedFiles++;

			if (failFast) {
				throw new ChecksumVerificationError(
					`Checksum mismatch for ${file.path}`,
					file.path,
					expectedChecksum,
					actualChecksum
				);
			}
		}
	}

	return {
		totalFiles: files.length,
		verifiedFiles,
		failedFiles,
		skippedFiles,
		results,
		allVerified: failedFiles === 0 && skippedFiles === 0,
	};
}

/**
 * Emit a security warning to the console
 *
 * @param warning Security warning to emit
 */
export function emitSecurityWarning(warning: SecurityWarning): void {
	const severityColors: Record<SecurityWarning['severity'], (text: string) => string> = {
		low: (t) => t,
		medium: (t) => `\x1b[33m${t}\x1b[0m`, // yellow
		high: (t) => `\x1b[31m${t}\x1b[0m`, // red
		critical: (t) => `\x1b[1m\x1b[31m${t}\x1b[0m`, // bold red
	};

	const icons: Record<SecurityWarning['severity'], string> = {
		low: 'ℹ️',
		medium: '⚠️',
		high: '🚨',
		critical: '🛑',
	};

	const colorFn = severityColors[warning.severity];
	const icon = icons[warning.severity];

	logger.warn(colorFn(`${icon} Security Warning: ${warning.message}`));
}

/**
 * Create a security warning for force overwrite
 */
export function warnForceOverwrite(filePath: string): SecurityWarning {
	const warning: SecurityWarning = {
		type: 'force_overwrite',
		message: `Overwriting existing file: ${filePath}`,
		severity: 'medium',
		timestamp: new Date(),
		context: { filePath },
	};
	emitSecurityWarning(warning);
	return warning;
}

/**
 * Create a security warning for skipping verification
 */
export function warnSkipVerification(): SecurityWarning {
	const warning: SecurityWarning = {
		type: 'skip_verification',
		message: 'Integrity verification is disabled. Files will not be verified against checksums.',
		severity: 'high',
		timestamp: new Date(),
	};
	emitSecurityWarning(warning);
	return warning;
}

/**
 * Create a security warning for unsigned tags
 */
export function warnUnsignedTag(ref: string): SecurityWarning {
	const warning: SecurityWarning = {
		type: 'unsigned_tag',
		message: `Git tag "${ref}" is not signed. Consider using signed releases for better security.`,
		severity: 'medium',
		timestamp: new Date(),
		context: { ref },
	};
	emitSecurityWarning(warning);
	return warning;
}

/**
 * Create a security warning for network errors with retry info
 */
export function warnNetworkError(
	error: Error,
	retryCount: number,
	maxRetries: number
): SecurityWarning {
	const warning: SecurityWarning = {
		type: 'network_error',
		message: `Network error (attempt ${retryCount}/${maxRetries}): ${error.message}`,
		severity: retryCount >= maxRetries ? 'high' : 'medium',
		timestamp: new Date(),
		context: { error: error.message, retryCount, maxRetries },
	};
	emitSecurityWarning(warning);
	return warning;
}

/**
 * Get the audit log file path
 */
export function getAuditLogPath(): string {
	return path.join(SECURITY_CONFIG.AUDIT_LOG_DIR, SECURITY_CONFIG.AUDIT_LOG_FILE);
}

/**
 * Ensure audit log directory exists
 */
async function ensureAuditLogDir(): Promise<void> {
	await fs.ensureDir(SECURITY_CONFIG.AUDIT_LOG_DIR);
}

/**
 * Rotate audit log if it exceeds maximum size
 */
async function rotateAuditLogIfNeeded(): Promise<void> {
	const logPath = getAuditLogPath();

	if (!(await fs.pathExists(logPath))) {
		return;
	}

	const stats = await fs.stat(logPath);

	if (stats.size < SECURITY_CONFIG.MAX_AUDIT_LOG_SIZE) {
		return;
	}

	// Rotate existing logs
	for (let i = SECURITY_CONFIG.AUDIT_LOG_RETENTION - 1; i >= 1; i--) {
		const oldPath = `${logPath}.${i}`;
		const newPath = `${logPath}.${i + 1}`;

		if (await fs.pathExists(oldPath)) {
			if (i === SECURITY_CONFIG.AUDIT_LOG_RETENTION - 1) {
				await fs.remove(oldPath);
			} else {
				await fs.rename(oldPath, newPath);
			}
		}
	}

	// Move current log to .1
	await fs.rename(logPath, `${logPath}.1`);
}

/**
 * Write an entry to the audit log
 *
 * @param entry Audit log entry to write
 */
export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
	await ensureAuditLogDir();
	await rotateAuditLogIfNeeded();

	const logPath = getAuditLogPath();
	const line = JSON.stringify(entry) + '\n';

	await fs.appendFile(logPath, line);
}

/**
 * Log a component installation
 */
export async function logInstallation(
	componentName: string,
	ref: string,
	checksums: ChecksumMap,
	verified: boolean,
	signatureStatus?: SignatureStatus
): Promise<void> {
	const entry: AuditLogEntry = {
		timestamp: new Date().toISOString(),
		action: 'install',
		component: componentName,
		ref,
		checksums,
		verified,
		signatureStatus,
		success: true,
	};

	await writeAuditLog(entry);
}

/**
 * Log a security warning
 */
export async function logSecurityWarning(warning: SecurityWarning): Promise<void> {
	const entry: AuditLogEntry = {
		timestamp: warning.timestamp.toISOString(),
		action: 'security_warning',
		warnings: [warning.message],
		details: {
			type: warning.type,
			severity: warning.severity,
			context: warning.context,
		},
		success: true,
	};

	await writeAuditLog(entry);
}

/**
 * Read audit log entries
 *
 * @param options Read options
 * @returns Array of audit log entries
 */
export async function readAuditLog(
	options: {
		/** Maximum number of entries to return */
		limit?: number;
		/** Filter by action type */
		action?: AuditAction;
		/** Filter by component name */
		component?: string;
		/** Filter entries after this date */
		since?: Date;
	} = {}
): Promise<AuditLogEntry[]> {
	const logPath = getAuditLogPath();

	if (!(await fs.pathExists(logPath))) {
		return [];
	}

	const content = await fs.readFile(logPath, 'utf-8');
	const lines = content.trim().split('\n').filter(Boolean);

	let entries: AuditLogEntry[] = [];

	for (const line of lines) {
		try {
			const parsed = JSON.parse(line);
			const entry = auditLogEntrySchema.parse(parsed);
			entries.push(entry);
		} catch {
			// Skip malformed entries
			continue;
		}
	}

	// Apply filters
	if (options.action) {
		entries = entries.filter((e) => e.action === options.action);
	}

	if (options.component) {
		entries = entries.filter((e) => e.component === options.component);
	}

	if (options.since) {
		const sinceTime = options.since.getTime();
		entries = entries.filter((e) => new Date(e.timestamp).getTime() >= sinceTime);
	}

	// Sort by timestamp descending (most recent first)
	entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	// Apply limit
	if (options.limit && options.limit > 0) {
		entries = entries.slice(0, options.limit);
	}

	return entries;
}

/**
 * Clear the audit log
 */
export async function clearAuditLog(): Promise<void> {
	const logPath = getAuditLogPath();

	if (await fs.pathExists(logPath)) {
		await fs.remove(logPath);
	}

	// Also remove rotated logs
	for (let i = 1; i <= SECURITY_CONFIG.AUDIT_LOG_RETENTION; i++) {
		const rotatedPath = `${logPath}.${i}`;
		if (await fs.pathExists(rotatedPath)) {
			await fs.remove(rotatedPath);
		}
	}
}

/**
 * Check if verification should be performed based on options
 */
export function shouldVerify(options: { skipVerification?: boolean }): boolean {
	if (options.skipVerification) {
		warnSkipVerification();
		return false;
	}
	return SECURITY_CONFIG.VERIFY_BY_DEFAULT;
}
