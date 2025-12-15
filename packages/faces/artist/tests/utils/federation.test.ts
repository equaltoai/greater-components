import { describe, it, expect } from 'vitest';
import {
	toActivityPubNote,
	fromActivityPubNote,
	generateArtworkUri,
	parseArtworkUri,
	serializeMetadata,
	parseMetadata,
	serializeLicense,
	toActivityPubCollection,
	ActivityPubNote,
} from '../../src/utils/federation';

// Mock types locally to avoid dependency issues during test setup if types are complex
const mockDate = new Date().toISOString();

const mockArtwork = {
	uri: 'https://instance.com/users/alice/artworks/123',
	url: 'https://instance.com/users/alice/artworks/123',
	title: 'Test Artwork',
	description: 'A test description',
	content: 'Full content',
	createdAt: mockDate,
	updatedAt: mockDate,
	account: {
		username: 'alice',
		displayName: 'Alice',
		id: 'alice-id',
		avatar: '',
	},
	mediaAttachments: [
		{
			id: 'media1',
			type: 'image',
			url: 'https://instance.com/media/1.jpg',
			previewUrl: 'https://instance.com/media/1_thumb.jpg',
			description: 'Alt text',
			blurhash: 'LEHV6n9F',
			meta: {
				original: { width: 800, height: 600 },
			},
		},
	],
	metadata: {
		medium: 'Oil on Canvas',
		year: 2023,
		dimensions: '10x10',
		style: ['Impressionism'],
		license: 'CC-BY',
		noAI: true,
	},
};

describe('federation Utils', () => {
	describe('toActivityPubNote', () => {
		it('converts artwork to Note', () => {
			// @ts-ignore - partial mock
			const note = toActivityPubNote(mockArtwork, 'https://instance.com');

			expect(note.type).toBe('Note');
			expect(note.id).toBe(mockArtwork.uri);
			expect(note.attributedTo).toBe('https://instance.com/users/alice');
			expect(note.content).toContain('Test Artwork');
			expect(note.attachment).toHaveLength(1);
			expect(note.attachment?.[0]?.type).toBe('Image');

			// Custom fields
			expect(note['artist:metadata']?.medium).toBe('Oil on Canvas');
			expect(note['artist:license']).toBe('CC-BY');
			expect(note['artist:noAI']).toBe(true);
		});
	});

	describe('fromActivityPubNote', () => {
		it('parses Note back to partial artwork', () => {
			const note: ActivityPubNote = {
				'@context': 'https://www.w3.org/ns/activitystreams',
				id: 'https://instance.com/note/1',
				type: 'Note',
				attributedTo: 'alice',
				content: '<p><strong>Title</strong></p><p>Description</p>',
				published: mockDate,
				attachment: [
					{
						type: 'Image',
						mediaType: 'image/jpeg',
						url: 'img.jpg',
						width: 100,
						height: 100,
					},
				],
				to: [],
				'artist:metadata': {
					medium: 'Digital',
					year: 2024,
				},
				'artist:license': 'CC0',
				'artist:noAI': false,
			};

			const artwork = fromActivityPubNote(note);

			expect(artwork?.title).toBe('Title');
			expect(artwork?.description).toBe('Title Description');
			expect(artwork?.mediaAttachments).toHaveLength(1);
			expect(artwork?.metadata?.medium).toBe('Digital');
			expect(artwork?.metadata?.license).toBe('CC0');
			expect(artwork?.metadata?.noAI).toBe(false);
		});

		it('handles graceful degradation (missing metadata)', () => {
			const note: ActivityPubNote = {
				'@context': 'https://www.w3.org/ns/activitystreams',
				id: 'id',
				type: 'Note',
				attributedTo: 'user',
				content: 'Just content',
				published: mockDate,
				attachment: [],
				to: [],
			};

			const artwork = fromActivityPubNote(note);
			expect(artwork?.metadata).toBeDefined();
			expect(artwork?.metadata?.medium).toBeNull(); // Default
		});

		it('returns null on error', () => {
			// @ts-ignore - invalid input
			const result = fromActivityPubNote(null);
			expect(result).toBeNull();
		});
	});

	describe('URI Utilities', () => {
		it('generates artwork URI', () => {
			const uri = generateArtworkUri('https://inst.com', 'bob', '789');
			expect(uri).toBe('https://inst.com/users/bob/artworks/789');
		});

		it('parses valid artwork URI', () => {
			const parsed = parseArtworkUri('https://inst.com/users/bob/artworks/789');
			expect(parsed).toEqual({
				instanceUrl: 'https://inst.com',
				username: 'bob',
				artworkId: '789',
			});
		});

		it('returns null for invalid URI', () => {
			expect(parseArtworkUri('https://inst.com/other/path')).toBeNull();
			expect(parseArtworkUri('invalid-url')).toBeNull();
		});
	});

	describe('Metadata Serialization', () => {
		it('serializes partial metadata', () => {
			// @ts-ignore - Partial input
			const result = serializeMetadata({ medium: 'Paint' });
			expect(result.medium).toBe('Paint');
			expect(result.year).toBeUndefined();
		});

		it('parses partial extension', () => {
			const result = parseMetadata({ medium: 'Paint' });
			expect(result.medium).toBe('Paint');
			expect(result.materials).toEqual([]);
		});

		it('parses undefined extension', () => {
			const result = parseMetadata(undefined);
			expect(result.medium).toBeNull();
		});
	});

	describe('serializeLicense', () => {
		it('normalizes known licenses', () => {
			expect(serializeLicense('cc-by')).toBe('CC-BY-4.0');
			expect(serializeLicense('All Rights Reserved')).toBe('All Rights Reserved');
		});

		it('returns original if unknown', () => {
			expect(serializeLicense('Unknown License')).toBe('Unknown License');
		});

		it('returns undefined for null', () => {
			expect(serializeLicense(null)).toBeUndefined();
		});
	});

	describe('toActivityPubCollection', () => {
		it('creates ordered collection', () => {
			const col = toActivityPubCollection('col-id', ['item1', 'item2'], 2);
			expect(col.type).toBe('OrderedCollection');
			expect(col.totalItems).toBe(2);
			expect(col.items).toEqual(['item1', 'item2']);
		});
	});
});
