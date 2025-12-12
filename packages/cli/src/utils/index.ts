/**
 * CLI Utilities Index
 * Re-exports all utility modules for convenient importing
 */

// Configuration utilities
export * from './config.js';

// Diff utilities
export * from './diff.js';

// Security utilities
export * from './security.js';

// File system utilities
export * from './files.js';

// Import path transformation
export {
	transformImports,
	transformSvelteImports,
	transformTypeScriptImports,
	transformCssFileImports,
	transformPath,
	buildPathMappings,
	hasGreaterImports,
	getTransformSummary,
	type PathMapping,
	type TransformResult,
} from './transform.js';

// Fetch utilities (includes Git-based fetching)
export * from './fetch.js';

// Git-based file fetching
export {
	fetchFromGitTag,
	fetchMultipleFromGitTag,
	getCacheDir,
	getCachedFilePath,
	isCached,
	readFromCache,
	writeToCache,
	clearCache,
	clearAllCache,
	NetworkError,
	CacheError,
} from './git-fetch.js';

// Integrity verification
export {
	computeChecksum,
	verifyChecksum,
	verifyChecksumOrThrow,
	verifyMultipleChecksums,
	generateChecksumMap,
	parseChecksum,
	IntegrityError,
	type ChecksumMap,
	type VerificationResult,
} from './integrity.js';

// Registry index
export {
	fetchRegistryIndex,
	getComponentChecksums,
	getComponentFilePaths,
	hasComponent,
	getAllComponentNames as getRegistryComponentNames,
	clearRegistryCache,
	clearAllRegistryCache,
	RegistryIndexError,
	registryIndexSchema,
	registryComponentSchema,
	fileChecksumSchema,
	type RegistryIndex,
	type RegistryComponent,
	type FileChecksum,
} from './registry-index.js';

// Offline mode support
export {
	isNetworkAvailable,
	isOfflineMode,
	enableOfflineMode,
	disableOfflineMode,
	getCacheStatus,
	getCachedRefs,
	canServeFromCache,
	getMissingFromCache,
	determineFetchStrategy,
	printOfflineModeWarning,
	type CacheStatus,
	type OfflineFetchOptions,
} from './offline.js';

// Package utilities
export * from './packages.js';

// Logger
export * from './logger.js';

// CSS injection utilities
export * from './css-inject.js';

// Item parsing utilities
export * from './item-parser.js';

// Dependency resolution
export * from './dependency-resolver.js';

// Installation preview
export * from './install-preview.js';

// Face installer
export * from './face-installer.js';
