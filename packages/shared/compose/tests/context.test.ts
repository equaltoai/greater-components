import { describe, it, expect, vi, afterEach } from 'vitest';
import { createComposeContext, getComposeContext, hasComposeContext } from '../src/context.js';
import { getContext, setContext } from 'svelte';

// Mock svelte context
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn(),
}));

describe('context', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('createComposeContext', () => {
		it('should create context with default values', () => {
			const context = createComposeContext();

			expect(context.config.characterLimit).toBe(500);
			expect(context.config.defaultVisibility).toBe('public');
			expect(context.state.content).toBe('');
			expect(setContext).toHaveBeenCalled();
		});

		it('should create context with custom config', () => {
			const context = createComposeContext({
				characterLimit: 1000,
				defaultVisibility: 'unlisted',
			});

			expect(context.config.characterLimit).toBe(1000);
			expect(context.config.defaultVisibility).toBe('unlisted');
		});

		it('should create context with initial state', () => {
			const context = createComposeContext(
				{},
				{},
				{
					content: 'Initial content',
				}
			);

			expect(context.state.content).toBe('Initial content');
		});

		it('should allow state updates', () => {
			const context = createComposeContext();

			context.updateState({ content: 'Updated' });

			expect(context.state.content).toBe('Updated');
		});

		it('expresses Lesser CMS draft review and publication state additively', () => {
			const context = createComposeContext(
				{},
				{},
				{
					cmsDraft: {
						id: 'draft-1',
						status: 'DRAFT',
						contentHash: 'sha256:abc',
						revision: 4,
						review: {
							verdict: 'APPROVED',
							grants: [
								{
									reviewerId: 'reviewer-1',
									grantedAt: '2026-08-09T00:00:00.000Z',
									status: 'ACTIVE',
								},
							],
							verdicts: [
								{
									reviewerId: 'reviewer-1',
									verdict: 'APPROVED',
									contentHash: 'sha256:abc',
									recordedAt: '2026-08-09T00:01:00.000Z',
									current: true,
									stale: false,
								},
							],
							activeReviewerIds: ['reviewer-1'],
							publishEligible: false,
							publishBlockingReasons: ['principal approval required'],
							reviewersApproved: true,
							principalApprovalRequired: true,
							principalApproved: false,
						},
					},
				}
			);

			expect(context.state.cmsDraft).toMatchObject({
				id: 'draft-1',
				revision: 4,
				review: {
					publishEligible: false,
					principalApprovalRequired: true,
					grants: [{ reviewerId: 'reviewer-1', status: 'ACTIVE' }],
					verdicts: [{ reviewerId: 'reviewer-1', current: true, stale: false }],
				},
			});
		});

		it('should reset state', () => {
			const context = createComposeContext(
				{},
				{},
				{
					content: 'Initial',
				}
			);

			context.updateState({ content: 'Updated' });
			context.reset();

			expect(context.state.content).toBe('');
		});
	});

	describe('getComposeContext', () => {
		it('should return context if exists', () => {
			const mockContext = {};
			vi.mocked(getContext).mockReturnValue(mockContext);

			const result = getComposeContext();
			expect(result).toBe(mockContext);
		});

		it('should throw if context missing', () => {
			vi.mocked(getContext).mockReturnValue(undefined);

			expect(() => getComposeContext()).toThrow('Compose context not found');
		});
	});

	describe('hasComposeContext', () => {
		it('should return true if context exists', () => {
			vi.mocked(getContext).mockReturnValue({});
			expect(hasComposeContext()).toBe(true);
		});

		it('should return false if context missing', () => {
			vi.mocked(getContext).mockReturnValue(undefined);
			expect(hasComposeContext()).toBe(false);
		});
	});
});
