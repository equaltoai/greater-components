import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { EditorContext } from '../../../src/types.js';
import { getContext } from 'svelte';

// Mock Svelte's context functions
let contextStore = new Map<symbol, unknown>();

vi.mock('svelte', () => ({
	getContext: vi.fn((key: symbol) => contextStore.get(key)),
	setContext: vi.fn((key: symbol, value: unknown) => contextStore.set(key, value)),
}));

import {
	EDITOR_CONTEXT_KEY,
	DEFAULT_EDITOR_CONFIG,
	createEditorContext,
	getEditorContext,
	hasEditorContext,
} from '../../../src/components/Editor/context.js';

describe('Editor Context', () => {
	beforeEach(() => {
		contextStore = new Map<symbol, unknown>();
		vi.clearAllMocks();
	});

	const mockEditorContext: EditorContext = {
		draft: {
			id: '1',
			title: 'Draft',
			content: '',
			contentFormat: 'markdown',
			savedAt: new Date(),
		},
		config: DEFAULT_EDITOR_CONFIG,
		isDirty: false,
		isSaving: false,
		lastSaved: null,
	};

	describe('createEditorContext', () => {
		it('sets context and returns it', () => {
			const result = createEditorContext(mockEditorContext);
			expect(result).toBe(mockEditorContext);
			expect(contextStore.has(EDITOR_CONTEXT_KEY)).toBe(true);
		});
	});

	describe('getEditorContext', () => {
		it('returns context if exists', () => {
			createEditorContext(mockEditorContext);
			const result = getEditorContext();
			expect(result).toBe(mockEditorContext);
		});

		it('throws error if context missing', () => {
			expect(() => getEditorContext()).toThrow('Editor context not found');
		});
	});

	describe('hasEditorContext', () => {
		it('returns true if context exists', () => {
			createEditorContext(mockEditorContext);
			expect(hasEditorContext()).toBe(true);
		});

		it('returns false if context missing', () => {
			expect(hasEditorContext()).toBe(false);
		});

		it('returns false if getContext throws (simulated)', () => {
			// It's hard to make the mock throw unless we override it,
			// but the real getContext doesn't throw on missing key, it returns undefined.
			// The implementation of hasEditorContext wraps in try/catch just in case?
			// Actually hasEditorContext implementation:
			// try { return !!getContext(...) } catch { return false }

			// If we force getContext to throw:
			const getContextMock = vi.mocked(getContext);
			getContextMock.mockImplementationOnce(() => {
				throw new Error('Ouch');
			});

			expect(hasEditorContext()).toBe(false);
		});
	});
});
