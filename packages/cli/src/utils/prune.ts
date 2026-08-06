/**
 * Obsolete managed-file pruning for `greater update`.
 *
 * `greater update` writes the target ref's file set for a component but has
 * historically never removed files the component owned at the *previous* ref and
 * no longer owns at the target ref. Those files stay behind in the consumer
 * project forever, and because they are CLI-managed bytes the consumer is not
 * supposed to hand-delete them (see issue #1000).
 *
 * ## Where "what did this component own before?" comes from
 *
 * Ownership is never taken from a hand-authored "these were removed" list and
 * never inferred by walking the consumer's install directories. There are two
 * sources, and which one applies decides how strict the outcome is.
 *
 * **Proven ownership.** `greater update` records, per installed component, the
 * install path and canonical checksum of every file it manages at the ref it
 * wrote (`components.json` → `installed[].checksums`). When that record is
 * present, the previous file set is known exactly. A recorded file that the
 * target ref no longer owns is unambiguously an obsolete managed file, so a
 * local edit to it is a hard failure rather than something to guess about.
 *
 * **Inferred ownership.** A consumer whose last install predates that record —
 * the `greater-v0.13.0` case in issue #1000 — has nothing to read. The previous
 * file set is then narrowed from the *fetched immutable* `registry/index.json`
 * at the recorded prior ref: source files that existed at that ref, inside a
 * source directory this entry still owns files in, whose install path no
 * registry entry owns at the target ref. That set is a superset — it also
 * catches source files no entry has ever owned — so on this path a file is only
 * ever deleted when its bytes prove it: anything that does not byte-match what
 * the CLI would have written at the prior ref is left alone and is not treated
 * as an obsolete managed file at all.
 *
 * In both cases the delete itself is gated on byte-identity with the prior ref's
 * managed rendering, verified against that ref's immutable checksum. A file the
 * consumer edited is never deleted, and a file that merely shares a path with a
 * retired Greater file is never deleted.
 *
 * ## Known bounds
 *
 * - Inferred ownership is scoped to source directories the entry *still* owns at
 *   least one file in. An entry that retires every file under a directory in a
 *   single release keeps those consumer files; the CLI will not infer a
 *   directory it no longer has any anchor in. This is the conservative direction.
 * - On the inferred path a locally-modified obsolete file is retained silently
 *   rather than failing the update, because ownership cannot be proven and
 *   failing would break updates for consumers whose own files happen to sit at a
 *   retired path. The first update after this release writes the ownership
 *   record, after which the strict path applies.
 * - Pruning is skipped, with a reported reason, when the recorded prior ref is
 *   not a fetchable immutable ref (legacy `components.json` entries whose
 *   `version` is a package version rather than a git ref) or when its index
 *   cannot be fetched. Skipping is reported, never treated as success.
 * - Emptied directories are left in place.
 */

import fs from 'fs-extra';
import path from 'node:path';
import type { ComponentConfig, FileChecksumEntry } from './config.js';
import type { ComponentMetadata } from '../registry/index.js';
import type { RegistryIndex } from './registry-index.js';
import { getInstalledFilePath, getInstallTarget, normalizeRegistryPath } from './install-path.js';
import { resolveSourcePathFromIndex } from './registry-source-map.js';
import { PathTraversalError } from './path-safety.js';
import { computeChecksum } from './integrity.js';
import { transformImports } from './transform.js';

/** How the previous file set for a component was established. */
export type OwnershipBasis =
	/** Read from `components.json` → `installed[].checksums`; exact. */
	| 'recorded'
	/** Narrowed from the prior ref's registry index; a superset. */
	| 'inferred';

/**
 * A file the component owned at the prior ref and no longer owns at the target ref.
 */
export interface PruneCandidate {
	/** Registry virtual install path (e.g. `lib/lib/lesserTimelineStore.ts`). */
	installPath: string;
	/** Monorepo source path backing it at the prior ref. */
	sourcePath: string;
	/** `oldIndex.checksums[sourcePath]` — the prior ref's content hash for the source. */
	sourceChecksum: string;
	/** Absolute path in the consumer project, resolved through `components.json`. */
	localPath: string;
	/** Checksum `components.json` recorded for this path, when ownership is proven. */
	recordedChecksum?: string;
	basis: OwnershipBasis;
}

export type PruneStatus =
	/** Deleted (or, in a dry run, would be deleted). */
	| 'pruned'
	/** Owned at the prior ref but already absent from the consumer project. */
	| 'absent'
	/** Proven-owned but locally modified — preserved, fails the update. */
	| 'blocked'
	/** Inferred-only and not byte-identical to managed bytes — left untouched, not a failure. */
	| 'retained'
	/** Could not be evaluated (fetch/verify failure) — preserved, fails the update. */
	| 'error';

export interface PruneResult {
	installPath: string;
	localPath: string;
	sourcePath: string;
	status: PruneStatus;
	basis: OwnershipBasis;
	/** Operator-facing explanation for `blocked` / `retained` / `error`. */
	reason?: string;
}

export interface PrunePlan {
	candidates: PruneCandidate[];
	basis: OwnershipBasis;
	/** Set when planning was skipped wholesale; `candidates` is then empty. */
	skippedReason?: string;
}

const COMMIT_SHA_RE = /^[0-9a-f]{40}$/i;
const RELEASE_TAG_RE = /^greater-v\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?$/;

/**
 * Whether a ref recorded in `components.json` is safe to fetch a prior registry
 * index from.
 *
 * Only immutable refs qualify: a full commit SHA, or a release tag. Branch names
 * and legacy package-version strings (`"1.0.0"`) do not — a mutable ref would
 * make "what did this component own before?" answerable differently on every
 * run, which is exactly the ambiguity that must not drive a delete.
 */
export function isImmutablePriorRef(ref: string | undefined): ref is string {
	if (!ref) return false;
	const trimmed = ref.trim();
	return COMMIT_SHA_RE.test(trimmed) || RELEASE_TAG_RE.test(trimmed);
}

function dirPrefix(filePath: string): string {
	const normalized = normalizeRegistryPath(filePath);
	const idx = normalized.lastIndexOf('/');
	return idx === -1 ? '' : normalized.slice(0, idx + 1);
}

/**
 * Resolve a registry install path to its consumer-project location, returning
 * `null` when the path cannot be contained inside its configured install root.
 */
function safeLocalPath(installPath: string, config: ComponentConfig, cwd: string): string | null {
	try {
		return getInstalledFilePath(installPath, config, cwd);
	} catch (error) {
		if (error instanceof PathTraversalError) return null;
		throw error;
	}
}

/**
 * Every local path owned by *any* registry entry at the target ref, mapped
 * through this consumer's `components.json` aliases.
 *
 * Over-inclusion is the safe direction: an extra path here can only protect a
 * file from deletion, never cause one.
 */
export function collectOwnedLocalPaths(
	entries: ComponentMetadata[],
	newIndex: RegistryIndex,
	config: ComponentConfig,
	cwd: string
): Set<string> {
	const owned = new Set<string>();

	for (const entry of entries) {
		for (const file of entry.files ?? []) {
			const localPath = safeLocalPath(file.path, config, cwd);
			if (localPath) owned.add(localPath);
		}
	}

	// Core packages enumerate their files through the index rather than through
	// the single placeholder entry the static registry carries for them.
	for (const [name, indexEntry] of Object.entries(newIndex.components)) {
		for (const file of indexEntry.files) {
			const withoutSrc = file.path.startsWith('src/') ? file.path.slice('src/'.length) : file.path;
			const localPath = safeLocalPath(`greater/${name}/${withoutSrc}`, config, cwd);
			if (localPath) owned.add(localPath);
		}
	}

	return owned;
}

/**
 * Install paths the component owned at the prior ref, per the ownership record
 * `greater update` wrote into `components.json`.
 */
function recordedOwnership(recorded: FileChecksumEntry[]): Map<string, string> {
	const byPath = new Map<string, string>();
	for (const entry of recorded) {
		byPath.set(normalizeRegistryPath(entry.path), entry.checksum);
	}
	return byPath;
}

/**
 * Install paths this entry *may* have owned at the prior ref, narrowed from that
 * ref's immutable index. Used only when no ownership record exists.
 */
function inferredOwnership(
	component: ComponentMetadata,
	oldIndex: RegistryIndex,
	newIndex: RegistryIndex
): string[] {
	// Source directories this entry still owns at least one file in at the target
	// ref, paired with the install directory they map onto.
	const prefixPairs = new Map<string, string>(); // sourceDirPrefix -> installDirPrefix
	for (const file of component.files ?? []) {
		const sourcePath = resolveSourcePathFromIndex(newIndex, component, file.path);
		if (!sourcePath) continue;
		prefixPairs.set(dirPrefix(sourcePath), dirPrefix(file.path));
	}

	if (prefixPairs.size === 0) return [];

	const installPaths = new Set<string>();

	for (const sourceKey of Object.keys(oldIndex.checksums)) {
		for (const [sourceDir, installDir] of prefixPairs) {
			if (!sourceKey.startsWith(sourceDir)) continue;

			const rest = sourceKey.slice(sourceDir.length);
			// Same directory only — a nested subdirectory is a different install root.
			if (!rest || rest.includes('/')) continue;

			const installPath = `${installDir}${rest}`;

			// The CLI's own forward mapping must agree, at the prior ref, or the
			// pruner and the fetcher would disagree about what backs this path.
			if (resolveSourcePathFromIndex(oldIndex, component, installPath) !== sourceKey) continue;

			installPaths.add(installPath);
			break;
		}
	}

	return [...installPaths];
}

/**
 * Build the prune plan for one component.
 *
 * Pure with respect to the filesystem and the network: it consumes two already
 * fetched immutable indexes plus the consumer's recorded ownership, and returns
 * candidates. Deciding each candidate's fate — and carrying it out — is
 * `evaluatePruneCandidates`.
 */
export function planComponentPrune(options: {
	component: ComponentMetadata;
	allEntries: ComponentMetadata[];
	config: ComponentConfig;
	cwd: string;
	oldIndex: RegistryIndex;
	newIndex: RegistryIndex;
	/** `components.json` → `installed[<component>].checksums`, if any. */
	recorded?: FileChecksumEntry[];
}): PrunePlan {
	const { component, allEntries, config, cwd, oldIndex, newIndex } = options;

	const recordedByPath = recordedOwnership(options.recorded ?? []);
	const basis: OwnershipBasis = recordedByPath.size > 0 ? 'recorded' : 'inferred';

	const priorInstallPaths =
		basis === 'recorded'
			? [...recordedByPath.keys()]
			: inferredOwnership(component, oldIndex, newIndex);

	if (priorInstallPaths.length === 0) {
		return {
			candidates: [],
			basis,
			skippedReason:
				basis === 'inferred'
					? 'no prior-ref source directories resolved for this entry'
					: undefined,
		};
	}

	const ownedLocalPaths = collectOwnedLocalPaths(allEntries, newIndex, config, cwd);

	const candidates: PruneCandidate[] = [];
	const seenLocalPaths = new Set<string>();

	for (const installPath of priorInstallPaths) {
		// The path must map to a source file that actually existed at the prior
		// ref — this ties even the recorded path back to the immutable index.
		const sourcePath = resolveSourcePathFromIndex(oldIndex, component, installPath);
		if (!sourcePath) continue;

		const sourceChecksum = oldIndex.checksums[sourcePath];
		if (!sourceChecksum) continue;

		const localPath = safeLocalPath(installPath, config, cwd);
		if (!localPath) continue;

		// Still owned by some registry entry at the target ref → keep.
		if (ownedLocalPaths.has(localPath)) continue;
		if (seenLocalPaths.has(localPath)) continue;
		seenLocalPaths.add(localPath);

		const recordedChecksum = recordedByPath.get(normalizeRegistryPath(installPath));

		candidates.push({
			installPath,
			sourcePath,
			sourceChecksum,
			localPath,
			basis,
			...(recordedChecksum ? { recordedChecksum } : {}),
		});
	}

	candidates.sort((a, b) => a.installPath.localeCompare(b.installPath));
	return { candidates, basis };
}

/**
 * The exact bytes `greater add` / `greater update` would have written for a
 * source file at a given install path.
 *
 * Two transformed renderings are produced because `add` transforms with the path
 * *relative to its install root* while `update` transforms with the full registry
 * path. Both forms are handled identically by `transform.ts` for every prefix the
 * CLI installs today, but rendering both means a file written by either command
 * is recognised as unmodified rather than mistaken for a local edit.
 *
 * Returns `Buffer`s rather than strings so binary assets and files the registry
 * marks `transform: false` — written verbatim, and not round-trippable through a
 * utf-8 decode — compare exactly.
 */
export function renderManagedBytes(
	sourceContent: Buffer,
	installPath: string,
	config: ComponentConfig,
	cwd: string,
	localPath: string
): Buffer[] {
	// Verbatim first: binary assets and non-transformed files are written as-is.
	const renderings: Buffer[] = [sourceContent];

	const target = getInstallTarget(installPath, config, cwd);
	const content = sourceContent.toString('utf-8');
	const context = { sourceFilePath: localPath, consumerRoot: cwd };

	for (const filePath of [normalizeRegistryPath(installPath), target.relativePath]) {
		renderings.push(
			Buffer.from(transformImports(content, config, filePath, context).content, 'utf-8')
		);
	}

	return renderings;
}

/**
 * Refuse to touch anything reached through a symlink, or whose real parent
 * directory escapes the configured install root.
 *
 * `writeFile` relies on `resolvePathWithinDir` alone. Deletion is not reversible
 * the way overwriting tracked source is, so the pruner additionally resolves
 * symlinks: a path is only prunable if its real parent is still inside the real
 * install root and the entry itself is a regular file.
 *
 * Containment is measured against the *resolved* install root, not `cwd`. A
 * consumer who symlinks their whole `$lib` elsewhere has declared that directory
 * as the install root, and `greater add` / `greater update` already write through
 * it; pruning follows the same root. What this catches is a link that escapes
 * from *within* the root — the case lexical containment alone cannot see.
 */
async function assertSafeToDelete(
	candidate: PruneCandidate,
	config: ComponentConfig,
	cwd: string
): Promise<void> {
	const target = getInstallTarget(candidate.installPath, config, cwd);
	const realRoot = await fs.realpath(path.resolve(target.targetDir));
	const realParent = await fs.realpath(path.dirname(candidate.localPath));

	const rel = path.relative(realRoot, realParent);
	if (rel !== '' && (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel))) {
		throw new PathTraversalError(
			`Invalid prune path: ${candidate.localPath} resolves outside ${target.targetDir}`
		);
	}

	const stats = await fs.lstat(candidate.localPath);
	if (stats.isSymbolicLink()) {
		throw new PathTraversalError(`Refusing to prune symlink: ${candidate.localPath}`);
	}
	if (!stats.isFile()) {
		throw new PathTraversalError(`Refusing to prune non-regular file: ${candidate.localPath}`);
	}
}

export interface EvaluatePruneOptions {
	candidates: PruneCandidate[];
	config: ComponentConfig;
	cwd: string;
	oldRef: string;
	/** Fetches a source file's bytes at the prior ref. */
	fetchSource: (ref: string, sourcePath: string) => Promise<Buffer>;
	/** When true, report the outcome without deleting anything. */
	dryRun: boolean;
}

/**
 * Decide, and (unless `dryRun`) carry out, the fate of each candidate.
 */
export async function evaluatePruneCandidates(
	options: EvaluatePruneOptions
): Promise<PruneResult[]> {
	const { candidates, config, cwd, oldRef, fetchSource, dryRun } = options;
	const results: PruneResult[] = [];

	for (const candidate of candidates) {
		const base = {
			installPath: candidate.installPath,
			localPath: candidate.localPath,
			sourcePath: candidate.sourcePath,
			basis: candidate.basis,
		};

		if (!(await fs.pathExists(candidate.localPath))) {
			results.push({ ...base, status: 'absent' });
			continue;
		}

		try {
			await assertSafeToDelete(candidate, config, cwd);

			const sourceBytes = await fetchSource(oldRef, candidate.sourcePath);
			const actualSourceChecksum = computeChecksum(sourceBytes);
			if (actualSourceChecksum !== candidate.sourceChecksum) {
				results.push({
					...base,
					status: 'error',
					reason:
						`integrity check failed for ${candidate.sourcePath} at ${oldRef}: ` +
						`expected ${candidate.sourceChecksum}, got ${actualSourceChecksum}`,
				});
				continue;
			}

			const currentBytes = await fs.readFile(candidate.localPath);
			const expected = renderManagedBytes(
				sourceBytes,
				candidate.installPath,
				config,
				cwd,
				candidate.localPath
			);

			const matchesManagedBytes =
				computeChecksum(currentBytes) === candidate.recordedChecksum ||
				expected.some((bytes) => bytes.equals(currentBytes));

			if (!matchesManagedBytes) {
				results.push(
					candidate.basis === 'recorded'
						? {
								...base,
								status: 'blocked',
								reason:
									`this file is no longer part of any Greater component, but its ` +
									`contents differ from the bytes Greater installed at ${oldRef}, ` +
									`so it was preserved. Review the local changes and delete ` +
									`${candidate.localPath} yourself once they are no longer needed, ` +
									`then re-run the update. (--force does not delete modified files.)`,
							}
						: {
								...base,
								status: 'retained',
								reason:
									`left untouched: Greater cannot prove it installed this file at ` +
									`${oldRef} (no ownership record) and the contents do not match ` +
									`its copy of ${candidate.sourcePath}`,
							}
				);
				continue;
			}

			if (!dryRun) {
				await fs.remove(candidate.localPath);
			}
			results.push({ ...base, status: 'pruned' });
		} catch (error) {
			results.push({
				...base,
				status: 'error',
				reason: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return results;
}

/** Whether any prune outcome should fail the update. */
export function pruneHasFailures(results: PruneResult[]): boolean {
	return results.some((r) => r.status === 'blocked' || r.status === 'error');
}
