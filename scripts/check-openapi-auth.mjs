#!/usr/bin/env node
/**
 * OpenAPI Auth Contract Probe — CSR-041.
 *
 * Audits `docs/lesser/contracts/openapi.yaml` for sensitive REST endpoints
 * (POST, PUT, DELETE, PATCH, and private-data GET probes) that are missing a
 * `security:` block.
 * The pinned OpenAPI snapshot is a generated contract from Lesser (upstream);
 * Greater must not hand-edit it to add auth requirements.
 *
 * This probe:
 * - Flags every sensitive verb+path without `security:`.
 * - Compares against a committable baseline (`openapi-auth-baseline.json`)
 *   that records the exact endpoints known to lack auth metadata.
 * - New gaps (not in the baseline) exit non-zero so CI can catch regressions
 *   after resync.
 * - Known gaps exit zero with a warning — the fix belongs in Lesser's route
 *   contracts, not here.
 *
 * USAGE:
 *   node scripts/check-openapi-auth.mjs [--baseline PATH] [--strict] [--self-test]
 *
 *   --baseline  Path to baseline JSON (default: docs/lesser/contracts/openapi-auth-baseline.json)
 *   --strict    Treat known upstream gaps as errors (exit non-zero)
 *   --write-baseline  Update the baseline to reflect current state
 *   --self-test       Run the built-in regression test
 */

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ── Paths ──────────────────────────────────────────────────────────────────
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const __dirname = dirname(SCRIPT_PATH);
const ROOT = resolve(__dirname, '..');
const DEFAULT_SPEC = resolve(ROOT, 'docs', 'lesser', 'contracts', 'openapi.yaml');
const DEFAULT_BASELINE = resolve(ROOT, 'docs', 'lesser', 'contracts', 'openapi-auth-baseline.json');

// ── Known public endpoints ─────────────────────────────────────────────────
const MUTATING_METHODS = new Set(['post', 'put', 'delete', 'patch']);

const KNOWN_PUBLIC_PATHS = new Map([
	['POST /api/v1/accounts', 'public account registration'],
	['POST /api/v1/apps', 'OAuth app registration (public)'],
	['POST /api/v1/auth/webauthn/login/begin', 'WebAuthn login challenge (no prior auth)'],
	['POST /api/v1/auth/webauthn/login/finish', 'WebAuthn login completion (no prior auth)'],
	['POST /auth/wallet/challenge', 'wallet auth challenge (no prior auth)'],
	['POST /auth/wallet/login', 'wallet login (no prior auth)'],
	['POST /auth/wallet/verify', 'wallet verification (no prior auth)'],
	['GET /oauth/authorize', 'OAuth authorization flow'],
	['POST /oauth/authorize', 'OAuth authorization flow'],
	['POST /oauth/consent', 'OAuth consent flow'],
	['POST /oauth/device/code', 'OAuth device code flow'],
	['POST /oauth/device/verify', 'OAuth device verification flow'],
	['POST /oauth/register', 'OAuth dynamic client registration'],
	['POST /oauth/revoke', 'OAuth token revocation'],
	['POST /oauth/token', 'OAuth token exchange'],
	['POST /inbox', 'shared ActivityPub inbox (HTTP Signatures, not bearer)'],
	['POST /users/{username}/inbox', 'user ActivityPub inbox (HTTP Signatures, not bearer)'],
	['POST /users/{username}/outbox', 'user ActivityPub outbox (HTTP Signatures, not bearer)'],
	['POST /api/v1/agents/register', 'agent registration (wallet challenge auth)'],
	['POST /api/v1/agents/register/challenge', 'agent registration challenge (public)'],
	['POST /api/v1/agents/auth/challenge', 'agent auth challenge (public)'],
	['POST /api/v1/agents/auth/token', 'agent auth token exchange (public)'],
	['POST /setup/bootstrap/challenge', 'setup bootstrap challenge (no prior auth)'],
	['POST /setup/bootstrap/verify', 'setup bootstrap verification (no prior auth)'],
]);

// Sensitive GET endpoints that expose private data and must carry bearer auth.
// Keep this list targeted: many GET endpoints in the Lesser OpenAPI snapshot are
// public by design, but these export endpoints expose user export metadata or
// download redirects. The upstream generator/security fix is tracked in
// equaltoai/lesser#1121; Greater tracks the gap here until the next contract sync.
const SENSITIVE_GET_PATHS = new Map([
	[
		'/api/v1/exports',
		'Private export listing exposes account export jobs; pending upstream root fix equaltoai/lesser#1121.',
	],
	[
		'/api/v1/exports/{id}',
		'Private export status exposes account export metadata; pending upstream root fix equaltoai/lesser#1121.',
	],
	[
		'/api/v1/exports/{id}/download',
		'Private export download exposes account export data; pending upstream root fix equaltoai/lesser#1121.',
	],
]);

// ── Helpers ────────────────────────────────────────────────────────────────

function loadOpenapi(specPath) {
	const text = readFileSync(specPath, 'utf-8');
	return parseYaml(text);
}

function isPublicByDesign(method, path) {
	const key = `${method.toUpperCase()} ${path}`;
	if (KNOWN_PUBLIC_PATHS.has(key)) {
		return KNOWN_PUBLIC_PATHS.get(key);
	}
	return null;
}

function isSensitiveOperation(method, path) {
	const normalized = method.toLowerCase();
	return MUTATING_METHODS.has(normalized) || (normalized === 'get' && SENSITIVE_GET_PATHS.has(path));
}

function getSensitiveGetNote(method, path) {
	return method.toLowerCase() === 'get' ? (SENSITIVE_GET_PATHS.get(path) ?? null) : null;
}

function auditAuth(spec) {
	const paths = spec.paths ?? {};
	const schemes = spec.components?.securitySchemes ?? {};
	const globalSecurity = spec.security;

	const gaps = [];
	let sensitiveChecked = 0;
	let withSecurity = 0;
	let withoutSecurity = 0;

	for (const [rawPath, methods] of Object.entries(paths).sort(([a], [b]) => a.localeCompare(b))) {
		if (typeof methods !== 'object' || methods === null) continue;
		for (const [method, details] of Object.entries(methods)) {
			if (!isSensitiveOperation(method, rawPath)) continue;

			sensitiveChecked++;
			const hasSec = 'security' in details;

			if (!hasSec) {
				const reason = isPublicByDesign(method, rawPath);
				if (reason) {
					// Intentionally public — not a gap
					continue;
				}
				withoutSecurity++;
				const gap = {
					method: method.toUpperCase(),
					path: rawPath,
					tags: details.tags ?? [],
				};
				const note = getSensitiveGetNote(method, rawPath);
				if (note) {
					gap.note = note;
				}
				gaps.push(gap);
			} else {
				withSecurity++;
			}
		}
	}

	return {
		gaps: gaps.sort((a, b) => a.path.localeCompare(b.path)),
		hasGlobalSecurity: globalSecurity !== undefined,
		hasSecuritySchemes: Object.keys(schemes).length > 0,
		securitySchemeNames: Object.keys(schemes),
		totalPaths: Object.keys(paths).length,
		sensitiveChecked,
		withSecurity,
		withoutSecurity,
	};
}

function loadBaseline(baselinePath) {
	try {
		const data = JSON.parse(readFileSync(baselinePath, 'utf-8'));
		return new Set((data.known_gaps ?? []).map((g) => `${g.method} ${g.path}`));
	} catch {
		return new Set();
	}
}

function partitionGapsByBaseline(gaps, knownGapKeys) {
	const newGaps = [];
	const knownGaps = [];
	for (const gap of gaps) {
		const key = `${gap.method} ${gap.path}`;
		if (knownGapKeys.has(key)) {
			knownGaps.push(gap);
		} else {
			newGaps.push(gap);
		}
	}
	return { newGaps, knownGaps };
}

function assertSelfTest(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function runSelfTest() {
	const spec = loadOpenapi(DEFAULT_SPEC);
	const knownGapKeys = loadBaseline(DEFAULT_BASELINE);
	const rotateSecretKey = 'POST /api/v1/apps/{id}/rotate_secret';
	const publicRootKeys = [
		'POST /api/v1/apps',
		'POST /oauth/consent',
		'POST /oauth/device/code',
		'POST /oauth/device/verify',
		'POST /oauth/register',
		'POST /oauth/revoke',
		'POST /oauth/token',
	];
	const exportGetKeys = [
		'GET /api/v1/exports',
		'GET /api/v1/exports/{id}',
		'GET /api/v1/exports/{id}/download',
	];

	const rotateSecret = spec.paths?.['/api/v1/apps/{id}/rotate_secret']?.post;
	assertSelfTest(
		rotateSecret && typeof rotateSecret === 'object',
		'self-test fixture missing POST /api/v1/apps/{id}/rotate_secret'
	);
	assertSelfTest(
		'security' in rotateSecret,
		'self-test fixture expected rotate_secret to have a security block before mutation'
	);
	assertSelfTest(
		!isPublicByDesign('post', '/api/v1/apps/{id}/rotate_secret'),
		'rotate_secret must not be exempted by the public allowlist'
	);
	assertSelfTest(
		!isPublicByDesign('post', '/oauth/protected/subresource'),
		'unknown OAuth subresources must not be exempted by the public allowlist'
	);

	const current = auditAuth(spec);
	const currentPartition = partitionGapsByBaseline(current.gaps, knownGapKeys);
	for (const key of publicRootKeys) {
		assertSelfTest(
			!current.gaps.some((gap) => `${gap.method} ${gap.path}` === key),
			`genuinely public endpoint should remain exempt: ${key}`
		);
	}
	for (const key of exportGetKeys) {
		assertSelfTest(
			current.gaps.some((gap) => `${gap.method} ${gap.path}` === key),
			`sensitive private-data GET should be audited as an auth gap: ${key}`
		);
		assertSelfTest(
			currentPartition.knownGaps.some((gap) => `${gap.method} ${gap.path}` === key),
			`sensitive private-data GET should be baselined as a known gap: ${key}`
		);
		assertSelfTest(
			!currentPartition.newGaps.some((gap) => `${gap.method} ${gap.path}` === key),
			`sensitive private-data GET should not be classified as NEW when baselined: ${key}`
		);
	}

	const stripped = structuredClone(spec);
	delete stripped.paths['/api/v1/apps/{id}/rotate_secret'].post.security;
	const strippedResult = auditAuth(stripped);
	const { newGaps } = partitionGapsByBaseline(strippedResult.gaps, knownGapKeys);
	assertSelfTest(
		newGaps.some((gap) => `${gap.method} ${gap.path}` === rotateSecretKey),
		'stripping rotate_secret security should produce a NEW auth gap'
	);

	const tempDir = mkdtempSync(resolve(tmpdir(), 'greater-openapi-auth-'));
	try {
		const tempSpecPath = resolve(tempDir, 'openapi.yaml');
		writeFileSync(tempSpecPath, stringifyYaml(stripped), 'utf-8');
		const child = spawnSync(
			process.execPath,
			[SCRIPT_PATH, '--spec', tempSpecPath, '--baseline', DEFAULT_BASELINE],
			{ encoding: 'utf-8' }
		);
		if (child.error) {
			throw child.error;
		}

		const combinedOutput = `${child.stdout}\n${child.stderr}`;
		assertSelfTest(
			child.status === 1,
			`stripped rotate_secret check should exit 1, got ${child.status ?? 'null'}`
		);
		assertSelfTest(
			combinedOutput.includes('NEW gaps') &&
				combinedOutput.includes('/api/v1/apps/{id}/rotate_secret'),
			'stripped rotate_secret check should report rotate_secret under NEW gaps'
		);

		const tempBaselinePath = resolve(tempDir, 'openapi-auth-baseline.json');
		const baseline = JSON.parse(readFileSync(DEFAULT_BASELINE, 'utf-8'));
		const removedExportKey = 'GET /api/v1/exports/{id}/download';
		baseline.known_gaps = baseline.known_gaps.filter(
			(gap) => `${gap.method} ${gap.path}` !== removedExportKey
		);
		writeFileSync(tempBaselinePath, JSON.stringify(baseline, null, 2) + '\n', 'utf-8');

		const exportChild = spawnSync(
			process.execPath,
			[SCRIPT_PATH, '--baseline', tempBaselinePath],
			{ encoding: 'utf-8' }
		);
		if (exportChild.error) {
			throw exportChild.error;
		}

		const exportOutput = `${exportChild.stdout}\n${exportChild.stderr}`;
		assertSelfTest(
			exportChild.status === 1,
			`missing export GET baseline check should exit 1, got ${exportChild.status ?? 'null'}`
		);
		assertSelfTest(
			exportOutput.includes('NEW gaps') &&
				exportOutput.includes('/api/v1/exports/{id}/download'),
			'missing export GET baseline check should report export download under NEW gaps'
		);
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}

	console.log(
		'Self-test passed: rotate_secret security removal is a new gap; export GET gaps are audited/baselined; exact public paths remain exempt.'
	);
}

function writeBaseline(baselinePath, gaps, meta) {
	const baseline = {
		_comment:
			'Auth gap baseline for docs/lesser/contracts/openapi.yaml. ' +
			'Each entry is an endpoint missing a `security:` block in the ' +
			"pinned Lesser OpenAPI snapshot. The fix belongs in Lesser's " +
			'route contracts. Do not hand-edit openapi.yaml in Greater.',
		_instructions:
			'When Lesser publishes a release with auth metadata fixes, ' +
			'resync this snapshot and regenerate this baseline via: ' +
			'node scripts/check-openapi-auth.mjs --write-baseline',
		known_gaps: gaps.sort((a, b) => a.path.localeCompare(b.path)),
		meta,
	};
	writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + '\n', 'utf-8');
}

// ── CLI ────────────────────────────────────────────────────────────────────

function printUsage() {
	console.error('Usage: node scripts/check-openapi-auth.mjs [options]');
	console.error('');
	console.error('Options:');
	console.error('  --spec PATH         Path to OpenAPI YAML spec');
	console.error('  --baseline PATH     Path to baseline JSON');
	console.error('  --strict            Treat known upstream gaps as errors');
	console.error('  --write-baseline    Update the baseline to reflect current state');
	console.error('  --self-test         Run the built-in regression test');
	console.error('  --help              Show this help');
}

function parseCliArgs() {
	// parseArgs in Node 24
	const { values } = parseArgs({
		options: {
			spec: { type: 'string' },
			baseline: { type: 'string' },
			strict: { type: 'boolean', default: false },
			'write-baseline': { type: 'boolean', default: false },
			'self-test': { type: 'boolean', default: false },
			help: { type: 'boolean', default: false },
		},
		allowPositionals: false,
		strict: false,
	});
	return values;
}

function main() {
	const args = parseCliArgs();

	if (args.help) {
		printUsage();
		process.exit(0);
	}

	if (args['self-test']) {
		runSelfTest();
		process.exit(0);
	}

	const specPath = args.spec ?? DEFAULT_SPEC;
	const baselinePath = args.baseline ?? DEFAULT_BASELINE;

	// Check that spec exists
	try {
		readFileSync(specPath);
	} catch {
		console.error(`ERROR: spec not found: ${specPath}`);
		process.exit(2);
	}

	const spec = loadOpenapi(specPath);
	const result = auditAuth(spec);

	// ── Write baseline mode ──────────────────────────────────────────────
	if (args['write-baseline']) {
		const meta = {
			spec_path: specPath,
			generated_at: new Date().toISOString(),
			has_global_security: result.hasGlobalSecurity,
			has_security_schemes: result.hasSecuritySchemes,
			security_scheme_names: result.securitySchemeNames,
			total_paths: result.totalPaths,
			sensitive_checked: result.sensitiveChecked,
			with_security: result.withSecurity,
			without_security: result.withoutSecurity,
		};
		writeBaseline(baselinePath, result.gaps, meta);
		console.log(`Baseline written: ${baselinePath} (${result.gaps.length} known gaps)`);
		return;
	}

	// ── Check mode ───────────────────────────────────────────────────────
	const knownGapKeys = loadBaseline(baselinePath);

	const { newGaps, knownGaps } = partitionGapsByBaseline(result.gaps, knownGapKeys);

	// Print report
	console.log('='.repeat(72));
	console.log('OpenAPI Auth Contract Probe — CSR-041');
	console.log('='.repeat(72));
	console.log(`Spec:               ${specPath}`);
	console.log(`Baseline:           ${baselinePath}`);
	console.log(`Total paths:        ${result.totalPaths}`);
	console.log(`Sensitive checked:  ${result.sensitiveChecked}`);
	console.log(`  With security:    ${result.withSecurity}`);
	console.log(`  Without security: ${result.withoutSecurity}`);
	console.log(`Global security:    ${result.hasGlobalSecurity ? 'defined' : 'MISSING'}`);
	console.log(`Security schemes:   ${result.securitySchemeNames.join(', ')}`);
	console.log();

	if (knownGaps.length > 0) {
		console.log(`Known upstream gaps (in baseline): ${knownGaps.length}`);
		for (const g of knownGaps.slice(0, 5)) {
			console.log(`  [${g.method.padEnd(6)}] ${g.path}`);
		}
		if (knownGaps.length > 5) {
			console.log(`  ... and ${knownGaps.length - 5} more (see baseline file for full list)`);
		}
		console.log();
	}

	if (newGaps.length > 0) {
		console.log(`NEW gaps (not in baseline): ${newGaps.length}`);
		for (const g of newGaps) {
			console.log(`  [${g.method.padEnd(6)}] ${g.path}  tags=${JSON.stringify(g.tags)}`);
		}
		console.log();
		console.log('ACTION: These endpoints are missing `security:` blocks and are not in');
		console.log('the baseline. If the gap is real, update the baseline. If new endpoints');
		console.log('were added by a Lesser resync that should have auth, report upstream.');
		console.log();
		console.log('POLICY: Do not hand-edit openapi.yaml in Greater. The fix belongs in');
		console.log("Lesser's route contracts. See docs/lesser/contracts/README.md.");
		process.exit(1);
	}

	if (result.gaps.length === 0) {
		console.log('No auth gaps found. All sensitive endpoints have `security:` blocks.');
		process.exit(0);
	}

	console.log(`Status: All ${result.gaps.length} auth gaps are known and in the baseline.`);
	console.log("The fix belongs upstream in Lesser's route contracts.");
	console.log();
	console.log('To regenerate the baseline after a Lesser resync:');
	console.log('  node scripts/check-openapi-auth.mjs --write-baseline');

	if (args.strict) {
		console.log();
		console.log('--strict mode: treating known upstream gaps as errors.');
		process.exit(1);
	}

	process.exit(0);
}

main();
