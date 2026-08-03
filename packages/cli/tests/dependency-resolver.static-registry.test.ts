import { describe, expect, it } from 'vitest';
import { resolveDependencies } from '../src/utils/dependency-resolver.js';
import { parseItemName } from '../src/utils/item-parser.js';

describe('bundled static registry dependency resolution', () => {
	it('pins the adapters Apollo client in consumer install plans', () => {
		const result = resolveDependencies([parseItemName('adapters')]);

		expect(result.success).toBe(true);
		expect(
			result.npmDependencies.find((dependency) => dependency.name === '@apollo/client')
		).toEqual({ name: '@apollo/client', version: '4.2.9' });
		expect(
			result.npmDependencies.find(
				(dependency) => dependency.name === '@apollo/client-react-streaming'
			)
		).toEqual({ name: '@apollo/client-react-streaming', version: '^0.14.5' });
	});
});
