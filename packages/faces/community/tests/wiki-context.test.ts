/**
 * Wiki Context Tests
 *
 * Tests for Wiki component context and helper functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WikiContext } from '../src/types';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

// Import after mock is set up
import {
	WIKI_CONTEXT_KEY,
	createWikiContext,
	getWikiContext,
	hasWikiContext,
} from '../src/components/Wiki/context';

// Test data factory
const makeWikiContext = (overrides: Partial<WikiContext> = {}): WikiContext => ({
	page: {
		path: 'index',
		title: 'Wiki Home',
		content: 'Welcome',
		revision: 1,
		editPermission: 'everyone',
	},
	handlers: {},
	editing: false,
	draft: '',
	history: [],
	loading: false,
	error: null,
	...overrides,
});

describe('Wiki Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	describe('WIKI_CONTEXT_KEY', () => {
		it('should be a unique symbol', () => {
			expect(typeof WIKI_CONTEXT_KEY).toBe('symbol');
			expect(WIKI_CONTEXT_KEY.description).toBe('wiki-context');
		});
	});

	describe('createWikiContext', () => {
		it('creates context with provided data', () => {
			const contextData = makeWikiContext();
			const context = createWikiContext(contextData);

			expect(context).toBe(contextData);
		});

		it('stores context using setContext', () => {
			const contextData = makeWikiContext();
			createWikiContext(contextData);

			expect(contextStore.has(WIKI_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getWikiContext', () => {
		it('retrieves stored context', () => {
			const contextData = makeWikiContext();
			const createdContext = createWikiContext(contextData);
			const retrievedContext = getWikiContext();

			expect(retrievedContext).toBe(createdContext);
		});

		it('throws error when context does not exist', () => {
			contextStore.clear();

			expect(() => getWikiContext()).toThrow(
				'Wiki context not found. Make sure this component is used within a Wiki.Root component.'
			);
		});
	});

	describe('hasWikiContext', () => {
		it('returns true when context exists', () => {
			const contextData = makeWikiContext();
			createWikiContext(contextData);

			expect(hasWikiContext()).toBe(true);
		});

		it('returns false when context does not exist', () => {
			contextStore.clear();

			expect(hasWikiContext()).toBe(false);
		});
	});
});
