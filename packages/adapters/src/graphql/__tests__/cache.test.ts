import { describe, expect, it } from 'vitest';
import { typePolicies } from '../cache.js';

type ConversationsPolicy = {
	keyArgs?: unknown;
	merge: (
		existing: unknown[] | undefined,
		incoming: unknown,
		context: {
			args?: {
				after?: string | null;
			};
			readField: <T>(fieldName: string, from: unknown) => T | undefined;
		}
	) => unknown[];
};

const conversationsPolicy = typePolicies.Query?.fields?.conversations as ConversationsPolicy;

const readField = <T>(fieldName: string, from: unknown): T | undefined => {
	if (from && typeof from === 'object' && fieldName in from) {
		return (from as Record<string, T | undefined>)[fieldName];
	}

	return undefined;
};

describe('Apollo conversations cache policy', () => {
	it('keys conversations by folder', () => {
		expect(conversationsPolicy.keyArgs).toEqual(['folder']);
	});

	it('treats the first page as a plain array and appends later pages by id', () => {
		const firstPage = [
			{ id: 'c1', updatedAt: '2026-04-01T00:00:00.000Z' },
			{ id: 'c2', updatedAt: '2026-04-01T00:01:00.000Z' },
		];
		const replacementPage = [{ id: 'r1', updatedAt: '2026-04-02T00:00:00.000Z' }];
		const nextPage = [
			{ id: 'c2', updatedAt: '2026-04-01T00:01:00.000Z' },
			{ id: 'c3', updatedAt: '2026-04-01T00:02:00.000Z' },
		];

		expect(
			conversationsPolicy.merge(firstPage, replacementPage, {
				args: { after: null },
				readField,
			})
		).toEqual(replacementPage);

		expect(
			conversationsPolicy.merge(firstPage, nextPage, {
				args: { after: 'cursor-2' },
				readField,
			})
		).toEqual([
			{ id: 'c1', updatedAt: '2026-04-01T00:00:00.000Z' },
			{ id: 'c2', updatedAt: '2026-04-01T00:01:00.000Z' },
			{ id: 'c3', updatedAt: '2026-04-01T00:02:00.000Z' },
		]);
	});
});
