#!/usr/bin/env node
/**
 * Fail-closed verification that the built Blog package publicly exports the
 * pinned #1055 review constants with their exact runtime and declaration values.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const REQUIRED_PUBLIC_EXPORTS = [
	'REVIEW_STALE_APPROVAL_LABEL',
	'REVIEW_STALE_APPROVAL_DETAIL',
	'REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL',
	'REVIEW_STATE_QUALIFIER',
];

export const REQUIRED_ROOT_CONDITIONS = {
	types: './dist/index.d.ts',
	svelte: './src/index.ts',
	import: './dist/index.js',
};

export const EXPECTED_PINNED_VALUES = Object.freeze({
	REVIEW_STALE_APPROVAL_LABEL: 'Latest verdict: Approved (superseded)',
	REVIEW_STALE_APPROVAL_DETAIL:
		'This approval no longer counts. Approval for the current revision is outstanding.',
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL:
		'This approval no longer counts. Principal approval for the current revision is outstanding.',
	REVIEW_STATE_QUALIFIER: 'latest activity, not publication state',
});

/** @param {import('typescript').Node} node */
const hasExportModifier = (node) =>
	(ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined)?.some(
		(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
	) === true;

/** @param {import('typescript').Node | undefined} node */
const identifierName = (node) => (node && ts.isIdentifier(node) ? node.text : null);

/** @param {import('typescript').Expression | undefined} node */
const literalText = (node) => {
	if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
		return node.text;
	}
	return null;
};

/** @param {string} root @param {string} target */
function isContained(root, target) {
	const relative = path.relative(root, target);
	return (
		relative === '' ||
		(!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
	);
}

/** @param {string} file @param {string} root */
function displayPath(file, root) {
	const relative = path.relative(root, file);
	return relative === '' ? path.basename(file) : relative;
}

/**
 * Parse a JS/TS module once with the repository's pinned TypeScript compiler.
 * Syntax diagnostics are bounded and contain no stack or source dump.
 *
 * @param {string} file
 * @param {string} root
 */
function parseModule(file, root) {
	let source;
	try {
		source = fs.readFileSync(file, 'utf8');
	} catch {
		throw new Error(`${displayPath(file, root)} does not exist or cannot be read`);
	}
	const scriptKind = file.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
	const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);
	const diagnostics =
		/** @type {{ parseDiagnostics: import('typescript').DiagnosticWithLocation[] }} */ (
			/** @type {unknown} */ (ast)
		).parseDiagnostics;
	if (diagnostics.length > 0) {
		const details = diagnostics.slice(0, 3).map((diagnostic) => {
			const position = ast.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
			const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ');
			return `${position.line + 1}:${position.character + 1} ${message}`;
		});
		const omitted = diagnostics.length - details.length;
		throw new Error(
			`${displayPath(file, root)} has invalid syntax: ${details.join('; ')}${omitted > 0 ? `; ${omitted} more diagnostic(s)` : ''}`
		);
	}

	/** @type {Map<string, Array<{ local: string, from: string | null }>>} */
	const exports = new Map();
	/** @type {Map<string, Array<{ imported: string, from: string }>>} */
	const imports = new Map();
	/** @type {Map<string, Array<string | null>>} */
	const declarations = new Map();
	/** @type {Set<string>} */
	const exportedDeclarations = new Set();
	/** @type {string[]} */
	const stars = [];
	/** @type {Set<string>} */
	const surface = new Set();

	/** @template T @param {Map<string, T[]>} map @param {string} name @param {T} value */
	function add(map, name, value) {
		map.set(name, [...(map.get(name) ?? []), value]);
	}

	for (const statement of ast.statements) {
		if (ts.isImportDeclaration(statement)) {
			const from = literalText(statement.moduleSpecifier);
			if (from === null) continue;
			const bindings = statement.importClause?.namedBindings;
			if (bindings && ts.isNamedImports(bindings)) {
				for (const specifier of bindings.elements) {
					add(imports, specifier.name.text, {
						imported: specifier.propertyName?.text ?? specifier.name.text,
						from,
					});
				}
			}
			continue;
		}

		if (ts.isExportDeclaration(statement)) {
			const from = statement.moduleSpecifier ? literalText(statement.moduleSpecifier) : null;
			if (statement.moduleSpecifier && from === null) {
				throw new Error(`${displayPath(file, root)} has a non-literal export target`);
			}
			if (!statement.exportClause) {
				if (from === null)
					throw new Error(`${displayPath(file, root)} has an unresolved star export`);
				stars.push(from);
				continue;
			}
			if (ts.isNamespaceExport(statement.exportClause)) {
				surface.add(statement.exportClause.name.text);
				continue;
			}
			for (const specifier of statement.exportClause.elements) {
				const exported = specifier.name.text;
				const local = specifier.propertyName?.text ?? exported;
				add(exports, exported, { local, from });
				surface.add(exported);
			}
			continue;
		}

		if (ts.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				const name = identifierName(declaration.name);
				if (name === null) continue;
				add(declarations, name, literalText(declaration.initializer));
				if (hasExportModifier(statement)) {
					exportedDeclarations.add(name);
					surface.add(name);
				}
			}
			continue;
		}

		if (
			ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isInterfaceDeclaration(statement) ||
			ts.isTypeAliasDeclaration(statement) ||
			ts.isEnumDeclaration(statement) ||
			ts.isModuleDeclaration(statement)
		) {
			const named = identifierName(statement.name);
			if (named !== null && hasExportModifier(statement)) surface.add(named);
		}
	}

	return { exports, imports, declarations, exportedDeclarations, stars, surface };
}

/**
 * Build a resolver whose entire readable graph is constrained to one canonical
 * dist root. Relative `..`, absolute/external targets, missing files, and
 * symlink escapes are rejected before a target can contribute an export.
 *
 * @param {string} entryPath
 * @param {{ declarationFiles?: boolean, distRoot?: string }} options
 */
function createGraph(entryPath, options = {}) {
	const declarationFiles = options.declarationFiles === true;
	const requestedRoot = path.resolve(options.distRoot ?? path.dirname(entryPath));
	/** @type {string} */
	let root;
	try {
		root = fs.realpathSync(requestedRoot);
	} catch {
		throw new Error(`dist root ${requestedRoot} does not exist or cannot be read`);
	}
	const cache = new Map();

	/** @param {string} candidate */
	function canonicalFile(candidate) {
		let canonical;
		try {
			canonical = fs.realpathSync(candidate);
		} catch {
			throw new Error(`${displayPath(candidate, root)} does not exist or cannot be read`);
		}
		if (!isContained(root, canonical)) {
			throw new Error(`${displayPath(candidate, root)} resolves outside this package's dist root`);
		}
		let stat;
		try {
			stat = fs.statSync(canonical);
		} catch {
			throw new Error(`${displayPath(candidate, root)} cannot be inspected`);
		}
		if (!stat.isFile()) throw new Error(`${displayPath(candidate, root)} is not a file`);
		return canonical;
	}

	const entry = canonicalFile(path.resolve(entryPath));

	/** @param {string} fromFile @param {string} specifier */
	function resolveTarget(fromFile, specifier) {
		if (path.isAbsolute(specifier) || !specifier.startsWith('.')) {
			throw new Error(
				`${JSON.stringify(specifier)} from ${displayPath(fromFile, root)} is external or absolute`
			);
		}
		if (specifier.split(/[\\/]/).includes('..')) {
			throw new Error(
				`${JSON.stringify(specifier)} from ${displayPath(fromFile, root)} contains a forbidden .. segment`
			);
		}
		let target = path.resolve(path.dirname(fromFile), specifier);
		if (declarationFiles) {
			if (specifier.endsWith('.js')) target = `${target.slice(0, -3)}.d.ts`;
			else if (!specifier.endsWith('.d.ts')) {
				throw new Error(
					`${JSON.stringify(specifier)} from ${displayPath(fromFile, root)} is not a declaration target`
				);
			}
		}
		return canonicalFile(target);
	}

	/** @param {string} file */
	function moduleFor(file) {
		const canonical = canonicalFile(file);
		if (!cache.has(canonical)) cache.set(canonical, parseModule(canonical, root));
		return cache.get(canonical);
	}

	return { entry, root, resolveTarget, moduleFor };
}

/**
 * @param {string} entryPath
 * @param {string} exportedName
 * @param {{ declarationFiles?: boolean, distRoot?: string }} [options]
 * @returns {{ ok: true, value: string } | { ok: false, reason: string }}
 */
export function resolveExportedStringValue(entryPath, exportedName, options = {}) {
	try {
		const graph = createGraph(entryPath, options);

		/**
		 * @param {string} file
		 * @param {string} name
		 * @param {Set<string>} trail
		 * @returns {string}
		 */
		function resolveFrom(file, name, trail) {
			const key = `${file}\u0000${name}`;
			if (trail.has(key)) {
				throw new Error(`circular export chain for ${name} at ${displayPath(file, graph.root)}`);
			}
			const nextTrail = new Set(trail).add(key);
			const module = graph.moduleFor(file);

			/** @param {string} local @returns {string} */
			function resolveLocal(local) {
				const declarations = module.declarations.get(local) ?? [];
				const imported = module.imports.get(local) ?? [];
				if (
					declarations.length > 1 ||
					imported.length > 1 ||
					(declarations.length && imported.length)
				) {
					throw new Error(`ambiguous binding ${local} in ${displayPath(file, graph.root)}`);
				}
				if (declarations.length === 1) {
					const value = declarations[0];
					if (value === null) {
						throw new Error(
							`binding ${local} in ${displayPath(file, graph.root)} is not one string literal`
						);
					}
					return value;
				}
				if (imported.length === 1) {
					const binding = imported[0];
					return resolveFrom(graph.resolveTarget(file, binding.from), binding.imported, nextTrail);
				}
				throw new Error(
					`binding ${local} in ${displayPath(file, graph.root)} has no static string value`
				);
			}

			const explicit = module.exports.get(name) ?? [];
			if (explicit.length > 1) {
				throw new Error(`ambiguous duplicate export ${name} in ${displayPath(file, graph.root)}`);
			}
			if (explicit.length === 1) {
				const binding = explicit[0];
				return binding.from === null
					? resolveLocal(binding.local)
					: resolveFrom(graph.resolveTarget(file, binding.from), binding.local, nextTrail);
			}
			if (module.exportedDeclarations.has(name)) return resolveLocal(name);

			/** @type {string[]} */
			const values = [];
			for (const specifier of module.stars) {
				const target = graph.resolveTarget(file, specifier);
				try {
					values.push(resolveFrom(target, name, nextTrail));
				} catch (error) {
					const reason = error instanceof Error ? error.message : String(error);
					if (!reason.includes(`does not export ${name}`)) throw error;
				}
			}
			if (values.length > 1) {
				throw new Error(
					`${name} arrives through multiple star exports in ${displayPath(file, graph.root)}`
				);
			}
			if (values.length === 1) return /** @type {string} */ (values[0]);
			throw new Error(`${displayPath(file, graph.root)} does not export ${name}`);
		}

		return { ok: true, value: resolveFrom(graph.entry, exportedName, new Set()) };
	} catch (error) {
		return { ok: false, reason: error instanceof Error ? error.message : String(error) };
	}
}

/**
 * @param {string} jsEntry
 * @param {string} dtsEntry
 * @param {Readonly<Record<string, string>>} [expected]
 */
export function auditPinnedValues(jsEntry, dtsEntry, expected = EXPECTED_PINNED_VALUES) {
	const problems = [];
	const distRoot = path.dirname(jsEntry);
	for (const [name, expectedValue] of Object.entries(expected)) {
		for (const check of [
			{ entry: jsEntry, graph: 'dist/index.js', declarationFiles: false },
			{ entry: dtsEntry, graph: 'dist/index.d.ts', declarationFiles: true },
		]) {
			const result = resolveExportedStringValue(check.entry, name, {
				declarationFiles: check.declarationFiles,
				distRoot,
			});
			if (!result.ok) {
				problems.push(`${check.graph} cannot prove the pinned value of ${name}: ${result.reason}`);
			} else if (result.value !== expectedValue) {
				problems.push(
					`${check.graph} value mutation detected: ${name} resolves to ${JSON.stringify(result.value)}; the pinned #1055 wording is ${JSON.stringify(expectedValue)}`
				);
			}
		}
	}
	return problems;
}

/** @param {string} entryPath @param {{ declarationFiles?: boolean, distRoot?: string }} [options] */
export function resolveExportSurface(entryPath, options = {}) {
	const graph = createGraph(entryPath, options);
	const names = new Set();
	const seen = new Set();
	const active = new Set();

	/** @param {string} file */
	function visit(file) {
		if (active.has(file))
			throw new Error(`circular star export at ${displayPath(file, graph.root)}`);
		if (seen.has(file)) return;
		active.add(file);
		const module = graph.moduleFor(file);
		for (const name of module.surface) names.add(name);
		for (const specifier of module.stars) visit(graph.resolveTarget(file, specifier));
		active.delete(file);
		seen.add(file);
	}

	visit(graph.entry);
	return names;
}

/** @param {Set<string>} surface @param {string[]} [required] */
export function missingRequiredExports(surface, required = REQUIRED_PUBLIC_EXPORTS) {
	return required.filter((name) => !surface.has(name));
}

/**
 * @param {Record<string, unknown> | null | undefined} exportsField
 * @param {Record<string, string>} [required]
 */
export function mismatchedRootConditions(exportsField, required = REQUIRED_ROOT_CONDITIONS) {
	const root =
		exportsField && typeof exportsField['.'] === 'object' && exportsField['.'] !== null
			? /** @type {Record<string, unknown>} */ (exportsField['.'])
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
 * Condition keys declared under `exports['.']` beyond the exact allowed set.
 *
 * The package root must declare exactly the pinned conditions and nothing else:
 * an extra `default`, `require`, `node`, or unknown/nested condition gives a
 * consumer resolution mode a second entry point that can shadow the audited
 * built surface, so any extra key fails closed here. The set comparison is
 * order-independent — the result is sorted so diagnostics are stable no matter
 * how the map is serialized.
 *
 * @param {Record<string, unknown> | null | undefined} exportsField
 * @param {Record<string, string>} [required]
 * @returns {string[]}
 */
export function extraRootConditions(exportsField, required = REQUIRED_ROOT_CONDITIONS) {
	const root =
		exportsField && typeof exportsField['.'] === 'object' && exportsField['.'] !== null
			? /** @type {Record<string, unknown>} */ (exportsField['.'])
			: undefined;
	if (typeof root !== 'object' || root === null) return [];
	const allowed = new Set(Object.keys(required));
	return Object.keys(root)
		.filter((condition) => !allowed.has(condition))
		.sort();
}

/** @param {string[]} messages @returns {never} */
function fail(messages) {
	for (const message of messages.slice(0, 20))
		console.error(`dist public-export parity: ${message}`);
	if (messages.length > 20)
		console.error(`dist public-export parity: ${messages.length - 20} more error(s)`);
	process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
	const distRoot = path.join(packageDir, 'dist');
	const errors = [];
	let pkg;
	try {
		pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
	} catch (error) {
		fail([
			`package.json cannot be read: ${error instanceof Error ? error.message : String(error)}`,
		]);
	}
	for (const { condition, expected, actual } of mismatchedRootConditions(pkg.exports)) {
		errors.push(
			`package.json exports["."].${condition} is ${actual}; expected ${expected} so consumers resolve the built surface`
		);
	}
	for (const condition of extraRootConditions(pkg.exports)) {
		errors.push(
			`package.json exports["."] declares extra condition ${JSON.stringify(condition)}; allowed conditions are exactly ${Object.keys(REQUIRED_ROOT_CONDITIONS).join(', ')}`
		);
	}

	const jsEntry = { file: path.join(distRoot, 'index.js'), declarationFiles: false };
	const dtsEntry = { file: path.join(distRoot, 'index.d.ts'), declarationFiles: true };
	const entries = [jsEntry, dtsEntry];
	for (const entry of entries) {
		try {
			const surface = resolveExportSurface(entry.file, { ...entry, distRoot });
			const missing = missingRequiredExports(surface);
			if (missing.length > 0)
				errors.push(`${path.basename(entry.file)} does not export ${missing.join(', ')}`);
		} catch (error) {
			errors.push(error instanceof Error ? error.message : String(error));
		}
	}
	if (errors.length === 0) errors.push(...auditPinnedValues(jsEntry.file, dtsEntry.file));
	if (errors.length > 0) fail(errors);

	console.log(
		`dist public-export parity holds: package conditions and both built graphs export ${REQUIRED_PUBLIC_EXPORTS.join(', ')} with the exact pinned #1055 values.`
	);
}
