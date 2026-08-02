import fs from 'node:fs';
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

describe('generated Registry dependencies', () => {
	it('keeps optional social dependencies unique, well-formed and pinned', () => {
		const socialPeers = registry.faces.social?.peerDependencies ?? [];
		const socialOptionals = socialPeers.filter((dependency) =>
			['@tanstack/svelte-virtual', '@graphql-typed-document-node/core'].includes(dependency.name)
		);

		expect(socialOptionals).toEqual([
			{ name: '@graphql-typed-document-node/core', version: '^3.2.0' },
			{ name: '@tanstack/svelte-virtual', version: '^3.13.23' },
		]);
		expect(allDependencies().filter((dependency) => dependency.version === 'latest')).toHaveLength(
			2
		);
		expect(
			allDependencies().filter((dependency) => dependency.name.slice(1).includes('@'))
		).toEqual([]);
	});

	it('contains only parseable registry ranges and none of the historical fabricated versions', () => {
		const dependencies = allDependencies();
		const fabricated = new Set(['vite@^10.0.1', '@types/node@^3.1.0', 'typescript@^6.0.0']);

		for (const dependency of dependencies) {
			expect(
				dependency.version === 'latest' || validRange(dependency.version),
				`${dependency.name} has an invalid registry range: ${dependency.version}`
			).toBeTruthy();
			const specifier = `${dependency.name}@${dependency.version}`;
			expect(fabricated.has(specifier), `registry retained fabricated ${specifier}`).toBe(false);
		}

		expect(dependencies.filter(({ name }) => name === 'vite')).toEqual([]);
		expect(dependencies.filter(({ name }) => name === '@types/node')).toEqual([]);
		expect(dependencies.filter(({ name }) => name === 'typescript')).toEqual([]);
	});
});
