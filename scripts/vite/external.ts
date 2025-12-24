import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function computeExternal(packageDir: string) {
	const pkgPath = resolve(packageDir, 'package.json');
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	const dependencies = Object.keys(pkg.dependencies || {});
	const peerDependencies = Object.keys(pkg.peerDependencies || {});
	const allDeps = [...new Set([...dependencies, ...peerDependencies])];

	return [
		'svelte',
		/^svelte\//,
		...allDeps.map((dep) => new RegExp(`^${escapeRegExp(dep)}(/.*)?$`)),
	];
}
