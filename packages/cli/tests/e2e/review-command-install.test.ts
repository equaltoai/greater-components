/**
 * E2E: `greater add review` — the real command path.
 *
 * `vendored-blog-install.test.ts` reconstructs the install from the catalog with
 * a test-local helper. That pins down the transform and install-layout maths,
 * but it never runs the command a consumer actually runs, so a regression in
 * `add`'s dependency resolution, fetch, or write ordering would not surface
 * there.
 *
 * This test drives the built CLI binary the way `smoke.test.ts` does — real
 * `greater init`, then real `greater add review` — against a scratch SvelteKit
 * project, and then checks the three things the F3 regression broke:
 *
 *   1. `add review` resolves and installs the dependency closure (`review` plus
 *      `blog-types`, which carries the types the Review modules import),
 *   2. every vendored Review module imports `../../blog-types.js` rather than
 *      the source tree's `../../types.js`, and
 *   3. the installed tree type-checks in its installed layout.
 *
 * Hermetic: the CLI resolves everything from this checkout via
 * `GREATER_CLI_LOCAL_REPO_ROOT`, so nothing is fetched over the network, and
 * `svelte` is already declared in the fixture's package.json so `add` has no
 * missing npm dependency to install. The scratch project lives under
 * `tests/.tmp` (gitignored) so workspace `node_modules` resolve by walking up,
 * matching `smoke.test.ts`, and is removed in a `finally`.
 */

import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { componentRegistry } from '../../src/registry/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(__dirname, '../../');
const CLI_BIN = path.join(CLI_ROOT, 'dist/index.js');
const FIXTURE_TEMPLATE_ROOT = path.resolve(__dirname, '../fixtures/cli-fixture');
const TMP_ROOT = path.resolve(__dirname, '../.tmp');
const REPO_ROOT = path.resolve(CLI_ROOT, '../../');
const TSC_BIN = path.join(REPO_ROOT, 'node_modules/.bin/tsc');
const SVELTE_KIT_BIN = path.join(CLI_ROOT, 'node_modules/.bin/svelte-kit');
const VITE_BIN = path.join(CLI_ROOT, 'node_modules/.bin/vite');

/** Runs the CLI against this checkout instead of the network. */
const CLI_ENV = { ...process.env, GREATER_CLI_LOCAL_REPO_ROOT: REPO_ROOT };

/**
 * Third-party packages the vendored core pulls in. The fixture installs nothing,
 * so link them from the workspace exactly as `smoke.test.ts` does — otherwise
 * `tsc` reports unresolved bare specifiers that have nothing to do with the
 * install layout under test.
 */
const WORKSPACE_LINKS = [
	['packages/content/node_modules', 'hast-util-sanitize'],
	['packages/content/node_modules', 'rehype-sanitize'],
	['packages/content/node_modules', 'rehype-stringify'],
	['packages/content/node_modules', 'remark-gfm'],
	['packages/content/node_modules', 'remark-parse'],
	['packages/content/node_modules', 'remark-rehype'],
	['packages/content/node_modules', 'shiki'],
	['packages/content/node_modules', 'unified'],
	['packages/headless/node_modules', 'focus-trap'],
	['packages/headless/node_modules', 'tabbable'],
] as const;

/**
 * The Review modules that import the blog types. `index.ts` is the fifth
 * catalog file and only re-exports, so it has no type import to rewrite.
 */
const REVIEW_TYPE_IMPORTERS = [
	'QueueCard.svelte',
	'AttributionStrip.svelte',
	'VerdictActions.svelte',
	'state.ts',
] as const;

beforeAll(async () => {
	// This test executes dist/index.js, so always compile the source under test.
	await execa('pnpm', ['build'], { cwd: CLI_ROOT });
}, 300_000);

/** Copies the fixture template, dropping the generated state `init` recreates. */
async function createScratchProject(): Promise<string> {
	await fs.ensureDir(TMP_ROOT);
	const root = await fs.mkdtemp(path.join(TMP_ROOT, 'review-command-'));

	await fs.copy(FIXTURE_TEMPLATE_ROOT, root, {
		filter: (src) => {
			const relative = path.relative(FIXTURE_TEMPLATE_ROOT, src);
			if (!relative || relative === '.') return true;

			const normalized = relative.replace(/\\/g, '/');
			return ![
				'.svelte-kit',
				'node_modules',
				'.vite',
				'build',
				'dist',
				'components.json',
				'src/lib',
				'src/greater',
				'styles',
				'pnpm-lock.yaml',
				'package-lock.json',
				'yarn.lock',
			].some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
		},
	});

	return root;
}

async function linkWorkspaceDependencies(root: string): Promise<void> {
	for (const [fromDir, packageName] of WORKSPACE_LINKS) {
		const target = path.join(root, 'node_modules', packageName);
		if (await fs.pathExists(target)) continue;

		const source = path.join(REPO_ROOT, fromDir, packageName);
		if (!(await fs.pathExists(source))) continue;

		await fs.ensureDir(path.dirname(target));
		await fs.symlink(source, target, process.platform === 'win32' ? 'junction' : 'dir');
	}
}

async function getFilesRecursively(dir: string): Promise<string[]> {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files: string[] = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await getFilesRecursively(fullPath)));
		else files.push(fullPath);
	}
	return files;
}

type StripState =
	'normal' | 'line-comment' | 'block-comment' | 'single' | 'double' | 'template' | 'regex';

interface StripCursor {
	state: StripState;
	escaped: boolean;
	regexCharacterClass: boolean;
}

function createStripCursor(): StripCursor {
	return { state: 'normal', escaped: false, regexCharacterClass: false };
}

function canStartRegexLiteral(content: string, offset: number): boolean {
	let previousOffset = offset - 1;
	while (previousOffset >= 0 && /\s/.test(content[previousOffset] ?? '')) previousOffset--;
	if (previousOffset < 0) return true;

	const previous = content[previousOffset] ?? '';
	if ((previous === '+' || previous === '-') && content[previousOffset - 1] === previous) {
		return false;
	}
	if ('([{,:;=!?&|+-*%^~<>'.includes(previous)) return true;

	const previousWord = content.slice(0, previousOffset + 1).match(/([A-Za-z_$][\w$]*)$/)?.[1];
	return (
		previousWord !== undefined &&
		[
			'await',
			'case',
			'delete',
			'in',
			'instanceof',
			'of',
			'return',
			'throw',
			'typeof',
			'void',
			'yield',
		].includes(previousWord)
	);
}

function advanceStripCursor(cursor: StripCursor, content: string, offset: number): number {
	const char = content[offset] ?? '';
	const next = content[offset + 1] ?? '';

	if (cursor.state === 'line-comment') {
		if (char === '\n' || char === '\r') cursor.state = 'normal';
		return 1;
	}

	if (cursor.state === 'block-comment') {
		if (char === '*' && next === '/') {
			cursor.state = 'normal';
			return 2;
		}
		return 1;
	}

	if (cursor.state === 'regex') {
		if (cursor.escaped) {
			cursor.escaped = false;
			return 1;
		}
		if (char === '\\') {
			cursor.escaped = true;
			return 1;
		}
		if (char === '[') cursor.regexCharacterClass = true;
		else if (char === ']') cursor.regexCharacterClass = false;
		else if (char === '/' && !cursor.regexCharacterClass) cursor.state = 'normal';
		return 1;
	}

	if (cursor.state === 'single' || cursor.state === 'double' || cursor.state === 'template') {
		if (cursor.escaped) {
			cursor.escaped = false;
			return 1;
		}
		if (char === '\\') {
			cursor.escaped = true;
			return 1;
		}
		if (
			(cursor.state === 'single' && char === "'") ||
			(cursor.state === 'double' && char === '"') ||
			(cursor.state === 'template' && char === '`')
		) {
			cursor.state = 'normal';
		}
		return 1;
	}

	if (char === '/' && next === '/') {
		cursor.state = 'line-comment';
		return 2;
	}
	if (char === '/' && next === '*') {
		cursor.state = 'block-comment';
		return 2;
	}
	if (char === '/' && canStartRegexLiteral(content, offset)) {
		cursor.state = 'regex';
		cursor.regexCharacterClass = false;
	} else if (char === "'") cursor.state = 'single';
	else if (char === '"') cursor.state = 'double';
	else if (char === '`') cursor.state = 'template';
	return 1;
}

function isExecutableScriptMatch(content: string, offset: number): boolean {
	const cursor = createStripCursor();
	for (let index = 0; index < offset;) {
		index += advanceStripCursor(cursor, content, index);
	}
	return cursor.state === 'normal';
}

interface SourceRange {
	start: number;
	end: number;
}

interface SvelteExecutableRegion extends SourceRange {
	tag: 'script' | 'style';
}

interface SvelteMarkupScan {
	comments: SourceRange[];
	executableRegions: SvelteExecutableRegion[];
}

function svelteOpeningTagAt(
	content: string,
	offset: number
): { tag: 'script' | 'style'; end: number } | undefined {
	const tagMatch = content.slice(offset).match(/^<(script|style)\b/i);
	if (!tagMatch) return undefined;

	let quote: "'" | '"' | undefined;
	let firstGreaterThan: number | undefined;
	for (let index = offset + tagMatch[0].length; index < content.length; index++) {
		const char = content[index] ?? '';
		if (char === '>' && firstGreaterThan === undefined) firstGreaterThan = index;
		if (quote) {
			if (char === quote) quote = undefined;
			continue;
		}
		if (char === "'" || char === '"') quote = char;
		else if (char === '>') {
			return { tag: tagMatch[1]?.toLowerCase() as 'script' | 'style', end: index + 1 };
		}
	}

	// Invalid markup with an unterminated attribute quote still gets the base
	// scanner's localized recovery behavior instead of hiding the whole block.
	return firstGreaterThan === undefined
		? undefined
		: {
				tag: tagMatch[1]?.toLowerCase() as 'script' | 'style',
				end: firstGreaterThan + 1,
			};
}

function svelteClosingTagAt(
	content: string,
	offset: number,
	tag: 'script' | 'style'
): number | undefined {
	const match = content.slice(offset).match(new RegExp(`^</${tag}\\s*>`, 'i'));
	return match ? offset + match[0].length : undefined;
}

function findSvelteExecutableRegion(
	content: string,
	bodyStart: number,
	tag: 'script' | 'style'
): SvelteExecutableRegion | undefined {
	if (tag === 'style') {
		for (let offset = bodyStart; offset < content.length; offset++) {
			if (svelteClosingTagAt(content, offset, tag) !== undefined) {
				return { tag, start: bodyStart, end: offset };
			}
		}
		return undefined;
	}

	let structuralFallback: SvelteExecutableRegion | undefined;
	const cursor = createStripCursor();
	for (let offset = bodyStart; offset < content.length;) {
		const closingEnd = svelteClosingTagAt(content, offset, tag);
		if (closingEnd !== undefined) {
			const region = { tag, start: bodyStart, end: offset } as const;
			if (cursor.state === 'normal') return region;
			structuralFallback ??= region;
		}
		offset += advanceStripCursor(cursor, content, offset);
	}

	// Region existence is structural: a lexer desynchronization may affect an
	// individual later match, but it must never erase imports above that point.
	return structuralFallback;
}

function scanSvelteMarkup(content: string): SvelteMarkupScan {
	const comments: SourceRange[] = [];
	const executableRegions: SvelteExecutableRegion[] = [];

	for (let offset = 0; offset < content.length;) {
		if (content.startsWith('<!--', offset)) {
			const commentEnd = content.indexOf('-->', offset + 4);
			if (commentEnd !== -1) {
				comments.push({ start: offset, end: commentEnd + 3 });
				offset = commentEnd + 3;
				continue;
			}
		}

		const openingTag = svelteOpeningTagAt(content, offset);
		if (openingTag) {
			const region = findSvelteExecutableRegion(content, openingTag.end, openingTag.tag);
			if (region) {
				const closingEnd = svelteClosingTagAt(content, region.end, openingTag.tag);
				if (closingEnd !== undefined) {
					executableRegions.push(region);
					offset = closingEnd;
					continue;
				}
			}
		}
		offset++;
	}
	return { comments, executableRegions };
}

function stripHtmlComments(content: string, filePath?: string): string {
	if (!filePath?.endsWith('.svelte')) return content;

	const stripped = content.split('');
	for (const comment of scanSvelteMarkup(content).comments) {
		for (let offset = comment.start; offset < comment.end; offset++) {
			const char = content[offset] ?? '';
			stripped[offset] = char === '\n' || char === '\r' ? char : ' ';
		}
	}

	return stripped.join('');
}

function maskSvelteMarkup(content: string): string {
	const masked = Array.from({ length: content.length }, (_, index) => {
		const char = content[index] ?? '';
		return char === '\n' || char === '\r' ? char : ' ';
	});
	for (const region of scanSvelteMarkup(content).executableRegions) {
		for (let offset = region.start; offset < region.end; offset++) {
			masked[offset] = content[offset] ?? '';
		}
	}

	return masked.join('');
}

function executableImportShapedTokenOffset(content: string): number | undefined {
	const pattern =
		/(?:^|[;\n\r])\s*(?:import\s+(?:[^'"]+?\s+from\s*)?['"]|export\s+[^'"]+?\s+from\s*['"])|(?<![\w$])import\s*\(\s*['"]|@import\s+(?:url\s*\(\s*)?['"]/g;

	let match: RegExpExecArray | null;
	while ((match = pattern.exec(content)) !== null) {
		const statementOffset = match.index + match[0].search(/\b(?:import|export)\b|@import\b/);
		if (isExecutableScriptMatch(content, statementOffset)) return statementOffset;
	}
	return undefined;
}

function recoverImportSpecifiers(executableContent: string): string[] {
	const specifiers: string[] = [];
	for (const pattern of [
		/(?:^|[;\n\r])\s*import\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*import\s*(['"])([^'"]+)\1/g,
		/(?:^|[;\n\r])\s*export\s+[^'"]+?from\s*(['"])([^'"]+)\1/g,
		/(?<![\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
		/@import\s+(?:url\s*\(\s*)?(['"])([^'"]+)\1(?:\s*\))?/g,
	]) {
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(executableContent)) !== null) {
			const statementOffset = match.index + match[0].search(/\b(?:import|export)\b|@import\b/);
			if (match[2] && isExecutableScriptMatch(executableContent, statementOffset)) {
				specifiers.push(match[2]);
			}
		}
	}
	return specifiers;
}

function importSpecifiers(content: string, filePath?: string): string[] {
	const commentStripped = stripHtmlComments(content, filePath);
	// Svelte markup is not JavaScript: only script/style bodies may influence
	// string and comment state for executable import matches.
	const executableContent = filePath?.endsWith('.svelte')
		? maskSvelteMarkup(commentStripped)
		: commentStripped;
	const specifiers = recoverImportSpecifiers(executableContent);
	const importShapedTokenOffset = executableImportShapedTokenOffset(executableContent);
	if (specifiers.length === 0 && importShapedTokenOffset !== undefined) {
		const line = executableContent.slice(0, importShapedTokenOffset).split(/\r\n|\r|\n/).length;
		throw new Error(
			`Import recovery found an import-shaped token but recovered no specifiers from ${filePath ?? '<unknown file>'} at offset ${importShapedTokenOffset} (line ${line})`
		);
	}
	return specifiers;
}

function resolvesOnDisk(fromFile: string, specifier: string): boolean {
	const cleanSpecifier = specifier.replace(/[?#].*$/, '');
	const base = path.resolve(path.dirname(fromFile), cleanSpecifier);
	const withoutExt = base.replace(/\.(?:[cm]?[jt]s|svelte|css)$/, '');
	return [
		base,
		`${withoutExt}.ts`,
		`${withoutExt}.js`,
		`${withoutExt}.svelte`,
		`${withoutExt}.svelte.ts`,
		`${withoutExt}.css`,
		path.join(base, 'index.ts'),
		path.join(base, 'index.js'),
		path.join(base, 'index.svelte'),
	].some((candidate) => fs.existsSync(candidate));
}

describe('greater add review (real command)', () => {
	it('keeps Svelte markup apostrophes from hiding script imports in the sweep', () => {
		const source = ["<p>Sam's post</p>", '<script>', "import 'bare-package';", '</script>'].join(
			'\n'
		);

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual(['bare-package']);
	});

	it('ignores imports inside commented-out Svelte script blocks', () => {
		const source = [
			"<p>Sam's post</p>",
			'<!--',
			'<script>',
			"import 'decoy';",
			'</script>',
			'-->',
			'<script>',
			"import 'pkg-real';",
			'</script>',
		].join('\n');

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual(['pkg-real']);
	});

	it('leaves no recoverable import when an apostrophe precedes only a commented Svelte script', () => {
		const source = [
			"<p>Sam's post</p>",
			'<!--',
			'<script>',
			"import 'decoy';",
			'</script>',
			'-->',
		].join('\n');
		const executableContent = maskSvelteMarkup(stripHtmlComments(source, 'synthetic.svelte'));

		expect(recoverImportSpecifiers(executableContent)).toEqual([]);
	});

	it('does not fail loudly for an import-shaped token in a commented-out Svelte script', () => {
		const source = ['<!--', '<script>', "import 'decoy';", '</script>', '-->', '<p>hi</p>'].join(
			'\n'
		);

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual([]);
	});

	it('recovers a Svelte import after an HTML comment opener inside a script string (E1)', () => {
		const source = [
			'<script>',
			"const marker = 'escaped \\' <!--';",
			"import 'pkg-real';",
			'</script>',
			'-->',
		].join('\n');

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual(['pkg-real']);
	});

	it('recovers a Svelte import after an unterminated markup comment (E2)', () => {
		const source = ['<!--', '<script>', "import 'pkg-real';", '</script>'].join('\n');

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual(['pkg-real']);
	});

	it('recovers a TypeScript import after an HTML comment opener inside a string (E3)', () => {
		const source = ['const marker = `<!--`;', "import 'pkg-real';", "const closer = '-->';"].join(
			'\n'
		);

		expect(importSpecifiers(source, 'synthetic.ts')).toEqual(['pkg-real']);
	});

	it('does not apply HTML comment semantics to TypeScript operators', () => {
		const source = [
			'const a = b <!--c;',
			'import {',
			'\tthing',
			"} from 'really-real';",
			'const d = e-->f;',
		].join('\n');

		expect(importSpecifiers(source, 'synthetic.ts')).toEqual(['really-real']);
	});

	it('keeps regex literals from desynchronizing TypeScript import recovery', () => {
		const source = [
			'const htmlComment = /<!--/;',
			"const apostrophe = /'/;",
			`const negativeRegex = -/'/.test('value');`,
			"import 'regex-real';",
		].join('\n');

		expect(importSpecifiers(source, 'synthetic.ts')).toEqual(['regex-real']);
	});

	it('treats slashes after postfix increment and decrement as division', () => {
		for (const { operation, specifier } of [
			{ operation: 'i++ / total', specifier: 'after-incdiv' },
			{ operation: 'i-- / total', specifier: 'after-decdiv' },
		]) {
			const source = [`const ratio = ${operation};`, `import '${specifier}';`].join('\n');

			expect(importSpecifiers(source, 'synthetic.ts')).toEqual([specifier]);
		}
	});

	it('does not truncate a Svelte script at a closing tag inside a string', () => {
		const source = [
			'<script>',
			'const closingTag = "</script>";',
			"import 'pkg-real';",
			'</script>',
		].join('\n');

		expect(importSpecifiers(source, 'synthetic.svelte')).toEqual(['pkg-real']);
	});

	it('keeps imports above nested template literals in Svelte executable regions', () => {
		const source = [
			'<script>',
			"import 'pkg-real';",
			"const html = `<div>${items.map((item) => `<b>${item}</b>`).join('')}</div>`;",
			'</script>',
		].join('\n');

		expect(importSpecifiers(source, 'nested-template.svelte')).toEqual(['pkg-real']);
	});

	it('finds a Svelte opening tag terminator after a quoted greater-than character', () => {
		const source = ['<script data-example="a>b">', "import 'attribute-real';", '</script>'].join(
			'\n'
		);

		expect(importSpecifiers(source, 'quoted-attribute.svelte')).toEqual(['attribute-real']);
	});

	it('fails loudly when an import-shaped token yields no recovered specifier', () => {
		const malformedStatements = [
			{
				source: "import { hidden } from 'malformed;",
				file: 'malformed.ts',
				token: 'import',
				line: 1,
			},
			{
				source: "const before = true;\nimport {\n\thidden\n} from 'malformed;",
				file: 'malformed.ts',
				token: 'import',
				line: 2,
			},
			{
				source: "const before = true;\n\nexport {\n\thidden\n} from 'malformed;",
				file: 'malformed.ts',
				token: 'export',
				line: 3,
			},
			{
				source: ['<script>', "import { hidden } from 'malformed;", '</script>'].join('\n'),
				file: 'malformed-multiline.svelte',
				token: 'import',
				line: 2,
			},
			{
				source: "<script>import { hidden } from 'malformed;</script>",
				file: 'malformed-single-line.svelte',
				token: 'import',
				line: 1,
			},
			{
				source: ['<style>', "@import 'malformed;", '</style>'].join('\n'),
				file: 'malformed-style.svelte',
				token: '@import',
				line: 2,
			},
		];

		for (const { source, file, token, line } of malformedStatements) {
			expect(() => importSpecifiers(source, file)).toThrow(
				`Import recovery found an import-shaped token but recovered no specifiers from ${file} at offset ${source.indexOf(token)} (line ${line})`
			);
		}
	});

	it('preserves pins and installs a relative-import tree that type-checks and builds', async () => {
		const root = await createScratchProject();

		try {
			// 1. Real `greater init` — writes components.json in vendored mode.
			await execa('node', [CLI_BIN, 'init', '--yes', '--face', 'blog', '--cwd', root], {
				env: CLI_ENV,
			});
			expect(await fs.pathExists(path.join(root, 'components.json'))).toBe(true);
			const packageJsonPath = path.join(root, 'package.json');
			const manifestBeforeAdd = await fs.readFile(packageJsonPath, 'utf8');
			expect(JSON.parse(manifestBeforeAdd).devDependencies.viem).toBe('^2.47.14');

			// 2. The command under test. No `--all`: the closure below is what
			//    `review`'s own registryDependencies must pull in on their own.
			const addResult = await execa('node', [CLI_BIN, 'add', '--yes', 'review', '--cwd', root], {
				env: CLI_ENV,
			});

			// Consumer-owned declarations are never package-manager rewrite targets.
			// The adapters core requires viem ^2.55.10, while this fixture intentionally
			// pins an older range. The complete manifest bytes must survive `add`.
			expect(await fs.readFile(packageJsonPath, 'utf8')).toBe(manifestBeforeAdd);
			expect(`${addResult.stdout}\n${addResult.stderr}`).toContain(
				'viem: manifest ^2.47.14; Greater requires ^2.55.10'
			);

			// (a) Dependency closure: `blog-types` is not requested on the command
			//     line, it is reached through `review`'s registryDependencies.
			const componentsJson = await fs.readJson(path.join(root, 'components.json'));
			const installed = componentsJson.installed.map((entry: { name: string }) => entry.name);
			expect(installed).toContain('review');
			expect(installed).toContain('blog-types');

			const libDir = path.join(root, 'src/lib');
			expect(await fs.pathExists(path.join(libDir, 'blog-types.ts'))).toBe(true);

			// Every Greater-internal specifier emitted by the real add pipeline is
			// relative and resolves in the installed tree. No tsconfig/vite alias is
			// added for Greater internals; the stock SvelteKit fixture stays untouched.
			const unresolved: string[] = [];
			const bareAliasTargets: string[] = [];
			const bareGreaterPackageSpecifiers: string[] = [];
			const bareAliasRoots = [
				componentsJson.aliases.greater,
				componentsJson.aliases.components,
				componentsJson.aliases.utils,
				componentsJson.aliases.hooks,
				componentsJson.aliases.lib,
				'$lib',
			];
			for (const file of await getFilesRecursively(libDir)) {
				if (!/\.(?:svelte|[cm]?[jt]s|css)$/.test(file)) continue;
				for (const specifier of importSpecifiers(await fs.readFile(file, 'utf8'), file)) {
					if (specifier.startsWith('.') && !resolvesOnDisk(file, specifier)) {
						unresolved.push(`${path.relative(root, file)} → ${specifier}`);
					}
					if (
						bareAliasRoots.some(
							(aliasRoot: string) =>
								specifier === aliasRoot || specifier.startsWith(`${aliasRoot}/`)
						)
					) {
						bareAliasTargets.push(`${path.relative(root, file)} → ${specifier}`);
					}
					if (/^@equaltoai\/greater-components(?:-|\/|$)/.test(specifier)) {
						bareGreaterPackageSpecifiers.push(`${path.relative(root, file)} → ${specifier}`);
					}
				}
			}
			expect(unresolved).toEqual([]);
			expect(bareAliasTargets).toEqual([]);
			expect(bareGreaterPackageSpecifiers).toEqual([]);

			// Every file the catalog claims for `review` has to land, so a catalog
			// entry that stops installing fails here rather than in a consumer.
			const reviewDir = path.join(libDir, 'components/Review');
			const catalogFiles = (componentRegistry['review']?.files ?? []).map((file) =>
				path.basename(file.path)
			);
			expect(catalogFiles.length).toBeGreaterThan(0);
			expect((await fs.readdir(reviewDir)).sort()).toEqual([...catalogFiles].sort());

			// (b) The F3 rewrite: source `../../types.js` (packages/faces/blog/src/types.ts)
			//     has to become `../../blog-types.js`, because `blog-types` installs
			//     as `src/lib/blog-types.ts`.
			for (const file of REVIEW_TYPE_IMPORTERS) {
				const installedPath = path.join(reviewDir, file);
				expect(await fs.pathExists(installedPath), `${file} was not installed`).toBe(true);

				const content = await fs.readFile(installedPath, 'utf-8');
				expect(content, file).not.toContain("'../../types.js'");
				expect(content, file).toContain("'../../blog-types.js'");
			}

			// (c) The installed tree type-checks. `$lib/greater/*` is left to
			//     resolve against the real vendored core the same `add` run wrote;
			//     only `*.svelte` is shimmed, because tsc cannot parse components.
			//     Relative `.svelte` specifiers are covered by the directory
			//     listing above and by `vendored-blog-install.test.ts`.
			await linkWorkspaceDependencies(root);
			await fs.writeFile(
				path.join(root, 'src/routes/+page.svelte'),
				[
					'<script lang="ts">',
					"\timport QueueCard from '$lib/components/Review/QueueCard.svelte';",
					"\timport * as greaterUtils from '$lib/greater/utils';",
					'\tconst installedComponent = QueueCard;',
					"\tconst className = Object.keys(greaterUtils).length ? 'greater-resolution-proof' : '';",
					'</script>',
					'',
					"<p class={className}>{installedComponent ? 'vendored imports resolve' : 'missing'}</p>",
					'',
				].join('\n')
			);

			await fs.writeFile(
				path.join(libDir, 'review-shims.d.ts'),
				[
					"declare module '*.svelte' {",
					'\tconst component: unknown;',
					'\texport default component;',
					'}',
					'',
				].join('\n')
			);

			const tsconfigPath = path.join(root, 'tsconfig.review.json');
			await fs.writeJson(
				tsconfigPath,
				{
					compilerOptions: {
						target: 'ES2022',
						module: 'ESNext',
						moduleResolution: 'bundler',
						strict: true,
						noEmit: true,
						skipLibCheck: true,
						allowImportingTsExtensions: true,
						types: [],
						paths: { '$lib/*': ['./src/lib/*'] },
					},
					include: [
						'src/lib/components/Review/**/*.ts',
						'src/lib/blog-types.ts',
						'src/lib/review-shims.d.ts',
					],
				},
				{ spaces: 2 }
			);

			const typecheck = await execa(TSC_BIN, ['--noEmit', '--project', tsconfigPath], {
				reject: false,
			});
			const output = `${typecheck.stdout ?? ''}${typecheck.stderr ?? ''}`;

			// TS2307 on a relative specifier is exactly the F3 failure: a file
			// installed under a name its neighbours do not import it by.
			const unresolvedRelative = output
				.split('\n')
				.filter((line) => /error TS2307/.test(line) && /Cannot find module '\.\.?\//.test(line));

			expect(unresolvedRelative).toEqual([]);
			expect(output, 'the installed Review tree failed to type-check').toBe('');

			// Standard SvelteKit + Vite build, using only the configuration `init`
			// scaffolded in the fresh fixture.
			await execa(SVELTE_KIT_BIN, ['sync'], { cwd: root });
			const build = await execa(VITE_BIN, ['build'], { cwd: root, reject: false });
			expect(build.exitCode, `fresh consumer build failed:\n${build.stdout}\n${build.stderr}`).toBe(
				0
			);
		} finally {
			await fs.remove(root);
		}
	}, 300_000);

	it('preserves a conflicting optional dependency pin byte-for-byte', async () => {
		const root = await createScratchProject();

		try {
			const packageJsonPath = path.join(root, 'package.json');
			const fixtureManifest = await fs.readJson(packageJsonPath);
			const viemPin = fixtureManifest.devDependencies.viem;
			delete fixtureManifest.devDependencies.viem;
			fixtureManifest.optionalDependencies = {
				...(fixtureManifest.optionalDependencies ?? {}),
				viem: viemPin,
			};
			await fs.writeJson(packageJsonPath, fixtureManifest, { spaces: 2 });

			await execa('node', [CLI_BIN, 'init', '--yes', '--face', 'blog', '--cwd', root], {
				env: CLI_ENV,
			});
			const manifestBeforeAdd = await fs.readFile(packageJsonPath, 'utf8');
			expect(JSON.parse(manifestBeforeAdd).optionalDependencies.viem).toBe('^2.47.14');

			const addResult = await execa('node', [CLI_BIN, 'add', '--yes', 'review', '--cwd', root], {
				env: CLI_ENV,
			});

			expect(await fs.readFile(packageJsonPath, 'utf8')).toBe(manifestBeforeAdd);
			expect(`${addResult.stdout}\n${addResult.stderr}`).toContain(
				'viem: manifest ^2.47.14; Greater requires ^2.55.10'
			);
		} finally {
			await fs.remove(root);
		}
	}, 300_000);
});
