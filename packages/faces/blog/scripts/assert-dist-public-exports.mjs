#!/usr/bin/env node
/**
 * Post-build public-export parity assertion for the Blog face.
 *
 * Issue #1055's security invariant requires proof that the *built package*
 * carries the pinned stale-approval wording and review-state qualifier —
 * proof that survives the gap between source and publishable artifact. This
 * script is that proof and runs at the end of the package `build` chain, so a
 * future build whose dist surface drops or alters any required export fails
 * the canonical `pnpm build` / CI "Build packages" path.
 *
 * What it asserts:
 *
 * 1. `package.json` `exports["."]` keeps the `types` / `svelte` / `import`
 *    conditions pointed at `./dist/index.d.ts`, `./src/index.ts`, and
 *    `./dist/index.js` respectively — i.e. plain Node and bundler consumers
 *    genuinely route to the built surface, not only to the source alias.
 * 2. Both `dist/index.js` and `dist/index.d.ts` exist.
 * 3. The export surface of each entry file names every export in
 *    {@link REQUIRED_PUBLIC_EXPORTS}. `export *` re-exports are followed
 *    within `dist/` so a star re-export still counts — but only re-exports
 *    that resolve to a file actually carrying the name satisfy the check.
 *    The parser accepts both spaced and compact statement forms that valid
 *    builds emit (`export { … }` and `export{…}`, including minified
 *    one-line graphs), never matches inside string literals or inside
 *    identifiers such as `reexport{`, and ignores commented-out statements.
 * 4. The value each constant in {@link EXPECTED_PINNED_VALUES} resolves to
 *    through each entry's built module graph — following the re-export and
 *    import chain to the binding's initializer — exactly equals the expected
 *    value in that map. `EXPECTED_PINNED_VALUES` (defined below) is this
 *    gate's single authoritative expected-value source; the runtime graph is
 *    traced from `dist/index.js` and the types graph from `dist/index.d.ts`
 *    (including `export declare const NAME = "…"` literal declarations). A
 *    mutated value fails the build, and a chain the parser cannot resolve
 *    statically also fails it — the gate is fail-closed: unprovable never
 *    passes.
 *
 * Why static inspection instead of `await import(...)`:
 *
 * The built graph is not Node-loadable. `dist/index.js` transitively imports
 * raw `.svelte` modules (for example the primitives face re-exports
 * `Button.svelte`), and plain Node rejects them with
 * `ERR_UNKNOWN_FILE_EXTENSION` — consuming that graph requires a bundler with
 * the package's `svelte` condition. The boundary is asserted in the sibling
 * `assert-dist-public-exports.test.mjs`, so this script deliberately inspects
 * the emitted modules deterministically instead of executing them.
 *
 * Note what this is NOT: it is not the Vitest `public-api-exports` test. That
 * test imports `@equaltoai/greater-components-blog` through the vitest alias
 * onto `src/`, so it proves source-entry reachability only; this script reads
 * the built dist files from disk and cannot be satisfied by that alias.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * The exports the #1055 contract promises to consumers of the built package
 * (docs/faces/blog/review-workflow.md, the #1055 semver note). The wording
 * constants must stay importable from the package root after release/install,
 * or consumers silently fall back to paraphrased stale-approval text.
 */
export const REQUIRED_PUBLIC_EXPORTS = [
	'REVIEW_STALE_APPROVAL_LABEL',
	'REVIEW_STALE_APPROVAL_DETAIL',
	'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
	'REVIEW_STATE_QUALIFIER',
];

/**
 * The `exports["."]` conditions the built package must keep: consumers
 * resolving `types`, bundlers resolving `svelte`, and plain `import` must all
 * land on the entries this script inspects.
 */
export const REQUIRED_ROOT_CONDITIONS = {
	types: './dist/index.d.ts',
	svelte: './src/index.ts',
	import: './dist/index.js',
};

/**
 * The single authoritative expected-value source for the built-artifact gate.
 *
 * The gate resolves each of these names through the built `dist/index.js`
 * and `dist/index.d.ts` module graphs and requires the resolved value to
 * equal this map exactly. Any change here is a #1055 contract change, not a
 * gate adjustment; the script tests pin these four pairs independently so a
 * weakened map fails CI too.
 */
export const EXPECTED_PINNED_VALUES = Object.freeze({
	REVIEW_STALE_APPROVAL_LABEL: 'Latest verdict: Approved (superseded)',
	REVIEW_STALE_APPROVAL_DETAIL:
		'This approval no longer counts. Approval for the current revision is outstanding.',
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL:
		'This approval no longer counts. Principal approval for the current revision is outstanding.',
	REVIEW_STATE_QUALIFIER: 'latest activity, not publication state',
});

/**
 * Removes block and line comments without touching string literals.
 *
 * @param {string} source
 * @returns {string}
 */
export function stripComments(source) {
	const noBlock = source.replace(/\/\*[\s\S]*?\*\//g, '');
	return noBlock.replace(/(^|[^:"'\\])\/\/[^\n\r]*/g, '$1');
}

/** Keywords after which a `/` starts a regex literal rather than division. */
const REGEX_ALLOWED_KEYWORDS = new Set([
	'return',
	'typeof',
	'instanceof',
	'in',
	'of',
	'new',
	'delete',
	'void',
	'throw',
	'case',
	'do',
	'else',
	'yield',
	'await',
]);

/**
 * Scans module source deterministically, separating code structure from
 * literal content so statement matching can never be fooled by text inside
 * strings, templates, regex literals, or comments.
 *
 * Returns `{ code, readLiteral }` where `code` is index-preserving
 * source-shaped text with string/template/regex bodies and comments blanked
 * (quote characters are kept at their original offsets), and
 * `readLiteral(index)` decodes the string literal whose opening quote sits at
 * `index` in the original source. Decoding is fail-closed: escapes the
 * decoder does not fully understand, unterminated literals, and template
 * literals containing `${}` substitutions all throw.
 *
 * @param {string} source
 * @returns {{ code: string, readLiteral: (index: number) => { value: string, quote: string, end: number } }}
 */
export function scanModule(source) {
	const n = source.length;
	/** @type {string[]} */
	const out = [];
	/** @type {Map<number, { kind: 'string' | 'template', quote: string, end: number, hasSubstitution?: boolean }>} */
	const literals = new Map();
	let i = 0;
	let prev = '';
	let ident = '';
	/** @type {number[]} */
	const exprBraceStack = [];

	/** @param {string} ch */
	const isIdentChar = (ch) => /[A-Za-z0-9_$]/.test(ch);

	/** @param {string} ch */
	function emit(ch) {
		out.push(ch);
		if (ch.trim() !== '') {
			prev = ch;
			ident = isIdentChar(ch) ? ident + ch : '';
		}
	}

	/** @param {string} ch */
	function blankChar(ch) {
		out.push(ch === '\n' ? '\n' : ' ');
	}

	function regexAllowed() {
		if (ident !== '') {
			const keyword = ident;
			ident = '';
			return REGEX_ALLOWED_KEYWORDS.has(keyword);
		}
		if (prev === '') return true;
		if (prev === ')' || prev === ']') return false;
		return !/[0-9"'`]/.test(prev);
	}

	/** @param {string} quote */
	function scanString(quote) {
		const start = i;
		out.push(quote);
		i += 1;
		while (i < n) {
			const ch = source.charAt(i);
			if (ch === '\\') {
				blankChar(ch);
				const escaped = source.charAt(i + 1);
				if (escaped === '') break;
				blankChar(escaped);
				i += 2;
				continue;
			}
			if (ch === quote) {
				out.push(quote);
				literals.set(start, { kind: 'string', quote, end: i });
				i += 1;
				return;
			}
			if (ch === '\n') break;
			blankChar(ch);
			i += 1;
		}
		throw new Error(`unterminated string literal starting at offset ${start}`);
	}

	// The template currently being scanned; survives the resume round-trips
	// through `${ … }` expressions so the substitution flag is not lost.
	/** @type {{ start: number, hasSubstitution: boolean } | null} */
	let openTemplate = null;

	/** @param {boolean} [resume] */
	function scanTemplate(resume) {
		const resumed = resume === true ? openTemplate : null;
		const state = resumed ?? { start: i, hasSubstitution: false };
		openTemplate = state;
		if (!resumed) {
			out.push('`');
			i += 1;
		}
		while (i < n) {
			const ch = source.charAt(i);
			if (ch === '\\') {
				blankChar(ch);
				const escaped = source.charAt(i + 1);
				if (escaped === '') break;
				blankChar(escaped);
				i += 2;
				continue;
			}
			if (ch === '`') {
				out.push('`');
				literals.set(state.start, {
					kind: 'template',
					quote: '`',
					end: i,
					hasSubstitution: state.hasSubstitution,
				});
				openTemplate = null;
				i += 1;
				return;
			}
			if (ch === '$' && source.charAt(i + 1) === '{') {
				state.hasSubstitution = true;
				out.push(' ');
				out.push(' ');
				i += 2;
				exprBraceStack.push(0);
				return;
			}
			blankChar(ch);
			i += 1;
		}
		throw new Error(`unterminated template literal starting at offset ${state.start}`);
	}

	function scanRegex() {
		// The caller has already decided `/` is in regex position. Scan the
		// literal (class-aware, escape-aware) and blank it completely,
		// including delimiters and flags, so its body can never contribute
		// statement-shaped text. A regex literal behaves like a closed operand
		// for whatever follows it.
		let j = i + 1;
		let inClass = false;
		while (j < n) {
			const ch = source.charAt(j);
			if (ch === '\\') {
				j += 2;
				continue;
			}
			if (ch === '\n') break;
			if (inClass) {
				if (ch === ']') inClass = false;
			} else if (ch === '[') {
				inClass = true;
			} else if (ch === '/') {
				j += 1;
				while (j < n && /[dgimsvy]/.test(source.charAt(j))) j += 1;
				for (let k = i; k < j; k += 1) blankChar(source.charAt(k));
				i = j;
				prev = ')';
				ident = '';
				return;
			}
			j += 1;
		}
		throw new Error(`unterminated regex literal starting at offset ${i}`);
	}

	/**
	 * @param {string} body
	 * @param {string} quote
	 * @returns {string}
	 */
	function decodeBody(body, quote) {
		let decoded = '';
		for (let k = 0; k < body.length; k += 1) {
			const ch = body.charAt(k);
			if (ch !== '\\') {
				decoded += ch;
				continue;
			}
			k += 1;
			const esc = body.charAt(k);
			if (esc === '') throw new Error('dangling escape in string literal');
			if (esc === 'n') decoded += '\n';
			else if (esc === 'r') decoded += '\r';
			else if (esc === 't') decoded += '\t';
			else if (esc === 'b') decoded += '\b';
			else if (esc === 'f') decoded += '\f';
			else if (esc === 'v') decoded += '\v';
			else if (esc === '0' && !/[0-9]/.test(body.charAt(k + 1))) decoded += '\0';
			else if (esc === 'x') {
				const hex = body.slice(k + 1, k + 3);
				if (!/^[0-9a-fA-F]{2}$/.test(hex)) throw new Error('invalid \\x escape');
				decoded += String.fromCodePoint(Number.parseInt(hex, 16));
				k += 2;
			} else if (esc === 'u') {
				if (body.charAt(k + 1) === '{') {
					const close = body.indexOf('}', k + 2);
					const hex = body.slice(k + 2, close);
					if (close === -1 || !/^[0-9a-fA-F]+$/.test(hex)) {
						throw new Error('invalid \\u{…} escape');
					}
					decoded += String.fromCodePoint(Number.parseInt(hex, 16));
					k = close;
				} else {
					const hex = body.slice(k + 1, k + 5);
					if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error('invalid \\u escape');
					decoded += String.fromCharCode(Number.parseInt(hex, 16));
					k += 4;
				}
			} else if (esc === '\n') {
				// Line continuation: contributes nothing.
			} else if (esc === '\r') {
				if (body.charAt(k + 1) === '\n') k += 1;
			} else if (esc === '\\' || esc === quote || esc === "'" || esc === '"' || esc === '`') {
				decoded += esc;
			} else {
				throw new Error(`unsupported escape \\${esc} in string literal`);
			}
		}
		return decoded;
	}

	/**
	 * @param {number} index
	 * @returns {{ value: string, quote: string, end: number }}
	 */
	function readLiteral(index) {
		const info = literals.get(index);
		if (!info) throw new Error(`no string literal starts at offset ${index}`);
		if (info.kind === 'template' && info.hasSubstitution) {
			throw new Error('template literal contains a ${} substitution; not a static value');
		}
		const value = decodeBody(source.slice(index + 1, info.end), info.quote);
		return { value, quote: info.quote, end: info.end };
	}

	while (i < n) {
		const ch = source.charAt(i);

		// Closing a template-expression returns the scan to the template body.
		if (
			ch === '}' &&
			exprBraceStack.length > 0 &&
			exprBraceStack[exprBraceStack.length - 1] === 0
		) {
			exprBraceStack.pop();
			out.push(' ');
			i += 1;
			scanTemplate(true);
			continue;
		}
		if (ch === '{' && exprBraceStack.length > 0) {
			exprBraceStack[exprBraceStack.length - 1] =
				(exprBraceStack[exprBraceStack.length - 1] ?? 0) + 1;
			emit(ch);
			i += 1;
			continue;
		}
		if (ch === '}' && exprBraceStack.length > 0) {
			exprBraceStack[exprBraceStack.length - 1] =
				(exprBraceStack[exprBraceStack.length - 1] ?? 0) - 1;
			emit(ch);
			i += 1;
			continue;
		}

		if (ch === "'" || ch === '"') {
			scanString(ch);
			continue;
		}
		if (ch === '`') {
			scanTemplate();
			continue;
		}
		if (ch === '/') {
			if (source.charAt(i + 1) === '/') {
				while (i < n && source.charAt(i) !== '\n') {
					out.push(' ');
					i += 1;
				}
				ident = '';
				continue;
			}
			if (source.charAt(i + 1) === '*') {
				out.push(' ');
				out.push(' ');
				i += 2;
				while (i < n && !(source.charAt(i) === '*' && source.charAt(i + 1) === '/')) {
					blankChar(source.charAt(i));
					i += 1;
				}
				if (i < n) {
					out.push(' ');
					out.push(' ');
					i += 2;
				}
				ident = '';
				continue;
			}
			if (regexAllowed()) {
				scanRegex();
				continue;
			}
			emit(ch);
			i += 1;
			continue;
		}

		emit(ch);
		i += 1;
	}

	return { code: out.join(''), readLiteral };
}

/**
 * Parses one export-clause specifier (`A`, `A as B`, `type A as B`) into its
 * local and exported names. Returns null for anything that is not a plain
 * identifier pair — including string-named exports — so such forms can never
 * satisfy a required name (fail-closed downstream).
 *
 * @param {string} raw
 * @returns {{ local: string, exported: string } | null}
 */
export function parseSpecifier(raw) {
	const cleaned = raw.trim().replace(/^type\s+/, '');
	const match = /^(?:([A-Za-z_$][\w$]*)\s+as\s+)?([A-Za-z_$][\w$]*)$/.exec(cleaned);
	if (!match) return null;
	const exported = match[2] ?? '';
	return { local: match[1] ?? exported, exported };
}

/** Matches `export { … }` / `export type { … }` with an optional `from` clause. */
const NAMED_EXPORT_RE = /(?<![\w$])export(?:\s+type)?\s*\{([^}]*)\}(\s*from\s*(['"]))?/g;
/** Matches named import clauses with their source specifier. */
const IMPORT_RE = /(?<![\w$])import(?:\s+type)?\s*\{([^}]*)\}\s*from\s*(['"])/g;
/** Matches any `var`/`let`/`const` declaration head, regardless of initializer. */
const DECLARATION_HEAD_RE = /(?<![\w$.])(?:var|let|const)\s+([A-Za-z_$][\w$]*)/g;
/** Matches declarations initialized to a string (or template) literal. */
const DECLARATION_VALUE_RE = /(?<![\w$.])(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(['"`])/g;

/**
 * Collects the names a single module exports, as far as static inspection can
 * see them: named export statements (with or without a `from` clause,
 * including `export type { … }`), local declarations, and `export * as ns`
 * namespaces. Both spaced (`export { … }`) and compact (`export{…}`)
 * statement forms are accepted; statements inside string literals or comments
 * are not. Plain `export *` re-exports are returned separately in `starFrom`
 * so the caller can follow them into the re-exported files.
 *
 * @param {string} source
 * @returns {{ names: Set<string>, starFrom: string[] }}
 */
export function collectModuleExports(source) {
	const scan = scanModule(source);
	const names = new Set();
	const starFrom = [];

	for (const match of scan.code.matchAll(NAMED_EXPORT_RE)) {
		for (const raw of (match[1] ?? '').split(',')) {
			const parsed = parseSpecifier(raw);
			if (parsed) names.add(parsed.exported);
		}
	}

	for (const match of scan.code.matchAll(
		/(?<![\w$])export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|enum)\s+([A-Za-z_$][\w$]*)/g
	)) {
		names.add(match[1]);
	}

	for (const match of scan.code.matchAll(/(?<![\w$])export\s+type\s+([A-Za-z_$][\w$]*)/g)) {
		names.add(match[1]);
	}

	for (const match of scan.code.matchAll(
		/(?<![\w$])export\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from\s*(['"])/g
	)) {
		names.add(match[1]);
	}

	for (const match of scan.code.matchAll(/(?<![\w$])export\s*\*\s*from\s*(['"])/g)) {
		const index = (match.index ?? 0) + match[0].length - 1;
		starFrom.push(scan.readLiteral(index).value);
	}

	return { names, starFrom };
}

/**
 * Parses the named-export statements of a scanned module into
 * `exported name -> { local, from }` bindings. A name exported twice is
 * recorded in `conflicts` (invalid ESM; any chain through it must fail).
 *
 * @param {{ code: string, readLiteral: (index: number) => { value: string } }} scan
 * @returns {{ bindings: Map<string, { local: string, from: string | null }>, conflicts: Set<string> }}
 */
export function parseExportBindings(scan) {
	const bindings = new Map();
	const conflicts = new Set();
	for (const match of scan.code.matchAll(NAMED_EXPORT_RE)) {
		const from =
			match[3] !== undefined
				? scan.readLiteral((match.index ?? 0) + match[0].length - 1).value
				: null;
		for (const raw of (match[1] ?? '').split(',')) {
			const parsed = parseSpecifier(raw);
			if (!parsed) continue;
			if (bindings.has(parsed.exported)) {
				conflicts.add(parsed.exported);
				continue;
			}
			bindings.set(parsed.exported, { local: parsed.local, from });
		}
	}
	return { bindings, conflicts };
}

/**
 * Parses the named-import clauses of a scanned module into
 * `local name -> { imported, from }`. A local bound twice is recorded in
 * `conflicts`.
 *
 * @param {{ code: string, readLiteral: (index: number) => { value: string } }} scan
 * @returns {{ imports: Map<string, { imported: string, from: string }>, conflicts: Set<string> }}
 */
export function parseImportBindings(scan) {
	const imports = new Map();
	const conflicts = new Set();
	for (const match of scan.code.matchAll(IMPORT_RE)) {
		const from = scan.readLiteral((match.index ?? 0) + match[0].length - 1).value;
		for (const raw of (match[1] ?? '').split(',')) {
			const parsed = parseSpecifier(raw);
			if (!parsed) continue;
			if (imports.has(parsed.exported)) {
				conflicts.add(parsed.exported);
				continue;
			}
			imports.set(parsed.exported, { imported: parsed.local, from });
		}
	}
	return { imports, conflicts };
}

/**
 * Statically extracts every `var`/`let`/`const NAME = "literal"` declaration
 * of a scanned module, decoding the initializer. Fail-closed on ambiguity:
 * a name declared more than once, initialized with more than the single
 * literal (e.g. `"a" + "b"`), or carrying an undecodable literal is recorded
 * in `conflicts` instead of `values`.
 *
 * @param {{ code: string, readLiteral: (index: number) => { value: string, end: number } }} scan
 * @returns {{ values: Map<string, string>, conflicts: Set<string> }}
 */
export function parseStringDeclarations(scan) {
	const declarationCounts = new Map();
	for (const match of scan.code.matchAll(DECLARATION_HEAD_RE)) {
		const name = match[1] ?? '';
		declarationCounts.set(name, (declarationCounts.get(name) ?? 0) + 1);
	}

	const values = new Map();
	const conflicts = new Set();
	for (const match of scan.code.matchAll(DECLARATION_VALUE_RE)) {
		const name = match[1];
		if (name === undefined || conflicts.has(name)) continue;

		let fail = (declarationCounts.get(name) ?? 0) !== 1;
		let value = '';
		if (!fail) {
			const quoteIndex = (match.index ?? 0) + match[0].length - 1;
			try {
				const literal = scan.readLiteral(quoteIndex);
				value = literal.value;
				// The initializer must be exactly one literal: `;` / `,` / EOF
				// after the closing quote, nothing else.
				let j = literal.end + 1;
				while (j < scan.code.length && /\s/.test(scan.code.charAt(j))) j += 1;
				const follower = scan.code.charAt(j) || ';';
				if (follower !== ';' && follower !== ',') fail = true;
			} catch {
				fail = true;
			}
		}

		if (fail || values.has(name)) {
			conflicts.add(name);
			values.delete(name);
			continue;
		}
		values.set(name, value);
	}
	return { values, conflicts };
}

/**
 * Resolves a module specifier against the file that imports it. Runtime
 * graphs resolve the specifier exactly. Declaration graphs must stay inside
 * the declaration surface: a `.js` specifier maps to the sibling `.d.ts`
 * TypeScript emits and never falls back to the runtime `.js` file — falling
 * back would let the types check silently re-prove the runtime graph and
 * miss a declaration-only mutation. Returns null when nothing exists there;
 * callers fail closed on null.
 *
 * @param {string} fromFile
 * @param {string} specifier
 * @param {boolean} declarationFiles
 * @returns {string | null}
 */
function resolveSpecifierPath(fromFile, specifier, declarationFiles) {
	const base = path.resolve(path.dirname(fromFile), specifier);
	/** @param {string} file */
	const isFile = (file) => {
		try {
			return fs.statSync(file).isFile();
		} catch {
			return false;
		}
	};
	if (declarationFiles) {
		if (specifier.endsWith('.d.ts')) return isFile(base) ? base : null;
		if (specifier.endsWith('.js')) {
			const mapped = `${base.slice(0, -3)}.d.ts`;
			return isFile(mapped) ? mapped : null;
		}
		return null;
	}
	return isFile(base) ? base : null;
}

/**
 * Resolves the value an exported name carries in a built module graph by
 * statically walking re-export and import chains from the entry to the
 * binding's string-literal initializer. Returns `{ ok: true, value }` only
 * when the chain resolves unambiguously to exactly one static string; every
 * other shape — missing file, external module, cycle, duplicate or missing
 * declaration, non-literal initializer, ambiguous star re-export — returns
 * `{ ok: false, reason }` so the gate fails closed.
 *
 * @param {string} entryPath
 * @param {string} exportedName
 * @param {{ declarationFiles?: boolean }} [options]
 * @returns {{ ok: true, value: string } | { ok: false, reason: string }}
 */
export function resolveExportedStringValue(entryPath, exportedName, options = {}) {
	const declarationFiles = options.declarationFiles === true;
	/** @type {Set<string>} */
	const seen = new Set();

	/** @param {string} file */
	const rel = (file) => path.relative(process.cwd(), file) || file;

	/**
	 * @param {string} file
	 * @param {string} name
	 * @returns {{ ok: true, value: string } | { ok: false, reason: string }}
	 */
	function resolveFrom(file, name) {
		const canonical = path.resolve(file);
		const key = `${canonical}\u0000${name}`;
		if (seen.has(key)) {
			return { ok: false, reason: `circular re-export chain for ${name} at ${rel(canonical)}` };
		}
		seen.add(key);

		let source;
		try {
			source = fs.readFileSync(canonical, 'utf8');
		} catch {
			return { ok: false, reason: `${rel(canonical)} does not exist or cannot be read` };
		}

		let scan;
		try {
			scan = scanModule(source);
		} catch (error) {
			return {
				ok: false,
				reason: `${rel(canonical)}: ${error instanceof Error ? error.message : String(error)}`,
			};
		}

		const { bindings, conflicts } = parseExportBindings(scan);
		if (conflicts.has(name)) {
			return { ok: false, reason: `ambiguous duplicate export of ${name} in ${rel(canonical)}` };
		}

		/**
		 * Resolves a local binding of this module: a unique static string
		 * declaration wins; otherwise the binding may itself be an import that
		 * continues the chain.
		 *
		 * @param {string} localName
		 * @returns {{ ok: true, value: string } | { ok: false, reason: string }}
		 */
		const resolveLocal = (localName) => {
			const { values, conflicts: declarationConflicts } = parseStringDeclarations(scan);
			if (declarationConflicts.has(localName)) {
				return {
					ok: false,
					reason: `ambiguous or non-static declaration of ${localName} in ${rel(canonical)}`,
				};
			}
			const value = values.get(localName);
			if (value !== undefined) return { ok: true, value };

			const { imports, conflicts: importConflicts } = parseImportBindings(scan);
			if (importConflicts.has(localName)) {
				return {
					ok: false,
					reason: `ambiguous duplicate import binding for ${localName} in ${rel(canonical)}`,
				};
			}
			const imported = imports.get(localName);
			if (imported) {
				if (!imported.from.startsWith('.')) {
					return {
						ok: false,
						reason: `${name} is imported from external module ${JSON.stringify(imported.from)} in ${rel(canonical)}; its value cannot be verified from this package's dist`,
					};
				}
				const target = resolveSpecifierPath(canonical, imported.from, declarationFiles);
				if (target === null) {
					return {
						ok: false,
						reason: `cannot resolve ${JSON.stringify(imported.from)} from ${rel(canonical)}${declarationFiles ? ' (as a declaration file)' : ''}`,
					};
				}
				return resolveFrom(target, imported.imported);
			}

			return {
				ok: false,
				reason: `${name} is bound to ${localName} in ${rel(canonical)} without a static string initializer`,
			};
		};

		const binding = bindings.get(name);
		if (binding) {
			if (binding.from !== null) {
				if (!binding.from.startsWith('.')) {
					return {
						ok: false,
						reason: `${name} is re-exported from external module ${JSON.stringify(binding.from)} in ${rel(canonical)}; its value cannot be verified from this package's dist`,
					};
				}
				const target = resolveSpecifierPath(canonical, binding.from, declarationFiles);
				if (target === null) {
					return {
						ok: false,
						reason: `cannot resolve ${JSON.stringify(binding.from)} from ${rel(canonical)}${declarationFiles ? ' (as a declaration file)' : ''}`,
					};
				}
				return resolveFrom(target, binding.local);
			}
			return resolveLocal(binding.local);
		}

		// Declaration-form export: `export const NAME = "…"` or the emitted
		// `export declare const NAME = "…"` carries the binding directly.
		const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const declarationExport = new RegExp(
			`(?<![\\w$])export\\s+(?:declare\\s+)?(?:const|let|var)\\s+${escapedName}(?![\\w$])`
		);
		if (declarationExport.test(scan.code)) {
			return resolveLocal(name);
		}

		// No explicit binding: the name may still arrive through `export *`.
		/** @type {Array<{ ok: true, value: string }>} */
		const found = [];
		for (const match of scan.code.matchAll(/(?<![\w$])export\s*\*\s*from\s*(['"])/g)) {
			const specifier = scan.readLiteral((match.index ?? 0) + match[0].length - 1).value;
			if (!specifier.startsWith('.')) continue;
			const target = resolveSpecifierPath(canonical, specifier, declarationFiles);
			if (target === null) continue;
			const result = resolveFrom(target, name);
			if (result.ok) found.push(result);
		}
		if (found.length === 1) return found[0] ?? { ok: false, reason: 'unreachable' };
		if (found.length > 1) {
			return {
				ok: false,
				reason: `${name} arrives through ${found.length} star re-exports reachable from ${rel(canonical)}; the value is ambiguous`,
			};
		}
		return {
			ok: false,
			reason: `${rel(canonical)} does not export ${name} through any statically resolvable chain`,
		};
	}

	return resolveFrom(entryPath, exportedName);
}

/**
 * Proves the pinned #1055 values against the built graphs of both entries:
 * each name in {@link EXPECTED_PINNED_VALUES} must resolve through the
 * `dist/index.js` runtime graph and the `dist/index.d.ts` types graph to
 * exactly the expected value. Returns one problem string per failure —
 * resolution failures (fail-closed) and value mutations alike.
 *
 * @param {string} jsEntry
 * @param {string} dtsEntry
 * @param {Readonly<Record<string, string>>} [expected]
 * @returns {string[]}
 */
export function auditPinnedValues(jsEntry, dtsEntry, expected = EXPECTED_PINNED_VALUES) {
	const problems = [];
	for (const [name, expectedValue] of Object.entries(expected)) {
		const checks = [
			{ entry: jsEntry, graph: 'dist/index.js', options: {} },
			{ entry: dtsEntry, graph: 'dist/index.d.ts', options: { declarationFiles: true } },
		];
		for (const { entry, graph, options } of checks) {
			const result = resolveExportedStringValue(entry, name, options);
			if (!result.ok) {
				problems.push(`${graph} cannot prove the pinned value of ${name}: ${result.reason}`);
			} else if (result.value !== expectedValue) {
				problems.push(
					`${graph} value mutation detected: ${name} resolves to ${JSON.stringify(result.value)}; the pinned #1055 wording is ${JSON.stringify(expectedValue)}`
				);
			}
		}
	}
	return problems;
}

/**
 * Resolves the complete export surface of an entry module by following
 * relative `export *` re-exports (cycle-safe). Non-relative star targets are
 * external packages and contribute nothing this script can verify.
 *
 * @param {string} entryPath
 * @returns {Set<string>}
 */
export function resolveExportSurface(entryPath) {
	const names = new Set();
	const seen = new Set();
	const queue = [entryPath];

	while (queue.length > 0) {
		const current = queue.shift();
		if (current === undefined) continue;
		const canonical = path.resolve(current);
		if (seen.has(canonical)) continue;
		seen.add(canonical);

		const { names: own, starFrom } = collectModuleExports(fs.readFileSync(canonical, 'utf8'));
		for (const name of own) names.add(name);

		for (const target of starFrom) {
			if (!target.startsWith('.')) continue;
			queue.push(path.resolve(path.dirname(canonical), target));
		}
	}

	return names;
}

/**
 * Returns the required names missing from an export surface.
 *
 * @param {Set<string>} surface
 * @param {string[]} [required]
 * @returns {string[]}
 */
export function missingRequiredExports(surface, required = REQUIRED_PUBLIC_EXPORTS) {
	return required.filter((name) => !surface.has(name));
}

/**
 * Returns every root condition whose value differs from the required map.
 *
 * @param {{ [key: string]: unknown } | null | undefined} exportsField
 * @param {{ [condition: string]: string }} [required]
 * @returns {Array<{ condition: string, expected: string, actual: unknown }>}
 */
export function mismatchedRootConditions(exportsField, required = REQUIRED_ROOT_CONDITIONS) {
	const root =
		exportsField && typeof exportsField['.'] === 'object' && exportsField['.'] !== null
			? /** @type {{ [condition: string]: unknown }} */ (exportsField['.'])
			: undefined;
	return Object.entries(required)
		.filter(([condition, expected]) => root?.[condition] !== expected)
		.map(([condition, expected]) => ({
			condition,
			expected,
			actual: root?.[condition] ?? '(absent)',
		}));
}

/**
 * @param {string[]} messages
 * @returns {never}
 */
function fail(messages) {
	for (const message of messages) {
		console.error(`dist public-export parity: ${message}`);
	}
	process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
	const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
	/** @type {string[]} */
	const errors = [];

	const mismatches = mismatchedRootConditions(pkg.exports);
	for (const { condition, expected, actual } of mismatches) {
		errors.push(
			`package.json exports["."].${condition} is ${actual}; expected ${expected} so consumers resolve the built surface`
		);
	}

	const jsEntry = path.join(packageDir, 'dist', 'index.js');
	const dtsEntry = path.join(packageDir, 'dist', 'index.d.ts');
	for (const entry of [jsEntry, dtsEntry]) {
		if (!fs.existsSync(entry)) {
			errors.push(`${path.relative(packageDir, entry)} is missing; run pnpm build first`);
		}
	}

	if (errors.length === 0) {
		for (const entry of [jsEntry, dtsEntry]) {
			const surface = resolveExportSurface(entry);
			const missing = missingRequiredExports(surface);
			if (missing.length > 0) {
				errors.push(
					`${path.relative(packageDir, entry)} does not export ${missing.join(', ')} — ` +
						'the built package root must carry the pinned #1055 review exports'
				);
			}
		}
	}

	if (errors.length === 0) {
		errors.push(...auditPinnedValues(jsEntry, dtsEntry));
	}

	if (errors.length > 0) fail(errors);

	console.log(
		`dist public-export parity holds: exports["."] conditions route to the built surface; ` +
			`dist/index.js + dist/index.d.ts export ${REQUIRED_PUBLIC_EXPORTS.join(', ')}; and the ` +
			'values resolved through both built graphs exactly match the pinned #1055 wording in ' +
			'EXPECTED_PINNED_VALUES.'
	);
}
