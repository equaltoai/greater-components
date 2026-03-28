/**
 * Dependency Resolution Engine
 * Builds dependency trees, detects cycles, and orders installation
 */

import type { RegistryIndex } from './registry-index.js';
import {
	getComponent,
	type ComponentMetadata,
	type ComponentDependency,
	type FaceManifest,
} from '../registry/index.js';
import { getFaceManifest } from '../registry/faces.js';
import { getSharedModule, type SharedModuleMetadata } from '../registry/shared.js';
import { getPattern, type PatternMetadata } from '../registry/patterns.js';
import type { ParsedItem } from './item-parser.js';
import { logger } from './logger.js';

/**
 * Resolved dependency with depth information
 */
export interface ResolvedDependency {
	/** Internal unique resolution key */
	key: string;
	/** Component name */
	name: string;
	/** Component type */
	type: 'primitive' | 'compound' | 'pattern' | 'shared' | 'face' | 'adapter';
	/** Depth in dependency tree (0 = root, higher = deeper) */
	depth: number;
	/** Direct dependencies */
	dependencies: string[];
	/** Component metadata */
	metadata: ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata;
	/** Whether this is a direct request (not a transitive dependency) */
	isDirectRequest: boolean;
	/** Whether this is an optional dependency */
	isOptional: boolean;
}

/**
 * Dependency resolution result
 */
export interface DependencyResolutionResult {
	/** All resolved dependencies in installation order */
	resolved: ResolvedDependency[];
	/** Circular dependencies detected */
	circular: Array<{ path: string[]; message: string }>;
	/** Missing dependencies that couldn't be resolved */
	missing: Array<{ name: string; requiredBy: string }>;
	/** NPM dependencies to install */
	npmDependencies: ComponentDependency[];
	/** NPM dev dependencies to install */
	npmDevDependencies: ComponentDependency[];
	/** Whether resolution was successful (no circular or missing) */
	success: boolean;
}

/**
 * Options for dependency resolution
 */
export interface ResolutionOptions {
	/** Include optional dependencies */
	includeOptional?: boolean;
	/** Maximum depth to resolve (default: unlimited) */
	maxDepth?: number;
	/** Skip already installed components */
	skipInstalled?: string[];
	/** Registry index for dynamic resolution */
	registryIndex?: RegistryIndex;
}

interface DependencyRequest {
	name: string;
	preferredType?: ResolvedDependency['type'];
	metadata?: ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata | null;
}

function createDependencyRequest(
	name: string,
	preferredType?: ResolvedDependency['type'],
	metadata?: ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata | null
): DependencyRequest {
	return {
		name,
		preferredType,
		metadata,
	};
}

function getResolutionKey(name: string, type: ResolvedDependency['type']): string {
	return `${type}:${name}`;
}

function getDisplayNameFromKey(key: string): string {
	return key.includes(':') ? key.slice(key.indexOf(':') + 1) : key;
}

function formatDependencyLabel(name: string, type: ResolvedDependency['type']): string {
	switch (type) {
		case 'face':
			return `faces/${name}`;
		case 'shared':
			return `shared/${name}`;
		case 'pattern':
			return `patterns/${name}`;
		default:
			return name;
	}
}

function dedupeDependencyRequests(requests: DependencyRequest[]): DependencyRequest[] {
	const deduped = new Map<string, DependencyRequest>();

	for (const request of requests) {
		const existing = deduped.get(request.name);
		if (!existing || (!existing.preferredType && request.preferredType)) {
			deduped.set(request.name, request);
		}
	}

	return Array.from(deduped.values());
}

/**
 * Internal state for tracking resolution
 */
interface ResolutionState {
	resolved: Map<string, ResolvedDependency>;
	visiting: Set<string>;
	path: string[];
	circular: Array<{ path: string[]; message: string }>;
	missing: Array<{ name: string; requiredBy: string }>;
	npmDeps: Map<string, ComponentDependency>;
	npmDevDeps: Map<string, ComponentDependency>;
	registryIndex?: RegistryIndex;
}

/**
 * Get all dependencies for a component (registry + face includes)
 */
function getComponentDependencies(
	name: string,
	metadata: ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata,
	registryIndex?: RegistryIndex
): DependencyRequest[] {
	const deps: DependencyRequest[] = [];

	// If we have a registry index, use it as the source of truth for internal dependencies
	if (registryIndex) {
		const indexEntry =
			registryIndex.components[name] || registryIndex.faces?.[name] || registryIndex.shared?.[name];

		if (indexEntry) {
			// In registry-index schema: 'dependencies' are internal registry deps
			if (indexEntry.dependencies) {
				const names = indexEntry.dependencies.map((d) => d.name);
				logger.debug(`Resolved dependencies for ${name} from registry: ${names.join(', ')}`);
				deps.push(...indexEntry.dependencies.map((dep) => createDependencyRequest(dep.name)));
			}
		} else {
			logger.debug(`Entry not found in registry for ${name}`);
		}
	} else {
		logger.debug(`No registry index available for ${name}`);
	}

	// Fallback or augmentation with static metadata
	if (!registryIndex || deps.length === 0) {
		// Registry dependencies (other Greater components)
		if ('registryDependencies' in metadata && metadata.registryDependencies) {
			deps.push(...metadata.registryDependencies.map((dep) => createDependencyRequest(dep)));
		}
	}

	// Face includes (primitives, shared, patterns, components)
	// These are structural inclusions, not just dependencies, so we always include them
	// UNLESS the registry index already accounts for them in 'dependencies'.
	// But `includes` is used for more than just installation (e.g. constructing the face).
	// We should preserve them.
	if ('includes' in metadata) {
		const face = metadata as FaceManifest;
		deps.push(
			...face.includes.primitives.map((dep) => createDependencyRequest(dep, 'primitive')),
			...face.includes.shared.map((dep) => createDependencyRequest(dep, 'shared')),
			...face.includes.patterns.map((dep) => createDependencyRequest(dep, 'pattern')),
			...face.includes.components.map((dep) => createDependencyRequest(dep))
		);
	}

	return dedupeDependencyRequests(deps);
}

/**
 * Resolve a single component and its dependencies recursively
 */
function resolveComponent(
	request: DependencyRequest,
	state: ResolutionState,
	depth: number,
	isDirectRequest: boolean,
	options: ResolutionOptions,
	requiredBy?: string
): void {
	// Check max depth
	if (options.maxDepth !== undefined && depth > options.maxDepth) {
		return;
	}

	// Try to find the component in registries
	let metadata = request.metadata ?? null;
	let type: ResolvedDependency['type'] = request.preferredType ?? 'primitive';

	if (!metadata) {
		switch (request.preferredType) {
			case 'face': {
				const face = getFaceManifest(request.name);
				if (face) {
					metadata = face;
					type = 'face';
				}
				break;
			}
			case 'shared': {
				const shared = getSharedModule(request.name);
				if (shared) {
					metadata = shared;
					type = 'shared';
				}
				break;
			}
			case 'pattern': {
				const pattern = getPattern(request.name);
				if (pattern) {
					metadata = pattern;
					type = 'pattern';
				}
				break;
			}
			default: {
				const component = getComponent(request.name);
				if (component) {
					metadata = component;
					type = component.type as ResolvedDependency['type'];
				}

				if (!metadata) {
					const face = getFaceManifest(request.name);
					if (face) {
						metadata = face;
						type = 'face';
					}
				}

				if (!metadata) {
					const shared = getSharedModule(request.name);
					if (shared) {
						metadata = shared;
						type = 'shared';
					}
				}

				if (!metadata) {
					const pattern = getPattern(request.name);
					if (pattern) {
						metadata = pattern;
						type = 'pattern';
					}
				}
			}
		}
	}

	// Not found
	if (!metadata) {
		state.missing.push({
			name: request.name,
			requiredBy: requiredBy || 'direct request',
		});
		return;
	}

	const key = getResolutionKey(request.name, type);

	// Skip if already resolved
	if (state.resolved.has(key)) {
		const existing = state.resolved.get(key);
		if (existing && isDirectRequest && !existing.isDirectRequest) {
			existing.isDirectRequest = true;
		}
		return;
	}

	// Faces are intentionally always reconsidered from the selected face manifest instead of the
	// installed-name list, because a face can share a bare name with a shared module (for example agent).
	if (type !== 'face' && options.skipInstalled?.includes(request.name)) {
		return;
	}

	// Check for circular dependency
	if (state.visiting.has(key)) {
		const cycleStart = state.path.indexOf(key);
		const cyclePath = [...state.path.slice(cycleStart), key].map(getDisplayNameFromKey);
		state.circular.push({
			path: cyclePath,
			message: `Circular dependency detected: ${cyclePath.join(' -> ')}`,
		});
		return;
	}

	// Mark as visiting
	state.visiting.add(key);
	state.path.push(key);

	// Collect NPM dependencies
	// Priority: Registry Index (dynamic) > Static Metadata
	let npmDepsFound = false;

	if (state.registryIndex) {
		const indexEntry =
			state.registryIndex.components[request.name] ||
			state.registryIndex.faces?.[request.name] ||
			state.registryIndex.shared?.[request.name];

		if (indexEntry && indexEntry.peerDependencies && indexEntry.peerDependencies.length > 0) {
			for (const dep of indexEntry.peerDependencies) {
				state.npmDeps.set(dep.name, { name: dep.name, version: dep.version, dev: dep.dev });
			}
			npmDepsFound = true;
		}
	}

	if (!npmDepsFound) {
		if ('dependencies' in metadata && metadata.dependencies) {
			for (const dep of metadata.dependencies) {
				state.npmDeps.set(dep.name, dep);
			}
		}
		if ('devDependencies' in metadata && metadata.devDependencies) {
			for (const dep of metadata.devDependencies) {
				state.npmDevDeps.set(dep.name, dep);
			}
		}
	}

	// Get and resolve dependencies
	const dependencies = getComponentDependencies(request.name, metadata, state.registryIndex);

	for (const dependency of dependencies) {
		resolveComponent(
			dependency,
			state,
			depth + 1,
			false,
			options,
			formatDependencyLabel(request.name, type)
		);
	}

	// Add to resolved (after dependencies)
	state.resolved.set(key, {
		key,
		name: request.name,
		type,
		depth,
		dependencies: dependencies.map((dependency) => {
			const dependencyType =
				dependency.preferredType ??
				(dependency.metadata?.type as ResolvedDependency['type'] | undefined);
			return dependencyType
				? formatDependencyLabel(dependency.name, dependencyType)
				: dependency.name;
		}),
		metadata,
		isDirectRequest,
		isOptional: false,
	});

	// Unmark visiting
	state.visiting.delete(key);
	state.path.pop();
}

/**
 * Resolve dependencies for multiple items
 */
export function resolveDependencies(
	items: ParsedItem[],
	options: ResolutionOptions = {}
): DependencyResolutionResult {
	const state: ResolutionState = {
		resolved: new Map(),
		visiting: new Set(),
		path: [],
		circular: [],
		missing: [],
		npmDeps: new Map(),
		npmDevDeps: new Map(),
		registryIndex: options.registryIndex,
	};

	// Resolve each requested item
	for (const item of items) {
		if (item.found && item.metadata) {
			resolveComponent(
				createDependencyRequest(
					item.name,
					item.type,
					item.metadata as ComponentMetadata | FaceManifest | SharedModuleMetadata | PatternMetadata
				),
				state,
				0,
				true,
				options
			);
		}
	}

	// Sort by depth (deepest first for installation order)
	const resolved = Array.from(state.resolved.values()).sort((a, b) => b.depth - a.depth);

	return {
		resolved,
		circular: state.circular,
		missing: state.missing,
		npmDependencies: Array.from(state.npmDeps.values()),
		npmDevDependencies: Array.from(state.npmDevDeps.values()),
		success: state.circular.length === 0 && state.missing.length === 0,
	};
}

/**
 * Get installation order (dependencies first)
 */
export function getInstallationOrder(result: DependencyResolutionResult): string[] {
	// Already sorted by depth (deepest first), so dependencies come before dependents
	return result.resolved.map((dep) => dep.name);
}

/**
 * Get internal installation keys (dependencies first)
 */
export function getInstallationKeys(result: DependencyResolutionResult): string[] {
	// Already sorted by depth (deepest first), so dependencies come before dependents
	return result.resolved.map((dep) => dep.key);
}

/**
 * Group resolved dependencies by type for display
 */
export function groupByType(
	result: DependencyResolutionResult
): Record<string, ResolvedDependency[]> {
	const groups: Record<string, ResolvedDependency[]> = {
		primitives: [],
		compounds: [],
		patterns: [],
		shared: [],
		faces: [],
		adapters: [],
	};

	for (const dep of result.resolved) {
		switch (dep.type) {
			case 'primitive':
				groups['primitives']?.push(dep);
				break;
			case 'compound':
				groups['compounds']?.push(dep);
				break;
			case 'pattern':
				groups['patterns']?.push(dep);
				break;
			case 'shared':
				groups['shared']?.push(dep);
				break;
			case 'face':
				groups['faces']?.push(dep);
				break;
			case 'adapter':
				groups['adapters']?.push(dep);
				break;
		}
	}

	return groups;
}

/**
 * Estimate disk space for installation
 */
export function estimateDiskSpace(result: DependencyResolutionResult): {
	files: number;
	estimatedBytes: number;
	estimatedKB: string;
} {
	let files = 0;

	for (const dep of result.resolved) {
		if ('files' in dep.metadata && dep.metadata.files) {
			files += dep.metadata.files.length;
		}
	}

	// Rough estimate: ~5KB per file average
	const estimatedBytes = files * 5 * 1024;

	return {
		files,
		estimatedBytes,
		estimatedKB: `~${Math.ceil(estimatedBytes / 1024)}KB`,
	};
}
