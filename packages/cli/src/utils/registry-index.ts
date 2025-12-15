/**
 * Registry Index utilities
 * Handles fetching, parsing, and caching of the component registry index
 */

import { z } from 'zod';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { fetchFromGitTag, NetworkError } from './git-fetch.js';
import { FALLBACK_REF } from './config.js';

/**
 * Registry index file path within the repository
 */
const REGISTRY_INDEX_PATH = 'registry/index.json';

/**
 * Latest ref file path within the repository
 */
const REGISTRY_LATEST_PATH = 'registry/latest.json';

/**
 * Cache configuration
 */
const CACHE_DIR = path.join(os.homedir(), '.greater-components', 'registry');
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour
const LATEST_TTL_MS = 5 * 60 * 1000; // 5 minutes for latest.json

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
	type: z.string().optional(),
	files: z.array(fileChecksumSchema),
	dependencies: z.array(z.string()).optional().default([]),
	peerDependencies: z.array(z.string()).optional().default([]),
	tags: z.array(z.string()).optional().default([]),
});

export type RegistryComponent = z.infer<typeof registryComponentSchema>;

/**
 * Face entry in the registry index (curated component collections)
 */
export const registryFaceSchema = z.object({
	name: z.string(),
	version: z.string(),
	description: z.string().optional(),
	includes: z
		.object({
			primitives: z.array(z.string()).optional().default([]),
			shared: z.array(z.string()).optional().default([]),
			patterns: z.array(z.string()).optional().default([]),
			components: z.array(z.string()).optional().default([]),
		})
		.optional(),
	files: z.array(fileChecksumSchema),
	styles: z
		.object({
			main: z.string(),
			tokens: z.string().optional(),
		})
		.optional(),
	dependencies: z.array(z.string()).optional().default([]),
	peerDependencies: z.array(z.string()).optional().default([]),
});

export type RegistryFace = z.infer<typeof registryFaceSchema>;

/**
 * Shared module entry in the registry index
 */
export const registrySharedSchema = z.object({
	name: z.string(),
	version: z.string(),
	description: z.string().optional(),
	exports: z.array(z.string()).optional().default([]),
	files: z.array(fileChecksumSchema),
	dependencies: z.array(z.string()).optional().default([]),
	types: z.array(z.string()).optional().default([]),
});

export type RegistryShared = z.infer<typeof registrySharedSchema>;

/**
 * Registry index schema - supports both legacy and enhanced format
 */
export const registryIndexSchema = z.object({
	$schema: z.string().optional(),
	schemaVersion: z.string().optional().default('1.0.0'),
	version: z.string(),
	ref: z.string(),
	generatedAt: z.string().datetime(),
	checksums: z.record(z.string(), z.string()).optional().default({}),
	components: z.record(z.string(), registryComponentSchema),
	faces: z.record(z.string(), registryFaceSchema).optional().default({}),
	shared: z.record(z.string(), registrySharedSchema).optional().default({}),
});

export type RegistryIndex = z.infer<typeof registryIndexSchema>;

/**
 * Latest ref schema (registry/latest.json)
 */
export const latestRefSchema = z.object({
	ref: z.string(),
	version: z.string(),
	updatedAt: z.string().optional(),
});

export type LatestRef = z.infer<typeof latestRefSchema>;

function isLatestAlias(ref?: string): boolean {
	return (ref ?? '').trim().toLowerCase() === 'latest';
}

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

/**
 * Get all face names from the registry index
 */
export function getAllFaceNames(index: RegistryIndex): string[] {
	return Object.keys(index.faces);
}

/**
 * Get all shared module names from the registry index
 */
export function getAllSharedNames(index: RegistryIndex): string[] {
	return Object.keys(index.shared);
}

/**
 * Check if a face exists in the registry index
 */
export function hasFace(index: RegistryIndex, faceName: string): boolean {
	return faceName in index.faces;
}

/**
 * Check if a shared module exists in the registry index
 */
export function hasShared(index: RegistryIndex, sharedName: string): boolean {
	return sharedName in index.shared;
}

/**
 * Get face metadata from the registry index
 */
export function getFace(index: RegistryIndex, faceName: string): RegistryFace | null {
	return index.faces[faceName] || null;
}

/**
 * Get shared module metadata from the registry index
 */
export function getShared(index: RegistryIndex, sharedName: string): RegistryShared | null {
	return index.shared[sharedName] || null;
}

/**
 * Fetch the latest ref from registry/latest.json
 *
 * This fetches from the main branch to get the most current stable version.
 *
 * @param options Fetch options
 * @returns Latest ref info, or null if not available
 */
export async function fetchLatestRef(options: {
	/** Skip cache and always fetch from network */
	skipCache?: boolean;
} = {}): Promise<LatestRef | null> {
	const { skipCache = false } = options;

	// Check cache first
	const cachePath = path.join(CACHE_DIR, 'latest.json');
	const metadataPath = path.join(CACHE_DIR, 'latest.meta.json');

	if (!skipCache) {
		try {
			if (await fs.pathExists(cachePath) && await fs.pathExists(metadataPath)) {
				const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
				const age = Date.now() - metadata.fetchedAt;

				if (age < LATEST_TTL_MS) {
					const content = await fs.readFile(cachePath, 'utf-8');
					return latestRefSchema.parse(JSON.parse(content));
				}
			}
		} catch {
			// Cache read failed, continue to fetch
		}
	}

	// Fetch from main branch
	try {
		const content = await fetchFromGitTag('main', REGISTRY_LATEST_PATH, {
			skipCache: true,
		});

		const json = JSON.parse(content.toString('utf-8'));
		const latest = latestRefSchema.parse(json);

		// Cache the result
		try {
			await fs.ensureDir(CACHE_DIR);
			await fs.writeFile(cachePath, JSON.stringify(latest, null, 2));
			await fs.writeFile(metadataPath, JSON.stringify({ fetchedAt: Date.now() }));
		} catch {
			// Cache write failed, continue
		}

		return latest;
	} catch {
		return null;
	}
}

/**
 * Resolve the ref to use for registry operations
 *
 * Priority order:
 * 1. Explicit ref parameter (e.g., --ref flag)
 * 2. ref from components.json
 * 3. Latest stable from registry/latest.json
 * 4. Fallback to default ref constant
 *
 * @param explicitRef Explicit ref from CLI flag
 * @param configRef Ref from components.json
 * @param fallbackRef Fallback ref if all else fails
 * @returns Resolved ref to use
 */
export async function resolveRef(
	explicitRef?: string,
	configRef?: string,
	fallbackRef: string = FALLBACK_REF
): Promise<{ ref: string; source: 'explicit' | 'config' | 'latest' | 'fallback' }> {
	// Priority 1: Explicit ref
	if (explicitRef && !isLatestAlias(explicitRef)) {
		return { ref: explicitRef, source: 'explicit' };
	}

	// Priority 2: Config ref
	if (configRef && !isLatestAlias(configRef)) {
		return { ref: configRef, source: 'config' };
	}

	// Priority 3: Latest stable from registry/latest.json
	try {
		const latest = await fetchLatestRef();
		if (latest?.ref) {
			return { ref: latest.ref, source: 'latest' };
		}
	} catch {
		// Failed to fetch latest, continue to fallback
	}

	// Priority 4: Fallback
	return { ref: fallbackRef, source: 'fallback' };
}

/**
 * Get checksums for a face from the registry index
 */
export function getFaceChecksums(
	index: RegistryIndex,
	faceName: string
): Record<string, string> | null {
	const face = index.faces[faceName];

	if (!face) {
		return null;
	}

	const checksums: Record<string, string> = {};
	for (const file of face.files) {
		checksums[file.path] = file.checksum;
	}

	return checksums;
}

/**
 * Get checksums for a shared module from the registry index
 */
export function getSharedChecksums(
	index: RegistryIndex,
	sharedName: string
): Record<string, string> | null {
	const shared = index.shared[sharedName];

	if (!shared) {
		return null;
	}

	const checksums: Record<string, string> = {};
	for (const file of shared.files) {
		checksums[file.path] = file.checksum;
	}

	return checksums;
}
