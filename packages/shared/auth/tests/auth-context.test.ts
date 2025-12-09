import { describe, expect, it } from 'vitest';
import AuthHarness from './fixtures/AuthHarness.svelte';
import { mount } from 'svelte';

describe('Auth context', () => {
	it('mounts without rune usage errors', () => {
		const target = document.createElement('div');
		expect(() => {
			const app = mount(AuthHarness, { target });
			app.destroy?.();
		}).not.toThrow();
	});
});
