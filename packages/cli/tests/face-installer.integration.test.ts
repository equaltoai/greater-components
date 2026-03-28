import { describe, expect, it } from 'vitest';
import { getFaceManifest, getFaceExports, getFaceSurfaces } from '../src/registry/faces.js';
import { resolveFaceDependencies } from '../src/utils/face-installer.js';

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
});
