/**
 * Registry virtual path → monorepo source path resolution.
 *
 * The CLI's registry entries use *virtual* install paths (`lib/components/...`,
 * `greater/<pkg>/...`, `shared/<module>/...`) that do not match the monorepo
 * source layout. This module owns the mapping back to source.
 *
 * It lives on its own, with no I/O and no imports beyond a type, so that both
 * the fetcher and `scripts/audit-cli-registry.mjs` can use the *same* mapping.
 * A second copy in the audit would be free to drift from the one the CLI
 * actually installs with, which would make the audit worse than useless.
 */

import type { ComponentMetadata } from '../registry/index.js';

/**
 * Faces whose `src/` trees the virtual `lib/...` prefixes can resolve into.
 *
 * Ordering matters only as a tiebreak: a component's own `domain` is tried
 * first, then the rest.
 */
export const FACE_CANDIDATES = ['social', 'blog', 'community', 'artist'] as const;

export type FaceCandidate = (typeof FACE_CANDIDATES)[number];

export function isFaceCandidateDomain(
	domain: ComponentMetadata['domain']
): domain is FaceCandidate {
	return typeof domain === 'string' && (FACE_CANDIDATES as readonly string[]).includes(domain);
}

function getFaceCandidateOrder(component: ComponentMetadata): FaceCandidate[] {
	if (isFaceCandidateDomain(component.domain)) {
		const domain = component.domain;
		return [domain, ...FACE_CANDIDATES.filter((face) => face !== domain)];
	}
	return [...FACE_CANDIDATES];
}

/**
 * Candidate monorepo source paths for a registry entry's virtual install path,
 * most specific first, de-duplicated.
 *
 * Returns candidates rather than a single path because several virtual prefixes
 * are face-ambiguous; the caller disambiguates against the registry index.
 */
export function buildSourcePathCandidates(
	component: ComponentMetadata,
	installPath: string
): string[] {
	const normalized = installPath.replace(/\\/g, '/').replace(/^\/+/, '');
	const candidates: string[] = [];
	const faceCandidates = getFaceCandidateOrder(component);
	const isHeadlessPrimitive =
		component.type === 'primitive' || component.tags?.includes('headless');

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

	// greater/faces/<face>/... -> packages/faces/<face>/src/...
	const greaterFaceMatch = normalized.match(/^greater\/faces\/([^/]+)\/(.+)$/);
	if (greaterFaceMatch?.[1] && greaterFaceMatch?.[2]) {
		candidates.push(`packages/faces/${greaterFaceMatch[1]}/src/${greaterFaceMatch[2]}`);
	}

	// lib/adapters/... -> packages/adapters/src/...
	if (normalized.startsWith('lib/adapters/')) {
		const rest = normalized.slice('lib/adapters/'.length);
		candidates.push(`packages/adapters/src/${rest}`);
	}

	// lib/types.ts -> packages/faces/<face>/src/types.ts
	if (normalized === 'lib/types.ts') {
		if (isFaceCandidateDomain(component.domain)) {
			candidates.push(`packages/faces/${component.domain}/src/types.ts`);
		} else {
			for (const face of FACE_CANDIDATES) {
				candidates.push(`packages/faces/${face}/src/types.ts`);
			}
		}
	}

	const faceScopedTypesMatch = normalized.match(/^lib\/([a-z0-9-]+)-types\.ts$/);
	if (faceScopedTypesMatch?.[1]) {
		candidates.push(`packages/faces/${faceScopedTypesMatch[1]}/src/types.ts`);
	}

	const faceScopedShareMatch = normalized.match(/^lib\/([a-z0-9-]+)-share\.ts$/);
	if (faceScopedShareMatch?.[1]) {
		candidates.push(`packages/faces/${faceScopedShareMatch[1]}/src/share.ts`);
	}

	// lib/lib/... -> packages/faces/<face>/src/lib/...
	if (normalized.startsWith('lib/lib/')) {
		const rest = normalized.slice('lib/lib/'.length);
		for (const face of faceCandidates) {
			candidates.push(`packages/faces/${face}/src/lib/${rest}`);
		}
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

	// lib/utils/... -> packages/headless/src/utils/... (and face utils when applicable)
	if (normalized.startsWith('lib/utils/')) {
		const rest = normalized.slice('lib/utils/'.length);
		if (!isHeadlessPrimitive) {
			if (isFaceCandidateDomain(component.domain)) {
				candidates.push(`packages/faces/${component.domain}/src/utils/${rest}`);
			} else {
				for (const face of FACE_CANDIDATES) {
					candidates.push(`packages/faces/${face}/src/utils/${rest}`);
				}
			}
		}
		candidates.push(`packages/headless/src/utils/${rest}`);
	}

	// lib/components/... -> packages/faces/<face>/src/components/...
	if (normalized.startsWith('lib/components/')) {
		const rest = normalized.slice('lib/components/'.length);
		for (const face of faceCandidates) {
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
		for (const face of faceCandidates) {
			candidates.push(`packages/faces/${face}/src/generics/${rest}`);
		}
	}

	// lib/patterns/... -> packages/faces/<face>/src/patterns/...
	if (normalized.startsWith('lib/patterns/')) {
		const rest = normalized.slice('lib/patterns/'.length);
		for (const face of faceCandidates) {
			candidates.push(`packages/faces/${face}/src/patterns/${rest}`);
		}
	}

	// patterns/... -> packages/faces/<face>/src/patterns/...
	if (normalized.startsWith('patterns/')) {
		const rest = normalized.slice('patterns/'.length);
		for (const face of faceCandidates) {
			candidates.push(`packages/faces/${face}/src/patterns/${rest}`);
		}
	}

	// As a last resort, try the normalized path as repo-relative.
	candidates.push(normalized);

	// De-dupe while preserving order
	return [...new Set(candidates)];
}
