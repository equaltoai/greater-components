/**
 * Registry virtual install path → monorepo source path resolution, disambiguated
 * against a fetched registry index.
 *
 * `source-paths.ts` produces the *candidate* source paths for a virtual install
 * path; several of those candidates are face-ambiguous (`lib/lib/x.ts` could be
 * any of the four face packages). This module picks the one that actually exists
 * at a given immutable ref by consulting that ref's `registry/index.json`
 * `checksums` map.
 *
 * It lives here rather than inside `fetch.ts` because both the fetcher and the
 * update pruner must agree on which source file backs an install path. A second
 * copy would be free to drift, and a pruner that disagreed with the fetcher
 * about ownership could delete a file the fetcher still installs.
 */

import type { ComponentMetadata } from '../registry/index.js';
import type { RegistryIndex } from './registry-index.js';
import { buildSourcePathCandidates } from './source-paths.js';

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

/**
 * Resolve the monorepo source path backing a registry install path at the ref
 * the supplied index was fetched for, or `null` when no candidate exists there.
 */
export function resolveSourcePathFromIndex(
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
