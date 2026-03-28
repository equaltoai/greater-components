import { describe, expect, it } from 'vitest';
import { AGENT_FACE_COMPOSITIONS, getAgentFaceComposition } from '../src/index.js';

describe('AGENT_FACE_COMPOSITIONS', () => {
	it('maps every current Stitch anchor to a face composition boundary', () => {
		expect(AGENT_FACE_COMPOSITIONS.map((composition) => composition.stitchAnchor)).toEqual([
			'Agent Genesis',
			'Nexus Dashboard',
			'Identity Nexus',
			'Notification Center: Soul Requests',
			'Direct Message: Graduation Approval',
		]);
	});

	it('keeps reusable export surfaces attached to each composition', () => {
		for (const composition of AGENT_FACE_COMPOSITIONS) {
			expect(composition.aggregateExports[0]).toBe('@equaltoai/greater-components/faces/agent');
			expect(composition.layoutBoundaries.length).toBeGreaterThan(0);
		}
	});

	it('supports keyed lookup for route-shell composition code', () => {
		expect(getAgentFaceComposition('genesis-workspace')).toMatchObject({
			title: 'Genesis Workspace',
			surfaceKind: 'workspace',
		});
	});
});
