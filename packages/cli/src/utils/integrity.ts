/**
 * Integrity verification utilities
 * Provides SHA-256 checksum computation and verification for file integrity
 */

import { createHash } from 'node:crypto';

/**
 * Checksum algorithm used for integrity verification
 */
const CHECKSUM_ALGORITHM = 'sha256';

/**
 * Prefix for formatted checksums (SRI format)
 */
const CHECKSUM_PREFIX = 'sha256-';

/**
 * Custom error class for integrity verification failures
 */
export class IntegrityError extends Error {
	constructor(
		message: string,
		public readonly filePath: string,
		public readonly expectedChecksum: string,
		public readonly actualChecksum: string
	) {
		super(message);
		this.name = 'IntegrityError';
	}
}

/**
 * Compute SHA-256 checksum of content
 * Returns checksum in SRI format: sha256-{base64hash}
 *
 * @param content File content as Buffer
 * @returns Formatted checksum string
 */
export function computeChecksum(content: Buffer): string {
	const hash = createHash(CHECKSUM_ALGORITHM);
	hash.update(content);
	const base64Hash = hash.digest('base64');
	return `${CHECKSUM_PREFIX}${base64Hash}`;
}

/**
 * Parse a checksum string to extract algorithm and hash
 * @param checksum Formatted checksum string (e.g., 'sha256-abc123...')
 * @returns Parsed checksum components or null if invalid format
 */
export function parseChecksum(checksum: string): { algorithm: string; hash: string } | null {
	const match = checksum.match(/^(sha256)-(.+)$/);
	if (!match || !match[1] || !match[2]) {
		return null;
	}
	return {
		algorithm: match[1],
		hash: match[2],
	};
}

/**
 * Verify content against expected checksum
 *
 * @param content File content as Buffer
 * @param expected Expected checksum in SRI format
 * @returns true if checksum matches, false otherwise
 */
export function verifyChecksum(content: Buffer, expected: string): boolean {
	const actual = computeChecksum(content);
	return actual === expected;
}

/**
 * Verify content and throw IntegrityError on mismatch
 *
 * @param content File content as Buffer
 * @param expected Expected checksum in SRI format
 * @param filePath File path for error reporting
 * @throws IntegrityError if checksum doesn't match
 */
export function verifyChecksumOrThrow(content: Buffer, expected: string, filePath: string): void {
	const actual = computeChecksum(content);

	if (actual !== expected) {
		throw new IntegrityError(
			`Integrity check failed for ${filePath}: expected ${expected}, got ${actual}`,
			filePath,
			expected,
			actual
		);
	}
}

/**
 * Checksum map type for multiple file verification
 */
export type ChecksumMap = Record<string, string>;

/**
 * Verification result for a single file
 */
export interface VerificationResult {
	filePath: string;
	valid: boolean;
	expectedChecksum: string;
	actualChecksum: string;
}

/**
 * Verify multiple files against a checksum map
 *
 * @param files Map of file paths to their content
 * @param checksums Map of file paths to expected checksums
 * @param options Verification options
 * @returns Array of verification results
 */
export function verifyMultipleChecksums(
	files: Map<string, Buffer>,
	checksums: ChecksumMap,
	options: {
		/** Throw on first failure instead of collecting all results */
		throwOnFailure?: boolean;
		/** Skip files not present in checksum map */
		skipMissing?: boolean;
	} = {}
): VerificationResult[] {
	const { throwOnFailure = false, skipMissing = false } = options;
	const results: VerificationResult[] = [];

	for (const [filePath, content] of files) {
		const expectedChecksum = checksums[filePath];

		if (!expectedChecksum) {
			if (skipMissing) {
				continue;
			}
			const result: VerificationResult = {
				filePath,
				valid: false,
				expectedChecksum: '',
				actualChecksum: computeChecksum(content),
			};
			results.push(result);

			if (throwOnFailure) {
				throw new IntegrityError(
					`No checksum found for ${filePath}`,
					filePath,
					'',
					result.actualChecksum
				);
			}
			continue;
		}

		const actualChecksum = computeChecksum(content);
		const valid = actualChecksum === expectedChecksum;

		const result: VerificationResult = {
			filePath,
			valid,
			expectedChecksum,
			actualChecksum,
		};
		results.push(result);

		if (!valid && throwOnFailure) {
			throw new IntegrityError(
				`Integrity check failed for ${filePath}`,
				filePath,
				expectedChecksum,
				actualChecksum
			);
		}
	}

	return results;
}

/**
 * Generate a checksum map for multiple files
 * Useful for creating registry index entries
 *
 * @param files Map of file paths to their content
 * @returns Checksum map
 */
export function generateChecksumMap(files: Map<string, Buffer>): ChecksumMap {
	const checksums: ChecksumMap = {};

	for (const [filePath, content] of files) {
		checksums[filePath] = computeChecksum(content);
	}

	return checksums;
}
