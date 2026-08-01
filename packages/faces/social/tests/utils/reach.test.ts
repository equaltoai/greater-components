import { describe, it, expect } from 'vitest';
import {
	COMPOSE_VISIBILITY_ORDER,
	allowedChildVisibilities,
	constrainVisibility,
	isComposeVisibility,
	isReachRejection,
	isReachWidening,
	reachRank,
	visibilityLabel,
} from '../../src/utils/reach';

/**
 * Mirrors `ValidateChildReach` / `childReachVisibilityRank` in Lesser v1.5.33
 * (pkg/services/notes/reach.go): reach is ordered
 * `public < unlisted < private < direct`, and a child wider than its parent is
 * rejected with UNPROCESSABLE_ENTITY rather than silently clamped.
 */

describe('reach ranking', () => {
	it('orders visibility widest to narrowest', () => {
		expect(COMPOSE_VISIBILITY_ORDER).toEqual(['public', 'unlisted', 'private', 'direct']);
		expect(reachRank('public')).toBe(0);
		expect(reachRank('unlisted')).toBe(1);
		expect(reachRank('private')).toBe(2);
		expect(reachRank('direct')).toBe(3);
	});

	it('reports unrecognised visibility as unranked', () => {
		expect(reachRank('followers')).toBeNull();
		expect(reachRank(undefined)).toBeNull();
		expect(reachRank(3)).toBeNull();
		expect(isComposeVisibility('public')).toBe(true);
		expect(isComposeVisibility('secret')).toBe(false);
	});
});

describe('isReachWidening', () => {
	it('permits equal and narrower reach', () => {
		expect(isReachWidening('private', 'private')).toBe(false);
		expect(isReachWidening('private', 'direct')).toBe(false);
		expect(isReachWidening('public', 'unlisted')).toBe(false);
		expect(isReachWidening('unlisted', 'direct')).toBe(false);
	});

	it('rejects wider reach, matching the server', () => {
		expect(isReachWidening('private', 'public')).toBe(true);
		expect(isReachWidening('private', 'unlisted')).toBe(true);
		expect(isReachWidening('direct', 'public')).toBe(true);
		expect(isReachWidening('unlisted', 'public')).toBe(true);
	});

	it('answers conservatively when either side is unreadable', () => {
		expect(isReachWidening('mystery', 'public')).toBe(true);
		expect(isReachWidening('public', 'mystery')).toBe(true);
		expect(isReachWidening(undefined, 'public')).toBe(true);
	});
});

describe('allowedChildVisibilities', () => {
	it('offers every option for a fresh post', () => {
		expect(allowedChildVisibilities(undefined)).toEqual(COMPOSE_VISIBILITY_ORDER);
		expect(allowedChildVisibilities(null)).toEqual(COMPOSE_VISIBILITY_ORDER);
	});

	it('constrains each parent visibility to equal-or-narrower', () => {
		expect(allowedChildVisibilities('public')).toEqual([
			'public',
			'unlisted',
			'private',
			'direct',
		]);
		expect(allowedChildVisibilities('unlisted')).toEqual(['unlisted', 'private', 'direct']);
		expect(allowedChildVisibilities('private')).toEqual(['private', 'direct']);
	});

	it('leaves no public path for a direct or conversation parent', () => {
		expect(allowedChildVisibilities('direct')).toEqual(['direct']);
	});

	it('never offers an option wider than the parent', () => {
		for (const parent of COMPOSE_VISIBILITY_ORDER) {
			for (const option of allowedChildVisibilities(parent)) {
				expect(isReachWidening(parent, option)).toBe(false);
			}
		}
	});

	it('does not fabricate a constraint from an unreadable parent reach', () => {
		// The server is the enforcer; a guessed constraint would block choices
		// the author may legitimately be entitled to.
		expect(allowedChildVisibilities('followers-only')).toEqual(COMPOSE_VISIBILITY_ORDER);
	});
});

describe('constrainVisibility', () => {
	it('keeps a permitted selection unchanged', () => {
		expect(constrainVisibility('private', 'direct')).toBe('direct');
		expect(constrainVisibility('private', 'private')).toBe('private');
		expect(constrainVisibility(undefined, 'public')).toBe('public');
	});

	it('narrows a widening selection to the nearest permitted option', () => {
		expect(constrainVisibility('private', 'public')).toBe('direct');
		expect(constrainVisibility('unlisted', 'public')).toBe('direct');
		expect(constrainVisibility('direct', 'public')).toBe('direct');
	});

	it('only ever narrows', () => {
		for (const parent of COMPOSE_VISIBILITY_ORDER) {
			for (const requested of COMPOSE_VISIBILITY_ORDER) {
				const result = constrainVisibility(parent, requested);
				expect(isReachWidening(parent, result)).toBe(false);
				expect(reachRank(result)!).toBeGreaterThanOrEqual(reachRank(requested)!);
			}
		}
	});

	it('falls back to the narrowest option for an unusable request', () => {
		expect(constrainVisibility('private', 'nonsense')).toBe('direct');
		expect(constrainVisibility('private', undefined)).toBe('direct');
	});
});

describe('isReachRejection', () => {
	it('recognises the GraphQL rejection', () => {
		expect(
			isReachRejection({
				errors: [
					{
						message: 'requested visibility exceeds parent reach',
						extensions: { code: 'UNPROCESSABLE_ENTITY' },
					},
				],
			})
		).toBe(true);
	});

	it('recognises the rejection nested in Apollo and graphql-ws shapes', () => {
		expect(
			isReachRejection({ graphQLErrors: [{ extensions: { code: 'UNPROCESSABLE_ENTITY' } }] })
		).toBe(true);
		expect(
			isReachRejection({
				networkError: { result: { errors: [{ extensions: { code: 'UNPROCESSABLE_ENTITY' } }] } },
			})
		).toBe(true);
		expect(isReachRejection({ cause: { code: 'UNPROCESSABLE_ENTITY' } })).toBe(true);
	});

	it('recognises the REST projection by status code', () => {
		expect(isReachRejection({ status: 422 })).toBe(true);
		expect(isReachRejection({ statusCode: 422 })).toBe(true);
	});

	it('does not claim unrelated failures', () => {
		expect(isReachRejection(new Error('network down'))).toBe(false);
		expect(isReachRejection({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] })).toBe(false);
		expect(isReachRejection({ status: 500 })).toBe(false);
		expect(isReachRejection(null)).toBe(false);
	});

	it('tolerates cyclic error objects', () => {
		const cyclic: Record<string, unknown> = { code: 'UNPROCESSABLE_ENTITY' };
		cyclic['cause'] = cyclic;
		expect(isReachRejection(cyclic)).toBe(true);
	});
});

describe('visibilityLabel', () => {
	it('labels every option', () => {
		expect(COMPOSE_VISIBILITY_ORDER.map(visibilityLabel)).toEqual([
			'Public',
			'Unlisted',
			'Followers only',
			'Direct',
		]);
	});
});
