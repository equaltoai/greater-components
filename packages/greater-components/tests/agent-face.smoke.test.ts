import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';

describe('agent face aggregate smoke coverage', () => {
	it('keeps the public face and shared agent subpaths importable from the built package', async () => {
		vi.resetModules();
		const [pkg, face, shared] = await Promise.all([
			readFile(resolve(process.cwd(), 'package.json'), 'utf8').then((contents) =>
				JSON.parse(contents)
			),
			import('../../faces/agent/dist/index.js'),
			import('../../shared/agent/dist/index.js'),
		]);
		expect(pkg.exports['./faces/agent']).toMatchObject({
			types: './dist/faces/agent/index.d.ts',
			svelte: './dist/faces/agent/index.js',
			import: './dist/faces/agent/index.js',
		});
		expect(pkg.exports['./faces/agent/style.css']).toBe(
			'./dist/faces/agent/greater-components-agent.css'
		);
		expect(pkg.exports['./shared/agent']).toMatchObject({
			types: './dist/shared/agent/index.d.ts',
			svelte: './dist/shared/agent/index.js',
			import: './dist/shared/agent/index.js',
		});

		expect(face).toHaveProperty('AGENT_FACE_PACKAGE_ROLE');
		expect(face).toHaveProperty('AGENT_FACE_COMPOSITIONS');
		expect(face).toHaveProperty('getAgentFaceComposition');
		expect(face).toHaveProperty('AgentGenesisWorkspace');
		expect(face).toHaveProperty('SoulRequestCenter');
		expect(face).toHaveProperty('GraduationApprovalThread');
		expect(face).toHaveProperty('NexusDashboard');
		expect(face).toHaveProperty('IdentityNexus');
		expect(face.AGENT_FACE_PACKAGE_ROLE.aggregateExport).toBe(
			'@equaltoai/greater-components/faces/agent'
		);
		expect(face.AGENT_FACE_COMPOSITIONS.map((composition) => composition.key)).toEqual([
			'genesis-workspace',
			'nexus-dashboard',
			'identity-nexus',
			'soul-request-center',
			'graduation-approval-thread',
		]);
		expect(face.getAgentFaceComposition('nexus-dashboard')).toMatchObject({
			surfaceKind: 'dashboard',
			stitchAnchor: 'Nexus Dashboard',
		});

		expect(shared).toHaveProperty('AGENT_PACKAGE_BOUNDARIES');
		expect(shared).toHaveProperty('AGENT_STITCH_ANCHOR_DEFINITIONS');
		expect(shared).toHaveProperty('AGENT_WORKFLOW_CONSUMERS');
		expect(shared).toHaveProperty('AGENT_WORKFLOW_IMPLEMENTATION_SHAPE');
		expect(shared).toHaveProperty('AgentIdentityCard');
		expect(shared).toHaveProperty('SoulLifecycleRail');
		expect(shared.AGENT_WORKFLOW_CONSUMERS).toEqual(
			expect.arrayContaining(['human', 'llm', 'hybrid'])
		);
		expect(shared.getAgentPackageBoundary('faces/agent')).toMatchObject({
			aggregateExport: '@equaltoai/greater-components/faces/agent',
		});
		expect(shared.getAgentStitchAnchor('nexus-dashboard')).toMatchObject({
			stitchScreenTitle: 'Nexus Dashboard',
		});
	});
});
