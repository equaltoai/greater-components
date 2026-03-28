import { describe, expect, it } from 'vitest';
import {
	AGENT_DIRECT_PACKAGE_NAMES,
	AGENT_PACKAGE_BOUNDARIES,
	AGENT_WORKFLOW_IMPLEMENTATION_SHAPE,
	getAgentPackageBoundary,
} from '../src/index.js';

describe('AGENT_PACKAGE_BOUNDARIES', () => {
	it('keeps direct package names unique, including the dedicated face package name', () => {
		const names = Object.values(AGENT_DIRECT_PACKAGE_NAMES);
		expect(new Set(names)).toHaveLength(names.length);
		expect(AGENT_DIRECT_PACKAGE_NAMES['shared/agent']).toBe('@equaltoai/greater-components-agent');
		expect(AGENT_DIRECT_PACKAGE_NAMES['faces/agent']).toBe(
			'@equaltoai/greater-components-agent-face'
		);
	});

	it('keeps shared/soul narrow so workflow ownership is not stuffed into it', () => {
		const soulBoundary = getAgentPackageBoundary('shared/soul');

		expect(soulBoundary.owns).not.toContain('full workflow intake and progression');
		expect(soulBoundary.avoids).toContain('full workflow intake and progression');
	});

	it('gives faces/agent a composition-only remit', () => {
		const faceBoundary = getAgentPackageBoundary('faces/agent');

		expect(faceBoundary.role).toBe('face-composition');
		expect(faceBoundary.owns).toContain('page-level layouts and shell boundaries');
		expect(faceBoundary.avoids).toContain('authoritative workflow slot naming');
	});

	it('locks the milestone shape to M2 shared surfaces followed by M3 face composition', () => {
		expect(AGENT_WORKFLOW_IMPLEMENTATION_SHAPE).toEqual([
			expect.objectContaining({ milestone: 'M2' }),
			expect.objectContaining({ milestone: 'M3' }),
		]);
	});

	it('covers the full boundary set required by the milestone', () => {
		expect(AGENT_PACKAGE_BOUNDARIES.map((boundary) => boundary.key)).toEqual([
			'shared/soul',
			'shared/agent',
			'shared/chat',
			'shared/notifications',
			'shared/messaging',
			'faces/agent',
		]);
	});
});
