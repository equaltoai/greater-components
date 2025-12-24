/**
 * Moderation Context Tests
 *
 * Tests for Moderation component context and helper functions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ModerationContext } from '../src/types';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

// Import after mock is set up
import {
	MODERATION_CONTEXT_KEY,
	createModerationContext,
	getModerationContext,
	hasModerationContext,
} from '../src/components/Moderation/context';

// Test data factory
const makeModerationContext = (overrides: Partial<ModerationContext> = {}): ModerationContext => ({
	handlers: {},
	queue: [],
	log: [],
	loading: false,
	error: null,
	...overrides,
});

describe('Moderation Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	describe('MODERATION_CONTEXT_KEY', () => {
		it('should be a unique symbol', () => {
			expect(typeof MODERATION_CONTEXT_KEY).toBe('symbol');
			expect(MODERATION_CONTEXT_KEY.description).toBe('moderation-context');
		});
	});

	describe('createModerationContext', () => {
		it('creates context with provided data', () => {
			const contextData = makeModerationContext();
			const context = createModerationContext(contextData);

			expect(context).toBe(contextData);
		});

		it('stores context using setContext', () => {
			const contextData = makeModerationContext();
			createModerationContext(contextData);

			expect(contextStore.has(MODERATION_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getModerationContext', () => {
		it('retrieves stored context', () => {
			const contextData = makeModerationContext();
			const createdContext = createModerationContext(contextData);
			const retrievedContext = getModerationContext();

			expect(retrievedContext).toBe(createdContext);
		});

		it('throws error when context does not exist', () => {
			contextStore.clear();

			expect(() => getModerationContext()).toThrow(
				'Moderation context not found. Make sure this component is used within a Moderation.Root component.'
			);
		});
	});

	describe('hasModerationContext', () => {
		it('returns true when context exists', () => {
			const contextData = makeModerationContext();
			createModerationContext(contextData);

			expect(hasModerationContext()).toBe(true);
		});

		it('returns false when context does not exist', () => {
			contextStore.clear();

			expect(hasModerationContext()).toBe(false);
		});
	});
});
