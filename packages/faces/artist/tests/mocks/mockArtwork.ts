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
export function createMockArtwork(id: string, overrides: Partial<ArtworkData> = {}): ArtworkData {
	const base: ArtworkData = {
		id,
		title: `Artwork ${id}`,
		description: `Description for artwork ${id}`,
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
		artist: {
			id: `artist-${id}`,
			name: `Artist ${id}`,
			username: `artist${id}`,
			avatar: `https://example.com/avatars/artist${id}.jpg`,
			verified: false,
		},
		metadata: {
			medium: 'Digital',
			materials: ['Procreate', 'iPad Pro'],
			year: 2024,
			dimensions: '1920x1080px',
			tags: ['digital', 'illustration'],
			style: ['Digital'],
		},
		stats: {
			views: 100,
			likes: 25,
			collections: 5,
			comments: 10,
		},
		aiUsage: {
			hasAI: false,
		},
		altText: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isFeatured: false,
	};

	const merged: ArtworkData = {
		...base,
		...overrides,
		images: { ...base.images, ...overrides.images },
		artist: { ...base.artist, ...overrides.artist },
		metadata: { ...base.metadata, ...overrides.metadata },
		stats: { ...base.stats, ...overrides.stats },
		aiUsage: overrides.aiUsage ? { ...base.aiUsage, ...overrides.aiUsage } : base.aiUsage,
	};

	return {
		...merged,
		altText: merged.altText || `Artwork titled ${merged.title}`,
	};
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
export const createMockArtworkList = (
	count: number,
	startId = 1,
	overrides: Partial<ArtworkData> = {}
): ArtworkData[] => {
	// Handle case where 2nd arg is overrides (legacy support if needed, or strictly enforce new signature?)
	// Given the test error passed 11 as 2nd arg, it expects startId.
	// If existing calls pass overrides as 2nd arg, they will break unless we check type.
	let actualStartId = startId;
	let actualOverrides = overrides;

	if (typeof startId === 'object') {
		actualOverrides = startId;
		actualStartId = 1;
	}

	return Array.from({ length: count }, (_, i) =>
		createMockArtwork(`artwork-${actualStartId + i}`, actualOverrides)
	);
};

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
