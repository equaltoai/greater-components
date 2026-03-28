// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { createAvatar } from '../src/primitives/avatar';

describe('Avatar primitive SSR safety', () => {
	it('treats reload as a server-safe no-op when window is unavailable', () => {
		const avatar = createAvatar({
			src: '/images/avatar.png',
		});

		expect(() => avatar.helpers.reload()).not.toThrow();
		expect(avatar.state.currentSrc).toBe('/images/avatar.png');
	});
});
