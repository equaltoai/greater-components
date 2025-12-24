// @ts-nocheck
import { screen, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';

import type { ArtistData } from '../../src/components/ArtistProfile/context';
import type { ArtworkData } from '../../src/types/artwork';
import type { CollaborationData } from '../../src/types/community';
import type {
	WIPThreadData,
	ReferenceBoardData,
	CommissionData,
} from '../../src/types/creative-tools';

import type { ExhibitionData } from '../../src/types/curation';
import type { CritiqueSubmission } from '../../src/types/community';
import type { CollectionData, CuratorData } from '../../src/types/curation';

// ... (imports remain the same, just skipping lines for brevity if possible, but I must provide valid context)
// Actually I need to split this if they are far apart.
// StartLine 8.

// Roots (Wrappers)
import ArtistProfileRoot from '../../src/components/ArtistProfile/Root.svelte';
import ArtistProfileTestWrapper from './ArtistProfileTestWrapper.svelte';
import CollaborationRoot from '../../src/components/Community/Collaboration/Root.svelte';
import WIPRoot from '../../src/components/CreativeTools/WorkInProgress/Root.svelte';
import WIPTestWrapper from './WIPTestWrapper.svelte';

import CommissionWorkflowTestWrapper from './coverage/CommissionWorkflowTestWrapper.svelte';
import CommissionInteractiveWrapper from './coverage/CommissionInteractiveWrapper.svelte';
import WIPContextConsumer from './coverage/WIPContextConsumer.svelte';
import CritiqueCircleContextConsumer from './coverage/CritiqueCircleContextConsumer.svelte';
import ExhibitionContextConsumer from './coverage/ExhibitionContextConsumer.svelte';
import ExhibitionRoot from '../../src/components/Exhibition/Root.svelte';
import TestDiscoveryWrapper from './TestDiscoveryWrapper.svelte';

// Components - Artist Profile
import ArtistProfileSections from '../../src/components/ArtistProfile/Sections.svelte';
import ArtistProfileHeroBanner from '../../src/components/ArtistProfile/HeroBanner.svelte';
import ArtistProfileAvatar from '../../src/components/ArtistProfile/Avatar.svelte';
import ArtistTimeline from '../../src/components/ArtistTimeline.svelte';
import ArtistProfileTimeline from '../../src/components/ArtistProfile/Timeline.svelte';

// Components - Community Collaboration
import CollaborationProject from '../../src/components/Community/Collaboration/Project.svelte';
import CollaborationSplit from '../../src/components/Community/Collaboration/Split.svelte';
import CollaborationUploads from '../../src/components/Community/Collaboration/Uploads.svelte';
import CollaborationContributors from '../../src/components/Community/Collaboration/Contributors.svelte';
import CollaborationGallery from '../../src/components/Community/Collaboration/Gallery.svelte';

// Components - Creative Tools WIP
import WIPVersionCard from '../../src/components/CreativeTools/WorkInProgress/VersionCard.svelte';
import WIPVersionList from '../../src/components/CreativeTools/WorkInProgress/VersionList.svelte';
import WIPCompare from '../../src/components/CreativeTools/WorkInProgress/Compare.svelte';
import WIPComments from '../../src/components/CreativeTools/WorkInProgress/Comments.svelte';
import ReferenceBoard from '../../src/components/CreativeTools/ReferenceBoard.svelte';

// Components - Monetization
import DirectPurchase from '../../src/components/Monetization/DirectPurchase.svelte';
import ProtectionTools from '../../src/components/Monetization/ProtectionTools.svelte';
import TipJar from '../../src/components/Monetization/TipJar.svelte';
import PremiumBadge from '../../src/components/Monetization/PremiumBadge.svelte';
import ExhibitionRootTestWrapper from './ExhibitionRootTestWrapper.svelte';

// Components - Exhibition
import ExhibitionGallery from '../../src/components/Exhibition/Gallery.svelte';
import ExhibitionArtists from '../../src/components/Exhibition/Artists.svelte';
import ExhibitionStatement from '../../src/components/Exhibition/Statement.svelte';

// Components - Curation
import CollectionCard from '../../src/components/Curation/CollectionCard.svelte';
import CuratorSpotlight from '../../src/components/Curation/CuratorSpotlight.svelte';

// Components - Community Critique Circle
import CritiqueCircleRoot from '../../src/components/Community/CritiqueCircle/Root.svelte';
import CritiqueCircleQueue from '../../src/components/Community/CritiqueCircle/Queue.svelte';
import CritiqueCircleSession from '../../src/components/Community/CritiqueCircle/Session.svelte';
import CritiqueCircleMembers from '../../src/components/Community/CritiqueCircle/Members.svelte';
import CritiqueCircleHistory from '../../src/components/Community/CritiqueCircle/History.svelte';

// Components - Media Viewer
import MediaViewerRoot from '../../src/components/MediaViewer/Root.svelte';

// Components - Creative Tools Critique Mode
import CritiqueModeRoot from '../../src/components/CreativeTools/CritiqueMode/Root.svelte';
import CritiqueModeAnnotations from '../../src/components/CreativeTools/CritiqueMode/Annotations.svelte';
import CritiqueModeImage from '../../src/components/CreativeTools/CritiqueMode/Image.svelte';

// Components - Artwork
import ArtworkRoot from '../../src/components/Artwork/Root.svelte';
import ArtworkImage from '../../src/components/Artwork/Image.svelte';
import ArtworkAIDisclosure from '../../src/components/Artwork/AIDisclosure.svelte';

// Components - Community Mentor Match
import MentorMatch from '../../src/components/Community/MentorMatch.svelte';

// Components - Discovery
import Suggestions from '../../src/components/Discovery/Suggestions.svelte';
import Filters from '../../src/components/Discovery/Filters.svelte';
import SearchBar from '../../src/components/Discovery/SearchBar.svelte';

// Components - Gallery
import GalleryGrid from '../../src/components/Gallery/Grid.svelte';
import GalleryRow from '../../src/components/Gallery/Row.svelte';

// Components - Transparency

// Components - Transparency
import AIDisclosure from '../../src/components/Transparency/AIDisclosure.svelte';
import AIOptOutControls from '../../src/components/Transparency/AIOptOutControls.svelte';
import EthicalSourcingBadge from '../../src/components/Transparency/EthicalSourcingBadge.svelte';
import ProcessDocumentation from '../../src/components/Transparency/ProcessDocumentation.svelte';

// Components - Top Level
import PortfolioSection from '../../src/components/PortfolioSection.svelte';

// Stub global confirm for tests
global.confirm = vi.fn(() => true);

// Stub scrollBy for GalleryRow
if (typeof HTMLElement !== 'undefined') {
	HTMLElement.prototype.scrollBy = vi.fn();
}

// Stub DataTransfer for drag events
class MockDataTransfer {
	data = new Map<string, string>();
	_files: File[] = [];
	items = {
		add: (file: File) => this._files.push(file),
	};
	get files() {
		const list = Object.create(FileList.prototype);
		Object.defineProperty(list, 'length', { value: this._files.length });
		this._files.forEach((file, index) => {
			Object.defineProperty(list, index, { value: file });
		});
		list.item = (index: number) => this._files[index];
		return list;
	}
	effectAllowed = 'none';
	dropEffect = 'none';
	setData(format: string, data: string) {
		this.data.set(format, data);
	}
	getData(format: string) {
		return this.data.get(format) || '';
	}
}

// Polyfill DataTransfer and patch HTMLInputElement to accept mock FileList
global.DataTransfer = MockDataTransfer as unknown as typeof DataTransfer;

if (typeof HTMLInputElement !== 'undefined') {
	const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'files');
	Object.defineProperty(HTMLInputElement.prototype, 'files', {
		get() {
			return (this as MockInputElement)._mockFiles || originalDescriptor?.get?.call(this);
		},
		set(value) {
			(this as MockInputElement)._mockFiles = value;
		},
		configurable: true,
	});
}

// Helper interface for mocked input
interface MockInputElement extends HTMLInputElement {
	_mockFiles?: FileList;
}

interface Scenario {
	[key: string]: unknown;
	name: string;
	props: Record<string, unknown>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Wrapper?: any;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: any;
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
	updates: [
		{
			id: 'u1',
			authorId: 'u1',
			authorName: 'User 1',
			content: 'Initial update',
			createdAt: new Date().toISOString(),
		},
	],
	isPublic: true,
	acceptingMembers: true,
	createdAt: new Date().toISOString(),
	deadline: new Date(Date.now() + 86400000).toISOString(),
	coverImage: 'cover.jpg',
	sharedAssets: [
		{
			id: 'asset1',
			name: 'sketch.jpg',
			url: 'sketch.jpg',
			uploadedBy: 'User 1',
			uploadedAt: new Date().toISOString(),
		},
	],
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
		{
			id: 'u2',
			content: 'Update 2',
			createdAt: new Date().toISOString(),
			media: [{ type: 'image', url: 'img2.jpg' }],
		},
	],
	currentProgress: 50,
	isComplete: false,
	createdAt: new Date().toISOString(),
});

// Hybrid Mock for Artwork to satisfy both types/artwork and Artwork/context
const createMockArtwork = (): ArtworkData => ({
	id: 'art1',
	title: 'Masterpiece',
	description: 'A wonderful piece',
	artist: {
		id: 'a1',
		name: 'Test Artist',
		username: 'testartist',
		verified: true,
		avatar: 'avatar.jpg',
	},
	createdAt: '2023-01-01T12:00:00Z',
	images: {
		thumbnail: 'art-thumb.jpg',
		preview: 'art-preview.jpg',
		standard: 'art.jpg',
		full: 'art-full.jpg',
	},
	metadata: {
		medium: 'Oil on canvas',
		year: 2023,
		dimensions: '24x36',
	},
	stats: {
		views: 1000,
		likes: 100,
		comments: 10,
		collections: 5,
	},
	aiUsage: { hasAI: false },
	altText: 'A painting',
});

const createMockCurator = (): CuratorData => ({
	id: 'cur1',
	name: 'Jane Doe',
	bio: 'Art historian and curator',
	avatar: 'curator.jpg',
	institution: 'MOMA',
	isVerified: true,
	focusAreas: ['Modern', 'Digital'],
	exhibitionCount: 12,
	followerCount: 500,
	socialLinks: { twitter: 'janedoe' },
});

const createMockExhibition = (): ExhibitionData => ({
	id: 'ex1',
	slug: 'retrospective',
	title: 'Retrospective',
	description: 'A look back',
	curator: createMockCurator(),
	coverImage: 'cover.jpg',
	startDate: new Date().toISOString(),
	status: 'current',
	artworks: [
		createMockArtwork(),
		{
			...createMockArtwork(),
			id: 'art2',
			title: 'Earlier Work',
			createdAt: '2022-05-01T12:00:00Z',
		},
	],
	createdAt: new Date().toISOString(),
});

const createMockCritiqueHistory = (): CritiqueSubmission[] => [
	{
		id: 'sub2',
		artwork: { ...createMockArtwork(), id: 'art2', title: 'Finished Piece' },
		submitterId: 'a1',
		submittedAt: new Date(Date.now() - 86400000).toISOString(),
		critiques: [
			{
				authorId: 'm1',
				authorName: 'Mentor',
				summary: 'Great use of color',
				createdAt: new Date().toISOString(),
				annotations: [],
			},
		],
		feedbackRequested: 'General thoughts',
		isComplete: true,
	},
];

const createMockCritiqueCircle = () => ({
	id: 'cc1',
	name: 'Oil Painters',
	members: [
		{
			artist: {
				...createMockArtist(),
				id: 'm1',
				displayName: 'Mentor',
				username: 'mentor',
				avatar: 'mentor.jpg',
			},
			role: 'moderator' as const,
			joinedAt: new Date().toISOString(),
			critiquesGiven: 50,
			critiquesReceived: 10,
		},
		{
			artist: {
				...createMockArtist(),
				id: 'u1',
				displayName: 'User',
				username: 'user',
				avatar: 'user.jpg',
			},
			role: 'member' as const,
			joinedAt: new Date().toISOString(),
			critiquesGiven: 5,
			critiquesReceived: 2,
		},
	],
	queue: [
		{
			id: 'sub1',
			artwork: createMockArtwork(),
			submittedAt: new Date().toISOString(),
			status: 'queued',
		},
	],
	history: createMockCritiqueHistory(),
	isPublic: true,
});

const createMockReferenceBoard = (): ReferenceBoardData => ({
	id: 'rb1',
	title: 'Inspiration Board',
	description: 'Ideas for next project',
	ownerId: 'a1',
	items: [
		{
			id: 'i1',
			imageUrl: 'ref1.jpg',
			position: { x: 0.1, y: 0.1 },
			size: { width: 200, height: 200 },
			rotation: 0,
		},
		{
			id: 'i2',
			imageUrl: 'ref2.jpg',
			position: { x: 0.5, y: 0.5 },
			size: { width: 150, height: 150 },
			rotation: 15,
			notes: 'Color palette',
		},
	],
	dimensions: { width: 16, height: 9 },
	isPublic: false,
	createdAt: new Date().toISOString(),
});

const createMockCollection = (): CollectionData => ({
	id: 'col1',
	slug: 'my-collection',
	name: 'My Collection',
	description: 'A test collection',
	ownerId: 'a1',
	ownerName: 'Test Artist',
	ownerAvatar: 'avatar.jpg',
	artworks: [
		createMockArtwork(),
		{
			...createMockArtwork(),
			id: 'art2',
			images: { ...createMockArtwork().images, thumbnail: 'thumb2.jpg' },
		},
		{
			...createMockArtwork(),
			id: 'art3',
			images: { ...createMockArtwork().images, thumbnail: 'thumb3.jpg' },
		},
		{
			...createMockArtwork(),
			id: 'art4',
			images: { ...createMockArtwork().images, thumbnail: 'thumb4.jpg' },
		},
		{
			...createMockArtwork(),
			id: 'art5',
			images: { ...createMockArtwork().images, thumbnail: 'thumb5.jpg' },
		},
	],
	artworkCount: 5,
	visibility: 'public',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
});

const createMockCommission = (): CommissionData => ({
	id: 'com1',
	title: 'Portrait Commission',
	description: 'A digital portrait',
	artistId: 'a1',
	artistName: 'Test Artist',
	clientId: 'c1',
	clientName: 'Client User',
	status: 'inquiry',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
});

const mockArtist = createMockArtist();
const mockCollaboration = createMockCollaboration();
const mockWIPThread = createMockWIPThread();
const mockArtwork = createMockArtwork();
const mockExhibition = createMockExhibition();
const mockCritiqueCircle = createMockCritiqueCircle();
const mockReferenceBoard = createMockReferenceBoard();
const mockCollection = createMockCollection();
const mockCurator = createMockCurator();
const mockCommission = createMockCommission();

const mockPricing = {
	original: { price: 1000, currency: 'USD', available: true },
	prints: [
		{
			id: 'p1',
			size: 'A4',
			price: 50,
			currency: 'USD',
			available: true,
			description: 'High quality',
		},
	],
	licenses: [
		{
			id: 'l1',
			type: 'personal' as const,
			price: 30,
			currency: 'USD',
			terms: 'Personal use',
			available: true,
		},
	],
};

const mockTimelineItems = [
	{
		id: 't1',
		type: 'post' as const,
		content: 'Hello world',
		createdAt: new Date().toISOString(),
		engagement: { likes: 10, comments: 2, shares: 1 },
	},
	{
		id: 't2',
		type: 'artwork' as const,
		content: 'New art',
		createdAt: new Date().toISOString(),
		artwork: mockArtwork,
		engagement: { likes: 50, comments: 5, shares: 10 },
	},
];

const mockAIUsage = {
	hasAI: true,
	tools: [{ name: 'Midjourney', type: 'generation', usage: 'Initial concept', version: '6' }],
	humanContribution: 70,
	aiContribution: 30,
	disclosureLevel: 'detailed' as const,
	model: 'v6',
	provider: 'Midjourney',
};

const mockAnnotations = [
	{
		id: 'an1',
		position: { x: 0.2, y: 0.3 },
		content: 'Nice composition',
		category: 'composition',
		authorName: 'Critic',
	},
];

export const componentsToCover: Record<string, ComponentDefinition> = {
	// Top Level
	PortfolioSection: {
		component: PortfolioSection,
		scenarios: [
			{
				name: 'grid',
				props: {
					title: 'Featured Works',
					description: 'Best of',
					items: [mockArtwork, { ...mockArtwork, id: 'art2' }],
					layout: 'grid',
				},
			},
			{
				name: 'row-editable',
				props: {
					title: 'Drafts',
					items: [mockArtwork, { ...mockArtwork, id: 'art2' }],
					layout: 'row',
					editable: true,
					onReorder: vi.fn(),
				},
				action: async () => {
					// Simulate drag
					const items = screen.getAllByRole('listitem');
					if (items.length >= 2) {
						const first = items[0];
						const second = items[1];
						if (first && second) {
							await fireEvent.dragStart(first, {
								dataTransfer: new MockDataTransfer(),
							});
							await fireEvent.dragOver(second, {
								dataTransfer: new MockDataTransfer(),
							});
							await fireEvent.drop(second, {
								dataTransfer: new MockDataTransfer(),
							});
						}
					}
				},
			},
			{
				name: 'empty',
				props: {
					title: 'Empty',
					items: [],
				},
			},
		],
	},

	// Artwork
	'Artwork/Image': {
		component: ArtworkImage,
		scenarios: [
			{
				name: 'default',
				props: { aspectRatio: 'preserve' },
				Wrapper: ArtworkRoot,
				wrapperProps: { artwork: mockArtwork, config: { progressiveLoading: true } },
			},
			{
				name: 'no-progressive',
				props: { aspectRatio: '1:1' },
				Wrapper: ArtworkRoot,
				wrapperProps: { artwork: mockArtwork, config: { progressiveLoading: false } },
			},
			{
				name: 'error-state',
				props: {},
				Wrapper: ArtworkRoot,
				wrapperProps: {
					artwork: {
						...mockArtwork,
						images: { ...mockArtwork.images, standard: 'invalid.jpg' },
					},
				},
			},
		],
	},

	'Artwork/AIDisclosure': {
		component: ArtworkAIDisclosure,
		scenarios: [
			{
				name: 'badge-expandable',
				props: { variant: 'badge', expandable: true },
				Wrapper: ArtworkRoot,
				wrapperProps: {
					artwork: { ...mockArtwork, aiUsage: mockAIUsage },
					config: { showAIDisclosure: true },
				},
				action: async () => {
					const btn = screen.getByLabelText('AI-assisted artwork');
					await fireEvent.click(btn);
				},
			},
			{
				name: 'inline',
				props: { variant: 'inline' },
				Wrapper: ArtworkRoot,
				wrapperProps: {
					artwork: { ...mockArtwork, aiUsage: mockAIUsage },
					config: { showAIDisclosure: true },
				},
			},
			{
				name: 'detailed-no-tools',
				props: { variant: 'detailed' },
				Wrapper: ArtworkRoot,
				wrapperProps: {
					artwork: {
						...mockArtwork,
						aiUsage: { hasAI: true, description: 'Generated' },
					},
					config: { showAIDisclosure: true },
				},
			},
			{
				name: 'hidden',
				props: {},
				Wrapper: ArtworkRoot,
				wrapperProps: {
					artwork: { ...mockArtwork, aiUsage: { hasAI: false } },
					config: { showAIDisclosure: true },
				},
			},
		],
	},

	// Artist Profile
	'ArtistProfile/Timeline': {
		component: ArtistProfileTimeline,
		scenarios: [
			{
				name: 'default',
				props: { items: mockTimelineItems, showSocial: true },
				Wrapper: ArtistProfileRoot,
				wrapperProps: { artist: mockArtist },
			},
			{
				name: 'infinite-scroll',
				props: {
					items: mockTimelineItems,
					hasMore: true,
					onLoadMore: vi.fn(),
				},
				Wrapper: ArtistProfileRoot,
				wrapperProps: { artist: mockArtist },
			},
		],
	},

	// Community Critique Circle
	'Community/CritiqueCircle/History': {
		component: CritiqueCircleHistory,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: mockCritiqueCircle },
				action: async () => {
					// Filter
					const givenBtn = screen.getByText('Given');
					await fireEvent.click(givenBtn);

					// Search
					const search = screen.getByPlaceholderText('Search critiques...');
					await fireEvent.input(search, { target: { value: 'Finished' } });
				},
			},
			{
				name: 'select-item',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: mockCritiqueCircle },
				action: async () => {
					// Select item
					const items = screen.getAllByRole('listitem');
					if (items[0]) {
						const btn = items[0].querySelector('button');
						if (btn) await fireEvent.click(btn);
					}
				},
			},
			{
				name: 'empty',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: { ...mockCritiqueCircle, history: [] } },
			},
		],
	},

	// Creative Tools - Reference Board

	'CreativeTools/ReferenceBoard': {
		component: ReferenceBoard,
		scenarios: [
			{
				name: 'view-freeform',
				props: {
					board: mockReferenceBoard,
					editable: false,
					layout: 'freeform',
				},
			},
			{
				name: 'view-grid',
				props: {
					board: mockReferenceBoard,
					editable: false,
					layout: 'grid',
				},
			},
			{
				name: 'editable',
				props: {
					board: mockReferenceBoard,
					editable: true,
					handlers: {
						onRemoveItem: vi.fn(),
						onUpdateItem: vi.fn(),
						onSave: vi.fn(),
						onShare: vi.fn(),
					},
				},
				action: async () => {
					// Simulate drag on first item
					const items = screen.getAllByRole('button', { name: /Reference/ });
					if (items[0]) {
						await fireEvent.mouseDown(items[0], { clientX: 100, clientY: 100 });
						if (items[0].parentElement) {
							await fireEvent.mouseMove(items[0].parentElement, { clientX: 150, clientY: 150 });
							await fireEvent.mouseUp(items[0].parentElement);
						}
					}

					// Remove item
					const removeBtns = screen.getAllByLabelText('Remove reference');
					if (removeBtns[0]) {
						await fireEvent.click(removeBtns[0]);
					}

					// Save
					const saveBtn = screen.getByText('Save Board');
					await fireEvent.click(saveBtn);
				},
			},
		],
	},

	// Discovery - SearchBar
	'Discovery/SearchBar': {
		component: SearchBar,
		scenarios: [
			{
				name: 'default',
				props: { placeholder: 'Search...' },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						recentSearches: ['Past search 1', 'Past search 2'],
					},
					config: { showSuggestions: true, enableVisualSearch: true },
				},
				action: async () => {
					// Focus to see recent
					const input = screen.getByPlaceholderText('Search...');
					await fireEvent.focus(input);

					// Click recent
					const recent = screen.getByText('Past search 1');
					await fireEvent.click(recent);
				},
			},
			{
				name: 'typing-search',
				props: { debounceMs: 10 },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						suggestions: [
							{ id: '1', text: 'Result 1', type: 'query' },
							{ id: '2', text: 'Result 2', type: 'artist' },
						],
					},
					config: { showSuggestions: true },
				},
				action: async () => {
					const input = screen.getByRole('combobox');
					await fireEvent.input(input, { target: { value: 'test' } });

					// Wait for debounce
					await new Promise((r) => setTimeout(r, 20));

					// Key navigation
					await fireEvent.keyDown(input, { key: 'ArrowDown' });
					await fireEvent.keyDown(input, { key: 'Enter' });
				},
			},
			{
				name: 'visual-search',
				props: { showVisualSearch: true },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: { config: { enableVisualSearch: true } },
				action: async () => {
					const btn = screen.getByLabelText('Search by image');
					await fireEvent.click(btn);
					// File input is hidden, handled by onchange.
					// We can simulate change on the hidden input if we find it
					const fileInput = screen.getByLabelText('Upload image for visual search');
					await fireEvent.change(fileInput, {
						target: { files: [new File([''], 'test.png', { type: 'image/png' })] },
					});
				},
			},
			{
				name: 'clear-search',
				props: { searchAsYouType: false },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {},
				action: async () => {
					const input = screen.getByRole('combobox');
					await fireEvent.input(input, { target: { value: 'something' } });

					const clearBtn = screen.getByLabelText('Clear search');
					await fireEvent.click(clearBtn);
				},
			},
		],
	},

	// Discovery - Filters
	'Discovery/Filters': {
		component: Filters,
		scenarios: [
			{
				name: 'default',
				props: { collapsible: true, defaultExpanded: false },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						filters: {
							styles: ['impressionism'],
							mediums: ['oil'],
							colorPalette: { colors: ['#FF0000'], tolerance: 50, matchMode: 'similar' },
							mood: { energy: 0.5, valence: 0.5 },
							forSaleOnly: true,
							featuredOnly: true,
							aiUsage: 'none',
						},
					},
					config: { enableStyleFilter: true, enableColorSearch: true, enableMoodMap: true },
				},
				action: async () => {
					// Expand
					const toggle = screen.getByText('Filters');
					await fireEvent.click(toggle);

					// Clear all
					const clearAll = screen.getByLabelText('Clear all filters');
					await fireEvent.click(clearAll);

					// Re-expand (clearing might collapse or keep open depending on logic, but let's toggle)
					// Logic says: isExpanded is local state.
				},
			},
			{
				name: 'interaction',
				props: { collapsible: true, defaultExpanded: true },
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: { filters: {} },
					config: { enableStyleFilter: true, enableColorSearch: true, enableMoodMap: true },
				},
				action: async () => {
					// Select medium
					const mediumBtn = screen.getByText('Oil Paint');
					await fireEvent.click(mediumBtn);

					// Deselect medium
					await fireEvent.click(mediumBtn);

					// Select options
					const forSale = screen.getByLabelText('For sale only');
					await fireEvent.click(forSale);

					const featured = screen.getByLabelText('Featured only');
					await fireEvent.click(featured);
				},
			},
			{
				name: 'chips-removal',
				props: { collapsible: false }, // Always visible
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						filters: {
							styles: ['abstract'],
							mediums: ['digital'],
							tags: ['art'],
							dateRange: { from: '2023-01-01' },
							priceRange: { min: 100 },
							mood: { energy: 0.8, valence: 0.8 },
							aiUsage: 'detailed',
						},
					},
				},
				action: async () => {
					// Remove chips
					const removeBtns = screen.getAllByLabelText(/Remove .* filter/);
					for (const btn of removeBtns) {
						await fireEvent.click(btn);
					}
				},
			},
		],
	},

	// Discovery - Suggestions
	'Discovery/Suggestions': {
		component: Suggestions,
		scenarios: [
			{
				name: 'default-populated',
				props: {
					title: 'For You',
					maxItems: 6,
					showConfidence: true,
				},
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						suggestions: [mockArtwork, { ...mockArtwork, id: 's2', title: 'Suggestion 2' }],
					},
					handlers: {
						onResultClick: vi.fn(),
						onMoreLikeThis: vi.fn(),
					},
				},
				action: async () => {
					// Click artwork
					const item = screen.getAllByRole('button')[1]; // refresh button is 0? no, check dom
					if (item) await fireEvent.click(item);

					// Click more like this
					const moreBtn = screen.getAllByLabelText('Find similar artworks')[0];
					if (moreBtn) await fireEvent.click(moreBtn);

					// Refresh
					const refreshBtn = screen.getByLabelText('Refresh suggestions');
					await fireEvent.click(refreshBtn);
				},
			},
			{
				name: 'empty',
				props: {},
				Wrapper: TestDiscoveryWrapper,
				wrapperProps: {
					initialState: {
						suggestions: [],
					},
				},
			},
		],
	},

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
					// Toggle visibility
					const toggleBtns = screen.getAllByLabelText(/Show section|Hide section/);
					if (toggleBtns[0]) {
						await fireEvent.click(toggleBtns[0]);
					}
				},
			},
			{
				name: 'drag-reorder',
				props: {},
				Wrapper: ArtistProfileTestWrapper,
				wrapperProps: { artist: mockArtist, isOwnProfile: true, isEditing: true },
				action: async () => {
					const items = screen.getAllByRole('article');
					if (items.length >= 2) {
						const source = items[0];
						const target = items[1];

						if (source && target) {
							// Simulate drag sequence
							await fireEvent.dragStart(source, {
								dataTransfer: new MockDataTransfer(),
							});
							await fireEvent.dragOver(target, {
								dataTransfer: new MockDataTransfer(),
							});
							await fireEvent.drop(target, {
								dataTransfer: new MockDataTransfer(),
							});
						}
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
	ArtistTimeline: {
		component: ArtistTimeline,
		scenarios: [
			{
				name: 'feed',
				props: { artist: mockArtist, items: mockTimelineItems, showSocial: true },
			},
			{
				name: 'empty',
				props: { artist: mockArtist, items: [], hasMore: false },
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
			// ... (skip redundant lines) ...
			// Actually, I can't skip content in a ReplaceFileContent call unless I target smaller chunks.
			// I will target 3 separate replacements.
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
	'Community/Collaboration/Uploads': {
		component: CollaborationUploads,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration, role: 'owner' },
				action: async () => {
					// Simulate file input change
					const input = screen.getByLabelText('Upload files').querySelector('input');
					if (input) {
						await fireEvent.change(input, { target: { files: [new File([''], 'test.png')] } });
					}
				},
			},
			{
				name: 'drag-drop',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration, role: 'owner' },
				action: async () => {
					const dropzone = screen.getByLabelText('Upload files');

					// Drag over
					await fireEvent.dragOver(dropzone);

					// Drop
					const file = new File([''], 'drop.png', { type: 'image/png' });
					await fireEvent.drop(dropzone, {
						dataTransfer: {
							files: [file],
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							items: { add: (_f: any) => {} },
						},
					});
				},
			},
			{
				name: 'populated-selection',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: {
						...mockCollaboration,
						sharedAssets: [
							{
								id: 'a1',
								name: 'test.jpg',
								url: 'test.jpg',
								uploadedBy: 'User',
								uploadedAt: new Date().toISOString(),
							},
							{
								id: 'a2',
								name: 'doc.pdf',
								url: 'doc.pdf',
								uploadedBy: 'User',
								uploadedAt: new Date().toISOString(),
							},
						],
					},
					role: 'owner',
				},
				action: async () => {
					const buttons = screen.getAllByRole('button');
					// Click asset (skip dropzone which is first)
					if (buttons[1]) await fireEvent.click(buttons[1]);
				},
			},
			{
				name: 'empty-no-permission',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration, role: 'viewer' },
			},
		],
	},
	'Community/Collaboration/Contributors': {
		component: CollaborationContributors,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: { collaboration: mockCollaboration },
			},
			{
				name: 'invite-flow',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: mockCollaboration,
					role: 'owner', // owner can invite
				},
				action: async () => {
					// Open invite form
					const addBtn = screen.getByText('Add Contributor');
					await fireEvent.click(addBtn);

					// Type username
					const input = screen.getByPlaceholderText('Artist username or ID...');
					await fireEvent.input(input, { target: { value: 'newartist' } });

					// Submit
					const submitBtn = screen.getByText('Send Invite');
					await fireEvent.click(submitBtn);
				},
			},
		],
	},
	'Community/Collaboration/Gallery': {
		component: CollaborationGallery,
		scenarios: [
			{
				name: 'combined-view',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: {
						...mockCollaboration,
						sharedAssets: [
							{
								id: 'a1',
								name: 'img1.jpg',
								url: 'img1.jpg',
								uploadedBy: 'User 1',
								uploadedAt: new Date().toISOString(),
							},
							{
								id: 'a2',
								name: 'img2.jpg',
								url: 'img2.jpg',
								uploadedBy: 'User 2',
								uploadedAt: new Date().toISOString(),
							},
						],
					},
					config: { showGallery: true },
				},
			},
			{
				name: 'contributor-view',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: {
						...mockCollaboration,
						sharedAssets: [
							{
								id: 'a1',
								name: 'img1.jpg',
								url: 'img1.jpg',
								uploadedBy: 'User 1',
								uploadedAt: new Date().toISOString(),
							},
							{
								id: 'a2',
								name: 'img2.jpg',
								url: 'img2.jpg',
								uploadedBy: 'User 2',
								uploadedAt: new Date().toISOString(),
							},
						],
					},
					config: { showGallery: true },
				},
				action: async () => {
					// Switch view
					const viewBtn = screen.getByText('By Contributor');
					await fireEvent.click(viewBtn);
				},
			},
			{
				name: 'empty',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: { ...mockCollaboration, sharedAssets: [] },
					config: { showGallery: true },
				},
			},
		],
	},
	'Community/Collaboration/Split': {
		component: CollaborationSplit,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: {
						...mockCollaboration,
						members: [
							{
								artist: { id: 'a1', name: 'Artist 1', avatar: 'avatar1.jpg' },
								role: 'owner',
								joinedAt: '',
							},
							{
								artist: { id: 'a2', name: 'Artist 2', avatar: 'avatar2.jpg' },
								role: 'editor',
								joinedAt: '',
							},
						],
					},
					config: { showSplit: true },
					role: 'owner',
				},
			},
			{
				name: 'configure-split',
				props: {},
				Wrapper: CollaborationRoot,
				wrapperProps: {
					collaboration: {
						...mockCollaboration,
						members: [
							{
								artist: { id: 'a1', name: 'Artist 1', avatar: 'avatar1.jpg' },
								role: 'owner',
								joinedAt: '',
							},
							{
								artist: { id: 'a2', name: 'Artist 2', avatar: 'avatar2.jpg' },
								role: 'editor',
								joinedAt: '',
							},
						],
					},
					config: { showSplit: true },
					role: 'owner',
				},
				action: async () => {
					// Open configure
					const configBtn = screen.getByText('Configure Split');
					await fireEvent.click(configBtn);

					// Change values
					const inputs = screen.getAllByRole('spinbutton'); // number inputs
					if (inputs.length >= 2) {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						await fireEvent.input(inputs[0]!, { target: { value: '60' } });
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						await fireEvent.input(inputs[1]!, { target: { value: '40' } });
					}

					// Save
					const saveBtn = screen.getByText('Save Split Agreement');
					await fireEvent.click(saveBtn);
				},
			},
		],
	},

	// Community Critique Circle
	'Community/CritiqueCircle/Queue': {
		component: CritiqueCircleQueue,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: mockCritiqueCircle, membership: 'member' },
			},
			{
				name: 'empty',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: { ...mockCritiqueCircle, queue: [] }, membership: 'member' },
			},
		],
	},
	'Community/CritiqueCircle/Session': {
		component: CritiqueCircleSession,
		scenarios: [
			{
				name: 'no-active-session',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: mockCritiqueCircle },
			},
		],
	},
	'Community/CritiqueCircle/Members': {
		component: CritiqueCircleMembers,
		scenarios: [
			{
				name: 'default-viewer',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: { circle: mockCritiqueCircle },
			},
			{
				name: 'admin-actions',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: {
					circle: {
						...mockCritiqueCircle,
						members: [
							{ artist: { id: 'm1', displayName: 'Mod' }, role: 'moderator' },
							{ artist: { id: 'u1', displayName: 'User' }, role: 'member' },
						],
					},
					membership: 'admin',
				},
				action: async () => {
					// Invite toggle
					const inviteBtn = screen.getByText('Invite');
					await fireEvent.click(inviteBtn);

					// Type ID
					const input = screen.getByPlaceholderText('Artist username or ID...');
					await fireEvent.input(input, { target: { value: 'newartist' } });

					// Submit
					const submit = screen.getByText('Send Invite');
					await fireEvent.click(submit);

					// Change role
					const selects = screen.getAllByRole('combobox');
					if (selects[0]) {
						await fireEvent.change(selects[0], { target: { value: 'moderator' } });
					}
				},
			},
			{
				name: 'cancel-invite',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: {
					membership: 'admin',
					circle: { ...mockCritiqueCircle, coverImage: 'cover.jpg' },
				},
				action: async () => {
					const inviteBtn = screen.getByText('Invite');
					await fireEvent.click(inviteBtn);
					const cancelBtn = screen.getByText('Cancel');
					await fireEvent.click(cancelBtn);
				},
			},
		],
	},

	// Community Mentor Match
	'Community/MentorMatch': {
		component: MentorMatch,
		scenarios: [
			{
				name: 'find-mentor',
				props: {
					mode: 'find-mentor',
					matches: [
						{
							mentor: {
								id: 'm1',
								name: 'Mentor 1',
								username: 'mentor1',
								isVerified: true,
								avatar: 'mentor.jpg',
							},
							matchScore: 95,
							matchingCriteria: ['style', 'level'],
							availability: { oneOnOne: true, hoursPerWeek: 5 },
							rates: { hourlyRate: 50, currency: 'USD' },
							reviews: [{ rating: 5, comment: 'Great' }],
						},
					],
					handlers: { onSearch: vi.fn(), onRequestMentorship: vi.fn() },
				},
			},
			{
				name: 'empty',
				props: {
					mode: 'find-mentor',
					matches: [],
					handlers: { onSearch: vi.fn() },
				},
			},
		],
	},

	// Creative Tools - Critique Mode
	'CreativeTools/CritiqueMode/Annotations': {
		component: CritiqueModeAnnotations,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: CritiqueModeRoot,
				wrapperProps: {
					artwork: mockArtwork,
					initialAnnotations: mockAnnotations,
					enableAnnotations: true,
				},
				action: async () => {
					// Click marker
					const marker = screen.getAllByRole('button')[0];
					if (marker) await fireEvent.click(marker);
				},
			},
		],
	},
	'CreativeTools/CritiqueMode/Image': {
		component: CritiqueModeImage,
		scenarios: [
			{
				name: 'default',
				props: { class: 'test-class' },
				Wrapper: CritiqueModeRoot,
				wrapperProps: {
					artwork: mockArtwork,
					config: { enableAnnotations: true },
				},
				action: async () => {
					// Zoom in/out via buttons
					const zoomIn = screen.getByLabelText('Zoom in');
					await fireEvent.click(zoomIn);
					const zoomOut = screen.getByLabelText('Zoom out');
					await fireEvent.click(zoomOut);
					const reset = screen.getByLabelText('Reset zoom');
					await fireEvent.click(reset);

					// Key controls
					const container = screen.getByRole('application');
					await fireEvent.keyDown(container, { key: '+' });
					await fireEvent.keyDown(container, { key: '-' });
					await fireEvent.keyDown(container, { key: '0' }); // Reset
					await fireEvent.keyDown(container, { key: 'ArrowRight' });
					await fireEvent.keyDown(container, { key: 'ArrowLeft' });
					await fireEvent.keyDown(container, { key: 'ArrowUp' });
					await fireEvent.keyDown(container, { key: 'ArrowDown' });

					// Click to annotate
					await fireEvent.click(container, { clientX: 100, clientY: 100 });

					// Wheel zoom
					await fireEvent.wheel(container, { deltaY: -100 }); // Zoom in
					await fireEvent.wheel(container, { deltaY: 100 }); // Zoom out
				},
			},
			{
				name: 'panning',
				props: {},
				Wrapper: CritiqueModeRoot,
				wrapperProps: { artwork: mockArtwork },
				action: async () => {
					const container = screen.getByRole('application');

					// Pan
					await fireEvent.mouseDown(container, { button: 0, clientX: 100, clientY: 100 });
					await fireEvent.mouseMove(container, { clientX: 200, clientY: 200 });
					await fireEvent.mouseUp(container);
					await fireEvent.mouseLeave(container); // Should also stop dragging
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
					update: undefined, // use context
					showReactions: true,
				},
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
				action: async () => {
					const likeBtn = screen.getByLabelText('Like this update');
					await fireEvent.click(likeBtn);
				},
			},
			{
				name: 'no-media-no-reactions',
				props: {
					update: {
						id: 'v2',
						title: 'Version 2',
						description: 'No media',
						content: 'Just text',
						createdAt: new Date().toISOString(),
						progress: 75,
						stats: { likes: 0, comments: 0 },
						media: [],
					},
					showReactions: false,
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
				props: { direction: 'horizontal' },
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
				action: async () => {
					const items = screen.getAllByRole('option');
					if (items[1]) {
						await fireEvent.click(items[1]);
					}
				},
			},
			{
				name: 'keyboard-nav',
				props: { direction: 'vertical' },
				Wrapper: WIPRoot,
				wrapperProps: { thread: mockWIPThread },
				action: async () => {
					const items = screen.getAllByRole('option');
					if (items[0]) {
						await fireEvent.keyDown(items[0], { key: 'Enter' });
						await fireEvent.keyDown(items[0], { key: ' ' });
					}
				},
			},
			{
				name: 'no-media-updates',
				props: {},
				Wrapper: WIPRoot,
				wrapperProps: {
					thread: {
						...mockWIPThread,
						updates: [
							{
								id: 'u3',
								content: 'No media',
								createdAt: new Date().toISOString(),
								media: [],
							},
						],
					},
				},
			},
		],
	},
	'CreativeTools/WorkInProgress/Compare': {
		component: WIPCompare,
		scenarios: [
			{
				name: 'compare-active',
				props: {},
				Wrapper: WIPTestWrapper,
				wrapperProps: {
					thread: mockWIPThread,
					initialState: {
						comparison: {
							isActive: true,
							mode: 'side-by-side',
							versionA: 0,
							versionB: 1,
							sliderPosition: 50,
							overlayOpacity: 0.5,
						},
					},
				},
				action: async () => {
					// Switch modes
					const sliderBtn = screen.getByText('Slider');
					await fireEvent.click(sliderBtn);
					const overlayBtn = screen.getByText('Overlay');
					await fireEvent.click(overlayBtn);

					// Slider input
					const sliders = screen.getAllByRole('slider'); // ranges are role=slider
					if (sliders[0]) {
						await fireEvent.input(sliders[0], { target: { value: '75' } });
					}
				},
			},
		],
	},
	'CreativeTools/WorkInProgress/Comments': {
		component: WIPComments,
		scenarios: [
			{
				name: 'default',
				props: {
					comments: [
						{
							id: 'c1',
							authorId: 'u1',
							authorName: 'User',
							content: 'Great work!',
							createdAt: new Date().toISOString(),
							replies: [
								{
									id: 'r1',
									authorId: 'a1',
									authorName: 'Artist',
									content: 'Thanks!',
									createdAt: new Date().toISOString(),
								},
							],
						},
					],
				},
				Wrapper: WIPRoot,
				wrapperProps: {
					thread: mockWIPThread,
					config: { showComments: true },
				},
				action: async () => {
					// Reply
					const replyBtns = screen.getAllByText('Reply');
					if (replyBtns[0]) await fireEvent.click(replyBtns[0]);
				},
			},
			{
				name: 'add-comment',
				props: { comments: [] },
				Wrapper: WIPRoot,
				wrapperProps: {
					thread: mockWIPThread,
					config: { showComments: true },
				},
				action: async () => {
					const textarea = screen.getByPlaceholderText('Share your thoughts on this progress...');
					await fireEvent.input(textarea, { target: { value: 'New comment' } });
					const submitBtn = screen.getByText('Post Comment');
					await fireEvent.click(submitBtn);
				},
			},
		],
	},

	// Monetization
	'Monetization/DirectPurchase': {
		component: DirectPurchase,
		scenarios: [
			{
				name: 'original-available',
				props: {
					artwork: mockArtwork,
					pricing: mockPricing,
					onPurchase: vi.fn(),
					onInquiry: vi.fn(),
				},
			},
			{
				name: 'prints-selected',
				props: {
					artwork: mockArtwork,
					pricing: mockPricing,
					onPurchase: vi.fn(),
				},
				action: async () => {
					// Switch to prints
					const printsTab = screen.getByText('Prints');
					await fireEvent.click(printsTab);

					// Select print
					const radios = screen.getAllByRole('radio');
					if (radios[0]) await fireEvent.click(radios[0]);

					// Increase quantity
					const increaseBtn = screen.getByLabelText('Increase quantity');
					await fireEvent.click(increaseBtn);

					// Click purchase
					const purchaseBtn = screen.getByText('Purchase Now');
					await fireEvent.click(purchaseBtn);
				},
			},
			{
				name: 'licenses-selected',
				props: {
					artwork: mockArtwork,
					pricing: mockPricing,
					onPurchase: vi.fn(),
				},
				action: async () => {
					// Switch to licenses
					const licensesTab = screen.getByText('Licenses');
					await fireEvent.click(licensesTab);

					// Select license
					const radios = screen.getAllByRole('radio');
					if (radios[0]) await fireEvent.click(radios[0]);

					// Click purchase
					const purchaseBtn = screen.getByText('Purchase Now');
					await fireEvent.click(purchaseBtn);
				},
			},
			{
				name: 'original-sold',
				props: {
					artwork: mockArtwork,
					pricing: {
						original: { ...mockPricing.original, available: false },
					},
				},
			},
			{
				name: 'inquiry',
				props: {
					artwork: mockArtwork,
					pricing: {
						original: { ...mockPricing.original, inquiryOnly: true },
					},
					onInquiry: vi.fn(),
				},
				action: async () => {
					const inquireBtn = screen.getByText('Inquire About This Work');
					await fireEvent.click(inquireBtn);

					// Cancel first
					const cancelBtn = screen.getByText('Cancel');
					await fireEvent.click(cancelBtn);

					// Re-open
					await fireEvent.click(inquireBtn);

					const textarea = screen.getByPlaceholderText('Your message...');
					await fireEvent.input(textarea, { target: { value: 'Hello' } });
					const sendBtn = screen.getByText('Send Message');
					await fireEvent.click(sendBtn);
				},
			},
			{
				name: 'purchase-error',
				props: {
					artwork: mockArtwork,
					pricing: mockPricing,
					onPurchase: vi.fn().mockRejectedValue(new Error('Payment failed')),
				},
				action: async () => {
					const purchaseBtn = screen.getByText('Purchase Now');
					await fireEvent.click(purchaseBtn);
				},
			},
		],
	},
	'Monetization/ProtectionTools': {
		component: ProtectionTools,
		scenarios: [
			{
				name: 'default',
				props: {
					artwork: mockArtwork,
					onReport: vi.fn(),
					onWatermark: vi.fn(),
					onReverseSearch: vi.fn().mockResolvedValue([{ url: 'http://copy.com', matches: 1 }]),
					onDMCA: vi.fn(),
				},
				action: async () => {
					// Open Report
					const reportBtn = screen.getByText('Report Theft');
					await fireEvent.click(reportBtn);

					// Select different report type
					const radios = screen.getAllByRole('radio');
					if (radios[1]) await fireEvent.click(radios[1]); // Misattribution

					const desc = screen.getByLabelText('Description');
					await fireEvent.input(desc, { target: { value: 'My art stolen' } });
					await fireEvent.click(screen.getByText('Submit Report'));

					// Open Watermark
					const watermarkBtn = screen.getByText('Watermark');
					await fireEvent.click(watermarkBtn);

					// Switch to invisible
					const invisibleBtn = screen.getByText('Invisible');
					await fireEvent.click(invisibleBtn);

					await fireEvent.click(screen.getByText('Apply Watermark'));

					// Open Reverse Search
					const searchBtn = screen.getByText('Find Copies');
					await fireEvent.click(searchBtn);

					// File DMCA from search result
					const dmcaBtns = screen.getAllByText('File DMCA');
					if (dmcaBtns[0]) await fireEvent.click(dmcaBtns[0]);
				},
			},
			{
				name: 'dmca-direct',
				props: {
					artwork: mockArtwork,
					onDMCA: vi.fn(),
				},
				action: async () => {
					const dmcaBtn = screen.getByText('DMCA');
					await fireEvent.click(dmcaBtn);

					const startBtn = screen.getByText('Start DMCA Process');
					await fireEvent.click(startBtn); // Goes to report panel

					// Close panel via close button
					const closeBtn = screen.getByLabelText('Close');
					await fireEvent.click(closeBtn);
				},
			},
			{
				name: 'empty-search',
				props: {
					artwork: mockArtwork,
					onReverseSearch: vi.fn().mockResolvedValue([]),
				},
				action: async () => {
					const searchBtn = screen.getByText('Find Copies');
					await fireEvent.click(searchBtn);
				},
			},
			{
				name: 'attribution-copy',
				props: { artwork: mockArtwork },
				action: async () => {
					// Mock clipboard
					Object.assign(navigator, {
						clipboard: {
							writeText: vi.fn(),
						},
					});
					const copyBtn = screen.getByText('Copy');
					await fireEvent.click(copyBtn);
				},
			},
		],
	},
	'Monetization/PremiumBadge': {
		component: PremiumBadge,
		scenarios: [
			{
				name: 'free-tier',
				props: { tier: 'free' },
			},
			{
				name: 'pro-tier-tooltip',
				props: {
					tier: 'pro',
					features: ['Feature 1', { name: 'Feature 2' }],
					showFeaturesOnHover: true,
				},
				action: async () => {
					const badge = screen.getByRole('status');
					await fireEvent.mouseEnter(badge);
					// Tooltip logic might delay?
					await fireEvent.mouseLeave(badge);
				},
			},
			{
				name: 'upgrade-interaction',
				props: {
					tier: 'free',
					showUpgrade: true,
					onUpgrade: vi.fn(),
				},
				action: async () => {
					const badge = screen.getByRole('button');
					await fireEvent.click(badge);
					await fireEvent.keyDown(badge, { key: 'Enter' });
				},
			},
			{
				name: 'enterprise-max',
				props: {
					tier: 'enterprise',
					showUpgrade: true,
				},
			},
		],
	},
	'Monetization/TipJar': {
		component: TipJar,
		scenarios: [
			{
				name: 'default',
				props: {
					artist: mockArtist,
					options: {
						amounts: [5, 10, 20],
						currency: 'USD',
						allowCustom: true,
						messageEnabled: true,
					},
					onTip: vi.fn(),
				},
				action: async () => {
					// Select amount
					const chips = screen.getAllByRole('button'); // amount chips
					if (chips[0]) await fireEvent.click(chips[0]);

					// Add message
					const msg = screen.getByPlaceholderText('Say something nice...');
					await fireEvent.input(msg, { target: { value: 'Great work!' } });

					// Submit
					const submit = screen.getByText(/Send \$/);
					await fireEvent.click(submit);
				},
			},
			{
				name: 'custom-amount',
				props: {
					artist: mockArtist,
					options: {
						amounts: [5, 10, 20],
						currency: 'USD',
						allowCustom: true,
						messageEnabled: true,
					},
					onTip: vi.fn(),
				},
				action: async () => {
					// Enter custom amount
					const input = screen.getByRole('spinbutton');
					await fireEvent.input(input, { target: { value: '15' } });

					// Submit
					const submit = screen.getByText(/Send \$/);
					await fireEvent.click(submit);
				},
			},
			{
				name: 'anonymous-tip',
				props: {
					artist: mockArtist,
					config: { allowAnonymous: true },
				},
				action: async () => {
					// Select amount
					const chips = screen.getAllByRole('button');
					if (chips[0]) await fireEvent.click(chips[0]);

					// Check anonymous
					const anon = screen.getByLabelText('Tip anonymously');
					await fireEvent.click(anon);

					// Submit
					const submit = screen.getByText(/Send \$/);
					await fireEvent.click(submit);
				},
			},
			{
				name: 'keyboard-submit',
				props: {
					artist: mockArtist,
					config: { allowCustomAmount: true },
				},
				action: async () => {
					const input = screen.getByRole('spinbutton');
					await fireEvent.input(input, { target: { value: '50' } });
					await fireEvent.keyDown(input, { key: 'Enter' });
				},
			},
			{
				name: 'recent-tips',
				props: {
					artist: mockArtist,
					config: { showRecentTips: true },
					recentTips: [
						{
							amount: 5,
							currency: 'USD',
							tipperName: 'Fan',
							isAnonymous: false,
							createdAt: new Date().toISOString(),
						},
						{
							amount: 10,
							currency: 'USD',
							isAnonymous: true,
							createdAt: new Date(Date.now() - 3600000).toISOString(),
						},
					],
				},
			},
			{
				name: 'error-state',
				props: {
					artist: mockArtist,
					handlers: {
						onTip: vi.fn().mockRejectedValue(new Error('Payment failed')),
					},
				},
				action: async () => {
					const chips = screen.getAllByRole('button');
					if (chips[0]) await fireEvent.click(chips[0]);
					const submit = screen.getByText(/Send \$/);
					await fireEvent.click(submit);
				},
			},
		],
	},

	// Transparency
	'Transparency/AIDisclosure': {
		component: AIDisclosure,
		scenarios: [
			{
				name: 'badge',
				props: { usage: mockAIUsage, variant: 'badge' },
				action: async () => {
					const btn = screen.getByLabelText(/AI-assisted artwork/);
					await fireEvent.click(btn);
				},
			},
			{
				name: 'detailed',
				props: { usage: mockAIUsage, variant: 'detailed' },
			},
			{
				name: 'inline',
				props: { usage: mockAIUsage, variant: 'inline' },
			},
		],
	},
	'Transparency/AIOptOutControls': {
		component: AIOptOutControls,
		scenarios: [
			{
				name: 'default',
				props: {
					currentStatus: { discoveryAI: true, generativeAI: false, allAI: false },
					onUpdate: vi.fn(),
					showExplanations: true,
					requireConfirmation: true,
				},
				action: async () => {
					// Toggle generative
					const toggles = screen.getAllByRole('switch');
					if (toggles[1]) await fireEvent.click(toggles[1]);

					// Confirm
					const confirm = screen.getByText('Confirm');
					if (confirm) await fireEvent.click(confirm);
				},
			},
		],
	},
	'Transparency/EthicalSourcingBadge': {
		component: EthicalSourcingBadge,
		scenarios: [
			{
				name: 'verified',
				props: {
					verification: {
						id: '1',
						category: 'ai-ethics',
						level: 'third-party-verified',
						title: 'Ethical Training',
						verifiedAt: new Date().toISOString(),
						badgeUrl: 'badge.png',
						description: 'Description',
						documentation: ['http://doc.com'],
					},
					clickable: true,
				},
				action: async () => {
					const btn = screen.getByRole('button');
					await fireEvent.click(btn);
				},
			},
			{
				name: 'peer-verified',
				props: {
					verification: {
						id: '2',
						category: 'labor',
						level: 'peer-verified',
						title: 'Fair Labor',
						verifier: { name: 'Verifier', url: 'http://verifier.com' },
					},
					showVerifier: true,
				},
				action: async () => {
					const btn = screen.getByRole('button');
					await fireEvent.click(btn);
				},
			},
			{
				name: 'self-declared-expired',
				props: {
					verification: {
						id: '3',
						category: 'environmental',
						level: 'self-declared',
						title: 'Green',
						expiresAt: new Date(Date.now() - 86400000).toISOString(),
					},
					showExpiration: true,
				},
			},
			{
				name: 'custom-click',
				props: {
					verification: {
						id: '4',
						category: 'materials',
						level: 'third-party-verified',
						title: 'Materials',
					},
					onClick: vi.fn(),
				},
				action: async () => {
					const btn = screen.getByRole('button');
					await fireEvent.click(btn);
					await fireEvent.keyDown(btn, { key: 'Enter' });
				},
			},
		],
	},
	'Transparency/ProcessDocumentation': {
		component: ProcessDocumentation,
		scenarios: [
			{
				name: 'default',
				props: {
					steps: [
						{ id: '1', order: 1, type: 'human', title: 'Concept', description: 'Sketch' },
						{
							id: '2',
							order: 2,
							type: 'ai',
							title: 'Generation',
							description: 'Midjourney',
							aiTools: [{ name: 'Midjourney' }],
						},
					],
					showAIContribution: true,
					enableExport: true,
				},
			},
			{
				name: 'complex-steps',
				props: {
					steps: [
						{
							id: '1',
							order: 1,
							type: 'hybrid',
							title: 'Refinement',
							description: 'Editing',
							timestamp: '2023-01-01T12:00:00Z',
							duration: '2h',
							notes: 'Some notes',
							tools: ['Photoshop'],
							aiTools: [{ name: 'Stable Diffusion' }],
							media: [
								{ type: 'image', url: 'img.jpg', caption: 'Progress' },
								{ type: 'video', url: 'vid.mp4' }, // Should be ignored
							],
						},
						{
							id: '2',
							order: 2,
							type: 'human',
							title: 'Final Touch',
							description: 'Polishing',
							timestamp: new Date(),
						},
					],
					title: 'My Process',
					overview: 'An overview',
					totalTime: '5h',
					enableExport: true,
					onExport: vi.fn(),
				},
				action: async () => {
					const exportBtn = screen.getByText('Export Documentation');
					await fireEvent.click(exportBtn);
				},
			},
			{
				name: 'compact',
				props: {
					steps: [{ id: '1', order: 1, type: 'human', title: 'Step 1', description: 'Desc' }],
					compact: true,
					showAIContribution: false,
				},
			},
			{
				name: 'empty',
				props: { steps: [] },
			},
		],
	},

	// Exhibition
	'Exhibition/Root': {
		component: ExhibitionRootTestWrapper,
		scenarios: [
			{
				name: 'navigation-narrative',
				props: {
					exhibition: {
						...mockExhibition,
						layout: 'narrative',
						artworks: [mockArtwork, { ...mockArtwork, id: '2' }, { ...mockArtwork, id: '3' }],
					},
					layout: 'narrative',
				},
				action: async () => {
					// Keyboard navigation
					await fireEvent.keyDown(window, { key: 'ArrowRight' });
					await fireEvent.keyDown(window, { key: 'ArrowDown' });
					await fireEvent.keyDown(window, { key: 'ArrowLeft' });
					await fireEvent.keyDown(window, { key: 'End' });
					await fireEvent.keyDown(window, { key: 'Home' });
				},
			},
		],
	},
	'Exhibition/Gallery': {
		component: ExhibitionGallery,
		scenarios: [
			{
				name: 'gallery-grid',
				props: { layout: 'gallery', columns: 3, showCaptions: true },
				Wrapper: ExhibitionRoot,
				wrapperProps: { exhibition: { ...mockExhibition, layout: 'gallery' }, layout: 'gallery' },
				action: async () => {
					// Click artwork
					const items = screen.getAllByRole('button');
					if (items[0]) await fireEvent.click(items[0]);
				},
			},
			{
				name: 'narrative',
				props: { layout: 'narrative' },
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						layout: 'narrative',
						artworks: [
							{
								...mockArtwork,
								id: 'n1',
								description: 'Detailed description',
								metadata: {
									medium: 'Oil',
									dimensions: '10x10',
									year: '2023',
								},
							},
							{
								...mockArtwork,
								id: 'n2',
								description: undefined, // test missing description branch
								metadata: undefined, // test missing metadata branch
							},
						],
					},
					layout: 'narrative',
				},
			},
			{
				name: 'timeline',
				props: { layout: 'timeline' },
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						layout: 'timeline',
						artworks: [
							{ ...mockArtwork, id: 't1', createdAt: '2023-01-01T00:00:00Z', title: '2023 Art' },
							{ ...mockArtwork, id: 't2', createdAt: '2022-01-01T00:00:00Z', title: '2022 Art' },
						],
					},
					layout: 'timeline',
				},
				action: async () => {
					const items = screen.getAllByRole('button'); // timeline items are buttons
					if (items[0]) await fireEvent.click(items[0]);
				},
			},
		],
	},
	'Exhibition/Artists': {
		component: ExhibitionArtists,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						artists: [mockArtist, { ...mockArtist, id: 'a2', displayName: 'Another Artist' }],
					},
				},
				action: async () => {
					const artistLinks = screen.getAllByRole('link');
					if (artistLinks[0]) {
						await fireEvent.click(artistLinks[0]);
					}
				},
			},
		],
	},
	'Exhibition/Statement': {
		component: ExhibitionStatement,
		scenarios: [
			{
				name: 'default',
				props: {},
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						curatorStatement: 'This is the exhibition statement.',
						curator: {
							name: 'Curator Name',
							avatar: 'curator.jpg',
							institution: 'Art Museum',
						},
					},
				},
			},
			{
				name: 'long-statement',
				props: {},
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						curatorStatement:
							'This is a very long statement that should trigger any read more functionality if implemented. '.repeat(
								20
							),
						curator: {
							name: 'Curator Name',
							avatar: 'curator.jpg',
							institution: 'Art Museum',
						},
					},
				},
				action: async () => {
					const readMore = screen.queryByText('Read more');
					if (readMore) await fireEvent.click(readMore);
				},
			},
		],
	},

	// Gallery
	'Gallery/Grid': {
		component: GalleryGrid,
		scenarios: [
			{
				name: 'default',
				props: {
					items: [mockArtwork, { ...mockArtwork, id: 'a2' }, { ...mockArtwork, id: 'a3' }],
					columns: 3,
					gap: 'md',
					onItemClick: vi.fn(),
					onLoadMore: vi.fn(),
				},
				action: async () => {
					// Click item
					const items = screen.getAllByRole('button');
					if (items[0]) await fireEvent.click(items[0]);
				},
			},
			{
				name: 'virtual-scrolling',
				props: {
					items: Array.from({ length: 20 }, (_, i) => ({ ...mockArtwork, id: `v${i}` })),
					virtualScrolling: true,
					columns: 2,
				},
				action: async () => {
					// Scroll
					const container = screen.getByRole('region');
					await fireEvent.scroll(container, { target: { scrollTop: 100 } });
				},
			},
			{
				name: 'clustering-artist',
				props: {
					items: [
						{ ...mockArtwork, artist: { id: 'a1', name: 'A1' } },
						{ ...mockArtwork, id: 'a2', artist: { id: 'a1', name: 'A1' } },
						{ ...mockArtwork, id: 'a3', artist: { id: 'a2', name: 'A2' } },
					],
					clustering: 'artist',
				},
			},
			{
				name: 'keyboard-nav',
				props: {
					items: [mockArtwork, { ...mockArtwork, id: 'a2' }],
					columns: 2,
				},
				action: async () => {
					const container = screen.getByRole('region');

					// Focus item 0
					const items = screen.getAllByRole('button');
					if (items[0]) {
						items[0].focus();
						await fireEvent.focus(items[0]);
					}

					// Navigate
					await fireEvent.keyDown(container, { key: 'ArrowRight' });
					await fireEvent.keyDown(container, { key: 'ArrowLeft' });
					await fireEvent.keyDown(container, { key: 'ArrowDown' });
					await fireEvent.keyDown(container, { key: 'ArrowUp' });
					await fireEvent.keyDown(container, { key: 'Enter' });
				},
			},
		],
	},

	// Media Viewer
	'MediaViewer/Root': {
		component: MediaViewerRoot,
		scenarios: [
			{
				name: 'default',
				props: {
					artworks: [mockArtwork, { ...mockArtwork, id: 'art2' }],
					currentIndex: 0,
					config: { enableZoom: true, background: 'black' },
					handlers: { onClose: vi.fn(), onNavigate: vi.fn(), onZoom: vi.fn() },
				},
				action: async () => {
					// Navigation keys
					await fireEvent.keyDown(window, { key: 'ArrowRight' });
					await fireEvent.keyDown(window, { key: 'ArrowLeft' });

					// Zoom keys
					await fireEvent.keyDown(window, { key: '+' });
					await fireEvent.keyDown(window, { key: '-' });
					await fireEvent.keyDown(window, { key: '0' });

					// Close
					const closeBtn = screen.getByLabelText('Close viewer');
					await fireEvent.click(closeBtn);
				},
			},
			{
				name: 'touch-swipe',
				props: {
					artworks: [mockArtwork, { ...mockArtwork, id: 'art2' }],
					currentIndex: 0,
					config: { enableZoom: true },
					handlers: { onNavigate: vi.fn() },
				},
				action: async () => {
					const container = screen.getByRole('dialog');
					// Simulate swipe left
					await fireEvent.touchStart(container, { touches: [{ clientX: 300, clientY: 100 }] });
					await fireEvent.touchEnd(container, { changedTouches: [{ clientX: 100, clientY: 100 }] });
				},
			},
		],
	},

	// Curation
	'Curation/CollectionCard': {
		component: CollectionCard,
		scenarios: [
			{
				name: 'default',
				props: {
					collection: mockCollection,
					onSave: vi.fn(),
					onClick: vi.fn(),
				},
			},
			{
				name: 'collaborative',
				props: {
					collection: mockCollection,
					collaborative: true,
					preview: 3,
				},
			},
			{
				name: 'large-variant',
				props: {
					collection: mockCollection,
					variant: 'large',
					isSaved: true,
					onSave: vi.fn(),
				},
				action: async () => {
					// Toggle save
					const saveBtn = screen.getByLabelText('Unsave collection');
					await fireEvent.click(saveBtn);
				},
			},
			{
				name: 'empty',
				props: {
					collection: { ...mockCollection, artworks: [], artworkCount: 0 },
				},
			},
		],
	},
	'Gallery/Row': {
		component: GalleryRow,
		scenarios: [
			{
				name: 'default',
				props: {
					items: [
						mockArtwork,
						{ ...mockArtwork, id: 'a2' },
						{ ...mockArtwork, id: 'a3' },
						{ ...mockArtwork, id: 'a4' },
						{ ...mockArtwork, id: 'a5' },
					],
					title: 'Featured',
					showAllLink: '/gallery',
					cardSize: 'md',
					onItemClick: vi.fn(),
				},
				action: async () => {
					// Scroll right
					const rightBtn = screen.queryByLabelText('Scroll right');
					if (rightBtn) await fireEvent.click(rightBtn);

					// Scroll left
					const leftBtn = screen.queryByLabelText('Scroll left');
					if (leftBtn) await fireEvent.click(leftBtn);

					// Key nav
					const regions = screen.getAllByRole('region');
					// The one with artworks is likely the scroll container
					const container =
						regions.find((r) => r.getAttribute('aria-label')?.includes('artworks')) || regions[0];
					if (container) {
						await fireEvent.keyDown(container, { key: 'ArrowRight' });
						await fireEvent.keyDown(container, { key: 'ArrowLeft' });
					}
				},
			},
			{
				name: 'mobile-view',
				props: {
					items: [mockArtwork, { ...mockArtwork, id: 'a2' }],
					cardSize: 'sm',
				},
			},
		],
	},
	'Curation/CuratorSpotlight': {
		component: CuratorSpotlight,
		scenarios: [
			{
				name: 'default',
				props: {
					curator: mockCurator,
					collection: [
						mockArtwork,
						{ ...mockArtwork, id: 'a2' },
						{ ...mockArtwork, id: 'a3' },
						{ ...mockArtwork, id: 'a4' },
					],
					onFollow: vi.fn(),
					onCuratorClick: vi.fn(),
					onArtworkClick: vi.fn(),
				},
				action: async () => {
					// Follow
					const followBtn = screen.getByText('Follow');
					await fireEvent.click(followBtn);

					// Click curator
					const curatorBtn = screen.getByRole('button', { name: /Jane Doe/ });
					await fireEvent.click(curatorBtn);
				},
			},
			{
				name: 'featured',
				props: {
					curator: mockCurator,
					collection: [mockArtwork],
					variant: 'featured',
					statement: 'Art is life',
					isFollowing: true,
					onFollow: vi.fn(),
				},
				action: async () => {
					// Unfollow
					const followBtn = screen.getByText('Following');
					await fireEvent.click(followBtn);
				},
			},
			{
				name: 'compact',
				props: {
					curator: mockCurator,
					collection: [mockArtwork],
					variant: 'compact',
				},
			},
		],
	},
	'CreativeTools/CommissionWorkflow/Root': {
		component: CommissionWorkflowTestWrapper,
		scenarios: [
			{
				name: 'inquiry-client',
				props: {
					commission: { ...mockCommission, status: 'inquiry' },
				},
			},
			{
				name: 'quoted-artist',
				props: {
					commission: { ...mockCommission, status: 'quoted', quoteAmount: 500 },
					role: 'artist',
				},
			},
			{
				name: 'in-progress',
				props: {
					commission: { ...mockCommission, status: 'in-progress' },
					role: 'artist',
				},
			},
			{
				name: 'completed',
				props: {
					commission: { ...mockCommission, status: 'completed' },
					role: 'client',
				},
			},
		],
	},
	'CreativeTools/CommissionWorkflow/Context': {
		component: CommissionInteractiveWrapper,
		scenarios: [
			{
				name: 'interactive',
				props: {
					commission: { ...mockCommission, status: 'inquiry' },
					role: 'artist',
				},
				action: async () => {
					// Check initial step
					// const step = screen.getByTestId('current-step');

					// Navigate
					const btn = screen.getByText('Go to Contract');
					await fireEvent.click(btn);
				},
			},
		],
	},
	'CreativeTools/WorkInProgress/context': {
		component: WIPContextConsumer,
		scenarios: [
			{
				name: 'navigation-and-comparison',
				props: {},
				Wrapper: WIPRoot,
				wrapperProps: {
					thread: {
						...mockWIPThread,
						updates: [
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							{ ...mockWIPThread.updates[0]!, createdAt: '2023-01-01T10:00:00Z' },
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							{ ...mockWIPThread.updates[1]!, createdAt: '2023-01-02T10:00:00Z' }, // 1 day diff
						],
					},
				},
				action: async () => {
					// Test navigation
					await fireEvent.click(screen.getByText('Prev'));
					await fireEvent.click(screen.getByText('Next'));
					await fireEvent.click(screen.getByText('Jump 0'));

					// Test comparison
					await fireEvent.click(screen.getByText('Toggle Compare'));
					await fireEvent.click(screen.getByText('Set Slider'));
					await fireEvent.click(screen.getByText('Set Overlay'));
				},
			},
		],
	},
	'Community/CritiqueCircle/context': {
		component: CritiqueCircleContextConsumer,
		scenarios: [
			{
				name: 'permissions-check',
				props: {},
				Wrapper: CritiqueCircleRoot,
				wrapperProps: {
					circle: mockCritiqueCircle,
					membership: 'admin',
				},
			},
		],
	},
	'Exhibition/context': {
		component: ExhibitionContextConsumer,
		scenarios: [
			{
				name: 'navigation-dates',
				props: {},
				Wrapper: ExhibitionRoot,
				wrapperProps: {
					exhibition: {
						...mockExhibition,
						startDate: '2023-01-01T00:00:00Z',
						endDate: '2023-02-01T00:00:00Z',
						artworks: [mockArtwork, { ...mockArtwork, id: 'a2' }],
					},
				},
				action: async () => {
					await fireEvent.click(screen.getByText('Next'));
					await fireEvent.click(screen.getByText('Prev'));
					await fireEvent.click(screen.getByText('Jump 1'));
				},
			},
		],
	},
};
