import type {
	ArtworkEntity as Artwork,
	ArtistProfileEntity as ArtistProfile,
	Collection,
	ArtistStats,
	ArtworkStats,
	MoodData,
	AIUsageData,
	PortfolioSectionEntity as PortfolioSection,
} from '@equaltoai/greater-components-artist';
import { base } from '$app/paths';

// Helper for relative time
const now = Date.now();
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

// Define component context types locally since they aren't exported
interface ComponentArtistData {
	id: string;
	displayName: string;
	username: string;
	profileUrl: string;
	avatar?: string;
	heroBanner?: string;
	statement?: string;
	badges: { type: string; tooltip: string; awardedAt?: string | Date }[];
	status: string;
	verified: boolean;
	commissionStatus: 'open' | 'closed' | 'waitlist';
	stats: {
		followers: number;
		following: number;
		works: number;
		exhibitions: number;
		collaborations: number;
		totalViews: number;
	};
	sections: PortfolioSection[];
	joinedAt: string | Date;
}

interface ComponentArtworkData {
	id: string;
	title: string;
	description?: string;
	imageUrl: string;
	thumbnailUrl: string;
	images: {
		thumbnail: string;
		preview: string;
		standard: string;
		full: string;
	};
	dimensions?: { width: number; height: number };
	artist: {
		id: string;
		name: string;
		username: string;
		avatar?: string;
		verified?: boolean;
	};
	metadata: {
		medium?: string;
		materials?: string[];
		year?: number;
		dimensions?: string;
		tags?: string[];
	};
	stats: {
		views: number;
		likes: number;
		collections: number;
		comments: number;
	};
	aiUsage?: {
		hasAI: boolean;
		tools?: string[];
		description?: string;
	};
	altText: string;
	createdAt: string | Date;
}

export const demoAccount = {
	id: 'acct-1',
	username: 'janeartist',
	displayName: 'Jane Artist',
	avatar: `${base}/images/artist/avatar.svg`,
	uri: 'https://equalto.social/users/janeartist',
};

export const demoStats: ArtistStats = {
	artworkCount: 45,
	followerCount: 1250,
	followingCount: 340,
	totalViews: 45000,
	totalLikes: 3200,
	exhibitionCount: 3,
};

// Public API / Federation Type
export const demoArtist: ArtistProfile = {
	id: 'artist-1',
	uri: 'https://equalto.social/artists/janeartist',
	account: demoAccount,
	statement: 'Digital artist exploring the intersection of nature and technology.',
	badges: [
		{ type: 'VERIFIED', label: 'Verified Artist', verifiedAt: minutesAgo(100000) },
		{ type: 'PRO', label: 'Top Seller', verifiedAt: minutesAgo(50000) },
	],
	sections: [],
	featuredArtwork: null,
	stats: demoStats,
	acceptingCommissions: true,
	commissionInfo: {
		status: 'ACCEPTED',
		priceRange: '$100 - $500',
		turnaround: '2 weeks',
		description: 'Open for custom digital illustrations.',
	},
};

// Component Data Type (for UI)
export const profileData: ComponentArtistData = {
	id: 'artist-1',
	displayName: 'Jane Artist',
	username: 'janeartist',
	profileUrl: `${base}/artist/profile`,
	avatar: `${base}/images/artist/avatar.svg`,
	heroBanner: `${base}/images/artist/artwork3.svg`,
	statement: 'Digital artist exploring the intersection of nature and technology.',
	badges: [
		{ type: 'verified', tooltip: 'Verified Artist', awardedAt: minutesAgo(100000) },
		{ type: 'curator', tooltip: 'Top Seller', awardedAt: minutesAgo(50000) },
	],
	status: 'online',
	verified: true,
	commissionStatus: 'open',
	stats: {
		followers: 1250,
		following: 340,
		works: 45,
		exhibitions: 3,
		collaborations: 12,
		totalViews: 45000,
	},
	sections: [],
	joinedAt: minutesAgo(500000),
};

const commonStats: ArtworkStats = {
	viewCount: 1250,
	likeCount: 89,
	collectCount: 12,
	commentCount: 7,
	shareCount: 45,
};

const commonMood: MoodData = {
	energy: 0.8,
	valence: 0.7,
	tags: ['calm', 'warm'],
};

const noAIUsage: AIUsageData = {
	used: false,
	type: 'NONE',
	description: null,
	tools: [],
};

// Public API / Federation Type
export const artworks: Artwork[] = [
	{
		id: '1',
		uri: 'https://equalto.social/artworks/1',
		url: 'https://equalto.social/artworks/1',
		title: 'Sunset Over Mountains',
		description: 'A serene view of the sun setting over the distant peaks.',
		content: 'A serene view of the sun setting over the distant peaks.',
		account: demoAccount,
		mediaAttachments: [
			{
				id: 'media-1',
				type: 'image',
				url: `${base}/images/artist/artwork1.svg`,
				previewUrl: `${base}/images/artist/artwork1.svg`,
				description: 'Sunset over mountains',
				blurhash: null,
				meta: null,
			},
		],
		metadata: {
			medium: 'Digital',
			dimensions: '4000x3000px',
			year: 2024,
			materials: ['Procreate'],
			style: ['Landscape', 'Digital'],
			colors: ['#FF5733', '#FFC300'],
			mood: commonMood,
			license: 'CC-BY-NC',
			noAI: true,
		},
		stats: commonStats,
		aiUsage: noAIUsage,
		createdAt: minutesAgo(120),
		updatedAt: null,
	},
];

// Component Data Type (for UI)
export const componentArtworks: ComponentArtworkData[] = [
	{
		id: '1',
		title: 'Sunset Over Mountains',
		description: 'A serene view of the sun setting over the distant peaks.',
		imageUrl: `${base}/images/artist/artwork1.svg`,
		thumbnailUrl: `${base}/images/artist/artwork1.svg`,
		images: {
			thumbnail: `${base}/images/artist/artwork1.svg`,
			preview: `${base}/images/artist/artwork1.svg`,
			standard: `${base}/images/artist/artwork1.svg`,
			full: `${base}/images/artist/artwork1.svg`,
		},
		dimensions: { width: 800, height: 600 },
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: `${base}/images/artist/avatar.svg`,
			verified: true,
		},
		metadata: {
			medium: 'Digital',
			materials: ['Procreate'],
			year: 2024,
			dimensions: '4000x3000px',
			tags: ['landscape', 'sunset'],
		},
		stats: {
			views: 1250,
			likes: 89,
			collections: 12,
			comments: 7,
		},
		aiUsage: {
			hasAI: false,
		},
		altText: 'Sunset over mountains illustration',
		createdAt: minutesAgo(120),
	},
	{
		id: '2',
		title: 'Forest Morning',
		description: 'Early morning light.',
		imageUrl: `${base}/images/artist/artwork2.svg`,
		thumbnailUrl: `${base}/images/artist/artwork2.svg`,
		images: {
			thumbnail: `${base}/images/artist/artwork2.svg`,
			preview: `${base}/images/artist/artwork2.svg`,
			standard: `${base}/images/artist/artwork2.svg`,
			full: `${base}/images/artist/artwork2.svg`,
		},
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: `${base}/images/artist/avatar.svg`,
			verified: true,
		},
		metadata: {
			medium: 'Digital',
			year: 2024,
			tags: ['forest', 'nature'],
		},
		stats: {
			views: 890,
			likes: 124,
			collections: 25,
			comments: 14,
		},
		aiUsage: { hasAI: false },
		altText: 'Forest morning illustration',
		createdAt: minutesAgo(300),
	},
	{
		id: '3',
		title: 'Ocean Waves',
		description: 'Power of the ocean.',
		imageUrl: `${base}/images/artist/artwork3.svg`,
		thumbnailUrl: `${base}/images/artist/artwork3.svg`,
		images: {
			thumbnail: `${base}/images/artist/artwork3.svg`,
			preview: `${base}/images/artist/artwork3.svg`,
			standard: `${base}/images/artist/artwork3.svg`,
			full: `${base}/images/artist/artwork3.svg`,
		},
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: `${base}/images/artist/avatar.svg`,
			verified: true,
		},
		metadata: {
			medium: 'Oil',
			year: 2023,
			tags: ['ocean', 'waves'],
		},
		stats: {
			views: 2100,
			likes: 340,
			collections: 45,
			comments: 28,
		},
		aiUsage: { hasAI: false },
		altText: 'Ocean waves illustration',
		createdAt: minutesAgo(1440),
	},
	{
		id: '4',
		title: 'Abstract Thoughts',
		description: 'Complexity of the mind.',
		imageUrl: `${base}/images/artist/artwork4.svg`,
		thumbnailUrl: `${base}/images/artist/artwork4.svg`,
		images: {
			thumbnail: `${base}/images/artist/artwork4.svg`,
			preview: `${base}/images/artist/artwork4.svg`,
			standard: `${base}/images/artist/artwork4.svg`,
			full: `${base}/images/artist/artwork4.svg`,
		},
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: `${base}/images/artist/avatar.svg`,
			verified: true,
		},
		metadata: {
			medium: 'Mixed Media',
			year: 2024,
			tags: ['abstract', 'purple'],
		},
		stats: {
			views: 1500,
			likes: 210,
			collections: 30,
			comments: 11,
		},
		aiUsage: {
			hasAI: true,
			description: 'AI background',
			tools: ['Midjourney'],
		},
		altText: 'Abstract purple illustration',
		createdAt: minutesAgo(2000),
	},
	{
		id: '5',
		title: 'Modern Composition',
		description: 'Geometry and color.',
		imageUrl: `${base}/images/artist/artwork5.svg`,
		thumbnailUrl: `${base}/images/artist/artwork5.svg`,
		images: {
			thumbnail: `${base}/images/artist/artwork5.svg`,
			preview: `${base}/images/artist/artwork5.svg`,
			standard: `${base}/images/artist/artwork5.svg`,
			full: `${base}/images/artist/artwork5.svg`,
		},
		artist: {
			id: 'artist-1',
			name: 'Jane Artist',
			username: 'janeartist',
			avatar: `${base}/images/artist/avatar.svg`,
			verified: true,
		},
		metadata: {
			medium: 'Vector',
			year: 2024,
			tags: ['geometric', 'modern'],
		},
		stats: {
			views: 3200,
			likes: 450,
			collections: 60,
			comments: 35,
		},
		aiUsage: { hasAI: false },
		altText: 'Geometric yellow composition',
		createdAt: minutesAgo(5000),
	},
];

interface TimelineItem {
	id: string;
	type: 'post' | 'artwork' | 'exhibition' | 'collaboration' | 'milestone';
	content: string;
	artwork?: ComponentArtworkData;
	createdAt: string | Date;
	engagement?: {
		likes: number;
		comments: number;
		shares: number;
	};
}

export const timelineItems: TimelineItem[] = [
	{
		id: 't1',
		type: 'artwork',
		content: 'Just finished this new piece! What do you think about the lighting?',
		artwork: componentArtworks[0],
		createdAt: minutesAgo(10),
		engagement: { likes: 45, comments: 12, shares: 5 },
	},
	{
		id: 't2',
		type: 'post',
		content: 'Working on a new series inspired by nature. Stay tuned!',
		createdAt: minutesAgo(120),
		engagement: { likes: 20, comments: 3, shares: 1 },
	},
];

export const collections: Collection[] = [
	{
		id: 'col-1',
		name: 'Nature Series',
		description: 'A collection of nature-inspired artworks.',
		artworks: artworks,
		owner: demoAccount,
		isPublic: true,
		createdAt: minutesAgo(10000),
	},
];
