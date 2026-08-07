import { describe, expect, it } from 'vitest';
import { getQuotePermission, type ActivityPubObject } from '../src/generics/index.js';

const object = (quotePermissions?: unknown): ActivityPubObject => ({
	id: 'https://example.test/objects/1',
	type: 'Note',
	attributedTo: 'https://example.test/users/alice',
	published: '2026-08-07T00:00:00Z',
	extensions: quotePermissions === undefined ? {} : { quotePermissions },
});

describe('getQuotePermission', () => {
	it.each(['EVERYONE', 'FOLLOWERS', 'MENTIONED', 'NONE'] as const)(
		'preserves the recognized %s permission',
		(permission) => {
			expect(getQuotePermission(object(permission))).toBe(permission);
		}
	);

	it('fails closed for missing or unknown permission values', () => {
		expect(getQuotePermission(object())).toBe('NONE');
		expect(getQuotePermission(object('future-policy'))).toBe('NONE');
	});
});
