import type { CollectionData } from '../../src/types/curation.js';
import { createMockArtworkList } from './mockArtwork.js';

export function createMockCollection(
	id: string,
	overrides: Partial<CollectionData> = {}
): CollectionData {
	return {
		id,
		slug: `collection-${id}`,
		name: `Collection ${id}`,
		description: `Description for collection ${id}`,
		ownerId: 'user-1',
		ownerName: 'User One',
		ownerAvatar: 'https://example.com/avatar.jpg',
		artworks: createMockArtworkList(5),
		artworkCount: 5,
		visibility: 'public',
		createdAt: new Date().toISOString(),
		...overrides,
	};
}
