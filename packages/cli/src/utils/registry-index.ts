/**
 * Registry Index utilities
 * Handles fetching, parsing, and caching of the component registry index
 */

import { z } from 'zod';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { fetchFromGitTag, NetworkError } from './git-fetch.js';

/**
 * Registry index file path within the repository
 */
const REGISTRY_INDEX_PATH = 'registry/index.json';

/**
 * Cache configuration
 */
const CACHE_DIR = path.join(os.homedir(), '.greater-components', 'registry');
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * File checksum entry schema
 */
export const fileChecksumSchema = z.object({
	path: z.string(),
	checksum: z.string().regex(/^sha256-[A-Za-z0-9+/]+=*$/, 'Invalid checksum format'),
	size: z.number().int().positive().optional(),
});

export type FileChecksum = z.infer<typeof fileChecksumSchema>;

/**
 * Component entry in the registry index
 */
export const registryComponentSchema = z.object({
	name: z.string(),
	version: z.string(),
	description: z.string().optional(),
	files: z.array(fileChecksumSchema),
	dependencies: z.array(z.string()).optional().default([]),
	tags: z.array(z.string()).optional().default([]),
});

export type RegistryComponent = z.infer<typeof registryComponentSchema>;

/**
 * Registry index schema
 */
export const registryIndexSchema = z.object({
	version: z.string(),
	ref: z.string(),
	generatedAt: z.string().datetime(),
	components: z.record(z.string(), registryComponentSchema),
	checksums: z.record(z.string(), z.string()).optional().default({}),
});

export type RegistryIndex = z.infer<typeof registryIndexSchema>;

/**
 * Cached registry index metadata
 */
interface CachedIndexMetadata {
	ref: string;
	fetchedAt: number;
	ttlMs: number;
}

/**
 * Custom error for registry index failures
 */
export class RegistryIndexError extends Error {
	constructor(
		message: string,
		public readonly ref: string,
		public readonly cause?: Error
	) {
		super(message);
		this.name = 'RegistryIndexError';
	}
}

/**
 * Get the cache file path for a registry index
 */
function getCacheFilePath(ref: string): string {
	// Sanitize ref for use as filename
	const safeRef = ref.replace(/[^a-zA-Z0-9.-]/g, '_');
	return path.join(CACHE_DIR, `${safeRef}.json`);
}

/**
 * Get the metadata file path for a cached registry index
 */
function getMetadataFilePath(ref: string): string {
	const safeRef = ref.replace(/[^a-zA-Z0-9.-]/g, '_');
	return path.join(CACHE_DIR, `${safeRef}.meta.json`);
}

/**
 * Check if cached registry index is still valid
 */
async function isCacheValid(ref: string, ttlMs: number = DEFAULT_TTL_MS): Promise<boolean> {
	const metadataPath = getMetadataFilePath(ref);
	const cachePath = getCacheFilePath(ref);

	try {
		if (!(await fs.pathExists(cachePath)) || !(await fs.pathExists(metadataPath))) {
			return false;
		}

		const metadataContent = await fs.readFile(metadataPath, 'utf-8');
		const metadata: CachedIndexMetadata = JSON.parse(metadataContent);

		// Check if TTL has expired
		const now = Date.now();
		const age = now - metadata.fetchedAt;

		return age < ttlMs;
	} catch {
		return false;
	}
}

/**
 * Read registry index from cache
 */
async function readFromCache(ref: string): Promise<RegistryIndex | null> {
	const cachePath = getCacheFilePath(ref);

	try {
		if (!(await fs.pathExists(cachePath))) {
			return null;
		}

		const content = await fs.readFile(cachePath, 'utf-8');
		const json = JSON.parse(content);

		// Validate against schema
		return registryIndexSchema.parse(json);
	} catch {
		return null;
	}
}

/**
 * Write registry index to cache
 */
async function writeToCache(ref: string, index: RegistryIndex, ttlMs: number): Promise<void> {
	const cachePath = getCacheFilePath(ref);
	const metadataPath = getMetadataFilePath(ref);

	await fs.ensureDir(CACHE_DIR);

	// Write index
	await fs.writeFile(cachePath, JSON.stringify(index, null, 2));

	// Write metadata
	const metadata: CachedIndexMetadata = {
		ref,
		fetchedAt: Date.now(),
		ttlMs,
	};
	await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Clear cached registry index for a specific ref
 */
export async function clearRegistryCache(ref: string): Promise<void> {
	const cachePath = getCacheFilePath(ref);
	const metadataPath = getMetadataFilePath(ref);

	await Promise.all([
		fs.pathExists(cachePath).then(async (exists) => {
			if (exists) await fs.remove(cachePath);
		}),
		fs.pathExists(metadataPath).then(async (exists) => {
			if (exists) await fs.remove(metadataPath);
		}),
	]);
}

/**
 * Clear all cached registry indexes
 */
export async function clearAllRegistryCache(): Promise<void> {
	if (await fs.pathExists(CACHE_DIR)) {
		await fs.remove(CACHE_DIR);
	}
}

/**
 * Fetch and parse the registry index for a Git ref
 *
 * @param ref Git tag or branch reference (e.g., 'greater-v4.2.0')
 * @param options Fetch options
 * @returns Parsed and validated registry index
 */
export async function fetchRegistryIndex(
	ref: string,
	options: {
		/** Skip cache and always fetch from network */
		skipCache?: boolean;
		/** Force cache refresh even if cached version is valid */
		forceRefresh?: boolean;
		/** Cache TTL in milliseconds (default: 1 hour) */
		ttlMs?: number;
	} = {}
): Promise<RegistryIndex> {
	const { skipCache = false, forceRefresh = false, ttlMs = DEFAULT_TTL_MS } = options;

	// Check cache first (unless skipping or forcing refresh)
	if (!skipCache && !forceRefresh) {
		if (await isCacheValid(ref, ttlMs)) {
			const cached = await readFromCache(ref);
			if (cached) {
				return cached;
			}
		}
	}

	// Fetch from network
	let content: Buffer;
	try {
		content = await fetchFromGitTag(ref, REGISTRY_INDEX_PATH, {
			skipCache: true, // We handle caching at this level
		});
	} catch (error) {
		if (error instanceof NetworkError) {
			throw new RegistryIndexError(
				`Failed to fetch registry index for ref ${ref}: ${error.message}`,
				ref,
				error
			);
		}
		throw error;
	}

	// Parse JSON
	let json: unknown;
	try {
		json = JSON.parse(content.toString('utf-8'));
	} catch (error) {
		throw new RegistryIndexError(
			`Failed to parse registry index JSON for ref ${ref}`,
			ref,
			error instanceof Error ? error : undefined
		);
	}

	// Validate against schema
	let index: RegistryIndex;
	try {
		index = registryIndexSchema.parse(json);
	} catch (error) {
		throw new RegistryIndexError(
			`Invalid registry index schema for ref ${ref}: ${error instanceof Error ? error.message : String(error)}`,
			ref,
			error instanceof Error ? error : undefined
		);
	}

	// Cache the result (unless skipping cache)
	if (!skipCache) {
		try {
			await writeToCache(ref, index, ttlMs);
		} catch {
			// Cache write failed, but we still have the index
			// Continue without caching
		}
	}

	return index;
}

/**
 * Get checksums for a specific component from the registry index
 *
 * @param index Registry index
 * @param componentName Component name
 * @returns Map of file paths to checksums, or null if component not found
 */
export function getComponentChecksums(
	index: RegistryIndex,
	componentName: string
): Record<string, string> | null {
	const component = index.components[componentName];

	if (!component) {
		return null;
	}

	const checksums: Record<string, string> = {};
	for (const file of component.files) {
		checksums[file.path] = file.checksum;
	}

	return checksums;
}

/**
 * Get all file paths for a component from the registry index
 *
 * @param index Registry index
 * @param componentName Component name
 * @returns Array of file paths, or null if component not found
 */
export function getComponentFilePaths(
	index: RegistryIndex,
	componentName: string
): string[] | null {
	const component = index.components[componentName];

	if (!component) {
		return null;
	}

	return component.files.map((f) => f.path);
}

/**
 * Check if a component exists in the registry index
 */
export function hasComponent(index: RegistryIndex, componentName: string): boolean {
	return componentName in index.components;
}

/**
 * Get all component names from the registry index
 */
export function getAllComponentNames(index: RegistryIndex): string[] {
	return Object.keys(index.components);
}
