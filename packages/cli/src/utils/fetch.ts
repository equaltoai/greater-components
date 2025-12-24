/**
 * Fetch component source code from repository
 * Supports Git-based fetching with integrity verification
 */

import path from 'node:path';
import type { ComponentFile, ComponentMetadata } from '../registry/index.js';
import { fetchFromGitTag, NetworkError } from './git-fetch.js';
import { IntegrityError, type ChecksumMap } from './integrity.js';
import { fetchRegistryIndex, resolveRef, type RegistryIndex } from './registry-index.js';
import { DEFAULT_REF, FALLBACK_REF } from './config.js';
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

const FACE_CANDIDATES = ['social', 'blog', 'community', 'artist'] as const;

const CORE_PACKAGE_NAMES = new Set([
	'primitives',
	'icons',
	'tokens',
	'utils',
	'content',
	'adapters',
	'headless',
]);

function isCorePackage(component: ComponentMetadata): boolean {
	return CORE_PACKAGE_NAMES.has(component.name) && component.tags?.includes('core');
}

function inferFileType(relativePath: string): ComponentFile['type'] {
	if (relativePath.endsWith('.css')) return 'styles';
	if (relativePath.endsWith('.d.ts') || relativePath.endsWith('.d.ts.map')) return 'types';
	if (relativePath.endsWith('.svelte') || relativePath.includes('.svelte.')) return 'component';
	return 'utils';
}

const BINARY_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.avif',
	'.ico',
	'.bmp',
	'.tiff',
	'.svg',
	'.woff',
	'.woff2',
	'.ttf',
	'.otf',
	'.eot',
	'.wasm',
]);

function isBinaryFilePath(filePath: string): boolean {
	const ext = path.extname(filePath).toLowerCase();
	return BINARY_EXTENSIONS.has(ext);
}

function buildCorePackageFileList(index: RegistryIndex, packageName: string): ComponentFile[] {
	const entry = index.components[packageName];
	if (!entry) {
		throw new Error(`Core package "${packageName}" not found in registry index`);
	}

	return entry.files.map((file) => {
		const withoutSrc = file.path.startsWith('src/') ? file.path.slice('src/'.length) : file.path;
		return {
			path: `greater/${packageName}/${withoutSrc}`,
			content: '',
			type: inferFileType(withoutSrc),
			transform: !isBinaryFilePath(withoutSrc),
		};
	});
}

function buildSourcePathCandidates(_component: ComponentMetadata, installPath: string): string[] {
	const normalized = installPath.replace(/\\/g, '/').replace(/^\/+/, '');
	const candidates: string[] = [];

	// shared/<module>/... -> packages/shared/<module>/src/...
	const sharedMatch = normalized.match(/^shared\/([^/]+)\/(.+)$/);
	if (sharedMatch?.[1] && sharedMatch?.[2]) {
		candidates.push(`packages/shared/${sharedMatch[1]}/src/${sharedMatch[2]}`);
	}

	// greater/<package>/... -> packages/<package>/src/...
	const greaterMatch = normalized.match(/^greater\/([^/]+)\/(.+)$/);
	if (greaterMatch?.[1] && greaterMatch?.[2]) {
		const pkg = greaterMatch[1];
		const rest = greaterMatch[2];
		candidates.push(`packages/${pkg}/src/${rest}`);
	}

	// lib/adapters/... -> packages/adapters/src/...
	if (normalized.startsWith('lib/adapters/')) {
		const rest = normalized.slice('lib/adapters/'.length);
		candidates.push(`packages/adapters/src/${rest}`);
	}

	// lib/primitives/<name>.ts -> packages/headless/src/...
	const primitiveMatch = normalized.match(/^lib\/primitives\/([^/]+)\.ts$/);
	if (primitiveMatch?.[1]) {
		const name = primitiveMatch[1];
		candidates.push(`packages/headless/src/primitives/${name}.ts`);
		candidates.push(`packages/headless/src/${name}.ts`);
	}

	// lib/types/... -> packages/headless/src/types/...
	if (normalized.startsWith('lib/types/')) {
		const rest = normalized.slice('lib/types/'.length);
		candidates.push(`packages/headless/src/types/${rest}`);
	}

	// lib/utils/... -> packages/headless/src/utils/...
	if (normalized.startsWith('lib/utils/')) {
		const rest = normalized.slice('lib/utils/'.length);
		candidates.push(`packages/headless/src/utils/${rest}`);
	}

	// lib/components/... -> packages/faces/<face>/src/components/...
	if (normalized.startsWith('lib/components/')) {
		const rest = normalized.slice('lib/components/'.length);
		for (const face of FACE_CANDIDATES) {
			candidates.push(`packages/faces/${face}/src/components/${rest}`);
		}

		// Heuristic: lib/components/Notifications/... might actually live in packages/shared/notifications/src/...
		const [firstSegment, ...tail] = rest.split('/');
		if (firstSegment && tail.length > 0) {
			candidates.push(`packages/shared/${firstSegment.toLowerCase()}/src/${tail.join('/')}`);
		}
	}

	// lib/generics/... -> packages/faces/<face>/src/generics/...
	if (normalized.startsWith('lib/generics/')) {
		const rest = normalized.slice('lib/generics/'.length);
		for (const face of FACE_CANDIDATES) {
			candidates.push(`packages/faces/${face}/src/generics/${rest}`);
		}
	}

	// lib/patterns/... -> packages/faces/<face>/src/patterns/...
	if (normalized.startsWith('lib/patterns/')) {
		const rest = normalized.slice('lib/patterns/'.length);
		for (const face of FACE_CANDIDATES) {
			candidates.push(`packages/faces/${face}/src/patterns/${rest}`);
		}
	}

	// patterns/... -> packages/faces/<face>/src/patterns/...
	if (normalized.startsWith('patterns/')) {
		const rest = normalized.slice('patterns/'.length);
		for (const face of FACE_CANDIDATES) {
			candidates.push(`packages/faces/${face}/src/patterns/${rest}`);
		}
	}

	// As a last resort, try the normalized path as repo-relative.
	candidates.push(normalized);

	// De-dupe while preserving order
	return [...new Set(candidates)];
}

function findUniqueChecksumMatch(
	index: RegistryIndex,
	predicate: (path: string) => boolean
): string | null {
	let match: string | null = null;
	for (const key of Object.keys(index.checksums)) {
		if (!predicate(key)) continue;
		if (match) return null; // ambiguous
		match = key;
	}
	return match;
}

function resolveSourcePathFromIndex(
	index: RegistryIndex,
	component: ComponentMetadata,
	installPath: string
): string | null {
	const candidates = buildSourcePathCandidates(component, installPath);

	for (const candidate of candidates) {
		if (index.checksums[candidate]) {
			return candidate;
		}
	}

	const normalized = installPath.replace(/\\/g, '/').replace(/^\/+/, '');

	// Try suffix-based resolution for known virtual prefixes.
	if (normalized.startsWith('lib/components/')) {
		const rest = normalized.slice('lib/components/'.length);
		const suffix = `/src/components/${rest}`;
		const unique = findUniqueChecksumMatch(index, (key) => key.endsWith(suffix));
		if (unique) return unique;
	}

	if (normalized.startsWith('lib/patterns/')) {
		const rest = normalized.slice('lib/patterns/'.length);
		const suffix = `/src/patterns/${rest}`;
		const unique = findUniqueChecksumMatch(index, (key) => key.endsWith(suffix));
		if (unique) return unique;
	}

	if (normalized.startsWith('lib/generics/')) {
		const rest = normalized.slice('lib/generics/'.length);
		const suffix = `/src/generics/${rest}`;
		const unique = findUniqueChecksumMatch(index, (key) => key.endsWith(suffix));
		if (unique) return unique;
	}

	return null;
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
	const { ref } = await resolveRef(options.ref || DEFAULT_REF, undefined, FALLBACK_REF);
	const files: ComponentFile[] = [];
	const fetchedFiles: FetchedFile[] = [];
	let allVerified = true;
	let signatureVerification: GitTagVerificationResult | undefined;
	const corePackage = isCorePackage(component);

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
	let registryIndex: RegistryIndex | null = null;
	let checksums: ChecksumMap | null = null;
	if (performVerification || corePackage) {
		try {
			registryIndex = await fetchRegistryIndex(ref, {
				skipCache: options.skipCache,
				forceRefresh: options.forceRefresh,
			});
			checksums = registryIndex.checksums;
		} catch (error) {
			if (corePackage) {
				throw new Error(
					`Failed to load registry index for core package "${component.name}": ${
						error instanceof Error ? error.message : String(error)
					}`
				);
			}

			// Registry index not available, continue without verification
			if (options.verbose) {
				logger.warn(`  ⚠ Registry index not available, skipping verification`);
			}
			allVerified = false;
		}
	}

	const filesToFetch =
		corePackage && registryIndex
			? buildCorePackageFileList(registryIndex, component.name)
			: component.files;

	// Fetch all files
	for (const file of filesToFetch) {
		try {
			const sourcePath =
				registryIndex && resolveSourcePathFromIndex(registryIndex, component, file.path);
			const fallbackCandidates = buildSourcePathCandidates(component, file.path);
			const candidatePaths = sourcePath ? [sourcePath, ...fallbackCandidates] : fallbackCandidates;

			let buffer: Buffer | null = null;
			let resolvedSourcePath: string | null = null;
			let expectedChecksum: string | undefined;

			// Prefer candidates that have checksums (when available) to avoid 404s.
			const candidatesWithChecksums = checksums
				? candidatePaths.filter((p) => !!checksums?.[p])
				: [];
			const candidatesWithoutChecksums = checksums
				? candidatePaths.filter((p) => !checksums?.[p])
				: candidatePaths;
			const orderedCandidates = checksums
				? [...candidatesWithChecksums, ...candidatesWithoutChecksums]
				: candidatePaths;

			let lastCandidateError: unknown;
			for (const candidate of orderedCandidates) {
				try {
					buffer = await fetchFromGitTag(ref, candidate, {
						skipCache: options.skipCache,
						forceRefresh: options.forceRefresh,
					});
					resolvedSourcePath = candidate;
					expectedChecksum = checksums?.[candidate];
					break;
				} catch (error) {
					lastCandidateError = error;
				}
			}

			if (!buffer || !resolvedSourcePath) {
				const detail =
					orderedCandidates.length > 0
						? `Tried:\n  - ${orderedCandidates.join('\n  - ')}`
						: 'No candidate paths could be derived.';
				const suggestions: string[] = [];
				if (!process.env['GREATER_CLI_LOCAL_REPO_ROOT']) {
					suggestions.push(
						`If you're running from a local clone, set GREATER_CLI_LOCAL_REPO_ROOT=/path/to/greater-components.`
					);
				}
				suggestions.push(
					`Ensure the CLI can reach GitHub for ref "${ref}" (or pin a release tag via --ref greater-vX.Y.Z).`
				);

				const lastErrorMessage =
					lastCandidateError instanceof Error ? lastCandidateError.message : null;
				const lastErrorLine = lastErrorMessage ? `\nLast error: ${lastErrorMessage}` : '';
				const suggestionBlock =
					suggestions.length > 0 ? `\n\n${suggestions.join('\n')}${lastErrorLine}` : '';
				throw new Error(
					`Failed to resolve source path for "${component.name}" file "${file.path}".\n${detail}${suggestionBlock}`
				);
			}

			fetchedFiles.push({
				path: resolvedSourcePath,
				content: buffer,
				expectedChecksum,
			});

			const isBinary = isBinaryFilePath(file.path);

			files.push({
				...file,
				content: isBinary ? '' : buffer.toString('utf-8'),
				raw: isBinary ? buffer : undefined,
				transform: isBinary ? false : file.transform,
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
			skipMissing: true,
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
