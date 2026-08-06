/**
 * Obsolete managed-file pruning (issue #1000).
 *
 * These tests run against a real temp directory rather than the mock filesystem:
 * pruning turns on `realpath` / `lstat` / symlink behaviour that a map-backed
 * mock cannot express, and getting that wrong is the difference between deleting
 * a stale file and deleting whatever a symlink pointed at.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import type { ComponentMetadata } from '../src/registry/index.js';
import { componentConfigSchema, type ComponentConfig } from '../src/utils/config.js';
import { computeChecksum } from '../src/utils/integrity.js';
import {
	collectOwnedLocalPaths,
	evaluatePruneCandidates,
	isImmutablePriorRef,
	planComponentPrune,
	pruneHasFailures,
	renderManagedBytes,
	type PruneCandidate,
} from '../src/utils/prune.js';
import type { RegistryIndex } from '../src/utils/registry-index.js';

const OLD_REF = '0'.repeat(39) + '1';

/** `social-timeline` reduced to the files this suite reasons about. */
const SOCIAL_TIMELINE: ComponentMetadata = {
	name: 'social-timeline',
	type: 'shared',
	description: 'test double for the social-timeline entry',
	files: [
		{ path: 'lib/components/TimelineVirtualized.svelte', content: '', type: 'component' },
		{ path: 'lib/lib/timelineStore.ts', content: '', type: 'utils' },
	],
	dependencies: [],
	devDependencies: [],
	registryDependencies: [],
	tags: ['social'],
	version: '1.0.0',
	domain: 'social',
};

/** A second entry that still owns one of the social face's components. */
const SOCIAL_STATUS_CARD: ComponentMetadata = {
	...SOCIAL_TIMELINE,
	name: 'social-status-card',
	files: [{ path: 'lib/components/StatusCard.svelte', content: '', type: 'component' }],
};

const SOURCE_BYTES: Record<string, string> = {
	'packages/faces/social/src/components/TimelineVirtualized.svelte': '<div>timeline</div>\n',
	'packages/faces/social/src/components/StatusCard.svelte': '<div>status</div>\n',
	'packages/faces/social/src/lib/timelineStore.ts': 'export const timelineStore = 1;\n',
	'packages/faces/social/src/lib/lesserTimelineStore.ts':
		"export * from './lesserTimelineStore.svelte.js';\n",
	'packages/faces/social/src/lib/lesserTimelineStore.svelte.ts': 'export class LesserStore {}\n',
};

function makeIndex(sourcePaths: string[], ref: string): RegistryIndex {
	const checksums: Record<string, string> = {};
	for (const sourcePath of sourcePaths) {
		const body = SOURCE_BYTES[sourcePath];
		if (body === undefined) throw new Error(`no fixture bytes for ${sourcePath}`);
		checksums[sourcePath] = computeChecksum(Buffer.from(body, 'utf-8'));
	}

	return {
		schemaVersion: '1.0.0',
		version: '0.0.0',
		ref,
		generatedAt: new Date(0).toISOString(),
		checksums,
		components: {},
		faces: {},
		shared: {},
	};
}

/** Every source path that exists at the old ref, including the two retired stores. */
const OLD_INDEX = makeIndex(Object.keys(SOURCE_BYTES), OLD_REF);
/** The target ref: same sources on disk, but the stores are no longer owned. */
const NEW_INDEX = makeIndex(Object.keys(SOURCE_BYTES), 'greater-v9.9.9');

async function fetchSource(_ref: string, sourcePath: string): Promise<Buffer> {
	const body = SOURCE_BYTES[sourcePath];
	if (body === undefined) throw new Error(`unexpected fetch for ${sourcePath}`);
	return Buffer.from(body, 'utf-8');
}

describe('prune (issue #1000)', () => {
	let cwd: string;
	let config: ComponentConfig;

	beforeEach(async () => {
		cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'greater-prune-'));
		config = componentConfigSchema.parse({
			version: '1.0.0',
			ref: OLD_REF,
			aliases: {
				components: '$lib/components',
				utils: '$lib/utils',
				ui: '$lib/components/ui',
				lib: '$lib',
				hooks: '$lib/primitives',
				greater: '$lib/greater',
			},
		});
	});

	afterEach(async () => {
		await fs.remove(cwd);
	});

	/** Write a file exactly as the CLI would have written it at the old ref. */
	async function installManaged(installPath: string, sourcePath: string): Promise<string> {
		const localPath = path.join(cwd, 'src/lib', installPath.replace(/^lib\/(lib\/)?/, ''));
		const [managed] = renderManagedBytes(
			Buffer.from(SOURCE_BYTES[sourcePath]!, 'utf-8'),
			installPath,
			config,
			cwd,
			localPath
		);
		await fs.outputFile(localPath, managed!);
		return localPath;
	}

	describe('isImmutablePriorRef', () => {
		it('accepts commit SHAs and release tags only', () => {
			expect(isImmutablePriorRef('ce8f3d9dd4080eb6886e1dd1cb444d65712eca36')).toBe(true);
			expect(isImmutablePriorRef('greater-v0.13.0')).toBe(true);
			expect(isImmutablePriorRef('greater-v0.13.0-rc.1')).toBe(true);

			// Legacy `components.json` entries and mutable refs must never drive a delete.
			expect(isImmutablePriorRef('1.0.0')).toBe(false);
			expect(isImmutablePriorRef('main')).toBe(false);
			expect(isImmutablePriorRef('staging')).toBe(false);
			expect(isImmutablePriorRef('latest')).toBe(false);
			expect(isImmutablePriorRef(undefined)).toBe(false);
			// A short SHA is not immutable enough to pin an index fetch.
			expect(isImmutablePriorRef('ce8f3d9')).toBe(false);
		});
	});

	describe('ownership derivation', () => {
		it('proposes exactly the paths the entry retired, from the two immutable indexes', () => {
			const plan = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE, SOCIAL_STATUS_CARD],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
			});

			expect(plan.basis).toBe('inferred');
			expect(plan.candidates.map((c) => c.installPath)).toEqual([
				'lib/lib/lesserTimelineStore.svelte.ts',
				'lib/lib/lesserTimelineStore.ts',
			]);
			expect(plan.candidates.map((c) => c.sourcePath)).toEqual([
				'packages/faces/social/src/lib/lesserTimelineStore.svelte.ts',
				'packages/faces/social/src/lib/lesserTimelineStore.ts',
			]);
		});

		it('preserves a path another registry entry still owns at the target ref', () => {
			// StatusCard sits in the same source directory and is absent from
			// social-timeline's own file list, so only `social-status-card` keeps it
			// out of the candidate set.
			const withSibling = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE, SOCIAL_STATUS_CARD],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
			});
			expect(withSibling.candidates.map((c) => c.installPath)).not.toContain(
				'lib/components/StatusCard.svelte'
			);

			const withoutSibling = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
			});
			expect(withoutSibling.candidates.map((c) => c.installPath)).toContain(
				'lib/components/StatusCard.svelte'
			);
		});

		it('uses the recorded ownership record when components.json has one', () => {
			const plan = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE, SOCIAL_STATUS_CARD],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
				recorded: [
					{ path: 'lib/lib/timelineStore.ts', checksum: 'sha256-kept' },
					{ path: 'lib/lib/lesserTimelineStore.ts', checksum: 'sha256-retired' },
				],
			});

			expect(plan.basis).toBe('recorded');
			// `timelineStore.ts` is still owned at the target ref, so only the
			// retired path is a candidate — and no neighbour is swept in.
			expect(plan.candidates.map((c) => c.installPath)).toEqual(['lib/lib/lesserTimelineStore.ts']);
			expect(plan.candidates[0]?.recordedChecksum).toBe('sha256-retired');
		});

		it('never proposes a path that maps outside its configured install root', () => {
			const owned = collectOwnedLocalPaths([SOCIAL_TIMELINE], NEW_INDEX, config, cwd);
			for (const localPath of owned) {
				expect(localPath.startsWith(cwd + path.sep)).toBe(true);
			}

			const escaping: ComponentMetadata = {
				...SOCIAL_TIMELINE,
				files: [{ path: 'lib/lib/../../../../etc/passwd', content: '', type: 'utils' }],
			};
			// A traversing install path is dropped rather than resolved.
			expect(collectOwnedLocalPaths([escaping], NEW_INDEX, config, cwd).size).toBe(0);
		});
	});

	describe('evaluation', () => {
		async function planAndEvaluate(dryRun = false) {
			const plan = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE, SOCIAL_STATUS_CARD],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
			});
			return evaluatePruneCandidates({
				candidates: plan.candidates,
				config,
				cwd,
				oldRef: OLD_REF,
				fetchSource,
				dryRun,
			});
		}

		it('deletes an unmodified obsolete managed file', async () => {
			const localPath = await installManaged(
				'lib/lib/lesserTimelineStore.ts',
				'packages/faces/social/src/lib/lesserTimelineStore.ts'
			);

			const results = await planAndEvaluate();

			expect(results.find((r) => r.localPath === localPath)?.status).toBe('pruned');
			expect(await fs.pathExists(localPath)).toBe(false);
			expect(pruneHasFailures(results)).toBe(false);
		});

		it('reports but does not delete in a dry run', async () => {
			const localPath = await installManaged(
				'lib/lib/lesserTimelineStore.ts',
				'packages/faces/social/src/lib/lesserTimelineStore.ts'
			);

			const results = await planAndEvaluate(true);

			expect(results.find((r) => r.localPath === localPath)?.status).toBe('pruned');
			expect(await fs.pathExists(localPath)).toBe(true);
		});

		it('reports files that were already removed as absent, not as failures', async () => {
			const results = await planAndEvaluate();

			expect(results).toHaveLength(2);
			expect(results.every((r) => r.status === 'absent')).toBe(true);
			expect(pruneHasFailures(results)).toBe(false);
		});

		it('preserves and fails on a locally modified file when ownership is proven', async () => {
			const localPath = await installManaged(
				'lib/lib/lesserTimelineStore.ts',
				'packages/faces/social/src/lib/lesserTimelineStore.ts'
			);
			await fs.appendFile(localPath, '\n// local edit\n');

			const candidate: PruneCandidate = {
				installPath: 'lib/lib/lesserTimelineStore.ts',
				sourcePath: 'packages/faces/social/src/lib/lesserTimelineStore.ts',
				sourceChecksum:
					OLD_INDEX.checksums['packages/faces/social/src/lib/lesserTimelineStore.ts']!,
				localPath,
				recordedChecksum: 'sha256-whatever-was-installed',
				basis: 'recorded',
			};

			const results = await evaluatePruneCandidates({
				candidates: [candidate],
				config,
				cwd,
				oldRef: OLD_REF,
				fetchSource,
				dryRun: false,
			});

			expect(results[0]?.status).toBe('blocked');
			expect(results[0]?.reason).toContain(localPath);
			expect(results[0]?.reason).toContain('--force does not delete modified files');
			expect(await fs.pathExists(localPath)).toBe(true);
			expect(pruneHasFailures(results)).toBe(true);
		});

		it('leaves an unproven non-matching file alone without failing the update', async () => {
			// A consumer's own file that happens to sit at a retired path.
			const localPath = path.join(cwd, 'src/lib/lesserTimelineStore.ts');
			await fs.outputFile(localPath, 'export const mine = true;\n');

			const results = await planAndEvaluate();
			const result = results.find((r) => r.localPath === localPath);

			expect(result?.status).toBe('retained');
			expect(await fs.pathExists(localPath)).toBe(true);
			expect(pruneHasFailures(results)).toBe(false);
		});

		it('fails rather than deleting when the prior ref source fails its integrity check', async () => {
			const localPath = await installManaged(
				'lib/lib/lesserTimelineStore.ts',
				'packages/faces/social/src/lib/lesserTimelineStore.ts'
			);

			const plan = planComponentPrune({
				component: SOCIAL_TIMELINE,
				allEntries: [SOCIAL_TIMELINE, SOCIAL_STATUS_CARD],
				config,
				cwd,
				oldIndex: OLD_INDEX,
				newIndex: NEW_INDEX,
			});

			const results = await evaluatePruneCandidates({
				candidates: plan.candidates,
				config,
				cwd,
				oldRef: OLD_REF,
				fetchSource: async () => Buffer.from('tampered\n', 'utf-8'),
				dryRun: false,
			});

			expect(results.find((r) => r.localPath === localPath)?.status).toBe('error');
			expect(await fs.pathExists(localPath)).toBe(true);
			expect(pruneHasFailures(results)).toBe(true);
		});

		it('refuses to prune through a symlink', async () => {
			const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'greater-prune-outside-'));
			const secret = path.join(outsideDir, 'secret.ts');
			await fs.outputFile(
				secret,
				SOURCE_BYTES['packages/faces/social/src/lib/lesserTimelineStore.ts']!
			);

			const localPath = path.join(cwd, 'src/lib/lesserTimelineStore.ts');
			await fs.ensureDir(path.dirname(localPath));
			await fs.symlink(secret, localPath);

			try {
				const results = await planAndEvaluate();
				const result = results.find((r) => r.localPath === localPath);

				expect(result?.status).toBe('error');
				expect(result?.reason).toContain('symlink');
				expect(await fs.pathExists(secret)).toBe(true);
			} finally {
				await fs.remove(outsideDir);
			}
		});

		it('refuses to prune a path whose real parent escapes the install root', async () => {
			const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'greater-prune-escape-'));
			await fs.outputFile(
				path.join(outsideDir, 'StatusCard.svelte'),
				SOURCE_BYTES['packages/faces/social/src/components/StatusCard.svelte']!
			);

			// A directory *inside* the install root is a symlink out of the project.
			// Lexical containment (what `writeFile` checks) is satisfied; only
			// resolving the link catches it.
			await fs.ensureDir(path.join(cwd, 'src/lib'));
			await fs.symlink(outsideDir, path.join(cwd, 'src/lib/components'));

			try {
				// Drop the sibling entry so StatusCard.svelte becomes a candidate.
				const plan = planComponentPrune({
					component: SOCIAL_TIMELINE,
					allEntries: [SOCIAL_TIMELINE],
					config,
					cwd,
					oldIndex: OLD_INDEX,
					newIndex: NEW_INDEX,
				});
				const results = await evaluatePruneCandidates({
					candidates: plan.candidates,
					config,
					cwd,
					oldRef: OLD_REF,
					fetchSource,
					dryRun: false,
				});
				const result = results.find((r) => r.installPath === 'lib/components/StatusCard.svelte');

				expect(result?.status).toBe('error');
				expect(result?.reason).toContain('resolves outside');
				expect(await fs.pathExists(path.join(outsideDir, 'StatusCard.svelte'))).toBe(true);
			} finally {
				await fs.remove(path.join(cwd, 'src/lib/components'));
				await fs.remove(outsideDir);
			}
		});
	});
});
