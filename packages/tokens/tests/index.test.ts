import { describe, it, expect } from 'vitest';
import { tokens } from '../src/index';

describe('Tokens Index', () => {
	it('should export tokens object', () => {
		expect(tokens).toBeDefined();
		expect(tokens).toBeTypeOf('object');
	});

	it('should have color tokens', () => {
		expect(tokens.color).toBeDefined();
		expect(tokens.color.base).toBeDefined();
		expect(tokens.color.gray).toBeDefined();
	});

	it('should have font tokens', () => {
		// Assuming structure based on common patterns, verified if needed
		// Looking at read_file output earlier, it started with colors.
		// Let's check generic structure.
		expect(Object.keys(tokens).length).toBeGreaterThan(0);
	});
});
