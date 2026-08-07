import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { componentRegistry } from '../src/registry/index.js';
import { VENDORED_BASELINE_PACKAGES } from '../src/commands/add.js';

interface RegistryDependency {
	name: string;
}

interface BlogRegistryEntry {
	dependencies: RegistryDependency[];
	peerDependencies: RegistryDependency[];
}

const registry = JSON.parse(
	fs.readFileSync(new URL('../../../registry/index.json', import.meta.url), 'utf8')
) as { faces: { blog: BlogRegistryEntry } };

describe('blog face dependency surfaces', () => {
	it('keeps content optional for readers while requiring it for the editor', () => {
		const blog = registry.faces.blog;
		const required = blog.dependencies.map((dependency) => dependency.name);
		const peers = blog.peerDependencies.map((dependency) => dependency.name);

		expect(required).not.toContain('content');
		expect(peers).toContain('@equaltoai/greater-components-content');
		expect(componentRegistry.editor?.registryDependencies).toContain('content');
		expect(VENDORED_BASELINE_PACKAGES).not.toContain('content');
	});
});
