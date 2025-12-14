import type { ComponentType } from 'svelte';
import { screen, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import type { ArtistData } from '../../src/components/ArtistProfile/context';
import type { CollaborationData } from '../../src/types/community';
import type { WIPThreadData } from '../../src/types/creative-tools';

// Roots (Wrappers)
import ArtistProfileRoot from '../../src/components/ArtistProfile/Root.svelte';
import ArtistProfileTestWrapper from './ArtistProfileTestWrapper.svelte';
import CollaborationRoot from '../../src/components/Community/Collaboration/Root.svelte';
import WIPRoot from '../../src/components/CreativeTools/WorkInProgress/Root.svelte';

// Components - Artist Profile
import ArtistProfileSections from '../../src/components/ArtistProfile/Sections.svelte';
import ArtistProfileHeroBanner from '../../src/components/ArtistProfile/HeroBanner.svelte';
import ArtistProfileAvatar from '../../src/components/ArtistProfile/Avatar.svelte';

// Components - Community Collaboration
import CollaborationProject from '../../src/components/Community/Collaboration/Project.svelte';

// Components - Creative Tools WIP
import WIPVersionCard from '../../src/components/CreativeTools/WorkInProgress/VersionCard.svelte';
import WIPVersionList from '../../src/components/CreativeTools/WorkInProgress/VersionList.svelte';

// Stub global confirm for tests
global.confirm = vi.fn(() => true);

interface Scenario {
	name: string;
	props: Record<string, unknown>;
	Wrapper?: ComponentType;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	component: ComponentType;
	scenarios: Scenario[];
}

// Mock Data Generators
const createMockArtist = (): ArtistData => ({
	id: 'a1',
	displayName: 'Test Artist',
	username: 'testartist',
	profileUrl: '/u/testartist',
	status: 'online',
	verified: true,
	commissionStatus: 'open',
	badges: [],
	stats: {
		followers: 100,
		following: 10,
		works: 5,
		exhibitions: 1,
		collaborations: 0,
		totalViews: 500,
	},
	sections: [
		{
			id: 's1',
			type: 'recent-work',
			title: 'Recent Work',
			items: [],
			layout: 'grid',
			visible: true,
			order: 0,
		},
	],
	joinedAt: new Date().toISOString(),
	avatar: 'avatar.jpg',
	heroBanner: 'hero.jpg',
});

const createMockCollaboration = (): CollaborationData => ({
	id: 'c1',
	title: 'Collab Project',
	description: 'A test collaboration',
	status: 'planning',
	members: [],
	updates: [],
	isPublic: true,
	acceptingMembers: true,
	createdAt: new Date().toISOString(),
	coverImage: 'cover.jpg',
});

const createMockWIPThread = (): WIPThreadData => ({
	id: 'w1',
	title: 'WIP Thread',
	artistId: 'a1',
	artistName: 'Test Artist',
	updates: [
		{
			id: 'u1',
			content: 'Update 1',
			createdAt: new Date().toISOString(),
			media: [{ type: 'image', url: 'img.jpg' }],
		},
	],
	currentProgress: 50,
	isComplete: false,
	createdAt: new Date().toISOString(),
});

const mockArtist = createMockArtist();
const mockCollaboration = createMockCollaboration();
const mockWIPThread = createMockWIPThread();

export const componentsToCover: Record<string, ComponentDefinition> = {
	// Artist Profile
	'ArtistProfile/Sections': {
		component: ArtistProfileSections,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArtistProfileRoot,
				wrapperProps: { artist: mockArtist },
			},
			{
				name: 'editing',
				props: {},
				Wrapper: ArtistProfileTestWrapper,
				wrapperProps: { artist: mockArtist, isOwnProfile: true, isEditing: true },
				action: async () => {
					// Toggle visibility of first section if available
					const toggleBtns = screen.getAllByLabelText(/Show section|Hide section/);
					if (toggleBtns[0]) {
						await fireEvent.click(toggleBtns[0]);
					}
				},
			},
		],
	},
	'ArtistProfile/HeroBanner': {
		component: ArtistProfileHeroBanner,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArtistProfileRoot,
				wrapperProps: { artist: mockArtist },
			},
		],
	},
	'ArtistProfile/Avatar': {
		component: ArtistProfileAvatar,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ArtistProfileRoot,
				wrapperProps: { artist: mockArtist },
			},
		],
	},

	// Community Collaboration
	'Community/Collaboration/Project': {
		component: CollaborationProject,
		scenarios: [
			{
				name: 'viewer',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration, role: 'viewer' },
			},
			{
				name: 'owner-manage',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration, role: 'owner' },
				action: async () => {
					// Change status
					const select = screen.getByRole('combobox');
					if (select) {
						await fireEvent.change(select, { target: { value: 'active' } });
					}
				},
			},
		],
	},

	// Creative Tools - WIP
	'CreativeTools/WorkInProgress/VersionCard': {
		component: WIPVersionCard,
		scenarios: [
			{
				name: 'default',
				props: {
					version: {
						id: 'v1',
						title: 'Version 1',
						description: 'Initial sketch',
						createdAt: new Date().toISOString(),
						media: { type: 'image', url: 'test.jpg' },
						progress: 50,
						stats: { likes: 10, comments: 5 },
					},
				},
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
			},
			{
				name: 'no-media',
				props: {
					version: {
						id: 'v2',
						title: 'Version 2',
						description: 'No media',
						createdAt: new Date().toISOString(),
						progress: 75,
						stats: { likes: 0, comments: 0 },
					},
				},
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
			},
		],
	},
	'CreativeTools/WorkInProgress/VersionList': {
		component: WIPVersionList,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
			},
			{
				name: 'empty',
				props: {},
				Wrapper: WIPRoot,
				wrapperProps: { thread: { ...mockWIPThread, updates: [] } },
			},
		],
	},
};
