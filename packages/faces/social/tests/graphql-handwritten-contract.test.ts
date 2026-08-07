import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSchema, parse, validate } from 'graphql';
import { describe, expect, it } from 'vitest';
import { SUBSCRIBE_TIMELINE } from '../src/adapters/graphql/queries.js';
import { toTimelineType } from '../src/adapters/graphql/timeline-type.js';

const schema = buildSchema(
	readFileSync(
		resolve(process.cwd(), '../../../docs/lesser/contracts/graphql-schema.graphql'),
		'utf8'
	)
);

describe('hand-written Lesser GraphQL subscription contract', () => {
	it('validates the timeline subscription against the pinned schema', () => {
		const errors = validate(schema, parse(SUBSCRIBE_TIMELINE));
		expect(errors.map((error) => error.message)).toEqual([]);
	});

	it('maps the public timeline names to pinned GraphQL enum values', () => {
		expect(toTimelineType()).toBe('HOME');
		expect(toTimelineType('home')).toBe('HOME');
		expect(toTimelineType('local')).toBe('LOCAL');
		expect(toTimelineType('federated')).toBe('PUBLIC');
	});
});
