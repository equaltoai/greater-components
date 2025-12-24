import { describe, it, expect } from 'vitest';
import * as CommunityFace from '../src/index';

describe('Community Face Structure', () => {
	it('exports expected components', () => {
		expect(CommunityFace.Community).toBeDefined();
		expect(CommunityFace.Post).toBeDefined();
		expect(CommunityFace.Thread).toBeDefined();
		expect(CommunityFace.Voting).toBeDefined();
		expect(CommunityFace.Flair).toBeDefined();
		expect(CommunityFace.Moderation).toBeDefined();
		expect(CommunityFace.Wiki).toBeDefined();
	});

	it('exports types', () => {
		// Types are erased at runtime, but we can check if the module loads successfully
		expect(CommunityFace).toBeDefined();
	});
});
