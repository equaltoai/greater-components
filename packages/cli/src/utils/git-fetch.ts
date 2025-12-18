/**
 * Git-based file fetching utilities
 * Fetches files from GitHub using Git tag references with caching and retry support
 */

import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';

/**
 * GitHub repository configuration
 */
const GITHUB_REPO = 'equaltoai/greater-components';
const GITHUB_RAW_URL = `https://github.com/${GITHUB_REPO}/raw`;

/**
 * Cache configuration
 */
const CACHE_DIR = path.join(os.homedir(), '.greater-components', 'cache');

/**
 * Validate that a URL uses HTTPS protocol
 * @throws NetworkError if URL is not HTTPS
 */
function validateHttpsUrl(url: string): void {
	const parsed = new URL(url);
	if (parsed.protocol !== 'https:') {
		throw new NetworkError(
			`Security error: Only HTTPS URLs are allowed. Got: ${parsed.protocol}`,
			undefined,
			url
		);
	}
}

/**
 * Retry configuration
 */
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

/**
 * Custom error class for network-related failures
 */
export class NetworkError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
		public readonly url?: string
	) {
		super(message);
		this.name = 'NetworkError';
	}
}

/**
 * Custom error class for cache-related failures
 */
export class CacheError extends Error {
	constructor(
		message: string,
		public readonly cachePath?: string
	) {
		super(message);
		this.name = 'CacheError';
	}
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get the cache directory path for a specific Git ref
 */
export function getCacheDir(ref: string): string {
	return path.join(CACHE_DIR, ref);
}

/**
 * Get the cached file path for a specific ref and file
 */
export function getCachedFilePath(ref: string, filePath: string): string {
	return path.join(getCacheDir(ref), filePath);
}

/**
 * Check if a file exists in the local cache
 */
export async function isCached(ref: string, filePath: string): Promise<boolean> {
	const cachedPath = getCachedFilePath(ref, filePath);
	return fs.pathExists(cachedPath);
}

/**
 * Read a file from the local cache
 */
export async function readFromCache(ref: string, filePath: string): Promise<Buffer> {
	const cachedPath = getCachedFilePath(ref, filePath);

	if (!(await fs.pathExists(cachedPath))) {
		throw new CacheError(`File not found in cache: ${filePath}`, cachedPath);
	}

	return fs.readFile(cachedPath);
}

/**
 * Write a file to the local cache
 */
export async function writeToCache(ref: string, filePath: string, content: Buffer): Promise<void> {
	const cachedPath = getCachedFilePath(ref, filePath);
	const cacheDir = path.dirname(cachedPath);

	await fs.ensureDir(cacheDir);
	await fs.writeFile(cachedPath, content);
}

/**
 * Clear the cache for a specific Git ref
 */
export async function clearCache(ref: string): Promise<void> {
	const cacheDir = getCacheDir(ref);

	if (await fs.pathExists(cacheDir)) {
		await fs.remove(cacheDir);
	}
}

/**
 * Clear the entire cache directory
 */
export async function clearAllCache(): Promise<void> {
	if (await fs.pathExists(CACHE_DIR)) {
		await fs.remove(CACHE_DIR);
	}
}

/**
 * Fetch a file from GitHub with retry logic
 * @param ref Git tag or branch reference (e.g., 'greater-v4.2.0')
 * @param filePath Path to the file within the repository
 * @returns File content as a Buffer
 */
async function fetchWithRetry(ref: string, filePath: string): Promise<Buffer> {
	// Check for local repo override
	const localRepoRoot = process.env['GREATER_CLI_LOCAL_REPO_ROOT'];
	if (localRepoRoot) {
		const localPath = path.join(localRepoRoot, filePath);
		try {
			return await fs.readFile(localPath);
		} catch {
			throw new NetworkError(`Local file not found: ${filePath}`, 404, localPath);
		}
	}

	const url = `${GITHUB_RAW_URL}/${ref}/${filePath}`;

	// Enforce HTTPS for all requests
	validateHttpsUrl(url);

	let lastError: Error | null = null;

	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				// Don't retry on 404 - file doesn't exist
				if (response.status === 404) {
					throw new NetworkError(`File not found: ${filePath} at ref ${ref}`, response.status, url);
				}

				// Retry on server errors (5xx) and rate limiting (429)
				if (response.status >= 500 || response.status === 429) {
					throw new NetworkError(
						`HTTP ${response.status}: ${response.statusText}`,
						response.status,
						url
					);
				}

				// Don't retry on other client errors (4xx)
				throw new NetworkError(
					`HTTP ${response.status}: ${response.statusText}`,
					response.status,
					url
				);
			}

			const arrayBuffer = await response.arrayBuffer();
			return Buffer.from(arrayBuffer);
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			// Don't retry on non-retryable errors
			if (error instanceof NetworkError && error.statusCode !== undefined) {
				if (
					error.statusCode === 404 ||
					(error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429)
				) {
					throw error;
				}
			}

			// Wait before retrying (exponential backoff)
			if (attempt < MAX_RETRIES - 1) {
				const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
				await sleep(delay);
			}
		}
	}

	throw new NetworkError(
		`Failed to fetch ${filePath} after ${MAX_RETRIES} attempts: ${lastError?.message}`,
		undefined,
		`${GITHUB_RAW_URL}/${ref}/${filePath}`
	);
}

/**
 * Fetch a file from a Git tag with caching support
 * Uses cache-first strategy: checks local cache before making network request
 *
 * @param ref Git tag or branch reference (e.g., 'greater-v4.2.0')
 * @param filePath Path to the file within the repository
 * @param options Fetch options
 * @returns File content as a Buffer
 */
export async function fetchFromGitTag(
	ref: string,
	filePath: string,
	options: {
		/** Skip cache and always fetch from network */
		skipCache?: boolean;
		/** Force cache refresh even if cached version exists */
		forceRefresh?: boolean;
	} = {}
): Promise<Buffer> {
	const { skipCache = false, forceRefresh = false } = options;

	// In local repo mode, always read from disk and bypass cache.
	if (process.env['GREATER_CLI_LOCAL_REPO_ROOT']) {
		return fetchWithRetry(ref, filePath);
	}

	// Check cache first (unless skipping or forcing refresh)
	if (!skipCache && !forceRefresh) {
		try {
			if (await isCached(ref, filePath)) {
				return await readFromCache(ref, filePath);
			}
		} catch {
			// Cache read failed, fall through to network fetch
		}
	}

	// Fetch from network
	const content = await fetchWithRetry(ref, filePath);

	// Cache the result (unless skipping cache)
	if (!skipCache) {
		try {
			await writeToCache(ref, filePath, content);
		} catch {
			// Cache write failed, but we still have the content
			// Log warning but don't fail the operation
		}
	}

	return content;
}

/**
 * Fetch multiple files from a Git tag
 * @param ref Git tag or branch reference
 * @param filePaths Array of file paths to fetch
 * @param options Fetch options
 * @returns Map of file paths to their content
 */
export async function fetchMultipleFromGitTag(
	ref: string,
	filePaths: string[],
	options: {
		skipCache?: boolean;
		forceRefresh?: boolean;
		/** Continue fetching remaining files if one fails */
		continueOnError?: boolean;
	} = {}
): Promise<Map<string, Buffer>> {
	const { continueOnError = false, ...fetchOptions } = options;
	const results = new Map<string, Buffer>();
	const errors: Array<{ path: string; error: Error }> = [];

	for (const filePath of filePaths) {
		try {
			const content = await fetchFromGitTag(ref, filePath, fetchOptions);
			results.set(filePath, content);
		} catch (error) {
			if (continueOnError) {
				errors.push({
					path: filePath,
					error: error instanceof Error ? error : new Error(String(error)),
				});
			} else {
				throw error;
			}
		}
	}

	if (errors.length > 0 && !continueOnError) {
		const errorMessages = errors.map((e) => `${e.path}: ${e.error.message}`).join(', ');
		throw new NetworkError(`Failed to fetch files: ${errorMessages}`);
	}

	return results;
}
