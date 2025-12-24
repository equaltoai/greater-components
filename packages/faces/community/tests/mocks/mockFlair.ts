/**
 * Mock Flair Data
 *
 * Factory functions for generating sample flair data for tests.
 */

import type { FlairData } from '../../src/types.js';

export function createMockFlair(id: string, overrides: Partial<FlairData> = {}): FlairData {
	return {
		id,
		text: `Flair ${id}`,
		type: 'post',
		backgroundColor: '#ff0000',
		textColor: '#ffffff',
		...overrides,
	};
}
