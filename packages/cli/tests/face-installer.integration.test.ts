import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getFaceManifest, getFaceExports, getFaceSurfaces } from '../src/registry/faces.js';
import { resolveDependencies } from '../src/utils/dependency-resolver.js';
import { resolveFaceDependencies } from '../src/utils/face-installer.js';
import { parseItemName } from '../src/utils/item-parser.js';
import type { RegistryIndex } from '../src/utils/registry-index.js';

const registryIndex = JSON.parse(
	fs.readFileSync(new URL('../../../registry/index.json', import.meta.url), 'utf8')
) as RegistryIndex;

describe('agent face dependency resolution', () => {
	it('keeps exported agent compositions as face surfaces instead of installable components', () => {
		const manifest = getFaceManifest('agent');

		expect(manifest).not.toBeNull();
		expect(manifest?.includes.components).toEqual([]);
		expect(getFaceSurfaces('agent')).toEqual([
			'genesis-workspace',
			'nexus-dashboard',
			'identity-nexus',
			'soul-request-center',
			'graduation-approval-thread',
		]);
		expect(getFaceExports('agent')).toEqual([
			'AGENT_FACE_PACKAGE_ROLE',
			'AGENT_FACE_COMPOSITIONS',
			'getAgentFaceComposition',
		]);
	});

	it('resolves the face package alongside its installable dependencies', () => {
		const resolution = resolveFaceDependencies('agent');

		expect(resolution).not.toBeNull();
		expect(resolution?.success).toBe(true);
		expect(resolution?.resolved).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: 'agent', type: 'face', isDirectRequest: true }),
				expect.objectContaining({ name: 'agent', type: 'shared' }),
				expect.objectContaining({ name: 'soul', type: 'shared' }),
				expect.objectContaining({ name: 'notifications', type: 'shared' }),
				expect.objectContaining({ name: 'messaging', type: 'shared' }),
				expect.objectContaining({ name: 'chat', type: 'shared' }),
				expect.objectContaining({ name: 'button', type: 'primitive' }),
				expect.objectContaining({ name: 'modal', type: 'primitive' }),
				expect.objectContaining({ name: 'tabs', type: 'primitive' }),
			])
		);
		expect(resolution?.resolved.map((dependency) => dependency.name)).not.toEqual(
			expect.arrayContaining([
				'genesis-workspace',
				'nexus-dashboard',
				'identity-nexus',
				'soul-request-center',
				'graduation-approval-thread',
			])
		);
	});

	it('resolves the agent face against the registry index without self-cycling', () => {
		const resolution = resolveFaceDependencies('agent', { registryIndex });

		expect(resolution).not.toBeNull();
		expect(resolution?.success).toBe(true);
		expect(resolution?.circular).toEqual([]);
		expect(resolution?.missing).toEqual([]);
		expect(resolution?.resolved).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ name: 'agent', type: 'face', isDirectRequest: true }),
				expect.objectContaining({ name: 'agent', type: 'shared' }),
			])
		);
	});

	it.each([
		['agent', 'shared'],
		['shared/agent', 'shared'],
		['faces/agent', 'face'],
	] as const)(
		'resolves %s against the registry index without circular dependencies',
		(input, type) => {
			const resolution = resolveDependencies([parseItemName(input)], { registryIndex });

			expect(resolution.success).toBe(true);
			expect(resolution.circular).toEqual([]);
			expect(resolution.missing).toEqual([]);
			expect(resolution.resolved).toEqual(
				expect.arrayContaining([expect.objectContaining({ name: 'agent', type })])
			);
		}
	);

	it.each(['social', 'blog', 'artist'] as const)(
		'keeps %s registry dependencies limited to vendorable workspace packages',
		(faceName) => {
			const faceEntry = registryIndex.faces[faceName];

			expect(faceEntry).toBeDefined();
			expect(faceEntry?.dependencies.map((dependency) => dependency.name)).not.toContain(
				'@equaltoai/greater-components'
			);

			const resolution = resolveFaceDependencies(faceName, { registryIndex });

			expect(resolution).not.toBeNull();
			expect(resolution?.success).toBe(true);
			expect(resolution?.missing).toEqual([]);
		}
	);
});
