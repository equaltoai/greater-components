/**
 * Fetch component source code from repository
 * Supports Git-based fetching with integrity verification
 */

import type { ComponentFile, ComponentMetadata } from '../registry/index.js';
import { fetchFromGitTag, NetworkError } from './git-fetch.js';
import { IntegrityError, type ChecksumMap } from './integrity.js';
import { fetchRegistryIndex, getComponentChecksums } from './registry-index.js';
import { DEFAULT_REF } from './config.js';
import { logger } from './logger.js';
import {
	shouldVerify,
	verifyGitTag,
	verifyFileIntegrity,
	warnUnsignedTag,
	ChecksumVerificationError,
	type FetchedFile,
	type IntegrityReport,
	type GitTagVerificationResult,
} from './security.js';

/**
 * Re-export error types for external use
 */
export { NetworkError, IntegrityError, ChecksumVerificationError };
export type { ChecksumMap };

/**
 * Fetch options for component fetching
 */
export interface FetchOptions {
	/** Git ref (tag or branch) to fetch from */
	ref?: string;
	/** Skip integrity verification (development only - emits security warning) */
	skipVerification?: boolean;
	/** Skip cache and always fetch from network */
	skipCache?: boolean;
	/** Force cache refresh */
	forceRefresh?: boolean;
	/** Log verification status */
	verbose?: boolean;
	/** Fail immediately on first verification failure */
	failFast?: boolean;
	/** Verify Git tag signature */
	verifySignature?: boolean;
}

/**
 * Fetch result with verification status
 */
export interface FetchResult {
	files: ComponentFile[];
	verified: boolean;
	ref: string;
	integrityReport?: IntegrityReport;
	signatureVerification?: GitTagVerificationResult;
}

/**
 * Fetch all files for a component with integrity verification
 * @param component Component metadata
 * @param options Fetch options including ref and verification settings
 * @returns Fetch result with files and verification status
 */
export async function fetchComponentFiles(
	component: ComponentMetadata,
	options: FetchOptions = {}
): Promise<FetchResult> {
	const ref = options.ref || DEFAULT_REF;
	const files: ComponentFile[] = [];
	const fetchedFiles: FetchedFile[] = [];
	let allVerified = true;
	let signatureVerification: GitTagVerificationResult | undefined;

	// Determine if verification should be performed
	const performVerification = shouldVerify(options);

	// Verify Git tag signature if requested
	if (options.verifySignature && performVerification) {
		signatureVerification = await verifyGitTag(ref);

		if (options.verbose) {
			if (signatureVerification.verified) {
				logger.info(
					`  ✓ Tag signature verified: ${signatureVerification.signer || 'unknown signer'}`
				);
			} else if (signatureVerification.signatureStatus === 'unsigned') {
				warnUnsignedTag(ref);
			} else {
				logger.warn(`  ⚠ Signature verification: ${signatureVerification.signatureStatus}`);
			}
		}
	}

	// Try to get checksums from registry index
	let checksums: ChecksumMap | null = null;
	if (performVerification) {
		try {
			const registryIndex = await fetchRegistryIndex(ref, {
				skipCache: options.skipCache,
				forceRefresh: options.forceRefresh,
			});
			checksums = getComponentChecksums(registryIndex, component.name);
		} catch {
			// Registry index not available, continue without verification
			if (options.verbose) {
				logger.warn(`  ⚠ Registry index not available, skipping verification`);
			}
			allVerified = false;
		}
	}

	// Fetch all files
	for (const file of component.files) {
		try {
			const buffer = await fetchFromGitTag(ref, `packages/fediverse/src/${file.path}`, {
				skipCache: options.skipCache,
				forceRefresh: options.forceRefresh,
			});

			const expectedChecksum = checksums?.[file.path];

			fetchedFiles.push({
				path: file.path,
				content: buffer,
				expectedChecksum,
			});

			files.push({
				...file,
				content: buffer.toString('utf-8'),
			});
		} catch (error) {
			throw new Error(
				`Failed to fetch file ${file.path} for component ${component.name}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	// Verify all files at once
	let integrityReport: IntegrityReport | undefined;
	if (performVerification && checksums) {
		integrityReport = verifyFileIntegrity(fetchedFiles, checksums, {
			failFast: options.failFast ?? true, // Fail fast by default for security
			skipMissing: false,
		});

		allVerified = integrityReport.allVerified;

		if (options.verbose) {
			for (const result of integrityReport.results) {
				if (result.verified) {
					logger.info(`  ✓ Verified: ${result.filePath}`);
				} else {
					logger.error(`  ✖ Failed: ${result.filePath}`);
				}
			}
		}

		// Fail fast if any verification failed
		if (!allVerified && (options.failFast ?? true)) {
			const failedFile = integrityReport.results.find((r) => !r.verified);
			if (failedFile) {
				throw new ChecksumVerificationError(
					`Integrity check failed for ${failedFile.filePath}`,
					failedFile.filePath,
					failedFile.expectedChecksum,
					failedFile.actualChecksum
				);
			}
		}
	} else if (!performVerification) {
		allVerified = false;
	}

	return {
		files,
		verified: allVerified,
		ref,
		integrityReport,
		signatureVerification,
	};
}

/**
 * Fetch multiple components with integrity verification
 * @param componentNames Array of component names to fetch
 * @param registry Component registry
 * @param options Fetch options
 * @returns Map of component names to their files
 */
export async function fetchComponents(
	componentNames: string[],
	registry: Record<string, ComponentMetadata>,
	options: FetchOptions = {}
): Promise<Map<string, ComponentFile[]>> {
	const result = new Map<string, ComponentFile[]>();
	const ref = options.ref || DEFAULT_REF;

	if (options.verbose) {
		logger.info(`Fetching from ref: ${ref}`);
	}

	for (const name of componentNames) {
		const component = registry[name];
		if (!component) {
			throw new Error(`Component "${name}" not found in registry`);
		}

		if (options.verbose) {
			logger.info(`\nFetching component: ${name}`);
		}

		const fetchResult = await fetchComponentFiles(component, options);
		result.set(name, fetchResult.files);

		if (options.verbose && fetchResult.verified) {
			logger.info(`  ✓ All files verified for ${name}`);
		}
	}

	return result;
}

/**
 * Fetch components with full verification report
 * @param componentNames Array of component names to fetch
 * @param registry Component registry
 * @param options Fetch options
 * @returns Detailed fetch results including verification status
 */
export async function fetchComponentsWithReport(
	componentNames: string[],
	registry: Record<string, ComponentMetadata>,
	options: FetchOptions = {}
): Promise<{
	components: Map<string, FetchResult>;
	allVerified: boolean;
	ref: string;
}> {
	const components = new Map<string, FetchResult>();
	const ref = options.ref || DEFAULT_REF;
	let allVerified = true;

	for (const name of componentNames) {
		const component = registry[name];
		if (!component) {
			throw new Error(`Component "${name}" not found in registry`);
		}

		const fetchResult = await fetchComponentFiles(component, options);
		components.set(name, fetchResult);

		if (!fetchResult.verified) {
			allVerified = false;
		}
	}

	return {
		components,
		allVerified,
		ref,
	};
}
