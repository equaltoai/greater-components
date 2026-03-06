#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const sourceOpenapiPath = path.join(rootDir, 'docs', 'lesser-host', 'contracts', 'openapi.yaml');
const sourceSchemasDir = path.join(rootDir, 'docs', 'lesser-host', 'spec', 'v3', 'schemas');
const outputPath = path.join(
	rootDir,
	'packages',
	'adapters',
	'src',
	'rest',
	'generated',
	'lesser-host-api.ts'
);

const LESSER_HOST_SCHEMA_REF_PREFIX = 'https://lesser.host/spec/v3/schemas/';

function rewriteSchemaRefs(value) {
	if (Array.isArray(value)) {
		for (const item of value) {
			rewriteSchemaRefs(item);
		}
		return;
	}

	if (typeof value !== 'object' || value === null) {
		return;
	}

	for (const [key, v] of Object.entries(value)) {
		if (key === '$ref' && typeof v === 'string' && v.startsWith(LESSER_HOST_SCHEMA_REF_PREFIX)) {
			value[key] = `./${v.slice(LESSER_HOST_SCHEMA_REF_PREFIX.length)}`;
			continue;
		}
		rewriteSchemaRefs(v);
	}
}

async function main() {
	const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'greater-lesser-host-openapi-'));
	try {
		const tmpContractsDir = path.join(tmpRoot, 'contracts');
		const tmpSchemasDir = path.join(tmpRoot, 'spec', 'v3', 'schemas');
		await fs.mkdir(tmpContractsDir, { recursive: true });
		await fs.mkdir(tmpSchemasDir, { recursive: true });

		await fs.copyFile(sourceOpenapiPath, path.join(tmpContractsDir, 'openapi.yaml'));

		const schemaFiles = await fs.readdir(sourceSchemasDir);
		for (const filename of schemaFiles) {
			const srcPath = path.join(sourceSchemasDir, filename);
			const dstPath = path.join(tmpSchemasDir, filename);
			if (!filename.endsWith('.json')) {
				await fs.copyFile(srcPath, dstPath);
				continue;
			}

			const raw = await fs.readFile(srcPath, 'utf8');
			const parsed = JSON.parse(raw);
			rewriteSchemaRefs(parsed);
			await fs.writeFile(dstPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
		}

		const binPath = path.join(
			rootDir,
			'node_modules',
			'.bin',
			process.platform === 'win32' ? 'openapi-typescript.cmd' : 'openapi-typescript'
		);

		const result = spawnSync(
			binPath,
			[path.join(tmpContractsDir, 'openapi.yaml'), '-o', outputPath],
			{ stdio: 'inherit' }
		);
		if (result.status !== 0) {
			process.exit(result.status ?? 1);
		}
	} finally {
		await fs.rm(tmpRoot, { recursive: true, force: true });
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
