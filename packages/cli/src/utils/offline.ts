/**
 * Offline mode utilities
 * Provides connectivity checking and offline fallback support
 */

import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { getCacheDir, isCached } from './git-fetch.js';
import { logger } from './logger.js';

/**
 * Cache directory paths
 */
const CACHE_BASE_DIR = path.join(os.homedir(), '.greater-components');
const FILE_CACHE_DIR = path.join(CACHE_BASE_DIR, 'cache');
const REGISTRY_CACHE_DIR = path.join(CACHE_BASE_DIR, 'registry');

/**
 * Connectivity check URL (GitHub API)
 */
const CONNECTIVITY_CHECK_URL = 'https://api.github.com';
const CONNECTIVITY_TIMEOUT_MS = 5000;

/**
 * Offline mode state
 */
let offlineModeEnabled = false;
let lastConnectivityCheck: number | null = null;
const CONNECTIVITY_CHECK_INTERVAL_MS = 60000; // 1 minute

/**
 * Check if network is available
 * Uses a lightweight request to GitHub API
 *
 * @param forceCheck Force a new connectivity check even if recently checked
 * @returns true if network is available, false otherwise
 */
export async function isNetworkAvailable(forceCheck = false): Promise<boolean> {
	// Use cached result if recently checked
	if (!forceCheck && lastConnectivityCheck !== null) {
		const timeSinceLastCheck = Date.now() - lastConnectivityCheck;
		if (timeSinceLastCheck < CONNECTIVITY_CHECK_INTERVAL_MS) {
			return !offlineModeEnabled;
		}
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), CONNECTIVITY_TIMEOUT_MS);

		const response = await fetch(CONNECTIVITY_CHECK_URL, {
			method: 'HEAD',
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		lastConnectivityCheck = Date.now();
		offlineModeEnabled = !response.ok;

		return response.ok;
	} catch {
		lastConnectivityCheck = Date.now();
		offlineModeEnabled = true;
		return false;
	}
}

/**
 * Check if offline mode is currently enabled
 */
export function isOfflineMode(): boolean {
	return offlineModeEnabled;
}

/**
 * Manually enable offline mode
 */
export function enableOfflineMode(): void {
	offlineModeEnabled = true;
	logger.info('📴 Offline mode enabled - using cached files only');
}

/**
 * Manually disable offline mode
 */
export function disableOfflineMode(): void {
	offlineModeEnabled = false;
	lastConnectivityCheck = null;
}

/**
 * Cache status for a specific ref
 */
export interface CacheStatus {
	ref: string;
	hasRegistryIndex: boolean;
	cachedFiles: string[];
	cacheDir: string;
}

/**
 * Get cache status for a specific Git ref
 *
 * @param ref Git tag or branch reference
 * @returns Cache status information
 */
export async function getCacheStatus(ref: string): Promise<CacheStatus> {
	const cacheDir = getCacheDir(ref);
	const cachedFiles: string[] = [];

	// Check for cached files
	if (await fs.pathExists(cacheDir)) {
		const walkDir = async (dir: string, basePath = ''): Promise<void> => {
			const entries = await fs.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				const relativePath = path.join(basePath, entry.name);
				if (entry.isDirectory()) {
					await walkDir(path.join(dir, entry.name), relativePath);
				} else {
					cachedFiles.push(relativePath);
				}
			}
		};
		await walkDir(cacheDir);
	}

	// Check for registry index
	const safeRef = ref.replace(/[^a-zA-Z0-9.-]/g, '_');
	const registryIndexPath = path.join(REGISTRY_CACHE_DIR, `${safeRef}.json`);
	const hasRegistryIndex = await fs.pathExists(registryIndexPath);

	return {
		ref,
		hasRegistryIndex,
		cachedFiles,
		cacheDir,
	};
}

/**
 * Get all cached refs
 *
 * @returns Array of cached Git refs
 */
export async function getCachedRefs(): Promise<string[]> {
	const refs: string[] = [];

	if (await fs.pathExists(FILE_CACHE_DIR)) {
		const entries = await fs.readdir(FILE_CACHE_DIR, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory()) {
				refs.push(entry.name);
			}
		}
	}

	return refs;
}

/**
 * Check if a component can be served from cache
 *
 * @param ref Git ref
 * @param filePaths Array of file paths required for the component
 * @returns true if all files are cached, false otherwise
 */
export async function canServeFromCache(ref: string, filePaths: string[]): Promise<boolean> {
	for (const filePath of filePaths) {
		if (!(await isCached(ref, filePath))) {
			return false;
		}
	}
	return true;
}

/**
 * Get missing files that are not in cache
 *
 * @param ref Git ref
 * @param filePaths Array of file paths to check
 * @returns Array of file paths that are not cached
 */
export async function getMissingFromCache(ref: string, filePaths: string[]): Promise<string[]> {
	const missing: string[] = [];

	for (const filePath of filePaths) {
		if (!(await isCached(ref, filePath))) {
			missing.push(filePath);
		}
	}

	return missing;
}

/**
 * Offline fetch options
 */
export interface OfflineFetchOptions {
	/** Prefer cached version even if network is available */
	preferCache?: boolean;
	/** Fail silently if offline and not cached */
	allowMissing?: boolean;
}

/**
 * Determine fetch strategy based on connectivity and cache status
 *
 * @param ref Git ref
 * @param filePaths Files to fetch
 * @param options Offline fetch options
 * @returns Fetch strategy recommendation
 */
export async function determineFetchStrategy(
	ref: string,
	filePaths: string[],
	options: OfflineFetchOptions = {}
): Promise<{
	strategy: 'network' | 'cache' | 'mixed' | 'unavailable';
	cachedFiles: string[];
	uncachedFiles: string[];
	isOffline: boolean;
}> {
	const isOffline = !(await isNetworkAvailable());
	const cachedFiles: string[] = [];
	const uncachedFiles: string[] = [];

	for (const filePath of filePaths) {
		if (await isCached(ref, filePath)) {
			cachedFiles.push(filePath);
		} else {
			uncachedFiles.push(filePath);
		}
	}

	let strategy: 'network' | 'cache' | 'mixed' | 'unavailable';

	if (options.preferCache && cachedFiles.length === filePaths.length) {
		strategy = 'cache';
	} else if (isOffline) {
		if (cachedFiles.length === filePaths.length) {
			strategy = 'cache';
		} else if (cachedFiles.length > 0 && options.allowMissing) {
			strategy = 'cache';
		} else {
			strategy = 'unavailable';
		}
	} else {
		if (uncachedFiles.length === 0 && options.preferCache) {
			strategy = 'cache';
		} else if (cachedFiles.length > 0 && uncachedFiles.length > 0) {
			strategy = 'mixed';
		} else {
			strategy = 'network';
		}
	}

	return {
		strategy,
		cachedFiles,
		uncachedFiles,
		isOffline,
	};
}

/**
 * Print offline mode warning if applicable
 */
export function printOfflineModeWarning(): void {
	if (offlineModeEnabled) {
		logger.info('');
		logger.info('📴 Operating in offline mode');
		logger.info('   Using cached files. Some features may be unavailable.');
		logger.info('');
	}
}
