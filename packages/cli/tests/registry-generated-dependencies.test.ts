import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validRange } from 'semver';
import { describe, expect, it } from 'vitest';

interface RegistryDependency {
	name: string;
	version: string;
}

interface RegistryEntry {
	dependencies?: RegistryDependency[];
	peerDependencies?: RegistryDependency[];
}

interface RegistryIndex {
	components: Record<string, RegistryEntry>;
	faces: Record<string, RegistryEntry>;
	shared: Record<string, RegistryEntry>;
}

interface PackageManifest {
	name: string;
	version: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
}

const PACKAGES_ROOT = fileURLToPath(new URL('../../', import.meta.url));

const registry = JSON.parse(
	fs.readFileSync(new URL('../../../registry/index.json', import.meta.url), 'utf8')
) as RegistryIndex;

function allDependencies(): RegistryDependency[] {
	return [
		...Object.values(registry.components),
		...Object.values(registry.faces),
		...Object.values(registry.shared),
	].flatMap((entry) => [...(entry.dependencies ?? []), ...(entry.peerDependencies ?? [])]);
}

function readPackageManifests(dir: string): PackageManifest[] {
	const packageJsonPath = path.join(dir, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		return [JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as PackageManifest];
	}

	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter(
			(entry) => entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist'
		)
		.flatMap((entry) => readPackageManifests(path.join(dir, entry.name)));
}

/**
 * The generator resolves registry ranges from package manifests and workspace
 * versions. Mirror that source of truth so this guard stays offline while
 * rejecting any syntactically valid range that generation could not produce.
 */
function generatedDependencyRanges(): Map<string, Set<string>> {
	const manifests = readPackageManifests(PACKAGES_ROOT);
	const workspaceVersions = new Map(manifests.map(({ name, version }) => [name, version]));
	// Deliberately pool the union of declared ranges by dependency name across
	// every workspace manifest; package ownership is not encoded in Registry entries.
	const ranges = new Map<string, Set<string>>();
	const add = (name: string, version: string): void => {
		const versions = ranges.get(name) ?? new Set<string>();
		versions.add(version);
		ranges.set(name, versions);
	};

	for (const manifest of manifests) {
		add(manifest.name, manifest.version);
		const shortName = manifest.name.replace(/^@equaltoai\/greater-components-/, '');
		if (shortName !== manifest.name) add(shortName, manifest.version);

		for (const section of [
			manifest.dependencies,
			manifest.peerDependencies,
			manifest.devDependencies,
		]) {
			for (const [name, declaredVersion] of Object.entries(section ?? {})) {
				const version = declaredVersion.startsWith('workspace:')
					? (workspaceVersions.get(name) ?? declaredVersion)
					: declaredVersion;
				add(name, version);
			}
		}
	}

	return ranges;
}

describe('generated Registry dependencies', () => {
	it('keeps optional social dependencies unique, well-formed and pinned', () => {
		const socialPeers = registry.faces.social?.peerDependencies ?? [];
		const socialOptionals = socialPeers.filter((dependency) =>
			['@tanstack/svelte-virtual', '@graphql-typed-document-node/core'].includes(dependency.name)
		);

		expect(socialOptionals).toEqual([
			{ name: '@graphql-typed-document-node/core', version: '^3.2.0' },
			{ name: '@tanstack/svelte-virtual', version: '^3.13.36' },
		]);
		expect(allDependencies().filter((dependency) => dependency.version === 'latest')).toHaveLength(
			2
		);
		expect(
			allDependencies().filter((dependency) => dependency.name.slice(1).includes('@'))
		).toEqual([]);
	});

	it('contains only parseable ranges produced from offline package manifests', () => {
		const dependencies = allDependencies();
		const generatedRanges = generatedDependencyRanges();

		expect(dependencies.filter(({ name }) => name === 'vite')).toEqual([]);
		expect(dependencies.filter(({ name }) => name === '@types/node')).toEqual([]);
		expect(dependencies.filter(({ name }) => name === 'typescript')).toEqual([]);

		for (const dependency of dependencies) {
			expect(
				dependency.version === 'latest' || validRange(dependency.version),
				`${dependency.name} has an invalid registry range: ${dependency.version}`
			).toBeTruthy();
			if (dependency.version === 'latest') continue;

			const allowed = generatedRanges.get(dependency.name);
			expect(
				allowed,
				`${dependency.name}@${dependency.version} has no package-manifest source`
			).toBeDefined();
			expect(
				[...(allowed ?? [])],
				`${dependency.name}@${dependency.version} is not generated from its package-manifest ranges`
			).toContain(dependency.version);
		}
	});
});
