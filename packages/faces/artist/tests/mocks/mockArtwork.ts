/**
 * Mock Artwork Data
 *
 * Factory functions for generating sample artwork data for tests.
 * Follows patterns from packages/faces/social/tests mock factories.
 */

import type { ArtworkData } from '../../src/components/Artwork/context.js';

/**
 * Creates a mock artwork with default values
 */
export function createMockArtwork(id: string, overrides: Partial<ArtworkData> = {}): any {
	return {
		id,
		slug: `artwork-${id}`, // Combined type requirement
		title: `Artwork ${id}`,
		description: `Description for artwork ${id}`,
		imageUrl: `https://example.com/artworks/${id}/standard.jpg`, // Combined type requirement
		images: {
			thumbnail: `https://example.com/artworks/${id}/thumb.jpg`,
			preview: `https://example.com/artworks/${id}/preview.jpg`,
			standard: `https://example.com/artworks/${id}/standard.jpg`,
			full: `https://example.com/artworks/${id}/full.jpg`,
		},
		dimensions: {
			width: 1920,
			height: 1080,
		},
		// Component Context expected structure
		artist: {
			id: `artist-${id}`,
			name: `Artist ${id}`,
			username: `artist${id}`,
			avatar: `https://example.com/avatars/artist${id}.jpg`,
			verified: false,
		},
		// Store/Type expected structure
		artistId: `artist-${id}`,
		artistName: `Artist ${id}`,
		artistAvatar: `https://example.com/avatars/artist${id}.jpg`,
		
		metadata: {
			medium: 'Digital',
			materials: ['Procreate', 'iPad Pro'],
			year: 2024,
			dimensions: '1920x1080px',
			tags: ['digital', 'illustration'],
		},
		stats: {
			views: 100,
			likes: 25,
			collections: 5,
			comments: 10,
		},
		// Flattened stats for Type expected structure
		viewCount: 100,
		likeCount: 25,
		commentCount: 10,
		
		aiUsage: {
			hasAI: false,
		},
		altText: `Artwork titled ${overrides.title || `Artwork ${id}`}`,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		
		isPublished: true, // Type requirement
		isFeatured: false,
		tags: ['digital', 'illustration'],
		
		...overrides,
	} as unknown as ArtworkData; // Force cast to satisfy the specific import in this file, though consumers might cast it differently
}

/**
 * Creates a mock artwork with AI usage disclosure
 */
export function createMockArtworkWithAI(
	id: string,
	overrides: Partial<ArtworkData> = {}
): ArtworkData {
	return createMockArtwork(id, {
		aiUsage: {
			hasAI: true,
			tools: ['Midjourney', 'Photoshop AI'],
			percentage: 30,
			description: 'AI used for initial concept generation',
		},
		...overrides,
	});
}

/**
 * Creates a list of mock artworks
 */
export function createMockArtworkList(count: number, startId = 1): any[] {
	return Array.from({ length: count }, (_, i) => createMockArtwork(`artwork-${startId + i}`));
}

/**
 * Creates a mock artwork with specific aspect ratio
 */
export function createMockArtworkWithAspectRatio(
	id: string,
	aspectRatio: '1:1' | '4:3' | '16:9' | '3:4' | '9:16'
): ArtworkData {
	const dimensions: Record<string, { width: number; height: number }> = {
		'1:1': { width: 1000, height: 1000 },
		'4:3': { width: 1200, height: 900 },
		'16:9': { width: 1920, height: 1080 },
		'3:4': { width: 900, height: 1200 },
		'9:16': { width: 1080, height: 1920 },
	};

	return createMockArtwork(id, {
		dimensions: dimensions[aspectRatio],
	});
}
