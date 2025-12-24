import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ContributorsTestWrapper from './ContributorsTestWrapper.svelte';
import type { CollaborationContext } from '../../../../src/components/Community/Collaboration/context.js';
import type { CollaborationData } from '../../../../src/types/community.js';

describe('Collaboration.Contributors', () => {
	const mockArtist = {
		id: '1',
		displayName: 'Owner Artist',
		username: 'owner',
		profileUrl: '/artist/owner',
	};

	const mockContributor = {
		id: '2',
		displayName: 'Contributor Artist',
		username: 'contributor',
		avatar: 'avatar.jpg',
	};

	const mockCollaboration: CollaborationData = {
		id: '1',
		title: 'Test Collab',
		description: 'Test Description',
		status: 'active',
		visibility: 'public',
		members: [
			{
				artist: mockArtist,
				role: 'owner',
				joinedAt: new Date().toISOString(),
				status: 'active',
				permissions: [],
			},
			{
				artist: mockContributor,
				role: 'contributor',
				joinedAt: new Date().toISOString(),
				status: 'active',
				permissions: [],
				contribution: 'Vocals',
			},
		],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		acceptingMembers: true,
		tags: [],
		stats: { views: 0, likes: 0, comments: 0 },
		assets: [],
	};

	const mockHandlers = {
		onInvite: vi.fn(),
	};

	const mockContext: CollaborationContext = {
		collaboration: mockCollaboration,
		config: {
			showProject: true,
			showContributors: true,
			showUploads: true,
			showGallery: true,
			showSplit: true,
			enableUploads: true,
			class: '',
		},
		handlers: mockHandlers,
		role: 'viewer',
		currentMember: null,
		splitAgreement: null,
		selectedAsset: null,
		isUploading: false,
	};

	it('renders contributors list', () => {
		render(ContributorsTestWrapper, { props: { context: mockContext } });
		expect(screen.getByText('Contributors')).toBeInTheDocument();
		expect(screen.getByText('Owner Artist')).toBeInTheDocument();
		expect(screen.getByText('Contributor Artist')).toBeInTheDocument();
		expect(screen.getByText('Vocals')).toBeInTheDocument();
	});

	it('hides component when showContributors is false', () => {
		const hiddenContext = {
			...mockContext,
			config: { ...mockContext.config, showContributors: false },
		};
		render(ContributorsTestWrapper, { props: { context: hiddenContext } });
		expect(screen.queryByText('Contributors')).not.toBeInTheDocument();
	});

	it('shows invite button when user is owner and accepting members', async () => {
		const ownerContext = { ...mockContext, role: 'owner' as const };
		render(ContributorsTestWrapper, { props: { context: ownerContext } });
		expect(screen.getByText('Add Contributor')).toBeInTheDocument();
	});

	it('hides invite button when user is not owner', () => {
		render(ContributorsTestWrapper, { props: { context: mockContext } }); // role is viewer
		expect(screen.queryByText('Add Contributor')).not.toBeInTheDocument();
	});

	it('toggles invite form', async () => {
		const ownerContext = { ...mockContext, role: 'owner' as const };
		render(ContributorsTestWrapper, { props: { context: ownerContext } });

		const inviteBtn = screen.getByText('Add Contributor');
		await fireEvent.click(inviteBtn);

		expect(screen.getByPlaceholderText('Artist username or ID...')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();

		await fireEvent.click(inviteBtn); // Click Cancel
		expect(screen.queryByPlaceholderText('Artist username or ID...')).not.toBeInTheDocument();
		expect(screen.getByText('Add Contributor')).toBeInTheDocument();
	});

	it('handles invite submission', async () => {
		const ownerContext = { ...mockContext, role: 'owner' as const };
		render(ContributorsTestWrapper, { props: { context: ownerContext } });

		await fireEvent.click(screen.getByText('Add Contributor'));

		const input = screen.getByPlaceholderText('Artist username or ID...');
		await fireEvent.input(input, { target: { value: 'newartist' } });

		const submitBtn = screen.getByText('Send Invite');
		await fireEvent.click(submitBtn);

		expect(mockHandlers.onInvite).toHaveBeenCalledWith(mockCollaboration, 'newartist');
	});

	it('disables submit button when input is empty', async () => {
		const ownerContext = { ...mockContext, role: 'owner' as const };
		render(ContributorsTestWrapper, { props: { context: ownerContext } });

		await fireEvent.click(screen.getByText('Add Contributor'));

		const submitBtn = screen.getByText('Send Invite');
		expect(submitBtn).toBeDisabled();
	});
});
