import { describe, expect, it } from 'vitest';
import { AGENT_STITCH_ANCHOR_DEFINITIONS, getAgentStitchAnchor } from '../src/index.js';

describe('AGENT_STITCH_ANCHOR_DEFINITIONS', () => {
	it('captures the workflow-relevant Stitch anchors discovered in Agent Genesis', () => {
		expect(AGENT_STITCH_ANCHOR_DEFINITIONS.map((anchor) => anchor.stitchScreenTitle)).toEqual([
			'Agent Genesis',
			'Nexus Dashboard',
			'Identity Nexus',
			'Notification Center: Soul Requests',
			'Direct Message: Graduation Approval',
		]);
	});

	it('maps every Stitch anchor to reusable package exports instead of app-only components', () => {
		for (const anchor of AGENT_STITCH_ANCHOR_DEFINITIONS) {
			expect(anchor.componentFamilies.length).toBeGreaterThan(0);
			expect(anchor.aggregateExports.length).toBeGreaterThan(0);
			expect(anchor.sharedPackages).toContain('faces/agent');
		}
	});

	it('supports keyed lookup for downstream composition code', () => {
		expect(getAgentStitchAnchor('identity-nexus')).toMatchObject({
			stitchScreenTitle: 'Identity Nexus',
			workflowSurface: 'identity-nexus',
		});
	});
});
