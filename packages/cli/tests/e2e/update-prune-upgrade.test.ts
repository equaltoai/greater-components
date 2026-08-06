/**
 * End-to-end upgrade fixture for issue #1000.
 *
 * A consumer pinned at `greater-v0.13.0` with `social-timeline` installed runs
 * `greater update` against the registry shape this branch introduces, in which
 * `lib/lib/lesserTimelineStore.{ts,svelte.ts}` are no longer part of the entry.
 * The required virtualized-timeline files must survive; the two obsolete root
 * store files must be removed.
 *
 * The two refs are served by a stubbed git layer:
 *
 * - the prior ref's `registry/index.json` checksums are vendored verbatim from
 *   the `greater-v0.13.0` tag (`fixtures/upgrade-greater-v0.13.0/`), so the
 *   integrity check the pruner performs on the prior-ref source bytes is a real
 *   check against the released hashes rather than against itself;
 * - the target ref's checksums are computed from the working tree, which is what
 *   `registry/index.json` regeneration produces for the same sources;
 * - file bytes come from the real `packages/faces/social/src/**` tree, which is
 *   byte-identical at both refs (asserted below, so the fixture cannot drift
 *   silently).
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

const priorChecksums: Record<string, string> = JSON.parse(
	fs.readFileSync(
		path.join(__dirname, '../fixtures/upgrade-greater-v0.13.0/social-face-checksums.json'),
		'utf-8'
	)
).checksums;

function listSocialSources(): string[] {
	const root = path.join(REPO_ROOT!, SOCIAL_SRC);
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

function makeIndex(ref: string, checksums: Record<string, string>): RegistryIndex {
	return {
		schemaVersion: '1.0.0',
		version: ref === OLD_REF ? '0.13.0' : '0.14.0',
		ref,
		generatedAt: new Date(0).toISOString(),
		checksums,
		components: {},
		faces: {},
		shared: {},
	};
}

const targetChecksums: Record<string, string> = Object.fromEntries(
	listSocialSources().map((rel) => [
		rel,
		computeChecksum(fs.readFileSync(path.join(REPO_ROOT!, rel))),
	])
);

const INDEXES: Record<string, RegistryIndex> = {
	[OLD_REF]: makeIndex(OLD_REF, priorChecksums),
	[NEW_REF]: makeIndex(NEW_REF, targetChecksums),
};

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

vi.mock('prompts', () => ({ default: vi.fn().mockResolvedValue({ confirm: true }) }));

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
			installed: [
				{
					name: 'social-timeline',
					version: OLD_REF,
					installedAt: new Date(0).toISOString(),
					modified: false,
					checksums: [],
				},
			],
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
		vi.resetModules();
	});

	/** Reproduce the v0.13.0 install: every file the entry owned, as the CLI wrote it. */
	async function installAtV0_13_0(): Promise<Map<string, string>> {
		const written = new Map<string, string>();
		for (const installPath of V0_13_0_FILES) {
			const sourcePath = sourceFor(installPath);
			const localPath = getInstalledFilePath(installPath, config, cwd);
			const content = fs.readFileSync(path.join(REPO_ROOT!, sourcePath), 'utf-8');
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
		return updateAction(['social-timeline'], { ref: NEW_REF, cwd, yes: true, ...options });
	}

	it('serves prior-ref bytes that match the released greater-v0.13.0 checksums', () => {
		// Tripwire: the fixture pins the *released* hashes while the bytes come from
		// the working tree. If a future change edits these sources, this fails here
		// with a clear cause instead of surfacing as an opaque integrity error.
		for (const installPath of V0_13_0_FILES) {
			const sourcePath = sourceFor(installPath);
			const expected = priorChecksums[sourcePath];
			expect(expected, `missing greater-v0.13.0 checksum for ${sourcePath}`).toBeDefined();
			expect(
				computeChecksum(fs.readFileSync(path.join(REPO_ROOT!, sourcePath))),
				`${sourcePath} differs from greater-v0.13.0; refresh fixtures/upgrade-greater-v0.13.0`
			).toBe(expected);
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
		expect(survivors).toHaveLength(V0_13_0_FILES.length - RETIRED_FILES.length);
	});

	it('advances components.json only after the writes and prunes both succeed', async () => {
		await installAtV0_13_0();

		await runUpdate();

		const written = await fs.readJson(path.join(cwd, 'components.json'));
		const entry = written.installed.find((c: { name: string }) => c.name === 'social-timeline') as {
			version: string;
			checksums: Array<{ path: string }>;
		};

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

	it('preserves a retired file the consumer edited, and leaves components.json truthful', async () => {
		const installed = await installAtV0_13_0();
		// Simulate a v0.14.0-era consumer: ownership is recorded, so the edit is
		// provably an edit to a Greater-managed file rather than an unrelated file.
		config = {
			...config,
			installed: config.installed.map((c) => ({
				...c,
				checksums: V0_13_0_FILES.map((installPath) => ({
					path: installPath,
					checksum: computeChecksum(fs.readFileSync(installed.get(installPath)!)),
				})),
			})),
		};
		await fs.outputJson(path.join(cwd, 'components.json'), config, { spaces: 2 });

		const edited = installed.get('lib/lib/lesserTimelineStore.ts')!;
		await fs.appendFile(edited, '\n// consumer edit\n');

		await expect(runUpdate()).rejects.toThrow('Process exit: 1');

		expect(await fs.pathExists(edited)).toBe(true);
		expect(await fs.readFile(edited, 'utf-8')).toContain('// consumer edit');

		const written = await fs.readJson(path.join(cwd, 'components.json'));
		const entry = written.installed.find((c: { name: string }) => c.name === 'social-timeline');
		// The component did not fully upgrade, so its recorded ref must not move.
		expect(entry.version).toBe(OLD_REF);
		expect(written.ref).toBe(OLD_REF);
	});
});
