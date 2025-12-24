import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TestContextWrapper from './TestContextWrapper.svelte';
import TestContextConsumer from './TestContextConsumer.svelte';
import {
	canManage,
	canContribute,
	canUpload,
	canInviteMembers,
	getStatusBadge,
	calculateTotalSplit,
	isSplitValid,
	type CollaborationContext,
} from '../../../../../src/components/Community/Collaboration/context';
import type { CollaborationData, CollaborationMember } from '../../../../../src/types/community';

// Minimal mocks
const mockMemberOwner: CollaborationMember = {
	artist: { id: 'a1', username: 'owner' } as any,
	role: 'owner',
	joinedAt: new Date(),
};

const mockMemberContributor: CollaborationMember = {
	artist: { id: 'a2', username: 'contrib' } as any,
	role: 'contributor',
	joinedAt: new Date(),
};

const mockCollaboration: CollaborationData = {
	id: '1',
	title: 'Test Project',
	description: 'Test Description',
	status: 'active',
	members: [mockMemberOwner, mockMemberContributor],
	updates: [],
	isPublic: true,
	acceptingMembers: true,
	createdAt: new Date(),
};

describe('Collaboration Context', () => {
	describe('createCollaborationContext', () => {
		it('provides context with correct values', () => {
			let context: CollaborationContext | undefined;
			const onContext = (ctx: CollaborationContext) => {
				context = ctx;
			};

			render(TestContextWrapper, {
				props: {
					collaboration: mockCollaboration,
					role: 'owner',
					children: () => render(TestContextConsumer, { props: { onContext } }),
				},
			});

			expect(context).toBeDefined();
			expect(context?.collaboration).toBe(mockCollaboration);
			expect(context?.role).toBe('owner');
			expect(context?.config.showProject).toBe(true); // Default
		});

		it('derives currentMember correctly', () => {
			let context: CollaborationContext | undefined;
			const onContext = (ctx: CollaborationContext) => {
				context = ctx;
			};

			render(TestContextWrapper, {
				props: {
					collaboration: mockCollaboration,
					role: 'contributor',
					children: () => render(TestContextConsumer, { props: { onContext } }),
				},
			});

			expect(context?.currentMember?.role).toBe('contributor');
		});

		it('merges config with defaults', () => {
			let context: CollaborationContext | undefined;
			const onContext = (ctx: CollaborationContext) => {
				context = ctx;
			};

			render(TestContextWrapper, {
				props: {
					collaboration: mockCollaboration,
					config: { showProject: false },
					children: () => render(TestContextConsumer, { props: { onContext } }),
				},
			});

			expect(context?.config.showProject).toBe(false);
			expect(context?.config.showContributors).toBe(true); // Default preserved
		});
	});

	describe('Permission Helpers', () => {
		const createMockContext = (role: any, config = {}, collaborationOverrides = {}) =>
			({
				role,
				config: { enableUploads: true, ...config },
				collaboration: { ...mockCollaboration, ...collaborationOverrides },
				handlers: {},
				currentMember: null,
				splitAgreement: null,
				selectedAsset: null,
				isUploading: false,
			}) as CollaborationContext;

		describe('canManage', () => {
			it('returns true for owner', () => {
				expect(canManage(createMockContext('owner'))).toBe(true);
			});
			it('returns false for contributor', () => {
				expect(canManage(createMockContext('contributor'))).toBe(false);
			});
			it('returns false for viewer', () => {
				expect(canManage(createMockContext('viewer'))).toBe(false);
			});
		});

		describe('canContribute', () => {
			it('returns true for owner', () => {
				expect(canContribute(createMockContext('owner'))).toBe(true);
			});
			it('returns true for contributor', () => {
				expect(canContribute(createMockContext('contributor'))).toBe(true);
			});
			it('returns false for viewer', () => {
				expect(canContribute(createMockContext('viewer'))).toBe(false);
			});
		});

		describe('canUpload', () => {
			it('returns true if enabled and user is contributor/owner', () => {
				expect(canUpload(createMockContext('owner'))).toBe(true);
				expect(canUpload(createMockContext('contributor'))).toBe(true);
			});
			it('returns false if disabled in config', () => {
				expect(canUpload(createMockContext('owner', { enableUploads: false }))).toBe(false);
			});
			it('returns false for viewer', () => {
				expect(canUpload(createMockContext('viewer'))).toBe(false);
			});
		});

		describe('canInviteMembers', () => {
			it('returns true for owner when accepting members', () => {
				expect(canInviteMembers(createMockContext('owner', {}, { acceptingMembers: true }))).toBe(
					true
				);
			});
			it('returns false for owner when not accepting members', () => {
				expect(canInviteMembers(createMockContext('owner', {}, { acceptingMembers: false }))).toBe(
					false
				);
			});
			it('returns false for non-owner', () => {
				expect(
					canInviteMembers(createMockContext('contributor', {}, { acceptingMembers: true }))
				).toBe(false);
			});
		});
	});

	describe('Utility Functions', () => {
		describe('getStatusBadge', () => {
			it('returns correct badge for planning', () => {
				expect(getStatusBadge('planning').label).toBe('Planning');
			});
			it('returns correct badge for active', () => {
				expect(getStatusBadge('active').label).toBe('Active');
			});
			it('returns correct badge for paused', () => {
				expect(getStatusBadge('paused').label).toBe('Paused');
			});
			it('returns correct badge for completed', () => {
				expect(getStatusBadge('completed').label).toBe('Completed');
			});
			it('returns correct badge for cancelled', () => {
				expect(getStatusBadge('cancelled').label).toBe('Cancelled');
			});
			it('returns default for unknown', () => {
				expect(getStatusBadge('unknown' as any).label).toBe('unknown');
			});
		});

		describe('Split Calculations', () => {
			const mockSplit = {
				id: 's1',
				splits: [
					{ artistId: '1', artistName: 'A', percentage: 40, confirmed: true },
					{ artistId: '2', artistName: 'B', percentage: 60, confirmed: true },
				],
				isConfirmed: true,
				createdAt: new Date(),
			};

			it('calculateTotalSplit sums percentages', () => {
				expect(calculateTotalSplit(mockSplit)).toBe(100);
			});

			it('calculateTotalSplit returns 0 for null', () => {
				expect(calculateTotalSplit(null)).toBe(0);
			});

			it('isSplitValid returns true for 100%', () => {
				expect(isSplitValid(mockSplit)).toBe(true);
			});

			it('isSplitValid returns false for != 100%', () => {
				const invalidSplit = { ...mockSplit, splits: [{ ...mockSplit.splits[0], percentage: 30 }] };
				expect(isSplitValid(invalidSplit)).toBe(false);
			});
		});
	});
});
