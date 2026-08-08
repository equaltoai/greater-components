/**
 * End-to-end upgrade fixture for issue #1000.
 *
 * A consumer pinned at `greater-v0.13.0` with `social-timeline` and `messaging`
 * installed — the shape of the concrete Contentus checkout this change is
 * blocking — runs `greater update` against the registry shape this branch
 * introduces, in which `lib/lib/lesserTimelineStore.{ts,svelte.ts}` are no
 * longer part of the entry. The required virtualized-timeline files must
 * survive, the two obsolete root store files must be removed, and nothing in
 * the messaging module may be touched.
 *
 * `messaging` is here because it is the case ownership hydration has to get
 * right: the index owns `src/sanitize.ts` at both refs while the CLI's static
 * catalog does not list it, so an ownership pass that reads only
 * `newIndex.components` concludes the file has no owner and deletes a module
 * `Message.svelte` and `Conversations.svelte` still import.
 *
 * The two refs are served by a stubbed git layer:
 *
 * - the prior ref's `registry/index.json` checksums are vendored verbatim from
 *   the `greater-v0.13.0` tag (`fixtures/upgrade-greater-v0.13.0/`), so the
 *   integrity check the pruner performs on the prior-ref source bytes is a real
 *   check against the released hashes rather than against itself;
 * - the target ref's checksums are computed from the working tree, which is what
 *   `registry/index.json` regeneration produces for the same sources;
 * - file bytes come from the real `packages/faces/social/src/**` and
 *   `packages/shared/messaging/src/**` trees, which are byte-identical at both
 *   refs (asserted below, so the fixture cannot drift silently).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findLocalRepoRoot } from '../../src/utils/local-repo.js';
import { computeChecksum } from '../../src/utils/integrity.js';
import { componentConfigSchema, type ComponentConfig } from '../../src/utils/config.js';
import { getInstalledFilePath } from '../../src/utils/install-path.js';
import { transformImports } from '../../src/utils/transform.js';
import type { RegistryIndex } from '../../src/utils/registry-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = findLocalRepoRoot(__dirname);
if (!REPO_ROOT) throw new Error('could not locate the greater-components repo root');

/** The commit `greater-v0.13.0` points at — what `components.json` records. */
const OLD_REF = 'ce8f3d9dd4080eb6886e1dd1cb444d65712eca36';
/** Stand-in immutable SHA for the release that carries this branch's registry. */
const NEW_REF = 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4';

const SOCIAL_SRC = 'packages/faces/social/src/';
const MESSAGING_SRC = 'packages/shared/messaging/src/';
const PRIOR_SOURCE_ROOT = path.join(__dirname, '../fixtures/upgrade-greater-v0.13.0/prior-source');

/**
 * Read released bytes when a source changed after v0.13.0, otherwise use the
 * still-identical working-tree copy. Adding an override is mandatory whenever
 * the checksum tripwire below detects a newly changed fixture source.
 */
function readPriorSource(sourcePath: string): Buffer {
	const overridePath = path.join(PRIOR_SOURCE_ROOT, sourcePath);
	return fs.existsSync(overridePath)
		? fs.readFileSync(overridePath)
		: fs.readFileSync(path.join(REPO_ROOT!, sourcePath));
}

/** The file set `social-timeline` shipped at greater-v0.13.0. */
const V0_13_0_FILES = [
	'lib/components/TimelineVirtualized.svelte',
	'lib/components/TimelineVirtualizedReactive.svelte',
	'lib/lib/graphqlTimelineStore.ts',
	'lib/lib/graphqlTimelineStore.svelte.ts',
	'lib/lib/integration.ts',
	'lib/lib/integration.svelte.ts',
	'lib/lib/lesserTimelineStore.ts',
	'lib/lib/lesserTimelineStore.svelte.ts',
	'lib/lib/notificationStore.ts',
	'lib/lib/notificationStore.svelte.ts',
	'lib/lib/timelineStore.ts',
	'lib/lib/timelineStore.svelte.ts',
	'lib/lib/transport.ts',
	'lib/utils/notificationGrouping.ts',
];

const RETIRED_FILES = ['lib/lib/lesserTimelineStore.ts', 'lib/lib/lesserTimelineStore.svelte.ts'];
const REQUIRED_TIMELINE_FILES = [
	'lib/components/TimelineVirtualized.svelte',
	'lib/components/TimelineVirtualizedReactive.svelte',
];

/**
 * The `messaging` file set as the *index* owned it at greater-v0.13.0 — which is
 * what `greater add` installed, because dependency resolution hydrates an
 * entry's file list from the index. `shared/messaging/sanitize.ts` is in this
 * list and absent from the CLI's static catalog, which is the whole point.
 */
const MESSAGING_INSTALL_PATHS = [
	'shared/messaging/Composer.svelte',
	'shared/messaging/ConversationPicker.svelte',
	'shared/messaging/ConversationWorkflowSummary.svelte',
	'shared/messaging/Conversations.svelte',
	'shared/messaging/MediaUpload.svelte',
	'shared/messaging/Message.svelte',
	'shared/messaging/NewConversation.svelte',
	'shared/messaging/Root.svelte',
	'shared/messaging/Thread.svelte',
	'shared/messaging/UnreadIndicator.svelte',
	'shared/messaging/WorkflowThreadMoment.svelte',
	'shared/messaging/context.svelte.ts',
	'shared/messaging/index.ts',
	'shared/messaging/sanitize.ts',
	'shared/messaging/types.ts',
	'shared/messaging/utils.ts',
];

const SANITIZE_INSTALL_PATH = 'shared/messaging/sanitize.ts';
/** The two surviving components whose imports the sanitizer has to satisfy. */
const SANITIZE_IMPORTERS = [
	'shared/messaging/Message.svelte',
	'shared/messaging/Conversations.svelte',
];

function readFixtureChecksums(name: string): Record<string, string> {
	return JSON.parse(
		fs.readFileSync(path.join(__dirname, `../fixtures/upgrade-greater-v0.13.0/${name}`), 'utf-8')
	).checksums;
}

const priorChecksums: Record<string, string> = {
	...readFixtureChecksums('social-face-checksums.json'),
	...readFixtureChecksums('shared-messaging-checksums.json'),
};

function listSources(prefix: string): string[] {
	const root = path.join(REPO_ROOT!, prefix);
	const out: string[] = [];
	const walk = (dir: string) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else out.push(path.relative(REPO_ROOT!, full).split(path.sep).join('/'));
		}
	};
	walk(root);
	return out;
}

/**
 * The index's `shared.messaging` entry at a ref: every messaging source it
 * carries, in the `src/…`-relative form the real index records.
 */
function messagingIndexEntry(checksums: Record<string, string>) {
	const files = Object.keys(checksums)
		.filter((key) => key.startsWith(MESSAGING_SRC))
		.sort()
		.map((key) => ({ path: `src/${key.slice(MESSAGING_SRC.length)}`, checksum: checksums[key]! }));

	return {
		name: 'messaging',
		version: '1.0.0',
		exports: [],
		files,
		dependencies: [],
		peerDependencies: [],
		types: [],
	};
}

function makeIndex(ref: string, checksums: Record<string, string>): RegistryIndex {
	return {
		schemaVersion: '1.0.0',
		version: ref === OLD_REF ? '0.13.0' : '0.14.0',
		ref,
		generatedAt: new Date(0).toISOString(),
		checksums,
		components: {},
		faces: {},
		shared: { messaging: messagingIndexEntry(checksums) },
	};
}

const targetChecksums: Record<string, string> = Object.fromEntries(
	[...listSources(SOCIAL_SRC), ...listSources(MESSAGING_SRC)].map((rel) => [
		rel,
		computeChecksum(fs.readFileSync(path.join(REPO_ROOT!, rel))),
	])
);

const INDEXES: Record<string, RegistryIndex> = {
	[OLD_REF]: makeIndex(OLD_REF, priorChecksums),
	[NEW_REF]: makeIndex(NEW_REF, targetChecksums),
};

/** Set by a test to make the prior ref's index unfetchable for that run. */
let oldIndexUnavailable = false;

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn(),
		fail: vi.fn(),
		warn: vi.fn(),
		stop: vi.fn(),
		text: '',
	})),
}));

/**
 * Answers the run confirmation, and — when a test sets it — the per-file
 * conflict prompt. `undefined` leaves conflict handling on its default path.
 */
let conflictResolution: string | undefined;

vi.mock('prompts', () => ({
	default: vi.fn(async (question: { name?: string }) => {
		if (question?.name === 'resolution') return { resolution: conflictResolution ?? 'keep' };
		return { confirm: true };
	}),
}));

vi.mock('../../src/utils/git-fetch.js', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../src/utils/git-fetch.js')>();
	const nodeFs = await import('node:fs');
	const nodePath = await import('node:path');
	return {
		...actual,
		resolveGitRefToCommit: vi.fn(async (ref: string) => ref),
		fetchFromGitTag: vi.fn(async (ref: string, filePath: string) => {
			if (filePath === 'registry/index.json') {
				const index = INDEXES[ref];
				if (!index) throw new actual.NetworkError(`no fixture index for ref ${ref}`, 404);
				return Buffer.from(JSON.stringify(index), 'utf-8');
			}
			if (oldIndexUnavailable && ref === OLD_REF) {
				throw new actual.NetworkError(`simulated outage for ref ${ref}`, 503);
			}
			if (ref === OLD_REF) {
				return readPriorSource(filePath);
			}
			const onDisk = nodePath.join(REPO_ROOT!, filePath);
			if (!nodeFs.existsSync(onDisk)) {
				throw new actual.NetworkError(`File not found: ${filePath} at ref ${ref}`, 404);
			}
			return nodeFs.readFileSync(onDisk);
		}),
	};
});

vi.mock('../../src/utils/registry-index.js', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../src/utils/registry-index.js')>();
	return {
		...actual,
		// Bypass the on-disk index cache: this fixture serves two refs whose
		// contents are synthesised per run.
		fetchRegistryIndex: vi.fn(async (ref: string) => {
			if (oldIndexUnavailable && ref === OLD_REF) {
				throw new Error(`simulated outage fetching the index for ref ${ref}`);
			}
			const index = INDEXES[ref];
			if (!index) throw new Error(`no fixture index for ref ${ref}`);
			return index;
		}),
	};
});

class ProcessExitError extends Error {
	constructor(public code: number) {
		super(`Process exit: ${code}`);
	}
}

describe('greater update: greater-v0.13.0 → retired-store registry shape', () => {
	let cwd: string;
	let config: ComponentConfig;
	let exitSpy: ReturnType<typeof vi.spyOn>;
	let savedLocalRepoRoot: string | undefined;

	beforeEach(async () => {
		savedLocalRepoRoot = process.env['GREATER_CLI_LOCAL_REPO_ROOT'];
		// Local-repo mode reads the working tree for *every* ref, which would make
		// the two refs indistinguishable.
		delete process.env['GREATER_CLI_LOCAL_REPO_ROOT'];

		cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'greater-upgrade-'));
		await fs.outputJson(path.join(cwd, 'package.json'), {
			name: 'consumer',
			dependencies: { svelte: '^5.0.0' },
		});

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
			installed: ['social-timeline', 'messaging'].map((name) => ({
				name,
				version: OLD_REF,
				installedAt: new Date(0).toISOString(),
				modified: false,
				checksums: [],
			})),
		});

		exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code: number) => {
			throw new ProcessExitError(code ?? 0);
		}) as never);
	});

	afterEach(async () => {
		exitSpy.mockRestore();
		await fs.remove(cwd);
		if (savedLocalRepoRoot === undefined) delete process.env['GREATER_CLI_LOCAL_REPO_ROOT'];
		else process.env['GREATER_CLI_LOCAL_REPO_ROOT'] = savedLocalRepoRoot;
		oldIndexUnavailable = false;
		conflictResolution = undefined;
		vi.resetModules();
	});

	/** Reproduce the v0.13.0 install: every file the entries owned, as the CLI wrote it. */
	async function installAtV0_13_0(): Promise<Map<string, string>> {
		const written = new Map<string, string>();
		for (const installPath of [...V0_13_0_FILES, ...MESSAGING_INSTALL_PATHS]) {
			const sourcePath = sourceFor(installPath);
			const localPath = getInstalledFilePath(installPath, config, cwd);
			const content = readPriorSource(sourcePath).toString('utf-8');
			const rendered = transformImports(content, config, installPath, {
				sourceFilePath: localPath,
				consumerRoot: cwd,
			}).content;
			await fs.outputFile(localPath, rendered);
			written.set(installPath, localPath);
		}
		await fs.outputJson(path.join(cwd, 'components.json'), config, { spaces: 2 });
		return written;
	}

	function sourceFor(installPath: string): string {
		if (installPath.startsWith('shared/messaging/')) {
			return `${MESSAGING_SRC}${installPath.slice('shared/messaging/'.length)}`;
		}
		if (installPath.startsWith('lib/lib/')) {
			return `${SOCIAL_SRC}lib/${installPath.slice('lib/lib/'.length)}`;
		}
		if (installPath.startsWith('lib/components/')) {
			return `${SOCIAL_SRC}components/${installPath.slice('lib/components/'.length)}`;
		}
		if (installPath.startsWith('lib/utils/')) {
			return `${SOCIAL_SRC}utils/${installPath.slice('lib/utils/'.length)}`;
		}
		throw new Error(`unmapped install path ${installPath}`);
	}

	async function runUpdate(options: Record<string, unknown> = {}) {
		const { updateAction } = await import('../../src/commands/update.js');
		return updateAction(['social-timeline', 'messaging'], {
			ref: NEW_REF,
			cwd,
			yes: true,
			...options,
		});
	}

	function readConfigFile(): {
		ref: string;
		installed: Array<{ name: string; version: string; checksums: Array<{ path: string }> }>;
	} {
		return fs.readJsonSync(path.join(cwd, 'components.json'));
	}

	it('serves prior-ref fixture bytes that match the released greater-v0.13.0 checksums', () => {
		// Tripwire: unchanged files may still come from the working tree, while
		// post-release edits must add a prior-source override with the released bytes.
		for (const installPath of [...V0_13_0_FILES, ...MESSAGING_INSTALL_PATHS]) {
			const sourcePath = sourceFor(installPath);
			const expected = priorChecksums[sourcePath];
			expect(expected, `missing greater-v0.13.0 checksum for ${sourcePath}`).toBeDefined();
			expect(
				computeChecksum(readPriorSource(sourcePath)),
				`${sourcePath} differs from greater-v0.13.0; add its released bytes under fixtures/upgrade-greater-v0.13.0/prior-source`
			).toBe(expected);
		}
	});

	it('keeps the messaging sanitizer the index owns and the static catalog omits', async () => {
		// The high finding on PR #1001: ownership hydrated only `newIndex.components`,
		// so `shared/messaging/sanitize.ts` — owned by `newIndex.shared.messaging` at
		// both refs, absent from the CLI's static `messaging.files` — was read as
		// unowned and deleted, and the surviving importers stopped resolving.
		const installed = await installAtV0_13_0();

		await runUpdate();

		const sanitizePath = installed.get(SANITIZE_INSTALL_PATH)!;
		expect(await fs.pathExists(sanitizePath), 'the messaging sanitizer must survive').toBe(true);

		for (const installPath of MESSAGING_INSTALL_PATHS) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} is still owned and must survive`
			).toBe(true);
		}

		// The importers' specifier must still resolve on disk — the exact link that
		// failed with ERR_MODULE_NOT_FOUND in the reported Contentus upgrade.
		for (const importer of SANITIZE_IMPORTERS) {
			const importerPath = installed.get(importer)!;
			const body = await fs.readFile(importerPath, 'utf-8');
			expect(body, `${importer} should import the sanitizer`).toContain("from './sanitize.js'");
			expect(path.resolve(path.dirname(importerPath), 'sanitize.ts')).toBe(sanitizePath);
		}
	});

	it('keeps the virtualized timeline files and prunes only the two obsolete root stores', async () => {
		const installed = await installAtV0_13_0();

		await runUpdate();

		for (const installPath of REQUIRED_TIMELINE_FILES) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} must survive the upgrade`
			).toBe(true);
		}

		for (const installPath of V0_13_0_FILES.filter((f) => !RETIRED_FILES.includes(f))) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} is still owned and must survive`
			).toBe(true);
		}

		for (const installPath of RETIRED_FILES) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} must be pruned`
			).toBe(false);
		}

		// Exactly two files removed — nothing else in the consumer tree was touched.
		const survivors = [...installed.values()].filter((p) => fs.existsSync(p));
		expect(survivors).toHaveLength(
			V0_13_0_FILES.length + MESSAGING_INSTALL_PATHS.length - RETIRED_FILES.length
		);
	});

	it('advances components.json only after the writes and prunes both succeed', async () => {
		await installAtV0_13_0();

		await runUpdate();

		const written = readConfigFile();
		const entry = written.installed.find((c) => c.name === 'social-timeline')!;

		expect(entry.version).toBe(NEW_REF);
		expect(written.ref).toBe(NEW_REF);

		// The ownership record is now populated, so the next update has proven
		// ownership rather than index-inferred ownership.
		const recorded = entry.checksums.map((c) => c.path).sort();
		expect(recorded).toEqual(V0_13_0_FILES.filter((f) => !RETIRED_FILES.includes(f)).sort());
	});

	it('dry run reports the prune but changes neither files nor components.json', async () => {
		const installed = await installAtV0_13_0();
		const before = await fs.readJson(path.join(cwd, 'components.json'));

		await runUpdate({ dryRun: true });

		for (const installPath of V0_13_0_FILES) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} must be untouched by a dry run`
			).toBe(true);
		}
		expect(await fs.readJson(path.join(cwd, 'components.json'))).toEqual(before);
	});

	/** Give `social-timeline` the ownership record a v0.14.0-era consumer would have. */
	async function recordSocialOwnership(installed: Map<string, string>): Promise<void> {
		config = {
			...config,
			installed: config.installed.map((c) =>
				c.name === 'social-timeline'
					? {
							...c,
							checksums: V0_13_0_FILES.map((installPath) => ({
								path: installPath,
								checksum: computeChecksum(fs.readFileSync(installed.get(installPath)!)),
							})),
						}
					: c
			),
		};
		await fs.outputJson(path.join(cwd, 'components.json'), config, { spaces: 2 });
	}

	it('preserves a retired file the consumer edited, and leaves components.json truthful', async () => {
		const installed = await installAtV0_13_0();
		// Simulate a v0.14.0-era consumer: ownership is recorded, so the edit is
		// provably an edit to a Greater-managed file rather than an unrelated file.
		await recordSocialOwnership(installed);

		const edited = installed.get('lib/lib/lesserTimelineStore.ts')!;
		await fs.appendFile(edited, '\n// consumer edit\n');

		await expect(runUpdate()).rejects.toThrow('Process exit: 1');

		expect(await fs.pathExists(edited)).toBe(true);
		expect(await fs.readFile(edited, 'utf-8')).toContain('// consumer edit');

		const written = readConfigFile();
		const entry = written.installed.find((c) => c.name === 'social-timeline')!;
		// The component did not fully upgrade, so its recorded ref must not move.
		expect(entry.version).toBe(OLD_REF);
		expect(written.ref).toBe(OLD_REF);
	});

	it('preserves a retired file whose only claim to being managed is the recorded checksum', async () => {
		// `components.json` is project input. A record that names the bytes on disk
		// says nothing about who wrote them, so it cannot stand in for the
		// comparison against the checksum-verified prior source.
		const installed = await installAtV0_13_0();
		const retired = installed.get('lib/lib/lesserTimelineStore.ts')!;
		await fs.outputFile(retired, 'export const notGreaters = true;\n');

		config = {
			...config,
			installed: config.installed.map((c) =>
				c.name === 'social-timeline'
					? {
							...c,
							checksums: [
								{
									path: 'lib/lib/lesserTimelineStore.ts',
									checksum: computeChecksum(fs.readFileSync(retired)),
								},
							],
						}
					: c
			),
		};
		await fs.outputJson(path.join(cwd, 'components.json'), config, { spaces: 2 });

		await expect(runUpdate()).rejects.toThrow('Process exit: 1');

		expect(await fs.pathExists(retired), 'a recorded checksum must not authorize deletion').toBe(
			true
		);
		expect(await fs.readFile(retired, 'utf-8')).toBe('export const notGreaters = true;\n');
		expect(readConfigFile().ref).toBe(OLD_REF);
	});

	it('retries the prune after a prior-index failure instead of recording the target ref', async () => {
		// A planning skip that could resolve differently next run is unfinished work.
		// Recording the target ref would make the rerun see `oldRef === newRef` and
		// drop the prune permanently.
		const installed = await installAtV0_13_0();

		oldIndexUnavailable = true;
		await expect(runUpdate()).rejects.toThrow('Process exit: 1');

		for (const installPath of RETIRED_FILES) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} must survive a run that could not plan its prune`
			).toBe(true);
		}

		const afterOutage = readConfigFile();
		expect(afterOutage.ref).toBe(OLD_REF);
		expect(afterOutage.installed.find((c) => c.name === 'social-timeline')!.version).toBe(OLD_REF);

		// The prior ref is still recorded, so the next run plans the prune it missed.
		oldIndexUnavailable = false;
		await runUpdate();

		for (const installPath of RETIRED_FILES) {
			expect(
				await fs.pathExists(installed.get(installPath)!),
				`${installPath} must be pruned by the retry`
			).toBe(false);
		}
		expect(readConfigFile().ref).toBe(NEW_REF);
	});

	it('does not advance the top-level ref when the consumer skips a component', async () => {
		const installed = await installAtV0_13_0();
		await recordSocialOwnership(installed);

		// Force a conflict prompt for social-timeline and answer "skip this component".
		config = {
			...config,
			installed: config.installed.map((c) =>
				c.name === 'social-timeline' ? { ...c, modified: true } : c
			),
		};
		await fs.outputJson(path.join(cwd, 'components.json'), config, { spaces: 2 });
		await fs.appendFile(installed.get('lib/lib/timelineStore.ts')!, '\n// consumer edit\n');
		conflictResolution = 'skip';

		await runUpdate();

		const written = readConfigFile();
		// The skipped component is still at the prior ref, so the top-level ref —
		// which is what an argument-less rerun resolves against — must not claim the
		// target.
		expect(written.installed.find((c) => c.name === 'social-timeline')!.version).toBe(OLD_REF);
		expect(written.ref).toBe(OLD_REF);
	});
});
