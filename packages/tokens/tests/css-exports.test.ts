import { describe, expect, it } from 'vitest';

describe('css exports', () => {
	it('exposes high-contrast.css via package exports', async () => {
		await expect(
			import('@equaltoai/greater-components-tokens/high-contrast.css')
		).resolves.toBeDefined();
	});
});
