import { describe, expect, it } from 'vitest';
import { AGENT_FACE_PACKAGE_ROLE } from '../src/index.js';

describe('AGENT_FACE_PACKAGE_ROLE', () => {
	it('keeps the face package focused on composition instead of contracts', () => {
		expect(AGENT_FACE_PACKAGE_ROLE.role).toBe('face-composition');
		expect(AGENT_FACE_PACKAGE_ROLE.primarySharedModules).toContain('shared/agent');
		expect(AGENT_FACE_PACKAGE_ROLE.avoids).toContain('authoritative workflow slot naming');
	});

	it('captures the current Stitch anchor set for the agent face', () => {
		expect(AGENT_FACE_PACKAGE_ROLE.stitchAnchors).toEqual([
			'Agent Genesis',
			'Nexus Dashboard',
			'Identity Nexus',
			'Notification Center: Soul Requests',
			'Direct Message: Graduation Approval',
		]);
	});
});
