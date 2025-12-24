import { describe, it, expect, vi, afterEach } from 'vitest';
import * as svelte from 'svelte';
import {
	createCritiqueCircleContext,
	getCritiqueCircleContext,
	hasCritiqueCircleContext,
	calculateEstimatedWaitTime,
	formatWaitTime,
	getMemberBadge,
	canModerate,
	canSubmit,
	canCritique,
	canInvite,
	canRemoveMember,
	CRITIQUE_CIRCLE_CONTEXT_KEY,
	type CritiqueCircleContext,
} from '../../../../src/components/Community/CritiqueCircle/context.js';

// Mock Svelte context functions
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('CritiqueCircle Context', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Context Management', () => {
		it('creates context correctly', () => {
			const mockCircle = { id: '1', members: [] } as any;
			const context = createCritiqueCircleContext(mockCircle);

			expect(svelte.setContext).toHaveBeenCalledWith(
				CRITIQUE_CIRCLE_CONTEXT_KEY,
				expect.anything()
			);
			expect(context.circle).toBe(mockCircle);
		});

		it('gets context successfully', () => {
			const mockContext = { circle: {} } as any;
			vi.mocked(svelte.getContext).mockReturnValue(mockContext);

			expect(getCritiqueCircleContext()).toBe(mockContext);
		});

		it('throws if context not found', () => {
			vi.mocked(svelte.getContext).mockReturnValue(undefined);

			expect(() => getCritiqueCircleContext()).toThrow('CritiqueCircle context not found');
		});

		it('checks if context exists', () => {
			vi.mocked(svelte.getContext).mockReturnValue({} as any);
			expect(hasCritiqueCircleContext()).toBe(true);
		});

		// This handles the try/catch block if getContext throws
		it('returns false if checking context throws', () => {
			vi.mocked(svelte.getContext).mockImplementation(() => {
				throw new Error('Svelte error');
			});
			expect(hasCritiqueCircleContext()).toBe(false);
		});
	});

	describe('Utilities', () => {
		describe('calculateEstimatedWaitTime', () => {
			it('uses default average time (30 min)', () => {
				expect(calculateEstimatedWaitTime(2)).toBe(60);
			});

			it('uses custom average time', () => {
				expect(calculateEstimatedWaitTime(2, 15)).toBe(30);
			});
		});

		describe('formatWaitTime', () => {
			it('formats minutes', () => {
				expect(formatWaitTime(45)).toBe('~45 min');
			});

			it('formats exact hours', () => {
				expect(formatWaitTime(120)).toBe('~2 hr');
			});

			it('formats hours and minutes', () => {
				expect(formatWaitTime(90)).toBe('~1 hr 30 min');
			});
		});

		describe('getMemberBadge', () => {
			it('returns admin badge', () => {
				expect(getMemberBadge('admin')).toEqual({
					label: 'Admin',
					color: 'var(--gr-color-warning-500)',
				});
			});

			it('returns moderator badge', () => {
				expect(getMemberBadge('moderator')).toEqual({
					label: 'Moderator',
					color: 'var(--gr-color-primary-500)',
				});
			});

			it('returns member badge for others', () => {
				expect(getMemberBadge('member')).toEqual({
					label: 'Member',
					color: 'var(--gr-color-gray-500)',
				});
			});
		});
	});

	describe('Permissions', () => {
		const createMockContext = (membership: any): CritiqueCircleContext => ({
			membership,
			circle: {} as any,
			config: {} as any,
			handlers: {} as any,
			currentMember: null,
			session: {} as any,
			queue: {} as any,
			selectedHistoryItem: null,
			isSubmitting: false,
		});

		it('checks moderation permissions', () => {
			expect(canModerate(createMockContext('admin'))).toBe(true);
			expect(canModerate(createMockContext('moderator'))).toBe(true);
			expect(canModerate(createMockContext('member'))).toBe(false);
		});

		it('checks submission permissions', () => {
			expect(canSubmit(createMockContext('member'))).toBe(true);
			expect(canSubmit(createMockContext('viewer'))).toBe(false);
		});

		it('checks critique permissions', () => {
			expect(canCritique(createMockContext('member'))).toBe(true);
			expect(canCritique(createMockContext('viewer'))).toBe(false);
			expect(canCritique(createMockContext('pending'))).toBe(false);
		});

		it('checks invite permissions', () => {
			expect(canInvite(createMockContext('admin'))).toBe(true);
			expect(canInvite(createMockContext('moderator'))).toBe(true);
			expect(canInvite(createMockContext('member'))).toBe(false);
		});

		it('checks remove member permissions', () => {
			expect(canRemoveMember(createMockContext('admin'))).toBe(true);
			expect(canRemoveMember(createMockContext('moderator'))).toBe(false);
		});
	});
});
