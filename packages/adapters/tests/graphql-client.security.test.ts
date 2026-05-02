// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../src/graphql/client.ts', import.meta.url), 'utf8');

describe('GraphQL client credential handling', () => {
	it('keeps WebSocket bearer credentials out of URLs and direct console logs', () => {
		expect(source).toContain('connectionParams');
		expect(source).toContain('authorization');
		expect(source).not.toContain(['access', 'token'].join('_'));
		expect(source).not.toMatch(/searchParams\.set\([^)]*token/i);
		expect(source).not.toMatch(/currentToken\??\.substring/);
		expect(source).not.toMatch(/console\.(?:log|error|warn)/);
	});
});
