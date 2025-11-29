import { describe, expect, it } from 'vitest';

describe('css exports', () => {
	it('exposes greater-components-fediverse.css via package exports', async () => {
		await expect(
			import('@equaltoai/greater-components-fediverse/greater-components-fediverse.css')
		).resolves.toBeDefined();
	});
});
